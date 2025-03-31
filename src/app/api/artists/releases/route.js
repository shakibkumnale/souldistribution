import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Release from '@/models/Release';
import Artist from '@/models/Artist';

/**
 * GET /api/artists/releases
 * Fetch releases for an artist by spotifyArtistId or artistId
 */
export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    const spotifyArtistId = searchParams.get('spotifyArtistId');
    const artistId = searchParams.get('artistId');
    
    if (!spotifyArtistId && !artistId) {
      return NextResponse.json(
        { error: 'Either spotifyArtistId or artistId is required' },
        { status: 400 }
      );
    }
    
    // Find the artist
    let artist;
    if (spotifyArtistId) {
      artist = await Artist.findOne({ spotifyArtistId }).lean();
    } else if (artistId) {
      artist = await Artist.findById(artistId).lean();
    }
    
    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      );
    }
    
    // Find releases by this artist
    const releases = await Release.find({ artists: artist._id })
      .sort({ releaseDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate('artists')
      .lean();
    
    const total = await Release.countDocuments({ artists: artist._id });
    
    // Format releases for response
    const formattedReleases = releases.map(release => ({
      ...release,
      _id: release._id.toString(),
      artists: release.artists.map(artist => ({
        ...artist,
        _id: artist._id.toString()
      })),
      createdAt: release.createdAt.toISOString(),
      releaseDate: release.releaseDate.toISOString(),
    }));
    
    return NextResponse.json({
      artist: {
        ...artist,
        _id: artist._id.toString()
      },
      releases: formattedReleases,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching artist releases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch releases' },
      { status: 500 }
    );
  }
} 