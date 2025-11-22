/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#DC2626", // Rojo intenso (tipo restaurante chino)
        secondary: "#F59E0B", // Dorado/Ámbar para acentos
        accent: "#B91C1C", // Rojo más oscuro para hovers
      },
    },
  },
  plugins: [],
};
