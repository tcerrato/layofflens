import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { fetchNewsItems, fetchVideoItems } from "../Shared/serper";
import { saveItem, FeedItem } from "../Shared/storage";
import { calculateScore } from "../Shared/scoring";

async function fetchAndSaveItems(): Promise<number> {
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
  let savedCount = 0;

  const newsItems = await fetchNewsItems();
  for (const news of newsItems) {
    const item: FeedItem = {
      partitionKey: dateStr,
      rowKey: Buffer.from(news.link).toString("base64").replace(/[/+=]/g, "").substring(0, 63),
      title: news.title,
      link: news.link,
      source: news.source || new URL(news.link).hostname,
      snippet: news.snippet,
      date: now.toISOString(),
      type: "news",
      tags: JSON.stringify(extractTags(news.title, news.snippet)),
      score: 0,
      imageUrl: news.imageUrl || news.thumbnailUrl || undefined,
    };
    item.score = calculateScore(item, now);
    await saveItem(item);
    savedCount++;
  }

  const videoItems = await fetchVideoItems();
  for (const video of videoItems) {
    const item: FeedItem = {
      partitionKey: dateStr,
      rowKey: Buffer.from(video.link).toString("base64").replace(/[/+=]/g, "").substring(0, 63),
      title: video.title,
      link: video.link,
      source: video.source || new URL(video.link).hostname,
      snippet: video.snippet,
      date: now.toISOString(),
      type: "video",
      tags: JSON.stringify(extractTags(video.title, video.snippet)),
      score: 0,
      imageUrl: video.imageUrl || video.thumbnailUrl || undefined,
    };
    item.score = calculateScore(item, now);
    await saveItem(item);
    savedCount++;
  }

  return savedCount;
}

function extractTags(title: string, snippet: string): string[] {
  const text = `${title} ${snippet}`.toLowerCase();
  const tags: string[] = [];

  if (text.includes("layoff") || text.includes("job cut")) tags.push("Layoffs");
  if (text.includes("ai") || text.includes("artificial intelligence")) tags.push("AI");
  if (text.includes("automation")) tags.push("Automation");
  if (text.includes("unemployment")) tags.push("Unemployment");
  if (text.includes("hiring freeze")) tags.push("Hiring Freeze");
  if (text.includes("resume") || text.includes("ats")) tags.push("Job Search");

  return tags;
}

export async function fetchNowHttp(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const token = request.query.get("token");
    const expectedToken = process.env.ADMIN_TOKEN || "change-me";

    if (token !== expectedToken) {
      return {
        status: 401,
        jsonBody: { error: "Unauthorized. Invalid token." },
      };
    }

    context.log("Starting manual fetch...");
    const savedCount = await fetchAndSaveItems();
    context.log(`Saved ${savedCount} items`);

    return {
      status: 200,
      jsonBody: {
        success: true,
        message: `Fetched and saved ${savedCount} items`,
        count: savedCount,
      },
    };
  } catch (error: any) {
    context.error("Error fetching items:", error);
    return {
      status: 500,
      jsonBody: { error: error.message || "Internal server error" },
    };
  }
}

app.http("FetchNowHttp", {
  methods: ["POST"],
  authLevel: "function",
  handler: fetchNowHttp,
});

