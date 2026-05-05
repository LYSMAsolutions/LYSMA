import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        display: ["'Barlow Condensed'", "sans-serif"],
      },
      colors: {
        garage: {
          bg: "#0a0a0a",
          panel: "#111111",
          border: "#222222",
          accent: "#FF4500",
          accentHover: "#FF6030",
          green: "#00FF88",
          yellow: "#FFD700",
          text: "#E0E0E0",
          muted: "#666666",
        },
      },
    },
  },
  plugins: [],
};

export default config;
