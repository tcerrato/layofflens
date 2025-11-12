import { fetchItems, PaginatedResponse } from "@/lib/client";
import FeedClient from "@/components/FeedClient";
import TypeFilter from "@/components/TypeFilter";
import CategoryFilter from "@/components/CategoryFilter";
import SearchFilter from "@/components/SearchFilter";

// Dynamic rendering with 5-minute cache
// Always fetches fresh data but caches at edge for 5 minutes to reduce API calls
export const dynamic = 'force-dynamic';
export const revalidate = 300; // Cache for 5 minutes (300 seconds)

export default async function ArchivePage() {
  // Fetch first page (50 items) for fast initial load
  // API returns paginated response when page param is used without limit
  let allFetchedItems: any[] = [];
  let totalCount = 0;
  try {
    const response = await fetchItems({ page: 1 });
    // When page is set without limit, API returns PaginatedResponse
    const paginatedData = response && typeof response === 'object' && 'pagination' in response
      ? response as PaginatedResponse
      : null;
    allFetchedItems = paginatedData ? paginatedData.items : (Array.isArray(response) ? response : []);
    totalCount = paginatedData?.pagination?.totalItems || allFetchedItems.length;
  } catch (error) {
    // If API fails during build, use empty array - page will still generate
    console.warn('Failed to fetch items during build:', error);
    allFetchedItems = [];
  }

  // Extract all unique tags for the category filter
  const allTags = new Set<string>();
  allFetchedItems.forEach((item) => {
    const tags = typeof item.tags === 'string' ? JSON.parse(item.tags || '[]') : (item.tags || []);
    tags.forEach((tag: string) => allTags.add(tag));
  });

  const displayedItems = allFetchedItems.length;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Archive
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
              Displaying {displayedItems} of {totalCount} items
            </p>
          </div>
          <TypeFilter />
        </div>
        <div className="mt-4 space-y-3">
          <SearchFilter />
          <CategoryFilter availableTags={Array.from(allTags)} />
        </div>
      </div>
      <FeedClient initialItems={allFetchedItems} />
    </div>
  );
}

