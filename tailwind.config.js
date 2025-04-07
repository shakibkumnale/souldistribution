/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          primary: '#ff3a8c',
        },
        purple: {
          primary: '#8a3ab9',
        },
        blue: {
          primary: '#4c68d7',
        },
        dark: {
          background: '#121212',
          card: '#1e1e1e',
          muted: '#2d2d2d',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #ff3a8c 0%, #8a3ab9 50%, #4c68d7 100%)',
        'gradient-accent': 'linear-gradient(135deg, #8a3ab9 0%, #4c68d7 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(18, 18, 18, 0.9) 100%)',
        'gradient-dark': 'linear-gradient(135deg, #121212 0%, #1e1b33 100%)',
      },
      boxShadow: {
        'glow-primary': '0 0 15px rgba(255, 58, 140, 0.3)',
        'glow-accent': '0 0 15px rgba(76, 104, 215, 0.3)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
