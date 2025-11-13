import { fetchItems, PaginatedResponse } from "@/lib/client";
import FeedClient from "@/components/FeedClient";
import TypeFilter from "@/components/TypeFilter";
import CategoryFilter from "@/components/CategoryFilter";
import SearchFilter from "@/components/SearchFilter";
import Link from "next/link";

// Dynamic rendering with 5-minute cache
// Always fetches fresh data but caches at edge for 5 minutes to reduce API calls
export const dynamic = 'force-dynamic';
export const revalidate = 300; // Cache for 5 minutes (300 seconds)

interface ArchivePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ArchivePage({ searchParams }: ArchivePageProps) {
  const params = await searchParams;
  const daysParam = params.days ? parseInt(params.days as string, 10) : undefined;
  const sectorParam = params.sector as string | undefined;
  // Fetch first page (50 items) for fast initial load
  // If days or sector params are provided, API will filter accordingly
  // API returns paginated response when page param is used without limit
  let allFetchedItems: any[] = [];
  let totalCount = 0;
  try {
    const fetchOptions: { page: number; days?: number; sector?: string } = { page: 1 };
    if (daysParam && !isNaN(daysParam) && daysParam > 0) {
      fetchOptions.days = daysParam;
    }
    if (sectorParam) {
      fetchOptions.sector = sectorParam;
    }
    const response = await fetchItems(fetchOptions);
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

        {/* Active Filters Badge */}
        {(sectorParam || daysParam) && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active filters:
            </span>
            {sectorParam && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full">
                Sector: {sectorParam}
              </span>
            )}
            {daysParam && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full">
                Last {daysParam} days
              </span>
            )}
            <Link
              href="/archive"
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Clear filters
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          </div>
        )}

        <div className="mt-4 space-y-3">
          <SearchFilter />
          <CategoryFilter availableTags={Array.from(allTags)} />
        </div>
      </div>
      <FeedClient initialItems={allFetchedItems} />
    </div>
  );
}

