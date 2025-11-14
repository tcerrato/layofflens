"use client";

import { useEffect, useState } from "react";
import { fetchLayoffStats } from "@/lib/client";

export default function HeroStatsBannerClient() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLayoffStats(30)
      .then((data) => setStats(data))
      .catch((error) => {
        console.warn('Failed to fetch stats:', error);
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // If stats failed to load or still loading, don't show the banner
  if (loading || !stats) {
    return null;
  }

  const { summary } = stats;
  const trendDirection = summary.percentChange > 0 ? "up" : summary.percentChange < 0 ? "down" : "neutral";
  const trendColor =
    trendDirection === "up" ? "text-red-600 dark:text-red-400" :
    trendDirection === "down" ? "text-green-600 dark:text-green-400" :
    "text-gray-600 dark:text-gray-400";

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-xl shadow-lg p-8 mb-8 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Main Title */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Layoff News Tracker
          </h2>
          <p className="text-indigo-100 dark:text-indigo-200 text-sm md:text-base">
            Real-time insights into layoff announcements and trends
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full md:w-auto">
          {/* This Week */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl md:text-4xl font-bold mb-1">
              {summary.totalArticlesThisWeek}
            </div>
            <div className="text-xs md:text-sm text-indigo-100 dark:text-indigo-200">
              Stories This Week
            </div>
          </div>

          {/* Trend */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className={`text-3xl md:text-4xl font-bold mb-1 flex items-center justify-center gap-1 ${trendColor}`}>
              {trendDirection === "up" && (
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              )}
              {trendDirection === "down" && (
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              )}
              {Math.abs(summary.percentChange)}%
            </div>
            <div className="text-xs md:text-sm text-indigo-100 dark:text-indigo-200">
              vs Last Week
            </div>
          </div>

          {/* Top Sector */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1 truncate">
              {summary.topSector}
            </div>
            <div className="text-xs md:text-sm text-indigo-100 dark:text-indigo-200">
              Top Sector
            </div>
          </div>

          {/* Today */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl md:text-4xl font-bold mb-1">
              {summary.todayCount}
            </div>
            <div className="text-xs md:text-sm text-indigo-100 dark:text-indigo-200">
              Today
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
