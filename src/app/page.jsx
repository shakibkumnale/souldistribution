// src/app/page.jsx (Homepage)
import { Suspense } from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import FeaturedArtists from '@/components/home/FeaturedArtists';
import LatestReleases from '@/components/home/LatestReleases';
import TrendingPlaylistsSlider from '@/components/home/TrendingPlaylistsSlider';
import SpotifyPlayer from '@/components/spotify/SpotifyPlayer';
import SpotifyPlaylistGrid from '@/components/spotify/SpotifyPlaylistGrid';
import YouTubeEmbed from '@/components/youtube/YouTubeEmbed';
import InfiniteLogos from '@/components/home/InfiniteLogos';
import ServicePlans from '@/components/services/ServicePlans';
import MusicDiscoverySection from '@/components/home/MusicDiscoverySection';
import connectToDatabase from '@/lib/db';
import Artist from '@/models/Artist';
import Release from '@/models/Release';
import { serializeMongoDB } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Music, Globe, ArrowRight, PlayCircle, ShoppingCart, PieChart, TrendingUp, Headphones, BarChart, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Define viewport separately from metadata
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// Add page-specific metadata export
export const metadata = {
  title: 'Soul Distribution - Music Distribution & YouTube Monetization for Independent Artists',
  description: 'Soul Distribution helps independent artists distribute music to 150+ global platforms including Spotify, Apple Music & YouTube. Keep 100% of your royalties with our affordable plans.',
  keywords: ['music distribution', 'independent artists', 'spotify distribution', 'youtube monetization', 'keep 100% royalties', 'digital music distribution'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Soul Distribution - Music Distribution & YouTube Monetization',
    description: 'Distribute your music to 150+ platforms worldwide. Keep 100% of your royalties with our affordable plans for independent artists.',
    images: [
      {
        url: '/api/og/default',
        width: 1200,
        height: 630,
        alt: 'Soul Distribution - Music Distribution',
      },
    ],
  },
};

// Sample featured YouTube videos - this would come from the admin panel in production
const featuredVideos = [
  {
    id: 'kXTJMtV8Mnc', // Replace with actual video ID
    title: 'Featured Artist - Music Video'
  },
  {
    id: '8JHjwwZSp6Q', // Replace with actual video ID
    title: 'Behind The Scenes'
  }
];

// Major DSP platforms we distribute to
const majorDSPs = [
  { name: 'Spotify', logo: '/images/DSPsLogos/spotify.webp', highlight: true },
  { name: 'Amazon', logo: '/images/DSPsLogos/amazon.png', highlight: true },
  { name: 'Deezer', logo: '/images/DSPsLogos/deezer.jpg', highlight: true },
  { name: 'Instagram', logo: '/images/DSPsLogos/instagram.png', highlight: true },
  { name: 'TikTok', logo: '/images/DSPsLogos/tiktok.png', highlight: true },
  { name: 'YouTube Music', logo: '/images/DSPsLogos/Youtube_Music.png', highlight: true },
];

// This is a Server Component to fetch data
async function getData() {
  try {
    await connectToDatabase();
    
    // Get total number of releases
    const totalReleases = await Release.countDocuments();
    
    // Get total number of artists
    const totalArtists = await Artist.countDocuments();
    
    // Get all featured artists sorted by Spotify followers
    const popularArtists = await Artist.find({ featured: true })
      .sort({ 'spotifyData.followers': -1 })
      .lean();
    
    // Get all latest releases without limit
    const latestReleases = await Release.find({ featured: true })
      .sort({ releaseDate: -1 })
      .populate('artists', 'name spotifyArtistId')
      .lean();
    
    // Get all top releases by popularity without limit
    const topReleases = await Release.find({ featured: true })
      .sort({ popularity: -1 })
      .populate('artists', 'name spotifyArtistId')
      .lean();
    
    return {
      popularArtists: serializeMongoDB(popularArtists),
      latestReleases: serializeMongoDB(latestReleases),
      topReleases: serializeMongoDB(topReleases),
      metrics: {
        totalReleases,
        totalArtists
      }
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      popularArtists: [],
      latestReleases: [],
      topReleases: [],
      metrics: {
        totalReleases: 0,
        totalArtists: 0
      }
    };
  }
}

