import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LayoffLens - Daily AI-Powered Layoff Tracker",
  description: "Track the latest news, videos, and insights about layoffs, unemployment, and the impact of AI and automation on the job market.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 dark:bg-gray-950 min-h-screen">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  LayoffLens
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5">
                  Daily AI-powered tracker for layoff related news and job market trends
                </p>
              </div>
            </div>
          </div>
        </header>
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1">
              <a
                href="/"
                className="border-b-2 border-transparent hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 py-4 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
              >
                Today
              </a>
              <a
                href="/archive"
                className="border-b-2 border-transparent hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 py-4 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
              >
                Archive
              </a>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </main>
        <footer className="border-t border-gray-200 dark:border-gray-800 mt-16 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>LayoffLens - Tracking job market trends and layoff news</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

