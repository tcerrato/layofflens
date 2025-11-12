import { fetchItems } from "@/lib/client";
import FeedClient from "@/components/FeedClient";
import TypeFilter from "@/components/TypeFilter";
import CategoryFilter from "@/components/CategoryFilter";
import HeroStatsBanner from "@/components/HeroStatsBanner";

// Dynamic rendering with 5-minute cache
// Always fetches fresh data but caches at edge for 5 minutes to reduce API calls
export const dynamic = 'force-dynamic';
export const revalidate = 300; // Cache for 5 minutes (300 seconds)

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
      {/* Hero Stats Banner */}
      <HeroStatsBanner />

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
      <FeedClient initialItems={allItems} limit={50} />
    </div>
  );
}

