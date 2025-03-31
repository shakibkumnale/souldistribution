import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Artist from '@/models/Artist';
import Release from '@/models/Release';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Count total artists
    const totalArtists = await Artist.countDocuments();
    
    // Count total releases
    const totalReleases = await Release.countDocuments();
    
    // Mock some statistics
    const totalStreams = 25000;
    const growthRate = 15;
    
    // Get counts of artists by plan type
    const planCounts = {
      basic: await Artist.countDocuments({ 'plans.type': 'basic', 'plans.status': 'active' }),
      pro: await Artist.countDocuments({ 'plans.type': 'pro', 'plans.status': 'active' }),
      premium: await Artist.countDocuments({ 'plans.type': 'premium', 'plans.status': 'active' }),
      aoc: await Artist.countDocuments({ 'plans.type': 'aoc', 'plans.status': 'active' }),
    };
    
    // Get top 5 artists by follower count (increased from 3 to 5)
    const popularArtists = await Artist.find({})
      .sort({ 'spotifyData.followers': -1 })
      .limit(5)
      .lean();
      
    const formattedArtists = popularArtists.map(artist => ({
      _id: artist._id.toString(),
      name: artist.name,
      slug: artist.slug,
      image: artist.image || (artist.spotifyData?.images?.[0]?.url),
      followers: artist.spotifyData?.followers || 0,
    }));
    
    return NextResponse.json({
      totalArtists,
      totalReleases,
      totalStreams,
      growthRate,
      planCounts,
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