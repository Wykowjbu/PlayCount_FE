import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
const repositoryName = 'PlayCount_FE';

const nextConfig: NextConfig = {
  trailingSlash: true,
  basePath: isGitHubPages ? `/${repositoryName}` : '',
  assetPrefix: isGitHubPages ? `/${repositoryName}/` : undefined,
  reactCompiler: true,
};

export default nextConfig;
