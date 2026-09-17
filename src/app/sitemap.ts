import type { MetadataRoute } from 'next';
import { siteUrl } from '@/config/site';
import { getVehicleSlugs } from '@/lib/content';

/** Generated sitemap. Detail pages are pulled from the content layer so new
 *  inventory automatically appears once a real feed is connected. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/showroom`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/inventory`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/financing`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/trade-in`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/test-drive`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const slugs = await getVehicleSlugs();
  const vehicleRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${siteUrl}/inventory/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
