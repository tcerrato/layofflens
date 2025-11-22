"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchItems, PaginatedResponse } from "@/lib/client";
import FeedClient from "@/components/FeedClient";
import TypeFilter from "@/components/TypeFilter";
import CategoryFilter from "@/components/CategoryFilter";
import SearchFilter from "@/components/SearchFilter";
import ItemCountDisplay from "@/components/ItemCountDisplay";
import ActiveFilters from "@/components/ActiveFilters";

export default function ArchivePageClient() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchParams, setLastFetchParams] = useState<string>("");

  useEffect(() => {
    const daysParam = searchParams.get("days");
    const sectorParam = searchParams.get("sector");

    // Create a key for the server-side params to detect changes
    const currentFetchKey = `${daysParam || "all"}-${sectorParam || "all"}`;

    // Don't re-fetch if only client-side filters changed (category, search, filter)
    // These are handled by FeedClient filtering
    // Only re-fetch when days or sector changes (server-side filters)
    const serverSideFiltersPresent = daysParam || sectorParam;

    if (!serverSideFiltersPresent && items.length > 0 && lastFetchParams === currentFetchKey) {
      // Skip re-fetch, let FeedClient handle filtering
      return;
    }

    setLoading(true);
    const fetchOptions: { page: number; days?: number; sector?: string } = { page: 1 };

    if (daysParam) {
      const days = parseInt(daysParam, 10);
      if (!isNaN(days) && days > 0) {
        fetchOptions.days = days;
      }
    }
    if (sectorParam) {
      fetchOptions.sector = sectorParam;
    }

    fetchItems(fetchOptions)
      .then((response) => {
        const paginatedData = response && typeof response === 'object' && 'pagination' in response
          ? response as PaginatedResponse
          : null;
        const fetchedItems = paginatedData ? paginatedData.items : (Array.isArray(response) ? response : []);
        const count = paginatedData?.pagination?.totalItems || fetchedItems.length;

        setItems(fetchedItems);
        setTotalCount(count);
        setLastFetchParams(currentFetchKey);

        // Extract tags
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
        setTotalCount(0);
        setAllTags([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Archive
            </h2>
            <ItemCountDisplay displayedItems={items.length} totalCount={totalCount} />
          </div>
          <TypeFilter />
        </div>

        {/* Active Filters Badge */}
        <ActiveFilters />

        <div className="mt-4 space-y-3">
          <SearchFilter />
          <CategoryFilter availableTags={allTags} />
        </div>
      </div>
      <FeedClient initialItems={items} />
    </div>
  );
}
