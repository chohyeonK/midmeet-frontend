// tailwind.config.js

import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // ✅ sans (기본 폰트)에 NoonnuBasicGothic을 추가하고,
        // fallback으로 system-ui 등을 설정합니다.
        sans: ['NoonnuBasicGothic', 'system-ui', 'sans-serif'],

        // 또는, 'gothic'처럼 새로운 이름을 정의할 수 있습니다.
        // gothic: ['NoonnuBasicGothic', 'sans-serif'],
      },
      colors: {
        'primary-green': '#00C48C',
        ...colors,
      },
    },
  },
  plugins: [],
};
