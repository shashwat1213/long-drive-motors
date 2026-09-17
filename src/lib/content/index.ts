import { vehicles } from '@/data/vehicles';
import { faqs, financingPlanExamples } from '@/data/business';
import type { BodyType, FaqItem, FinancingPlanExample, Vehicle } from './types';

/**
 * Content access layer.
 *
 * Every getter is async even though it currently reads static mock data. This
 * is deliberate: it is the ONLY place the app talks to a data source, so
 * swapping mock data for a real inventory API / CMS in Phase 2 is a change
 * confined to this module — components and pages consume the same async API.
 */

export async function getAllVehicles(): Promise<Vehicle[]> {
  return vehicles;
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  return vehicles.find((v) => v.slug === slug) ?? null;
}

export async function getFeaturedVehicles(limit = 4): Promise<Vehicle[]> {
  return vehicles.filter((v) => v.isFeatured).slice(0, limit);
}

export async function getShowroomVehicles(): Promise<Vehicle[]> {
  return vehicles.filter((v) => Boolean(v.showroomStationId));
}

/** All slugs — used by generateStaticParams for the detail route. */
export async function getVehicleSlugs(): Promise<string[]> {
  return vehicles.map((v) => v.slug);
}

/** Distinct facet values for inventory filtering UI (Phase 6). */
export async function getInventoryFacets(): Promise<{
  makes: string[];
  bodyTypes: BodyType[];
  years: number[];
  priceRange: { min: number; max: number };
}> {
  const makes = Array.from(new Set(vehicles.map((v) => v.make))).sort();
  const bodyTypes = Array.from(new Set(vehicles.map((v) => v.bodyType))).sort() as BodyType[];
  const years = Array.from(new Set(vehicles.map((v) => v.year))).sort((a, b) => b - a);
  const prices = vehicles.map((v) => v.price);
  return {
    makes,
    bodyTypes,
    years,
    priceRange: { min: Math.min(...prices), max: Math.max(...prices) },
  };
}

export async function getFinancingPlanExamples(): Promise<FinancingPlanExample[]> {
  return financingPlanExamples;
}

export async function getFaqs(topic?: FaqItem['topic']): Promise<FaqItem[]> {
  return topic ? faqs.filter((f) => f.topic === topic) : faqs;
}

export type { Vehicle, FaqItem, FinancingPlanExample } from './types';
