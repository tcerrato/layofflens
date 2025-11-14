import { execSync } from 'child_process';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Azure Static Web Apps with Next.js SSR support
  // No output mode specified - lets Next.js use default server rendering
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  // Use git commit SHA for build ID (stable, doesn't create infinite bundles)
  generateBuildId: async () => {
    try {
      return execSync('git rev-parse HEAD').toString().trim();
    } catch {
      return 'dev-build';
    }
  },
};

export default nextConfig;
