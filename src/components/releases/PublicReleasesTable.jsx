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

export default function PublicReleasesTable({ releases }) {
  if (!releases || releases.length === 0) {
    return <div className="text-center py-8">No releases found</div>;
  }

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
          {releases.map((release, index) => (
            <TableRow key={release._id ? release._id.toString() : `release-${index}`}>
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
                  release.artists.map((artist, index) => (
                    <div key={typeof artist === 'object' ? artist._id : index} className="mb-1">
                      <Link 
                        href={`/artists/${typeof artist === 'object' ? artist.slug : '#'}`} 
                        className="text-gray-400 hover:text-purple-400 transition-colors"
                      >
                        {typeof artist === 'object' ? artist.name : 
                         (release.artistName || 'Unknown Artist')}
                      </Link>
                    </div>
                  ))
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