# Spotify Integration for Soul Distribution

This document explains how the Spotify API integration works in the Soul Distribution platform.

## Overview

The Soul Distribution platform integrates with the Spotify API to fetch and display real artist data. This includes:

1. Artist profile information (name, image, genres, followers)
2. Automatic data population in the admin form
3. Display of real Spotify data on the Featured Artists section

## Setup

### 1. Configure Spotify API Credentials

To use the Spotify integration, you need to set up your Spotify API credentials:

1. Your Spotify API credentials have been added to the `.env.local` file:
   ```
   SPOTIFY_CLIENT_ID=bfb9acc3c59546cf83af6a72b11958d1
   SPOTIFY_CLIENT_SECRET=8658afe86f884816ad6431d3d21f917f
   ```

2. The application will automatically handle token acquisition and refresh using these credentials

### 2. How It Works

The application uses the Client Credentials flow for Spotify API authentication:

1. When a request is made to the Spotify API, the system checks if there's a valid token
2. If no valid token exists, it requests a new one using your Client ID and Secret
3. The token is cached in memory and reused for subsequent requests
4. If a token expires, the system automatically refreshes it

## Using the Integration

### Adding Artists with Spotify Data

1. In the admin panel, go to "Artists"
2. Enter a Spotify Artist ID in the "Spotify Artist ID" field
   - Example ID: `0TnOYISbd1XYRBk9myaseg` (for Pitbull)
   - You can find an artist's ID from their Spotify URL: `https://open.spotify.com/artist/[ID]`
3. Click "Fetch Data" to automatically populate the form with Spotify data including:
   - Artist name
   - Profile image
   - Genres
   - Followers count
   - Popularity rating
4. Fill in any additional fields and click "Save Artist"

### Managing Featured Artists

To display artists in the "Featured Artists" section:

1. When creating or editing an artist, check the "Feature this artist on homepage" option
2. The featured artists will appear on the homepage with their Spotify data (followers, genre)

## API Endpoints

The following API endpoints are available:

- `GET /api/artists` - List all artists
- `POST /api/artists` - Create a new artist (with Spotify data if provided)
- `GET /api/artists/featured` - Get all featured artists
- `GET /api/spotify?artistId=[ID]` - Fetch artist data directly from Spotify API
  - Optional parameters:
    - `includeTopTracks=true` - Include the artist's top tracks
    - `includeAlbums=true` - Include the artist's albums

## Troubleshooting

### API Authorization Issues

If you encounter authorization issues with the Spotify API:

1. Check that your Client ID and Client Secret are correctly set in the `.env.local` file
2. Restart the server to ensure it picks up the new environment variables
3. Check the server logs for any specific error messages

### Missing Data

If some Spotify data is not displaying correctly:

1. Verify the artist exists on Spotify
2. Look at the browser console or server logs for any API errors
3. Make sure the artist has the expected data on Spotify (some artists may not have genres, for example)

## Future Improvements

Planned enhancements:

1. User authentication for user-specific Spotify data
2. Integration with Spotify playback for song previews
3. Adding more artist-related data from Spotify (related artists, etc.) 