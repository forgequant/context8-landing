/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Standalone output for Docker
  output: 'standalone',

  images: {
    formats: ['image/avif', 'image/webp'],
    // Disable image optimization in Docker (use Caddy/CDN instead)
    unoptimized: process.env.DOCKER_BUILD === 'true',
  },
}

module.exports = nextConfig
