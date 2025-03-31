// src/app/releases/page.jsx
import { Suspense } from 'react';
import ReleasesGrid from '@/components/releases/ReleasesGrid';
import connectToDatabase from '@/lib/db';
import Release from '@/models/Release';
import Artist from '@/models/Artist';

async function getReleases() {
  try {
    await connectToDatabase();
    
    const releases = await Release.find({})
      .sort({ releaseDate: -1 })
      .populate('artists', 'name')
      .lean();
    
    return releases.map(release => {
      // Add safe check for artists
      const artistName = release.artists && 
                         release.artists.length > 0 && 
                         release.artists[0] && 
                         release.artists[0].name ? 
                         release.artists[0].name : 'Unknown Artist';
      
      return {
        ...release,
        _id: release._id.toString(),
        artists: Array.isArray(release.artists) ? 
          release.artists.map(artist => artist && artist._id ? artist._id.toString() : '') 
          : [],
        artistName,
        createdAt: release.createdAt ? release.createdAt.toISOString() : new Date().toISOString(),
        releaseDate: release.releaseDate ? release.releaseDate.toISOString() : new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('Error fetching releases:', error);
    return [];
  }
}

export default async function ReleasesPage() {
  const releases = await getReleases();
  
  return (
    <main className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-12">Our Releases</h1>
      
      <Suspense fallback={<div>Loading releases...</div>}>
        <ReleasesGrid releases={releases} columns={5} />
      </Suspense>
    </main>
  );
}

