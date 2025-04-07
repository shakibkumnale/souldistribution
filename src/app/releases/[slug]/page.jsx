// src/app/releases/[slug]/page.jsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Music, Play, Disc3, Calendar, ExternalLink } from 'lucide-react';
import MediaPlayer from '@/components/releases/MediaPlayer';
import connectToDatabase from '@/lib/db';
import Release from '@/models/Release';
import Artist from '@/models/Artist';
import { formatDate } from '@/lib/utils';
import ReleaseDetails from '@/components/releases/ReleaseDetails';
import { serializeMongoDB } from '@/lib/utils';
import { FullPageLoader } from '@/components/ui/LoadingSpinner';
import { FullPageError } from '@/components/ui/ErrorDisplay';
import { Suspense } from 'react';

export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const releases = await Release.find({}).select('slug').lean();
    
    return releases.map(release => ({
      slug: release.slug,
    }));
  } catch (error) {
    console.error('Error generating paths:', error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectToDatabase();
  const release = await Release.findOne({ slug })
    .populate('artists');

  if (!release) {
    return {
      title: 'Release Not Found',
    };
  }

  const artistName = release.artists && release.artists.length > 0 
    ? release.artists[0].name 
    : 'Unknown Artist';

  const imageUrl = release.coverImage || '/default-release-cover.jpg';
  const releaseDate = new Date(release.releaseDate).toISOString();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://souldistribution.com';
  const canonicalUrl = `${baseUrl}/releases/${slug}`;

  // Generate structured data for music
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: release.title,
    byArtist: {
      '@type': 'MusicGroup',
      name: artistName,
    },
    duration: `PT${Math.floor(release.duration_ms / 1000)}S`,
    image: imageUrl,
    datePublished: releaseDate,
    isrcCode: release.isrc,
    url: canonicalUrl,
    inAlbum: {
      '@type': 'MusicAlbum',
      name: release.title,
    },
    ...(release.spotifyUrl && {
      potentialAction: {
        '@type': 'ListenAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `https://open.spotify.com/track/${release.spotifyUrl}`,
          actionPlatform: 'http://schema.org/DesktopWebPlatform',
        },
      },
    }),
  };

  return {
    title: `${release.title} by ${artistName} | Soul Distribution`,
    description: release.description || `Listen to ${release.title} by ${artistName}`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${release.title} by ${artistName}`,
      description: release.description || `Stream ${release.title} on all major platforms`,
      type: 'music.song',
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${release.title} cover art`,
        },
      ],
      music: {
        duration: release.duration_ms,
        album: release.title,
        musician: artistName,
        releaseDate: releaseDate,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: `${release.title} by ${artistName}`,
      description: release.description || `Stream ${release.title} on all major platforms`,
      images: [imageUrl],
    },
    other: {
      'music:musician': artistName,
      'music:album': release.title,
      'music:release_date': releaseDate,
      'music:duration': release.duration_ms,
    },
  };
}

async function getReleaseData(slug) {
    await connectToDatabase();
  const release = await Release.findOne({ slug })
    .populate('artists')
    .lean();
    
    if (!release) {
      return null;
    }
    
  // Get artist from the populated artists array
  const artist = release.artists && release.artists.length > 0 ? release.artists[0] : null;

  // Get more releases from the same artist if we have an artist
  let moreReleases = [];
  if (artist) {
    moreReleases = await Release.find({
      artists: artist._id,
      _id: { $ne: release._id } 
    })
      .sort({ releaseDate: -1 })
      .limit(4)
      .populate('artists')
      .lean();
  }
    
    return {
    release: serializeMongoDB(release),
    moreReleases: serializeMongoDB(moreReleases)
  };
}

export default async function ReleasePage({ params }) {
  const { slug } = await params;
  return (
    <Suspense fallback={<FullPageLoader text="Loading release..." variant="disc" />}>
      <ReleasePageContent slug={slug} />
    </Suspense>
  );
}

async function ReleasePageContent({ slug }) {
  try {
    const data = await getReleaseData(slug);
    
    if (!data) {
      return <FullPageError errorType="release_not_found" />;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://souldistribution.com';
    const canonicalUrl = `${baseUrl}/releases/${slug}`;

    // Generate JSON-LD data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'MusicRecording',
      name: data.release.title,
      byArtist: {
        '@type': 'MusicGroup',
        name: data.release.artists[0]?.name || 'Unknown Artist',
      },
      duration: `PT${Math.floor(data.release.duration_ms / 1000)}S`,
      image: data.release.coverImage,
      datePublished: new Date(data.release.releaseDate).toISOString(),
      isrcCode: data.release.isrc,
      url: canonicalUrl,
    };
    
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ReleaseDetails release={data.release} moreReleases={data.moreReleases} />
      </>
    );
  } catch (error) {
    console.error('Error loading release:', error);
    return <FullPageError errorType="server" />;
  }
}