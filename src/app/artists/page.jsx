
// src/app/artists/page.jsx
import { Suspense } from 'react';
import ArtistsGrid from '@/components/artists/ArtistsGrid';
import connectToDatabase from '@/lib/db';
import Artist from '@/models/Artist';

async function getArtists() {
  try {
    await connectToDatabase();
    
    const artists = await Artist.find({})
      .sort({ name: 1 })
      .lean();
    
    return artists.map(artist => ({
      ...artist,
      _id: artist._id.toString(),
      createdAt: artist.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching artists:', error);
    return [];
  }
}

export default async function ArtistsPage() {
  const artists = await getArtists();
  
  return (
    <main className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-12">Our Artists</h1>
      
      <Suspense fallback={<div>Loading artists...</div>}>
        <ArtistsGrid artists={artists} />
      </Suspense>
    </main>
  );
}

