import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Artist from '@/models/Artist';

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { slug } = params;
    
    const artist = await Artist.findOne({ slug });
    
    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(artist);
  } catch (error) {
    console.error('Error fetching artist by slug:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 