// src/components/artists/ArtistProfile.jsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Music, Youtube, Instagram, ListMusic, Grid, List } from 'lucide-react';
import ReleasesGrid from '../releases/ReleasesGrid';
import PublicReleasesTable from '../releases/PublicReleasesTable';
import SpotifyPlayer from '../spotify/SpotifyPlayer';
import SpotifyPlaylistGrid from '../spotify/SpotifyPlaylistGrid';
import YouTubeEmbed from '../youtube/YouTubeEmbed';

export default function ArtistProfile({ artist, releases = [] }) {
  const [activeTab, setActiveTab] = useState('releases');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [musicSubTab, setMusicSubTab] = useState('profile'); // 'profile', 'playlists'
  
  // Debug releases data
  useEffect(() => {
    console.log('Artist:', artist);
    console.log('Releases:', releases);
    console.log('Releases length:', releases?.length || 0);
  }, [artist, releases]);
  
  // Ensure releases is always an array
  const releasesArray = Array.isArray(releases) ? releases : [];
  
  // Convert stored playlists to the format expected by SpotifyPlaylistGrid
  const formattedPlaylists = artist.spotifyPlaylists?.map(playlist => ({
    id: playlist.playlistId,
    title: playlist.title,
    description: playlist.description,
    coverImage: playlist.coverImage || '/images/placeholder-cover.jpg',
    spotifyUrl: `https://open.spotify.com/playlist/${playlist.playlistId}`,
  })) || [];
  
  const tabs = [
    { id: 'releases', label: 'Releases' },
    { id: 'music', label: 'Music', show: artist.spotifyArtistId || formattedPlaylists.length > 0 },
    { id: 'videos', label: 'Videos', show: artist.youtubeVideos?.length > 0 }
  ].filter(tab => tab.show !== false);

  // Music subtabs
  const musicSubTabs = [
    { id: 'profile', label: 'Artist Profile', icon: <Music className="w-4 h-4" />, show: artist.spotifyArtistId },
    { id: 'playlists', label: 'Playlists', icon: <ListMusic className="w-4 h-4" />, show: formattedPlaylists.length > 0 }
  ].filter(tab => tab.show);

  // Set default music subtab based on what's available
  useEffect(() => {
    if (activeTab === 'music' && musicSubTabs.length > 0 && !musicSubTabs.find(tab => tab.id === musicSubTab)) {
      setMusicSubTab(musicSubTabs[0].id);
    }
  }, [activeTab, musicSubTabs, musicSubTab]);

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-10">
      {/* Artist Header Section */}
      <div className="bg-gradient-to-b from-gray-900/60 to-black/40 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="relative flex-shrink-0 overflow-hidden rounded-xl aspect-square w-full max-w-xs mx-auto md:mx-0 shadow-glow-primary border border-purple-500/20">
            <Image
              src={artist.image || '/images/placeholder-cover.jpg'}
              alt={artist.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <div className="flex-grow space-y-6">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold md:text-4xl text-gradient">{artist.name}</h1>
              {artist.isVerified && (
                <CheckCircle className="w-6 h-6 text-blue-400" />
              )}
            </div>
            
            <p className="text-gray-200 whitespace-pre-line text-lg leading-relaxed">{artist.bio}</p>
            
            <div className="flex flex-wrap gap-3 pt-2">
              {artist.spotifyUrl && (
                <Link 
                  href={`https://open.spotify.com/artist/${artist.spotifyUrl}`} 

                  target="_blank" 
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-green-400 bg-green-950 rounded-full hover:bg-green-900 transition-colors"
                >
                  <Music className="w-5 h-5" />
                  Spotify
                </Link>
              )}
              
              {artist.youtubeUrl && (
                <Link 
                  href={artist.youtubeUrl} 
                  target="_blank" 
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-red-400 bg-red-950 rounded-full hover:bg-red-900 transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                  YouTube
                </Link>
              )}
              
              {artist.instagramUrl && (
                <Link 
                  href={artist.instagramUrl} 
                  target="_blank" 
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-purple-400 bg-purple-950 rounded-full hover:bg-purple-900 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  Instagram
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-zinc-800">
        <div className="flex -mb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`py-4 px-8 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-white border-pink-primary'
                  : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-700'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Content based on active tab */}
      <div className="space-y-8 py-4">
        {activeTab === 'releases' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Releases ({releasesArray.length})</h2>
              
              {/* View toggle buttons */}
              {releasesArray.length > 0 && (
                <div className="flex bg-zinc-800 rounded-lg overflow-hidden">
                  <button
                    className={`p-2.5 ${viewMode === 'grid' ? 'bg-purple-900 text-white' : 'text-gray-400 hover:text-white'}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid view"
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    className={`p-2.5 ${viewMode === 'table' ? 'bg-purple-900 text-white' : 'text-gray-400 hover:text-white'}`}
                    onClick={() => setViewMode('table')}
                    title="Table view"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm">
              {releasesArray.length > 0 ? (
                viewMode === 'grid' ? (
                  <ReleasesGrid releases={releasesArray} />
                ) : (
                  <PublicReleasesTable releases={releasesArray} />
                )
              ) : (
                <div className="py-16 text-center text-gray-400">
                  <Music className="w-12 h-12 mx-auto mb-4 text-gray-500/50" />
                  <p className="text-lg">No releases yet.</p>
                  <p className="text-sm text-gray-500 mt-2">Check back soon for new music from this artist.</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'music' && (
          <div className="space-y-6">
            {/* Music Subtabs */}
            {musicSubTabs.length > 1 && (
              <div className="flex border-b border-zinc-800">
                {musicSubTabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                      musicSubTab === tab.id 
                        ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-lg' 
                        : 'text-gray-400 hover:text-white hover:bg-black/20'
                    }`}
                    onClick={() => setMusicSubTab(tab.id)}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            )}
            
            {/* Music Content based on subtab */}
            <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm">
              {musicSubTab === 'profile' && artist.spotifyArtistId && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Music className="w-5 h-5 text-green-400" />
                    Artist Profile
                  </h2>
                  <div className="w-full h-[380px] rounded-lg overflow-hidden">
                    <iframe 
                      src={`https://open.spotify.com/embed/artist/${artist.spotifyArtistId}?utm_source=generator`}
                      width="100%" 
                      height="380" 
                      frameBorder="0" 
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                      loading="lazy"
                      className="bg-transparent"
                    ></iframe>
                  </div>
                </div>
              )}
              
              {musicSubTab === 'playlists' && formattedPlaylists.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <ListMusic className="w-5 h-5 text-green-400" />
                    Playlists
                  </h2>
                  <SpotifyPlaylistGrid playlists={formattedPlaylists} />
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'videos' && (
          <div className="space-y-4 bg-black/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-400" />
              Videos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              {artist.youtubeVideos?.map((video, index) => (
                <YouTubeEmbed 
                  key={index}
                  videoId={video.videoId}
                  title={video.title}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}