import axios from "axios";

const SERPER_API_KEY = process.env.SERPER_API_KEY || "";

export interface SerperResult {
  title: string;
  link: string;
  snippet: string;
  source?: string;
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
        allResults.push(...response.data.organic);
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
        allResults.push(...response.data.organic);
      }
    } catch (error) {
      console.error(`Error fetching videos for query "${query}":`, error);
    }
  }

  return allResults;
}

