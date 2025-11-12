"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchItems, FeedItem } from "@/lib/client";
import FeedCard from "./FeedCard";

interface FeedClientProps {
  initialItems: FeedItem[];
  limit?: number;
}

export default function FeedClient({ initialItems, limit }: FeedClientProps) {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<FeedItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // For archive (no limit), show Load More if we got 50 items (page size)
  // For home (with limit), don't show Load More
  const [hasMore, setHasMore] = useState(!limit && initialItems.length === 50);

  const typeFilter = searchParams.get("filter") || "all";
  const categoryFilter = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    // If we have initial items, use them. Otherwise, fetch fresh data.
    if (initialItems.length === 0) {
      setLoading(true);
      fetchItems({ limit: limit || 50 })
        .then((response) => {
          const fetchedItems = Array.isArray(response) ? response : [];
          setItems(fetchedItems);
        })
        .catch((error) => {
          console.warn("Failed to fetch items:", error);
          // Keep empty array if fetch fails
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [initialItems.length, limit]);

  // Apply client-side filtering
  const filteredItems = items.filter((item) => {
    // Type filter
    if (typeFilter !== "all" && item.type !== typeFilter) {
      return false;
    }

    // Category filter
    if (categoryFilter !== "all") {
      const tags = typeof item.tags === 'string' ? JSON.parse(item.tags || '[]') : (item.tags || []);
      if (!tags.includes(categoryFilter)) {
        return false;
      }
    }

    // Search filter (case-insensitive search in title and snippet with word boundaries)
    if (searchQuery) {
      const text = `${item.title || ""} ${item.snippet || ""}`.toLowerCase();
      // Use word boundary regex to match whole words only (e.g., "Intel" but not "intelligence")
      // Escape special regex characters in the search query
      const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedQuery.toLowerCase()}\\b`);
      if (!regex.test(text)) {
        return false;
      }
    }

    return true;
  });

  if (loading) {
    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Loading...
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Fetching the latest news and videos...
          </p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No items found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            No items found. Check back later or trigger a manual fetch to populate data.
          </p>
        </div>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No items match your filters
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your filters to see more results.
          </p>
        </div>
      </div>
    );
  }

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      // Archive page: use page param only (no limit) to get paginated response
      const response = await fetchItems({ page: nextPage });
      const newItems = response && 'items' in response ? response.items : [];

      if (newItems.length === 0 || newItems.length < 50) {
        setHasMore(false);
      }

      setItems([...items, ...newItems]);
      setCurrentPage(nextPage);
    } catch (error) {
      console.warn("Failed to fetch more items:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <FeedCard key={`${item.partitionKey}-${item.rowKey}`} item={item} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

