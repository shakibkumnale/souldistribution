'use client';

import { useState } from 'react';
import { Music, User, ListMusic, Disc } from 'lucide-react';
import SpotifyPlayer from './SpotifyPlayer';

export default function SpotifyArtistProfile({ 
  artistId, 
  showTopTracks = true,
  showPlaylists = true,
  showAlbums = false,
  className = '' 
}) {
  const [activeTab, setActiveTab] = useState('top-tracks');
  
  // Tabs configuration
  const tabs = [
    { 
      id: 'top-tracks', 
      label: 'Top Tracks', 
      icon: <Music className="w-4 h-4" />,
      visible: showTopTracks,
      content: <SpotifyPlayer spotifyUri={artistId} type="artist" height={380} />
    },
    { 
      id: 'albums', 
      label: 'Albums', 
      icon: <Disc className="w-4 h-4" />,
      visible: showAlbums,
      content: (
        <div className="space-y-4">
          <SpotifyPlayer 
            spotifyUri={`spotify:artist:${artistId.split(':').pop()}`} 
            type="artist" 
            height={380} 
          />
        </div>
      )
    },
    { 
      id: 'playlists', 
      label: 'Playlists', 
      icon: <ListMusic className="w-4 h-4" />,
      visible: showPlaylists,
      content: (
        <div className="space-y-4">
          <SpotifyPlayer 
            spotifyUri={artistId} 
            type="artist" 
            height={380} 
          />
        </div>
      )
    }
  ].filter(tab => tab.visible);
  
  // If no tabs are available, show a default view
  if (tabs.length === 0) {
    return (
      <div className={`rounded-xl bg-gradient-card p-6 ${className}`}>
        <div className="flex items-center justify-center text-center gap-3 flex-col">
          <User className="w-10 h-10 text-purple-primary" />
          <h3 className="text-xl font-semibold">Artist Profile</h3>
          <p className="text-gray-400">No Spotify content available for this artist</p>
        </div>
      </div>
    );
  }
  
  // Default to first tab if current active tab is not visible
  const visibleTabIds = tabs.map(tab => tab.id);
  if (!visibleTabIds.includes(activeTab)) {
    setActiveTab(visibleTabIds[0]);
  }
  
  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;
  
  return (
    <div className={`rounded-xl overflow-hidden bg-gradient-card ${className}`}>
      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-800">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? 'bg-gradient-primary text-white' 
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      
      {/* Content area */}
      <div className="p-0">
        {activeTabContent}
      </div>
    </div>
  );
} 