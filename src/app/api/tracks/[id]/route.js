import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Release from '@/models/Release';
import mongoose from 'mongoose';

/**
 * GET /api/tracks/[id]
 * Get track details by ID or slug with populated artists
 */
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Track ID is required' }, { status: 400 });
    }
    
    let track;
    
    // First try to find by MongoDB ID if it's a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      track = await Release.findById(id)
        .populate('artists', 'name slug image')
        .lean();
    }
    
    // If not found by ID, try to find by slug
    if (!track) {
      track = await Release.findOne({ slug: id })
        .populate('artists', 'name slug image')
        .lean();
    }
    
    // If still not found, try by ISRC
    if (!track) {
      track = await Release.findOne({ isrc: id })
        .populate('artists', 'name slug image')
        .lean();
    }
    
    if (!track) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }
    
    return NextResponse.json(track);
  } catch (error) {
    console.error('Error fetching track:', error);
    return NextResponse.json(
      { error: 'Failed to fetch track data', message: error.message },
      { status: 500 }
    );
  }
} 