"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchLayoffStats, LayoffStats } from "@/lib/client";
import AnalyticsCharts from "@/components/AnalyticsCharts";

export default function AnalyticsPageClient() {
  const [stats, setStats] = useState<LayoffStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchLayoffStats(90)
      .then((data) => setStats(data))
      .catch((error) => {
        console.warn('Failed to fetch stats:', error);
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <ol className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <li>
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li className="text-gray-900 dark:text-gray-100 font-medium">Analytics</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Layoff News Analytics
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Track trends in layoff announcements across sectors and time periods
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500 dark:text-gray-400">Loading analytics...</div>
        </div>
      ) : !stats ? (
        <div className="text-center py-16 px-4">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Analytics unavailable
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Unable to load analytics data. Please ensure the API is running.
            </p>
          </div>
        </div>
      ) : (
        <AnalyticsCharts stats={stats} />
      )}
    </div>
  );
}
