import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for optimal Netlify performance
  output: "export",

  // Disable image optimization for static export (not supported)
  // Images will still be optimized at build time but won't use Next.js Image Optimization API
  images: {
    unoptimized: true,
  },

  // Enable strict mode for better performance
  reactStrictMode: true,

  // Optimize production builds
  poweredByHeader: false,
  compress: true,

  // Trailing slash for better CDN caching
  trailingSlash: true,
};

export default nextConfig;
