'use client';

import { useState, useEffect } from 'react';
import { hasAnalyticsConsent, setAnalyticsConsent } from '@/lib/analytics-consent';
import dynamic from 'next/dynamic';

// Dynamically import the AnalyticsScript component
// This ensures it only loads on the client side
const AnalyticsScript = dynamic(() => import('./AnalyticsScript'), {
  ssr: false,
});

export default function ConsentBanner() {
  // Track whether banner should be shown
  const [showBanner, setShowBanner] = useState(false);
  // Track consent status
  const [hasConsent, setHasConsent] = useState(false);
  
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      // Check for existing consent
      const consentGiven = hasAnalyticsConsent();
      setHasConsent(consentGiven);
      setShowBanner(!consentGiven);
    }
  }, []);
  
  // Handle accept/decline actions
  const handleAccept = () => {
    setAnalyticsConsent(true);
    setHasConsent(true);
    setShowBanner(false);
  };
  
  const handleDecline = () => {
    setAnalyticsConsent(false);
    setHasConsent(false);
    setShowBanner(false);
  };
  
  return (
    <>
      {/* Conditionally render analytics script based on consent */}
      {hasConsent && <AnalyticsScript />}
      
      {/* Only show banner if needed */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
          <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm">
                We use cookies to improve your experience and analyze website traffic. 
                By clicking "Accept", you consent to our website's use of cookies for analytics purposes.
                You can learn more in our <a href="/privacy" className="underline">Privacy Policy</a>.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDecline}
                className="px-4 py-2 text-sm bg-transparent border border-gray-500 rounded hover:bg-gray-800"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 text-sm bg-blue-600 rounded hover:bg-blue-700"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 