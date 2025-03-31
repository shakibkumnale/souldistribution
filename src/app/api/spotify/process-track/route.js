import { NextResponse } from 'next/server';
import { processSpotifyTrackResponse, findOrCreateArtistFromSpotify } from '@/lib/api';
import { connectToDatabase } from '@/lib/db';
import Artist from '@/models/Artist';

/**
 * POST /api/spotify/process-track
 * Processes Spotify track data received directly from the Spotify API
 * Body should contain the raw Spotify track response
 */
export async function POST(request) {
  try {
    const spotifyTrackData = await request.json();
    
    if (!spotifyTrackData || !spotifyTrackData.id) {
      return NextResponse.json(
        { error: 'Invalid Spotify track data' },
        { status: 400 }
      );
    }
    
    // Process the track data into our format
    const formattedTrackData = processSpotifyTrackResponse(spotifyTrackData);
    
    // Check if we should process the artists
    const url = new URL(request.url);
    if (url.searchParams.get('processArtists') === 'true') {
      await connectToDatabase();
      
      // Process all artists from the track
      const processedArtists = await Promise.all(
        formattedTrackData.artists.map(async (artist) => {
          try {
            // Check if artist exists in our database
            let artistDoc = await Artist.findOne({ spotifyArtistId: artist.id });
            
            if (!artistDoc) {
              // Create new artist or fetch from Spotify
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
      formattedTrackData.processedArtists = processedArtists.filter(a => a.id !== null);
      
      // Create an array of artist IDs for direct use in the form
      formattedTrackData.artistIds = processedArtists
        .filter(a => a.id !== null)
        .map(a => a.id);
    }
    
    return NextResponse.json(formattedTrackData);
  } catch (error) {
    console.error('Error processing Spotify track data:', error);
    return NextResponse.json(
      { error: 'Failed to process track data', message: error.message },
      { status: 500 }
    );
  }
} 