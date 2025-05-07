// src/app/admin/artists/page.jsx
'use client'
import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw, Edit2, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { generateSlug } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRefresh } from '@/lib/refresh-context';

export default function AdminArtists() {
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingArtist, setEditingArtist] = useState(null);
  const router = useRouter();
  
  // Use the custom hook
  const { refreshKey } = useRefresh();

  useEffect(() => {
    fetchArtists();
  }, [refreshKey]); // Reload when refreshKey changes

  const fetchArtists = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/artists?fetchAll=true', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch artists: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.artists || !Array.isArray(data.artists)) {
        throw new Error('Invalid response format: artists data is missing or not an array');
      }
      
      setArtists(data.artists);
    } catch (error) {
      console.error('Error fetching artists:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredArtists = artists.filter(artist =>
    artist?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (artist?.spotifyData?.genres && artist.spotifyData.genres.some(
      genre => genre.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  const handleEdit = async (artist) => {
    try {
      // Fetch the complete artist data
      const response = await fetch(`/api/artists/${artist._id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch artist details');
      }
      
      const fullArtistData = await response.json();
      
      setEditingArtist(fullArtistData);
      setShowAddForm(true);
    } catch (error) {
      console.error('Error loading artist for editing:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (artistId) => {
    if (!confirm('Are you sure you want to delete this artist?')) return;
    
    try {
      const response = await fetch(`/api/artists/${artistId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete artist');
      
      setArtists(artists.filter(artist => artist._id !== artistId));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Artists</h1>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Search artists..."
              className="pr-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
            </span>
          </div>
          <Button 
            className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
            onClick={() => {
              setEditingArtist(null);
              setShowAddForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Artist
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle>All Artists</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading artists...</div>}>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : filteredArtists.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No artists found. Add your first artist to get started.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArtists.map((artist) => (
                  <div 
                    key={artist._id ? artist._id.toString() : `artist-${artist.name}`} 
                    className="border rounded-lg p-3 sm:p-4 relative"
                  >
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 mb-2">
                      <div className="flex items-center gap-2 sm:gap-3 flex-grow min-w-0">
                        <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 rounded-full overflow-hidden">
                          <Image
                            src={artist.image || (artist.spotifyData?.images?.[0]?.url) || '/images/placeholder-cover.jpg'}
                            alt={artist.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-grow">
                          <Link href={`/admin/artists/${artist.slug}`} className="font-medium hover:text-purple-600 block truncate">
                            {artist.name}
                          </Link>
                          <p className="text-sm text-gray-500 truncate">
                            {artist.spotifyData?.genres?.[0] || 'No genre'}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1 gap-1 mt-2 sm:mt-0 w-full sm:w-auto justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/admin/artists/${artist.slug}`)}
                          className="text-blue-500 hover:text-blue-700 h-8 w-8"
                        >
                          <span className="sr-only">View</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(artist)}
                          className="text-blue-500 hover:text-blue-700 h-8 w-8"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(artist._id)}
                          className="text-red-500 hover:text-red-700 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3 border-t pt-2">
                      <h4 className="text-xs uppercase text-gray-500 font-semibold mb-1">Plans</h4>
                      {(!artist.plans || artist.plans.length === 0) ? (
                        <p className="text-sm text-gray-400 italic">No active plans</p>
                      ) : (
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {artist.plans?.map((plan, index) => (
                            <div
                              key={index}
                              className={`px-1 sm:px-2 py-1 text-xs rounded-md flex items-center ${
                                plan.paymentStatus === 'completed' ? 'bg-green-50 border border-green-200' : 
                                plan.paymentStatus === 'pending' ? 'bg-yellow-50 border border-yellow-200' : 
                                'bg-red-50 border border-red-200'
                              }`}
                            >
                              <span className="font-medium text-green-500">{plan.type.toUpperCase()}</span>
                              <span className={`ml-1 w-2 h-2 rounded-full ${
                                plan.status === 'active' ? 'bg-green-500' :
                                plan.status === 'expired' ? 'bg-red-500' :
                                'bg-yellow-500'
                              }`}></span>
                              <span className={`ml-1 sm:ml-2 px-1 text-xs rounded ${
                                plan.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                plan.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {plan.paymentStatus}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {artist.paymentHistory?.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          <span className="font-medium">Latest payment:</span> {artist.paymentHistory[0].status} (${artist.paymentHistory[0].amount})
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Suspense>
        </CardContent>
      </Card>

      {showAddForm && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingArtist ? 'Edit Artist' : 'Add New Artist'}
          </h2>
          <Card>
            <CardContent className="pt-6">
              <Suspense fallback={<div>Loading form...</div>}>
                <div className="space-y-4">
                  <ArtistForm 
                    artist={editingArtist}
                    onSuccess={() => {
                      setShowAddForm(false);
                      fetchArtists();
                    }}
                  />
                </div>
              </Suspense>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function ArtistForm({ artist, onSuccess }) {
  // Define the getPlanPrice function at the top of the component
  const getPlanPrice = (planType) => {
    switch (planType) {
      case 'basic': return 99;
      case 'pro': return 599;
      case 'premium': return 1199;
      case 'aoc': return 499;
      default: return 0;
    }
  };

  // Now initialize state with the getPlanPrice function already defined
  const [formData, setFormData] = useState({
    name: artist?.name || '',
    slug: artist?.slug || '',
    bio: artist?.bio || '',
    image: artist?.image || '',
    spotifyUrl: artist?.spotifyUrl || '',
    spotifyArtistId: artist?.spotifyArtistId || '',
    instagramUrl: artist?.instagramUrl || '',
    featured: artist?.featured || true,
    plans: Array.isArray(artist?.plans) ? artist.plans : [],
    paymentHistory: Array.isArray(artist?.paymentHistory) ? artist.paymentHistory : []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [spotifyData, setSpotifyData] = useState(artist?.spotifyData || null);
  const [error, setError] = useState(null);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [newPlan, setNewPlan] = useState({
    type: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    autoRenew: false,
    paymentStatus: 'pending',
    price: getPlanPrice(''),
  });

  useEffect(() => {
    if (artist) {
      setFormData({
        name: artist.name || '',
        slug: artist.slug || '',
        bio: artist.bio || '',
        image: artist.image || '',
        spotifyUrl: artist.spotifyUrl || '',
        spotifyArtistId: artist.spotifyArtistId || '',
        instagramUrl: artist.instagramUrl || '',
        featured: artist.featured || false,
        plans: Array.isArray(artist.plans) ? artist.plans : [],
        paymentHistory: Array.isArray(artist.paymentHistory) ? artist.paymentHistory : []
      });
      setSpotifyData(artist.spotifyData || null);
    }
  }, [artist]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    
    // Auto-generate slug when name changes
    if (id === 'name' && value) {
      setFormData({
        ...formData,
        name: value,
        slug: generateSlug(value)
      });
    } else {
      setFormData({
        ...formData,
        [id]: value
      });
    }
  };

  const fetchSpotifyArtistData = async () => {
    if (!formData.spotifyArtistId) {
      setError("Please enter a Spotify Artist ID");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/spotify?artistId=${formData.spotifyArtistId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch artist data from Spotify');
      }
      
      const data = await response.json();
      setSpotifyData(data.artist);
      
      // Pre-fill form with Spotify data
      setFormData(prev => ({
        ...prev,
        name: data.artist.name || prev.name,
        slug: generateSlug(data.artist.name) || prev.slug,
        spotifyUrl: data.artist.external_urls?.spotify || prev.spotifyUrl,
        image: data.artist.images?.[0]?.url || prev.image
      }));
    } catch (error) {
      console.error("Error fetching Spotify data:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPlan = () => {
    // Check if this plan type already exists for this artist
    const planExists = formData.plans.some(
      plan => plan.type === newPlan.type && plan.status === 'active'
    );
    
    if (planExists) {
      setError(`This artist already has an active ${newPlan.type} plan. Please update the existing plan instead.`);
      return;
    }
    
    // Clear any previous errors
    setError(null);
    
    // Add the plan to the artist
    const updatedPlan = {
      ...newPlan,
      status: 'active',
      purchaseDate: new Date()
    };
    
    // Add a corresponding payment history entry
    const paymentEntry = {
      plan: newPlan.type,
      amount: newPlan.price,
      status: newPlan.paymentStatus,
      date: new Date(),
      paymentMethod: 'credit_card'
    };
    
    setFormData(prev => ({
      ...prev,
      plans: [...prev.plans, updatedPlan],
      paymentHistory: [paymentEntry, ...prev.paymentHistory]
    }));
    
    // Reset the new plan form
    setNewPlan({
      type: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      autoRenew: false,
      paymentStatus: 'pending',
      price: getPlanPrice(''),
    });
    setShowAddPlan(false);
  };

  const handleRemovePlan = (index) => {
    setFormData(prev => ({
      ...prev,
      plans: prev.plans.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Make sure we have the required fields
      if (!formData.name || !formData.slug || !formData.bio || !formData.image) {
        throw new Error('Please fill in all required fields');
      }
      
      // Prepare data for submission
      const dataToSubmit = {
        ...formData,
        // Ensure plans have proper format
        plans: formData.plans.map(plan => ({
          ...plan,
          price: plan.price || getPlanPrice(plan.type),
          status: plan.status || 'active',
          startDate: plan.startDate || new Date().toISOString()
        }))
      };
      
      const url = artist?._id ? `/api/artists/${artist._id}` : '/api/artists';
      const method = artist?._id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to save artist (${response.status})`);
      }

      const savedArtist = await response.json();
      
      onSuccess();
    } catch (error) {
      console.error("Error saving artist:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanTypeChange = (e) => {
    const type = e.target.value;
    setNewPlan({
      ...newPlan,
      type,
      price: getPlanPrice(type)
    });
  };

  const updatePlanPaymentStatus = (index, newStatus) => {
    const updatedPlans = [...formData.plans];
    const plan = updatedPlans[index];
    
    // Skip if already in target status
    if (plan.paymentStatus === newStatus) {
      return;
    }
    
    // Update the plan payment status
    updatedPlans[index] = {
      ...plan,
      paymentStatus: newStatus
    };
    
    // Check if there's already a payment history entry for this plan
    const existingEntryIndex = formData.paymentHistory.findIndex(
      entry => entry.plan === plan.type && 
      entry.amount === (plan.price || getPlanPrice(plan.type))
    );
    
    // If there's an existing entry, update it instead of creating a new one
    if (existingEntryIndex !== -1) {
      const updatedPaymentHistory = [...formData.paymentHistory];
      updatedPaymentHistory[existingEntryIndex] = {
        ...updatedPaymentHistory[existingEntryIndex],
        status: newStatus,
        date: new Date()
      };
      
      setFormData({
        ...formData, 
        plans: updatedPlans,
        paymentHistory: updatedPaymentHistory
      });
    } else {
      // Otherwise, create a new payment history entry
      const paymentEntry = {
        plan: plan.type,
        amount: plan.price || getPlanPrice(plan.type),
        status: newStatus,
        date: new Date(),
        paymentMethod: 'credit_card',
        transactionId: `tx_${Date.now()}`
      };
      
      setFormData({
        ...formData, 
        plans: updatedPlans,
        paymentHistory: [paymentEntry, ...formData.paymentHistory]
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="spotifyArtistId" className="block text-sm font-medium text-gray-700">
          Spotify Artist ID
        </label>
        <div className="mt-1 flex space-x-2">
          <Input 
            id="spotifyArtistId" 
            value={formData.spotifyArtistId}
            onChange={handleChange}
            placeholder="e.g. 0TnOYISbd1XYRBk9myaseg" 
            className="flex-1" 
          />
          <Button 
            type="button"
            onClick={fetchSpotifyArtistData}
            disabled={isLoading || !formData.spotifyArtistId}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              'Fetch Data'
            )}
          </Button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Enter the Spotify Artist ID to automatically fetch artist data
        </p>
      </div>
      
      {spotifyData && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-md">
          <h3 className="text-sm font-medium text-green-800">Data fetched from Spotify</h3>
          <ul className="mt-2 text-sm text-green-700">
            <li>Name: {spotifyData.name}</li>
            <li>Followers: {spotifyData.followers?.total?.toLocaleString()}</li>
            <li>Genres: {spotifyData.genres?.join(', ')}</li>
            <li>Popularity: {spotifyData.popularity}/100</li>
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Artist Name
          </label>
          <Input 
            id="name" 
            value={formData.name}
            onChange={handleChange}
            placeholder="Artist Name" 
            className="mt-1" 
            required 
          />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            URL Slug
          </label>
          <Input 
            id="slug" 
            value={formData.slug}
            onChange={handleChange}
            placeholder="artist-name" 
            className="mt-1" 
            required 
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Biography
        </label>
        <textarea
          id="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          placeholder="Artist biography"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Profile Image URL
        </label>
        <Input 
          id="image" 
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg" 
          className="mt-1" 
          required 
        />
        {formData.image && (
          <div className="mt-2">
            <img 
              src={formData.image} 
              alt="Preview" 
              className="h-24 w-24 object-cover rounded-md" 
            />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="spotifyUrl" className="block text-sm font-medium text-gray-700">
            Spotify URL
          </label>
          <Input 
            id="spotifyUrl" 
            value={formData.spotifyUrl}
            onChange={handleChange}
            placeholder="https://open.spotify.com/artist/..." 
            className="mt-1" 
          />
        </div>
        <div>
          <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700">
            Instagram URL
          </label>
          <Input 
            id="instagramUrl" 
            value={formData.instagramUrl}
            onChange={handleChange}
            placeholder="https://instagram.com/username" 
            className="mt-1" 
          />
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          id="featured"
          type="checkbox"
          checked={formData.featured}
          onChange={(e) => setFormData({...formData, featured: e.target.checked})}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
          Feature this artist on homepage
        </label>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Plans</h3>
          <Button
            type="button"
            onClick={() => setShowAddPlan(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            Add Plan
          </Button>
        </div>

        {showAddPlan && (
          <div className="p-4 border rounded-lg space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Plan Type
                </label>
                <select
                  value={newPlan.type}
                  onChange={handlePlanTypeChange}
                  className="mt-1 block w-full rounded-md border bg-gray-800 border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select a plan</option>
                  <option value="basic">Basic Plan (₹99)</option>
                  <option value="pro">Pro Plan (₹599)</option>
                  <option value="premium">Premium Plan (₹1199)</option>
                  <option value="aoc">AOC Plan (₹499)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payment Status
                </label>
                <select
                  value={newPlan.paymentStatus}
                  onChange={(e) => setNewPlan({ ...newPlan, paymentStatus: e.target.value })}
                  className="mt-1 block w-full rounded-md border bg-gray-800  border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newPlan.startDate}
                  onChange={(e) => setNewPlan({ ...newPlan, startDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={newPlan.endDate}
                  onChange={(e) => setNewPlan({ ...newPlan, endDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newPlan.autoRenew}
                  onChange={(e) => setNewPlan({ ...newPlan, autoRenew: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Auto-renew
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddPlan(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddPlan}
                disabled={!newPlan.type || !newPlan.startDate}
                className="bg-green-600 hover:bg-green-700"
              >
                Add Plan
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2 ">
          {formData.plans.map((plan, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-800 border border-gray-300 rounded-lg">
              <div>
                <div className="font-medium capitalize">{plan.type} - ${plan.price || getPlanPrice(plan.type)}</div>
                <div className="text-sm text-gray-500">
                  <span>{new Date(plan.startDate).toLocaleDateString()}</span>
                  {plan.endDate && <span> - {new Date(plan.endDate).toLocaleDateString()}</span>}
                </div>
                <div className="flex space-x-2 mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    plan.status === 'active' ? 'bg-green-100 text-green-800' :
                    plan.status === 'expired' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {plan.status}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    plan.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                    plan.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                    plan.paymentStatus === 'refunded' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    Payment: {plan.paymentStatus}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updatePlanPaymentStatus(index, 'completed')}
                  disabled={plan.paymentStatus === 'completed'}
                  className="bg-green-50 text-green-700 hover:bg-green-100"
                >
                  Mark Paid
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePlan(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-4">
        <Button 
          type="button"
          variant="outline"
          onClick={() => {
            setFormData({
              name: '',
              slug: '',
              bio: '',
              image: '',
              spotifyUrl: '',
              spotifyArtistId: '',
              instagramUrl: '',
              featured: false,
              plans: [],
              paymentHistory: []
            });
            setSpotifyData(null);
            setError(null);
          }}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? 'Saving...' : 'Save Artist'}
        </Button>
      </div>
    </form>
  );
}