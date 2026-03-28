// src/app/layout.jsx
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';

// Optimize font loading by preloading only Latin subset
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Ensure text remains visible during font loading
  fallback: ['system-ui', 'sans-serif'], // Fallback fonts
  preload: true
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://souldistribution.com';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  title: 'Soul Distribution - Best Music Distributor for Independent Artists, Rap & Underground Music',
  description: 'Soul Distribution is India\'s leading music distributor for independent artists, rappers & underground musicians. Distribute to 150+ platforms including Spotify, Apple Music & YouTube. Keep 100% royalties. Music analytics & revenue tracking included.',
  keywords: [
    'music distribution', 'independent artists', 'music distributor India', 'rap music distribution',
    'hip hop distribution', 'underground artist', 'underground music', 'independent rapper',
    'distribute music online', 'best music distributor', 'digital music distribution',
    'spotify distribution', 'apple music distribution', 'youtube monetization', 'keep 100% royalties',
    'music streaming platforms', 'music release', 'single release', 'album distribution', 'EP release',
    'music monetization', 'desi rap', 'indian hip hop', 'desi hip hop', 'independent music label',
    'music analytics', 'revenue tracking', 'streaming analytics', 'music promotion', 'artist services',
    'tidal distribution', 'amazon music distribution', 'music publishing', 'mechanical royalties',
    'streaming royalties', 'youtube OAC', 'youtube artist channel', 'music distributor',
    'soul distribution', 'music distribution India', 'underground rap India',
  ],
  authors: [{ name: 'Soul Distribution', url: 'https://souldistribution.in' }],
  creator: 'Soul Distribution',
  publisher: 'Soul Distribution',
  category: 'Music Distribution',
  classification: 'Music & Entertainment',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'Soul Distribution',
    title: 'Soul Distribution - Best Music Distributor for Independent Artists & Rappers',
    description: 'India\'s leading music distributor for independent artists, rappers & underground musicians. Distribute to 150+ platforms & keep 100% royalties. Full analytics & revenue dashboard.',
    images: [
      {
        url: `${baseUrl}/api/og/default`,
        width: 1200,
        height: 630,
        alt: 'Soul Distribution - Best Music Distributor for Independent Artists',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soul Distribution - Music Distribution for Independent Artists, Rap & Underground Music',
    description: 'Distribute your music to 150+ platforms worldwide. Keep 100% royalties. Built for independent artists, rappers & underground musicians.',
    images: [`${baseUrl}/api/og/default`],
    creator: '@souldistribution',
    site: '@souldistribution',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={inter.className} suppressHydrationWarning>
        <ClientLayout interClassName={inter.className}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}