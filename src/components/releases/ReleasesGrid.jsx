'use client';

import { useState } from 'react';
import { Music, ExternalLink, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ReleasesGrid({ releases = [], className = '' }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // If no releases provided, show placeholder
  if (!releases || releases.length === 0) {
    return (
      <div className={`rounded-xl bg-gradient-card p-6 text-center ${className}`}>
        <div className="flex flex-col items-center justify-center gap-3">
          <Music className="w-10 h-10 text-purple-primary opacity-70" />
          <h3 className="text-lg font-medium">No releases available</h3>
          <p className="text-sm text-gray-400">Releases will appear here once added</p>
        </div>
      </div>
    );
  }

  // Generate a unique key for each release
  const getReleaseKey = (release, index) => {
    // Use a combination of properties to ensure uniqueness
    if (typeof release._id === 'string' && release._id.length > 0) {
      return release._id;
    }
    if (release.slug) {
      return `slug-${release.slug}`;
    }
    if (release.title) {
      return `title-${release.title}-${index}`;
    }
    return `release-index-${index}`;
  };

  // Helper function to safely get artist name
  const getArtistName = (release) => {
    // First try to get from artist object in the array
    if (release.artists && release.artists.length > 0) {
      const artist = release.artists[0];
      
      // Handle different artist formats
      if (typeof artist === 'object') {
        // If it's a populated artist object with name
        if (artist.name) {
          return artist.name;
        }
        
        // If it's an ObjectId reference
        if (artist.$oid || artist._id) {
          // Use artistName as fallback when we only have an ID reference
          if (release.artistName) {
            return release.artistName;
          }
        }
      }
    }
    
    // Fall back to artistName field if it exists
    if (release.artistName) {
      return release.artistName;
    }
    
    return 'Unknown Artist';
  };

  // Check if we're in scrolling mode by looking for flex in className
  const isScrollingMode = className.includes('flex');

  return (
    <div className={isScrollingMode ? className : `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {releases.map((release, index) => (
        <div 
          key={getReleaseKey(release, index)}
          className={`group relative rounded-xl overflow-hidden bg-gradient-card transition-all duration-300 shadow-md hover:shadow-glow-accent 
            ${isScrollingMode ? 'min-w-[160px] sm:min-w-[200px] md:min-w-[240px] flex-shrink-0' : ''}`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Release Cover */}
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={release.coverImage || '/images/placeholder-cover.jpg'}
              alt={release.title || 'Release Cover'}
              fill
              sizes={isScrollingMode ? 
                "(max-width: 640px) 160px, (max-width: 768px) 200px, 240px" : 
                "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              }
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Hover overlay with play button */}
            <div 
              className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
                hoveredIndex === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-2">
                {release.spotifyUrl && (
                  <Link 
                    href={`https://open.spotify.com/track/${release.spotifyUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 px-2 sm:px-4 py-1 sm:py-2 rounded-full bg-green-600 text-white text-xs sm:text-sm font-medium hover:bg-green-500 transition-colors"
                  >
                    <span>Spotify</span>
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Link>
                )}
                <Link 
                  href={`/releases/${release.slug}`}
                  className="flex items-center justify-center gap-1 px-2 sm:px-4 py-1 sm:py-2 rounded-full bg-purple-600 text-white text-xs sm:text-sm font-medium hover:bg-purple-500 transition-colors"
                >
                  <span>Details</span>
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Release info */}
          <div className="p-3 sm:p-4">
            <h3 className="font-semibold text-white text-sm sm:text-lg truncate group-hover:text-pink-primary transition-colors">
              {release.title || 'Untitled Release'}
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1">
              {getArtistName(release)}
            </p>
            <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
              <span className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-purple-900/50 text-purple-300">
                {release.type || 'Single'}
              </span>
              {release.featured && (
                <span className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-pink-900/50 text-pink-300">
                  Featured
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
