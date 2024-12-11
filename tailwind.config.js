/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs", // Include paths to your EJS files
    "./public/**/*.js", // If you have JavaScript files
    "./public/**/*.html" // If you have HTML files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

