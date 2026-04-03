/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f0f4',
          100: '#e0e0e8',
          200: '#c1c1d1',
          300: '#9a9ab3',
          400: '#6e6e8a',
          500: '#3d3d5c',
          600: '#1A1A2E',
          700: '#151528',
          800: '#101022',
          900: '#0b0b1a',
        },
        accent: {
          50: '#fdf8f0',
          100: '#f9eed9',
          200: '#f0dbb3',
          300: '#e4c48a',
          400: '#d4a962',
          500: '#C9A96E',
          600: '#b08a4a',
          700: '#8e6e3b',
          800: '#6d5530',
          900: '#4d3c22',
        },
        surface: {
          50: '#FAFAF8',
          100: '#F5F5F0',
          200: '#EBEBDF',
          300: '#DDDDD0',
          400: '#CCCCC0',
        },
        neutral: {
          50: '#FAFAF8',
          100: '#F5F5F0',
          200: '#E8E8E0',
          300: '#D1D1C6',
          400: '#A3A397',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#2D2D3A',
          900: '#1A1A2E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.7s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
}
