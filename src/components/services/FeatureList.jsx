// src/components/services/FeatureList.jsx
import React from 'react';
import { Check, Star, Shield, RefreshCw, BarChart, ArrowRight } from 'lucide-react';

const FeatureList = ({ features }) => {
  // Icons for each feature (using index as simple mapping)
  const getIconForFeature = (index) => {
    const icons = [
      <Shield className="h-5 w-5 text-purple-400" />,
      <Check className="h-5 w-5 text-purple-400" />,
      <RefreshCw className="h-5 w-5 text-purple-400" />,
      <Star className="h-5 w-5 text-purple-400" />,
      <BarChart className="h-5 w-5 text-purple-400" />,
      <ArrowRight className="h-5 w-5 text-purple-400" />,
    ];
    return icons[index % icons.length];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="flex items-start p-5 bg-gray-900 rounded-xl shadow-md hover:shadow-purple-900/20 transition-all duration-300 border border-gray-800"
        >
          <div className="h-10 w-10 rounded-full bg-purple-950 flex items-center justify-center mr-4 flex-shrink-0">
            {getIconForFeature(index)}
          </div>
          <div>
            <span className="text-gray-300">{feature}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureList;