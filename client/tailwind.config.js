/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust as necessary for your project structure
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      }
    },
  },
  plugins: [],
}
