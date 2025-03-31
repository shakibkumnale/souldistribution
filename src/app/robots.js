export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/login/',
          '/unauthorized/',
          '/api/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/login/',
          '/unauthorized/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://souldistribution.com/sitemap.xml',
    host: 'https://souldistribution.com',
  };
} 