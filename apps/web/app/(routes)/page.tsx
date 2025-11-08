import { fetchItems } from "@/lib/client";
import FeedCard from "@/components/FeedCard";

export default async function HomePage() {
  const items = await fetchItems(1);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100">
          Today&apos;s Feed
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Latest news and videos about layoffs and job market trends
        </p>
      </div>
      {items.length === 0 ? (
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
              No items found for today. Check back later or trigger a manual fetch to populate data.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <FeedCard key={`${item.partitionKey}-${item.rowKey}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

