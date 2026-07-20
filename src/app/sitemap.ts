import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.tesutemo.co';
  return [
    { url: baseUrl, lastModified: new Date('2026-03-28'), changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/recruitment`, lastModified: new Date('2026-03-28'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/university`, lastModified: new Date('2026-03-28'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/municipality`, lastModified: new Date('2026-03-28'), changeFrequency: 'monthly', priority: 0.8 },
    // /case-study + /en/case-study omitted while noindexed (pending Comas approval).
    // English pages
    { url: `${baseUrl}/en`, lastModified: new Date('2026-03-31'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/en/recruitment`, lastModified: new Date('2026-03-31'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/en/university`, lastModified: new Date('2026-03-31'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/en/municipality`, lastModified: new Date('2026-03-31'), changeFrequency: 'monthly', priority: 0.7 },
  ];
}
