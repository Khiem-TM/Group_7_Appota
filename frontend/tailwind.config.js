/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "sans-serif"],
        display: ["Geist", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      },
      colors: {
        surface: "#10131a",
        "surface-dim": "#10131a",
        "surface-bright": "#363941",
        "surface-container-lowest": "#0b0e15",
        "surface-container-low": "#191b23",
        "surface-container": "#1d2027",
        "surface-container-high": "#272a31",
        "surface-container-highest": "#32353c",
        "on-surface": "#e1e2ec",
        "on-surface-variant": "#c2c6d6",
        outline: "#8c909f",
        "outline-variant": "#424754",
        "surface-tint": "#adc6ff",
        primary: "#adc6ff",
        "on-primary": "#002e6a",
        "primary-container": "#4d8eff",
        "on-primary-container": "#00285d",
        "primary-fixed": "#d8e2ff",
        "primary-fixed-dim": "#adc6ff",
        "on-primary-fixed": "#001a42",
        "on-primary-fixed-variant": "#004395",
        secondary: "#d0bcff",
        "on-secondary": "#3c0091",
        "secondary-container": "#571bc1",
        "on-secondary-container": "#c4abff",
        "secondary-fixed": "#e9ddff",
        "secondary-fixed-dim": "#d0bcff",
        tertiary: "#ffb786",
        "on-tertiary": "#502400",
        "tertiary-container": "#df7412",
        "on-tertiary-container": "#461f00",
        "tertiary-fixed": "#ffdcc6",
        "tertiary-fixed-dim": "#ffb786",
        error: "#ffb4ab"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(173, 198, 255, 0.28), 0 14px 32px rgba(10, 14, 24, 0.42)"
      },
      backgroundImage: {
        "hero-grid": "radial-gradient(circle at 10% 20%, rgba(77,142,255,0.16), transparent 35%), radial-gradient(circle at 80% 10%, rgba(223,116,18,0.14), transparent 36%), linear-gradient(120deg, #0b0e15 0%, #10131a 55%, #1d2027 100%)",
        "auth-cyan": "radial-gradient(circle at 30% 20%, rgba(77,142,255,0.2), transparent 40%), linear-gradient(140deg, #0b0e15, #1d2027)",
        "auth-violet": "radial-gradient(circle at 75% 15%, rgba(87,27,193,0.35), transparent 38%), linear-gradient(140deg, #0b0e15, #1d2027)",
        "landing-preview": "radial-gradient(circle at 70% 22%, rgba(173,198,255,0.18), transparent 40%), linear-gradient(145deg, #0b0e15, #1d2027)",
        "landing-card-preview": "linear-gradient(130deg, #1d2027, #272a31)",
        "tournament-shell": "radial-gradient(circle at 12% 18%, rgba(173,198,255,0.12), transparent 36%), linear-gradient(132deg, #1d2027, #363941)"
      }
    }
  },
  plugins: []
};
