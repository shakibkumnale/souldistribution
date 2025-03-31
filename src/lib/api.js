/**
 * API Helper functions for making requests to external services
 */
import { getSpotifyAccessToken, refreshSpotifyToken } from './spotify-auth';
import { generateSlug } from './utils';

// Fetch data from Spotify API with automatic token handling
export async function fetchFromSpotify(endpoint, token = null) {
    try {
      // If token is not provided, get it from the auth utility
      if (!token) {
        token = await getSpotifyAccessToken();
      }
      
      const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        // If unauthorized (401), the token might be invalid
        if (response.status === 401) {
          console.log('Spotify token expired, refreshing...');
          // Refresh the token and try again
          const newToken = await refreshSpotifyToken();
          return fetchFromSpotify(endpoint, newToken);
        }
        
        throw new Error(`Spotify API error: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Spotify API error:', error);
      throw error;
    }
}

// Fetch artist data from Spotify
export async function fetchArtistFromSpotify(artistId, token = null) {
  try {
    return await fetchFromSpotify(`/artists/${artistId}`, token);
  } catch (error) {
    console.error('Error fetching artist from Spotify:', error);
    throw error;
  }
}

/**
 * Fetch detailed artist information from Spotify
 * @param {string} artistId - Spotify artist ID
 * @param {string} token - Optional Spotify access token
 * @returns {Promise<object>} Artist details formatted for our system
 */
export async function fetchArtistDetailsFromSpotify(artistId, token = null) {
  try {
    const artistData = await fetchArtistFromSpotify(artistId, token);
    
    // Extract artist information in our format
    const formattedArtist = {
      name: artistData.name,
      slug: generateSlug(artistData.name),
      bio: `Artist information fetched from Spotify. ${artistData.name} has ${artistData.followers?.total || 0} followers.`,
      image: artistData.images?.[0]?.url || '/images/placeholder-artist.jpg',
      spotifyUrl: artistData.external_urls?.spotify,
      spotifyArtistId: artistData.id,
      spotifyData: {
        followers: artistData.followers?.total,
        genres: artistData.genres || [],
        popularity: artistData.popularity,
        images: artistData.images || [],
        external_urls: artistData.external_urls,
        uri: artistData.uri
      },
      isVerified: false,
      featured: false
    };
    
    return formattedArtist;
  } catch (error) {
    console.error('Error fetching detailed artist info from Spotify:', error);
    throw error;
  }
}

/**
 * Check if an artist exists in our database, and create one if it doesn't
 * @param {string} spotifyArtistId - Spotify artist ID
 * @returns {Promise<object>} Artist object (either existing or newly created)
 */
export async function findOrCreateArtistFromSpotify(spotifyArtistId) {
  try {
    // First check if the artist already exists in our system
    try {
      const response = await fetch(`/api/artists/spotify/${spotifyArtistId}`);
      
      if (response.ok) {
        // Artist exists, return it
        return await response.json();
      }
    } catch (error) {
      console.error('Error checking if artist exists:', error);
      // Continue to create the artist if checking failed
    }
    
    // Artist doesn't exist or check failed, fetch details from Spotify
    const artistData = await fetchArtistDetailsFromSpotify(spotifyArtistId);
    
    // Create a new artist in our database
    try {
      const response = await fetch('/api/artists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: artistData.name,
          slug: generateSlug(artistData.name),
          bio: artistData.bio || `Artist information for ${artistData.name}`,
          image: artistData.image || 'https://placehold.co/400x400/000000/FFFFFF?text=Artist',
          spotifyArtistId: spotifyArtistId,
          spotifyUrl: artistData.spotifyUrl,
          spotifyData: artistData.spotifyData || {}
        })
      });
      
      if (response.ok) {
        // Return the newly created artist
        return await response.json();
      } else {
        // If creation failed, return a temporary artist object
        console.error('Failed to create artist in database, using temporary object');
        return {
          id: `spotify-${spotifyArtistId}`,
          name: artistData.name,
          slug: generateSlug(artistData.name),
          spotifyArtistId: spotifyArtistId,
          image: artistData.image || 'https://placehold.co/400x400/000000/FFFFFF?text=Artist'
        };
      }
    } catch (error) {
      console.error('Error creating artist in database:', error);
      // Return a temporary artist object if database creation fails
      return {
        id: `spotify-${spotifyArtistId}`,
        name: artistData.name,
        slug: generateSlug(artistData.name),
        spotifyArtistId: spotifyArtistId,
        image: artistData.image || 'https://placehold.co/400x400/000000/FFFFFF?text=Artist'
      };
    }
  } catch (error) {
    console.error('Error finding or creating artist:', error);
    throw error;
  }
}

// Fetch artist's top tracks from Spotify
export async function fetchArtistTopTracks(artistId, token = null, market = 'US') {
  try {
    return await fetchFromSpotify(`/artists/${artistId}/top-tracks?market=${market}`, token);
  } catch (error) {
    console.error('Error fetching artist top tracks from Spotify:', error);
    throw error;
  }
}

// Fetch artist's albums from Spotify
export async function fetchArtistAlbums(artistId, token = null, limit = 10) {
  try {
    return await fetchFromSpotify(`/artists/${artistId}/albums?limit=${limit}`, token);
  } catch (error) {
    console.error('Error fetching artist albums from Spotify:', error);
    throw error;
  }
}

/**
 * Fetch track details from Spotify
 * @param {string} trackId - Spotify track ID
 * @param {string} token - Optional Spotify access token
 * @returns {Promise<object>} Track details
 */
export async function fetchTrackFromSpotify(trackId, token = null) {
  try {
    // Check if Spotify credentials are configured
    let clientId = process.env.SPOTIFY_CLIENT_ID;
    let clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    // For development only: fallback to hardcoded values if env vars are missing
    if (!clientId || !clientSecret) {
      console.warn('WARNING: Using hardcoded fallback Spotify credentials. This should NOT be used in production!');
      
      // Fallback development-only credentials
      clientId = 'bfb9acc3c59546cf83af6a72b11958d1';
      clientSecret = '8658afe86f884816ad6431d3d21f917f';
      
      // Still log the error to make it clear there's a configuration issue
      console.error('Environment variables SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET should be properly configured.');
    }

    // In case both env vars and fallbacks are missing (shouldn't happen with our fallbacks)
    if (!clientId || !clientSecret) {
      throw new Error('Spotify client ID or client secret not configured. Please check your environment variables.');
    }

    const trackData = await fetchFromSpotify(`/tracks/${trackId}`, token);
    
    // Extract important information
    const releaseData = {
      // Basic track info
      title: trackData.name,
      trackId: trackData.id,
      duration_ms: trackData.duration_ms,
      isrc: trackData.external_ids?.isrc,
      popularity: trackData.popularity,
      
      // Album info
      type: trackData.album.album_type === 'album' ? 'Album' : 
            trackData.album.album_type === 'single' ? 'Single' : 'EP',
      albumName: trackData.album.name,
      albumId: trackData.album.id,
      releaseDate: trackData.album.release_date,
      coverImage: trackData.album.images[0]?.url,
      
      // External URLs
      spotifyUrl: trackData.external_urls.spotify,
      
      // Artists info
      artists: trackData.artists.map(artist => ({
        name: artist.name,
        id: artist.id,
        uri: artist.uri
      })),
      
      // Set default values
      royaltyPercentage: 100, // Default to 100%
    };
    
    return releaseData;
  } catch (error) {
    console.error('Error fetching track from Spotify:', error);
    throw error;
  }
}

// Extract Spotify ID from various Spotify URL formats
export function extractSpotifyId(url, type = 'track') {
  if (!url) return null;
  
  try {
    // Handle full URLs
    if (url.includes('spotify.com')) {
      const parts = url.split('/');
      const idPart = parts[parts.length - 1];
      
      // Handle URLs with query parameters
      if (idPart.includes('?')) {
        return idPart.split('?')[0];
      }
      return idPart;
    }
    
    // Handle Spotify URIs (spotify:track:1234567)
    if (url.startsWith('spotify:')) {
      const parts = url.split(':');
      if (parts.length >= 3 && parts[1] === type) {
        return parts[2];
      }
    }
    
    // If it's just the ID itself
    if (url.match(/^[0-9A-Za-z]{22}$/)) {
      return url;
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting Spotify ID:', error);
    return null;
  }
}

// Fetch featured artists from database
export async function fetchFeaturedArtists(limit = 5) {
  try {
    const response = await fetch('/api/artists/featured?limit=' + limit);
    if (!response.ok) {
      throw new Error('Failed to fetch featured artists');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured artists:', error);
    return [];
  }
}
  
// Fetch Instagram feed
export async function fetchInstagramFeed(token, count = 6) {
  try {
    // This would use the Instagram Graph API in production
    // For now, we'll return placeholder data
    return Array(count).fill(null).map((_, i) => ({
      id: `post-${i}`,
      image: `/images/placeholder-cover.jpg`,
      url: 'https://instagram.com/',
      caption: 'Check out our latest release!',
    }));
  } catch (error) {
    console.error('Instagram API error:', error);
    return [];
  }
}
  
// Fetch YouTube videos
export async function fetchYoutubeVideos(channelId, count = 4) {
  try {
    // This would use the YouTube API in production
    // For now, we'll return placeholder data
    return Array(count).fill(null).map((_, i) => ({
      id: `video-${i}`,
      title: `Music Video ${i + 1}`,
      thumbnail: `/images/placeholder-cover.jpg`,
      embedUrl: `https://www.youtube.com/embed/dQw4w9WgXcQ`,
    }));
  } catch (error) {
    console.error('YouTube API error:', error);
    return [];
  }
}

