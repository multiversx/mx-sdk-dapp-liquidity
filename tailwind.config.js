// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const colors = require('tailwindcss/colors');

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
        },

        primary: {
          50: '#dcf5fe',
          100: '#c8edfe',
          200: '#a5e6fe',
          300: '#77dcfd',
          400: '#3bc5fc',
          500: '#13a6fb',
          600: '#0486f1',
          700: '#007bff',
          DEFAULT: '#007cff',
          800: '#053c7f',
          900: '#072f5a',
          950: '#05111f'
        },

        success: {
          50: colors.green[50],
          100: colors.green[100],
          200: colors.green[200],
          300: colors.green[300],
          DEFAULT: colors.green[400],
          500: colors.green[500],
          600: colors.green[600],
          700: colors.green[700]
        },

        warning: {
          100: colors.amber[100],
          200: colors.amber[200],
          DEFAULT: colors.amber[300],
          400: colors.amber[400]
        },

        danger: {
          50: colors.red[50],
          100: colors.red[100],
          200: colors.red[200],
          300: colors.red[300],
          DEFAULT: colors.red[400],
          500: colors.red[500],
          600: colors.red[600],
          700: colors.red[700]
        }
      }
    }
  },
  plugins: [],
  prefix: 'liq-'
};
