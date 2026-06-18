import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        echo: {
          ink: "#07080b",
          panel: "#10141c",
          line: "#283141",
          cyan: "#8be9ff",
          green: "#58d68d",
          amber: "#f4c95d"
        }
      },
      boxShadow: {
        cockpit: "0 24px 80px rgba(0, 0, 0, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
