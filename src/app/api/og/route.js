import { ImageResponse } from 'next/og';
import connectToDatabase from '@/lib/db';
import Release from '@/models/Release';

export const runtime = 'edge';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return new Response('Missing slug parameter', { status: 400 });
    }
    
    // Connect to DB and fetch the release
    await connectToDatabase();
    const release = await Release.findOne({ slug }).populate('artists').lean();
    
    if (!release) {
      return new Response('Release not found', { status: 404 });
    }
    
    const coverImage = release.coverImage || '/images/placeholder-cover.jpg';
    const title = release.title;
    const artistName = release.artists && release.artists.length > 0 
      ? release.artists[0].name 
      : 'Unknown Artist';
    
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
            justifyContent: 'center',
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
              width: 400,
              height: 400,
              overflow: 'hidden',
              borderRadius: 20,
              marginBottom: 40,
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
            }}
          >
            <img
              src={coverImage}
              alt={title}
              width={400}
              height={400}
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
                fontSize: 56,
                fontWeight: 'bold',
                margin: 0,
                lineHeight: 1.2,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              }}
            >
              {title}
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
              by {artistName}
            </h2>
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
    return new Response('Error generating image', { status: 500 });
  }
} 