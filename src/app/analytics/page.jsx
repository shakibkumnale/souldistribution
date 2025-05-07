'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line } from 'recharts';
import { Play, Music, Download, TrendingUp, AlertCircle, Loader2, Filter, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { fetchAnalytics, setArtistFilter } from '@/store/slices/analyticsSlice';

// CSS for hiding scrollbar but allowing scrolling
const scrollbarStyles = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// Helper function to format large numbers
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export default function AnalyticsPage() {
  const dispatch = useDispatch();
  const { 
    analyticsData, 
    recentReports, 
    currentArtist, 
    artists, 
    loading, 
    error, 
    isFiltering,
    lastFetched
  } = useSelector((state) => state.analytics);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [artistFilter, setArtistFilterState] = useState('all');

  // Fetch analytics data with caching
  useEffect(() => {
    // Set a time threshold for re-fetching (e.g., 5 minutes = 300000 ms)
    const CACHE_TIME = 5 * 60 * 1000;
    
    // Only fetch if we don't have data or if the cache is stale
    if (!lastFetched || Date.now() - lastFetched > CACHE_TIME) {
      dispatch(fetchAnalytics());
    }
  }, [dispatch, lastFetched]);

  // Handle query string for artist filtering
  useEffect(() => {
    // Check if we have a query string with artist ID
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const artistId = params.get('artist');
      
      if (artistId) {
        setArtistFilterState(artistId);
        dispatch(fetchAnalytics(artistId));
      } else {
        setArtistFilterState('all');
      }
    }
  }, [dispatch]);

  const handleArtistChange = (value) => {
    setArtistFilterState(value);
    dispatch(fetchAnalytics(value === 'all' ? '' : value));
    dispatch(setArtistFilter(value));
    
    // Update URL with query parameter
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (value && value !== 'all') {
        url.searchParams.set('artist', value);
      } else {
        url.searchParams.delete('artist');
      }
      window.history.pushState({}, '', url);
    }
  };

  const clearFilter = () => {
    setArtistFilterState('all');
    dispatch(fetchAnalytics(''));
    dispatch(setArtistFilter('all'));
    
    // Remove query parameter from URL
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('artist');
      window.history.pushState({}, '', url);
    }
  };

  // Calculate totals
  const totalStreams = analyticsData.reduce((total, item) => total + item.totalStreams, 0);
  const totalReleases = analyticsData.length;
  
  // Prepare chart data for top releases
  const topReleasesChartData = analyticsData
    .slice(0, 10)
    .map(item => ({
      name: item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title,
      streams: item.totalStreams
    }));

  // Generate a sample timeline data set from the most streamed release if available
  let timelineChartData = [];
  if (analyticsData.length > 0) {
    const topRelease = analyticsData[0];
    // This is a placeholder - we'd need real timeline data from the API
    timelineChartData = [
      { name: 'Jan', streams: Math.floor(topRelease.totalStreams * 0.1) },
      { name: 'Feb', streams: Math.floor(topRelease.totalStreams * 0.15) },
      { name: 'Mar', streams: Math.floor(topRelease.totalStreams * 0.18) },
      { name: 'Apr', streams: Math.floor(topRelease.totalStreams * 0.25) },
      { name: 'May', streams: Math.floor(topRelease.totalStreams * 0.32) }
    ];
  }

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-6 bg-gray-950 text-gray-100 min-h-screen">
      <style jsx global>{scrollbarStyles}</style>
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-purple-400">Streaming Analytics</h1>
            <p className="text-gray-400">Track your music's performance across streaming platforms</p>
          </div>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="w-full">
              <Select value={artistFilter} onValueChange={handleArtistChange}>
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white w-full">
                  <div className="flex items-center">
                    <Filter className="w-4 h-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Filter by artist" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectItem value="all">All Artists</SelectItem>
                  {artists.map(artist => (
                    <SelectItem key={artist._id} value={artist._id}>
                      {artist.name}
                      {artist.releaseCount && (
                        <span className="ml-2 text-gray-400 text-xs">
                          ({artist.releaseCount} {artist.releaseCount === 1 ? 'release' : 'releases'})
                          {artist.totalStreams && (
                            <span className="ml-1">{formatNumber(artist.totalStreams)} streams</span>
                          )}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {artistFilter && artistFilter !== 'all' && (
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-gray-900 border-gray-700 hover:bg-gray-800 flex-shrink-0"
                onClick={clearFilter}
                disabled={isFiltering}
              >
                {isFiltering ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
        
        {currentArtist && (
          <div className="bg-purple-900/30 border border-purple-800 rounded-md px-4 py-3 mb-4 flex flex-col sm:flex-row sm:items-center">
            {currentArtist.image && (
              <img 
                src={currentArtist.image} 
                alt={currentArtist.name} 
                className="w-10 h-10 rounded-full mr-3 object-cover border border-purple-700 mb-2 sm:mb-0"
              />
            )}
            <div>
              <p className="text-purple-200 flex flex-wrap items-center">
                <Filter className="w-4 h-4 mr-2" />
                Showing data for <span className="font-semibold ml-1">{currentArtist.name}</span>
                <Badge className="ml-3 bg-purple-800 mt-1 sm:mt-0">{analyticsData.length} releases</Badge>
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
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          <span className="ml-3 text-lg text-purple-200">Loading analytics data...</span>
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mb-6 bg-red-900 border-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      ) : analyticsData.length === 0 ? (
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <Music className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl text-gray-400 mb-2">No streaming data available</h3>
          <p className="text-gray-500">
            {currentArtist ? `No streaming data found for ${currentArtist.name}.` : 'Upload your first LANDR report to see streaming analytics.'}
          </p>
          <Button className="mt-4" variant="outline">
            <Link href="/analytics/upload">Upload Report</Link>
          </Button>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-gray-900 border-gray-700 flex w-full overflow-x-auto no-scrollbar">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-900 data-[state=active]:text-white flex-1 sm:flex-none whitespace-nowrap">
              Overview
            </TabsTrigger>
            <TabsTrigger value="releases" className="data-[state=active]:bg-purple-900 data-[state=active]:text-white flex-1 sm:flex-none whitespace-nowrap">
              Releases
            </TabsTrigger>
            {currentArtist && (
              <TabsTrigger value="artist" className="data-[state=active]:bg-purple-900 data-[state=active]:text-white flex-1 sm:flex-none whitespace-nowrap">
                Artist Details
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Overview tab content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-200">Total Streams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Play className="w-6 h-6 mr-3 text-purple-400" />
                    <span className="text-3xl font-bold text-purple-400">{formatNumber(totalStreams)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-200">Releases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Music className="w-6 h-6 mr-3 text-purple-400" />
                    <span className="text-3xl font-bold text-purple-400">{totalReleases}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-200">Latest Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <TrendingUp className="w-6 h-6 mr-3 text-purple-400" />
                    <span className="text-xl font-medium text-gray-300">
                      {recentReports.length > 0 ? recentReports[0] : 'No reports'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Top Releases Chart */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-200">Top Releases by Streams</CardTitle>
                <CardDescription className="text-gray-400">Total streams for your most popular releases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topReleasesChartData} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#aaa" 
                        angle={-45} 
                        textAnchor="end" 
                        tick={{ fontSize: 10 }}
                        height={50}
                      />
                      <YAxis stroke="#aaa" tickFormatter={formatNumber} />
                      <Tooltip 
                        formatter={(value) => [formatNumber(value), 'Streams']}
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                        labelStyle={{ color: '#ddd' }}
                        itemStyle={{ color: '#b58de5' }}
                      />
                      <Bar dataKey="streams" fill="#9c67e0" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="releases" className="space-y-4">
            {/* Releases table content */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-200">All Releases</CardTitle>
                <CardDescription className="text-gray-400">
                  {currentArtist 
                    ? `All releases for ${currentArtist.name} with streaming data`
                    : 'All releases with streaming data'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle sm:px-0 px-4">
                    <div className="max-h-[32rem] overflow-y-auto relative [scrollbar-width:thin] [scrollbar-color:#374151_#111827] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-900 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-600">
                      {/* Table view for tablet and desktop */}
                      <table className="min-w-full divide-y divide-gray-800 hidden sm:table">
                        <thead className="sticky top-0 bg-gray-900 z-10">
                          <tr className="border-b border-gray-800">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Release</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Artist</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Streams</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Downloads</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Latest Report</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyticsData.map((item, index) => (
                            <tr key={item.releaseId} className={index % 2 === 1 ? 'bg-gray-800/30' : ''}>
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  {item.coverImage && (
                                    <img 
                                      src={item.coverImage} 
                                      alt={item.title} 
                                      className="w-10 h-10 rounded mr-3 object-cover flex-shrink-0"
                                    />
                                  )}
                                  <div className="min-w-0">
                                    <Link 
                                      href={`/releases/${item.slug}`} 
                                      className="text-purple-400 hover:text-purple-300 font-medium block truncate"
                                    >
                                      {item.title}
                                    </Link>
                                    {item.landrTrackId && (
                                      <div className="text-xs text-gray-500 truncate">ID: {item.landrTrackId}</div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1">
                                  {item.artists.map((artist, i) => (
                                    <span key={artist._id} className="inline-flex">
                                      <Link 
                                        href={`/artists/${artist.slug}`}
                                        className="text-gray-300 hover:text-purple-300"
                                      >
                                        {artist.name}
                                      </Link>
                                      {i < item.artists.length - 1 && <span className="mx-0.5">,</span>}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="font-medium">{formatNumber(item.totalStreams)}</span>
                                {item.latestData?.streams?.percentage && (
                                  <div className="text-xs text-gray-400">
                                    {item.latestData.streams.percentage}% of total
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="font-medium">{formatNumber(item.totalDownloads)}</span>
                              </td>
                              <td className="px-4 py-3 text-right text-gray-400">
                                {item.latestDate ? new Date(item.latestDate).toLocaleDateString() : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      {/* Card view for mobile */}
                      <div className="sm:hidden space-y-3">
                        {analyticsData.map((item) => (
                          <div key={item.releaseId} className="bg-gray-800/30 rounded-lg p-3 border border-gray-800">
                            <div className="flex items-center mb-2">
                              {item.coverImage && (
                                <img 
                                  src={item.coverImage} 
                                  alt={item.title} 
                                  className="w-12 h-12 rounded mr-3 object-cover flex-shrink-0"
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <Link 
                                  href={`/releases/${item.slug}`} 
                                  className="text-purple-400 hover:text-purple-300 font-medium block truncate"
                                >
                                  {item.title}
                                </Link>
                                <div className="flex flex-wrap gap-1 text-sm text-gray-300">
                                  {item.artists.map((artist, i) => (
                                    <span key={artist._id} className="inline-flex">
                                      <Link 
                                        href={`/artists/${artist.slug}`}
                                        className="text-gray-300 hover:text-purple-300"
                                      >
                                        {artist.name}
                                      </Link>
                                      {i < item.artists.length - 1 && <span className="mx-0.5">,</span>}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                              <div>
                                <div className="text-gray-400">Streams</div>
                                <div className="font-medium text-white">{formatNumber(item.totalStreams)}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Downloads</div>
                                <div className="font-medium text-white">{formatNumber(item.totalDownloads)}</div>
                              </div>
                              <div className="col-span-2">
                                <div className="text-gray-400">Latest Report</div>
                                <div className="text-gray-300">
                                  {item.latestDate ? new Date(item.latestDate).toLocaleDateString() : '-'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {currentArtist && (
            <TabsContent value="artist" className="space-y-4">
              {/* Artist-specific content */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                  {currentArtist.image && (
                    <img 
                      src={currentArtist.image} 
                      alt={currentArtist.name} 
                      className="w-16 h-16 rounded-full object-cover border border-purple-700"
                    />
                  )}
                  <div>
                    <CardTitle className="text-gray-200 text-2xl">{currentArtist.name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      Streaming performance
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-300 mb-4">Performance Overview</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="text-gray-400 text-sm mb-1">Total Streams</div>
                          <div className="text-2xl font-bold text-purple-400">{formatNumber(totalStreams)}</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="text-gray-400 text-sm mb-1">Total Releases</div>
                          <div className="text-2xl font-bold text-purple-400">{totalReleases}</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="text-gray-400 text-sm mb-1">Avg. Streams per Release</div>
                          <div className="text-2xl font-bold text-purple-400">
                            {totalReleases > 0 ? formatNumber(Math.round(totalStreams / totalReleases)) : '0'}
                          </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="text-gray-400 text-sm mb-1">Latest Report</div>
                          <div className="text-xl font-medium text-purple-400">
                            {recentReports.length > 0 ? recentReports[0] : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-300 mb-4">Top Releases</h3>
                      <div className="space-y-3">
                        {analyticsData.slice(0, 5).map(item => (
                          <div key={item.releaseId} className="flex items-center bg-gray-800 rounded-lg p-3">
                            {item.coverImage && (
                              <img 
                                src={item.coverImage} 
                                alt={item.title} 
                                className="w-12 h-12 rounded mr-3 object-cover flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <Link 
                                href={`/releases/${item.slug}`}
                                className="text-purple-400 hover:text-purple-300 font-medium truncate block"
                              >
                                {item.title}
                              </Link>
                              <div className="text-xs text-gray-400">
                                {new Date(item.latestDate).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-lg font-medium text-gray-200">{formatNumber(item.totalStreams)}</div>
                              <div className="text-xs text-gray-400">streams</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
        </Tabs>
      )}
    </div>
  );
} 