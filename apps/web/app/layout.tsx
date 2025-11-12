import type { Metadata } from "next";
import "./globals.css";
import DarkModeToggle from "@/components/DarkModeToggle";
import GoogleAnalytics from "@/components/GoogleAnalytics";

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
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased bg-gray-50 dark:bg-gray-950 min-h-screen">
        <GoogleAnalytics />
        <div className="sticky top-0 z-50">
          <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div>
                <img
                  src="https://layofflens.blob.core.windows.net/layofflens/logo-redo.png"
                  alt="LayoffLens Logo"
                  className="h-16 sm:h-20 w-auto object-contain rounded-xl"
                />
                <p className="text-sm sm:text-base text-gray-800 dark:text-white mt-2">
                  Daily AI-powered tracker for layoff related news and job market trends
                </p>
              </div>
            </div>
          </header>
          <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  <a
                    href="/"
                    className="border-b-2 border-transparent hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 py-4 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    Current
                  </a>
                  <a
                    href="/archive"
                    className="border-b-2 border-transparent hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 py-4 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    Archive
                  </a>
                  <a
                    href="/analytics"
                    className="border-b-2 border-transparent hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 py-4 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    Analytics
                  </a>
                </div>
                <div className="flex items-center space-x-1">
                  <DarkModeToggle />
                  <a
                    href="/about"
                    className="border-b-2 border-transparent hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 py-4 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    About
                  </a>
                </div>
              </div>
            </div>
          </nav>
        </div>
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

