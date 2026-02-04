import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/:path*/mediapipe/:slug*',        
        destination: '/mediapipe/:slug*',
      },
    ];
  },
};

export default nextConfig;