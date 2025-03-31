/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.scdn.co', 'placehold.co'], // Allow images from Spotify's CDN and placehold.co
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    // Enable image optimization for better performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    // Minimize image size for better performance
    minimumCacheTTL: 86400, // 24 hours
    // Add custom loader for Spotify images
    loader: 'default',
    loaderFile: './src/lib/imageLoader.js',
  },
  // Enable optimizations for SEO
  poweredByHeader: false, // Remove X-Powered-By header for security
  compress: true, // Enable compression for better performance
  reactStrictMode: true,
  // Enable trailing slash for better SEO consistency
  trailingSlash: true,
  // Generate ETags for better caching
  generateEtags: true,
  // Configure output export
  output: 'standalone',
  // Configure headers
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
      {
        // Special headers for image files
        source: '/(.*).(jpg|jpeg|png|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
