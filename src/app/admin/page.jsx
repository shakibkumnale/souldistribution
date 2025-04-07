// src/app/admin/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { Users, Music2, PlayCircle, TrendingUp, User, UserPlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import DashboardStats from '@/components/admin/DashboardStats';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalArtists: 0,
    totalReleases: 0,
    totalStreams: 0,
    growthRate: 0,
    popularArtists: [],
    planCounts: {
      basic: 0,
      pro: 0,
      premium: 0,
      aoc: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
        Error loading dashboard: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-400">Dashboard</h1>
      
      <DashboardStats stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-bold text-purple-700 dark:text-purple-400 flex items-center">
              <UserPlus className="mr-2 h-5 w-5" />
              Popular Artists
            </h2>
          </div>
          
          <div className="max-h-[350px] sm:max-h-[450px] overflow-y-auto p-3 sm:p-4 custom-scrollbar">
            {stats.popularArtists && stats.popularArtists.length > 0 ? (
              stats.popularArtists.map((artist, index) => (
                <div 
                  key={artist._id ? artist._id.toString() : `artist-${artist.name}`}
                  className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 p-3 sm:p-4 mb-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-all hover:shadow-md"
                >
                  <div className="font-bold text-xl text-white bg-purple-600 dark:bg-purple-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-purple-300 dark:border-purple-600">
                    {artist.image ? (
                      <Image
                        src={artist.image} 
                        alt={artist.name}
                        width={56}
                        height={56}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <User className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{artist.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Users className="w-3.5 h-3.5 mr-1" />
                      <span>{artist.followers?.toLocaleString() || 0} followers</span>
                    </div>
                  </div>
                  <Link
                    href={`/admin/artists/${artist.slug}`}
                    className="px-3 py-2 sm:px-4 sm:py-2 mt-2 sm:mt-0 w-full sm:w-auto text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-colors flex-shrink-0"
                  >
                    View Details
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                No popular artists found
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-purple-700 dark:text-purple-400 mb-4 sm:mb-6">Plans Distribution</h2>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-blue-500 mr-2 sm:mr-3"></div>
                <span className="text-gray-700 dark:text-gray-200">Basic</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">{stats.planCounts?.basic || 0}</span>
            </div>
            
            <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-green-500 mr-2 sm:mr-3"></div>
                <span className="text-gray-700 dark:text-gray-200">Pro</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white px-2 sm:px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">{stats.planCounts?.pro || 0}</span>
            </div>
            
            <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-purple-500 mr-2 sm:mr-3"></div>
                <span className="text-gray-700 dark:text-gray-200">Premium</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white px-2 sm:px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">{stats.planCounts?.premium || 0}</span>
            </div>
            
            <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-orange-500 mr-2 sm:mr-3"></div>
                <span className="text-gray-700 dark:text-gray-200">Aoc</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white px-2 sm:px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">{stats.planCounts?.aoc || 0}</span>
            </div>
            
            <div className="p-3 sm:p-4 mt-2 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-200">Total Active Plans:</span>
                <span className="font-bold text-purple-700 dark:text-purple-300">
                  {(stats.planCounts?.basic || 0) + 
                   (stats.planCounts?.pro || 0) + 
                   (stats.planCounts?.premium || 0) + 
                   (stats.planCounts?.aoc || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}