'use client';

import { useState } from 'react';
import { ListMusic, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function SpotifyPlaylistGrid({ playlists = [], className = '' }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // If no playlists provided, show placeholder
  if (!playlists || playlists.length === 0) {
    return (
      <div className={`rounded-xl bg-gradient-card p-6 text-center ${className}`}>
        <div className="flex flex-col items-center justify-center gap-3">
          <ListMusic className="w-10 h-10 text-purple-primary opacity-70" />
          <h3 className="text-lg font-medium">No playlists available</h3>
          <p className="text-sm text-gray-400">Playlists will appear here once added</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {playlists.map((playlist, index) => (
        <div 
          key={playlist.id || index}
          className="group relative rounded-xl overflow-hidden bg-gradient-card transition-all duration-300 shadow-md hover:shadow-glow-accent"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Playlist Cover */}
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={playlist.coverImage || '/images/placeholder-cover.jpg'}
              alt={playlist.title || 'Spotify Playlist'}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Hover overlay with play button */}
            <div 
              className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
                hoveredIndex === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Link 
                href={playlist.spotifyUrl || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-500 transition-colors"
              >
                <span>Open in Spotify</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          {/* Playlist info */}
          <div className="p-4">
            <h3 className="font-semibold text-white text-lg truncate group-hover:text-pink-primary transition-colors">
              {playlist.title || 'Untitled Playlist'}
            </h3>
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
              {playlist.description || `${playlist.trackCount || 0} tracks`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 