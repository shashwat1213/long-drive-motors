import type { Metadata } from 'next';
import { siteMeta, siteUrl } from '@/config/site';

/**
 * SEO metadata foundation.
 * `defaultMetadata` is applied in the root layout; `buildMetadata` composes
 * per-page titles, descriptions, canonicals, and Open Graph/Twitter cards.
 */

const DEFAULT_OG_IMAGE = '/placeholders/og-default.svg';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteMeta.name} — Immersive Pre-Owned Vehicle Showroom`,
    template: `%s | ${siteMeta.name}`,
  },
  description: siteMeta.description,
  applicationName: siteMeta.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: siteMeta.name,
    title: `${siteMeta.name} — Immersive Pre-Owned Vehicle Showroom`,
    description: siteMeta.description,
    url: siteUrl,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: siteMeta.name }],
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteMeta.name} — Immersive Pre-Owned Vehicle Showroom`,
    description: siteMeta.description,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

interface BuildMetadataArgs {
  title: string;
  description: string;
  /** Path (e.g. "/inventory") — resolved to an absolute canonical URL. */
  path: string;
  image?: string;
  /** Set true on interactive/utility pages that shouldn't be indexed. */
  noindex?: boolean;
  /** When true, `title` is used verbatim (skips the "%s | brand" template). */
  absoluteTitle?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  noindex = false,
  absoluteTitle = false,
}: BuildMetadataArgs): Metadata {
  const canonical = path === '/' ? '/' : path;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${canonical}`,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { title, description, images: [image] },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
