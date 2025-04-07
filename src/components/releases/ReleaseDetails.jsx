'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Music, Play, Disc3, Calendar, ExternalLink, Share2 } from 'lucide-react';
import MediaPlayer from '@/components/releases/MediaPlayer';
import { formatDate } from '@/lib/utils';

export default function ReleaseDetails({ release, moreReleases = [] }) {
  // Extract Spotify URI from URL if available

  
  // Check if we have artist information
  const mainArtist = release.artists && release.artists.length > 0 ? release.artists[0] : null;
  const hasMultipleArtists = release.artists && release.artists.length > 1;
  
  // Helper function to safely get artist ID as string
  const getArtistIdAsString = (artist) => {
    if (!artist) return '';
    if (typeof artist === 'string') return artist;
    if (artist.$oid) return artist.$oid;
    if (artist._id) return typeof artist._id === 'string' ? artist._id : JSON.stringify(artist._id);
    return '';
  };
  
  return (
    <main className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Album Cover and Details */}
        <div className="w-full md:w-1/3">
          <div className="sticky top-24">
            <div className="relative aspect-square overflow-hidden rounded-xl shadow-lg">
              <Image
                src={release.coverImage || '/images/placeholder-cover.jpg'}
                alt={release.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
              />
              
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{release.title}</h1>
                {mainArtist && (
                  <div>
                    <Link 
                      href={typeof mainArtist === 'object' && mainArtist.slug ? `/artists/${mainArtist.slug}` : '#'} 
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      {typeof mainArtist === 'object' && mainArtist.name ? mainArtist.name : 'Artist'}
                    </Link>
                    
                    {hasMultipleArtists && (
                      <div className="text-sm text-gray-500 mt-1">
                        featuring  {release.artists.slice(1).map((artist, index) => (
                          <span key={getArtistIdAsString(artist) || `artist-${index}`}>
                            {typeof artist === 'object' && artist.name ? artist.name : `Artist ${index + 2}`}
                            {index < release.artists.slice(1).length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(release.releaseDate)}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {release.type && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-purple-900/60 text-purple-300 rounded-full">
                    <Disc3 className="w-3 h-3" />
                    {release.type}
                  </div>
                )}
              
              </div>
              
              <div className="flex flex-wrap gap-3">
                {release.spotifyUrl && (
                  <Link 
                    href={`https://open.spotify.com/track/${release.spotifyUrl}`} 
                    target="_blank" 
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-400 bg-green-950 rounded-full hover:bg-green-900 transition-colors"
                  >
                    <Music className="w-4 h-4" />
                    Spotify
                  </Link>
                )}
                
                {release.appleMusicUrl && (
                  <Link 
                    href={release.appleMusicUrl} 
                    target="_blank" 
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
                  >
                    <Music className="w-4 h-4" />
                    Apple Music
                  </Link>
                )}
                
                {release.youtubeUrl && (
                  <Link 
                    href={`https://www.youtube.com/watch?v=${release.youtubeUrl}`} 
                    target="_blank" 
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-red-950 rounded-full hover:bg-red-900 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    YouTube Music
                  </Link>
                )}
              </div>
              
              {/* Share button */}
              <button 
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Copy Share Link
              </button>
              
            
            </div>
          </div>
        </div>
        
        {/* Media Player and More Releases */}
        <div className="w-full md:w-2/3 space-y-8">
          <MediaPlayer 
            spotifyUri={release.spotifyTrackId}
            youtubeUrl={release.youtubeUrl} 
          />
          
          {moreReleases.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">More from {typeof mainArtist === 'object' && mainArtist.name ? mainArtist.name : 'This Artist'}</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {moreReleases.map((rel, index) => {
                  // Handle ObjectId references in rel.artists
                  const relArtist = rel.artists && rel.artists.length > 0 
                    ? (typeof rel.artists[0] === 'object' ? rel.artists[0] : { name: 'Artist' })
                    : null;
                  
                  return (
                    <Link 
                      key={rel._id ? (typeof rel._id === 'string' ? rel._id : JSON.stringify(rel._id)) : `release-${rel.title}-${index}`}
                      href={`/releases/${rel.slug}`} 
                      className="group block"
                    >
                      <div className="relative overflow-hidden rounded-lg bg-black aspect-square">
                        <Image
                          src={rel.coverImage || '/images/placeholder-cover.jpg'}
                          alt={rel.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="mt-2 font-medium text-white group-hover:text-purple-400 truncate transition-colors">
                        {rel.title}
                      </h3>
                      {relArtist && (
                        <p className="text-sm text-gray-400 truncate">
                          {typeof relArtist === 'object' && relArtist.name ? relArtist.name : 'Artist'}
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 