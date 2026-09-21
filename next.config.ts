import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "js", "jsx"],
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
