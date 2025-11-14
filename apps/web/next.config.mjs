/** @type {import('next').NextConfig} */
const nextConfig = {
  // Azure Static Web Apps with Next.js SSR support
  // No output mode specified - lets Next.js use default server rendering
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
};

export default nextConfig;
