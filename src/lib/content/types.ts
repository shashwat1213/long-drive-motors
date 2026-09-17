/**
 * Domain types for prototype content.
 *
 * These interfaces are the contract between the UI and the data source. Today
 * the source is static mock data (see /src/data). In Phase 2 the same shapes
 * can be returned by a real inventory API / CMS, so components never need to
 * change when the backend is connected.
 */

export type BodyType = 'Sedan' | 'Coupe' | 'Convertible' | 'SUV' | 'Mini-Van' | 'Pickup Truck';
export type FuelType = 'Gasoline' | 'Hybrid' | 'Electric' | 'Diesel';
export type Transmission = 'Automatic' | 'Manual' | 'Single-Speed';
export type Drivetrain = 'FWD' | 'RWD' | 'AWD' | '4WD';
export type Condition = 'Used' | 'Certified Pre-Owned';

export interface VehicleColor {
  name: string;
  /** Hex used for swatch UI and (later) 3D material tinting. */
  hex: string;
  /** Optional GLB variant/material key for the 3D viewer. */
  modelVariant?: string;
}

export interface VehicleSpec {
  label: string;
  value: string;
}

export interface VehicleImage {
  /** Path under /public (prototype placeholders) or a CDN URL later. */
  src: string;
  alt: string;
}

export interface Vehicle {
  slug: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  /** Price in CAD, integer dollars. */
  price: number;
  mileageKm: number;
  bodyType: BodyType;
  transmission: Transmission;
  fuelType: FuelType;
  drivetrain: Drivetrain;
  condition: Condition;
  exteriorColor: string;
  colors: VehicleColor[];
  images: VehicleImage[];
  description: string;
  highlights: string[];
  specs: VehicleSpec[];
  /** Links this vehicle to a station in the 3D showroom (Phase 4). */
  showroomStationId?: string;
  /** Optional 3D asset reference for the vehicle viewer (Phase 6). */
  model3d?: {
    glbPath: string;
    posterImage: string;
  };
  /** Marketing flags for merchandising. */
  isFeatured?: boolean;
}

export interface FinancingPlanExample {
  id: string;
  label: string;
  aprPercent: number;
  termMonths: number;
  note: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  /** Grouping so FAQs can be scoped per page (financing, trade-in, general). */
  topic: 'general' | 'financing' | 'trade-in' | 'test-drive';
}
