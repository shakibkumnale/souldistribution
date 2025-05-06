import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

// Distribution service plans
const servicePlans = [
  {
    name: 'PRO',
    description: 'For serious artists',
    price: '₹599',
    term: '/year',
    features: [
      'Unlimited Releases (1 Year)',
      '50% Royalties',
      '150+ Indian & International Stores',
      'Custom Release Date & Spotify Verification',
      'Content ID & Playlist Pitching',
      'Instagram Audio Page Linking',
      '24/7 Support | Approval in 24H | Live in 2 Days',
      'Lifetime Availability '
    ],
    highlight: false,
    color: 'bg-purple-600',
    extraInfo: 'All this for just ₹599/year (Less than ₹50/month!)'
  },
  {
    name: 'BASIC',
    description: 'Perfect for new artists',
    price: '₹99',
    term: '/year',
    features: [
      'Unlimited Releases (1 Year)',
      '150+ Indian & International Stores',
      'Custom Release Date & Spotify Verification',
      'Content ID & Playlist Pitching',
      'Instagram Audio Page Linking',
      '24/7 Support | Approval in 24H | Live in 2 Days',
      'Lifetime Availability – No Hidden Fees!'
    ],
    highlight: true,
    color: 'bg-blue-600',
    extraInfo: 'All this for just ₹99/year (Less than ₹10/month!)'
  },
  {
    name: 'PREMIUM',
    description: 'For professional artists',
    price: '₹1199',
    term: '/year',
    features: [
      'Unlimited Releases (1 Year)',
      '100% Royalties',
      '150+ Indian & International Stores',
      'Custom Release Date & Spotify Verification',
      'Content ID & Playlist Pitching',
      'Instagram Audio Page Linking',
      '24/7 Support | Approval in 24H | Live in 2 Days',
      'Lifetime Availability'
    ],
    highlight: false,
    color: 'bg-pink-600',
    extraInfo: 'All this for just ₹1199/year (Less than ₹100/month!)'
  }
];

export default function ServicePlans() {
  return (
    <>
      <div className="text-center mb-10 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-gradient">Distribution Plans</h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Choose the perfect plan for your music career, from new artists to established professionals.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {servicePlans.map((plan, index) => (
          <Card 
            key={index} 
            className={`${plan.highlight ? 'bg-gradient-to-b from-purple-900/40 to-purple-950/60 border-purple-500/50 md:transform md:scale-105 shadow-xl' : 'bg-gradient-to-b from-gray-800/40 to-gray-900/60 border-gray-700/50'} overflow-hidden transition-all duration-300 hover:shadow-purple-900/20 relative`}
          >
            <div className={`${plan.name === 'BASIC' ? 'bg-gradient-to-r from-purple-700/70 to-blue-600' : plan.name === 'PRO' ? 'bg-gradient-to-r from-purple-700 to-pink-600' : 'bg-gradient-to-r from-pink-700 to-purple-700'} h-2 w-full`}></div>
            <CardHeader className="pt-6 sm:pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-bold flex items-center">
                    {plan.name === 'BASIC' || plan.name === 'PRO' || plan.name === 'PREMIUM' ? (
                      <span className="text-orange-500 mr-2">🔥</span>
                    ) : null}
                    {plan.name}
                    {plan.name === 'PRO' && <span className="ml-2 text-blue-400">🚀</span>}
                    {plan.name === 'PREMIUM' && <span className="ml-2">(Maximum Benefits!)</span>}
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base text-gray-300">{plan.description}</CardDescription>
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <span className="text-3xl sm:text-4xl font-bold">{plan.price}</span>
                <span className="text-sm sm:text-base text-gray-400 ml-2">{plan.term}</span>
              </div>
            </CardHeader>
            {plan.name === 'PRO' && (
              <div className="absolute top-2 right-2 bg-white text-black text-lg font-bold rounded-full p-2 w-16 h-16 flex items-center justify-center transform rotate-12 z-10 shadow-lg">
                ₹599
              </div>
            )}
            <CardContent>
              <ul className="space-y-2 sm:space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {plan.extraInfo && (
                <div className="mt-4 bg-black/30 p-3 rounded-lg">
                  <p className="text-sm text-orange-400 flex items-center">
                    <span className="mr-1">🔥</span> {plan.extraInfo}
                  </p>
                </div>
              )}
              
              <div className="mt-4">
                <p className="text-sm text-gray-300 flex items-center">
                  <span className="mr-2">📊</span> Monthly Revenue Reports & Music Promotion
                </p>
                <p className="text-sm text-gray-300 flex items-center mt-2">
                  <span className="mr-2">📩</span> DM to Get Started! <span className="ml-1 text-blue-400">#SoulOnRepeat</span>
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full text-sm sm:text-base ${plan.highlight ? 'bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-600 hover:to-pink-500' : 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500'} border-0`}
                size="lg"
                asChild
              >
                <Link href="https://wa.me/8291121080" target="_blank" rel="noopener noreferrer">
                  Choose Plan
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
} 