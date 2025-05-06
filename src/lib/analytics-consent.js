/**
 * Utility functions for managing analytics consent (GDPR compliance)
 */

const CONSENT_COOKIE_NAME = 'analytics-consent';
const CONSENT_EXPIRY_DAYS = 365; // Consent valid for 1 year

/**
 * Check if the user has given consent for analytics
 * @returns {boolean} - Whether the user has consented
 */
export function hasAnalyticsConsent() {
  if (typeof window === 'undefined') return false;
  
  // Check for consent cookie
  const cookie = getCookie(CONSENT_COOKIE_NAME);
  return cookie === 'true';
}

/**
 * Set analytics consent choice
 * @param {boolean} hasConsent - Whether consent is given
 */
export function setAnalyticsConsent(hasConsent) {
  if (typeof window === 'undefined') return;
  
  if (hasConsent) {
    // Set consent cookie with 1 year expiry
    setCookie(CONSENT_COOKIE_NAME, 'true', CONSENT_EXPIRY_DAYS);
    
    // Enable analytics if consent given
    enableAnalytics();
  } else {
    // If consent denied, remove the cookie
    removeCookie(CONSENT_COOKIE_NAME);
    
    // Disable analytics
    disableAnalytics();
  }
}

/**
 * Enable Google Analytics
 */
function enableAnalytics() {
  // Load Google Analytics if it's not already loaded
  if (typeof window.gtag === 'undefined') {
    // Create script element
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=GA-MEASUREMENT-ID';
    document.head.appendChild(script);
    
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', 'GA-MEASUREMENT-ID');
  }
}

/**
 * Disable Google Analytics
 */
function disableAnalytics() {
  // Remove any tracking cookies
  document.cookie.split('; ').forEach(cookie => {
    if (cookie.startsWith('_ga') || cookie.startsWith('_gid') || cookie.startsWith('_gat')) {
      const name = cookie.split('=')[0];
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });
  
  // Reset dataLayer
  if (window.dataLayer) {
    window.dataLayer = [];
  }
}

/**
 * Helper function to get a cookie value
 * @param {string} name - Cookie name
 * @returns {string|null} - Cookie value or null if not found
 */
function getCookie(name) {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

/**
 * Helper function to set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Days until expiry
 */
function setCookie(name, value, days) {
  if (typeof document === 'undefined') return;
  
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/;SameSite=Lax`;
}

/**
 * Helper function to remove a cookie
 * @param {string} name - Cookie name to remove
 */
function removeCookie(name) {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
} 