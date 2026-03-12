import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#060608",
          raised: "#0c0c10",
          card: "#121216",
          hover: "#1a1a20",
        },
        surface: "rgba(255, 255, 255, 0.025)",
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.06)",
          hover: "rgba(255, 255, 255, 0.12)",
        },
        text: {
          primary: "#efeae0",
          secondary: "#908a7e",
          muted: "#56524a",
          faint: "#36332e",
        },
        accent: {
          DEFAULT: "#e8c547",
          dim: "rgba(232, 197, 71, 0.1)",
        },
        cyan: "#47c5e8",
        green: "#4ade80",
        rose: "#f471b5",
        purple: "#a78bfa",
      },
      fontFamily: {
        display: ["Instrument Serif", "Georgia", "serif"],
        body: ["Outfit", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "14px",
        "card-lg": "20px",
      },
      animation: {
        "blob-float": "blobFloat 24s ease-in-out infinite alternate",
        "marquee": "marquee 28s linear infinite",
        "fade-up": "fadeUp 0.7s ease forwards",
        "pulse-dot": "pulseDot 2s infinite",
        "scroll-pulse": "scrollPulse 2.5s infinite",
      },
      keyframes: {
        blobFloat: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(25px, -35px) scale(1.04)" },
          "100%": { transform: "translate(-10px, 15px) scale(0.97)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(28px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        scrollPulse: {
          "0%, 100%": { opacity: "0.3", transform: "scaleY(1)" },
          "50%": { opacity: "1", transform: "scaleY(1.15)" },
        },
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
