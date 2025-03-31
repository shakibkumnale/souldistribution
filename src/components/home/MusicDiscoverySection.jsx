'use client';

import SpotifyPlayer from '@/components/spotify/SpotifyPlayer';

export default function MusicDiscoverySection({ topReleases, popularArtists, latestReleases }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Top Hits */}
      <div className="bg-gradient-to-r from-gray-900/80 via-purple-900/20 to-gray-900/80 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20">
        <div className="mb-6">
          <span className="text-sm font-semibold text-purple-400 tracking-wider uppercase block">Trending Now</span>
          <h2 className="text-2xl font-bold text-white mt-1">Top Hits</h2>
        </div>
        <div 
          className="overflow-y-auto scrollbar-hide pr-2" 
          style={{ 
            maxHeight: "600px",
            msOverflowStyle: "none",
            scrollbarWidth: "none"
          }}
        >
          <div className="space-y-4">
            {topReleases.sort((a, b) => b.popularity - a.popularity).map((release, index) => (
              <div key={`top-release-${index}-${release._id ? release._id.toString() : index}`} className="relative">
                <SpotifyPlayer
                  spotifyUri={`spotify:track:${release.spotifyTrackId}`}
                  height={100}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Artists */}
      <div className="bg-gradient-to-r from-gray-900/80 via-purple-900/20 to-gray-900/80 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20">
        <div className="mb-6">
          <span className="text-sm font-semibold text-purple-400 tracking-wider uppercase block">Featured Artists</span>
          <h2 className="text-2xl font-bold text-white mt-1">Top Artists</h2>
        </div>
        <div className="space-y-4">
          {popularArtists.slice(0, 3).map((artist, index) => (
            <div key={`featured-artist-${index}-${artist._id ? artist._id.toString() : index}`} className="relative">
              <SpotifyPlayer
                spotifyUri={`spotify:artist:${artist.spotifyArtistId}`}
                height={160}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Latest Releases */}
      <div className="bg-gradient-to-r from-gray-900/80 via-purple-900/20 to-gray-900/80 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20">
        <div className="mb-6">
          <span className="text-sm font-semibold text-purple-400 tracking-wider uppercase block">New Music</span>
          <h2 className="text-2xl font-bold text-white mt-1">Fresh Releases</h2>
        </div>
        <div 
          className="overflow-y-auto scrollbar-hide pr-2" 
          style={{ 
            maxHeight: "600px",
            msOverflowStyle: "none",
            scrollbarWidth: "none"
          }}
        >
          <div className="space-y-4">
            {latestReleases.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)).map((release, index) => (
              <div key={`latest-release-${index}-${release._id ? release._id.toString() : index}`} className="relative">
                <SpotifyPlayer
                  spotifyUri={`spotify:track:${release.spotifyTrackId}`}
                  height={100}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 