// src/components/home/FeaturedArtists.jsx
'use client'
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Music, Users } from 'lucide-react';

export default function FeaturedArtists({ artists: initialArtists = [] }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [artists, setArtists] = useState(initialArtists);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'top' | 'new'

  useEffect(() => {
    if (initialArtists.length > 0) {
      setArtists(initialArtists);
      setIsLoading(false);
    }
  }, [initialArtists]);

  // Filter artists based on selected filter
  const filteredArtists = () => {
    switch (filter) {
      case 'top':
        return [...artists].sort((a, b) => 
          (b.spotifyData?.followers || 0) - (a.spotifyData?.followers || 0)
        ).slice(0, 5);
      case 'new':
        return [...artists].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        ).slice(0, 5);
      default:
        return artists;
    }
  };

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', checkScroll);
      checkScroll();
      
      // Add resize listener to check scroll status when window is resized
      window.addEventListener('resize', checkScroll);
      
      return () => {
        scrollEl.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [artists]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Format follower count
  const formatFollowers = (count) => {
    if (!count) return '0';
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  // Get primary genre for display
  const getPrimaryGenre = (genres) => {
    if (!genres || genres.length === 0) return 'Unknown Genre';
    return genres[0].charAt(0).toUpperCase() + genres[0].slice(1);
  };

  if (isLoading) {
    return (
      <div className="w-full">
          <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error && artists.length === 0) {
    return (
      <div className="w-full">
        <div className="bg-red-900/20 border border-red-600 text-red-200 p-4 rounded-md">
            {error}
          </div>
        </div>
    );
  }

  // Generate a unique key for each artist
  const getArtistKey = (artist, index) => {
    // Use a combination of properties to ensure uniqueness
    if (typeof artist._id === 'string' && artist._id.length > 0) {
      return artist._id;
    }
    if (artist.slug) {
      return `slug-${artist.slug}`;
    }
    if (artist.name) {
      return `name-${artist.name}-${index}`;
    }
    return `artist-index-${index}`;
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-0">
        <div className="flex items-center">
          <div className="h-6 sm:h-8 w-1 bg-purple-600 rounded-full mr-3"></div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Artists</h2>
          <span className="ml-2 sm:ml-4 text-gray-400 text-xs sm:text-sm bg-black/30 rounded-full px-2 py-0.5 sm:px-3 sm:py-1">
            {filteredArtists().length} artists
          </span>
        </div>
        <div className="flex items-center space-x-4">
          {/* Filter Buttons */}
          <div className="flex bg-black/20 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-md transition-all ${
                filter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('top')}
              className={`px-3 py-1 text-sm rounded-md transition-all ${
                filter === 'top'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Top
            </button>
            <button
              onClick={() => setFilter('new')}
              className={`px-3 py-1 text-sm rounded-md transition-all ${
                filter === 'new'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              New
            </button>
          </div>
          
          {/* Scroll Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 sm:p-2.5 rounded-full ${
                canScrollLeft 
                  ? 'bg-gradient-to-r from-purple-900 to-purple-800 text-white hover:from-purple-800 hover:to-purple-700 shadow-lg' 
                  : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 sm:p-2.5 rounded-full ${
                canScrollRight 
                  ? 'bg-gradient-to-r from-purple-900 to-purple-800 text-white hover:from-purple-800 hover:to-purple-700 shadow-lg' 
                  : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
          </div>
        </div>
        
        <div 
        className="overflow-x-auto scrollbar-none" 
          ref={scrollRef}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx global>{`
          .scrollbar-none::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="flex space-x-4 sm:space-x-6 pb-4 sm:pb-6 min-w-max">
          {filteredArtists().map((artist, index) => (
              <Link 
              key={getArtistKey(artist, index)}
                href={`/artists/${artist.slug}`}
              className="block group relative"
              >
              <div className="w-36 sm:w-44 md:w-52 bg-gradient-to-b from-gray-800/60 to-gray-900/80 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-purple-900/20 group-hover:scale-[1.02]">
                <div className="relative w-full h-36 sm:h-44 md:h-52 overflow-hidden">
                    <Image 
                      src={artist.image || (artist.spotifyData?.images?.[0]?.url) || '/images/placeholder-cover.jpg'} 
                      alt={artist.name}
                      fill
                    sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, 208px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                  
                  {/* Stats Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 flex justify-between items-center">
                    {artist.spotifyData?.followers && (
                      <div className="flex items-center text-xs sm:text-sm text-white/90 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                        <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5" />
                        <span>{formatFollowers(artist.spotifyData.followers)}</span>
                      </div>
                    )}
                    
                    {artist.spotifyData?.genres && artist.spotifyData.genres.length > 0 && (
                      <div className="flex items-center text-xs sm:text-sm text-white/90 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full truncate max-w-[70px] sm:max-w-[100px]">
                        <Music className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5 flex-shrink-0" />
                        <span className="truncate">{getPrimaryGenre(artist.spotifyData.genres)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-0.5 sm:mb-1 truncate">{artist.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm text-gray-300 truncate">
                      {artist.releases?.length 
                        ? `${artist.releases.length} Release${artist.releases.length !== 1 ? 's' : ''}` 
                        : 'Artist'}
                    </p>
                    
                    <span className="text-[10px] sm:text-xs text-purple-400 font-medium opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      View Profile →
                    </span>
                  </div>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
        
      <div className="text-center mt-6 sm:mt-10">
          <Link 
            href="/artists" 
          className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-600 hover:to-pink-600 text-white text-sm sm:text-base font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-900/30"
          >
            View All Artists
          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1.5 sm:ml-2" />
          </Link>
        </div>
      </div>
  );
}