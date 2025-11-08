import { app, Timer, InvocationContext } from "@azure/functions";
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

export async function fetchDailyTimer(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  context.log("Timer trigger fired. Starting daily fetch...");
  try {
    const savedCount = await fetchAndSaveItems();
    context.log(`Daily fetch completed. Saved ${savedCount} items`);
  } catch (error: any) {
    context.error("Error in daily fetch:", error);
    throw error;
  }
}

app.timer("FetchDailyTimer", {
  schedule: "0 0 9 * * *",
  handler: fetchDailyTimer,
});

