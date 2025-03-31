// src/components/admin/DashboardStats.jsx
import { Users, Music2, PlayCircle, TrendingUp, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/lib/utils';

export default function DashboardStats({ stats }) {
  // Destructure with default values
  const { 
    totalArtists = 0, 
    totalReleases = 0, 
    totalStreams = 0, 
    growthRate = 0,
    planCounts = { basic: 0, pro: 0, premium: 0, aoc: 0 }
  } = stats;

  // Calculate total revenue (mock calculation based on plan counts)
  const totalRevenue = (
    planCounts.basic * 99 + 
    planCounts.pro * 599 + 
    planCounts.premium * 1199 + 
    planCounts.aoc * 499
  ).toFixed(2);

  const statCards = [
    {
      title: 'Total Artists',
      value: totalArtists,
      icon: Users,
      color: 'text-white',
      bgColor: 'bg-gradient-to-r from-purple-600 to-purple-800'
    },
    {
      title: 'Total Releases',
      value: totalReleases,
      icon: Music2,
      color: 'text-white',
      bgColor: 'bg-gradient-to-r from-pink-600 to-purple-700'
    },
    {
      title: 'Total Streams',
      value: formatNumber(totalStreams),
      icon: PlayCircle,
      color: 'text-white',
      bgColor: 'bg-gradient-to-r from-blue-600 to-blue-800'
    },
    {
      title: 'Yearly Revenue',
      value: `₹${totalRevenue}`,
      icon: CreditCard,
      color: 'text-white',
      bgColor: 'bg-gradient-to-r from-purple-500 to-pink-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
      {statCards.map((stat, index) => (
        <Card 
          key={index}
          className="overflow-hidden hover:shadow-lg transition-shadow border-0"
        >
          <div className={`${stat.bgColor} p-3 sm:p-4`}>
            <div className="flex justify-between items-center">
              <p className="text-xs sm:text-sm font-semibold text-white/90">{stat.title}</p>
              <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-2 truncate">{stat.value}</h3>
          </div>
          <div className="p-2 sm:p-3 bg-white dark:bg-gray-800 border-t border-white/10">
            <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
              <div className={`h-1 ${stat.bgColor.replace('bg-gradient-to-r ', '')} rounded-full`} style={{ width: '60%' }}></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}