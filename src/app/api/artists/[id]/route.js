import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Artist from '@/models/Artist';
import { withDbCache, generateDbCacheKey } from '@/lib/db-cache';

// Cache individual artist data for 10 minutes
export const revalidate = 600;

// Delete artist
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    
    const artist = await Artist.findByIdAndDelete(id);
    
    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      );
    }
    
    // Set no-cache headers for mutations
    const response = NextResponse.json({ success: true });
    response.headers.set('Cache-Control', 'no-store');
    
    return response;
  } catch (error) {
    console.error('Error deleting artist:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Update artist
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const data = await request.json();
    
    // Ensure each plan has a price if not already set
    if (data.plans) {
      data.plans = data.plans.map(plan => {
        if (!plan.price) {
          return {
            ...plan,
            price: getPlanPrice(plan.type)
          };
        }
        return plan;
      });
    }
    
    const artist = await Artist.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      );
    }
    
    // Set cache control headers to no-store for mutations
    const response = NextResponse.json(artist);
    response.headers.set('Cache-Control', 'no-store');
    
    return response;
  } catch (error) {
    console.error('Error updating artist:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = error.errors[key].message;
        return acc;
      }, {});
      
      return NextResponse.json(
        { error: 'Validation Error', details: errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Get artist by ID
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    
    // Cache key based on ID
    const cacheKey = generateDbCacheKey('artists', { _id: id });
    
    // Fetch with cache
    const artist = await withDbCache(
      cacheKey,
      () => Artist.findById(id),
      { ttl: 10 * 60 * 1000 } // 10 minutes TTL
    );
    
    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      );
    }
    
    // Create response with cache headers
    const response = NextResponse.json(artist);
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=600, stale-while-revalidate=1200'
    );
    
    return response;
  } catch (error) {
    console.error('Error fetching artist:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Helper function to get plan amount
function getPlanPrice(planType) {
  switch (planType) {
    case 'basic': return 9.99;
    case 'pro': return 19.99;
    case 'premium': return 29.99;
    case 'aoc': return 39.99;
    default: return 0;
  }
} 