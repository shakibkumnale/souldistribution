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
import MusicDiscoverySection from '@/components/home/MusicDiscoverySection';
import { defaultMetadata } from '@/lib/metadata';
import Script from 'next/script';
import { generateServiceSchema } from '@/lib/seoUtils';

// Sample featured playlists - this would come from the admin panel in production
// const featuredPlaylists = [
//   {
//     id: '1',
//     title: 'Hip Hop Hits',
//     description: 'Top tracks from our hip hop artists',
//     coverImage: '/images/placeholder-cover.jpg',
//     spotifyUrl: 'https://open.spotify.com/playlist/5rJZkHvRvichAldYrNUVzi',
//     trackCount: 50
//   },
//   {
//     id: '2',
//     title: 'Fresh Finds',
//     description: 'Discover new talent from our roster',
//     coverImage: '/images/placeholder-cover.jpg',
//     spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX2T5QBkHAjfY',
//     trackCount: 30
//   },
//   {
//     id: '3',
//     title: 'Soul Vibes',
//     description: 'Chill beats and smooth vocals',
//     coverImage: '/images/placeholder-cover.jpg',
//     spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWTx0xog3gN3q',
//     trackCount: 40
//   }
// ];

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

// Distribution service plans
const servicePlans = [
  {
    name: 'PRO',
    description: 'For serious artists',
    price: '₹599',
    term: '/year',
    features: [
      'Unlimited Releases (1 Year)',
      '50% Royalties',
      '150+ Indian & International Stores',
      'Custom Release Date & Spotify Verification',
      'Content ID & Playlist Pitching',
      'Instagram Audio Page Linking',
      '24/7 Support | Approval in 24H | Live in 2 Days',
      'Lifetime Availability '
    ],
    highlight: false,
    color: 'bg-purple-600',
    extraInfo: 'All this for just ₹599/year (Less than ₹50/month!)'
  },
  {
    name: 'BASIC',
    description: 'Perfect for new artists',
    price: '₹99',
    term: '/year',
    features: [
      'Unlimited Releases (1 Year)',
      '150+ Indian & International Stores',
      'Custom Release Date & Spotify Verification',
      'Content ID & Playlist Pitching',
      'Instagram Audio Page Linking',
      '24/7 Support | Approval in 24H | Live in 2 Days',
      'Lifetime Availability – No Hidden Fees!'
    ],
    highlight: true,
    color: 'bg-blue-600',
    extraInfo: 'All this for just ₹99/year (Less than ₹10/month!)'
  },
  {
    name: 'PREMIUM',
    description: 'For professional artists',
    price: '₹1199',
    term: '/year',
    features: [
      'Unlimited Releases (1 Year)',
      '100% Royalties',
      '150+ Indian & International Stores',
      'Custom Release Date & Spotify Verification',
      'Content ID & Playlist Pitching',
      'Instagram Audio Page Linking',
      '24/7 Support | Approval in 24H | Live in 2 Days',
      'Lifetime Availability'
    ],
    highlight: false,
    color: 'bg-pink-600',
    extraInfo: 'All this for just ₹1199/year (Less than ₹100/month!)'
  }
];

