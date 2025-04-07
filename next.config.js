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
  env: {
    SPOTIFY_CLIENT_ID: 'bfb9acc3c59546cf83af6a72b11958d1',
    SPOTIFY_CLIENT_SECRET: '8658afe86f884816ad6431d3d21f917f',
  },
}

module.exports = nextConfig
