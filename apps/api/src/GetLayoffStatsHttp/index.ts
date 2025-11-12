import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getItemsForDays } from "../Shared/storage";

interface WeeklyStats {
  week: string; // ISO week format: "2025-W45"
  count: number;
  startDate: string; // ISO date
  endDate: string; // ISO date
}

interface SectorStats {
  sector: string;
  count: number;
  percentage: number;
}

interface CompanyMention {
  company: string;
  count: number;
}

interface LayoffStatsResponse {
  summary: {
    totalArticlesThisWeek: number;
    totalArticlesLastWeek: number;
    percentChange: number;
    topSector: string;
    todayCount: number;
  };
  byWeek: WeeklyStats[];
  bySector: SectorStats[];
  topCompanies: CompanyMention[];
}

/**
 * Get ISO week number from date
 */
function getISOWeek(date: Date): string {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const jan4 = new Date(target.getFullYear(), 0, 4);
  const dayDiff = (target.getTime() - jan4.getTime()) / 86400000;
  const weekNum = 1 + Math.ceil(dayDiff / 7);
  return `${target.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
}

/**
 * Get start and end dates of an ISO week
 */
function getWeekDates(weekString: string): { startDate: string; endDate: string } {
  const [year, weekStr] = weekString.split('-W');
  const week = parseInt(weekStr, 10);

  const jan4 = new Date(parseInt(year), 0, 4);
  const dayOfWeek = (jan4.getDay() + 6) % 7; // Monday = 0
  const weekStart = new Date(jan4);
  weekStart.setDate(jan4.getDate() - dayOfWeek + (week - 1) * 7);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return {
    startDate: weekStart.toISOString().split('T')[0],
    endDate: weekEnd.toISOString().split('T')[0],
  };
}

export async function getLayoffStatsHttp(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    context.log("GetLayoffStatsHttp called");

    const daysParam = request.query.get("days");
    const days = daysParam ? parseInt(daysParam, 10) : 90; // Default to 90 days

    if (isNaN(days) || days < 1) {
      return {
        status: 400,
        jsonBody: { error: "Invalid days parameter. Must be a positive integer." },
      };
    }

    context.log(`Fetching items for ${days} days`);
    const items = await getItemsForDays(days);
    context.log(`Fetched ${items.length} items`);

    // Filter to only news items (exclude videos and non-layoff content)
    const newsItems = items.filter((item: any) => {
      const tags = typeof item.tags === 'string' ? JSON.parse(item.tags || '[]') : (item.tags || []);
      return item.type === 'news' && tags.includes('Layoffs');
    });

    context.log(`Filtered to ${newsItems.length} layoff news items`);

    // Calculate weekly stats
    const weeklyMap = new Map<string, number>();
    newsItems.forEach((item: any) => {
      const date = new Date(item.date);
      const week = getISOWeek(date);
      weeklyMap.set(week, (weeklyMap.get(week) || 0) + 1);
    });

    const byWeek: WeeklyStats[] = Array.from(weeklyMap.entries())
      .map(([week, count]) => ({
        week,
        count,
        ...getWeekDates(week),
      }))
      .sort((a, b) => a.week.localeCompare(b.week));

    // Calculate sector stats using AI-extracted sector field
    const sectorMap = new Map<string, number>();
    newsItems.forEach((item: any) => {
      // Use AI-extracted sector field if available
      if (item.sector && item.sector !== 'null' && item.sector !== 'undefined') {
        sectorMap.set(item.sector, (sectorMap.get(item.sector) || 0) + 1);
      }
    });

    const totalSectorMentions = Array.from(sectorMap.values()).reduce((sum, count) => sum + count, 0);
    const bySector: SectorStats[] = Array.from(sectorMap.entries())
      .map(([sector, count]) => ({
        sector,
        count,
        percentage: totalSectorMentions > 0 ? Math.round((count / totalSectorMentions) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Extract company mentions from titles
    const companyMap = new Map<string, number>();
    const commonCompanies = ['Amazon', 'Meta', 'Google', 'Microsoft', 'Apple', 'Tesla',
                            'Facebook', 'Twitter', 'Netflix', 'Uber', 'Lyft', 'Salesforce',
                            'Intel', 'AMD', 'Nvidia', 'IBM', 'Oracle', 'SAP', 'Dell', 'HP'];

    newsItems.forEach((item: any) => {
      const text = `${item.title} ${item.snippet}`.toLowerCase();
      commonCompanies.forEach((company) => {
        // Use word boundary regex to match whole words only (e.g., "Intel" but not "intelligence")
        const regex = new RegExp(`\\b${company.toLowerCase()}\\b`);
        if (regex.test(text)) {
          companyMap.set(company, (companyMap.get(company) || 0) + 1);
        }
      });
    });

    const topCompanies: CompanyMention[] = Array.from(companyMap.entries())
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate summary stats
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const todayCount = newsItems.filter((item: any) =>
      item.date.startsWith(todayStr)
    ).length;

    const currentWeek = getISOWeek(today);
    const lastWeek = getISOWeek(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000));

    const currentWeekCount = weeklyMap.get(currentWeek) || 0;
    const lastWeekCount = weeklyMap.get(lastWeek) || 0;
    const percentChange = lastWeekCount > 0
      ? Math.round(((currentWeekCount - lastWeekCount) / lastWeekCount) * 100)
      : 0;

    // Get top sector from sectors that have data (ignore nulls)
    const topSector = bySector.length > 0 ? bySector[0].sector : 'N/A';

    const response: LayoffStatsResponse = {
      summary: {
        totalArticlesThisWeek: currentWeekCount,
        totalArticlesLastWeek: lastWeekCount,
        percentChange,
        topSector,
        todayCount,
      },
      byWeek,
      bySector,
      topCompanies,
    };

    return {
      status: 200,
      jsonBody: response,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error: any) {
    const errorMessage = error?.message || String(error) || "Unknown error";
    const errorStack = error?.stack || "";
    context.error("Error getting layoff stats:", errorMessage, errorStack);
    return {
      status: 500,
      jsonBody: {
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? errorStack : undefined
      },
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
}

// OPTIONS handler for CORS preflight
async function getLayoffStatsHttpOptions(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  return {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  };
}

// Wrapper handler
async function getLayoffStatsHttpHandler(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    context.log("getLayoffStatsHttpHandler called, method:", req.method);
    if (req.method === "OPTIONS") {
      context.log("Handling OPTIONS request");
      return await getLayoffStatsHttpOptions(req, context);
    }
    context.log("Calling getLayoffStatsHttp function");
    const result = await getLayoffStatsHttp(req, context);
    context.log("getLayoffStatsHttp returned successfully");
    return result;
  } catch (handlerErr: any) {
    context.error("getLayoffStatsHttpHandler error:", handlerErr?.message || String(handlerErr));
    context.error("Handler error stack:", handlerErr?.stack || "");
    return {
      status: 500,
      jsonBody: {
        error: handlerErr?.message || "Handler error",
        stack: handlerErr?.stack
      },
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
}

// Function registration
app.http("GetLayoffStatsHttp", {
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous",
  handler: getLayoffStatsHttpHandler,
});
