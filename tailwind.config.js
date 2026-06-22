/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        zombie: {
          green: '#4ade80',
          dark: '#1a1a2e',
          blood: '#7f1d1d',
          wood: '#92400e',
          rust: '#b45309',
        },
      },
      animation: {
        'shake': 'shake 0.3s ease-in-out',
        'pulse-fast': 'pulse 0.5s ease-in-out infinite',
        'bounce-once': 'bounce 0.4s ease-in-out 1',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
    },
  },
  plugins: [],
}
