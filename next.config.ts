import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow local network access during dev (e.g., testing from phone on same Wi-Fi)
  allowedDevOrigins: ["192.168.10.7", "192.168.10.10"],
  images: {
    qualities: [75, 80, 85, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
