/**
 * Spotify authentication utilities
 * Handles token acquisition and refresh using Spotify Client ID and Client Secret
 */

// In-memory token cache (in a production app, consider using Redis or another solution)
let tokenCache = {
  access_token: null,
  expires_at: null,
};

/**
 * Get a valid Spotify access token
 * Will return a cached token if it's still valid, or request a new one if needed
 */
export async function getSpotifyAccessToken() {
  // If we have a cached token that is still valid, return it
  if (tokenCache.access_token && tokenCache.expires_at && Date.now() < tokenCache.expires_at) {
    return tokenCache.access_token;
  }

  // Otherwise, request a new token
  try {
    let clientId = process.env.SPOTIFY_CLIENT_ID;
    let clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    console.log('Environment variables check:');
    console.log('SPOTIFY_CLIENT_ID exists:', !!clientId);
    console.log('SPOTIFY_CLIENT_SECRET exists:', !!clientSecret);

    // For development only: fallback to hardcoded values if env vars are missing
    if (!clientId || !clientSecret) {
      console.warn('WARNING: Using hardcoded fallback Spotify credentials in spotify-auth.js');
      
      // Fallback development-only credentials
      clientId = 'bfb9acc3c59546cf83af6a72b11958d1';
      clientSecret = '8658afe86f884816ad6431d3d21f917f';
    }

    if (!clientId || !clientSecret) {
      throw new Error('Spotify client ID or client secret not configured. Please check your .env file.');
    }

    // Encode client ID and secret for Basic Auth
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    // Request a new token
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get Spotify token: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    // Cache the token with expiration
    tokenCache = {
      access_token: data.access_token,
      expires_at: Date.now() + (data.expires_in * 1000) - 60000, // Subtract 1 minute for safety
    };

    return data.access_token;
  } catch (error) {
    console.error('Error acquiring Spotify access token:', error);
    throw error;
  }
}

/**
 * Force refresh the Spotify token
 * Useful when a token is rejected despite not being expired yet
 */
export async function refreshSpotifyToken() {
  // Clear the token cache
  tokenCache = {
    access_token: null,
    expires_at: null,
  };
  
  // Request a new token
  return await getSpotifyAccessToken();
} 