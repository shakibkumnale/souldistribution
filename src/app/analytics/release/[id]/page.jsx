'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import { Play, Music, ArrowLeft, AlertCircle, Loader2, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Helper function to format large numbers
function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Format date for charts
function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

// Random colors for pie chart
const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6'];

export default function ReleaseAnalyticsPage({ params }) {
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [release, setRelease] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchReleaseAnalytics = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`/api/analytics/release/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch release analytics');
        }
        
        const data = await response.json();
        setRelease(data.release);
        setAnalytics(data.analytics);
      } catch (err) {
        console.error('Error fetching release analytics:', err);
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchReleaseAnalytics();
    }
  }, [id]);

  // Prepare chart data
  const streamHistoryData = analytics?.streamHistory?.map(item => ({
    date: formatDate(item.date),
    streams: item.streams,
    downloads: item.downloads,
    fullDate: new Date(item.date).toLocaleDateString(),
  })) || [];

  // Get overall growth percentage
  const calculateGrowth = () => {
    if (!analytics?.streamHistory || analytics.streamHistory.length < 2) return 0;
    
    const firstDay = analytics.streamHistory[0]?.streams || 0;
    const lastDay = analytics.streamHistory[analytics.streamHistory.length - 1]?.streams || 0;
    
    if (firstDay === 0) return 100;
    return Math.round(((lastDay - firstDay) / firstDay) * 100);
  };

  const growthPercentage = calculateGrowth();

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-6 bg-gray-950 text-gray-100 min-h-screen">
      <header className="mb-8">
        <div className="flex items-center mb-4">
          <Button asChild variant="outline" className="mr-4 bg-gray-900 border-gray-700 hover:bg-gray-800">
            <Link href="/analytics">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Analytics
            </Link>
          </Button>
        </div>
        
        {loading ? (
          <div className="h-8 w-64 bg-gray-800 animate-pulse rounded"></div>
        ) : (
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-purple-400">
            {release?.title || 'Release Analytics'}
          </h1>
        )}
        
        {release && (
          <div className="flex items-center text-gray-400">
            <Music className="h-4 w-4 mr-1" />
            <span className="mr-2">
              {release.artists.map((a, index) => (
                <span key={a._id}>
                  <Link 
                    href={`/analytics?artist=${a._id}`} 
                    className="hover:text-purple-400 underline-offset-2 hover:underline"
                  >
                    {a.name}
                  </Link>
                  {index < release.artists.length - 1 && ', '}
                </span>
              ))}
            </span>
            <Badge variant="outline" className="bg-gray-800 text-purple-300 border-purple-800">
              {release.type}
            </Badge>
          </div>
        )}
      </header>
      
      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-900 border-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <span className="ml-2 text-lg">Loading release analytics...</span>
        </div>
      ) : (
        <>
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-300 text-lg">Total Streams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Play className="h-8 w-8 text-purple-400 mr-3" />
                  <div>
                    <div className="text-3xl font-bold text-white">{formatNumber(analytics?.totalStreams)}</div>
                    <p className="text-gray-400 text-sm">Lifetime plays</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-300 text-lg">Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Music className="h-8 w-8 text-purple-400 mr-3" />
                  <div>
                    <div className="text-3xl font-bold text-white">{formatNumber(analytics?.totalDownloads)}</div>
                    <p className="text-gray-400 text-sm">Total downloads</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-300 text-lg">Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TrendingUp className={`h-8 w-8 mr-3 ${growthPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                  <div>
                    <div className="text-3xl font-bold text-white">
                      {growthPercentage >= 0 ? '+' : ''}{growthPercentage}%
                    </div>
                    <p className="text-gray-400 text-sm">Overall trend</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Stream History</CardTitle>
                <CardDescription className="text-gray-400">
                  Stream count over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {streamHistoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={streamHistoryData} margin={{ left: 0, right: 20 }}>
                        <defs>
                          <linearGradient id="colorStreams" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="date" tick={{ fill: '#ccc' }} />
                        <YAxis tick={{ fill: '#ccc' }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#333', border: 'none' }}
                          itemStyle={{ color: '#fff' }}
                          labelStyle={{ color: '#fff' }}
                          formatter={(value, name) => [formatNumber(value), name === 'streams' ? 'Streams' : 'Downloads']}
                          labelFormatter={(label, data) => data[0]?.payload?.fullDate || label}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="streams" 
                          stroke="#8b5cf6" 
                          fillOpacity={1}
                          fill="url(#colorStreams)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p>No historical stream data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Stream vs Download Distribution</CardTitle>
                <CardDescription className="text-gray-400">
                  Comparison between streams and downloads
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {(analytics?.totalStreams > 0 || analytics?.totalDownloads > 0) ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Streams', value: analytics?.totalStreams || 0 },
                            { name: 'Downloads', value: analytics?.totalDownloads || 0 }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {[0, 1].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#333', border: 'none' }}
                          itemStyle={{ color: '#fff' }}
                          formatter={(value) => formatNumber(value)}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p>No distribution data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Latest Data Details */}
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Latest Report Data</CardTitle>
              <CardDescription className="text-gray-400">
                {analytics?.latestData ? `From ${new Date(analytics.latestData.date).toLocaleDateString()}` : 'No data available'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.latestData ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">Streaming Stats</h3>
                      <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Current Streams:</span>
                          <span className="text-white font-medium">{formatNumber(analytics.latestData.streams.count)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Percentage:</span>
                          <span className="text-white font-medium">{analytics.latestData.streams.percentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Recent Change:</span>
                          <span className={`font-medium ${analytics.latestData.streams.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {analytics.latestData.streams.change >= 0 ? '+' : ''}{formatNumber(analytics.latestData.streams.change)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Change Percentage:</span>
                          <span className={`font-medium ${analytics.latestData.streams.changePercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {analytics.latestData.streams.changePercentage >= 0 ? '+' : ''}{analytics.latestData.streams.changePercentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">Download Stats</h3>
                      <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Current Downloads:</span>
                          <span className="text-white font-medium">{formatNumber(analytics.latestData.downloads.count)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Percentage:</span>
                          <span className="text-white font-medium">{analytics.latestData.downloads.percentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Recent Change:</span>
                          <span className={`font-medium ${analytics.latestData.downloads.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {analytics.latestData.downloads.change >= 0 ? '+' : ''}{formatNumber(analytics.latestData.downloads.change)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Change Percentage:</span>
                          <span className={`font-medium ${analytics.latestData.downloads.changePercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {analytics.latestData.downloads.changePercentage >= 0 ? '+' : ''}{analytics.latestData.downloads.changePercentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Music className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                  <p>No report data available for this release</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
} 