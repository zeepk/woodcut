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
          200: "#05a605",
          500: "#4f0",
          800: "#81ff81",
          900: "#CCDCC3",
        },
        text: {
          light: "#262626",
          dark: "#ebeae8",
        },
        background: {
          light: "#f5f5f5",
          dark: "#333333",
        },
      },
      dropShadow: {
        dark: ["0px 5px 10px rgba(0,0,0,0.5)"],
      },
    },
  },
  plugins: [],
};
