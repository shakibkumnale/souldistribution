import { connectToDatabase } from '@/lib/db';
import Release from '@/models/Release';
import Artist from '@/models/Artist';

export default async function sitemap() {
  try {
    await connectToDatabase();
    
    // Set a higher timeout for queries
    const queryOptions = {
      lean: true,
      maxTimeMS: 30000 // Increase timeout to 30 seconds
    };
    
    // Get all releases with pagination if needed
    const releaseLimit = 1000; // Set a reasonable limit
    const releases = await Release.find({}, null, queryOptions)
      .select('slug updatedAt')
      .limit(releaseLimit);
    
    // Get all artists with pagination if needed
    const artistLimit = 1000; // Set a reasonable limit
    const artists = await Artist.find({}, null, queryOptions)
      .select('slug updatedAt')
      .limit(artistLimit);
    
    // Base URL - replace with your actual domain
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://souldistribution.com';
    
    // Generate release URLs
    const releaseUrls = releases.map(release => ({
      url: `${baseUrl}/releases/${release.slug}`,
      lastModified: new Date(release.updatedAt || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
    
    // Generate artist URLs
    const artistUrls = artists.map(artist => ({
      url: `${baseUrl}/artists/${artist.slug}`,
      lastModified: new Date(artist.updatedAt || Date.now()),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
    
    // Static pages
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/releases`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/artists`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/services`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.4,
      },
      {
        url: `${baseUrl}/privacy`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.4,
      },
    ];
    
    return [...staticPages, ...releaseUrls, ...artistUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return just the static pages in case of database error
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://souldistribution.com';
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        priority: 1.0,
      },
      {
        url: `${baseUrl}/releases`,
        lastModified: new Date(),
        priority: 0.9,
      },
      {
        url: `${baseUrl}/artists`,
        lastModified: new Date(),
        priority: 0.9,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        priority: 0.6,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        priority: 0.6,
      },
    ];
  }
} 