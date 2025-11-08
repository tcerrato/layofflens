import { fetchItems } from "@/lib/client";
import FeedCard from "@/components/FeedCard";

export default async function ArchivePage() {
  const items = await fetchItems(7);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100">
          Archive
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Browse the last 7 days of news and videos
        </p>
      </div>
      {items.length === 0 ? (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <FeedCard key={`${item.partitionKey}-${item.rowKey}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

