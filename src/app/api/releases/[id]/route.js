import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Release from '@/models/Release';
import mongoose from 'mongoose';

/**
 * GET /api/releases/[id]
 * Fetch a specific release by ID
 */
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid release ID format' },
        { status: 400 }
      );
    }
    
    const release = await Release.findById(id).populate('artists').lean();
    
    if (!release) {
      return NextResponse.json(
        { error: 'Release not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(release);
  } catch (error) {
    console.error('Error fetching release:', error);
    return NextResponse.json(
      { error: 'Failed to fetch release' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/releases/[id]
 * Update a specific release
 */
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const data = await request.json();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid release ID format' },
        { status: 400 }
      );
    }
    
    // Make sure artists is an array
    if (data.artists && !Array.isArray(data.artists)) {
      data.artists = [data.artists];
    }
    
    const release = await Release.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).populate('artists');
    
    if (!release) {
      return NextResponse.json(
        { error: 'Release not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(release);
  } catch (error) {
    console.error('Error updating release:', error);
    
    // Handle duplicate slug error
    if (error.code === 11000 && error.keyPattern?.slug) {
      return NextResponse.json(
        { error: 'A release with this slug already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update release' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/releases/[id]
 * Delete a specific release
 */
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid release ID format' },
        { status: 400 }
      );
    }
    
    const release = await Release.findByIdAndDelete(id);
    
    if (!release) {
      return NextResponse.json(
        { error: 'Release not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Release deleted successfully' });
  } catch (error) {
    console.error('Error deleting release:', error);
    return NextResponse.json(
      { error: 'Failed to delete release' },
      { status: 500 }
    );
  }
} 