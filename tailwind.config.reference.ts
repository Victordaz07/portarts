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
          DEFAULT: "#ffffff",
          raised: "#f9fafb",
          card: "#ffffff",
          hover: "#f5f5f5",
        },
        surface: "#f9fafb",
        border: {
          DEFAULT: "#eaeaea",
          hover: "#dcdcdc",
        },
        text: {
          primary: "#000000",
          secondary: "#666666",
          muted: "#999999",
          faint: "#b8b8b8",
        },
        accent: {
          DEFAULT: "#0070f3",
          dim: "#f0f7ff",
        },
        cyan: "#3178c6",
        green: "#16a34a",
        yellow: "#ca8a04",
        rose: "#e11d48",
        purple: "#6d28d9",
      },
      fontFamily: {
        display: ["Geist Sans", "system-ui", "sans-serif"],
        body: ["Geist Sans", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
      },
      borderRadius: {
        card: "12px",
        "card-lg": "12px",
      },
      animation: {
        "marquee": "marquee 28s linear infinite",
        "fade-up": "fadeUp 0.7s ease forwards",
        "pulse-dot": "pulseDot 2s infinite",
        "scroll-pulse": "scrollPulse 2.5s infinite",
      },
      keyframes: {
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
