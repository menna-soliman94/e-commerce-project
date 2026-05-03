import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/e-commerce-project",
  assetPrefix: "/e-commerce-project/",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ecommerce.routemisr.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;