// src/components/services/PlansComparison.jsx
import React, { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, Info } from 'lucide-react';

// Plan feature definitions
const PLAN_FEATURES = {
  'youtube-oac': [
    'YouTube Verification Badge',
    'YouTube Analytics',
    'Custom YouTube Profile',
    'Distribution to 150+ Stores',
    'Spotify Verification',
    'Content ID',
    'Playlist Pitching',
    'Instagram Audio Linking',
    '24/7 Support'
  ],
  all: [
    'Distribution to 150+ Stores',
    'Instagram Audio Linking'
  ]
};

// Helper components
const FeatureCheck = ({ active, accentColor }) => (
  <div className="flex justify-center">
    {active ? (
      <Check className={`h-5 w-5 ${accentColor}`} />
    ) : (
      <X className="h-5 w-5 text-gray-700" />
    )}
  </div>
);

const PlanHeader = ({ plan, accentColor, headerClass }) => (
  <div className="flex flex-col items-center">
    <span className="font-bold text-lg">{plan.name}</span>
    {plan.popular && <span className="text-orange-400 text-sm">★ Most Popular</span>}
    <span className="mt-2 font-bold text-xl">₹{plan.price}</span>
    <span className="text-sm text-gray-300">per {plan.period === 'One-time' ? 'purchase' : 'year'}</span>
  </div>
);

const PlansComparison = ({ plans }) => {
  // Define all possible features across all plans
  const allFeatures = [
    'Releases',
    'Distribution to 150+ Stores',
    'Custom Release Date',
    'Spotify Verification',
    'Content ID',
    'Playlist Pitching',
    'Instagram Audio Linking',
    '24/7 Support',
    'Lifetime Availability',
    'YouTube Verification Badge',
    'YouTube Analytics',
    'Custom YouTube Profile',
  ];

  // Helper function to determine if a plan has a feature
  const hasPlanFeature = (plan, feature) => {
    // YouTube OAC plan specific features
    if (plan.id === 'youtube-oac' && PLAN_FEATURES['youtube-oac'].includes(feature)) {
      return true;
    }

    // Features available to all plans except OAC
    if (plan.id !== 'youtube-oac' && PLAN_FEATURES.all.includes(feature)) {
      return true;
    }
    
    // General check against the features list
    return plan.features.some(f => f.toLowerCase().includes(feature.toLowerCase()));
  };

  // Get royalty percentage for a plan
  const getRoyaltyPercentage = (plan) => {
    const royaltyMap = {
      'basic': '0%',
      'pro': '50%',
      'premium': '100%',
      'youtube-oac': '100% (Limited Time)'
    };
    return royaltyMap[plan.id] || 'N/A';
  };
  
  // Get number of releases for each plan
  const getReleasesInfo = (plan) => 
    plan.id === 'youtube-oac' ? '1 Release' : 'Unlimited (1 Year)';
  
  // Get color for plan header
  const getPlanHeaderClass = (plan) => {
    const headerClasses = {
      'basic': 'bg-gradient-to-r from-purple-900 to-blue-900',
      'pro': 'bg-gradient-to-r from-blue-900 to-indigo-900',
      'premium': 'bg-gradient-to-r from-pink-900 to-purple-900',
    };
    return headerClasses[plan.id] || 'bg-gradient-to-r from-purple-900 to-indigo-900';
  };
  
  // Get accent color for plan
  const getPlanAccentColor = (plan) => {
    const accentColors = {
      'basic': 'text-blue-400',
      'pro': 'text-indigo-400',
      'premium': 'text-purple-400',
    };
    return accentColors[plan.id] || 'text-purple-400';
  };

  // Memoize plan styles for performance
  const planStyles = useMemo(() => {
    return plans.map(plan => ({
      headerClass: getPlanHeaderClass(plan),
      accentColor: getPlanAccentColor(plan)
    }));
  }, [plans]);

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg shadow-purple-900/20 border border-gray-800">
      <Table className="bg-gray-900">
        <TableHeader>
          <TableRow className="border-b border-gray-800">
            <TableHead className="w-[220px] bg-gray-950 sticky left-0 z-10">
              <div className="font-bold text-gray-300">Features</div>
            </TableHead>
            {plans.map((plan, idx) => (
              <TableHead 
                key={plan.id} 
                className={`text-center ${planStyles[idx].headerClass} text-white min-w-[180px] p-4`}
              >
                <PlanHeader 
                  plan={plan} 
                  accentColor={planStyles[idx].accentColor}
                  headerClass={planStyles[idx].headerClass}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        
        <TableBody>
          <TableRow className="bg-gray-900/60">
            <TableCell className="font-medium sticky left-0 z-10 bg-gray-900/60 border-t border-b border-gray-800">
              <div className="flex items-center gap-2">
                <span className="text-white">Royalties</span>
                <div className="relative group">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded w-48">
                    Percentage of streaming revenue you keep after distribution fees
                  </div>
                </div>
              </div>
            </TableCell>
            {plans.map((plan, idx) => (
              <TableCell 
                key={`${plan.id}-royalties`} 
                className={`text-center font-bold ${planStyles[idx].accentColor} border-t border-b border-gray-800`}
              >
                {getRoyaltyPercentage(plan)}
              </TableCell>
            ))}
          </TableRow>
          
          {allFeatures.map((feature, index) => {
            const isReleasesRow = feature === 'Releases';
            const rowBgClass = index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-900/60';
            
            return (
              <TableRow key={feature} className={rowBgClass}>
                <TableCell className={`font-medium sticky left-0 z-10 text-gray-300 ${rowBgClass} border-b border-gray-800`}>
                  {feature}
                </TableCell>
                {plans.map((plan, idx) => (
                  <TableCell key={`${plan.id}-${feature}`} className="text-center border-b border-gray-800">
                    {isReleasesRow ? (
                      <span className={planStyles[idx].accentColor}>
                        {getReleasesInfo(plan)}
                      </span>
                    ) : (
                      <FeatureCheck 
                        active={hasPlanFeature(plan, feature)} 
                        accentColor={planStyles[idx].accentColor}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
          
          <TableRow className="bg-gray-900/60 border-t border-gray-800">
            <TableCell className="font-medium sticky left-0 z-10 bg-gray-900/60">
              <span className="font-bold text-white">Price</span>
            </TableCell>
            {plans.map(plan => (
              <TableCell key={`${plan.id}-price`} className="text-center">
                <a 
                  href="#plans" 
                  className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                    plan.id === 'premium' 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : plan.id === 'pro'
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : plan.popular
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  } transition-colors`}
                >
                  Get Started
                </a>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default PlansComparison;

