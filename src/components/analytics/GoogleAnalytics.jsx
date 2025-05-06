'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { hasAnalyticsConsent } from '@/lib/analytics-consent';

export default function GoogleAnalytics({ measurementId = 'GA-MEASUREMENT-ID' }) {
  // Track consent state
  const [hasConsent, setHasConsent] = useState(false);
  
  useEffect(() => {
    // Check for consent on component mount
    setHasConsent(hasAnalyticsConsent());
  }, []);
  
  // Only render the script if the user has given consent
  if (!hasConsent) {
    return null;
  }
  
  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="ga-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
} 