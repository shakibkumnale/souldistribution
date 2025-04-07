// src/app/services/page.jsx
import PlansSection from '@/components/services/PlansSection';
import PlansComparison from '@/components/services/PlansComparison';
import FeatureList from '@/components/services/FeatureList';

export const metadata = {
  title: 'Distribution Services | SoulDistribution',
  description: 'Music distribution services for indie artists - get your music on Spotify, Apple Music, YouTube Music and more.',
};

const plans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: '99',
    period: 'Year',
    description: 'Perfect for new artists beginning their journey',
    features: [
      'Unlimited Releases (1 Year)',
      '150+ Indian & International Stores',
      'Custom Release Date & Spotify Verification',
      'Content ID & Playlist Pitching',
      'Instagram Audio Page Linking',
      '24/7 Support | Approval in 24H | Live in 2 Days',
      'Lifetime Availability',
      '0% Royalties'
    ],
    popular: true,
    extraInfo: 'All this for just ₹99/year (Less than ₹10/month!)'
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: '599',
    period: 'Year',
    description: 'For serious artists ready to grow their career',
    features: [
      'Unlimited Releases (1 Year)',
      '50% Royalties',
      '150+ Indian & International Stores',
      'Custom Release Date & Spotify Verification',
      'Content ID & Playlist Pitching',
      'Instagram Audio Page Linking',
      '24/7 Support | Approval in 24H | Live in 2 Days',
      'Lifetime Availability'
    ],
    popular: false,
    extraInfo: 'All this for just ₹599/year (Less than ₹50/month!)'
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: '1199',
    period: 'Year',
    description: 'Complete solution for professional artists',
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
    popular: false,
    extraInfo: 'All this for just ₹1199/year (Less than ₹100/month!)'
  },
];

const youtubeOAC = {
  id: 'youtube-oac',
  name: 'YouTube OAC Plan',
  price: '499',
  period: 'One-time',
  description: 'Get Verified on YouTube',
  features: [
    '1 Release',
    '100% Royalties (Limited Time)',
    'Verified Badge on YouTube',
    'Access to YouTube Analytics & Fan Insights',
    'Official "Music" Tag on Videos',
    'Custom Artist Profile & Banner on YouTube',
    'Lifetime Availability'
  ],
  popular: false,
};

const additionalFeatures = [
  'Original content requirements - ensure your music is 100% original',
  'No copyright strikes - we help you avoid potential issues',
  'Easy renewal process - keep your music live without interruption',
  'Simple payouts system with multiple withdrawal options',
  'Full transparency with detailed analytics and reports',
  'Easy migration if you decide to switch distributors',
];

const faqItems = [
  {
    question: "What platforms will my music be available on?",
    answer: "Your music will be distributed to over 150 platforms including Spotify, Apple Music, YouTube Music, Instagram, TikTok, and all major Indian streaming services."
  },
  {
    question: "How long does it take for my music to go live?",
    answer: "We typically approve releases within 24 hours, and your music will be live on all platforms within 2-5 business days."
  },
  {
    question: "How do royalty payments work?",
    answer: "Royalty percentages vary by plan. Basic Plan members keep 0%, Pro Plan members keep 50%, and Premium Plan members keep 100% of their streaming revenue. Payments are processed monthly."
  },
  {
    question: "What is a YouTube Official Artist Channel?",
    answer: "A YouTube Official Artist Channel (OAC) combines all your music content into one channel with a verified badge, custom branding, and enhanced analytics."
  }
];

const ServicesPage = () => {
  return (
    <div className="w-full overflow-hidden bg-gradient-to-b from-gray-950 to-black text-gray-200">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-950 to-indigo-950 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-md text-white">
              Distribute Your Music Worldwide
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Affordable, transparent music distribution for independent artists
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#plans" 
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full text-lg transition duration-300 shadow-lg"
              >
                View Plans
              </a>
              <a 
                href="https://wa.me/8291121080" 
                className="bg-transparent hover:bg-white/10 border-2 border-purple-400 text-purple-400 hover:text-white hover:border-white font-semibold py-3 px-8 rounded-full text-lg transition duration-300"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Why Choose SoulDistribution?</h2>
          <div className="w-20 h-1 bg-purple-600 mx-auto mt-4 mb-6 rounded-full"></div>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            We help independent artists share their music with the world, without the hassle and high costs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-purple-900/20 transition duration-300 border border-gray-800">
            <div className="w-14 h-14 bg-purple-950 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Global Reach</h3>
            <p className="text-gray-400">
              Distribute your music to over 150 streaming platforms worldwide, including all major Indian services.
            </p>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-purple-900/20 transition duration-300 border border-gray-800">
            <div className="w-14 h-14 bg-purple-950 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Flexible Royalties</h3>
            <p className="text-gray-400">
              Choose from plans offering 0%, 50%, or 100% royalties, with no hidden fees or unexpected costs.
            </p>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-purple-900/20 transition duration-300 border border-gray-800">
            <div className="w-14 h-14 bg-purple-950 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Complete Support</h3>
            <p className="text-gray-400">
              Get 24/7 support, fast approvals, and helpful resources to grow your music career.
            </p>
          </div>
        </div>
      </div>

      {/* Distribution Plans */}
      <div id="plans" className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Choose Your Plan</h2>
            <div className="w-20 h-1 bg-purple-600 mx-auto mt-4 mb-6 rounded-full"></div>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Select the distribution plan that fits your needs and budget.
        </p>
      </div>

      <PlansSection plans={plans} youtubeOAC={youtubeOAC} />
        </div>
      </div>

      {/* Compare Plans */}
      <div className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Compare Plans</h2>
            <div className="w-20 h-1 bg-purple-600 mx-auto mt-4 mb-6 rounded-full"></div>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Find the perfect plan for your music career stage.
            </p>
          </div>
          
        <PlansComparison plans={[...plans, youtubeOAC]} />
        </div>
      </div>

      {/* Additional Features */}
      <div className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Additional Features</h2>
            <div className="w-20 h-1 bg-purple-600 mx-auto mt-4 mb-6 rounded-full"></div>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              All plans include these essential features to help your music succeed.
            </p>
          </div>
          
        <FeatureList features={additionalFeatures} />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
            <div className="w-20 h-1 bg-purple-600 mx-auto mt-4 mb-6 rounded-full"></div>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Find answers to common questions about our distribution services.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-gray-900 rounded-xl p-6 hover:shadow-purple-900/20 hover:shadow-md transition duration-300 border border-gray-800">
                <h3 className="text-xl font-semibold mb-3 text-white">{item.question}</h3>
                <p className="text-gray-400">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-purple-950 to-indigo-950 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready To Start Your Music Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Join thousands of artists who trust SoulDistribution with their music career.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
        <a 
          href="https://wa.me/8291121080" 
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full text-lg transition duration-300 shadow-lg"
          target="_blank" 
          rel="noopener noreferrer"
        >
          Get Started Now
        </a>
            <a 
              href="#plans" 
              className="bg-transparent hover:bg-white/10 border-2 border-purple-400 text-purple-400 hover:text-white hover:border-white font-semibold py-3 px-8 rounded-full text-lg transition duration-300"
            >
              View Plans Again
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;