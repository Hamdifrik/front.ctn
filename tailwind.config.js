/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6eef3',
          100: '#ccdde8',
          200: '#99bbcf',
          300: '#6699b8',
          400: '#3377a1',
          500: '#0A3D62', // Primary
          600: '#093152',
          700: '#072642',
          800: '#051c31',
          900: '#031221'
        },
        secondary: {
          50: '#e6f4f5',
          100: '#cceaeb',
          200: '#99d5d7',
          300: '#66c0c3',
          400: '#33abaf',
          500: '#0A9396', // Secondary
          600: '#097a7c',
          700: '#075c5e',
          800: '#043d3f',
          900: '#021f1f'
        },
        accent: {
          50: '#fcf5e6',
          100: '#f9eccc',
          200: '#f3d899',
          300: '#eec566',
          400: '#e9b233',
          500: '#E9C46A', // Accent
          600: '#c0a158',
          700: '#967d44',
          800: '#6d5a2f',
          900: '#332b17'
        },
        success: {
          500: '#10B981',
        },
        warning: {
          500: '#F59E0B',
        },
        error: {
          500: '#EF4444',
        },
        neutral: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};