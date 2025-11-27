import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for optimal Netlify performance
  output: "export",

  // Configure images for export optimizer
  images: {
    unoptimized: true, // Required for static export
    loader: "custom",
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Allow images from Ghibli API
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
    ],
  },

  // Image optimization settings
  env: {
    storePicturesInWEBP: "true",
    generateAndUseBlurImages: "true",
    imageQuality: "60", // CO2 optimization: 60% quality
  },

  // Enable strict mode for better performance
  reactStrictMode: true,

  // Optimize production builds
  poweredByHeader: false,
  compress: true,

  // Trailing slash for better CDN caching
  trailingSlash: true,

  // Required for next-image-export-optimizer
  transpilePackages: ["next-image-export-optimizer"],

  // CO2 OPTIMIZATION: Replace React with Preact (saves ~40 KB)
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Alias React to Preact in production client bundles
      Object.assign(config.resolve.alias, {
        "react/jsx-runtime": "preact/jsx-runtime",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
        react: "preact/compat",
      });
    }
    return config;
  },

  // Add empty turbopack config to silence Next.js 16 warning
  turbopack: {},

  // Additional optimizations
  experimental: {
    optimizePackageImports: ["preact"],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
