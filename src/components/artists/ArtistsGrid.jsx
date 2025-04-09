// src/components/artists/ArtistsGrid.jsx
'use client';

import { useState, useEffect } from 'react';
import ArtistCard from './ArtistCard';

export default function ArtistsGrid({ artists, enableFiltering = false, enableSorting = false }) {
  const [filteredArtists, setFilteredArtists] = useState(artists);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('nameAsc');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Apply filtering and sorting whenever dependencies change
  useEffect(() => {
    let result = [...artists];
    
    // Apply filtering
    if (searchTerm) {
      result = result.filter(artist => 
        artist.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (featuredOnly) {
      result = result.filter(artist => artist.featured);
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'nameAsc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popularity':
        result.sort((a, b) => (b.spotifyData?.followers || 0) - (a.spotifyData?.followers || 0));
        break;
      default:
        break;
    }
    
    setFilteredArtists(result);
  }, [artists, searchTerm, sortOption, featuredOnly]);

  return (
    <>
      {(enableFiltering || enableSorting) && (
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-800/50 rounded-lg">
            {enableFiltering && (
              <div className="flex-1">
                <div className="mb-3">
                  <label htmlFor="artist-search" className="block text-sm font-medium text-gray-300 mb-1">
                    Search Artists
                  </label>
                  <input
                    id="artist-search"
                    type="text"
                    placeholder="Search by name..."
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    id="featured-only"
                    type="checkbox"
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    checked={featuredOnly}
                    onChange={e => setFeaturedOnly(e.target.checked)}
                  />
                  <label htmlFor="featured-only" className="ml-2 text-sm font-medium text-gray-300">
                    Featured Artists Only
                  </label>
                </div>
              </div>
            )}
            
            {enableSorting && (
              <div className="md:w-64">
                <label htmlFor="sort-artists" className="block text-sm font-medium text-gray-300 mb-1">
                  Sort By
                </label>
                <select
                  id="sort-artists"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value)}
                >
                  <option value="nameAsc">Name (A-Z)</option>
                  <option value="nameDesc">Name (Z-A)</option>
                  <option value="newest">Newest First</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredArtists.length > 0 ? (
          filteredArtists.map((artist) => (
            <ArtistCard 
              key={artist.id || (artist._id ? artist._id.toString() : `artist-${artist.name}`)} 
              artist={artist} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-400">No artists found matching your criteria.</p>
          </div>
        )}
      </div>
    </>
  );
}