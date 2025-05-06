/**
 * Database cache utility to reduce database load
 * This implements a local memory cache for database queries
 */

// Memory cache with TTL
const cache = new Map();

/**
 * Get data from cache or execute database query
 * @param {string} key - Cache key
 * @param {Function} queryFn - Function that returns a database query promise
 * @param {Object} options - Cache options
 * @returns {Promise<any>} - Query result
 */
export async function withDbCache(key, queryFn, options = {}) {
  const { ttl = 5 * 60 * 1000, lean = true } = options; // Default TTL: 5 minutes
  const now = Date.now();
  
  // Check if data is in cache and not expired
  if (cache.has(key)) {
    const { data, expiry } = cache.get(key);
    if (now < expiry) {
      return data;
    }
  }
  
  // Execute query (with lean optimization if requested)
  const query = queryFn();
  const result = lean && typeof query.lean === 'function' 
    ? await query.lean() 
    : await query;
  
  // Store in cache
  cache.set(key, {
    data: result,
    expiry: now + ttl
  });
  
  return result;
}

/**
 * Invalidate a specific cache key
 * @param {string} key - Cache key to invalidate
 */
export function invalidateDbCache(key) {
  cache.delete(key);
}

/**
 * Invalidate all cache entries that match a pattern
 * @param {RegExp} pattern - Regex pattern to match cache keys
 */
export function invalidateDbCacheByPattern(pattern) {
  for (const key of cache.keys()) {
    if (pattern.test(key)) {
      cache.delete(key);
    }
  }
}

/**
 * Clear the entire cache
 */
export function clearDbCache() {
  cache.clear();
}

/**
 * Generate a cache key for a database query
 * @param {string} collection - Collection name
 * @param {Object} query - Query parameters
 * @param {Object} options - Query options (sort, limit, etc.)
 * @returns {string} - Cache key
 */
export function generateDbCacheKey(collection, query = {}, options = {}) {
  const normalizedQuery = JSON.stringify(query);
  const normalizedOptions = JSON.stringify(options);
  return `${collection}:${normalizedQuery}:${normalizedOptions}`;
} 