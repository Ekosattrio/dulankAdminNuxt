import type { Config } from "tailwindcss";

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  darkMode: ["class", '[data-layout-mode="dark_mode"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF9F43",
          hover: "#E68F3C",
          50: "#FFF9F3",
          100: "#FFF5EC",
          200: "#FFECD9",
          300: "#FFE2C7",
          400: "#FFD9B4",
          500: "#FF9F43",
          600: "#E68F3C",
          700: "#CC7F36",
          800: "#B36F2F",
          900: "#995F28",
        },
        secondary: {
          DEFAULT: "#092C4C",
          hover: "#07233D",
          50: "#F0F4F8",
          100: "#E6EAED",
          200: "#CED5DB",
          300: "#B5C0C9",
          400: "#9DABB7",
          500: "#092C4C",
          600: "#082540",
          700: "#061D32",
          800: "#051625",
          900: "#030E17",
        },
        success: {
          DEFAULT: "#28C76F",
          soft: "#EAF9F1",
        },
        warning: {
          DEFAULT: "#FF9900",
          soft: "#FFF5E6",
        },
        danger: {
          DEFAULT: "#FF0000",
          soft: "#FFE6E6",
        },
        dark: "#29344a",
        "kacetak-gold": "#b87817",
      },
      fontFamily: {
        sans: ["Nunito", "Poppins", "sans-serif"],
        primary: ["Nunito", "sans-serif"],
        secondary: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
