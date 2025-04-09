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
    
    return artists.map(artist => {
      // Deep clone the artist object to avoid mutation issues
      const safeArtist = JSON.parse(JSON.stringify(artist, (key, value) => {
        // Handle ObjectId instances
        if (value && typeof value === 'object' && value._bsontype === 'ObjectID') {
          return value.toString();
        }
        // Handle Date objects
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      }));
      
      // Now ensure all _id fields are strings throughout the object structure
      const processObject = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;
        
        // Handle arrays
        if (Array.isArray(obj)) {
          return obj.map(item => processObject(item));
        }
        
        // Convert _id if it exists
        if (obj._id && typeof obj._id === 'object') {
          obj._id = obj._id.toString();
        }
        
        // Recursively process all properties
        const result = { ...obj };
        for (const key in result) {
          if (result[key] && typeof result[key] === 'object') {
            result[key] = processObject(result[key]);
          }
        }
        return result;
      };
      
      // Use the safe serialized version
      const serialized = processObject(safeArtist);
      
      // Ensure top-level IDs are strings
      if (serialized._id) serialized._id = String(serialized._id);
      
      // Handle spotifyData.images specifically since that's causing the issue
      if (serialized.spotifyData && serialized.spotifyData.images && Array.isArray(serialized.spotifyData.images)) {
        serialized.spotifyData.images = serialized.spotifyData.images.map(image => {
          if (!image) return image;
          const safeImage = { ...image };
          if (safeImage._id) safeImage._id = String(safeImage._id);
          return safeImage;
        });
      }
      
      return serialized;
    });
  } catch (error) {
    console.error('Error fetching artists:', error);
    return [];
  }
}

export default async function ArtistsPage() {
  const artists = await getArtists();
  
  return (
    <main className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Our Artists</h1>
      
      <Suspense fallback={<div>Loading artists...</div>}>
        <ArtistsGrid artists={artists} enableFiltering={true} enableSorting={true} />
      </Suspense>
    </main>
  );
}

