'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  AlertCircle, 
  ArrowLeft,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import ReleaseForm from '@/components/admin/ReleaseForm';
import Link from 'next/link';

// Helper function to ensure all ObjectId instances are properly serialized
function ensureString(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value.toString) return value.toString();
  return String(value);
}

export default function AdminReleaseEdit({ params }) {
  const router = useRouter();
  const { toast } = useToast();
  // Use React.use() to unwrap the params
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;
  
  const [release, setRelease] = useState(null);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch artists
        const artistsResponse = await fetch('/api/artists');
        if (!artistsResponse.ok) {
          throw new Error('Failed to fetch artists');
        }
        const artistsData = await artistsResponse.json();
        
        // Fetch release by slug
        const releaseResponse = await fetch(`/api/releases/by-slug/${slug}`);
        if (!releaseResponse.ok) {
          if (releaseResponse.status === 404) {
            throw new Error('Release not found');
          }
          throw new Error('Failed to fetch release');
        }
        const releaseData = await releaseResponse.json();
        
        // Ensure release has string ID
        const processedRelease = {
          ...releaseData,
          _id: ensureString(releaseData._id),
          artists: releaseData.artists?.map(artist => {
            if (typeof artist === 'string') return artist;
            return {
              ...artist,
              _id: ensureString(artist._id)
            };
          }) || []
        };
        
        // Process artists to ensure string IDs
        const processedArtists = (artistsData.artists || []).map(artist => ({
          ...artist,
          _id: ensureString(artist._id)
        }));
        
        setRelease(processedRelease);
        setArtists(processedArtists);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchData();
    }
  }, [slug]);
  
  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      // Ensure landrTrackId is included in the submission data
      console.log('Form data to submit:', formData);
      console.log('landrTrackId in form data:', formData.landrTrackId);
      
      const releaseId = ensureString(release._id);
      const response = await fetch(`/api/releases/${releaseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Explicitly include the landrTrackId to ensure it's sent
          landrTrackId: formData.landrTrackId || ''
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update release');
      }
      
      toast({
        title: "Success",
        description: "Release updated successfully",
        duration: 5000,
      });
      
      // Get updated release
      const updatedRelease = await response.json();
      
      // Ensure the updated release has string IDs
      const processedRelease = {
        ...updatedRelease,
        _id: ensureString(updatedRelease._id),
        artists: updatedRelease.artists?.map(artist => {
          if (typeof artist === 'string') return artist;
          return {
            ...artist,
            _id: ensureString(artist._id)
          };
        }) || []
      };
      
      setRelease(processedRelease);
      
      // If the slug has changed, redirect to the new URL
      if (processedRelease.slug !== slug) {
        router.push(`/admin/releases/${processedRelease.slug}`);
      }
      
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update release",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Release</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/releases">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Releases
          </Link>
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : release ? (
        <div>
          <ReleaseForm
            initialData={release}
            artists={artists}
            onSubmit={handleSubmit}
          />
          
          <div className="mt-6 flex justify-end">
            <Button 
              type="button" 
              onClick={() => document.getElementById('release-form').requestSubmit()} 
              disabled={submitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {submitting && <span className="animate-spin mr-2">◌</span>}
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <Alert>
          <AlertTitle>Release not found</AlertTitle>
          <AlertDescription>
            Could not find a release with the specified slug.
            <Button variant="link" asChild className="p-0 ml-2">
              <Link href="/admin/releases">Go to releases</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
} 