// src/app/artists/[slug]/page.jsx
import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/db';
import Artist from '@/models/Artist';
import Release from '@/models/Release';
import ArtistProfile from '@/components/artists/ArtistProfile';
import { serializeMongoDB } from '@/lib/utils';
import { FullPageLoader } from '@/components/ui/LoadingSpinner';
import { FullPageError } from '@/components/ui/ErrorDisplay';
import { Suspense } from 'react';

// Define viewport separately from metadata
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectToDatabase();
  const artist = await Artist.findOne({ slug });
  
  if (!artist) {
    return {
      title: 'Artist Not Found',
    };
  }
  
  const imageUrl = artist.profileImage || '/default-artist-profile.jpg';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://souldistribution.com';
  const canonicalUrl = `${baseUrl}/artists/${slug}`;
  
  // Dynamic OG Image URL
  const ogImageUrl = `${baseUrl}/api/og/artist?slug=${slug}`;
  
  return {
    title: `${artist.name} | Soul Distribution`,
    description: artist.bio || `${artist.name} is an independent artist distributing music worldwide through Soul Distribution. Stream their releases on Spotify, Apple Music, and other platforms.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${artist.name} | Soul Distribution`,
      description: artist.bio || `Discover music by ${artist.name}`,
      type: 'profile',
      url: canonicalUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${artist.name} profile image`,
        },
      ],
      profile: {
        firstName: artist.name.split(' ')[0],
        lastName: artist.name.split(' ').slice(1).join(' '),
        username: artist.slug,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: `${artist.name} | Soul Distribution`,
      description: artist.bio || `Discover music by ${artist.name}`,
      images: [ogImageUrl],
    },
  };
}

async function getArtistData(slug) {
  await connectToDatabase();
  const artist = await Artist.findOne({ slug }).lean();
  
  if (!artist) {
    return null;
  }
  
  const releases = await Release.find({ artists: artist._id })
    .populate('artists')
    .sort({ releaseDate: -1 })
    .lean();
  
  console.log(`Found ${releases.length} releases for artist ${artist.name} (ID: ${artist._id})`);
  
  const releasesWithArtistInfo = releases.map(release => {
    return {
      ...release,
      artistName: artist.name
    };
  });
  
  return {
    artist: serializeMongoDB(artist),
    releases: serializeMongoDB(releasesWithArtistInfo)
  };
}

export default async function ArtistPage({ params }) {
  const { slug } = await params;
  return (
    <Suspense fallback={<FullPageLoader text="Loading artist..." variant="headphones" />}>
      <ArtistPageContent slug={slug} />
    </Suspense>
  );
}

async function ArtistPageContent({ slug }) {
  try {
    const data = await getArtistData(slug);
    
    if (!data) {
      return <FullPageError errorType="artist_not_found" />;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://souldistribution.com';
    const canonicalUrl = `${baseUrl}/artists/${slug}`;

    // Generate JSON-LD data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'MusicGroup',
      name: data.artist.name,
      description: data.artist.bio,
      image: data.artist.profileImage,
      url: canonicalUrl,
      sameAs: [
        ...(data.artist.spotifyUrl ? [`https://open.spotify.com/artist/${data.artist.spotifyUrl}`] : []),
        ...(data.artist.youtubeUrl ? [`https://youtube.com/channel/${data.artist.youtubeUrl}`] : []),
        ...(data.artist.instagramUrl ? [`https://instagram.com/${data.artist.instagramUrl}`] : []),
      ],
    };
    
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ArtistProfile artist={data.artist} releases={data.releases} />
      </>
    );
  } catch (error) {
    console.error('Error loading artist:', error);
    return <FullPageError errorType="server" />;
  }
}