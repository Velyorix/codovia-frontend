/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        secondary: '#4C1D95',
        background: '#0E1117',
        textPrimary: '#E5E7EB',
        textSecondary: '#6B7280',
        grayLight: "#94A3B8",
        glassBg: 'rgba(255, 255, 255, 0.1)',
      },
      boxShadow: {
        glow: '0 4px 20px rgba(139, 92, 246, 0.5)',
        neon: "0 4px 15px rgba(124, 58, 237, 0.5)",
      },
      backdropFilter: {
        blur: 'blur(20px)',
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
      animation: {
        pulse: "pulse 3s infinite",
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};
