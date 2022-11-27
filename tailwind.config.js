/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: {max: '991px'},
      md: {max: '1199px'},
      lg: '1200px',
    },
    colors: {
      white: 'var(--color-white)',
      black: 'var(--color-black)',
      gray: {
        100: 'var(--color-gray-100)',
        200: 'var(--color-gray-200)',
        300: 'var(--color-gray-300)',
        400: 'var(--color-gray-400)',
        500: 'var(--color-gray-500)',
        600: 'var(--color-gray-600)',
        700: 'var(--color-gray-700)',
        800: 'var(--color-gray-800)',
        900: 'var(--color-gray-900)',
      },
      green: {
        300: 'var(--color-green-300)',
        500: 'var(--color-green-500)',
        600: 'var(--color-green-600)',
      },
      red: {
        500: 'var(--color-red-500)',
      },
      yellow: {
        500: 'var(--color-yellow-500)',
      },
      orange: {
        500: 'var(--color-orange-500)',
      },
    },
  },
  plugins: [],
}
