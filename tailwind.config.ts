import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["Outfit", "Manrope", "Sora", "Inter", "ui-sans-serif", "sans-serif"],
      },
      colors: {
        navy: "#14213D",
        cocoa: "#14213D",
        registry: { navy: "#14213D", soft: "#243451" },
        cream: "#F4EFE6",
        offwhite: "#FBFAF6",
        sand: "#D8C3A5",
        slate: "#475569",
        muted: "#E6E2DA",
        charcoal: "#263241",
        pink: "#B9655A",
        terracotta: "#B9655A",
        biscuit: "#D8C3A5",
        sage: "#2F6F55",
        skysoft: "#DCE8F1",
        rosette: "#B9655A",
        verified: "#2F6F55",
        award: "#B88A2E",
        danger: "#9F3A38",
        info: "#315F86",
        lightgrey: "#E6E2DA",
      },
      borderRadius: { registry: "1.35rem" },
      boxShadow: {
        soft: "0 18px 48px rgba(20, 33, 61, 0.11)",
        registry: "0 10px 28px rgba(20, 33, 61, 0.08)",
      }
    }
  },
  plugins: []
};
export default config;
