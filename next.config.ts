import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["129.161.139.75"],

  // Redirect API calls to the backend server for CORS stuff
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_URL}/:path*/`,
      },
    ];
  },
};

export default nextConfig;
