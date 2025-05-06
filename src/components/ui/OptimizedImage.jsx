'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Optimized image component with performance enhancements:
 * - Proper image sizing and optimization
 * - Lazy loading with blur placeholders
 * - Fallback handling
 * - WebP/AVIF format support
 */
export default function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  priority = false,
  fallbackSrc = '/images/placeholder.jpg',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [loading, setLoading] = useState(!priority);
  const [isError, setIsError] = useState(false);

  // Reset state when src changes
  useEffect(() => {
    setImgSrc(src);
    setIsError(false);
    setLoading(!priority);
  }, [src, priority]);

  // Handle image load error
  const handleError = () => {
    setIsError(true);
    setImgSrc(fallbackSrc);
  };

  // Handle image load success
  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div 
      className={cn(
        'relative overflow-hidden bg-gray-100 dark:bg-gray-800',
        loading && 'animate-pulse',
        className
      )}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        sizes={sizes}
        onError={handleError}
        onLoad={handleLoad}
        className={cn(
          'object-cover transition-opacity duration-300',
          isError ? 'grayscale opacity-60' : 'grayscale-0',
          loading ? 'opacity-0' : 'opacity-100'
        )}
        style={{
          width: '100%',
          height: '100%'
        }}
        {...props}
      />
    </div>
  );
} 