const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7071";

export interface FeedItem {
  partitionKey: string;
  rowKey: string;
  title: string;
  link: string;
  source: string;
  snippet: string;
  date: string;
  type: "news" | "video";
  tags: string | string[]; // Can be string (JSON) from storage or parsed array
  score: number;
  imageUrl?: string; // Optional image URL from Serper
  // Layoff tracking fields
  companyName?: string; // Company mentioned in layoff news
  layoffCount?: number; // Number of employees laid off
  sector?: string; // Industry sector (Tech, Finance, Retail, etc.)
}

export interface PaginatedResponse {
  items: FeedItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  };
}

export interface LayoffStats {
  summary: {
    totalArticlesThisWeek: number;
    totalArticlesLastWeek: number;
    percentChange: number;
    topSector: string;
    todayCount: number;
  };
  byWeek: Array<{
    week: string;
    count: number;
    startDate: string;
    endDate: string;
  }>;
  bySector: Array<{
    sector: string;
    count: number;
    percentage: number;
  }>;
  topCompanies: Array<{
    company: string;
    count: number;
  }>;
}

export async function fetchItems(options?: { days?: number; limit?: number; page?: number; sector?: string }): Promise<FeedItem[] | PaginatedResponse> {
  try {
    const params = new URLSearchParams();
    if (options?.days) {
      params.set("days", options.days.toString());
    }
    if (options?.limit) {
      params.set("limit", options.limit.toString());
    }
    if (options?.page) {
      params.set("page", options.page.toString());
    }
    if (options?.sector) {
      params.set("sector", options.sector);
    }

    // API_BASE should already include /api, so we just append the function name
    const baseUrl = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;
    const url = `${baseUrl}/ListItemsHttp${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(`API returned ${response.status}: ${response.statusText}`);
      return options?.limit ? [] : { items: [], pagination: { currentPage: 1, totalPages: 1, pageSize: 50, totalItems: 0 } };
    }

    return response.json();
  } catch (error) {
    console.warn("Failed to fetch items from API:", error);
    return options?.limit ? [] : { items: [], pagination: { currentPage: 1, totalPages: 1, pageSize: 50, totalItems: 0 } };
  }
}

export async function fetchLayoffStats(days: number = 90): Promise<LayoffStats | null> {
  try {
    const baseUrl = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;
    const url = `${baseUrl}/GetLayoffStatsHttp?days=${days}`;
    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(`Analytics API returned ${response.status}: ${response.statusText}`);
      return null;
    }

    return response.json();
  } catch (error) {
    console.warn("Failed to fetch layoff stats from API:", error);
    return null;
  }
}

