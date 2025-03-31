// src/app/layout.jsx
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';
import { defaultMetadata } from '@/lib/metadata';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = defaultMetadata;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={defaultMetadata.alternates.canonical} />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ClientLayout interClassName={inter.className}>
          {children}
        </ClientLayout>
        
        {/* Structured data for organization */}
        <Script id="organization-schema" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Soul Distribution',
            url: 'https://souldistribution.com',
            logo: 'https://souldistribution.com/images/logo.png',
            sameAs: [
              'https://www.facebook.com/souldistribution',
              'https://www.instagram.com/souldistribution',
              'https://twitter.com/souldistribution'
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+91-XXXXXXXXXX',
              contactType: 'customer service',
              availableLanguage: ['English', 'Hindi']
            },
            description: 'Music distribution services for indie artists - get your music on Spotify, Apple Music, YouTube Music and more.'
          })}
        </Script>
      </body>
    </html>
  );
}