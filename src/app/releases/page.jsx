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
      
      // Helper function to convert MongoDB objects to plain objects
      const serializeObjectId = (obj) => {
        if (!obj) return obj;
        
        if (obj._id && typeof obj._id.toString === 'function') {
          return { ...obj, _id: obj._id.toString() };
        }
        
        return obj;
      };
      
      // Serialize artists array
      const serializedArtists = Array.isArray(release.artists) 
        ? release.artists.map(artist => {
            if (!artist) return '';
            if (typeof artist === 'string') return artist;
            if (artist._id) {
              return {
                ...artist,
                _id: artist._id.toString()
              };
            }
            return artist;
          })
        : [];
      
      // Serialize featuring artists if they exist
      const serializedFeaturingArtists = Array.isArray(release.featuringArtists)
        ? release.featuringArtists.map(artist => {
            if (!artist) return null;
            if (artist._id) {
              return {
                ...artist,
                _id: artist._id.toString()
              };
            }
            return artist;
          })
        : [];
      
      return {
        ...release,
        _id: release._id.toString(),
        artists: serializedArtists,
        featuringArtists: serializedFeaturingArtists, 
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
      <h1 className="text-4xl font-bold mb-8">Our Releases</h1>
      
      <Suspense fallback={<div>Loading releases...</div>}>
        <ReleasesGrid releases={releases} columns={5} enableFiltering={true} enableSorting={true} />
      </Suspense>
    </main>
  );
}

