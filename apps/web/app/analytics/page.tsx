import { Suspense } from "react";
import AnalyticsPageClient from "@/components/AnalyticsPageClient";

// Fully client-side rendered to eliminate SSR issues
export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><div className="text-gray-500 dark:text-gray-400">Loading...</div></div>}>
      <AnalyticsPageClient />
    </Suspense>
  );
}
