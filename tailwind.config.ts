import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core dark backgrounds
        void:    "#070B18",
        navy:    "#0A0F1E",
        surface: "#0D1226",
        panel:   "#111827",
        card:    "#141C35",
        border:  "#1E2D55",
        // Accents
        electric: "#4B7BF5",
        pulse:    "#7C5CFC",
        cyan:     "#00D4FF",
        neon:     "#39FF84",
        amber:    "#F5A623",
        danger:   "#FF4757",
        // Text
        bright:  "#FFFFFF",
        muted:   "#8892A4",
        faint:   "#3D4F70",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "'Fira Code'", "monospace"],
        sans:    ["'DM Sans'", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(75,123,245,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(75,123,245,0.03) 1px, transparent 1px)",
        "glow-electric": "radial-gradient(ellipse at center, rgba(75,123,245,0.15) 0%, transparent 70%)",
        "glow-pulse":    "radial-gradient(ellipse at center, rgba(124,92,252,0.15) 0%, transparent 70%)",
      },
      backgroundSize: {
        "grid": "40px 40px",
      },
      boxShadow: {
        "electric": "0 0 20px rgba(75,123,245,0.3), 0 0 40px rgba(75,123,245,0.1)",
        "pulse":    "0 0 20px rgba(124,92,252,0.3), 0 0 40px rgba(124,92,252,0.1)",
        "card":     "0 1px 0 rgba(75,123,245,0.1), inset 0 1px 0 rgba(255,255,255,0.03)",
        "inset":    "inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      animation: {
        "pulse-slow":  "pulse 3s ease-in-out infinite",
        "glow":        "glow 2s ease-in-out infinite alternate",
        "scan":        "scan 3s linear infinite",
        "fade-up":     "fadeUp 0.5s ease-out forwards",
        "slide-in":    "slideIn 0.3s ease-out forwards",
      },
      keyframes: {
        glow: {
          from: { boxShadow: "0 0 10px rgba(75,123,245,0.2)" },
          to:   { boxShadow: "0 0 25px rgba(75,123,245,0.5), 0 0 50px rgba(75,123,245,0.2)" },
        },
        scan: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-12px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
