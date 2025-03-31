'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Edit, ExternalLink, Trash2, Music, Percent } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

export default function ReleasesTable({ releases }) {
  const router = useRouter();
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (releaseId) => {
    if (!confirm('Are you sure you want to delete this release? This action cannot be undone.')) {
      return;
    }
    
    setDeleting(releaseId);
    
    try {
      const response = await fetch(`/api/releases/${releaseId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete release');
      }
      
      toast({
        title: "Release Deleted",
        description: "The release has been deleted successfully.",
      });
      
      // Refresh the page to update the releases list
      router.refresh();
    } catch (error) {
      console.error('Error deleting release:', error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the release. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

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
            <TableHead>Royalty %</TableHead>
            <TableHead>Spotify</TableHead>
            <TableHead>Actions</TableHead>
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
                    className="rounded-sm"
                  />
                )}
              </TableCell>
              <TableCell className="font-medium">{release.title}</TableCell>
              <TableCell>
                {release.artists && release.artists.map((artist, index) => (
                  <div key={artist._id || index} className="mb-1">
                    <Link href={`/admin/artists/${artist.slug}`} className="text-blue-500 hover:underline">
                      {artist.name}
                    </Link>
                  </div>
                ))}
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
                <div className="flex items-center">
                  <Percent className="h-3 w-3 mr-1 text-gray-500" />
                  {release.royaltyPercentage || 100}
                </div>
              </TableCell>
              <TableCell>
                {release.spotifyUrl ? (
                  <a 
                    href={release.spotifyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-400"
                  >
                    <Music className="h-5 w-5" />
                  </a>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link href={`/admin/releases/${release.slug}`}>
                    <Button size="icon" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(release._id)}
                    disabled={deleting === release._id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 