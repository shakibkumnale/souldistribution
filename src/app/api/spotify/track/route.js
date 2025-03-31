import { NextResponse } from 'next/server';
import { fetchTrackFromSpotify, findOrCreateArtistFromSpotify } from '@/lib/api';
import { connectToDatabase } from '@/lib/db';
import Artist from '@/models/Artist';

/**
 * GET /api/spotify/track?trackId=xxx
 * Fetches track data from Spotify and processes artists
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const trackId = searchParams.get('trackId');
    
    if (!trackId) {
      return NextResponse.json(
        { error: 'Track ID is required' },
        { status: 400 }
      );
    }
    
    // Fetch track data from Spotify API
    const trackData = await fetchTrackFromSpotify(trackId);
    
    // Process artists if requested
    if (searchParams.get('processArtists') === 'true') {
      await connectToDatabase();
      
      // Find or create all artists from the track
      const processedArtists = await Promise.all(
        trackData.artists.map(async (artist) => {
          try {
            // Check if artist exists in our database
            let artistDoc = await Artist.findOne({ spotifyArtistId: artist.id });
            
            if (!artistDoc) {
              // Get detailed artist data from Spotify
              const artistData = await findOrCreateArtistFromSpotify(artist.id);
              
              // Return the processed artist data
              return {
                id: artistData.id || artistData._id,
                name: artistData.name,
                spotifyArtistId: artist.id
              };
            } else {
              // Return existing artist data
              return {
                id: artistDoc._id.toString(),
                name: artistDoc.name,
                spotifyArtistId: artistDoc.spotifyArtistId
              };
            }
          } catch (error) {
            console.error(`Error processing artist ${artist.id}:`, error);
            return {
              id: null,
              name: artist.name,
              spotifyArtistId: artist.id,
              error: error.message
            };
          }
        })
      );
      
      // Add processed artists to the response
      trackData.processedArtists = processedArtists.filter(a => a.id !== null);
    }
    
    return NextResponse.json(trackData);
  } catch (error) {
    console.error('Error fetching track data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch track data', message: error.message },
      { status: 500 }
    );
  }
} 