/**
 * Site-wide configuration and dealership information.
 *
 * Business contact details below are the real Long Drive Motors particulars.
 * Sample inventory remains illustrative demonstration data. The data shapes
 * mirror what a CMS / business-profile API would return, so they can be
 * swapped for a live source without touching components.
 */

export interface DealershipHours {
  day: string;
  open: string;
  close: string;
}

export interface DealershipInfo {
  legalName: string;
  displayName: string;
  tagline: string;
  address: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
    countryCode: string;
  };
  phone: string;
  /** E.164 form for tel: links. */
  phoneHref: string;
  hours: DealershipHours[];
  /** Approximate geo derived from the street address, for map + schema. */
  geo: { lat: number; lng: number };
  serviceAreas: string[];
}

export const dealership: DealershipInfo = {
  legalName: 'Long Drive Motors',
  displayName: 'Long Drive Motors',
  tagline: 'Toronto\u2019s destination for hand-picked pre-owned vehicles.',
  address: {
    street: '3725 Lake Shore Blvd W',
    city: 'Toronto',
    region: 'ON',
    postalCode: 'M8W 1P9',
    country: 'Canada',
    countryCode: 'CA',
  },
  phone: '+1 437-298-5226',
  phoneHref: '+14372985226',
  hours: [
    { day: 'Monday', open: '10:00', close: '20:00' },
    { day: 'Tuesday', open: '10:00', close: '20:00' },
    { day: 'Wednesday', open: '10:00', close: '20:00' },
    { day: 'Thursday', open: '10:00', close: '20:00' },
    { day: 'Friday', open: '10:00', close: '19:00' },
    { day: 'Saturday', open: '09:45', close: '19:00' },
    { day: 'Sunday', open: '11:00', close: '18:00' },
  ],
  // Approximate coordinates for 3725 Lake Shore Blvd W, Toronto.
  geo: { lat: 43.5965, lng: -79.5074 },
  serviceAreas: ['Toronto', 'Etobicoke', 'Mississauga', 'Brampton', 'Oakville', 'GTA'],
};

/** Full one-line address string for maps / directions links. */
export const fullAddress = dealership.address.street + ', ' + dealership.address.city + ', ' + dealership.address.region + ' ' + dealership.address.postalCode + ', ' + dealership.address.country;

/** Google Maps directions + embed URLs (no API key required). */
export const directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(fullAddress);
export const mapEmbedUrl = 'https://www.google.com/maps?q=' + encodeURIComponent(fullAddress) + '&output=embed';

/**
 * The canonical origin for this deployment.
 *
 * Every canonical link, Open Graph URL and sitemap entry is built from this, so
 * getting it wrong is not cosmetic: an origin of localhost tells search engines
 * that every page on the site lives on a machine they cannot reach.
 *
 * `NEXT_PUBLIC_SITE_URL` stays the explicit override — set it to the real
 * domain. When it is missing, Vercel's own project production domain is used
 * rather than falling straight through to localhost, which keeps a deployed
 * site indexable even if nobody remembers to set the variable. Localhost
 * remains the last resort, where it is actually correct: local development.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  // Vercel injects this at build and run time: the project's stable production
  // domain, identical across preview and production deployments — which is
  // exactly what a canonical URL should point at.
  const vercelProduction = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) return `https://${vercelProduction.replace(/\/$/, '')}`;

  return 'http://localhost:3000';
}

export const siteUrl = resolveSiteUrl();

export const siteMeta = {
  name: 'Long Drive Motors',
  shortName: 'Long Drive',
  description:
    'Explore hand-picked pre-owned vehicles in an immersive 3D showroom. Browse inventory, arrange financing, value a trade-in, and book a test drive in Toronto.',
  /** Industry accreditations shown as trust signals. */
  trustBadges: [
    { id: 'carfax', label: 'CARFAX Canada', blurb: 'Vehicle history reports' },
    { id: 'omvic', label: 'OMVIC', blurb: 'Registered Ontario dealer' },
    { id: 'ucda', label: 'UCDA', blurb: 'Used Car Dealers Association' },
  ],
} as const;
