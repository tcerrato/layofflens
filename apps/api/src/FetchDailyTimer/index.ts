import { app, Timer, InvocationContext } from "@azure/functions";
import { fetchNewsItems, fetchVideoItems } from "../Shared/serper";
import { saveItem, FeedItem, cleanupOldItems } from "../Shared/storage";
import { calculateScore } from "../Shared/scoring";
import { bestImageFor } from "../Shared/image-resolver";
import { isVideoPlatform } from "../Shared/thumb";
import { extractLayoffData } from "../Shared/layoff-extractor";

const IMAGE_LOOKUP_CAP = 8; // Limit Serper Images API calls per run to stay within free tier

async function fetchAndSaveItems(): Promise<number> {
  const now = new Date();
  let savedCount = 0;
  let imageLookups = 0;

  const newsItems = await fetchNewsItems();
  for (const news of newsItems) {
    // Extract layoff data using OpenAI
    const layoffData = await extractLayoffData(news.title, news.snippet);

    const item: FeedItem = {
      partitionKey: "news", // Use constant partition key to prevent duplicates
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
      // Add layoff tracking data
      companyName: layoffData.companyName,
      layoffCount: layoffData.layoffCount,
      sector: layoffData.sector,
    };
    
    // Enrich image if missing and we haven't hit the cap
    if (!item.imageUrl) {
      if (imageLookups < IMAGE_LOOKUP_CAP) {
        try {
          const enrichedImage = await bestImageFor({
            url: item.link,
            title: item.title,
            image: news.imageUrl,
            thumbnailUrl: news.thumbnailUrl,
            source: item.source,
          });
          // Only use if it's not a favicon (favicons are too small and blurry)
          if (enrichedImage && !enrichedImage.includes('favicons')) {
            item.imageUrl = enrichedImage;
            imageLookups++;
          }
        } catch (error) {
          // If lookup fails, leave imageUrl undefined (no blurry favicon)
        }
      }
      // If cap is reached or lookup failed, leave imageUrl undefined
      // Cards will display without image rather than blurry favicon
    }
    
    item.score = calculateScore(item, now);
    await saveItem(item);
    savedCount++;
  }

  const videoItems = await fetchVideoItems();
  for (const video of videoItems) {
    // Extract layoff data using OpenAI
    const layoffData = await extractLayoffData(video.title, video.snippet);

    // Classify as video if it's from any known video platform
    const isVideo = isVideoPlatform(video.link);
    const item: FeedItem = {
      partitionKey: "news", // Use constant partition key to prevent duplicates
      rowKey: Buffer.from(video.link).toString("base64").replace(/[/+=]/g, "").substring(0, 63),
      title: video.title,
      link: video.link,
      source: video.source || new URL(video.link).hostname,
      snippet: video.snippet,
      date: now.toISOString(),
      type: isVideo ? "video" : "news", // Classify as news if not from a video platform
      tags: JSON.stringify(extractTags(video.title, video.snippet)),
      score: 0,
      imageUrl: video.imageUrl || video.thumbnailUrl || undefined,
      // Add layoff tracking data
      companyName: layoffData.companyName,
      layoffCount: layoffData.layoffCount,
      sector: layoffData.sector,
    };
    
    // Enrich image if missing and we haven't hit the cap
    if (!item.imageUrl) {
      if (imageLookups < IMAGE_LOOKUP_CAP) {
        try {
          const enrichedImage = await bestImageFor({
            url: item.link,
            title: item.title,
            image: video.imageUrl,
            thumbnailUrl: video.thumbnailUrl,
            source: item.source,
          });
          // Only use if it's not a favicon (favicons are too small and blurry)
          if (enrichedImage && !enrichedImage.includes('favicons')) {
            item.imageUrl = enrichedImage;
            imageLookups++;
          }
        } catch (error) {
          // If lookup fails, leave imageUrl undefined (no blurry favicon)
        }
      }
      // If cap is reached or lookup failed, leave imageUrl undefined
      // Cards will display without image rather than blurry favicon
    }
    
    item.score = calculateScore(item, now);
    await saveItem(item);
    savedCount++;
  }

  return savedCount;
}

function extractTags(title: string, snippet: string): string[] {
  const text = `${title} ${snippet}`.toLowerCase();
  const tags: string[] = [];

  // Layoffs and job cuts
  if (text.includes("layoff") || text.includes("job cut") || text.includes("job loss")) {
    tags.push("Layoffs");
  }
  
  // AI and automation
  if (text.includes("ai") || text.includes("artificial intelligence")) {
    tags.push("AI");
  }
  if (text.includes("automation")) {
    tags.push("Automation");
  }
  
  // Unemployment
  if (text.includes("unemployment")) {
    tags.push("Unemployment");
  }
  
  // Hiring freezes
  if (text.includes("hiring freeze") || text.includes("hiring pause")) {
    tags.push("Hiring Freeze");
  }
  
  // Resume and ATS
  if (text.includes("resume") || text.includes("cv ") || text.includes("curriculum vitae")) {
    tags.push("Resume Writing");
  }
  if (text.includes("ats") || text.includes("applicant tracking system")) {
    tags.push("ATS");
  }
  
  // Interview tips
  if (text.includes("interview") || text.includes("interviewing")) {
    tags.push("Interview Tips");
  }
  
  // Job search general
  if (text.includes("job search") || text.includes("find a job") || text.includes("job hunting")) {
    tags.push("Job Search");
  }
  
  // Career advice
  if (text.includes("career advice") || text.includes("career tips") || text.includes("career guidance")) {
    tags.push("Career Advice");
  }
  
  // Networking
  if (text.includes("networking") || text.includes("linkedin")) {
    tags.push("Networking");
  }

  return tags;
}

export async function fetchDailyTimer(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  context.log("Timer trigger fired. Starting daily fetch...");
  try {
    // Fetch and save new items
    const savedCount = await fetchAndSaveItems();
    context.log(`Daily fetch completed. Saved ${savedCount} items`);

    // Clean up old items (older than 90 days)
    const retentionDays = parseInt(process.env.RETENTION_DAYS || "90", 10);
    context.log(`Starting cleanup of items older than ${retentionDays} days...`);
    const deletedCount = await cleanupOldItems(retentionDays);
    context.log(`Cleanup completed. Deleted ${deletedCount} old items`);
  } catch (error: any) {
    context.error("Error in daily fetch:", error);
    throw error;
  }
}

app.timer("FetchDailyTimer", {
  schedule: "0 0 0,12 * * *", // Run twice daily at midnight UTC and noon UTC
  handler: fetchDailyTimer,
});

