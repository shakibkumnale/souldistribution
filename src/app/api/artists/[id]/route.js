import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Artist from '@/models/Artist';

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
    
    return NextResponse.json({ message: 'Artist deleted successfully' });
  } catch (error) {
    console.error('Error deleting artist:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
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
    
    return NextResponse.json(artist);
  } catch (error) {
    console.error('Error updating artist:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Get artist by ID
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    
    const artist = await Artist.findById(id);
    
    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(artist);
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