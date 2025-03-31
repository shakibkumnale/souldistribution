// src/components/services/PlanCard.jsx
'use client';
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Configuration objects to avoid repetitive conditionals
const PLAN_CONFIG = {
  'basic': {
    icon: "🔥",
    royaltyText: "0% Royalties",
    royaltyColor: "bg-gray-600",
    headerGradient: 'bg-gradient-to-r from-purple-500 to-blue-500',
    cardGradient: 'bg-gradient-to-r from-purple-500/20 to-blue-500/20',
  },
  'pro': {
    icon: "⭐",
    royaltyText: "50% Royalties",
    royaltyColor: "bg-blue-600",
    headerGradient: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    cardGradient: 'bg-gradient-to-r from-blue-500/20 to-indigo-600/20',
  },
  'premium': {
    icon: "🚀",
    royaltyText: "100% Royalties",
    royaltyColor: "bg-green-600",
    headerGradient: 'bg-gradient-to-r from-pink-500 to-purple-600',
    cardGradient: 'bg-gradient-to-r from-pink-500/20 to-purple-600/20',
  },
  'youtube-oac': {
    icon: "🎬",
    royaltyText: "100% Royalties (Limited)",
    royaltyColor: "bg-purple-600",
    headerGradient: 'bg-gradient-to-r from-purple-600 to-indigo-700',
    cardGradient: 'bg-gradient-to-r from-purple-600/20 to-indigo-700/20',
  }
};

// Feature item component
const FeatureItem = ({ text, highlighted = false }) => (
  <div className="flex items-start gap-2">
    <CheckCircle className={`${highlighted ? 'h-5 w-5 text-purple-400' : 'h-4 w-4 text-gray-500'} mt-0.5 flex-shrink-0`} />
    <span className={`${highlighted ? 'text-sm text-gray-300' : 'text-xs text-gray-400'}`}>{text}</span>
  </div>
);

const PlanCard = ({ plan, onSelect }) => {
  const { 
    id, 
    name, 
    price, 
    period, 
    description,
    features = [], 
    popular = false,
    extraInfo
  } = plan;

  // Get plan configuration, fallback to default if not found
  const config = PLAN_CONFIG[id] || PLAN_CONFIG.basic;
  
  // Filter features for display
  const nonRoyaltyFeatures = features.filter(feature => !feature.includes('Royalties'));
  const highlightedFeatures = nonRoyaltyFeatures.slice(0, 4);
  const remainingFeatures = nonRoyaltyFeatures.slice(4);
  
  const handleSelectPlan = () => {
    // Open WhatsApp directly with the selected plan
    window.open(`https://wa.me/8291121080?text=I'm interested in the ${name}`, '_blank');
  };

  return (
    <Card className={`w-full h-full transition-all duration-300 hover:translate-y-[-8px] overflow-hidden 
      ${popular ? 'ring-2 ring-orange-500 shadow-lg shadow-purple-900/30' : 'shadow-md hover:shadow-purple-900/20'}
      relative bg-gray-900 border-gray-800`}>
      {popular && (
        <div className="absolute -right-12 top-7 bg-orange-500 text-white py-1 px-12 transform rotate-45 z-10 text-sm font-medium">
          Most Popular
        </div>
      )}
      
      <div className={`h-2 w-full ${config.headerGradient}`}></div>
      
      <CardHeader className={`text-center bg-gray-900 text-white p-6 pb-8 ${config.cardGradient}`}>
        <div className="text-3xl mb-2">{config.icon}</div>
        <CardTitle className="text-2xl font-bold mb-3 text-white">
          {name}
        </CardTitle>
        
        <div className="flex items-center justify-center mb-3">
          <span className="text-4xl font-extrabold text-white">₹{price}</span>
          {period && (
            <span className="text-sm text-gray-300 ml-1">/{period}</span>
          )}
        </div>
        
        <p className="text-gray-300 text-sm mb-4">{description}</p>
        
        <div className={`${config.royaltyColor} text-white font-semibold py-1.5 px-4 rounded-full mx-auto max-w-fit text-sm`}>
          {config.royaltyText}
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 bg-gray-900 text-gray-300">
        {extraInfo && (
          <div className="mb-6 p-3 bg-purple-950/40 border border-purple-800/30 rounded-lg">
            <p className="text-sm text-purple-300 flex items-center">
              <span className="mr-2">🔥</span> {extraInfo}
            </p>
          </div>
        )}
        
        <div className="space-y-3 mb-6">
          {highlightedFeatures.map((feature, index) => (
            <FeatureItem key={index} text={feature} highlighted={true} />
          ))}
        </div>
        
        {remainingFeatures.length > 0 && (
          <div className="mt-5 pt-5 border-t border-gray-800">
            <p className="font-medium text-sm text-gray-400 mb-3">Also includes:</p>
            <div className="space-y-2">
              {remainingFeatures.map((feature, index) => (
                <FeatureItem key={index} text={feature} highlighted={false} />
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-5 pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-400 flex items-center mb-2">
            <span className="mr-2">📊</span> Monthly Revenue Reports
          </p>
          <p className="text-xs text-gray-400 flex items-center">
            <span className="mr-2">📩</span> 24/7 Support <span className="ml-1 text-purple-400">#SoulOnRepeat</span>
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-5 bg-gray-950 border-t border-gray-800">
        <Button 
          className={`w-full ${
            popular 
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md' 
              : id === 'premium'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md'
                : 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700'
          }`}
          onClick={handleSelectPlan}
          variant={popular || id === 'premium' ? "default" : "outline"}
          size="lg"
        >
          Get Started
        </Button>
      </CardFooter>
      
      {id === 'premium' && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold rounded-full p-1 w-14 h-14 flex items-center justify-center transform rotate-12 z-10 shadow-md">
          100% Royalties
        </div>
      )}
    </Card>
  );
};

export default PlanCard;