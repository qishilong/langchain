import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: [
    "@langchain/deepseek",
    "langchain",
    "@langchain/core",
    "@langchain/langgraph",
    "deepagents",
  ],
};

export default nextConfig;
