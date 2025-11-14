"use client";

import { useEffect, useState } from "react";
import { fetchItems } from "@/lib/client";
import FeedClient from "@/components/FeedClient";
import TypeFilter from "@/components/TypeFilter";
import CategoryFilter from "@/components/CategoryFilter";
import HeroStatsBannerClient from "@/components/HeroStatsBannerClient";

export default function HomePageClient() {
  const [items, setItems] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchItems({ limit: 50 })
      .then((response) => {
        const fetchedItems = Array.isArray(response) ? response : [];
        setItems(fetchedItems);

        // Extract all unique tags
        const tags = new Set<string>();
        fetchedItems.forEach((item: any) => {
          const itemTags = typeof item.tags === 'string' ? JSON.parse(item.tags || '[]') : (item.tags || []);
          itemTags.forEach((tag: string) => tags.add(tag));
        });
        setAllTags(Array.from(tags));
      })
      .catch((error) => {
        console.warn('Failed to fetch items:', error);
        setItems([]);
        setAllTags([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Stats Banner */}
      <HeroStatsBannerClient />

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Current Feed
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
              Top 50 most recent news and videos about layoffs and job market trends
            </p>
          </div>
          <TypeFilter />
        </div>
        <div className="mt-4">
          <CategoryFilter availableTags={allTags} />
        </div>
      </div>
      <FeedClient initialItems={items} limit={50} />
    </div>
  );
}
