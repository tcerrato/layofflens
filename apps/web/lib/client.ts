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
}

export async function fetchItems(days: number = 1): Promise<FeedItem[]> {
  try {
    const response = await fetch(`${API_BASE}/api/ListItemsHttp?days=${days}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(`API returned ${response.status}: ${response.statusText}`);
      return []; // Return empty array instead of throwing
    }

    return response.json();
  } catch (error) {
    console.warn("Failed to fetch items from API:", error);
    return []; // Return empty array on network errors
  }
}

