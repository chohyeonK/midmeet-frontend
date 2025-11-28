// tailwind.config.js
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['NoonnuBasicGothic', 'system-ui', 'sans-serif'],
      },
      colors: {
        'primary-green': '#00C48C',
        'primary-navy': '#3B3D96',
        'light-blue-bg': '#E0E7FF', // Pincobiz의 메인 배너 배경색 유사
        'light-green-bg': '#E6FFE0', // 왜 MidMeet일까요? 카드 배경색 예시
        'light-purple-bg': '#F0E0FF', // 다른 카드 배경색 예시
        'light-yellow-bg': '#FFFBE0', // 또 다른 카드 배경색 예시
        ...colors,
      },
    },
  },
  plugins: [],
};
