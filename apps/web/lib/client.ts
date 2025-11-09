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

export interface PaginatedResponse {
  items: FeedItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  };
}

export async function fetchItems(options?: { days?: number; limit?: number; page?: number }): Promise<FeedItem[] | PaginatedResponse> {
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

