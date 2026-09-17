import type { Config } from 'tailwindcss';

/**
 * Long Drive Motors — premium automotive design system.
 *
 * Direction: cinematic, sophisticated, confident, high-end. A refined modern
 * interpretation of the brand's red/black/white automotive character — deep
 * "obsidian" ink surfaces, a controlled signature red, and a warm platinum
 * neutral ramp, rather than the loud primary red / flat black of the old site.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    // Purpose-built breakpoints — mobile is designed, not scaled down.
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      // Tall frames — phones upright, and tablets in portrait. Matches
      // PORTRAIT_ASPECT_MAX in src/three/hero/heroShots.ts, so the hero's
      // layout and its camera sequence always agree on what "portrait" means.
      tall: { raw: '(max-aspect-ratio: 95/100)' },
    },
    extend: {
      colors: {
        // Deep, layered near-black surfaces (never pure #000 — reads richer).
        ink: {
          950: '#07080A',
          900: '#0A0B0D',
          800: '#111317',
          700: '#181B21',
          600: '#22262E',
          500: '#2E333D',
        },
        // Warm platinum neutrals for text + light surfaces.
        fog: {
          50: '#F7F7F8',
          100: '#EDEDEF',
          200: '#DBDCDF',
          300: '#B9BBC1',
          400: '#8B8E96',
          500: '#63666E',
        },
        // Signature automotive red — controlled, deep, cinematic.
        brand: {
          50: '#FFF1F2',
          300: '#F97078',
          400: '#F04955',
          500: '#E11D2A', // primary
          600: '#C11320',
          700: '#9C0E19',
        },
        // Semantic aliases (consumed by components; keeps intent readable).
        surface: {
          DEFAULT: '#0A0B0D',
          raised: '#111317',
          overlay: '#181B21',
        },
        line: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          strong: 'rgba(255,255,255,0.16)',
        },
      },
      fontFamily: {
        // Wired to next/font CSS variables (see app/layout.tsx).
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Editorial display scale for cinematic headings.
        'display-2xl': ['clamp(3rem, 8vw, 6.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '600' }],
        'display-xl': ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1', letterSpacing: '-0.025em', fontWeight: '600' }],
        'display-lg': ['clamp(2rem, 4.5vw, 3.25rem)', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.1', letterSpacing: '-0.015em', fontWeight: '600' }],
      },
      letterSpacing: {
        // Uppercase eyebrow / label tracking — a premium automotive tell.
        eyebrow: '0.22em',
      },
      spacing: {
        section: 'clamp(4rem, 10vw, 9rem)',
        gutter: 'clamp(1.25rem, 5vw, 3rem)',
      },
      maxWidth: {
        content: '80rem',
        prose: '42rem',
      },
      borderRadius: {
        card: '1rem',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 40px -24px rgba(0,0,0,0.8)',
        glow: '0 0 0 1px rgba(225,29,42,0.25), 0 12px 40px -12px rgba(225,29,42,0.45)',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.22, 1, 0.36, 1)',
        cinematic: 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      transitionDuration: {
        instant: '120ms',
        fast: '240ms',
        base: '400ms',
        slow: '700ms',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.22,1,0.36,1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
