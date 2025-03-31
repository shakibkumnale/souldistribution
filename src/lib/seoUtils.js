// src/lib/seoUtils.js

// Generate schema.org structured data for music releases
export function generateReleaseSchema(release) {
  if (!release) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: release.title,
    byArtist: {
      '@type': 'MusicGroup',
      name: release.artistName
    },
    datePublished: release.releaseDate,
    image: release.artwork,
    isrcCode: release.isrc,
    inAlbum: {
      '@type': 'MusicAlbum',
      name: release.albumTitle || release.title
    }
  };
}

// Generate schema.org structured data for artists
export function generateArtistSchema(artist) {
  if (!artist) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: artist.name,
    description: artist.bio,
    image: artist.image,
    url: `https://souldistribution.com/artists/${artist.slug}`,
    sameAs: [
      artist.spotifyUrl,
      artist.instagramUrl,
      artist.youtubeUrl
    ].filter(Boolean)
  };
}

// Generate schema.org structured data for service plans
export function generateServiceSchema(service) {
  if (!service) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${service.name} Music Distribution Plan`,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: 'Soul Distribution',
      url: 'https://souldistribution.com'
    },
    offers: {
      '@type': 'Offer',
      price: service.price.replace('₹', ''),
      priceCurrency: 'INR',
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock'
    }
  };
}

// Generate breadcrumb schema
export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

// Format metadata for dynamic pages
export function formatPageMetadata({ 
  title, 
  description, 
  path = '', 
  image = null,
  type = 'website'
}) {
  const baseUrl = 'https://souldistribution.com';
  const imageUrl = image || `${baseUrl}/images/og-image.jpg`;
  
  return {
    title: `${title} | Soul Distribution`,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}${path}`,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl]
    },
    alternates: {
      canonical: `${baseUrl}${path}`
    }
  };
} 