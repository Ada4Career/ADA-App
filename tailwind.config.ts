import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          '50': 'rgb(var(--tw-color-primary-50) / <alpha-value>)',
          '100': 'rgb(var(--tw-color-primary-100) / <alpha-value>)',
          '200': 'rgb(var(--tw-color-primary-200) / <alpha-value>)',
          '300': 'rgb(var(--tw-color-primary-300) / <alpha-value>)',
          '400': 'rgb(var(--tw-color-primary-400) / <alpha-value>)',
          '500': 'rgb(var(--tw-color-primary-500) / <alpha-value>)',
          '600': 'rgb(var(--tw-color-primary-600) / <alpha-value>)',
          '700': 'rgb(var(--tw-color-primary-700) / <alpha-value>)',
          '800': 'rgb(var(--tw-color-primary-800) / <alpha-value>)',
          '900': 'rgb(var(--tw-color-primary-900) / <alpha-value>)',
          '950': 'rgb(var(--tw-color-primary-950) / <alpha-value>)',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        dark: '#222222',
        ms: {
          blue: '#0761C7',
          purple: '#7E39E0',
          red: '#DA5654',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      backgroundImage: {
        'ms-rainbow':
          'linear-gradient(90deg, #0761C7 0%, #7E39E0 51%, #DA5654 100%)',
        'blue-linear': 'linear-gradient(90deg, #1D4ED8 0%, #1D4ED8 100%)',
        'ms-rainbow-diagonal':
          'linear-gradient(45deg, #0761C7 0%, #7E39E0 51%, #DA5654 100%)',
        'ms-rainbow-radial':
          'radial-gradient(circle, #0761C7 0%, #7E39E0 51%, #DA5654 100%)',
        'ms-rainbow-conic':
          'conic-gradient(from 0deg, #0761C7 0%, #7E39E0 51%, #DA5654 100%)',
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '0.99',
            filter:
              'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0.4',
            filter: 'none',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-700px 0',
          },
          '100%': {
            backgroundPosition: '700px 0',
          },
        },
      },
      animation: {
        flicker: 'flicker 3s linear infinite',
        shimmer: 'shimmer 1.3s linear infinite',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.text-gradient-ms': {
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          color: 'transparent',
          'background-image':
            'linear-gradient(90deg, #0761C7 0%, #7E39E0 51%, #DA5654 100%)',
          display: 'inline-block', // Add this
          'padding-right': '4px', // Add this
          // 'padding-bottom': '4px',
          '-webkit-box-decoration-break': 'clone', // Add this
          'box-decoration-break': 'clone', // Add this
        },
        '.text-blue-linear': {
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          color: 'transparent',
          'background-image': 'linear-gradient(90deg, #5AD7FE 0%, #1D4ED8 80%)',
          display: 'inline-block', // Add this
          'padding-right': '4px', // Add this
          // 'padding-bottom': '4px',
          '-webkit-box-decoration-break': 'clone', // Add this
          'box-decoration-break': 'clone', // Add this
        },
        '.border-gradient-ms': {
          border: 'double 1px transparent',
          'background-image':
            'linear-gradient(white, white), linear-gradient(90deg, #0761C7 0%, #7E39E0 51%, #DA5654 100%)',
          'background-origin': 'border-box',
          'background-clip': 'padding-box, border-box',
        },
      });
    }),
  ],
} satisfies Config;
