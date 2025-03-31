'use client';

import PlanCard from './PlanCard';

export default function PlansSection({ plans, youtubeOAC }) {
  const handlePlanSelect = (selectedPlan) => {
    console.log('Selected plan:', selectedPlan);
    // Add your plan selection logic here
  };

  return (
    <div className="space-y-16">
      {/* Distribution Plans */}
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-purple-900 rounded-full opacity-30 blur-2xl"></div>
        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-indigo-900 rounded-full opacity-30 blur-2xl"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PlanCard 
              key={plan.id} 
              plan={plan}
              onSelect={handlePlanSelect}
            />
          ))}
        </div>
      </div>

      {/* YouTube OAC Plan */}
      <div className="mt-20 relative">
        <div className="absolute -z-10 inset-0 bg-gradient-to-r from-purple-950 to-indigo-950 rounded-3xl"></div>
        <div className="py-10 px-6">
          <h2 className="text-3xl font-bold text-center mb-2 text-white">YouTube Official Artist Channel</h2>
          <div className="w-16 h-1 bg-purple-600 mx-auto mb-6 rounded-full"></div>
          <div className="max-w-xl mx-auto text-center mb-8">
            <p className="text-gray-300">
              Get verified on YouTube with our one-time payment plan. Includes a verified badge, 
              analytics, and your custom profile to help fans discover your music.
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <PlanCard 
              plan={youtubeOAC}
              onSelect={handlePlanSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}