'use client';

import { useState } from 'react';
import { Youtube, Loader } from 'lucide-react';

export default function YouTubeEmbed({ 
  videoId, 
  title = 'YouTube Video',
  aspectRatio = '16/9',
  className = ''
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Extract video ID from URL if needed
  const getVideoId = () => {
    try {
      if (!videoId) return null;
      
      // If it looks like a full YouTube URL
      if (videoId.includes('youtube.com') || videoId.includes('youtu.be')) {
        const url = new URL(videoId);
        
        // Handle youtube.com/watch?v=VIDEO_ID
        if (url.hostname.includes('youtube.com') && url.pathname.includes('watch')) {
          return url.searchParams.get('v');
        }
        
        // Handle youtu.be/VIDEO_ID
        if (url.hostname.includes('youtu.be')) {
          return url.pathname.split('/')[1];
        }
        
        // Handle youtube.com/embed/VIDEO_ID
        if (url.pathname.includes('embed')) {
          return url.pathname.split('/')[2];
        }
      }
      
      // Assume it's already just the ID
      return videoId;
    } catch (err) {
      setError('Invalid YouTube URL');
      return null;
    }
  };
  
  const embedId = getVideoId();
  
  const handleIframeLoad = () => {
    setIsLoading(false);
  };
  
  if (error || !embedId) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 rounded-xl bg-gradient-card ${className}`}>
        <Youtube className="w-10 h-10 text-red-500 mb-3" />
        <p className="text-gray-300">Failed to load YouTube video</p>
        {error && <p className="text-sm text-gray-500 mt-1">{error}</p>}
      </div>
    );
  }
  
  return (
    <div className={`relative bg-gradient-card rounded-xl overflow-hidden ${className}`} style={{ aspectRatio }}>
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-2">
          <Loader className="w-8 h-8 text-red-500 animate-spin" />
          <p className="text-sm text-gray-400">Loading video...</p>
        </div>
      )}
      
      <iframe
        src={`https://www.youtube.com/embed/${embedId}?rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        onLoad={handleIframeLoad}
        style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease' }}
      ></iframe>
    </div>
  );
} 