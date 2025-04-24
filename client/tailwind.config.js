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
          DEFAULT: '#006233', // Moroccan green
          light: '#008443',
          dark: '#004D28',
        },
        secondary: {
          DEFAULT: '#C1272D', // Moroccan red
          light: '#DB3A40',
          dark: '#A1181E',
        },
        neutral: {
          50: '#F9F9F7',
          100: '#F1F1ED',
          200: '#E5E5DD',
          300: '#D0D0C2',
          400: '#AEAE99',
          500: '#939379',
          600: '#76765F',
          700: '#5C5C4A',
          800: '#3D3D31',
          900: '#262621',
        },
        success: '#2E7D32',
        warning: '#ED6C02',
        error: '#D32F2F',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 6px 12px rgba(0, 0, 0, 0.12)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideUp: 'slideUp 0.5s ease-out',
      },
    },
  },
  plugins: [],
}