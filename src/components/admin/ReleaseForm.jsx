'use client';

// src/components/admin/ReleaseForm.jsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  extractSpotifyId, 
  fetchTrackFromSpotify,
  findOrCreateArtistFromSpotify
} from '@/lib/api';
import { generateSlug } from '@/lib/utils';
import { AlertCircle, Loader2, Plus, RefreshCw, Music, Search, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ArtistDebugInfo from './ArtistDebugInfo';

// Helper function to ensure all ObjectId instances are properly serialized
function ensureString(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value.toString) return value.toString();
  return String(value);
}

// Helper function to get current date in YYYY-MM-DD format
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Hardcoded fallback credentials for client-side use only
// This is a development workaround - in production, use proper env configuration
const FALLBACK_SPOTIFY_CREDENTIALS = {
  clientId: 'bfb9acc3c59546cf83af6a72b11958d1',
  clientSecret: '8658afe86f884816ad6431d3d21f917f'
};

export default function ReleaseForm({ initialData, artists, onSubmit, spotifyData }) {
  // Process initialData to ensure all IDs are strings
  const processedInitialData = initialData ? {
    ...initialData,
    _id: ensureString(initialData._id),
    artists: initialData.artists?.map(artist => {
      if (typeof artist === 'string') return artist;
      return {
        ...artist,
        _id: ensureString(artist._id)
      };
    }) || []
  } : null;

  // Process artists list to ensure all IDs are strings
  const processedArtists = artists?.map(artist => ({
    ...artist,
    _id: ensureString(artist._id)
  })) || [];

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    releaseDate: initialData?.releaseDate || getCurrentDate(),
    artists: [], // Store array of artist IDs instead of single artist
    coverImage: '',
    spotifyUrl: initialData?.spotifyUrl || '',
    spotifyTrackId: initialData?.spotifyTrackId || '',
    appleMusicUrl: initialData?.appleMusicUrl || '',
    youtubeUrl: initialData?.youtubeUrl || '',
    featured: initialData?.featured || true,
    type: 'Single',
    featuringArtists: [],
    royaltyPercentage: 100,
    isrc: initialData?.isrc || '',
    duration_ms: 0,
    landrTrackId: initialData?.landrTrackId || '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [spotifyLoading, setSpotifyLoading] = useState(false);
  const [artistLoading, setArtistLoading] = useState(false);
  const [error, setError] = useState('');
  const [artistsList, setArtistsList] = useState(processedArtists);
  const [spotifyArtists, setSpotifyArtists] = useState([]);
  const [spotifyTrackIdInput, setSpotifyTrackIdInput] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  
  // Add effect to process spotifyData if provided as prop
  useEffect(() => {
    if (spotifyData && Object.keys(spotifyData).length > 0 && spotifyData.id) {
      processSpotifyTrackData(spotifyData);
    }
  }, [spotifyData]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Log landrTrackId changes to debug
    if (name === 'landrTrackId') {
      console.log('Updating landrTrackId:', value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Auto-generate slug from title
    if (name === 'title' && (!initialData || !initialData.slug)) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }

    // Update Spotify URL when track ID changes
    if (name === 'spotifyTrackId' && value) {
      setFormData(prev => ({
        ...prev,
        spotifyUrl: `https://open.spotify.com/track/${value}`
      }));
    }
  };
  
  const handleSelectChange = (name, value) => {
    if (name === 'selectedArtist') {
      setSelectedArtist(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const addArtistToRelease = () => {
    if (!selectedArtist) return;
    
    // Get the artist ID, handling both string IDs and object references
    const artistId = typeof selectedArtist === 'object' 
      ? ensureString(selectedArtist.id || selectedArtist._id)
      : selectedArtist;
    
    // Check if this artist is already in the list
    if (formData.artists.some(art => {
      const artId = typeof art === 'string' 
        ? art 
        : ensureString(art.id || art._id);
      return artId === artistId;
    })) {
      return; // Artist already in the list
    }
    
    // Find the full artist object from the list
    const artistObject = artistsList.find(art => {
      return ensureString(art._id) === artistId || 
             (art.spotifyArtistId && selectedArtist.spotifyArtistId && 
              art.spotifyArtistId === selectedArtist.spotifyArtistId);
    });
    
    setFormData(prev => ({
      ...prev,
      artists: [...prev.artists, artistObject || artistId]
    }));
    
    setSelectedArtist('');
  };
  
  const removeArtistFromRelease = (artistToRemove) => {
    const artistToRemoveId = typeof artistToRemove === 'string' 
      ? artistToRemove
      : ensureString(artistToRemove._id || artistToRemove.id);
    
    setFormData(prev => ({
      ...prev,
      artists: prev.artists.filter(art => {
        const artId = typeof art === 'string' 
          ? art 
          : ensureString(art._id || art.id);
        
        return artId !== artistToRemoveId;
      })
    }));
  };
  
  const handleSpotifyFetch = async () => {
    if (!formData.spotifyUrl) {
      setError("Please enter a Spotify URL");
      return;
    }
    
    setSpotifyLoading(true);
    setError('');
    
    try {
      const trackId = extractSpotifyId(formData.spotifyUrl);
      if (!trackId) {
        throw new Error("Invalid Spotify URL");
      }
      
      await fetchAndProcessTrack(trackId);
      
    } catch (err) {
      console.error('Error fetching Spotify data:', err);
      setError(err.message || 'Failed to fetch track data from Spotify');
    } finally {
      setSpotifyLoading(false);
    }
  };
  
  const handleSpotifyIdFetch = async () => {
    if (!spotifyTrackIdInput) {
      setError("Please enter a Spotify Track ID");
      return;
    }
    
    setSpotifyLoading(true);
    setError('');
    
    try {
      await fetchAndProcessTrack(spotifyTrackIdInput);
      
      // Update the form's spotifyTrackId field
      setFormData(prev => ({
        ...prev,
        spotifyTrackId: spotifyTrackIdInput,
        spotifyUrl: `https://open.spotify.com/track/${spotifyTrackIdInput}`
      }));
      
    } catch (err) {
      console.error('Error fetching Spotify data by ID:', err);
      setError(err.message || 'Failed to fetch track data from Spotify');
    } finally {
      setSpotifyLoading(false);
    }
  };
  
  const fetchAndProcessTrack = async (trackId) => {
    try {
      // Fetch track data from Spotify
      const trackData = await fetchTrackFromSpotify(trackId);
      
      // Store Spotify artists for potential creation
      setSpotifyArtists(trackData.artists);
      
      // Update form data with track info, but don't reset artists yet
      setFormData(prev => ({
        ...prev,
        title: trackData.title,
        slug: generateSlug(trackData.title),
        coverImage: trackData.coverImage,
        releaseDate: trackData.releaseDate,
        type: trackData.type,
        spotifyTrackId: trackData.trackId,
        spotifyAlbumId: trackData.albumId,
        duration_ms: trackData.duration_ms,
        isrc: trackData.isrc,
        popularity: trackData.popularity,
        royaltyPercentage: 100, // Default to 100%
      }));
      
      // Process all artists from the track and collect their IDs
      const artistIds = [];
      const artistsToProcess = [...trackData.artists]; // Clone the array to avoid modifying the original
      
      // Process artists sequentially to maintain order
      for (const artist of artistsToProcess) {
        try {
          const artistData = await handleCreateArtistFromSpotify(artist.id);
          if (artistData && (artistData.id || artistData._id)) {
            const artistId = artistData.id || artistData._id;
            artistIds.push(artistId);
          }
        } catch (error) {
          console.error(`Error processing artist ${artist.name}:`, error);
        }
      }
      
      // Update the artists array with collected IDs
      if (artistIds.length > 0) {
        setFormData(prev => ({
          ...prev,
          artists: artistIds
        }));
      }
    } catch (error) {
      console.error("Error processing track data:", error);
      throw new Error(error.message || "Failed to process track data");
    }
  };
  
  const handleCreateArtistFromSpotify = async (spotifyArtistId) => {
    if (!spotifyArtistId) return null;
    
    setArtistLoading(true);
    setError('');
    
    try {
      // Find the artist from spotifyArtists if it exists
      const spotifyArtistData = spotifyArtists.find(a => a.id === spotifyArtistId);
      
      // Check if the artist already exists in our local list
      const existingArtist = artistsList.find(a => 
        (a.spotifyArtistId === spotifyArtistId) || 
        (a.id === `spotify-${spotifyArtistId}`) || 
        (a._id === `spotify-${spotifyArtistId}`)
      );
      
      if (existingArtist) {
        setArtistLoading(false);
        return existingArtist;
      }
      
      // Create or find the artist from Spotify
      const artistData = await findOrCreateArtistFromSpotify(spotifyArtistId);
      
      // Add name from the spotifyArtists array if available
      if (artistData && spotifyArtistData && spotifyArtistData.name) {
        artistData.name = spotifyArtistData.name;
      }
      
      // Add to our local artists list
      setArtistsList(prev => {
        if (!prev.some(a => (a.id || a._id) === (artistData.id || artistData._id))) {
          return [...prev, artistData];
        }
        return prev;
      });
      
      setArtistLoading(false);
      return artistData;
    } catch (err) {
      console.error('Error creating artist:', err);
      setError(err.message || 'Failed to create artist from Spotify');
      setArtistLoading(false);
      
      // Create a fallback artist with just the ID and a generic name
      // This ensures we still get an artist in the form even if API calls fail
      const fallbackArtist = {
        id: `spotify-${spotifyArtistId}`,
        name: spotifyArtists.find(a => a.id === spotifyArtistId)?.name || 'Spotify Artist',
        spotifyArtistId: spotifyArtistId
      };
      
      // Add fallback artist to our list
      setArtistsList(prev => {
        if (!prev.some(a => (a.id || a._id) === fallbackArtist.id)) {
          return [...prev, fallbackArtist];
        }
        return prev;
      });
      
      return fallbackArtist;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Make sure we have at least one artist
      if (!formData.artists || formData.artists.length === 0) {
        throw new Error('Please add at least one artist to the release');
      }
      
      // Prepare the submission data
      const submissionData = {
        ...formData,
        // Ensure artists is an array of artist IDs, handling both MongoDB IDs and Spotify IDs
        artists: formData.artists.map(artistId => {
          // If the artist ID is an object, extract the ID
          if (typeof artistId === 'object') {
            // Use _id for MongoDB objects or id for custom objects
            return artistId._id || artistId.id;
          }
          
          // For string IDs, keep them as is - the API will handle validation
          return artistId;
        }).filter(Boolean), // Remove any null/undefined values
        
        // Convert release date to ISO string if needed
        releaseDate: new Date(formData.releaseDate).toISOString()
      };
      
      // Log the submission data for debugging
      console.log('Submitting release with artists:', submissionData.artists);
      console.log('landrTrackId value being submitted:', submissionData.landrTrackId);
      
      // Submit the form
      await onSubmit(submissionData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error.message || 'Error submitting the form');
    } finally {
      setIsLoading(false);
    }
  };

  // Display function to get artist name 
  const getArtistNameById = (id) => {
    const artistId = ensureString(id);
    const artist = artistsList.find(a => ensureString(a._id) === artistId || a.spotifyArtistId === artistId);
    return artist ? artist.name : 'Unknown Artist';
  };
  
  // Add a method to process direct Spotify track data
  const processSpotifyTrackData = async (trackData) => {
    if (!trackData || !trackData.id) {
      setError("Invalid track data provided");
      return;
    }
    
    setSpotifyLoading(true);
    setError('');
    
    try {
      // Extract and process the artists directly
      const spotifyArtists = trackData.artists || [];
      
      // Format basic track data
      const processedData = {
        title: trackData.name,
        trackId: trackData.id,
        spotifyTrackId: trackData.id,
        duration_ms: trackData.duration_ms,
        isrc: trackData.external_ids?.isrc,
        popularity: trackData.popularity,
        releaseDate: trackData.album?.release_date || new Date().toISOString().split('T')[0],
        coverImage: trackData.album?.images?.[0]?.url,
        type: trackData.album?.album_type === 'album' ? 'Album' : 
              trackData.album?.album_type === 'single' ? 'Single' : 'EP',
        spotifyUrl: trackData.external_urls?.spotify,
        albumId: trackData.album?.id,
      };
      
      // Update form with basic data first
      setFormData(prev => ({
        ...prev,
        ...processedData,
        slug: generateSlug(processedData.title),
        royaltyPercentage: 100,
        // Preserve the existing landrTrackId if it exists
        landrTrackId: prev.landrTrackId || '',
      }));
      
      // Store Spotify artists
      setSpotifyArtists(spotifyArtists);
      
      // Process each artist and collect IDs
      const artistIds = [];
      
      for (const artist of spotifyArtists) {
        try {
          const artistData = await handleCreateArtistFromSpotify(artist.id);
          if (artistData && (artistData.id || artistData._id)) {
            const artistId = artistData.id || artistData._id;
            
            // Only add unique artist IDs
            if (!artistIds.includes(artistId)) {
              artistIds.push(artistId);
            }
          }
        } catch (error) {
          console.error(`Error processing artist ${artist.name}:`, error);
        }
      }
      
      // Update the artists array with collected IDs
      if (artistIds.length > 0) {
        setFormData(prev => ({
          ...prev,
          artists: artistIds
        }));
      }
      
    } catch (error) {
      console.error('Error processing Spotify track data:', error);
      setError(error.message || 'Failed to process track data');
    } finally {
      setSpotifyLoading(false);
    }
  };

  // Add a method to handle raw Spotify data from console/network tab
  const handleRawSpotifyData = () => {
    // Prompt the user to paste the Spotify track data
    const rawData = prompt("Paste Spotify track JSON data:");
    
    if (!rawData) return;
    
    try {
      // Parse the raw JSON data
      const trackData = JSON.parse(rawData);
      
      // Process the data
      processSpotifyTrackData(trackData);
    } catch (error) {
      console.error("Error parsing Spotify data:", error);
      setError("Invalid JSON data. Please make sure to copy the entire response.");
    }
  };

  return (
    <form
      id="release-form"
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Spotify Track Import */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Import from Spotify</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="spotifyUrl">Spotify Track URL</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="spotifyUrl"
                name="spotifyUrl"
                value={formData.spotifyUrl || ''}
                onChange={handleChange}
                placeholder="https://open.spotify.com/track/..."
              />
              <Button 
                type="button" 
                onClick={handleSpotifyFetch} 
                disabled={spotifyLoading || !formData.spotifyUrl}
                variant="secondary"
              >
                {spotifyLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="spotifyTrackId">Spotify Track ID</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="spotifyTrackIdInput"
                value={spotifyTrackIdInput}
                onChange={(e) => setSpotifyTrackIdInput(e.target.value)}
                placeholder="4uLU6hMCjMI75M1A2tKUQC"
              />
              <Button 
                type="button" 
                onClick={handleSpotifyIdFetch} 
                disabled={spotifyLoading || !spotifyTrackIdInput}
                variant="secondary"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Basic Release Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Release Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title*</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
              className="mt-1"
          />
        </div>
        
          <div>
            <Label htmlFor="slug">Slug*</Label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="releaseDate">Release Date*</Label>
            <Input
              id="releaseDate"
              name="releaseDate"
              type="date"
              value={formData.releaseDate}
              onChange={handleChange}
              required
              className="mt-1"
        />
      </div>
      
          <div>
            <Label htmlFor="type">Release Type*</Label>
        <Select 
          value={formData.type} 
          onValueChange={(value) => handleSelectChange('type', value)}
        >
              <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Single">Single</SelectItem>
            <SelectItem value="EP">EP</SelectItem>
            <SelectItem value="Album">Album</SelectItem>
          </SelectContent>
        </Select>
          </div>
      </div>
      
        <div>
          <Label htmlFor="coverImage">Cover Image URL*</Label>
          <Input
            id="coverImage"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            required
            className="mt-1"
            placeholder="https://example.com/image.jpg"
          />
          
          {formData.coverImage && (
            <div className="mt-2 relative w-24 h-24">
              <img 
                src={formData.coverImage} 
                alt="Cover preview" 
                className="w-full h-full object-cover rounded"
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Artists */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Artists</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="selectedArtist">Add Artist*</Label>
            <div className="flex gap-2 mt-1">
              <Select
                value={selectedArtist}
                onValueChange={(value) => handleSelectChange('selectedArtist', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select artist" />
                </SelectTrigger>
                <SelectContent>
                  {artistsList.map((artist) => (
                    <SelectItem key={ensureString(artist._id)} value={ensureString(artist._id)}>
                      {artist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                onClick={addArtistToRelease}
                variant="outline"
                disabled={!selectedArtist}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Selected Artists List */}
        <div className="space-y-2">
          <Label>Selected Artists</Label>
          
          {formData.artists && formData.artists.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-1">
              {formData.artists.map((artist, index) => {
                const artistId = typeof artist === 'string' ? artist : ensureString(artist._id || artist.id);
                const artistName = typeof artist === 'string' ? getArtistNameById(artist) : artist.name;
                
                return (
                  <div 
                    key={`${artistId}-${index}`}
                    className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded px-2 py-1"
                  >
                    <span className="text-sm">{artistName}</span>
                    <button 
                      type="button"
                      onClick={() => removeArtistFromRelease(artist)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-1">No artists selected</p>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Additional Links & Data</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="appleMusicUrl">Apple Music URL</Label>
            <Input
              id="appleMusicUrl"
              name="appleMusicUrl"
              value={formData.appleMusicUrl || ''}
              onChange={handleChange}
              className="mt-1"
              placeholder="https://music.apple.com/album/..."
            />
          </div>
          
          <div>
            <Label htmlFor="youtubeUrl">YouTube URL</Label>
            <Input
              id="youtubeUrl"
              name="youtubeUrl"
              value={formData.youtubeUrl || ''}
              onChange={handleChange}
              className="mt-1"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
          <Label htmlFor="isrc">ISRC</Label>
          <Input
            id="isrc"
            name="isrc"
            value={formData.isrc || ''}
            onChange={handleChange}
              className="mt-1"
              placeholder="e.g. USRC12345678"
          />
        </div>
        
          <div>
          <Label htmlFor="royaltyPercentage">Royalty Percentage</Label>
          <Input
            id="royaltyPercentage"
            name="royaltyPercentage"
            type="number"
            min="0"
            max="100"
            value={formData.royaltyPercentage || 100}
            onChange={handleChange}
              className="mt-1"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="landrTrackId">Landr Track ID</Label>
          <Input
            id="landrTrackId"
            name="landrTrackId"
            value={formData.landrTrackId || ''}
            onChange={handleChange}
            className="mt-1"
            placeholder="Enter Landr Track ID"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          name="featured"
            checked={formData.featured || false}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, featured: checked }))
            }
        />
          <Label htmlFor="featured">Featured Release</Label>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="bg-purple-600 hover:bg-purple-700 w-full"
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {initialData ? 'Update Release' : 'Create Release'}
        </Button>
    </form>
  );
}