import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Porfolio',
  assetPrefix: '/Porfolio/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
