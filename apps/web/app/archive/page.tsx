import { fetchItems, PaginatedResponse } from "@/lib/client";
import FeedCard from "@/components/FeedCard";
import TypeFilter from "@/components/TypeFilter";
import CategoryFilter from "@/components/CategoryFilter";
import DateRangeFilter from "@/components/DateRangeFilter";
import Pagination from "@/components/Pagination";

// Force static generation - don't use dynamic features
export const dynamic = 'force-static';
export const revalidate = false;

export default async function ArchivePage() {
  // For static export, fetch all items (no filters at build time)
  let allFetchedItems: any[] = [];
  try {
    const response = await fetchItems();
    // API returns paginated response when no limit is set
    const paginatedData = response && typeof response === 'object' && 'pagination' in response 
      ? response as PaginatedResponse 
      : null;
    allFetchedItems = paginatedData ? paginatedData.items : (Array.isArray(response) ? response : []);
  } catch (error) {
    // If API fails during build, use empty array - page will still generate
    console.warn('Failed to fetch items during build:', error);
    allFetchedItems = [];
  }
  
  // For static export, show all items (filtering will be client-side)
  const items = allFetchedItems;
  
  // Extract all unique tags for the category filter
  const allTags = new Set<string>();
  allFetchedItems.forEach((item) => {
    const tags = typeof item.tags === 'string' ? JSON.parse(item.tags || '[]') : (item.tags || []);
    tags.forEach((tag: string) => allTags.add(tag));
  });

  // For static export, we'll show all items (pagination/filtering client-side)
  const pageSize = 50;
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = 1;
  const displayedItems = items.slice(0, pageSize);

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Archive
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
              Browse all stored news and videos ({totalItems} items)
            </p>
          </div>
          <TypeFilter />
        </div>
        <div className="mt-4 space-y-3">
          <DateRangeFilter />
          <CategoryFilter availableTags={Array.from(allTags)} />
        </div>
      </div>
      {displayedItems.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Archive is empty
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              No items found in the archive. Data will appear here once the API is running and fetching data.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedItems.map((item) => (
              <FeedCard key={`${item.partitionKey}-${item.rowKey}`} item={item} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
            />
          )}
        </>
      )}
    </div>
  );
}

