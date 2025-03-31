'use client';

import { useEffect, useState } from 'react';
import { Music, Disc, ExternalLink } from 'lucide-react';

const SpotifyPlayer = ({ spotifyUri, height = 80, theme }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className="animate-pulse bg-gray-800 rounded-lg" 
        style={{ height: `${height}px` }}
      />
    );
  }

  // Extract the type and ID from the URI
  const [type, id] = spotifyUri.split(':').slice(1);
  
  // Determine the appropriate embed URL based on the type
  let embedUrl = '';
  switch (type) {
    case 'track':
      embedUrl = `https://open.spotify.com/embed/track/${id}`;
      break;
    case 'artist':
      embedUrl = `https://open.spotify.com/embed/artist/${id}`;
      break;
    case 'album':
      embedUrl = `https://open.spotify.com/embed/album/${id}`;
      break;
    case 'playlist':
      embedUrl = `https://open.spotify.com/embed/playlist/${id}`;
      break;
    default:
      return null;
    }
  
  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
        <iframe
        src={`${embedUrl}?utm_source=generator&theme=${theme}`}
          width="100%"
          height={height}
          frameBorder="0"
        allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        className="bg-transparent"
      />
    </div>
  );
};

export default SpotifyPlayer; 