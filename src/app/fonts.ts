import localFont from 'next/font/local';

/**
 * Self-hosted variable fonts via @fontsource files (no Google Fonts request).
 * This avoids a third-party dependency at runtime, eliminates font-driven
 * layout shift, and is privacy-friendly. Exposed as CSS variables consumed by
 * tailwind.config.ts (font-display / font-sans).
 */

export const fontDisplay = localFont({
  src: '../../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
  variable: '--font-display',
  display: 'swap',
  weight: '300 700',
});

export const fontSans = localFont({
  src: '../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  variable: '--font-sans',
  display: 'swap',
  weight: '100 900',
});
