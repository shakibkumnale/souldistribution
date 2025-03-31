import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Helper function to ensure all MongoDB ObjectIds are properly serialized
function serializeData(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // Handle Date objects
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => serializeData(item));
  }
  
  // Handle ObjectId
  if (obj instanceof ObjectId) {
    return obj.toString();
  }
  
  // Handle objects
  if (typeof obj === 'object' && obj !== null) {
    const result = {};
    
    for (const [key, value] of Object.entries(obj)) {
      // Convert _id to string explicitly 
      if (key === '_id') {
        result[key] = value instanceof ObjectId ? value.toString() : value;
      } else {
        result[key] = serializeData(value);
      }
    }
    
    return result;
  }
  
  // Return primitive values as is
  return obj;
}

/**
 * GET /api/releases/by-slug/[slug]
 * Fetch a specific release by slug
 */
export async function GET(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }
    
    const release = await db.collection('releases').findOne({ slug });
    
    if (!release) {
      return NextResponse.json(
        { error: 'Release not found' },
        { status: 404 }
      );
    }
    
    // Fetch artist information for the release
    let artistName = 'Unknown Artist';
    let artists = [];
    
    if (release.artists && release.artists.length > 0) {
      try {
        // Get all artist records for the release
        const artistIds = release.artists.map(id => 
          typeof id === 'string' ? new ObjectId(id) : id
        );
        
        artists = await db.collection('artists')
          .find({ _id: { $in: artistIds } })
          .toArray();
          
        // Add full artist data to the release
        if (artists.length > 0) {
          // Pick the first artist's name for backward compatibility
          artistName = artists[0].name || 'Unknown Artist';
          
          // Serialize all artist data
          artists = artists.map(artist => serializeData(artist));
        }
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    }
    
    // Prepare the release data with serialized values
    const serializedRelease = serializeData(release);
    
    // Add artist name for backward compatibility
    serializedRelease.artistName = artistName;
    
    // Add full artist objects if available
    if (artists.length > 0) {
      serializedRelease.artistObjects = artists;
    }
    
    return NextResponse.json(serializedRelease);
  } catch (error) {
    console.error('Error fetching release by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch release' },
      { status: 500 }
    );
  }
} 