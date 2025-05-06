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
  },
  // Enhanced performance optimizations
  poweredByHeader: false, // Remove X-Powered-By header
  compress: true, // Enable gzip compression
  reactStrictMode: true, // Enable React strict mode
  output: 'standalone', // Optimized standalone output
  
  // Script optimization strategies
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during production builds for speed
  },
  typescript: {
    ignoreBuildErrors: true, // Skip TypeScript errors during production builds
  },
  
  // Moved from experimental to root level as per Next.js warnings
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild/darwin-x64',
    ],
  },
  
  experimental: {
    optimizeCss: true, // CSS optimization
    serverActions: {
      allowedOrigins: ['souldistribution.com'],
    },
    // Enable build time optimization and code splitting
    optimizePackageImports: ['react-icons', 'lucide-react', '@radix-ui/react-icons'],
    // Script loading optimization
    optimizeServerReact: true,
  },
  // Caching strategies
  staticPageGenerationTimeout: 120, // Increase timeout for complex static pages (in seconds)
  // Environment variables
  env: {
    SPOTIFY_CLIENT_ID: 'bfb9acc3c59546cf83af6a72b11958d1',
    SPOTIFY_CLIENT_SECRET: '8658afe86f884816ad6431d3d21f917f',
  },
}

module.exports = nextConfig
