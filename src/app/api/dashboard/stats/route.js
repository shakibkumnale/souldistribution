import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Artist from '@/models/Artist';
import Release from '@/models/Release';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Set query options with timeout
    const queryOptions = { 
      maxTimeMS: 30000, // 30 second timeout
      lean: true 
    };
    
    // Use Promise.all to run queries in parallel
    const [totalArtists, totalReleases, planCounts, popularArtists] = await Promise.allSettled([
      // Count total artists
      Artist.countDocuments().maxTimeMS(30000),
      
      // Count total releases
      Release.countDocuments().maxTimeMS(30000),
      
      // Get counts of artists by plan type (as a single promise)
      Promise.allSettled([
        Artist.countDocuments({ 'plans.type': 'basic', 'plans.status': 'active' }).maxTimeMS(30000),
        Artist.countDocuments({ 'plans.type': 'pro', 'plans.status': 'active' }).maxTimeMS(30000),
        Artist.countDocuments({ 'plans.type': 'premium', 'plans.status': 'active' }).maxTimeMS(30000),
        Artist.countDocuments({ 'plans.type': 'aoc', 'plans.status': 'active' }).maxTimeMS(30000)
      ]),
      
      // Get top 5 artists by follower count
      Artist.find({}, null, { ...queryOptions, limit: 10 })
        .sort({ 'spotifyData.followers': -1 })
        .select('name slug image spotifyData.followers spotifyData.images')
        .lean()
        .maxTimeMS(30000)
    ]);

    // Extract values or use defaults for failed promises
    const artistCount = totalArtists.status === 'fulfilled' ? totalArtists.value : 0;
    const releaseCount = totalReleases.status === 'fulfilled' ? totalReleases.value : 0;
    
    // Mock some statistics (these don't hit the database)
    const totalStreams = 25000;
    const growthRate = 15;
    
    // Process plan counts
    let plans = { basic: 0, pro: 0, premium: 0, aoc: 0 };
    if (planCounts.status === 'fulfilled') {
      const [basic, pro, premium, aoc] = planCounts.value;
      plans = {
        basic: basic.status === 'fulfilled' ? basic.value : 0,
        pro: pro.status === 'fulfilled' ? pro.value : 0,
        premium: premium.status === 'fulfilled' ? premium.value : 0,
        aoc: aoc.status === 'fulfilled' ? aoc.value : 0
      };
    }
    
    // Process artists
    let formattedArtists = [];
    if (popularArtists.status === 'fulfilled' && popularArtists.value) {
      formattedArtists = popularArtists.value.map(artist => ({
        _id: artist._id.toString(),
        name: artist.name,
        slug: artist.slug,
        image: artist.image || (artist.spotifyData?.images?.[0]?.url),
        followers: artist.spotifyData?.followers || 0,
      }));
    }
    
    return NextResponse.json({
      totalArtists: artistCount,
      totalReleases: releaseCount,
      totalStreams,
      growthRate,
      planCounts: plans,
      popularArtists: formattedArtists
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch dashboard statistics',
        totalArtists: 0,
        totalReleases: 0,
        totalStreams: 0,
        growthRate: 0,
        planCounts: { basic: 0, pro: 0, premium: 0, aoc: 0 },
        popularArtists: []
      },
      { status: 500 }
    );
  }
} 