"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ActiveFilters() {
  const searchParams = useSearchParams();
  const sectorParam = searchParams.get("sector");
  const daysParam = searchParams.get("days");

  if (!sectorParam && !daysParam) {
    return null;
  }

  return (
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
  );
}
