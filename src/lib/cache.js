/**
 * Cache utility for implementing SWR (stale-while-revalidate) pattern
 * This helps reduce API calls and improve performance
 */

// Memory cache store
const CACHE = new Map();

// Default cache TTL in milliseconds (10 minutes)
const DEFAULT_CACHE_TTL = 10 * 60 * 1000;

/**
 * Get data from cache or fetch from API
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Function to fetch data if cache miss or stale
 * @param {number} ttl - Time to live in milliseconds
 * @returns {Promise<any>} - Cached or fresh data
 */
export async function getWithCache(key, fetchFn, ttl = DEFAULT_CACHE_TTL) {
  const now = Date.now();
  const cachedData = CACHE.get(key);

  // Return from cache if still fresh
  if (cachedData && now < cachedData.expiry) {
    return cachedData.data;
  }

  try {
    // SWR pattern: Return stale data immediately while revalidating in the background
    const staleData = cachedData?.data;
    
    // Fetch fresh data
    const freshData = await fetchFn();
    
    // Update cache with fresh data
    CACHE.set(key, {
      data: freshData,
      expiry: now + ttl
    });
    
    // Return fresh data if no stale data exists
    return freshData;
  } catch (error) {
    // On error, use stale data if available or throw the error
    if (cachedData) {
      console.error('Error refreshing cache, using stale data:', error);
      return cachedData.data;
    }
    throw error;
  }
}

/**
 * Manually set cache data
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttl - Time to live in milliseconds
 */
export function setCache(key, data, ttl = DEFAULT_CACHE_TTL) {
  CACHE.set(key, {
    data,
    expiry: Date.now() + ttl
  });
}

/**
 * Clear a specific cache entry
 * @param {string} key - Cache key to clear
 */
export function clearCache(key) {
  CACHE.delete(key);
}

/**
 * Clear all cache entries
 */
export function clearAllCache() {
  CACHE.clear();
}

/**
 * Generate a cache key from API endpoint and parameters
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {string} - Cache key
 */
export function generateCacheKey(endpoint, params = {}) {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  return `${endpoint}${sortedParams ? `?${sortedParams}` : ''}`;
} 