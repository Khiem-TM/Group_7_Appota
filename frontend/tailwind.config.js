/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Sora", "sans-serif"],
        display: ["Rajdhani", "sans-serif"]
      },
      colors: {
        ink: "#0A0D14",
        panel: "#101827",
        accent: "#22D3EE",
        hot: "#F97316",
        lime: "#84CC16"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34, 211, 238, 0.35), 0 16px 36px rgba(7, 10, 18, 0.45)"
      },
      backgroundImage: {
        "hero-grid": "radial-gradient(circle at 10% 20%, rgba(34,211,238,0.16), transparent 35%), radial-gradient(circle at 80% 10%, rgba(249,115,22,0.14), transparent 36%), linear-gradient(120deg, #040712 0%, #0c1324 55%, #121d34 100%)"
      }
    }
  },
  plugins: []
};
