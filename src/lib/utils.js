import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Combine classes and handle Tailwind conflicts
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format date to display format
export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Truncate text to specified length
export function truncateText(text, length = 100) {
  if (!text || text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

// Generate placeholder image URL based on text
export function getPlaceholderImage(text, size = '400x400') {
  const [width, height] = size.split('x');
  return `/api/placeholder/${width}/${height}?text=${encodeURIComponent(text)}`;
}

// Format number with commas (e.g., 1000 -> 1,000)
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Check if URL is valid
export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

// Generate a URL-friendly slug from a string
export function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')    // Remove all non-word characters
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

/**
 * Serialize MongoDB objects to plain JavaScript objects
 * This function recursively converts ObjectIds to strings,
 * and handles Date objects, nested arrays and objects
 */
export function serializeMongoDB(obj) {
  // Handle null/undefined
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // Handle Date objects
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => serializeMongoDB(item));
  }
  
  // Handle objects
  if (typeof obj === 'object') {
    // Check if it's an ObjectId (has _bsontype or matches ObjectID pattern)
    if (obj._bsontype === 'ObjectID' || 
        obj.constructor?.name === 'ObjectID' || 
        (obj.id && obj.toString && Object.keys(obj).length === 2)) {
      return obj.toString();
    }
    
    // Handle regular objects with properties
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip MongoDB/Mongoose internal properties and functions
      if (typeof value !== 'function' && !key.startsWith('$') && key !== '_doc') {
        result[key] = serializeMongoDB(value);
      }
    }
    return result;
  }
  
  // Return primitives as is
  return obj;
}