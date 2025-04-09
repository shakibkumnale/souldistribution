import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Artist from '@/models/Artist';
import { fetchArtistFromSpotify } from '@/lib/api';

// Get all artists
export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const fetchAll = searchParams.get('fetchAll') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Create base query
    let artistsQuery = Artist.find({})
      .sort({ createdAt: -1 })
      .select('name slug image spotifyData.genres spotifyData.images spotifyData.followers plans paymentHistory');
    
    // Only apply pagination if not fetching all
    if (!fetchAll) {
      artistsQuery = artistsQuery.skip(skip).limit(limit);
    }
    
    const artists = await artistsQuery;
    const total = await Artist.countDocuments({});
    
    return NextResponse.json({
      artists,
      pagination: {
        total,
        pages: fetchAll ? 1 : Math.ceil(total / limit),
        page: fetchAll ? 1 : page,
        limit: fetchAll ? total : limit
      }
    });
  } catch (error) {
    console.error('Error fetching artists:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Create a new artist
export async function POST(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Fetch artist data from Spotify if spotifyArtistId is provided
    if (body.spotifyArtistId) {
      try {
        // Use the updated fetch function that handles token acquisition
        const spotifyData = await fetchArtistFromSpotify(body.spotifyArtistId);
        
        // Update the artist data with Spotify information
        body.name = body.name || spotifyData.name;
        body.spotifyData = {
          followers: spotifyData.followers.total,
          genres: spotifyData.genres,
          popularity: spotifyData.popularity,
          images: spotifyData.images,
          external_urls: spotifyData.external_urls,
          uri: spotifyData.uri
        };
        
        // Use the first Spotify image if no image is provided
        if (!body.image && spotifyData.images && spotifyData.images.length > 0) {
          body.image = spotifyData.images[0].url;
        }
        
        // Set default slug from Spotify name if not provided
        if (!body.slug && spotifyData.name) {
          body.slug = spotifyData.name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .trim();
        }
        
        // Set Spotify URL if not provided
        if (!body.spotifyUrl && spotifyData.external_urls && spotifyData.external_urls.spotify) {
          body.spotifyUrl = spotifyData.external_urls.spotify;
        }
      } catch (error) {
        console.error('Error fetching from Spotify:', error);
        // Continue with artist creation even if Spotify fetch fails
      }
    }
    
    // Initialize payment history if adding plans but no payment history
    if (body.plans && body.plans.length > 0 && (!body.paymentHistory || body.paymentHistory.length === 0)) {
      body.paymentHistory = body.plans.map(plan => ({
        plan: plan.type,
        amount: getPlanAmount(plan.type),
        status: 'pending',
        date: new Date(),
        paymentMethod: 'credit_card'
      }));
    }
    
    const artist = await Artist.create(body);
    
    return NextResponse.json(artist, { status: 201 });
  } catch (error) {
    console.error('Error creating artist:', error);
    
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
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'An artist with this slug already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Helper function to get plan amount
function getPlanAmount(planType) {
  switch (planType) {
    case 'basic': return 99;
    case 'pro': return 599;
    case 'premium': return 1199;
    case 'aoc': return 499;
    default: return 0;
  }
} 