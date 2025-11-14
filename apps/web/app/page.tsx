import { Suspense } from "react";
import HomePageClient from "@/components/HomePageClient";

// Fully client-side rendered to eliminate hydration mismatches
export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><div className="text-gray-500 dark:text-gray-400">Loading...</div></div>}>
      <HomePageClient />
    </Suspense>
  );
}
