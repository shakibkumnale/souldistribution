/**
 * Custom image loader that optimizes handling of Spotify and other external images
 * This improves SEO by providing better image optimization
 * 
 * @param {Object} options - Image loading options
 * @param {string} options.src - Image source URL
 * @param {number} options.width - Requested image width
 * @param {number} options.quality - Image quality (1-100)
 * @returns {string} - Optimized image URL
 */
export default function customImageLoader({ src, width, quality = 75 }) {
  // Handle Spotify images specially
  if (src.includes('i.scdn.co')) {
    // Parse the Spotify image URL to extract the ID
    const spotifyImgId = src.split('/').pop().split('?')[0];
    
    // For Spotify Web API image patterns
    if (spotifyImgId && spotifyImgId.length === 32) {
      return `https://i.scdn.co/image/${spotifyImgId}`;
    }
    
    // For normal image optimization
    return `${src}?w=${width}&q=${quality || 75}`;
  }
  
  // Handle relative URLs through Next.js's default image optimization
  if (src.startsWith('/')) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
  }
  
  // For all other images, use default behavior
  return `${src}?w=${width}&q=${quality || 75}`;
} 