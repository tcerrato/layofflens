"use client";

import { useEffect, useState } from "react";
import { fetchItems, FeedItem } from "@/lib/client";
import FeedCard from "./FeedCard";

interface FeedClientProps {
  initialItems: FeedItem[];
  limit?: number;
}

export default function FeedClient({ initialItems, limit }: FeedClientProps) {
  const [items, setItems] = useState<FeedItem[]>(initialItems);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <FeedCard key={`${item.partitionKey}-${item.rowKey}`} item={item} />
      ))}
    </div>
  );
}

