import { fetchItems } from "@/lib/client";
import FeedCard from "@/components/FeedCard";
import TypeFilter from "@/components/TypeFilter";
import CategoryFilter from "@/components/CategoryFilter";

// Force static generation - don't use dynamic features
export const dynamic = 'force-static';
export const revalidate = false;

export default async function HomePage() {
  // Fetch all items but limit to top 50 for main view
  // For static export, we fetch at build time with no filters
  let allItems: any[] = [];
  try {
    const response = await fetchItems({ limit: 50 });
    // When limit is set, API returns FeedItem[] directly
    allItems = Array.isArray(response) ? response : [];
  } catch (error) {
    // If API fails during build, use empty array - page will still generate
    console.warn('Failed to fetch items during build:', error);
    allItems = [];
  }
  
  // Extract all unique tags for the category filter
  const allTags = new Set<string>();
  allItems.forEach((item) => {
    const tags = typeof item.tags === 'string' ? JSON.parse(item.tags || '[]') : (item.tags || []);
    tags.forEach((tag: string) => allTags.add(tag));
  });

  return (
    <div>
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
          <CategoryFilter availableTags={Array.from(allTags)} />
        </div>
      </div>
      {allItems.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allItems.map((item) => (
            <FeedCard key={`${item.partitionKey}-${item.rowKey}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

