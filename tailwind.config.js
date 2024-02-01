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
      backgroundImage: {
        "dark-magical-radial": "radial-gradient(var(--circle-size) circle at var(--x) var(--y), rgba(255,255,255,.5), transparent 40%)",
        "magical-radial": "radial-gradient(var(--circle-size) circle at var(--x) var(--y), rgba(0,0,0,.2), transparent 40%)",
      }
    },
  },
  plugins: [],
}