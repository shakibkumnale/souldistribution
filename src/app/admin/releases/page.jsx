'use client';

// src/app/admin/releases/page.jsx
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReleaseForm from '@/components/admin/ReleaseForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRefresh } from '@/lib/refresh-context';

// Helper function to ensure all ObjectId instances are properly serialized
function ensureString(value) {
  if (value === null || value === undefined) return '';
  
  // Handle string values directly
  if (typeof value === 'string') return value;
  
  // Handle standard ObjectId serialization
  if (typeof value === 'object') {
    // Handle MongoDB ObjectId directly
    if (value._bsontype === 'ObjectID' || value.constructor?.name === 'ObjectID') {
      return value.toString();
    }
    
    // Handle case where object has both _id and toString (common MongoDB pattern)
    if (value.id && value.toString && Object.keys(value).length === 2) {
      return value.toString();
    }
    
    // Handle case where the value is a wrapped ObjectId
    if (value._id) {
      return ensureString(value._id);
    }
    
    // Check for toString method
    if (typeof value.toString === 'function') {
      const str = value.toString();
      // If it's not just the default [object Object] string
      if (str !== '[object Object]') {
        return str;
      }
    }
    
    // Handle special case for objects with id property but no _id
    if (value.id && typeof value.id === 'string') {
      return value.id;
    }
    
    // Last resort: convert to JSON and log a warning
    console.warn('Unable to properly stringify object:', value);
    return JSON.stringify(value);
  }
  
  // For any other type (number, boolean, etc.)
  return String(value);
}

export default function AdminReleases() {
  const [artists, setArtists] = useState([]);
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Use the custom hook
  const { refreshKey } = useRefresh();
  
  // Fetch artists on mount or when refreshKey changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set loading state to show spinner
        setLoading(true);
        
        // Fetch artists
        const artistsResponse = await fetch('/api/artists');
        if (!artistsResponse.ok) {
          throw new Error('Failed to fetch artists');
        }
        const artistsData = await artistsResponse.json();
        setArtists(artistsData.artists || []);
        
        // Fetch releases - use fetchAll=true to get all releases without pagination
        const releasesResponse = await fetch('/api/releases?fetchAll=true');
        if (!releasesResponse.ok) {
          throw new Error('Failed to fetch releases');
        }
        const releasesData = await releasesResponse.json();
        
        // Process release data to ensure consistent ID formats and add keys for React
        const processedReleases = releasesData.releases.map(release => {
          const releaseId = typeof release._id === 'object' 
            ? release._id.toString() 
            : release._id;
          
          return {
            ...release,
            _id: releaseId,
            key: releaseId // Add a key prop for React
          };
        });
        
        setReleases(processedReleases);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [refreshKey, success]); // Refresh when refreshKey changes or a new release is created
  
  // Handle form submission
  const handleSubmitRelease = async (formData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Ensure landrTrackId is explicitly included
      const submissionData = {
        ...formData,
        landrTrackId: formData.landrTrackId || ''
      };
      
      const response = await fetch('/api/releases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'Failed to create release');
      }
      
      setSuccess(`Release "${responseData.title}" created successfully!`);
      
      // Reset the form by changing the key
      // This will cause React to remount the component
      
    } catch (err) {
      console.error('Error creating release:', err);
      setError(err.message || 'An error occurred while creating the release');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Releases</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              placeholder="Search releases..."
              className="pr-8 w-64"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
            </span>
          </div>
          <Button className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4" />
            Add Release
          </Button>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>All Releases</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading releases...</div>}>
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              <div className="grid grid-cols-1 gap-4">
                {releases.length > 0 ? (
                  releases.map((release, index) => {
                    // Debug each release ID before rendering
                    const releaseId = ensureString(release._id);
                    const releaseSlug = release.slug || `release-${index}`;
                    
                    return (
                      <div key={`release-${index}`} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <img 
                            src={release.coverImage || '/images/placeholder-cover.jpg'} 
                            alt={release.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-medium">{release.title}</h3>
                            <p className="text-sm text-gray-500">
                              {release.artists.map(artist => 
                                typeof artist === 'string' 
                                  ? artist 
                                  : (artist.name || 'Unknown Artist')
                              ).join(', ')}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" asChild>
                          <Link href={`/admin/releases/${releaseSlug}`}>
                            Edit
                          </Link>
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No releases found. Add your first release to get started.
                  </p>
                )}
              </div>
            </div>
          </Suspense>
        </CardContent>
      </Card>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Add New Release</h2>
        <Card>
          <CardContent className="pt-6">
            <Suspense fallback={<div>Loading form...</div>}>
              <div className="space-y-4">
                <ReleaseForm 
                  artists={artists} 
                  onSubmit={handleSubmitRelease}
                  key={success} // Reset form on successful submission
                />
                {loading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                    <span className="ml-2">Creating release...</span>
                  </div>
                )}
              </div>
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}