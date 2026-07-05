import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/campus-voices.html' },
    sitemap: 'https://www.tesutemo.co/sitemap.xml',
  };
}
