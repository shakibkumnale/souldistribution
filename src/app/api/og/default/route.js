import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export async function GET() {
  try {
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
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <div
              style={{
                fontSize: 80,
                fontWeight: 'bold',
                backgroundImage: 'linear-gradient(90deg, #8b5cf6, #d946ef)',
                backgroundClip: 'text',
                color: 'transparent',
                marginBottom: 20,
              }}
            >
              Soul Distribution
            </div>
            <div
              style={{
                fontSize: 36,
                color: 'white',
                textAlign: 'center',
                maxWidth: '80%',
                marginTop: 20,
              }}
            >
              Music Distribution & YouTube Monetization Services
            </div>
          </div>
          
          <div
            style={{
              fontSize: 24,
              color: '#a1a1aa',
              position: 'absolute',
              bottom: 50,
              textAlign: 'center',
            }}
          >
            Helping independent artists distribute music worldwide
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