export default async function HomePage() {
  const { popularArtists, latestReleases, topReleases, metrics } = await getData();
  
  // JSON-LD structured data for organization
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Soul Distribution',
    url: 'https://souldistribution.com',
    logo: 'https://souldistribution.com/logo.png',
    description: 'Soul Distribution helps independent artists distribute music worldwide to all major streaming platforms and get verified on YouTube with monetization services.',
    sameAs: [
      'https://www.instagram.com/souldistribution', 
      'https://www.youtube.com/souldistribution',
      'https://twitter.com/souldistribution'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-8291121080',
      contactType: 'customer service',
      availableLanguage: 'English'
    },
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 0,
        longitude: 0
      },
      geoRadius: '20000 km',
      description: 'Global digital music distribution'
    },
    areaServed: 'Worldwide'
  };
  
  return (
    <main className="min-h-screen bg-gradient-dark overflow-x-hidden">
      {/* Add structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      
      <HeroBanner />
      
      {/* Distribution Services Section (Odd) */}
      <section className="w-full py-16 sm:py-20 md:py-28 bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gradient">Global Music Distribution</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Distribute your music to over 150+ digital streaming platforms worldwide with just a few clicks.
              Reach millions of listeners and keep 100% of your royalties.
            </p>
          </div>
          
          <div className="mt-8 sm:mt-12">
            <Tabs defaultValue="platforms" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8 bg-gray-800/60">
                <TabsTrigger value="platforms" className="text-sm sm:text-lg py-2 sm:py-3 data-[state=active]:bg-purple-900/70 data-[state=active]:text-white">Distribution Platforms</TabsTrigger>
                <TabsTrigger value="features" className="text-sm sm:text-lg py-2 sm:py-3 data-[state=active]:bg-purple-900/70 data-[state=active]:text-white">Why Choose Us</TabsTrigger>
              </TabsList>
              
              <TabsContent value="platforms" className="mt-6 sm:mt-8">
                <div className="text-center mb-6 sm:mb-8">
                  <Badge variant="outline" className="px-3 py-0.5 sm:px-4 sm:py-1 text-base sm:text-lg mb-3 sm:mb-4 border-purple-500 text-purple-300">
                    150+ Global Platforms
                  </Badge>
                  <h3 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-4">Get your music on all major streaming platforms</h3>
                  <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto mb-4 sm:mb-6">
                    From major platforms to niche services, we ensure your music reaches audiences everywhere.
                  </p>
                </div>
                
                <div className="mb-4 sm:mb-6 text-lg sm:text-xl font-semibold text-gradient-subtle text-center">
                  Our Major Distribution Partners
                </div>
                
                <InfiniteLogos dsps={majorDSPs} />
                
                <div className="text-center mt-6 sm:mt-8">
                  <Button asChild size="lg" className="text-sm sm:text-base bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-600 hover:to-pink-500 border-0">
                    <Link href="/services">
                      View All Distribution Platforms
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="mt-6 sm:mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  <Card className="bg-gradient-to-b from-purple-900/20 to-gray-900/80 border-gray-800">
                    <CardHeader className="pb-2 sm:pb-4">
                      <Globe className="h-8 w-8 sm:h-12 sm:w-12 text-blue-400 mb-2 sm:mb-4" />
                      <CardTitle className="text-lg sm:text-xl">Worldwide Reach</CardTitle>
                      <CardDescription className="text-sm sm:text-base text-gray-300">Get your music heard across the globe</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm sm:text-base text-gray-300">
                        Distribute your music to over 150 streaming platforms and digital stores worldwide. Reach fans in every corner of the world.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-b from-purple-900/20 to-gray-900/80 border-gray-800">
                    <CardHeader className="pb-2 sm:pb-4">
                      <PieChart className="h-8 w-8 sm:h-12 sm:w-12 text-green-400 mb-2 sm:mb-4" />
                      <CardTitle className="text-lg sm:text-xl">Keep 100% Royalties</CardTitle>
                      <CardDescription className="text-sm sm:text-base text-gray-300">No commission, all earnings are yours</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm sm:text-base text-gray-300">
                        Unlike other distributors, we let you keep 100% of your streaming and download royalties. Your music, your money.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-b from-purple-900/20 to-gray-900/80 border-gray-800">
                    <CardHeader className="pb-2 sm:pb-4">
                      <BarChart className="h-8 w-8 sm:h-12 sm:w-12 text-purple-400 mb-2 sm:mb-4" />
                      <CardTitle className="text-lg sm:text-xl">Advanced Analytics</CardTitle>
                      <CardDescription className="text-sm sm:text-base text-gray-300">Track your performance in real-time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm sm:text-base text-gray-300">
                        Access detailed reports on streams, revenue, listener demographics, and more to help you grow your audience effectively.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="text-center mt-8 sm:mt-12">
                  <Button asChild size="lg" className="text-sm sm:text-base bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-600 hover:to-pink-500 border-0">
                    <Link href="/services">
                      Learn More About Our Services
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      
      {/* Distribution Pricing Plans (Even) */}
      <section className="w-full py-16 sm:py-20 md:py-24 bg-[#141419] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-950/50 via-[#141419] to-[#141419]"></div>
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
          <ServicePlans />
        </div>
      </section>
      
      {/* Featured Artists Section (Odd) */}
      <section className="w-full py-12 sm:py-16 bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        <div className="relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="bg-black/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl backdrop-blur-sm border border-gray-800/50">
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            }>
              <FeaturedArtists artists={popularArtists} />
            </Suspense>
          </div>
        </div>
      </section>
      
      {/* Featured Releases Section (Even) */}
      <section className="w-full py-12 sm:py-16 bg-[#141419] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/20 via-[#141419] to-[#141419]"></div>
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="bg-black/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl backdrop-blur-sm border border-gray-800/50">
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            }>
              <LatestReleases releases={latestReleases} />
            </Suspense>
          </div>
        </div>
      </section>
      
      {/* Music Discovery Section */}
      <section className="w-full py-12 sm:py-16 bg-gradient-to-b from-[#141419] via-purple-900/10 to-[#141419] relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-600/10 via-purple-600/10 to-transparent opacity-60"></div>
        <div className="relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
          <MusicDiscoverySection 
            topReleases={topReleases}
            popularArtists={popularArtists}
            latestReleases={latestReleases}
          />
        </div>
      </section>
      
      {/* Distribution Metrics Section (Odd) */}
      <section className="w-full py-16 sm:py-20 bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        <div className="relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900 via-purple-950/10 to-gray-900 rounded-xl sm:rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 shadow-glow-primary border border-gray-800/50">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-gradient">Soul Distribution By The Numbers</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300">Helping independent artists succeed around the world</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              
              <div className="text-center bg-black/30 p-4 sm:p-6 rounded-lg sm:rounded-xl">
                <Music className="h-8 w-8 sm:h-12 sm:w-12 text-purple-500 mx-auto mb-3 sm:mb-4" />
                <span className="block text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
                  {metrics.totalReleases}+
                </span>
                <span className="text-sm sm:text-base text-gray-400">Total Releases</span>
              </div>
              <div className="text-center bg-black/30 p-4 sm:p-6 rounded-lg sm:rounded-xl">
                <Headphones className="h-8 w-8 sm:h-12 sm:w-12 text-blue-500 mx-auto mb-3 sm:mb-4" />
                <span className="block text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">150+</span>
                <span className="text-sm sm:text-base text-gray-400">DSP Platforms</span>
              </div>
              <div className="text-center bg-black/30 p-4 sm:p-6 rounded-lg sm:rounded-xl">
                <Users className="h-8 w-8 sm:h-12 sm:w-12 text-pink-500 mx-auto mb-3 sm:mb-4" />
                <span className="block text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
                  {metrics.totalArtists}+
                </span>
                <span className="text-sm sm:text-base text-gray-400">Active Artists</span>
              </div>
              <div className="text-center bg-black/30 p-4 sm:p-6 rounded-lg sm:rounded-xl">
                <Globe className="h-8 w-8 sm:h-12 sm:w-12 text-green-500 mx-auto mb-3 sm:mb-4" />
                <span className="block text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">195</span>
                <span className="text-sm sm:text-base text-gray-400">Countries Reached</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trending Section (Even) */}
      <section className="w-full py-12 sm:py-16 bg-[#141419] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-950/50 via-[#141419] to-[#141419]"></div>
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="bg-black/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl backdrop-blur-sm border border-gray-800/50">
            <TrendingPlaylistsSlider />
          </div>
        </div>
      </section>
      
      {/* Videos Section (Odd) */}
      <section className="w-full py-12 sm:py-16 bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        <div className="relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="bg-black/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl backdrop-blur-sm border border-gray-800/50">
            <div className="flex items-center mb-6 sm:mb-8">
              <div className="h-6 sm:h-8 w-1 bg-purple-600 rounded-full mr-3"></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Videos</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {featuredVideos.map((video) => (
            <YouTubeEmbed 
              key={video.id}
              videoId={video.id}
              title={video.title}
            />
          ))}
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 sm:py-20 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-purple-900/40 rounded-xl sm:rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 text-center shadow-glow-primary border border-purple-800/20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-gradient">Ready to Share Your Music with the World?</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto">
            Join thousands of independent artists who trust Soul Distribution to get their music heard globally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-sm sm:text-base bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-600 hover:to-pink-500 border-0" asChild>
              <Link href="/services">
                <PlayCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Get Started
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-sm sm:text-base border-purple-500 text-purple-300 hover:bg-purple-900/30" asChild>
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
