import axios from "axios";

const SERPER_API_KEY = process.env.SERPER_API_KEY || "";

export interface SerperResult {
  title: string;
  link: string;
  snippet: string;
  source?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
}

export interface SerperResponse {
  organic: SerperResult[];
}

const NEWS_QUERIES = [
  "tech layoffs OR job cuts",
  "AI layoffs OR automation job losses",
  "unemployment rate BLS",
];

const VIDEO_QUERIES = [
  "tech layoffs analysis site:youtube.com",
  "resume ATS tips 2025",
];

// Extract YouTube thumbnail from video URL
// This works because Serper provides the YouTube URL, and we can construct the thumbnail URL from it
function getYouTubeThumbnail(url: string): string | undefined {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes("youtube.com") || urlObj.hostname.includes("youtu.be")) {
      let videoId: string | null = null;
      
      if (urlObj.hostname.includes("youtu.be")) {
        videoId = urlObj.pathname.slice(1);
      } else {
        videoId = urlObj.searchParams.get("v");
      }
      
      if (videoId) {
        // YouTube provides thumbnails at this URL pattern
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }
  } catch (error) {
    // Invalid URL, return undefined
  }
  return undefined;
}

export async function fetchNewsItems(): Promise<SerperResult[]> {
  const allResults: SerperResult[] = [];

  for (const query of NEWS_QUERIES) {
    try {
      const response = await axios.post<SerperResponse>(
        "https://google.serper.dev/search",
        {
          q: query,
          num: 10,
        },
        {
          headers: {
            "X-API-KEY": SERPER_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.organic) {
        // Enrich results: use Serper's imageUrl/thumbnailUrl if provided, or extract YouTube thumbnails
        for (const result of response.data.organic) {
          const enriched: SerperResult = { ...result };
          
          // If Serper provides imageUrl/thumbnailUrl, use it
          if (result.imageUrl || result.thumbnailUrl) {
            enriched.imageUrl = result.imageUrl || result.thumbnailUrl;
          } else {
            // Otherwise, try to extract YouTube thumbnail from the URL
            const ytThumb = getYouTubeThumbnail(result.link);
            if (ytThumb) {
              enriched.imageUrl = ytThumb;
            }
          }
          
          allResults.push(enriched);
        }
      }
    } catch (error) {
      console.error(`Error fetching news for query "${query}":`, error);
    }
  }

  return allResults;
}

export async function fetchVideoItems(): Promise<SerperResult[]> {
  const allResults: SerperResult[] = [];

  for (const query of VIDEO_QUERIES) {
    try {
      const response = await axios.post<SerperResponse>(
        "https://google.serper.dev/search",
        {
          q: query,
          num: 10,
        },
        {
          headers: {
            "X-API-KEY": SERPER_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.organic) {
        // Enrich results: use Serper's imageUrl/thumbnailUrl if provided, or extract YouTube thumbnails
        for (const result of response.data.organic) {
          const enriched: SerperResult = { ...result };
          
          // If Serper provides imageUrl/thumbnailUrl, use it
          if (result.imageUrl || result.thumbnailUrl) {
            enriched.imageUrl = result.imageUrl || result.thumbnailUrl;
          } else {
            // Otherwise, try to extract YouTube thumbnail from the URL
            const ytThumb = getYouTubeThumbnail(result.link);
            if (ytThumb) {
              enriched.imageUrl = ytThumb;
            }
          }
          
          allResults.push(enriched);
        }
      }
    } catch (error) {
      console.error(`Error fetching videos for query "${query}":`, error);
    }
  }

  return allResults;
}

