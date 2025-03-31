// src/app/artists/[slug]/page.jsx
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import Artist from '@/models/Artist';
import Release from '@/models/Release';
import ArtistProfile from '@/components/artists/ArtistProfile';
import { serializeMongoDB } from '@/lib/utils';
import { formatPageMetadata } from '@/lib/seoUtils';
import Script from 'next/script';
import { generateArtistSchema, generateBreadcrumbSchema } from '@/lib/seoUtils';

export async function generateMetadata({ params }) {
  await connectToDatabase();
  const artist = await Artist.findOne({ slug: params.slug });
  
  if (!artist) {
    return {
      title: 'Artist Not Found',
    };
  }
  
  const artistImage = artist.image || null;
  
  return formatPageMetadata({
    title: artist.name,
    description: artist.bio || `Official artist page for ${artist.name}. Listen to music and get the latest releases from ${artist.name} on Soul Distribution.`,
    path: `/artists/${params.slug}`,
    image: artistImage,
    type: 'profile'
  });
}

// Generate static paths for frequently visited artist pages
export async function generateStaticParams() {
  await connectToDatabase();
  const popularArtists = await Artist.find({ isPopular: true }).limit(10).lean();
  
  return popularArtists.map(artist => ({
    slug: artist.slug
  }));
}

async function getArtistData(slug) {
  const MAX_RETRIES = 3;
  const QUERY_OPTIONS = { maxTimeMS: 30000 };
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await connectToDatabase();
      
      const artist = await Artist.findOne({ slug })
        .lean()
        .select('name bio image slug')
        .setOptions(QUERY_OPTIONS);

      if (!artist) {
        return null;
      }

      const releases = await Release.find({ artists: artist._id })
        .lean()
        .select('title releaseDate artwork')
        .sort({ releaseDate: -1 })
        .populate('artists', 'name')
        .setOptions(QUERY_OPTIONS);

      console.log(`[Attempt ${attempt}] Found artist and ${releases?.length || 0} releases`);

      return {
        artist: serializeMongoDB(artist),
        releases: serializeMongoDB(releases || [])
      };
    } catch (error) {
      console.error(`[Attempt ${attempt}] Error:`, {
        message: error.message,
        slug,
        attempt
      });
      
      if (attempt === MAX_RETRIES) {
        return null;
      }
      
      const backoff = Math.min(1000 * Math.pow(2, attempt), 10000);
      await new Promise(resolve => setTimeout(resolve, backoff));
    }
  }
  return null;
}

export default async function ArtistPage({ params }) {
  const data = await getArtistData(params.slug);
  
  if (!data) {
    notFound();
  }
  
  const artistSchema = generateArtistSchema(data.artist);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://souldistribution.com' },
    { name: 'Artists', url: 'https://souldistribution.com/artists' },
    { name: data.artist.name, url: `https://souldistribution.com/artists/${params.slug}` }
  ]);
  
  return (
    <>
      <ArtistProfile artist={data.artist} releases={data.releases} />
      
      {/* Structured data for artist */}
      <Script id="artist-schema" type="application/ld+json">
        {JSON.stringify(artistSchema)}
      </Script>
      
      {/* Breadcrumb structured data */}
      <Script id="breadcrumb-schema" type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
    </>
  );
}