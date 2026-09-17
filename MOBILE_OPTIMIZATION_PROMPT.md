# Mobile Optimization — Master Prompt (Long Drive Motors)

> Paste this as the opening prompt of a fresh session. It is written to be
> executed phase by phase, not all at once.

---

## Context

You are working on **Long Drive Motors** — a production-intent Next.js 15 (App
Router) / React 19 / TypeScript (strict) / Tailwind 3 dealership site with a
cinematic scroll-driven Three.js hero (R3F 9 + drei 10 + GSAP ScrollTrigger).

The **desktop experience is finished and signed off. It is the reference.** Do
not redesign it, do not "improve" it, do not change desktop visual output.

Read `README.md` first — it documents the 3D architecture, the import boundary,
the capability tiering, and the deliberate decisions (e.g. "the camera moves or
the car turns — never both"). Respect those decisions.

## Goal

Make the phone experience **feel like the same product, not a scaled-down
fallback**. A visitor on a 390px iPhone or a mid-range Android should get the
same cinematic hero, the same premium restraint, the same confidence — at a
frame rate and thumb-ergonomics that a phone can actually deliver.

Two rules that govern every decision:

1. **Fidelity of feeling over fidelity of pixels.** If a desktop effect costs
   too much on a phone, replace it with a cheaper effect that reads the same —
   do not simply delete it and leave a hole.
2. **Designed for mobile, not reflowed.** The Tailwind config already says
   "mobile is designed, not scaled down" (`tailwind.config.ts`). Make that true.

## Non-negotiables

- Desktop rendering (≥1024px) must be **pixel-identical** before and after.
  Every change is either mobile-scoped or provably neutral at desktop widths.
- `npm run typecheck`, `npm run lint`, `npm run build` stay clean. Strict TS,
  no `any`, no `@ts-expect-error`.
- The three.js import boundary stays exactly one file (`HeroCanvas.tsx`, loaded
  via `next/dynamic`). Never let three leak into the initial bundle.
- Server-rendered content stays server-rendered. The `<h1>`, copy, CTAs and the
  crawlable vehicle lists never become client-only or canvas-only.
- `prefers-reduced-motion` and the no-WebGL fallback keep working end to end.
- No new dependencies without asking me first.
- Match the existing code style: the comment density in this repo explains
  *why*, not *what*. Keep that.

---

## Known problems (verified in the code — start here, but don't stop here)

### A. The 3D hero — highest risk, highest payoff

1. **Viewport units break on mobile browsers.** `HeroExperience.tsx` uses
   `height: '520vh' | '100vh'` and `h-screen`. On iOS Safari / Chrome Android
   `vh` is the *large* viewport, so the sticky stage is taller than the visible
   area and the layout jumps when the address bar collapses. Move to
   `dvh`/`svh` with a correct fallback, and make ScrollTrigger survive the
   address-bar resize (`ignoreMobileResize`, and refresh only on real resizes —
   not on every scroll-driven toolbar change).

2. **The camera shots are composed for a landscape aspect.** `heroShots.ts`
   keyframes assume a wide frame with `fov: 45` (`CanvasShell.tsx`). At a
   portrait 9:19.5 aspect the horizontal FOV collapses, so the close-up shots
   (03, 04) crop the car and the wide shots lose the silhouette. Fix this
   properly — either an aspect-aware dolly/FOV compensation in `CameraRig.tsx`
   or a portrait shot set in `heroShots.ts`. **Judge it by eye, shot by shot**:
   the car must stay composed in frame through the entire 0→1 sequence in
   portrait, and it must still read as the same six cinematic beats.

3. **520vh of scroll is a lot of thumb on a phone.** Retune the scroll length
   for touch so the sequence lands in a natural number of swipes without
   feeling rushed or truncated.

4. **Scrub feel on touch.** `scrub: 1` plus iOS momentum scrolling reads as lag.
   Retune damping in `CameraRig.tsx` and the scrub value for touch input.

5. **Reduced tier is not yet reduced enough.** `capability.ts` gives mobile
   `tier: 'reduced'` with DPR ≤1.5. Profile it and cut what actually costs:
   `Environment` resolution, `ContactShadows` resolution/blur, light count in
   `HeroScene.tsx`, `ShowroomEnvironment` detail. Also add: pause the render
   loop when the hero leaves the viewport or the tab is hidden, and cap DPR
   harder on low-end devices.

6. **Bail out gracefully on hostile conditions.** Respect `Save-Data`,
   `navigator.connection.effectiveType` (2g/slow-2g), and very low
   `deviceMemory` / `hardwareConcurrency` by serving the existing `HeroFallback`
   instead of downloading ~270kB of three. That fallback must look intentional
   and premium on a phone — it is the hero for those users, not an error state.

7. **Hero content collides in portrait.** Captions sit at `top-[22%]`, the hero
   block at `pb-[12vh]`. On a short phone these overlap. Recompose the hero
   block for portrait (heading scale, copy length, CTA stacking) so it reads as
   a deliberate mobile composition.

### B. Touch ergonomics & input

8. **iOS zooms on input focus.** Every `<select>`/`<input>` (`QuickSearch.tsx`,
   `BookingForm.tsx`, `ContactForm.tsx`, `PaymentCalculator.tsx`) uses
   `text-sm` = 14px. Safari auto-zooms below 16px. Fix at the source so it
   applies everywhere, without changing the desktop type scale.

9. **Touch targets below 44px.** The header hamburger is `h-10 w-10` (40px,
   `Header.tsx`); the MobileNav "Close" button is ~36px tall. Audit every
   interactive element on mobile against a 44×44 minimum.

10. **`hover:` states stick on touch.** The codebase uses `hover:` freely.
    Enable Tailwind's `hoverOnlyWhenSupported` (or equivalent) so hover styling
    doesn't latch after a tap. Verify nothing looks dead on mobile as a result —
    where a hover state carried meaning, give touch an `active:` equivalent.

11. **iOS body-scroll lock is unreliable.** `MobileNav.tsx` sets
    `document.body.style.overflow = 'hidden'`, which iOS Safari ignores in
    common cases. Use a lock that actually holds, and restore scroll position
    exactly on close.

12. **No safe-area handling.** The fixed header, the MobileNav CTA and any
    bottom-anchored UI need `env(safe-area-inset-*)`. That requires
    `viewportFit: 'cover'` on the `viewport` export in `app/layout.tsx` — and
    once you add it, nothing may sit under the notch or the home indicator.

13. **`background-attachment: fixed` on `body`** (`globals.css`) is a known
    repaint cost on mobile browsers and is often ignored anyway. Replace it on
    coarse-pointer devices with something that preserves the vignette depth
    without the scroll cost.

### C. Mobile-native affordances the site is missing

14. **Gallery doesn't swipe.** `VehicleGallery.tsx` is a click-thumbnail stage.
    On a phone people swipe. Add a proper swipe/scroll-snap carousel with
    position indicator, keeping the thumbnail grid for desktop.

15. **No persistent contact action on mobile.** For a dealership this is the
    single highest-converting mobile pattern: a sticky bottom action bar on
    vehicle detail pages (Call / Book test drive), using real `tel:` links from
    `src/data/business.ts`. Design it to sit inside the brand, not on top of it
    — and make sure it never covers the last line of content or the home
    indicator.

16. **QuickSearch as four stacked selects is weak on mobile.** Consider a bottom
    sheet / compact filter pattern. Propose before building.

### D. Everything else

17. Sweep **all 25 routes** at 360px, 390px and 430px widths for horizontal
    overflow, cramped grids, orphaned headings, and unreadable line lengths.
    `VehicleCard`, `VehicleGallery`, `PageHeader`, `Footer`, `not-found` and the
    legal page currently carry almost no responsive treatment.
18. Verify `sizes` on every `next/image` is right for mobile — a wrong `sizes`
    quietly ships a desktop-sized image to a phone.

---

## How to work

1. **Phase 0 — audit first, no edits.** Run the dev server, drive the real pages
   at real phone viewports, and report back: what you found, what you'd do,
   what order, and anything above you think is wrong. Wait for my go-ahead.
2. Then one phase at a time, in this order: **hero → touch/input → native
   affordances → route sweep → perf pass**. Stop after each phase and show me
   what changed and how it looks.
3. After every phase: `npm run typecheck && npm run lint && npm run build`.
4. Don't batch twenty unrelated edits into one step. I want to be able to see
   and reject any single decision.

## Acceptance criteria

- Hero sequence plays composed and smooth in portrait on a mid-range phone, at
  a steady frame rate, with no address-bar layout jump.
- Desktop output unchanged — verify, don't assume.
- No horizontal scroll anywhere, at 360px and up.
- No input zoom on iOS; every tap target ≥44px.
- Lighthouse mobile: Performance ≥90, Accessibility 100, LCP < 2.5s on a
  simulated mid-tier device.
- The no-WebGL / Save-Data / reduced-motion paths each look like a deliberate
  premium experience, not a degraded one.

## First message back to me

Do not write code yet. Give me the Phase 0 audit: the real problem list ordered
by impact, your plan for the hero camera in portrait specifically, and any
place where you think the right answer is different from what's written above.
