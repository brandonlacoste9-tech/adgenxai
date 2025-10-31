/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use 'standalone' for Docker deployments, 'export' for static sites
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
