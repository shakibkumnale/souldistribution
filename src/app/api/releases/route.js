import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Release from '@/models/Release';
import Artist from '@/models/Artist';
import mongoose from 'mongoose';
import { serializeMongoDB } from '@/lib/utils';

// Helper function to ensure all MongoDB ObjectIds are properly serialized
function serializeObjectId(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // Handle Date objects
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => serializeObjectId(item));
  }
  
  // Handle ObjectId - most important case
  if (mongoose.Types.ObjectId.isValid(obj) && 
      (obj instanceof mongoose.Types.ObjectId || 
       (obj._bsontype === 'ObjectID') || 
       (typeof obj.toString === 'function' && obj.toString().length === 24))) {
    return obj.toString();
  }
  
  // Handle objects
  if (typeof obj === 'object' && obj !== null) {
    const result = {};
    
    for (const [key, value] of Object.entries(obj)) {
      // Convert _id to string explicitly 
      if (key === '_id') {
        result[key] = typeof value === 'object' && value !== null ? 
                       value.toString() : value;
      } else {
        result[key] = serializeObjectId(value);
      }
    }
    
    return result;
  }
  
  // Return primitive values as is
  return obj;
}

/**
 * GET /api/releases
 * Fetch all releases or filter by query parameters
 */
export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const fetchAll = searchParams.get('fetchAll') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const featured = searchParams.get('featured') === 'true';
    const artistId = searchParams.get('artistId');
    const type = searchParams.get('type');
    
    // Build query
    const query = {};
    
    if (featured) {
      query.featured = true;
    }
    
    if (artistId) {
      query.artists = artistId;
    }
    
    if (type) {
      query.type = type;
    }
    
    const skip = (page - 1) * limit;
    
    // Fetch releases, optionally skipping pagination
    let releasesQuery = Release.find(query)
      .populate('artists')
      .sort({ releaseDate: -1 });
      
    // Only apply pagination if we're not fetching all records
    if (!fetchAll) {
      releasesQuery = releasesQuery.skip(skip).limit(limit);
    }
    
    const releases = await releasesQuery.lean();
    
    const total = await Release.countDocuments(query);
    
    // Double serialize to ensure all ObjectIds are properly converted to strings
    const serializedReleases = releases.map(release => {
      // Explicitly convert _id to string
      const serialized = {
        ...release,
        _id: release._id.toString(),
      };
      
      // Convert artist IDs to strings if populated
      if (release.artists && Array.isArray(release.artists)) {
        serialized.artists = release.artists.map(artist => {
          if (typeof artist === 'string') return artist;
          
          return {
            ...artist,
            _id: artist._id.toString()
          };
        });
      }
      
      return serialized;
    });
    
    // Apply the second layer of serialization to catch any nested ObjectIds
    const fullySerializedReleases = serializeObjectId(serializedReleases);
    
    return NextResponse.json({
      releases: fullySerializedReleases,
      pagination: {
        total,
        pages: fetchAll ? 1 : Math.ceil(total / limit),
        page: fetchAll ? 1 : page,
        limit: fetchAll ? total : limit
      }
    });
  } catch (error) {
    console.error('Error fetching releases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch releases' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/releases
 * Create a new release
 */
export async function POST(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.slug || !body.artists || !body.coverImage || !body.releaseDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Ensure artists is an array
    if (!Array.isArray(body.artists)) {
      body.artists = [body.artists];
    }
    
    // Separate real MongoDB ObjectIds from Spotify IDs
    const validMongoIds = [];
    const spotifyPrefixedIds = [];
    
    body.artists.forEach(id => {
      if (typeof id === 'string' && id.startsWith('spotify-')) {
        spotifyPrefixedIds.push(id);
      } else {
        try {
          // Check if this is a valid MongoDB ObjectId
          if (mongoose.Types.ObjectId.isValid(id)) {
            validMongoIds.push(id);
          } else {
            spotifyPrefixedIds.push(id);
          }
        } catch {
          spotifyPrefixedIds.push(id);
        }
      }
    });
    
    // Process the spotify prefixed IDs if there are any
    if (spotifyPrefixedIds.length > 0) {
      const spotifyIds = spotifyPrefixedIds
        .filter(id => id.startsWith('spotify-'))
        .map(id => id.replace('spotify-', ''));
        
      if (spotifyIds.length > 0) {
        // Find artists by Spotify ID
        const spotifyArtists = await Artist.find({
          spotifyArtistId: { $in: spotifyIds }
        });
        
        // If we found any artists, add their real MongoDB IDs to our list
        if (spotifyArtists.length > 0) {
          spotifyArtists.forEach(artist => {
            if (!validMongoIds.includes(artist._id.toString())) {
              validMongoIds.push(artist._id);
            }
          });
        } else {
          // If no artists found, we need to create them first
          for (const spotifyId of spotifyIds) {
            try {
              // Create a temporary artist - in a production environment, 
              // you'd want to fetch proper artist data from Spotify first
              const newArtist = new Artist({
                name: `Spotify Artist (${spotifyId})`,
                slug: `spotify-artist-${spotifyId}`,
                bio: 'Automatically created from Spotify ID',
                image: 'https://placehold.co/400x400/000000/FFFFFF?text=Artist',
                spotifyArtistId: spotifyId,
              });
              
              await newArtist.save();
              validMongoIds.push(newArtist._id);
            } catch (err) {
              console.error(`Error creating artist from Spotify ID ${spotifyId}:`, err);
              // Continue with other artists
            }
          }
        }
      }
    }
    
    // If we don't have any valid artist IDs at this point, we can't create the release
    if (validMongoIds.length === 0) {
      return NextResponse.json(
        { error: 'No valid artist IDs found. Please select at least one artist.' },
        { status: 400 }
      );
    }
    
    // Update the artists array with only valid MongoDB ObjectIds
    body.artists = validMongoIds;
    
    // Create release
    const release = new Release(body);
    await release.save();
    
    return NextResponse.json(serializeMongoDB(release.toObject()));
  } catch {
    return NextResponse.json(
      { error: 'Failed to create release' },
      { status: 500 }
    );
  }
} 