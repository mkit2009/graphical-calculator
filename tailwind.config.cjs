/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        title: "Courgette, cursive",
        lobster: "Lobster, cursive",
      },
      boxShadow: {
        static: "0 0 30px 0 #ffffff82",
        staticBigger: "0 0 40px 0 #ffffffa2",
      },
      colors: {
        backgroundColor: "#222222",
        fontColor: "#ffffff",
        barelyVisibleWhite: "#ffffff2a",
      },
    },
  },
  plugins: [],
};
