import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "images.unsplash.com",
      "img.clerk.com",
      "res.cloudinary.com",
      "media1.giphy.com",
      "media4.giphy.com",
      "media3.giphy.com",
      "media1.giphy.com",
    ],
  },
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: "./empty-module.ts",
      },
    },
  },
};

export default nextConfig;
