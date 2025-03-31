// src/app/releases/[slug]/page.jsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Music, Play, Disc3, Calendar, ExternalLink } from 'lucide-react';
import MediaPlayer from '@/components/releases/MediaPlayer';
import { connectToDatabase } from '@/lib/mongodb';
import Release from '@/models/Release';
import Artist from '@/models/Artist';
import { formatDate } from '@/lib/utils';
import ReleaseDetails from '@/components/releases/ReleaseDetails';
import { serializeMongoDB } from '@/lib/utils';
import { formatPageMetadata } from '@/lib/seoUtils';
import { generateReleaseSchema, generateBreadcrumbSchema } from '@/lib/seoUtils';
import Script from 'next/script';

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
  await connectToDatabase();
  const release = await Release.findOne({ slug: params.slug })
    .populate('artists');

  if (!release) {
    return {
      title: 'Release Not Found',
    };
  }

  const artistName = release.artists && release.artists.length > 0 
    ? release.artists[0].name 
    : 'Unknown Artist';

  // Get structured metadata with proper image handling
  return formatPageMetadata({
    title: `${release.title} by ${artistName}`,
    description: release.description || `Listen to ${release.title} by ${artistName} on all major streaming platforms. Distributed by Soul Distribution.`,
    path: `/releases/${params.slug}`,
    image: release.coverImage || '/images/og-image.jpg',
    type: 'music.song',
    keywords: ['music release', 'song', artistName, release.title, 'music distribution', release.genre].filter(Boolean)
  });
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
  const data = await getReleaseData(params.slug);
  
  if (!data) {
    notFound();
  }

  const release = data.release;
  const artistName = release.artists && release.artists.length > 0 
    ? (typeof release.artists[0] === 'object' ? release.artists[0].name : 'Unknown Artist') 
    : 'Unknown Artist';
  
  // Create structured data for the release
  const releaseSchema = generateReleaseSchema({
    title: release.title,
    artistName: artistName,
    releaseDate: release.releaseDate,
    artwork: release.coverImage,
    isrc: release.isrc,
    albumTitle: release.type === 'Album' ? release.title : undefined
  });

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://souldistribution.com' },
    { name: 'Releases', url: 'https://souldistribution.com/releases' },
    { name: release.title, url: `https://souldistribution.com/releases/${params.slug}` }
  ]);
  
  return (
    <>
      <ReleaseDetails release={release} moreReleases={data.moreReleases} />
      
      {/* Structured data for music release */}
      <Script id="release-schema" type="application/ld+json">
        {JSON.stringify(releaseSchema)}
      </Script>
      
      {/* Breadcrumb structured data */}
      <Script id="breadcrumb-schema" type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
    </>
  );
}