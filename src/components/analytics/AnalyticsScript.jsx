'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function AnalyticsScript({ measurementId = 'GA-MEASUREMENT-ID' }) {
  return (
    <>
      {/* Use next/script with strategy="afterInteractive" - no onLoad prop */}
      <Script 
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
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