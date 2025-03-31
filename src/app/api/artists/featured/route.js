import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Artist from '@/models/Artist';
import { serializeMongoDB } from '@/lib/utils';

// Get featured artists
export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    
    const artists = await Artist.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name slug image spotifyData.genres spotifyData.followers spotifyData.images spotifyData.popularity spotifyUrl')
      .lean();
    
    return NextResponse.json({ 
      artists: serializeMongoDB(artists) 
    });
  } catch (error) {
    console.error('Error fetching featured artists:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 