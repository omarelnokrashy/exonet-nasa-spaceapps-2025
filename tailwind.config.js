module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cosmic: {
          900: "#0b1020",
          800: "#0f1b37",
        },
      },
      backgroundImage: {
        'nebula-1': "url('/cosmic-nebula-1.jpg')"
      }
    },
  },
  plugins: [],
}
