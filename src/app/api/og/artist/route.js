import { ImageResponse } from 'next/og';
import connectToDatabase from '@/lib/db';
import Artist from '@/models/Artist';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return new Response('Missing slug parameter', { status: 400 });
    }
    
    // Connect to DB and fetch the artist
    await connectToDatabase();
    const artist = await Artist.findOne({ slug }).lean();
    
    if (!artist) {
      return new Response('Artist not found', { status: 404 });
    }
    
    const profileImage = artist.profileImage || (artist.spotifyData?.images?.[0]?.url) || '/images/placeholder-artist.jpg';
    const name = artist.name;
    const genres = Array.isArray(artist.genres) && artist.genres.length > 0 
      ? artist.genres.join(', ') 
      : 'Artist';
    
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            fontSize: 48,
            background: 'linear-gradient(to bottom, #000000, #1a1a1a)',
            width: '100%',
            height: '100%',
            padding: 50,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              top: 30,
              left: 30,
              color: 'white',
              fontSize: 24,
              fontWeight: 'bold',
            }}
          >
            Soul Distribution
          </div>
          
          <div
            style={{
              display: 'flex',
              width: 300,
              height: 300,
              overflow: 'hidden',
              borderRadius: '50%',
              marginBottom: 40,
              marginTop: 40,
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
            }}
          >
            <img
              src={profileImage}
              alt={name}
              width={300}
              height={300}
              style={{ objectFit: 'cover' }}
            />
          </div>
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                margin: 0,
                lineHeight: 1.2,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              }}
            >
              {name}
            </h1>
            <h2
              style={{
                fontSize: 36,
                fontWeight: 'normal',
                margin: 0,
                marginTop: 16,
                color: '#d4d4d4',
              }}
            >
              {genres}
            </h2>
          </div>
          
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              fontSize: 24,
              color: '#a1a1aa',
            }}
          >
            View artist profile on souldistribution.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response(`Error generating image: ${error.message}`, { status: 500 });
  }
} 