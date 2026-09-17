import { dealership, fullAddress, siteMeta, siteUrl } from '@/config/site';
import type { FaqItem, Vehicle } from '@/lib/content/types';

/**
 * JSON-LD structured-data builders. Business schemas use the verified Long
 * Drive Motors contact details; Product/Vehicle, Breadcrumb, and FAQ schemas
 * describe the pages themselves.
 */

type JsonLd = Record<string, unknown>;

function postalAddress() {
  const { address } = dealership;
  return {
    '@type': 'PostalAddress',
    streetAddress: address.street,
    addressLocality: address.city,
    addressRegion: address.region,
    postalCode: address.postalCode,
    addressCountry: address.countryCode,
  };
}

function openingHours() {
  return dealership.hours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.day,
    opens: h.open,
    closes: h.close,
  }));
}

/** AutoDealer is a LocalBusiness subtype; a single node covers both. */
export function autoDealerSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    '@id': siteUrl + '/#dealer',
    name: dealership.legalName,
    description: siteMeta.description,
    url: siteUrl,
    telephone: dealership.phone,
    address: postalAddress(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: dealership.geo.lat,
      longitude: dealership.geo.lng,
    },
    hasMap: 'https://www.google.com/maps?q=' + encodeURIComponent(fullAddress),
    openingHoursSpecification: openingHours(),
    areaServed: dealership.serviceAreas,
    priceRange: '$$',
  };
}

export function organizationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteMeta.name,
    url: siteUrl,
    telephone: dealership.phone,
    address: postalAddress(),
  };
}

export function vehicleSchema(vehicle: Vehicle): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: vehicle.year + ' ' + vehicle.make + ' ' + vehicle.model + ' ' + vehicle.trim,
    vehicleModelDate: String(vehicle.year),
    brand: { '@type': 'Brand', name: vehicle.make },
    model: vehicle.model,
    bodyType: vehicle.bodyType,
    fuelType: vehicle.fuelType,
    vehicleTransmission: vehicle.transmission,
    driveWheelConfiguration: vehicle.drivetrain,
    color: vehicle.exteriorColor,
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: vehicle.mileageKm,
      unitCode: 'KMT',
    },
    itemCondition: 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CAD',
      price: vehicle.price,
      availability: 'https://schema.org/InStock',
      url: siteUrl + '/inventory/' + vehicle.slug,
      seller: { '@type': 'AutoDealer', name: dealership.legalName },
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: siteUrl + item.path,
    })),
  };
}

export function faqSchema(items: FaqItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}
