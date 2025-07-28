/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
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
      gridTemplateColumns: {
        '1': 'repeat(1, 1fr)',
        '2': 'repeat(2, 1fr)',
        '3': 'repeat(3, 1fr)',
        '4': 'repeat(4, 1fr)',
        '5': 'repeat(5, 1fr)',
        '6': 'repeat(6, 1fr)',
        '7': 'repeat(7, 1fr)',
      },
    },
  },
  plugins: [],
}; 