/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0d1117",
        darker: "#000307",
        "dark-border": "#33393f",
        "dark-text": "#e8f0f7",
        "dark-accent": "#95969c",
        "dark-error": "#7f1d1e",
        light: "#ffffff",
      },
    },
  },
  plugins: [],
}