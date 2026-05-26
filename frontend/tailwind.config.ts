import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Colour Palette ──────────────────────────────────────────────────────
      colors: {
        sky: {
          DEFAULT: '#0EA5E9',
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
          950: '#082F49',
        },
        navy: {
          DEFAULT: '#0F172A',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        sand: {
          DEFAULT: '#F5F0E8',
          50: '#FDFCFA',
          100: '#F5F0E8',
          200: '#EDE5D4',
          300: '#DFD3BA',
          400: '#CEBFA0',
          500: '#BDAB88',
          600: '#A89070',
          700: '#8D7459',
          800: '#6F5A44',
          900: '#4F4030',
        },
        amber: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
        emerald: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
        // Stone neutrals extended
        stone: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
          950: '#0C0A09',
        },
      },

      // ── Typography ──────────────────────────────────────────────────────────
      fontFamily: {
        display: ['Instrument Serif', ...fontFamily.serif],
        body: ['Work Sans', ...fontFamily.sans],
        sans: ['Work Sans', ...fontFamily.sans],
        mono: ['JetBrains Mono', ...fontFamily.mono],
      },

      // ── Spacing & Layout ────────────────────────────────────────────────────
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // ── Box Shadows ─────────────────────────────────────────────────────────
      boxShadow: {
        'glow-sky': '0 0 20px 4px rgba(14, 165, 233, 0.3)',
        'glow-amber': '0 0 20px 4px rgba(245, 158, 11, 0.3)',
        'card': '0 4px 24px -4px rgba(15, 23, 42, 0.12), 0 2px 8px -2px rgba(15, 23, 42, 0.08)',
        'card-hover': '0 12px 40px -8px rgba(15, 23, 42, 0.20), 0 4px 16px -4px rgba(15, 23, 42, 0.12)',
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.16), inset 0 1px 0 rgba(255,255,255,0.1)',
      },

      // ── Animations ──────────────────────────────────────────────────────────
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-dot': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.4)', opacity: '0.7' },
        },
        'plane-fly': {
          '0%': { transform: 'translateX(-100%) rotate(0deg)', opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { transform: 'translateX(100vw) rotate(5deg)', opacity: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'fade-up-delay-1': 'fadeUp 0.5s 0.1s ease-out forwards',
        'fade-up-delay-2': 'fadeUp 0.5s 0.2s ease-out forwards',
        'fade-up-delay-3': 'fadeUp 0.5s 0.3s ease-out forwards',
        shimmer: 'shimmer 2s linear infinite',
        'pulse-dot': 'pulse-dot 1.5s ease-in-out infinite',
        'plane-fly': 'plane-fly 3s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },

      // ── Backdrop Blur ────────────────────────────────────────────────────────
      backdropBlur: {
        xs: '2px',
      },

      // ── Transition Timing ────────────────────────────────────────────────────
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
