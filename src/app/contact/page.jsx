// src/app/contact/page.jsx
// This is a server component for metadata
import ContactForm from '@/components/contact/ContactForm';

// Define viewport separately from metadata
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  title: 'Contact Us | Soul Distribution',
  description: 'Contact Soul Distribution for music distribution support, YouTube OAC services, or general inquiries. Our team is available to assist with all your music career needs.',
  keywords: ['contact', 'music distribution support', 'artist services', 'customer service'],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Soul Distribution',
    description: 'Reach out to our team for personalized support with your music distribution needs. Fast response times guaranteed.',
    url: '/contact',
    type: 'website',
    images: [
      {
        url: '/api/og/default',
        width: 1200,
        height: 630,
        alt: 'Contact Soul Distribution',
      }
    ],
  },
};

// This is the server component that renders the client component
// and provides structured data
export default function ContactPage() {
  // Create LocalBusiness structured data
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: 'Soul Distribution',
    email: 'shakibkumnali@gmail.com',
    telephone: '+91 8291121080',
    url: 'https://souldistribution.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Thane',
      addressRegion: 'Maharashtra',
      addressCountry: 'India'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91 8291121080',
      contactType: 'customer service',
      availableLanguage: 'English',
      email: 'shakibkumnali@gmail.com'
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
        'Friday', 'Saturday', 'Sunday'
      ],
      opens: '00:00',
      closes: '23:59'
    }
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <ContactForm />
    </>
  );
}