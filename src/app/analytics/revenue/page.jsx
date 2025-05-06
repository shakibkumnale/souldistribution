'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  Legend, LineChart, Line, PieChart, Pie, Cell, 
} from 'recharts';
import { 
  DollarSign, Music, TrendingUp, AlertCircle, Loader2, 
  Filter, RefreshCw, Store, Globe, Calendar, X, 
  BarChart2, ListFilter, PieChart as PieChartIcon, MapPin
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Helper function to format currency
function formatCurrency(amount) {
  // For very small amounts, show more decimal places
  if (Math.abs(amount) < 0.01) {
    return '$' + amount.toFixed(6);
  }
  // For small amounts, show 4 decimal places
  if (Math.abs(amount) < 1) {
    return '$' + amount.toFixed(4);
  }
  // For medium amounts, show 2 decimal places
  if (Math.abs(amount) < 1000) {
    return '$' + amount.toFixed(2);
  }
  // For large amounts, use abbreviation
  return '$' + formatNumber(amount);
}

// Helper function to format large numbers
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toFixed(2);
}

// Color palette for charts
const CHART_COLORS = [
  '#8b5cf6', // Purple
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#ef4444', // Red
  '#10b981', // Green
  '#f59e0b', // Amber
  '#6b7280', // Gray
  '#3b82f6', // Blue
];

// Custom tooltip for pie charts
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-md shadow-lg p-3 text-sm">
        <p className="font-semibold text-white mb-1">{data.name}</p>
        <p className="text-purple-400">{formatCurrency(data.value)}</p>
        <p className="text-gray-400">{((data.value / data.payload.totalValue) * 100).toFixed(1)}% of total</p>
      </div>
    );
  }
  return null;
};

// Calculate responsive radius based on screen size
const useResponsiveRadius = () => {
  const [radius, setRadius] = useState(110);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setRadius(70); // Small screens
      } else if (window.innerWidth < 1024) {
        setRadius(90); // Medium screens
      } else {
        setRadius(110); // Large screens
      }
    };

    // Initial calculation
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return radius;
};

