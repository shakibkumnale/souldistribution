import Image from 'next/image';

/**
 * A reusable component for optimized release cover images
 * Provides proper SEO attributes and loading optimizations
 */
export default function OptimizedReleaseImage({
  src,
  alt,
  artistName,
  releaseName,
  priority = false,
  fill = false,
  width,
  height,
  className = '',
  sizes,
  loading,
  ...props
}) {
  // Generate SEO-friendly alt text if not provided
  const imageAlt = alt || `${releaseName || 'Release'} by ${artistName || 'Artist'}`;
  
  // Set default sizes if not provided and using fill
  const imageSizes = sizes || (fill 
    ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    : undefined);
  
  // Use appropriate image source with fallback
  const imageSrc = src || '/images/placeholder-cover.jpg';
  
  // Set loading strategy based on priority
  const loadingStrategy = loading || (priority ? 'eager' : 'lazy');
  
  return (
    <Image
      src={imageSrc}
      alt={imageAlt}
      className={`object-cover ${className}`}
      priority={priority}
      fill={fill}
      width={!fill ? (width || 300) : undefined}
      height={!fill ? (height || 300) : undefined}
      sizes={imageSizes}
      loading={loadingStrategy}
      fetchPriority={priority ? 'high' : 'auto'}
      itemProp="image"
      {...props}
    />
  );
} 