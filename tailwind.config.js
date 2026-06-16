/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          bg: '#FFF8F0',
          sidebar: '#FEF0E6',
          primary: '#D4826A',
          primaryLight: '#F0C5B6',
          text: '#4A3728',
          muted: '#9C8B7A',
          accent: '#7FB3A0',
          border: '#EDE0D4',
          blush: '#F7D5D0',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['PingFang SC', 'Microsoft YaHei', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        'card-sm': '12px',
        btn: '10px',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.08)',
        'card-sm': '0 1px 6px rgba(0,0,0,0.04)',
      }
    },
  },
  plugins: [],
}