// Add this after the servicePlans array and before the getData function
const faqItems = [
  {
    question: "What platforms will my music be available on?",
    answer: "Your music will be distributed to over 150 platforms including Spotify, Apple Music, YouTube Music, Instagram, TikTok, and all major Indian streaming services."
  },
  {
    question: "How do royalty payments work?",
    answer: "Royalty percentages vary by plan. Basic Plan members keep 0%, Pro Plan members keep 50%, and Premium Plan members keep 100% of their streaming revenue. Payments are processed monthly."
  },
  {
    question: "How long does it take for my music to go live?",
    answer: "We typically approve releases within 24 hours, and your music will be live on all platforms within 2-5 business days."
  },
  {
    question: "What is a YouTube Official Artist Channel?",
    answer: "A YouTube Official Artist Channel (OAC) combines all your music content into one channel with a verified badge, custom branding, and enhanced analytics."
  }
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

// Add this metadata export before all other code
export const metadata = {
  ...defaultMetadata,
  title: 'Soul Distribution - Indian Music Distribution Service & YouTube OAC',
  description: 'Distribute your music to 150+ platforms including Spotify, Apple Music, YouTube Music and more. Get YouTube Channel verification. Affordable plans for indie artists.',
  keywords: [...defaultMetadata.keywords, 'indian music distribution', 'affordable music distribution', 'youtube verified channel', 'spotify distribution india'],
  alternates: {
    ...defaultMetadata.alternates,
    canonical: 'https://souldistribution.com/'
  },
};

export default async function HomePage() {
  const { popularArtists, latestReleases, topReleases, metrics } = await getData();
  
  // Generate schema for service plans
  const serviceSchemas = servicePlans.map(plan => generateServiceSchema(plan));
  
  return (
    <main className="min-h-screen bg-gradient-dark overflow-x-hidden">
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
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-gradient">Distribution Plans</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the perfect plan for your music career, from new artists to established professionals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {servicePlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`${plan.highlight ? 'bg-gradient-to-b from-purple-900/40 to-purple-950/60 border-purple-500/50 md:transform md:scale-105 shadow-xl' : 'bg-gradient-to-b from-gray-800/40 to-gray-900/60 border-gray-700/50'} overflow-hidden transition-all duration-300 hover:shadow-purple-900/20 relative`}
              >
                <div className={`${plan.name === 'BASIC' ? 'bg-gradient-to-r from-purple-700/70 to-blue-600' : plan.name === 'PRO' ? 'bg-gradient-to-r from-purple-700 to-pink-600' : 'bg-gradient-to-r from-pink-700 to-purple-700'} h-2 w-full`}></div>
                <CardHeader className="pt-6 sm:pt-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl font-bold flex items-center">
                        {plan.name === 'BASIC' || plan.name === 'PRO' || plan.name === 'PREMIUM' ? (
                          <span className="text-orange-500 mr-2">🔥</span>
                        ) : null}
                        {plan.name}
                        {plan.name === 'PRO' && <span className="ml-2 text-blue-400">🚀</span>}
                        {plan.name === 'PREMIUM' && <span className="ml-2">(Maximum Benefits!)</span>}
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base text-gray-300">{plan.description}</CardDescription>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4">
                    <span className="text-3xl sm:text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm sm:text-base text-gray-400 ml-2">{plan.term}</span>
                  </div>
                </CardHeader>
                {plan.name === 'PRO' && (
                  <div className="absolute top-2 right-2 bg-white text-black text-lg font-bold rounded-full p-2 w-16 h-16 flex items-center justify-center transform rotate-12 z-10 shadow-lg">
                    ₹599
                  </div>
                )}
                <CardContent>
                  <ul className="space-y-2 sm:space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.extraInfo && (
                    <div className="mt-4 bg-black/30 p-3 rounded-lg">
                      <p className="text-sm text-orange-400 flex items-center">
                        <span className="mr-1">🔥</span> {plan.extraInfo}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-300 flex items-center">
                      <span className="mr-2">📊</span> Monthly Revenue Reports & Music Promotion
                    </p>
                    <p className="text-sm text-gray-300 flex items-center mt-2">
                      <span className="mr-2">📩</span> DM to Get Started! <span className="ml-1 text-blue-400">#SoulOnRepeat</span>
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full text-sm sm:text-base ${plan.highlight ? 'bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-600 hover:to-pink-500' : 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500'} border-0`}
                    size="lg"
                    asChild
                  >
                    <Link href="https://wa.me/8291121080" target="_blank" rel="noopener noreferrer">
                      Choose Plan
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
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
      
      {/* Add this at the end of your component */}
      <div className="hidden">
        {/* Service schema for each plan */}
        {serviceSchemas.map((schema, index) => (
          <Script key={`service-schema-${index}`} id={`service-schema-${index}`} type="application/ld+json">
            {JSON.stringify(schema)}
          </Script>
        ))}
        
        {/* FAQ Schema */}
        <Script id="faq-schema" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map(item => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
              }
            }))
          })}
        </Script>
        
        {/* Homepage specific WebPage schema */}
        <Script id="webpage-schema" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Soul Distribution - Indian Music Distribution Service',
            description: 'Distribute your music to 150+ platforms including Spotify, Apple Music, YouTube Music and more.',
            url: 'https://souldistribution.com/',
            datePublished: '2023-01-01',
            dateModified: new Date().toISOString(),
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['h1', '.speakable']
            },
            author: {
              '@type': 'Organization',
              name: 'Soul Distribution',
              url: 'https://souldistribution.com'
            }
          })}
        </Script>
      </div>
    </main>
  );
}
