/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        forest: {
          500: "#444C42",
          700: "#252725",
        },
        gainz: {
          500: "#0cb929",
          800: "#81ff81",
        },
        text: {
          500: "#262626",
          800: "blue",
        },
        background: {
          500: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};
