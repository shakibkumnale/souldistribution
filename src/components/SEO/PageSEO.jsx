import Head from 'next/head';
import { useRouter } from 'next/router';

export default function PageSEO({
  title,
  description,
  canonicalPath = '',
  ogType = 'website',
  ogImage = '/images/og-image.jpg',
  keywords = []
}) {
  const router = useRouter();
  const siteUrl = 'https://souldistribution.com';
  const canonicalUrl = canonicalPath ? `${siteUrl}${canonicalPath}` : `${siteUrl}${router.asPath}`;
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="Soul Distribution" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
    </Head>
  );
} 