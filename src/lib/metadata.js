// src/lib/metadata.js
// Centralized metadata configuration for SEO

export const defaultMetadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://souldistribution.com'),
  title: {
    default: 'Soul Distribution - Music Distribution & YouTube OAC Services',
    template: '%s | Soul Distribution'
  },
  description: 'Distribute your music worldwide to 150+ platforms and get verified on YouTube with Soul Distribution. Affordable plans for indie artists.',
  keywords: ['music distribution', 'artist promotion', 'spotify distribution', 'youtube artist channel', 'indie music', 'music streaming'],
  authors: [{ name: 'Soul Distribution', url: 'https://souldistribution.com' }],
  creator: 'Soul Distribution',
  publisher: 'Soul Distribution',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://souldistribution.com',
    siteName: 'Soul Distribution',
    title: 'Soul Distribution - Music Distribution & YouTube OAC Services',
    description: 'Distribute your music worldwide to 150+ platforms and get verified on YouTube with Soul Distribution. Affordable plans for indie artists.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Soul Distribution - Music Distribution Services'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soul Distribution - Music Distribution & YouTube OAC Services',
    description: 'Distribute your music worldwide to 150+ platforms and get verified on YouTube with Soul Distribution. Affordable plans for indie artists.',
    images: ['/images/twitter-image.jpg'],
    creator: '@souldistribution'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://souldistribution.com',
    languages: {
      'en-US': 'https://souldistribution.com',
    },
  },
  verification: {
    google: 'google-site-verification-code', // Replace with actual verification code
  }
};

// Helper function to create page-specific metadata
export function createMetadata({ 
  title, 
  description, 
  keywords = [], 
  image = '/images/og-image.jpg',
  canonical = '',
  noIndex = false
}) {
  return {
    title,
    description,
    keywords: [...defaultMetadata.keywords, ...keywords],
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      url: canonical || defaultMetadata.openGraph.url
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
      images: [image]
    },
    alternates: {
      ...defaultMetadata.alternates,
      canonical: canonical || defaultMetadata.alternates.canonical
    },
    robots: noIndex ? {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false
      }
    } : defaultMetadata.robots
  };
} 