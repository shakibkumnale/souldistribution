'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  Legend, PieChart, Pie, Cell 
} from 'recharts';
import { 
  DollarSign, Music, TrendingUp, AlertCircle, Loader2, 
  ArrowLeft, Store, Globe, Share2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

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
  const [radius, setRadius] = useState(120);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setRadius(70); // Small screens
      } else if (window.innerWidth < 1024) {
        setRadius(90); // Medium screens
      } else {
        setRadius(120); // Large screens
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

export default function TrackRevenuePage() {
  const router = useRouter();
  const params = useParams();
  const trackId = params.track;
  const pieRadius = useResponsiveRadius();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trackData, setTrackData] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  
  useEffect(() => {
    if (!trackId) {
      setError('Track ID is required');
      setLoading(false);
      return;
    }
    
    const fetchTrackRevenueData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch track data
        const trackResponse = await fetch(`/api/tracks/${trackId}`);
        if (!trackResponse.ok) {
          throw new Error('Failed to fetch track data');
        }
        const track = await trackResponse.json();
        
        // Fetch revenue data for this track
        const revenueResponse = await fetch(`/api/analytics/revenue?track=${trackId}`);
        if (!revenueResponse.ok) {
          throw new Error('Failed to fetch revenue data');
        }
        const data = await revenueResponse.json();
        
        // Process and group revenue data
        const { groupedTrack, revenueEntries } = processRevenueData(track, data.revenue || []);
        
        setTrackData(groupedTrack);
        setRevenueData(revenueEntries);
      } catch (err) {
        console.error('Error fetching track revenue data:', err);
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrackRevenueData();
  }, [trackId]);
  
  // Process and group revenue data
  const processRevenueData = (track, revenueEntries) => {
    // Create a grouped track object
    const groupedTrack = {
      _id: track._id,
      isrc: track.isrc,
      title: track.title,
      slug: track.slug,
      coverImage: track.coverImage,
      artists: track.artists || [],
      totalNetEarnings: 0,
      totalGrossEarnings: 0,
      totalQuantity: 0,
      stores: new Map(),
      countries: new Map(),
      latestPaymentDate: new Date(0)
    };
    
    // Process all revenue entries
    revenueEntries.forEach(item => {
      // Add to totals
      groupedTrack.totalNetEarnings += item.netEarnings;
      groupedTrack.totalGrossEarnings += item.grossEarnings;
      groupedTrack.totalQuantity += item.quantity;
      
      // Track by store
      if (!groupedTrack.stores.has(item.store)) {
        groupedTrack.stores.set(item.store, {
          name: item.store,
          service: item.storeService,
          totalNetEarnings: 0,
          totalGrossEarnings: 0,
          totalQuantity: 0,
          countries: new Map()
        });
      }
      
      const storeData = groupedTrack.stores.get(item.store);
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
      if (!groupedTrack.countries.has(countryKey)) {
        groupedTrack.countries.set(countryKey, {
          name: countryKey,
          totalNetEarnings: 0,
          totalGrossEarnings: 0,
          totalQuantity: 0
        });
      }
      
      const trackCountryData = groupedTrack.countries.get(countryKey);
      trackCountryData.totalNetEarnings += item.netEarnings;
      trackCountryData.totalGrossEarnings += item.grossEarnings;
      trackCountryData.totalQuantity += item.quantity;
      
      // Update latest payment date
      const paymentDate = new Date(item.paymentDate);
      if (paymentDate > groupedTrack.latestPaymentDate) {
        groupedTrack.latestPaymentDate = paymentDate;
      }
    });
    
    return { groupedTrack, revenueEntries };
  };
  
  // Handle sharing the page
  const shareTrackRevenue = () => {
    if (navigator.share) {
      navigator.share({
        title: `Revenue data for ${trackData.title}`,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(console.error);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl p-4 md:p-6 bg-gray-950 text-gray-100 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          <span className="ml-3 text-lg text-purple-200">Loading track revenue data...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto max-w-7xl p-4 md:p-6 bg-gray-950 text-gray-100 min-h-screen">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="text-gray-400 hover:text-white" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Revenue Analytics
          </Button>
        </div>
        
        <Alert variant="destructive" className="mb-6 bg-red-900 border-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!trackData) {
    return (
      <div className="container mx-auto max-w-7xl p-4 md:p-6 bg-gray-950 text-gray-100 min-h-screen">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="text-gray-400 hover:text-white" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Revenue Analytics
          </Button>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl text-gray-400 mb-2">Track not found</h3>
          <p className="text-gray-500">
            The track you are looking for does not exist or has no revenue data.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-6 bg-gray-950 text-gray-100 min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <Button 
          variant="ghost" 
          className="text-gray-400 hover:text-white w-fit" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Revenue Analytics
        </Button>
        
        <Button 
          variant="outline" 
          className="w-fit bg-gray-900 border-gray-700" 
          onClick={shareTrackRevenue}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
      
      <div className="bg-gray-900/50 rounded-lg p-4 md:p-6 mb-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        {trackData.coverImage && (
          <img 
            src={trackData.coverImage} 
            alt={trackData.title} 
            className="w-24 h-24 rounded object-cover border border-gray-800"
          />
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{trackData.title}</h1>
          
          <div className="flex flex-wrap gap-1 mt-1 text-gray-300">
            {trackData.artists.map((artist, i) => (
              <span key={artist._id}>
                <Link 
                  href={`/artists/${artist.slug}`}
                  className="hover:text-purple-400 transition-colors"
                >
                  {artist.name}
                </Link>
                {i < trackData.artists.length - 1 && ", "}
              </span>
            ))}
          </div>
          
          <div className="text-sm text-gray-400 mt-2">
            {trackData.isrc && (
              <div>ISRC: {trackData.isrc}</div>
            )}
            <div>Last Updated: {trackData.latestPaymentDate.toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-200">Net Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="w-6 h-6 mr-3 text-purple-400" />
              <span className="text-3xl font-bold text-purple-400">
                {formatCurrency(trackData.totalNetEarnings)}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-200">Total Streams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Music className="w-6 h-6 mr-3 text-purple-400" />
              <span className="text-3xl font-bold text-purple-400">
                {trackData.totalQuantity}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-200">Avg. Per Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-purple-400" />
              <span className="text-3xl font-bold text-purple-400">
                {trackData.totalQuantity > 0 
                  ? formatCurrency(trackData.totalNetEarnings / trackData.totalQuantity) 
                  : '$0.00'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue by Store */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-200">Revenue by Store</CardTitle>
            <CardDescription className="text-gray-400">
              Breakdown of earnings across platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 sm:h-72 md:h-80">
              {Array.from(trackData.stores || []).length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Array.from(trackData.stores || []).map(([_, store], index) => ({
                        name: store.name,
                        value: store.totalNetEarnings,
                        totalValue: trackData.totalNetEarnings,
                        color: CHART_COLORS[index % CHART_COLORS.length]
                      }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={pieRadius}
                      label={false}
                      labelLine={false}
                    >
                      {Array.from(trackData.stores || []).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend 
                      layout={window.innerWidth < 768 ? 'horizontal' : 'vertical'}
                      align={window.innerWidth < 768 ? 'center' : 'right'} 
                      verticalAlign={window.innerWidth < 768 ? 'bottom' : 'middle'}
                      wrapperStyle={window.innerWidth < 768 ? { paddingTop: '20px' } : { paddingLeft: 20 }}
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
        
        {/* Revenue by Country */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-200">Revenue by Country</CardTitle>
            <CardDescription className="text-gray-400">
              Geographic distribution of revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 sm:h-72 md:h-80">
              {Array.from(trackData.countries || []).length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Array.from(trackData.countries || []).map(([_, country], index) => ({
                        name: country.name,
                        value: country.totalNetEarnings,
                        totalValue: trackData.totalNetEarnings,
                        color: CHART_COLORS[index % CHART_COLORS.length]
                      }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={pieRadius}
                      label={false}
                      labelLine={false}
                    >
                      {Array.from(trackData.countries || []).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend 
                      layout={window.innerWidth < 768 ? 'horizontal' : 'vertical'}
                      align={window.innerWidth < 768 ? 'center' : 'right'} 
                      verticalAlign={window.innerWidth < 768 ? 'bottom' : 'middle'}
                      wrapperStyle={window.innerWidth < 768 ? { paddingTop: '20px' } : { paddingLeft: 20 }}
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
      
      <h2 className="text-xl font-bold text-white mb-4">Detailed Revenue Breakdown</h2>
      
      <div className="space-y-4">
        {/* Store sections */}
        {Array.from(trackData.stores || []).map(([storeKey, store], storeIndex) => (
          <div key={storeKey} className="border border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gray-800 p-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center">
                <Store className="w-5 h-5 mr-2 text-gray-400" />
                <h5 className="font-medium text-gray-200">{store.name}</h5>
                {store.service && (
                  <Badge variant="outline" className="ml-2">
                    {store.service}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="text-xs text-gray-400">Streams</div>
                  <div className="font-medium">{store.totalQuantity}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Revenue</div>
                  <div className="font-medium text-purple-400">{formatCurrency(store.totalNetEarnings)}</div>
                </div>
              </div>
            </div>
            
            {/* Countries within store */}
            <div className="divide-y divide-gray-700">
              {Array.from(store.countries || []).map(([countryKey, country], countryIndex) => (
                <div key={countryKey} className="p-4 bg-gray-900">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-300">{country.name}</span>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Streams</div>
                        <div className="font-medium">{country.totalQuantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Revenue</div>
                        <div className="font-medium text-purple-400">{formatCurrency(country.totalNetEarnings)}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Individual entries */}
                  <div className="mt-3 pt-2 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {country.entries.map((entry, entryIndex) => (
                      <div key={entryIndex} className="bg-gray-800/30 rounded-md p-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Report Date:</span>
                          <span className="text-gray-300">{new Date(entry.reportingPeriodStart || entry.paymentDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Streams:</span>
                          <span className="text-gray-300">{entry.quantity}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Revenue:</span>
                          <span className="text-purple-400">{formatCurrency(entry.netEarnings)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 