import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Artist from '@/models/Artist';

/**
 * GET /api/artists/spotify/[spotifyId]
 * Retrieve an artist by their Spotify ID
 */
export async function GET(request, { params }) {
  const { spotifyId } = params;
  
  if (!spotifyId) {
    return NextResponse.json(
      { error: 'Spotify artist ID is required' },
      { status: 400 }
    );
  }
  
  try {
    await connectToDatabase();
    
    // Find artist by Spotify ID
    const artist = await Artist.findOne({ spotifyArtistId: spotifyId });
    
    if (artist) {
      return NextResponse.json(artist);
    } else {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error finding artist by Spotify ID:', error);
    return NextResponse.json(
      { error: 'Failed to find artist' },
      { status: 500 }
    );
  }
} 