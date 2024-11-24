/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        neonBlue: '#00FFFF',
        darkBlue: '#1E90FF',
        midnightBlue: '#4B0082',
        lightGreen: '#39FF14',
      },
      backdropFilter: {
        none: 'none',
        blur: 'blur(10px)',
      },
    },
  },
  plugins: [],
}

