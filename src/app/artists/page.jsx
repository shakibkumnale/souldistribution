// src/app/artists/page.jsx
import { Suspense } from 'react';
import ArtistsGrid from '@/components/artists/ArtistsGrid';
import connectToDatabase from '@/lib/db';
import Artist from '@/models/Artist';

// Add caching directives - revalidate every 10 minutes
export const revalidate = 600;

// Add metadata for the artists page
export const metadata = {
  title: 'Independent Artists | Soul Distribution',
  description: 'Discover independent artists from around the world on Soul Distribution. Our roster features talented musicians across all genres distributing their music globally.',
  keywords: ['independent artists', 'music artists', 'musician roster', 'new talent', 'unsigned artists'],
  alternates: {
    canonical: '/artists',
  },
  openGraph: {
    title: 'Discover Independent Artists | Soul Distribution',
    description: 'Browse our roster of talented independent artists distributing their music worldwide. From emerging talent to established musicians across all genres.',
    url: '/artists',
    type: 'website',
    images: [
      {
        url: '/api/og/default',
        width: 1200,
        height: 630,
        alt: 'Soul Distribution Artists',
      }
    ],
  },
};

// Fetch artists with improved error handling and performance
async function getArtists() {
  try {
    await connectToDatabase();
    
    // Use lean() for better performance - returns plain JS objects
    const artists = await Artist.find({})
      .sort({ name: 1 })
      .lean();
    
    // Simple serialization for better performance
    return JSON.parse(JSON.stringify(artists));
  } catch (error) {
    console.error('Error fetching artists:', error);
    return [];
  }
}

export default async function ArtistsPage() {
  const artists = await getArtists();
  
  // Create CollectionPage structured data
  const collectionPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Independent Artists | Soul Distribution',
    description: 'Discover independent artists from around the world on Soul Distribution.',
    url: 'https://souldistribution.com/artists',
    numberOfItems: artists.length,
    itemListElement: artists.slice(0, 10).map((artist, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'MusicGroup',
        name: artist.name,
        url: `https://souldistribution.com/artists/${artist.slug}`,
        image: artist.profileImage || (artist.spotifyData?.images?.[0]?.url || ''),
        genre: artist.genres?.join(', ') || 'Music'
      }
    }))
  };
  
  return (
    <main className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Add structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />
      
      <h1 className="text-4xl font-bold mb-8">Our Artists</h1>
      
      <Suspense fallback={<div>Loading artists...</div>}>
        <ArtistsGrid artists={artists} enableFiltering={true} enableSorting={true} />
      </Suspense>
    </main>
  );
}

