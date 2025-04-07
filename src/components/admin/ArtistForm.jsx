// src/components/admin/ArtistForm.jsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, XCircle, Music, Youtube } from 'lucide-react';
import { generateSlug } from '@/lib/utils';

export default function ArtistForm({ initialData, onSubmit }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    bio: initialData?.bio || '',
    image: initialData?.image || '',
    spotifyUrl: initialData?.spotifyUrl || '',
    spotifyArtistId: initialData?.spotifyArtistId || '',
    spotifyPlaylists: initialData?.spotifyPlaylists || [],
    youtubeUrl: initialData?.youtubeUrl || '',
    youtubeChannelId: initialData?.youtubeChannelId || '',
    youtubeVideos: initialData?.youtubeVideos || [],
    instagramUrl: initialData?.instagramUrl || '',
    isVerified: initialData?.isVerified || false,
    featured: initialData?.featured || true,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ title: '', description: '', playlistId: '', coverImage: '' });
  const [newVideo, setNewVideo] = useState({ title: '', videoId: '', thumbnail: '' });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from name
    if (name === 'name' && (!initialData || !initialData.slug)) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }
  };

  const handlePlaylistChange = (e) => {
    const { name, value } = e.target;
    setNewPlaylist((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoChange = (e) => {
    const { name, value } = e.target;
    setNewVideo((prev) => ({ ...prev, [name]: value }));
  };

  const addPlaylist = () => {
    if (newPlaylist.title && newPlaylist.playlistId) {
      setFormData(prev => ({
        ...prev,
        spotifyPlaylists: [...prev.spotifyPlaylists, { ...newPlaylist }]
      }));
      setNewPlaylist({ title: '', description: '', playlistId: '', coverImage: '' });
    }
  };

  const removePlaylist = (index) => {
    setFormData(prev => ({
      ...prev,
      spotifyPlaylists: prev.spotifyPlaylists.filter((_, i) => i !== index)
    }));
  };

  const addVideo = () => {
    if (newVideo.title && newVideo.videoId) {
      setFormData(prev => ({
        ...prev,
        youtubeVideos: [...prev.youtubeVideos, { ...newVideo }]
      }));
      setNewVideo({ title: '', videoId: '', thumbnail: '' });
    }
  };

  const removeVideo = (index) => {
    setFormData(prev => ({
      ...prev,
      youtubeVideos: prev.youtubeVideos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Add error handling here
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Artist Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Artist Name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="artist-name"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Artist Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell the artist's story..."
          rows={5}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image">Artist Image URL</Label>
        <Input
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/artist-image.jpg"
          required
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="spotifyUrl">Spotify URL</Label>
          <Input
            id="spotifyUrl"
            name="spotifyUrl"
            value={formData.spotifyUrl}
            onChange={handleChange}
            placeholder="https://open.spotify.com/artist/..."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="spotifyArtistId">Spotify Artist ID</Label>
          <Input
            id="spotifyArtistId"
            name="spotifyArtistId"
            value={formData.spotifyArtistId}
            onChange={handleChange}
            placeholder="Enter Spotify Artist ID"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="youtubeUrl">YouTube URL</Label>
          <Input
            id="youtubeUrl"
            name="youtubeUrl"
            value={formData.youtubeUrl}
            onChange={handleChange}
            placeholder="https://youtube.com/c/..."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="youtubeChannelId">YouTube Channel ID</Label>
          <Input
            id="youtubeChannelId"
            name="youtubeChannelId"
            value={formData.youtubeChannelId}
            onChange={handleChange}
            placeholder="Enter YouTube Channel ID"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instagramUrl">Instagram URL</Label>
          <Input
            id="instagramUrl"
            name="instagramUrl"
            value={formData.instagramUrl}
            onChange={handleChange}
            placeholder="https://instagram.com/..."
          />
        </div>
      </div>
      
      {/* Spotify Playlists Section */}
      <div className="space-y-4 p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Music className="w-5 h-5 text-green-400" />
          Spotify Playlists
        </h3>
        
        <div className="space-y-4">
          {formData.spotifyPlaylists.map((playlist, index) => (
            <div key={index} className="flex gap-3 items-center p-3 rounded-md bg-zinc-800/50">
              <div className="flex-grow">
                <p className="font-medium">{playlist.title}</p>
                <p className="text-sm text-gray-400 truncate">{playlist.playlistId}</p>
              </div>
              <button 
                type="button" 
                onClick={() => removePlaylist(index)}
                className="text-red-400 hover:text-red-300"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="playlistTitle">Playlist Title</Label>
            <Input
              id="playlistTitle"
              name="title"
              value={newPlaylist.title}
              onChange={handlePlaylistChange}
              placeholder="Top Tracks"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="playlistId">Playlist ID</Label>
            <Input
              id="playlistId"
              name="playlistId"
              value={newPlaylist.playlistId}
              onChange={handlePlaylistChange}
              placeholder="Spotify Playlist ID"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="playlistDescription">Description</Label>
            <Input
              id="playlistDescription"
              name="description"
              value={newPlaylist.description}
              onChange={handlePlaylistChange}
              placeholder="Best tracks from the artist"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="playlistCover">Cover Image URL</Label>
            <Input
              id="playlistCover"
              name="coverImage"
              value={newPlaylist.coverImage}
              onChange={handlePlaylistChange}
              placeholder="https://example.com/cover.jpg"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={addPlaylist}
            className="flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Playlist</span>
          </Button>
        </div>
      </div>
      
      {/* YouTube Videos Section */}
      <div className="space-y-4 p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Youtube className="w-5 h-5 text-red-400" />
          YouTube Videos
        </h3>
        
        <div className="space-y-4">
          {formData.youtubeVideos.map((video, index) => (
            <div key={index} className="flex gap-3 items-center p-3 rounded-md bg-zinc-800/50">
              <div className="flex-grow">
                <p className="font-medium">{video.title}</p>
                <p className="text-sm text-gray-400 truncate">{video.videoId}</p>
              </div>
              <button 
                type="button" 
                onClick={() => removeVideo(index)}
                className="text-red-400 hover:text-red-300"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="videoTitle">Video Title</Label>
            <Input
              id="videoTitle"
              name="title"
              value={newVideo.title}
              onChange={handleVideoChange}
              placeholder="Official Music Video"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="videoId">Video ID</Label>
            <Input
              id="videoId"
              name="videoId"
              value={newVideo.videoId}
              onChange={handleVideoChange}
              placeholder="YouTube Video ID"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="videoThumbnail">Thumbnail URL</Label>
            <Input
              id="videoThumbnail"
              name="thumbnail"
              value={newVideo.thumbnail}
              onChange={handleVideoChange}
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={addVideo}
            className="flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Video</span>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="isVerified"
            name="isVerified"
            checked={formData.isVerified}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVerified: checked }))}
          />
          <Label htmlFor="isVerified">Verified Artist</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            name="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
          />
          <Label htmlFor="featured">Featured on Homepage</Label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Artist' : 'Create Artist'}
        </Button>
      </div>
    </form>
  );
}