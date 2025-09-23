// tailwind.config.js

import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-green': '#00C48C',
        ...colors,
      },
    },
  },
  plugins: [],
};
