/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Azure Storage static website hosting
  output: 'export',
  // Disable image optimization (not available in static export)
  images: {
    unoptimized: true,
  },
  // Ensure trailing slash for proper routing in static hosting
  trailingSlash: true,
  // Generate index.html for root route
  distDir: 'out',
};

export default nextConfig;

