/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bone: {
          DEFAULT: "var(--bone)",
          base: "var(--bone)",
        },
        lion: "var(--lion)",
        violet: "var(--violet)",
        stone: {
          400: "var(--stone)",
        },
        red: {
          base: "var(--red)",
          500: "var(--red)",
        },
      },
      fontFamily: {
        modak: ["var(--font-modak)"],
        nunito: ["var(--font-nunito)"],
      },
    },
  },
  plugins: [],
}; 