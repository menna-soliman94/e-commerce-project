import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/e-commerce-project",
  assetPrefix: "/e-commerce-project/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;