"use client";

// src/components/releases/MediaPlayer.jsx
import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MediaPlayer({ 
  spotifyUri, 
  youtubeUrl,
  className 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTab, setCurrentTab] = useState('spotify');
  
  // In a real app, these functions would control actual playback
  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  
  return (
    <div className={cn("rounded-lg overflow-hidden bg-zinc-900", className)}>
      <div className="flex border-b border-zinc-800">
        <button
          className={cn(
            "px-4 py-2 text-sm font-medium",
            currentTab === 'spotify' 
              ? "bg-green-950 text-green-400" 
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
          )}
          onClick={() => setCurrentTab('spotify')}
        >
          Spotify
        </button>
        <button
          className={cn(
            "px-4 py-2 text-sm font-medium",
            currentTab === 'youtube' 
              ? "bg-red-950 text-red-400" 
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
          )}
          onClick={() => setCurrentTab('youtube')}
        >
          YouTube
          
        </button>
      </div>
      
      <div className="aspect-video w-full p-4">
        
        {currentTab === 'spotify' && true ? (
          <iframe
            src={`https://open.spotify.com/embed/track/${spotifyUri}?utm_source=generator`}
            width="100%"
            height="100%"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
          
        ) : currentTab === 'youtube' && youtubeUrl ? (
          <iframe
            // src={youtubeUrl.replace('watch?v=', 'embed/')}
            src={`https://www.youtube.com/embed/${youtubeUrl}?si=QwCmsO7Y-DZiGaRE`}
            width="100%"
            height="100%"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy"
          ></iframe>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-zinc-900 text-zinc-500">
            No media available
          </div>
        )}
      </div>
      
      
    </div>
  );
}