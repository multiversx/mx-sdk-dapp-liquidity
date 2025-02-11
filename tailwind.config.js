/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/reactjs/**/*.{js,ts,jsx,tsx}',
    './node_modules/@multiverx/sdk-dapp-form/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          // 650: "#4A4A4A",
          // 750: "#2E2E2E",
          // 850: "#212121",
          25: '#f6f7f9',
          50: '#eeeef1',
          100: '#e1e2e8',
          200: '#cdd0db',
          300: '#9195a3',
          400: '#757985',
          500: '#60626d',
          600: '#4f515a',
          650: '#464853',
          700: '#3b3d48',
          750: '#2a2c34',
          800: '#23242b',
          850: '#1e1f25',
          900: '#14151a',
          950: '#0E0E12'
        }
      }
    }
  },
  plugins: [],
  prefix: 'liq-'
};
