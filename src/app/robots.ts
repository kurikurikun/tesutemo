import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    // Nothing is disallowed on purpose: the pages we want kept out of the index
    // (prototypes, mockups, /lite app screens) carry meta robots noindex, and
    // Google can only honour that if it is allowed to crawl the page.
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://www.tesutemo.co/sitemap.xml',
  };
}
