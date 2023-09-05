/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          500: '#38a169', 
          600: '#2f855a',
          700: '#276749',
        },
      },
    },
  },
  plugins: [],
}