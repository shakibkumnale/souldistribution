'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Edit, ChevronLeft, ExternalLink, Music, Youtube, 
  Instagram, CreditCard, CheckCircle, XCircle, AlertCircle, AlertTriangle, Trash2, PlusCircle 
} from 'lucide-react';
import { format } from 'date-fns';
import ArtistForm from '@/components/admin/ArtistForm';
import ReleasesTable from '@/components/admin/ReleasesTable';
import { useToast } from '@/components/ui/use-toast';

export default function ArtistDetailPage({ params }) {
  // Use React.use() to unwrap the params
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;
  const router = useRouter();
  
  const [artist, setArtist] = useState(null);
  const [releases, setReleases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        // We need to find the artist by slug
        const response = await fetch(`/api/artists/by-slug/${slug}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch artist details');
        }
        
        const data = await response.json();
        setArtist(data);
      } catch (error) {
        console.error('Error fetching artist:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchReleases = async () => {
      try {
        // Fetch releases for this artist by slug
        const response = await fetch(`/api/artists/releases?spotifyArtistId=${encodeURIComponent(artist?.spotifyArtistId || '')}&artistId=${encodeURIComponent(artist?._id || '')}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch releases');
        }
        
        const data = await response.json();
        setReleases(data.releases || []);
      } catch (error) {
        console.error('Error fetching releases:', error);
        // Don't show error toast for releases - it's not critical
      }
    };

    if (slug) {
      fetchArtist();
    }

    if (artist && (artist._id || artist.spotifyArtistId)) {
      fetchReleases();
    }
  }, [slug, artist?._id, artist?.spotifyArtistId]);
  
  const handleEdit = () => {
    router.push(`/admin/artists?edit=${artist._id}`);
  };

  const handleArtistSubmit = async (formData) => {
    try {
      const response = await fetch(`/api/artists/${artist._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update artist');
      }
      
      const updatedArtist = await response.json();
      setArtist(updatedArtist);
      
      toast({
        title: "Artist Updated",
        description: "Artist information has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating artist:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the artist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteArtist = async () => {
    if (!confirm('Are you sure you want to delete this artist? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/artists/${artist._id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete artist');
      }
      
      toast({
        title: "Artist Deleted",
        description: "The artist has been deleted successfully.",
      });
      
      router.push('/admin/artists');
    } catch (error) {
      console.error('Error deleting artist:', error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the artist. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Artists</span>
        </Button>
        
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading artist: {error}
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Artists</span>
        </Button>
        
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Artist not found.
        </div>
      </div>
    );
  }
  
  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded flex items-center gap-1 text-xs"><CheckCircle className="h-3 w-3" /> Completed</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded flex items-center gap-1 text-xs"><AlertCircle className="h-3 w-3" /> Pending</span>;
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded flex items-center gap-1 text-xs"><XCircle className="h-3 w-3" /> Failed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Artists</span>
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDeleteArtist} className="text-red-500 border-red-500 hover:bg-red-100 hover:bg-opacity-10">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Artist
          </Button>
          
          <Button onClick={handleEdit} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700">
            <Edit className="h-4 w-4" />
            <span>Edit Artist</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative h-48 w-48 rounded-md overflow-hidden">
                  <Image
                    src={artist.image || (artist.spotifyData?.images?.[0]?.url) || '/images/placeholder-cover.jpg'}
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="text-center">
                  <h1 className="text-2xl font-bold">{artist.name}</h1>
                  {artist.isVerified && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs mt-1 inline-block">
                      Verified Artist
                    </span>
                  )}
                  {artist.featured && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs mt-1 inline-block ml-1">
                      Featured
                    </span>
                  )}
                </div>
                
                <div className="w-full space-y-3 mt-4">
                  {artist.spotifyUrl && (
                    <a 
                      href={artist.spotifyUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 text-green-600 hover:text-green-700"
                    >
                      <Music className="h-4 w-4" />
                      <span>Spotify</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  )}
                  
                  {artist.youtubeUrl && (
                    <a 
                      href={artist.youtubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <Youtube className="h-4 w-4" />
                      <span>YouTube</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  )}
                  
                  {artist.instagramUrl && (
                    <a 
                      href={artist.instagramUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 text-pink-600 hover:text-pink-700"
                    >
                      <Instagram className="h-4 w-4" />
                      <span>Instagram</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Spotify Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Followers</p>
                  <p className="text-lg font-semibold">
                    {artist.spotifyData?.followers?.toLocaleString() || 'No data'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Popularity</p>
                  <div className="h-2 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-2 bg-green-500 rounded-full" 
                      style={{ width: `${artist.spotifyData?.popularity || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1">
                    {artist.spotifyData?.popularity || 0}/100
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Genres</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {artist.spotifyData?.genres?.length > 0 ? (
                      artist.spotifyData.genres.map((genre, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                          {genre}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">No genres available</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Artist Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Biography</h3>
                  <p className="mt-1">{artist.bio}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Spotify ID</h3>
                    <p className="mt-1 text-sm font-mono  p-1 rounded">
                      {artist.spotifyArtistId || 'Not available'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Slug</h3>
                    <p className="mt-1 text-sm font-mono  p-1 rounded">
                      {artist.slug}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Joined Date</h3>
                    <p className="mt-1 text-sm">
                      {artist.joinedDate ? format(new Date(artist.joinedDate), 'PPP') : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="plans">
            <TabsList>
              <TabsTrigger value="plans">Plans & Payments</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="releases">Releases ({releases.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="plans" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-500" />
                    Subscription Plans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(!artist.plans || artist.plans.length === 0) ? (
                    <p className="text-gray-500">No active plans.</p>
                  ) : (
                    <div className="space-y-4">
                      {artist.plans.map((plan, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h3 className="text-lg font-semibold capitalize">
                                {plan.type} Plan
                                <span className="ml-2 text-sm font-normal text-gray-500">
                                  (${plan.price || '0'})
                                </span>
                              </h3>
                              
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  plan.status === 'active' ? 'bg-green-100 text-green-800' :
                                  plan.status === 'expired' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {plan.status}
                                </span>
                                {getPaymentStatusBadge(plan.paymentStatus)}
                                {plan.autoRenew && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                    Auto-renew
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right text-sm text-gray-500">
                              <div>Start: {format(new Date(plan.startDate), 'PP')}</div>
                              {plan.endDate && <div>End: {format(new Date(plan.endDate), 'PP')}</div>}
                              {plan.purchaseDate && <div>Purchased: {format(new Date(plan.purchaseDate), 'PPP')}</div>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  {(!artist.paymentHistory || artist.paymentHistory.length === 0) ? (
                    <p className="text-gray-500">No payment history.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-2 py-2 text-left">Date</th>
                            <th className="px-2 py-2 text-left">Plan</th>
                            <th className="px-2 py-2 text-left">Amount</th>
                            <th className="px-2 py-2 text-left">Status</th>
                            <th className="px-2 py-2 text-left">Transaction ID</th>
                            <th className="px-2 py-2 text-left">Method</th>
                          </tr>
                        </thead>
                        <tbody>
                          {artist.paymentHistory.map((payment, index) => (
                            <tr key={index} className="border-b">
                              <td className="px-2 py-2 text-sm">
                                {format(new Date(payment.date), 'PP')}
                              </td>
                              <td className="px-2 py-2 text-sm capitalize">
                                {payment.plan}
                              </td>
                              <td className="px-2 py-2 text-sm">
                                ${payment.amount}
                              </td>
                              <td className="px-2 py-2">
                                {getPaymentStatusBadge(payment.status)}
                              </td>
                              <td className="px-2 py-2  font-mono text-xs">
                                {payment.transactionId || '-'}
                              </td>
                              <td className="px-2 py-2 text-sm">
                                {payment.paymentMethod || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Spotify Playlists</CardTitle>
                </CardHeader>
                <CardContent>
                  {(!artist.spotifyPlaylists || artist.spotifyPlaylists.length === 0) ? (
                    <p className="text-gray-500">No playlists available.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {artist.spotifyPlaylists.map((playlist, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                          <div className="relative h-40 w-full">
                            <Image
                              src={playlist.coverImage || '/images/placeholder-cover.jpg'}
                              alt={playlist.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium">{playlist.title}</h3>
                            <p className="text-sm text-gray-500 truncate">{playlist.description}</p>
                            <a 
                              href={`https://open.spotify.com/playlist/${playlist.playlistId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1 mt-2"
                            >
                              <Music className="h-3 w-3" />
                              <span>View on Spotify</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>YouTube Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  {(!artist.youtubeVideos || artist.youtubeVideos.length === 0) ? (
                    <p className="text-gray-500">No videos available.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {artist.youtubeVideos.map((video, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                          <div className="relative h-40 w-full">
                            <Image
                              src={video.thumbnail || '/images/placeholder-cover.jpg'}
                              alt={video.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="h-12 w-12 rounded-full bg-red-600 text-white flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium">{video.title}</h3>
                            <a 
                              href={`https://www.youtube.com/watch?v=${video.videoId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 mt-2"
                            >
                              <Youtube className="h-3 w-3" />
                              <span>Watch on YouTube</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="releases">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-medium">Releases for {artist.name}</h2>
                <Link href={`/admin/releases/new?artistId=${artist._id}`}>
                  <Button className="flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Release
                  </Button>
                </Link>
              </div>
              
              {releases.length > 0 ? (
                <ReleasesTable releases={releases} />
              ) : (
                <div className="text-center py-10 border border-dashed rounded-md">
                  <p className="text-muted-foreground">No releases found for this artist</p>
                  <Link href={`/admin/releases/new?artistId=${artist._id}`}>
                    <Button variant="link" className="mt-2">
                      Add the first release
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 