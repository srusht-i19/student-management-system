import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#101D42', 700: '#1B2C5E', 500: '#3A4C85', 200: '#C9D1EA', 100: '#E3E8F5' },
        gold: { DEFAULT: '#F2B01E', 600: '#D99A0B', 100: '#FDF1D2' },
        mint: { DEFAULT: '#12A38A', 700: '#0C7F6B', 50: '#E4F6F2' },
        rose: { DEFAULT: '#D64550', 50: '#FBE9EA' },
        paper: '#F4F6FB',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        lift: '0 18px 40px -18px rgba(16,29,66,.45)',
      },
    },
  },
  plugins: [],
};
export default config;
