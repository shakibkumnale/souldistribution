'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line } from 'recharts';
import { Play, Music, Download, TrendingUp, AlertCircle, Loader2, Filter, RefreshCw } from 'lucide-react';
import Link from 'next/link';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyticsData, setAnalyticsData] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [artistFilter, setArtistFilter] = useState('all');
  const [artists, setArtists] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentArtist, setCurrentArtist] = useState(null);

  const fetchAnalytics = async (artistId = '') => {
    try {
      setIsFiltering(!!artistId);
      setLoading(true);
      setError('');
      
      // Build URL with potential artist filter
      const url = artistId 
        ? `/api/analytics?artist=${artistId}` 
        : '/api/analytics';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const data = await response.json();
      setAnalyticsData(data.analytics || []);
      setRecentReports(data.recentReports || []);
      setCurrentArtist(data.currentArtist || null);
      
      // Only set artists list if we're not filtering
      if (data.artists) {
        setArtists(data.artists);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Handle query string for artist filtering
  useEffect(() => {
    // Check if we have a query string with artist ID
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const artistId = params.get('artist');
      
      if (artistId) {
        setArtistFilter(artistId);
        fetchAnalytics(artistId);
      } else {
        setArtistFilter('all');
      }
    }
  }, []);

  const handleArtistChange = (value) => {
    setArtistFilter(value);
    fetchAnalytics(value === 'all' ? '' : value);
    
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
    setArtistFilter('all');
    fetchAnalytics('');
    
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
      <header className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-purple-400">Streaming Analytics</h1>
            <p className="text-gray-400">Track your music's performance across streaming platforms</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-64">
              <Select value={artistFilter} onValueChange={handleArtistChange}>
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
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
                className="bg-gray-900 border-gray-700 hover:bg-gray-800"
                onClick={clearFilter}
                disabled={isFiltering}
              >
                {isFiltering ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
        
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
                Showing data for <span className="font-semibold ml-1">{currentArtist.name}</span>
                <Badge className="ml-3 bg-purple-800">{analyticsData.length} releases</Badge>
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
          <TabsList className="bg-gray-900 border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-900 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="releases" className="data-[state=active]:bg-purple-900 data-[state=active]:text-white">
              Releases
            </TabsTrigger>
            {currentArtist && (
              <TabsTrigger value="artist" className="data-[state=active]:bg-purple-900 data-[state=active]:text-white">
                Artist Details
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Overview tab content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
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
                <CardHeader>
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
                <CardHeader>
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
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topReleasesChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#aaa" 
                        angle={-45} 
                        textAnchor="end" 
                        tick={{ fontSize: 12 }}
                        height={70}
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
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="px-4 py-3">Release</th>
                        <th className="px-4 py-3">Artist</th>
                        <th className="px-4 py-3 text-right">Streams</th>
                        <th className="px-4 py-3 text-right">Downloads</th>
                        <th className="px-4 py-3 text-right">Latest Report</th>
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
                                  className="w-10 h-10 rounded mr-3 object-cover"
                                />
                              )}
                              <div>
                                <Link 
                                  href={`/releases/${item.slug}`} 
                                  className="text-purple-400 hover:text-purple-300 font-medium"
                                >
                                  {item.title}
                                </Link>
                                {item.landrTrackId && (
                                  <div className="text-xs text-gray-500">ID: {item.landrTrackId}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {item.artists.map((artist, i) => (
                                <span key={artist._id}>
                                  <Link 
                                    href={`/artists/${artist.slug}`}
                                    className="text-gray-300 hover:text-purple-300"
                                  >
                                    {artist.name}
                                  </Link>
                                  {i < item.artists.length - 1 && ", "}
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {currentArtist && (
            <TabsContent value="artist" className="space-y-4">
              {/* Artist-specific content */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center space-x-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-300 mb-4">Performance Overview</h3>
                      <div className="grid grid-cols-2 gap-4">
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
                                className="w-12 h-12 rounded mr-3 object-cover"
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
                            <div className="text-right">
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