export default function RevenueAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revenueData, setRevenueData] = useState([]);
  const [summary, setSummary] = useState({
    totalGrossEarnings: 0,
    totalNetEarnings: 0,
    totalQuantity: 0
  });
  const [topStores, setTopStores] = useState([]);
  const [topCountries, setTopCountries] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Filters
  const [artistFilter, setArtistFilter] = useState('all');
  const [storeFilter, setStoreFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [artists, setArtists] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentArtist, setCurrentArtist] = useState(null);
  
  // For track details modal
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [showTrackModal, setShowTrackModal] = useState(false);

  const router = useRouter();
  const radius = useResponsiveRadius();

  const fetchRevenueAnalytics = async (filters = {}) => {
    try {
      setIsFiltering(true);
      setLoading(true);
      setError('');
      
      // Build query parameters
      const params = new URLSearchParams();
      
      if (filters.artist && filters.artist !== 'all') {
        params.append('artist', filters.artist);
      }
      
      if (filters.store && filters.store !== 'all') {
        params.append('store', filters.store);
      }
      
      if (filters.country && filters.country !== 'all') {
        params.append('country', filters.country);
      }
      
      if (filters.from) {
        params.append('from', filters.from);
      }
      
      if (filters.to) {
        params.append('to', filters.to);
      }
      
      const response = await fetch(`/api/analytics/revenue?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch revenue data');
      }
      
      const data = await response.json();
      
      setRevenueData(data.revenue || []);
      setSummary(data.summary || {
        totalGrossEarnings: 0,
        totalNetEarnings: 0,
        totalQuantity: 0
      });
      setTopStores(data.topStores || []);
      setTopCountries(data.topCountries || []);
      setRecentPayments(data.recentPayments || []);
      setArtists(data.artists || []);
      setCurrentArtist(data.currentArtist || null);
    } catch (err) {
      console.error('Error fetching revenue analytics:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  };

  useEffect(() => {
    fetchRevenueAnalytics();
  }, []);

  // Handle query string for artist filtering
  useEffect(() => {
    // Check if we have a query string with filters
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const artistId = params.get('artist');
      const store = params.get('store');
      const country = params.get('country');
      
      // Set the filters based on URL parameters
      if (artistId) setArtistFilter(artistId);
      if (store) setStoreFilter(store);
      if (country) setCountryFilter(country);
      
      // Fetch data with these filters
      fetchRevenueAnalytics({
        artist: artistId || 'all',
        store: store || 'all',
        country: country || 'all'
      });
    }
  }, []);

  const handleFilterChange = (filterType, value) => {
    // Update the appropriate filter state
    switch (filterType) {
      case 'artist':
        setArtistFilter(value);
        break;
      case 'store':
        setStoreFilter(value);
        break;
      case 'country':
        setCountryFilter(value);
        break;
      default:
        break;
    }
    
    // Prepare filters object
    const filters = {
      artist: filterType === 'artist' ? value : artistFilter,
      store: filterType === 'store' ? value : storeFilter,
      country: filterType === 'country' ? value : countryFilter
    };
    
    // Update URL with query parameters
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      
      Object.entries(filters).forEach(([key, val]) => {
        if (val && val !== 'all') {
          url.searchParams.set(key, val);
        } else {
          url.searchParams.delete(key);
        }
      });
      
      window.history.pushState({}, '', url);
    }
    
    // Fetch data with updated filters
    fetchRevenueAnalytics(filters);
  };

  const clearFilters = () => {
    // Reset all filters
    setArtistFilter('all');
    setStoreFilter('all');
    setCountryFilter('all');
    
    // Clear URL parameters
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.search = '';
      window.history.pushState({}, '', url);
    }
    
    // Fetch data without filters
    fetchRevenueAnalytics({});
  };
  
  // Handle artist click to filter by that artist
  const handleArtistClick = (artist) => {
    if (artist && artist._id) {
      handleFilterChange('artist', artist._id);
    }
  };
  
  // Handle track click to show detailed info
  const handleTrackClick = (track) => {
    // Navigate to the track-specific revenue page
    const trackId = track.isrc || track._id || track.slug;
    if (trackId) {
      router.push(`/analytics/revenue/${trackId}`);
    }
  };
  
  // Close track details modal
  const closeTrackModal = () => {
    setShowTrackModal(false);
    setSelectedTrack(null);
  };

  // Prepare charts data
  const storeChartData = topStores.map((store, index) => ({
    name: store._id,
    value: store.netEarnings,
    color: CHART_COLORS[index % CHART_COLORS.length]
  }));

  const countryChartData = topCountries.map((country, index) => ({
    name: country._id || 'Unknown',
    value: country.netEarnings,
    color: CHART_COLORS[index % CHART_COLORS.length]
  }));

  // Group revenue data by track for the track details modal
  const getTrackRevenueDetails = (track) => {
    if (!track || !track.isrc) return [];
    
    // Filter revenue data for this track
    return revenueData.filter(item => 
      item.isrc === track.isrc || 
      (item.track && item.track.toLowerCase() === track.track?.toLowerCase())
    );
  };
  
  // Group track data to avoid duplicates in the table
  const getGroupedTracks = () => {
    const trackMap = new Map();
    
    revenueData.forEach(item => {
      const trackId = item.isrc || item.track?.toLowerCase() || 'unknown';
      
      if (!trackMap.has(trackId)) {
        trackMap.set(trackId, {
          isrc: item.isrc,
          track: item.track || (item.release?.title || 'Unknown Track'),
          release: item.release,
          artists: item.release?.artists || [],
          primaryArtist: item.primaryArtist,
          totalNetEarnings: 0,
          totalGrossEarnings: 0,
          totalQuantity: 0,
          stores: new Map(),
          countries: new Map(),
          latestPaymentDate: new Date(0),
          latestReportDate: new Date(0)
        });
      }
      
      const trackData = trackMap.get(trackId);
      
      // Add to totals
      trackData.totalNetEarnings += item.netEarnings;
      trackData.totalGrossEarnings += item.grossEarnings;
      trackData.totalQuantity += item.quantity;
      
      // Track by store
      if (!trackData.stores.has(item.store)) {
        trackData.stores.set(item.store, {
          name: item.store,
          service: item.storeService,
          totalNetEarnings: 0,
          totalGrossEarnings: 0,
          totalQuantity: 0,
          countries: new Map()
        });
      }
      
      const storeData = trackData.stores.get(item.store);
      storeData.totalNetEarnings += item.netEarnings;
      storeData.totalGrossEarnings += item.grossEarnings;
      storeData.totalQuantity += item.quantity;
      
      // Track by country within store
      const countryKey = item.country || 'Unknown';
      if (!storeData.countries.has(countryKey)) {
        storeData.countries.set(countryKey, {
          name: countryKey,
          totalNetEarnings: 0,
          totalGrossEarnings: 0,
          totalQuantity: 0,
          entries: []
        });
      }
      
      const countryData = storeData.countries.get(countryKey);
      countryData.totalNetEarnings += item.netEarnings;
      countryData.totalGrossEarnings += item.grossEarnings;
      countryData.totalQuantity += item.quantity;
      countryData.entries.push(item);
      
      // Also track by country overall
      if (!trackData.countries.has(countryKey)) {
        trackData.countries.set(countryKey, {
          name: countryKey,
          totalNetEarnings: 0,
          totalGrossEarnings: 0,
          totalQuantity: 0
        });
      }
      
      const trackCountryData = trackData.countries.get(countryKey);
      trackCountryData.totalNetEarnings += item.netEarnings;
      trackCountryData.totalGrossEarnings += item.grossEarnings;
      trackCountryData.totalQuantity += item.quantity;
      
      // Update latest payment date
      const paymentDate = new Date(item.paymentDate);
      if (paymentDate > trackData.latestPaymentDate) {
        trackData.latestPaymentDate = paymentDate;
      }
      
      // Update latest report date
      const reportDate = new Date(item.reportingPeriodStart || item.paymentDate);
      if (reportDate > trackData.latestReportDate) {
        trackData.latestReportDate = reportDate;
      }
    });
    
    // Convert map to array and sort by earnings
    return Array.from(trackMap.values())
      .sort((a, b) => b.totalNetEarnings - a.totalNetEarnings);
  };
  
  const groupedTracks = getGroupedTracks();

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-6 bg-gray-950 text-gray-100 min-h-screen">
      <header className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-purple-400">Revenue Analytics</h1>
            <p className="text-gray-400">Track your music's earnings across all platforms</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
          
            
            {(artistFilter !== 'all' || storeFilter !== 'all' || countryFilter !== 'all') && (
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-gray-900 border-gray-700 hover:bg-gray-800"
                onClick={clearFilters}
                disabled={isFiltering}
              >
                {isFiltering ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
        
        {/* Filter section */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-medium text-gray-200 mb-3 flex items-center">
            <Filter className="w-4 h-4 mr-2 text-purple-400" />
            Filters
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Artist</label>
              <Select value={artistFilter} onValueChange={(value) => handleFilterChange('artist', value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                  <SelectValue placeholder="All Artists" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                  <SelectItem value="all">All Artists</SelectItem>
                  {artists.map(artist => (
                    <SelectItem key={artist._id} value={artist._id}>
                      {artist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Store</label>
              <Select value={storeFilter} onValueChange={(value) => handleFilterChange('store', value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                  <SelectValue placeholder="All Stores" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                  <SelectItem value="all">All Stores</SelectItem>
                  {topStores.map(store => (
                    <SelectItem key={store._id} value={store._id}>
                      {store._id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Country</label>
              <Select value={countryFilter} onValueChange={(value) => handleFilterChange('country', value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                  <SelectItem value="all">All Countries</SelectItem>
                  {topCountries.map(country => (
                    <SelectItem key={country._id} value={country._id}>
                      {country._id || 'Unknown'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Current artist display */}
        {currentArtist && (
          <div className="bg-purple-900/30 border border-purple-800 rounded-md px-4 py-3 mb-4 flex items-center">
            {currentArtist.image && (
              <img 
                src={currentArtist.image} 
                alt={currentArtist.name} 
                className="w-10 h-10 rounded-full mr-3 object-cover border border-purple-700"
              />
            )}
            <div>
              <p className="text-purple-200 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Showing revenue for <span className="font-semibold ml-1">{currentArtist.name}</span>
              </p>
              {currentArtist.slug && (
                <Link href={`/artists/${currentArtist.slug}`} className="text-xs text-purple-400 hover:text-purple-300">
                  View artist profile
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
      
      {/* Loading, error, or no data states */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          <span className="ml-3 text-lg text-purple-200">Loading revenue data...</span>
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mb-6 bg-red-900 border-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      ) : revenueData.length === 0 ? (
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl text-gray-400 mb-2">No revenue data available</h3>
          <p className="text-gray-500">
            {currentArtist 
              ? `No revenue data found for ${currentArtist.name}.` 
              : 'Upload your first LANDR royalty report to see revenue analytics.'}
          </p>
         
        </div>
      ) : (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-gray-900 border-gray-700 flex w-full overflow-x-auto md:overflow-visible">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-900 data-[state=active]:text-white min-w-0">
                <span className="hidden md:inline">Overview</span>
                <BarChart2 className="md:hidden h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-purple-900 data-[state=active]:text-white min-w-0 whitespace-nowrap">
                <span className="hidden md:inline">Revenue Details</span>
                <span className="md:hidden">Details</span>
              </TabsTrigger>
              <TabsTrigger value="stores" className="data-[state=active]:bg-purple-900 data-[state=active]:text-white min-w-0">
                <span className="hidden md:inline">By Store</span>
                <Store className="md:hidden h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="countries" className="data-[state=active]:bg-purple-900 data-[state=active]:text-white min-w-0">
                <span className="hidden md:inline">By Country</span>
                <MapPin className="md:hidden h-4 w-4" />
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              {/* Overview tab content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-gray-200">Net Earnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <DollarSign className="w-6 h-6 mr-3 text-purple-400" />
                      <span className="text-3xl font-bold text-purple-400">
                        {formatCurrency(summary.totalNetEarnings)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-gray-200">Total Sales/Streams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Music className="w-6 h-6 mr-3 text-purple-400" />
                      <span className="text-3xl font-bold text-purple-400">
                        {formatNumber(summary.totalQuantity)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-gray-200">Latest Payment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <TrendingUp className="w-6 h-6 mr-3 text-purple-400" />
                      <span className="text-xl font-medium text-gray-300">
                        {recentPayments.length > 0 ? recentPayments[0] : 'No payments'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Store distribution chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-gray-200">Revenue by Store</CardTitle>
                    <CardDescription className="text-gray-400">
                      Revenue distribution across platforms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 sm:h-72 md:h-80">
                      {storeChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={storeChartData.map(store => ({
                                ...store,
                                totalValue: summary.totalNetEarnings
                              }))}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={radius}
                              label={false}
                              labelLine={false}
                              onClick={(data) => handleFilterChange('store', data.name)}
                              className="cursor-pointer"
                            >
                              {storeChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomPieTooltip />} />
                            <Legend 
                              onClick={(data) => handleFilterChange('store', data.value)} 
                              cursor="pointer"
                              layout={window.innerWidth < 768 ? 'horizontal' : 'vertical'}
                              align={window.innerWidth < 768 ? 'center' : 'right'}
                              verticalAlign={window.innerWidth < 768 ? 'bottom' : 'middle'}
                              wrapperStyle={window.innerWidth < 768 ? { paddingTop: '20px' } : {}}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No store data available
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Country distribution chart */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-gray-200">Revenue by Country</CardTitle>
                    <CardDescription className="text-gray-400">
                      Geographic distribution of revenue
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 sm:h-72 md:h-80">
                      {countryChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={countryChartData.map(country => ({
                                ...country,
                                totalValue: summary.totalNetEarnings
                              }))}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={radius}
                              label={false}
                              labelLine={false}
                              onClick={(data) => handleFilterChange('country', data.name)}
                              className="cursor-pointer"
                            >
                              {countryChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomPieTooltip />} />
                            <Legend 
                              onClick={(data) => handleFilterChange('country', data.value)}
                              cursor="pointer"
                              layout={window.innerWidth < 768 ? 'horizontal' : 'vertical'}
                              align={window.innerWidth < 768 ? 'center' : 'right'}
                              verticalAlign={window.innerWidth < 768 ? 'bottom' : 'middle'}
                              wrapperStyle={window.innerWidth < 768 ? { paddingTop: '20px' } : {}}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No country data available
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Top earning tracks list */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-200">Top Earning Tracks</CardTitle>
                  <CardDescription className="text-gray-400">
                    Tracks with the highest net earnings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="px-4 py-3">Track</th>
                          <th className="px-4 py-3">Artist</th>
                          <th className="px-4 py-3 text-right">Net Earnings</th>
                          <th className="px-4 py-3 text-right">Streams/Sales</th>
                          <th className="px-4 py-3 text-right">Report Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedTracks.slice(0, 10).map((track, index) => (
                          <tr key={index} className={index % 2 === 1 ? 'bg-gray-800/30' : ''}>
                            <td className="px-4 py-3">
                              <div 
                                className="flex items-center cursor-pointer hover:bg-gray-800 p-1 rounded-md transition-colors"
                                onClick={() => handleTrackClick(track)}
                              >
                                {track.release?.coverImage && (
                                  <img 
                                    src={track.release.coverImage} 
                                    alt={track.track} 
                                    className="w-10 h-10 rounded mr-3 object-cover"
                                  />
                                )}
                                <div>
                                  <span className="text-purple-400 font-medium">
                                    {track.track}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {track.artists.length > 0 ? (
                                  track.artists.map((artist, i) => (
                                    <span 
                                      key={artist._id}
                                      className="text-gray-300 hover:text-purple-300 cursor-pointer"
                                      onClick={() => handleArtistClick(artist)}
                                    >
                                      {artist.name}
                                      {i < track.artists.length - 1 && ", "}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-gray-400">{track.primaryArtist || 'Unknown Artist'}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="font-medium text-purple-400">{formatCurrency(track.totalNetEarnings)}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="font-medium">{track.totalQuantity}</span>
                            </td>
                            <td className="px-4 py-3 text-right text-gray-400">
                              {track.latestReportDate.toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4">
              {/* Revenue details table */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-200">Revenue Details</CardTitle>
                  <CardDescription className="text-gray-400">
                    Complete revenue data across all platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="px-4 py-3">Track</th>
                          <th className="px-4 py-3">Artist</th>
                          <th className="px-4 py-3">Store</th>
                          <th className="px-4 py-3">Country</th>
                          <th className="px-4 py-3 text-right">Sales/Streams</th>
                          <th className="px-4 py-3 text-right">Net Earnings</th>
                          <th className="px-4 py-3 text-right">Report Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revenueData.map((item, index) => (
                          <tr key={index} className={index % 2 === 1 ? 'bg-gray-800/30' : ''}>
                            <td className="px-4 py-3">
                              <div 
                                className="flex items-center cursor-pointer hover:bg-gray-800 p-1 rounded-md transition-colors"
                                onClick={() => handleTrackClick(item)}
                              >
                                {item.release?.coverImage && (
                                  <img 
                                    src={item.release.coverImage} 
                                    alt={item.track || item.release?.title} 
                                    className="w-8 h-8 rounded mr-2 object-cover"
                                  />
                                )}
                                <div>
                                  <span className="text-purple-400 font-medium">
                                    {item.track || item.release?.title || 'Unknown Track'}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {item.release?.artists?.length > 0 ? (
                                item.release.artists.map((artist, i) => (
                                  <span 
                                    key={artist._id || i} 
                                    className="text-gray-300 hover:text-purple-300 cursor-pointer"
                                    onClick={() => handleArtistClick(artist)}
                                  >
                                    {artist.name}
                                    {i < item.release.artists.length - 1 && ", "}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-400">{item.primaryArtist || 'Unknown Artist'}</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <Store className="w-3 h-3 mr-1 text-gray-500" />
                                <span>{item.store}</span>
                                {item.storeService && (
                                  <Badge variant="outline" className="ml-1 text-xs">
                                    {item.storeService}
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <Globe className="w-3 h-3 mr-1 text-gray-500" />
                                <span>{item.country || 'Unknown'}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="font-medium">{item.quantity}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="font-medium text-purple-400">{formatCurrency(item.netEarnings)}</span>
                              {item.grossEarnings !== item.netEarnings && (
                                <div className="text-xs text-gray-500">
                                  Gross: {formatCurrency(item.grossEarnings)}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-400">
                              {new Date(item.reportingPeriodStart || item.paymentDate).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stores" className="space-y-4">
              {/* Revenue by store analysis */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-200">Revenue by Store</CardTitle>
                  <CardDescription className="text-gray-400">
                    Earnings breakdown by streaming platform and store
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topStores.map(store => ({
                        name: store._id,
                        revenue: store.netEarnings,
                        streams: store.quantity
                      }))} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#aaa" 
                          angle={-45} 
                          textAnchor="end" 
                          tick={{ fontSize: 12 }}
                          height={70}
                        />
                        <YAxis stroke="#aaa" tickFormatter={(value) => formatCurrency(value)} />
                        <Tooltip 
                          formatter={(value, name) => [
                            name === 'revenue' ? formatCurrency(value) : formatNumber(value),
                            name === 'revenue' ? 'Revenue' : 'Streams/Sales'
                          ]}
                          contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                          labelStyle={{ color: '#ddd' }}
                          itemStyle={{ color: '#b58de5' }}
                        />
                        <Bar dataKey="revenue" fill="#9c67e0" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="px-4 py-3">Store</th>
                          <th className="px-4 py-3 text-right">Net Earnings</th>
                          <th className="px-4 py-3 text-right">Sales/Streams</th>
                          <th className="px-4 py-3 text-right">Avg. Per Stream</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topStores.map((store, index) => (
                          <tr key={store._id} className={index % 2 === 1 ? 'bg-gray-800/30' : ''}>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <Store className="w-4 h-4 mr-2 text-gray-500" />
                                <span className="font-medium">{store._id}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-purple-400 font-medium">
                              {formatCurrency(store.netEarnings)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {formatNumber(store.quantity)}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-300">
                              {store.quantity > 0 
                                ? formatCurrency(store.netEarnings / store.quantity)
                                : '$0.00'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="countries" className="space-y-4">
              {/* Revenue by country analysis */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-200">Revenue by Country</CardTitle>
                  <CardDescription className="text-gray-400">
                    Geographic distribution of your earnings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topCountries.map(country => ({
                        name: country._id || 'Unknown',
                        revenue: country.netEarnings,
                        streams: country.quantity
                      }))} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#aaa" 
                          angle={-45} 
                          textAnchor="end" 
                          tick={{ fontSize: 12 }}
                          height={70}
                        />
                        <YAxis stroke="#aaa" tickFormatter={(value) => formatCurrency(value)} />
                        <Tooltip 
                          formatter={(value, name) => [
                            name === 'revenue' ? formatCurrency(value) : formatNumber(value),
                            name === 'revenue' ? 'Revenue' : 'Streams/Sales'
                          ]}
                          contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                          labelStyle={{ color: '#ddd' }}
                          itemStyle={{ color: '#b58de5' }}
                        />
                        <Bar dataKey="revenue" fill="#ec4899" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="px-4 py-3">Country</th>
                          <th className="px-4 py-3 text-right">Net Earnings</th>
                          <th className="px-4 py-3 text-right">Sales/Streams</th>
                          <th className="px-4 py-3 text-right">Avg. Per Stream</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topCountries.map((country, index) => (
                          <tr key={country._id || index} className={index % 2 === 1 ? 'bg-gray-800/30' : ''}>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <Globe className="w-4 h-4 mr-2 text-gray-500" />
                                <span className="font-medium">{country._id || 'Unknown'}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-purple-400 font-medium">
                              {formatCurrency(country.netEarnings)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {formatNumber(country.quantity)}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-300">
                              {country.quantity > 0 
                                ? formatCurrency(country.netEarnings / country.quantity)
                                : '$0.00'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
} 