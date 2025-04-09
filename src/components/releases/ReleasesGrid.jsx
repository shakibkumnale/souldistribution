'use client';

import { useState, useEffect } from 'react';
import { Music, ExternalLink, Play, Filter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ReleasesGrid({ releases = [], className = '', enableFiltering = false, enableSorting = false }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [filteredReleases, setFilteredReleases] = useState(releases);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  
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
  
  // Extract unique artists for filter dropdown
  const uniqueArtists = Array.from(new Set(
    releases
      .map(release => getArtistName(release))
      .filter(name => name !== 'Unknown Artist')
  )).sort();

  // Extract unique release types for filter dropdown
  const uniqueTypes = Array.from(new Set(
    releases.map(release => release.type || 'Single')
  )).sort();
  
  // Apply filtering and sorting whenever dependencies change
  useEffect(() => {
    let result = [...releases];
    
    // Apply filtering
    if (searchTerm) {
      result = result.filter(release => 
        release.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getArtistName(release).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedArtist) {
      result = result.filter(release => 
        getArtistName(release) === selectedArtist
      );
    }
    
    if (selectedType) {
      result = result.filter(release => 
        release.type === selectedType
      );
    }

    if (featuredOnly) {
      result = result.filter(release => release.featured);
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
        break;
      case 'popularity':
        result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case 'titleAsc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'titleDesc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    
    setFilteredReleases(result);
  }, [releases, searchTerm, selectedArtist, selectedType, sortOption, featuredOnly]);
  
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

  // Check if we're in scrolling mode by looking for flex in className
  const isScrollingMode = className.includes('flex');

  return (
    <>
      {(enableFiltering || enableSorting) && (
        <div className="mb-8">
          <div className="flex flex-col space-y-4 p-4 bg-gray-800/50 rounded-lg">
            {enableFiltering && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="release-search" className="block text-sm font-medium text-gray-300 mb-1">
                      Search
                    </label>
                    <input
                      id="release-search"
                      type="text"
                      placeholder="Search by title or artist..."
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="filter-artist" className="block text-sm font-medium text-gray-300 mb-1">
                      Filter by Artist
                    </label>
                    <select
                      id="filter-artist"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={selectedArtist}
                      onChange={e => setSelectedArtist(e.target.value)}
                    >
                      <option value="">All Artists</option>
                      {uniqueArtists.map(artist => (
                        <option key={artist} value={artist}>
                          {artist}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="filter-type" className="block text-sm font-medium text-gray-300 mb-1">
                      Filter by Type
                    </label>
                    <select
                      id="filter-type"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={selectedType}
                      onChange={e => setSelectedType(e.target.value)}
                    >
                      <option value="">All Types</option>
                      {uniqueTypes.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="featured-only-releases"
                    type="checkbox"
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    checked={featuredOnly}
                    onChange={e => setFeaturedOnly(e.target.checked)}
                  />
                  <label htmlFor="featured-only-releases" className="ml-2 text-sm font-medium text-gray-300">
                    Featured Releases Only
                  </label>
                </div>
              </>
            )}
            
            {enableSorting && (
              <div className="md:w-64">
                <label htmlFor="sort-releases" className="block text-sm font-medium text-gray-300 mb-1">
                  Sort By
                </label>
                <select
                  id="sort-releases"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value)}
                >
                  <option value="newest">Latest Releases</option>
                  <option value="oldest">Oldest Releases</option>
                  <option value="popularity">Most Popular</option>
                  <option value="titleAsc">Title (A-Z)</option>
                  <option value="titleDesc">Title (Z-A)</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className={isScrollingMode ? className : `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {filteredReleases.length > 0 ? (
          filteredReleases.map((release, index) => (
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
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-400">No releases found matching your criteria.</p>
          </div>
        )}
      </div>
    </>
  );
}
