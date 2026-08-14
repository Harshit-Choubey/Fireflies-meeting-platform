/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#7C4DFF",
          hover: "#6F3FF0",
          light: "#EEE8FF",
          soft: "#F4F0FF",
        },
        navy: {
          DEFAULT: "#10072F",
          dark: "#0B0422",
          light: "#1A0F45",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F7F7FA",
          hover: "#F1F1F5",
        },
        border: "#E7E7EE",
        success: "#20C997",
      },
    },
  },
  plugins: [],
};
