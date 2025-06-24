import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_COMING_SOON: process.env.NEXT_PUBLIC_COMING_SOON,
  },
};

export default nextConfig;
