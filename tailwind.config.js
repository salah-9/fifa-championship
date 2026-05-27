/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0f',
        'bg-card': '#12121a',
        'bg-card-hover': '#1a1a26',
        'accent-green': '#00ff87',
        'accent-yellow': '#f5c518',
        'accent-red': '#ff4444',
        'text-secondary': '#8888aa',
        border: '#2a2a3a',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
