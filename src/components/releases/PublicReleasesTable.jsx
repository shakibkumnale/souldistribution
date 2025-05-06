'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { Music, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

// Generate a unique ID for React keys
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function PublicReleasesTable({ releases }) {
  // Store generated UUIDs for stable keys between renders
  const [releaseKeys, setReleaseKeys] = useState({});
  const [artistKeys, setArtistKeys] = useState({});
  
  // Add debugging to track component mounts/renders
  useEffect(() => {
    console.log('PublicReleasesTable mounted or releases changed');
    console.log('Releases count:', releases?.length);
    
    // Debug release structure
    if (releases && releases.length > 0) {
      console.log('Sample release structure:', {
        _id: releases[0]._id,
        _idType: typeof releases[0]._id,
        _idToString: releases[0]._id && releases[0]._id.toString ? releases[0]._id.toString() : 'no toString',
        hasArtists: Array.isArray(releases[0].artists),
        artistsCount: Array.isArray(releases[0].artists) ? releases[0].artists.length : 0
      });
      
      // Debug artist structure if available
      if (releases[0].artists && releases[0].artists.length > 0) {
        const artist = releases[0].artists[0];
        console.log('Sample artist structure:', {
          artist: artist,
          _id: artist._id,
          _idType: typeof artist._id,
          _idToString: artist._id && artist._id.toString ? artist._id.toString() : 'no toString',
          isObject: typeof artist === 'object',
          hasName: artist.name ? true : false,
          hasSlug: artist.slug ? true : false
        });
      }
    }
    
    const newReleaseKeys = {};
    const newArtistKeys = {};
    
    // Generate a unique key for each release
    releases.forEach((release, index) => {
      // Safer check for release._id
      let releaseId;
      try {
        releaseId = release._id ? 
          (typeof release._id === 'string' ? release._id : JSON.stringify(release._id)) : 
          `release-${index}`;
      } catch (e) {
        console.error('Error getting releaseId:', e);
        releaseId = `release-error-${index}-${Math.random()}`;
      }
      
      newReleaseKeys[releaseId] = generateUUID();
      
      // Generate unique keys for each artist in the release
      if (Array.isArray(release.artists)) {
        release.artists.forEach((artist, artistIndex) => {
          // Safer check for artist._id
          let artistId;
          try {
            artistId = artist && artist._id ? 
              (typeof artist._id === 'string' ? artist._id : JSON.stringify(artist._id)) : 
              `artist-${artistIndex}`;
          } catch (e) {
            console.error('Error getting artistId:', e);
            artistId = `artist-error-${artistIndex}-${Math.random()}`;
          }
          
          const combinedKey = `${releaseId}-${artistId}`;
          newArtistKeys[combinedKey] = generateUUID();
        });
      }
    });
    
    setReleaseKeys(newReleaseKeys);
    setArtistKeys(newArtistKeys);
    
    // Debug generated keys
    console.log('Generated release keys count:', Object.keys(newReleaseKeys).length);
    console.log('Generated artist keys count:', Object.keys(newArtistKeys).length);
  }, [releases]);

  if (!releases || releases.length === 0) {
    return <div className="text-center py-8">No releases found</div>;
  }

  // Helper to get the stable key for a release
  const getReleaseKey = (release, index) => {
    try {
      const releaseId = release._id ? 
        (typeof release._id === 'string' ? release._id : JSON.stringify(release._id)) : 
        `release-${index}`;
      
      // Debug release key
      if (index === 0) {
        console.log(`Release key for index ${index}:`, releaseId, 'Found in map:', !!releaseKeys[releaseId]);
      }
      
      const key = releaseKeys[releaseId] || `fallback-release-${index}-${Math.random()}`;
      return key;
    } catch (e) {
      console.error('Error in getReleaseKey:', e);
      return `error-release-${index}-${Math.random()}`;
    }
  };
  
  // Helper to get the stable key for an artist within a release
  const getArtistKey = (release, artist, releaseIndex, artistIndex) => {
    try {
      const releaseId = release._id ? 
        (typeof release._id === 'string' ? release._id : JSON.stringify(release._id)) : 
        `release-${releaseIndex}`;
        
      const artistId = artist && artist._id ? 
        (typeof artist._id === 'string' ? artist._id : JSON.stringify(artist._id)) : 
        `artist-${artistIndex}`;
      
      const combinedKey = `${releaseId}-${artistId}`;
      
      // Debug artist key if it's the first artist in the first release
      if (releaseIndex === 0 && artistIndex === 0) {
        console.log(`Artist key for [${releaseIndex}][${artistIndex}]:`, combinedKey);
        console.log('Artist object:', artist);
        console.log('Found in map:', !!artistKeys[combinedKey]);
      }
      
      const key = artistKeys[combinedKey] || `fallback-artist-${releaseIndex}-${artistIndex}-${Math.random()}`;
      return key;
    } catch (e) {
      console.error('Error in getArtistKey:', e);
      return `error-artist-${releaseIndex}-${artistIndex}-${Math.random()}`;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cover</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Artist(s)</TableHead>
            <TableHead>Release Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Listen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {releases.map((release, releaseIndex) => (
            <TableRow key={getReleaseKey(release, releaseIndex)}>
              <TableCell>
                {release.coverImage && (
                  <Image 
                    src={release.coverImage} 
                    alt={release.title}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                )}
              </TableCell>
              <TableCell className="font-medium">
                <Link href={`/releases/${release.slug}`} className="hover:text-purple-400 transition-colors">
                  {release.title}
                </Link>
              </TableCell>
              <TableCell>
                {Array.isArray(release.artists) ? (
                  release.artists.map((artist, artistIndex) => {
                    // Generate a completely random key for each artist element
                    const key = `artist-${releaseIndex}-${artistIndex}-${Math.random()}`;
                    
                    return (
                      <div key={key} className="mb-1">
                        <Link 
                          href={`/artists/${typeof artist === 'object' ? artist.slug : '#'}`} 
                          className="text-gray-400 hover:text-purple-400 transition-colors"
                        >
                          {typeof artist === 'object' ? artist.name : 
                           (release.artistName || 'Unknown Artist')}
                        </Link>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-gray-400">{release.artistName || 'Unknown Artist'}</span>
                )}
              </TableCell>
              <TableCell>{formatDate(release.releaseDate)}</TableCell>
              <TableCell>
                <Badge variant={
                  release.type === 'Album' ? 'default' : 
                  release.type === 'EP' ? 'secondary' : 
                  'outline'
                }>
                  {release.type}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {release.spotifyUrl && (
                    <a 
                      href={release.spotifyUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-500 hover:text-green-400"
                    >
                      <Music className="h-5 w-5" />
                    </a>
                  )}
                  {release.youtubeUrl && (
                    <a 
                      href={release.youtubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-red-500 hover:text-red-400"
                    >
                      <Play className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 