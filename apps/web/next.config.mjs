/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Azure Storage static website hosting
  output: 'export',
  // Disable image optimization (not available in static export)
  images: {
    unoptimized: true,
  },
  // Don't use trailing slash - it can prevent index.html generation
  trailingSlash: false,
};

export default nextConfig;