/**
 * Process a raw Spotify track response into our application format
 * @param {object} trackResponse - The raw Spotify API track response
 * @returns {object} Formatted track data for our application
 */
export function processSpotifyTrackResponse(trackResponse) {
  try {
    if (!trackResponse || !trackResponse.id) {
      throw new Error('Invalid track response from Spotify');
    }

    // Extract track data from response
    return {
      // Basic track info
      title: trackResponse.name,
      trackId: trackResponse.id,
      duration_ms: trackResponse.duration_ms,
      isrc: trackResponse.external_ids?.isrc,
      popularity: trackResponse.popularity,
      
      // Album info
      type: trackResponse.album.album_type === 'album' ? 'Album' : 
            trackResponse.album.album_type === 'single' ? 'Single' : 'EP',
      albumName: trackResponse.album.name,
      albumId: trackResponse.album.id,
      releaseDate: trackResponse.album.release_date,
      coverImage: trackResponse.album.images[0]?.url,
      
      // External URLs
      spotifyUrl: trackResponse.external_urls.spotify,
      
      // Artists info
      artists: trackResponse.artists.map(artist => ({
        name: artist.name,
        id: artist.id,
        uri: artist.uri
      })),
      
      // Set default values
      royaltyPercentage: 100, // Default to 100%
    };
  } catch (error) {
    console.error('Error processing Spotify track response:', error);
    throw error;
  }
}