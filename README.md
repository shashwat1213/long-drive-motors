# Long Drive Motors — Immersive 3D Dealership

A premium, immersive website for Long Drive Motors: a cinematic scroll-driven 3D
hero, an explorable showroom, and the full inventory / financing / trade-in /
test-drive experience.

> **Data note:** business contact details are real. Vehicle listings, prices and
> financing rates are illustrative sample data used to demonstrate the
> experience, served through a content layer designed to be swapped for a live
> inventory feed.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Set `NEXT_PUBLIC_SITE_URL` in `.env.local` so canonical URLs, the sitemap and
Open Graph tags resolve to your domain.

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm run start` | Production build / serve |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm run lint` | ESLint |

## Stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 3 ·
GSAP 3 + ScrollTrigger · Three.js + React Three Fiber 9 + drei 10.
Fonts are self-hosted — no Google Fonts request.

## Architecture

```
src/
  app/            Routes, layout, sitemap, robots, fonts
  components/     ui/ layout/ sections/ inventory/ forms/ seo/
  config/         Site + dealership data, navigation, design tokens
  data/           Sample inventory and business content
  lib/
    content/      Async content layer — the API/CMS swap point
    seo/          Metadata builder + JSON-LD schema builders
  hooks/          useReducedMotion, useMediaQuery, useCapability
  animation/      GSAP setup + scoped context
  three/
    core/         CanvasShell, capability tiering, loader, fallback, error boundary
    hero/         Camera rig, shots, vehicle, environment, hero + showroom scenes
```

### How the 3D works

- **`HeroCanvas` is the only import boundary that pulls in three.js**, loaded via
  `next/dynamic`. The hero's `<h1>`, copy and CTAs are server-rendered and never
  wait on WebGL — the homepage ships 161 kB of initial JS, with the 3D streaming
  in behind a branded loader.
- **The vehicle is an extruded side profile**, not stacked boxes — that's what
  gives it a real silhouette (raked windshield, tapering roofline, sloping hood).
  It's isolated in `VehicleModel.tsx`: swapping in a licensed GLB means changing
  that one file, leaving camera, lighting and scroll untouched.
- **Six cinematic camera shots** (`heroShots.ts`) are sampled by scroll progress
  and damped per-frame. GSAP writes to a mutable proxy rather than React state,
  so the render loop never re-renders the tree.
- **The camera moves or the car turns — never both.** Rotating both drags the
  subject out of frame on close-ups, so the car only turns on the static
  showroom turntable.
- **Three quality tiers** (`useCapability`): full, reduced (lower DPR, no
  reflections/dust/light shafts), and a static fallback for no-WebGL devices.
- **`prefers-reduced-motion`** disables the scroll-scrubbed camera and all idle
  motion, leaving a composed static hero with every CTA functional.

### Other decisions

- Content flows through `src/lib/content` — connecting a real backend is a
  change confined to that module.
- Critical content is never canvas-only; the showroom's vehicle list is
  crawlable HTML.
- `AutoDealer` / `Organization` / `Vehicle` / `Breadcrumb` / `FAQ` JSON-LD is
  emitted server-side, with local SEO across Toronto, Etobicoke, Mississauga,
  Brampton, Oakville and the GTA.

## Verified

`tsc --noEmit` clean · ESLint clean · production build clean · 25 routes
prerendered · all routes return 200 and unknown paths 404 · image pipeline
serving optimized vehicle art.

## Not yet built

Free-explore walkthrough (WASD / touch joystick, collision, hotspot panels) in
the showroom; interactive inventory filtering wired to the quick-search params;
real form endpoints, finance-provider and inventory-feed integrations; licensed
GLB vehicle models; official trust-mark assets.
