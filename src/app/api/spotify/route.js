import { NextResponse } from 'next/server';
import { fetchArtistFromSpotify, fetchArtistTopTracks, fetchArtistAlbums } from '@/lib/api';

// Fetch artist data from Spotify
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const artistId = searchParams.get('artistId');
    
    if (!artistId) {
      return NextResponse.json(
        { error: 'Artist ID is required' },
        { status: 400 }
      );
    }
    
    // Get artist data using the updated fetch function that handles token acquisition
    const artistData = await fetchArtistFromSpotify(artistId);
    
    // Build the response
    const responseData = { artist: artistData };
    
    // Optionally fetch top tracks if requested
    if (searchParams.get('includeTopTracks') === 'true') {
      const topTracks = await fetchArtistTopTracks(artistId);
      responseData.topTracks = topTracks.tracks;
    }
    
    // Optionally fetch albums if requested
    if (searchParams.get('includeAlbums') === 'true') {
      const albums = await fetchArtistAlbums(artistId);
      responseData.albums = albums.items;
    }
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching from Spotify API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Spotify', message: error.message },
      { status: 500 }
    );
  }
} 