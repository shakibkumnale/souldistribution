// src/app/services/page.jsx
import PlansSection from '@/components/services/PlansSection';
import PlansComparison from '@/components/services/PlansComparison';
import FeatureList from '@/components/services/FeatureList';
import { createMetadata } from '@/lib/metadata';
import Script from 'next/script';
import { generateServiceSchema, generateBreadcrumbSchema } from '@/lib/seoUtils';

export const metadata = createMetadata({
  title: 'Music Distribution Services',
  description: 'Distribute your music to Spotify, Apple Music, YouTube Music and 150+ platforms worldwide. Choose from our affordable distribution plans for independent artists.',
  keywords: ['music distribution service', 'spotify distribution', 'apple music distribution', 'youtube music distribution', 'independent artist services'],
  canonical: 'https://souldistribution.com/services'
});

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
    description: 'For professional artists aiming for maximum returns',
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
  }
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

export default function ServicesPage() {
  // Generate schema for service plans
  const serviceSchemas = plans.map(plan => generateServiceSchema({
    ...plan,
    price: `₹${plan.price}`
  }));
  
  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://souldistribution.com' },
    { name: 'Services', url: 'https://souldistribution.com/services' }
  ]);
  
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            <span className="block">Music Distribution Services</span>
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-300 sm:mt-4">
            Choose the perfect plan for your music career. Distribute your music to 150+ streaming platforms worldwide.
          </p>
        </div>
        
        <PlansSection plans={plans} youtubeOAC={youtubeOAC} />
        
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Plan Comparison</h2>
          <PlansComparison plans={[...plans, youtubeOAC]} />
        </div>
        
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Distribution Features</h2>
          <FeatureList features={additionalFeatures} />
        </div>
        
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-8" id="faq">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{item.question}</h3>
                <p className="text-gray-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Structured data */}
      <div className="hidden">
        {/* Service schema for each plan */}
        {serviceSchemas.map((schema, index) => (
          <Script key={`service-schema-${index}`} id={`service-schema-${index}`} type="application/ld+json">
            {JSON.stringify(schema)}
          </Script>
        ))}
        
        {/* FAQ schema */}
        <Script id="faq-schema" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map(item => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
              }
            }))
          })}
        </Script>
        
        {/* Breadcrumb schema */}
        <Script id="breadcrumb-schema" type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </Script>
      </div>
    </>
  );
}