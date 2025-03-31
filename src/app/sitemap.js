import { connectToDatabase } from '@/lib/mongodb';
import Artist from '@/models/Artist';
import Release from '@/models/Release';

// Base URL for the site
const baseUrl = 'https://souldistribution.com';

// Generate the sitemap data
export default async function sitemap() {
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/artists`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Get dynamic data for artists and releases
  try {
    await connectToDatabase();
    
    // Get all artists
    const artists = await Artist.find({}).lean();
    const artistsUrls = artists.map((artist) => ({
      url: `${baseUrl}/artists/${artist.slug}`,
      lastModified: artist.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
    
    // Get all releases
    const releases = await Release.find({}).lean();
    const releasesUrls = releases.map((release) => ({
      url: `${baseUrl}/releases/${release.slug}`,
      lastModified: release.updatedAt || new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
    
    // Combine all URLs
    return [...staticPages, ...artistsUrls, ...releasesUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
} 