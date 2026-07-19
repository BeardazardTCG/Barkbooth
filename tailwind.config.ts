import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["Manrope", "Inter", "ui-sans-serif", "sans-serif"],
      },
      colors: {
        navy: "#08294A",
        cocoa: "#08294A",
        registry: { navy: "#08294A", soft: "#143C61" },
        cream: "#FBF8F1",
        offwhite: "#FBF8F1",
        sand: "#7FAFCC",
        slate: "#425466",
        muted: "#E3EAF0",
        charcoal: "#172637",
        pink: "#496F8A",
        terracotta: "#B15E4A",
        biscuit: "#D8E7F1",
        sage: "#256C55",
        skysoft: "#D8EAF4",
        rosette: "#2F6F91",
        verified: "#256C55",
        award: "#A77A22",
        danger: "#9B2F2F",
        info: "#2F6F91",
        lightgrey: "#EDF3F7",
      },
      borderRadius: { registry: "1.1rem" },
      boxShadow: {
        soft: "0 18px 44px rgba(8, 41, 74, 0.11)",
        registry: "0 10px 26px rgba(8, 41, 74, 0.08)",
      }
    }
  },
  plugins: []
};
export default config;
