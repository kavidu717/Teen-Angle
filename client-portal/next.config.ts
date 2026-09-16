import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "teenangle-shop-images-2026.s3.us-east-1.amazonaws.com",
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;