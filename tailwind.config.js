/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#0b0c10',
          900: '#111319',
          800: '#181b23',
          700: '#22252f',
          600: '#2d313d',
        },
        gold: {
          400: '#f0c987',
          500: '#e0ac5f',
          600: '#c48f42',
        },
        emerald: {
          400: '#3ddc97',
          500: '#22c07f',
        },
      },
      boxShadow: {
        premium: '0 20px 60px -15px rgba(0,0,0,0.5)',
        glow: '0 0 0 1px rgba(224,172,95,0.15), 0 8px 30px -8px rgba(224,172,95,0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
