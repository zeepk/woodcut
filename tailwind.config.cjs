/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        forest: {
          500: "#444C42",
          700: "#252725",
        },
      },
    },
  },
  plugins: [],
};
