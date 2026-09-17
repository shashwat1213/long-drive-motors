/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Vehicle placeholder art ships as first-party SVG in /public. next/image
    // refuses to optimize SVG unless explicitly allowed, so this is required
    // for the cards to render. Scoped tightly: the CSP below sandboxes the
    // image and blocks any script execution inside it.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Add real CDN patterns here (narrowly scoped) when live inventory imagery
    // replaces the placeholders.
    remotePatterns: [],
  },
  // three.js / R3F transpilation is handled natively by Next 15; no extra config needed.
};

export default nextConfig;
