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
  title: 'Soul Distribution - Music Distribution & YouTube OAC Services',
  description: 'Soul Distribution helps independent artists distribute music worldwide to all major streaming platforms and get verified on YouTube with monetization services.',
  keywords: ['music distribution', 'artist services', 'youtube monetization', 'independent music', 'music streaming'],
  authors: [{ name: 'Soul Distribution', url: 'https://souldistribution.com' }],
  creator: 'Soul Distribution',
  publisher: 'Soul Distribution',
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
    locale: 'en_US',
    url: '/',
    siteName: 'Soul Distribution',
    title: 'Soul Distribution - Music Distribution & YouTube OAC Services',
    description: 'Soul Distribution helps independent artists distribute music worldwide to all major streaming platforms and get verified on YouTube with monetization services.',
    images: [
      {
        url: `${baseUrl}/api/og/default`,
        width: 1200,
        height: 630,
        alt: 'Soul Distribution',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soul Distribution - Music Distribution & YouTube OAC Services',
    description: 'Soul Distribution helps independent artists distribute music worldwide to all major streaming platforms and get verified on YouTube with monetization services.',
    images: [`${baseUrl}/api/og/default`],
    creator: '@souldistribution',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
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