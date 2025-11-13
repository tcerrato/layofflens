"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoffStats } from "@/lib/client";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AnalyticsChartsProps {
  stats: LayoffStats;
}

const COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // green
  "#3b82f6", // blue
  "#f97316", // orange
  "#14b8a6", // teal
  "#ef4444", // red
  "#a855f7", // violet
];

export default function AnalyticsCharts({ stats }: AnalyticsChartsProps) {
  const { summary, byWeek, bySector, topCompanies } = stats;
  const router = useRouter();

  // Format week labels for better readability
  const weeklyData = byWeek.map((item) => ({
    ...item,
    weekLabel: `Week ${item.week.split('-W')[1]}`,
  }));

  // Handle sector bar click - navigate to archive with sector filter and 90-day range (matches analytics timeframe)
  const handleSectorClick = (sector: string) => {
    router.push(`/archive?sector=${encodeURIComponent(sector)}&days=90`);
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            This Week
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {summary.totalArticlesThisWeek}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            layoff news articles
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Trend
          </div>
          <div className={`text-3xl font-bold ${
            summary.percentChange > 0 ? "text-red-600 dark:text-red-400" :
            summary.percentChange < 0 ? "text-green-600 dark:text-green-400" :
            "text-gray-900 dark:text-gray-100"
          }`}>
            {summary.percentChange > 0 ? "+" : ""}{summary.percentChange}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            vs last week
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Top Sector
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
            {summary.topSector}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            most mentioned
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Today
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {summary.todayCount}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            articles published
          </div>
        </div>
      </div>

      {/* Weekly Trend Chart */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Weekly Trends
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis
                dataKey="weekLabel"
                className="text-gray-600 dark:text-gray-400"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis
                className="text-gray-600 dark:text-gray-400"
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#111827' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={2}
                name="Articles"
                dot={{ fill: '#6366f1', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout for Sector and Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sector Distribution */}
        {bySector.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              By Sector
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bySector}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis
                    dataKey="sector"
                    className="text-gray-600 dark:text-gray-400"
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    className="text-gray-600 dark:text-gray-400"
                    tick={{ fill: 'currentColor' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#6366f1"
                    name="Articles"
                    onClick={(data: any) => {
                      if (data?.payload?.sector) {
                        handleSectorClick(data.payload.sector);
                      }
                    }}
                    cursor="pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Top Companies */}
        {topCompanies.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Top Companies Mentioned
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              News mentions in last 90 days
            </p>
            <div className="space-y-4">
              {topCompanies.map((company, index) => (
                <Link
                  key={company.company}
                  href={`/archive?search=${encodeURIComponent(company.company)}&category=Layoffs&filter=news`}
                  className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-3 -mx-3 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    >
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {company.company}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {company.count} mention{company.count > 1 ? 's' : ''}
                    </div>
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(company.count / topCompanies[0].count) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Empty States */}
      {bySector.length === 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            No sector data available yet. Sector tagging is being implemented.
          </div>
        </div>
      )}
    </div>
  );
}
