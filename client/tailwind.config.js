/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0a0f1e',
          light: '#161d31',
          dark: '#050810',
        },
        gold: {
          DEFAULT: '#f0a500',
          light: '#ffc133',
          dark: '#b37b00',
        },
        teal: {
          DEFAULT: '#00d4aa',
          light: '#33ffd4',
          dark: '#00997a',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
