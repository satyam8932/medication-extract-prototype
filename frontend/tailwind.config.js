/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  daisyui: {
    themes: ["light",], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
  },
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}