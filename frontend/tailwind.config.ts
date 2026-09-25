import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blueprint: {
          950: "#060B14", // deepest background
          900: "#0A1220", // main background
          800: "#101C30", // panel background
          700: "#1A2B45", // borders / hairlines
          600: "#2A4568", // hover borders
        },
        obsidian: {
          950: "#08080C", // page background
          900: "#0D0E15", // raised surface
          850: "#111320", // card surface
          800: "#161A2B", // hover surface
        },
        neon: {
          violet: "#8B5CF6",
          cyan: "#06B6D4",
          indigo: "#4F46E5",
          emerald: "#34D399",
        },
        draft: {
          cyan: "#5EEAD4",
          blue: "#60A5FA",
          amber: "#F5B94D",
          coral: "#F5876B",
        },
        ink: {
          100: "#EAF0F7",
          300: "#B7C4D8",
          500: "#7A8CA6",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-fine":
          "linear-gradient(rgba(94,234,212,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,212,0.045) 1px, transparent 1px)",
        "grid-lux":
          "linear-gradient(rgba(139,92,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.07) 1px, transparent 1px)",
        "metallic-text":
          "linear-gradient(180deg, #FFFFFF 0%, #E7E9F2 38%, #9AA1B8 72%, #C9CEDD 100%)",
        "accent-gradient":
          "linear-gradient(120deg, #4F46E5 0%, #8B5CF6 48%, #06B6D4 100%)",
      },
      backgroundSize: {
        "grid-24": "24px 24px",
        "grid-32": "32px 32px",
        "grid-40": "40px 40px",
        "200%": "200% 100%",
      },
      boxShadow: {
        "glow-violet": "0 0 60px -18px rgba(139,92,246,0.65)",
        "glow-cyan": "0 0 60px -18px rgba(6,182,212,0.55)",
        "glow-indigo": "0 0 60px -18px rgba(79,70,229,0.6)",
        "card-lux": "0 30px 80px -40px rgba(0,0,0,0.95)",
        "cta": "0 10px 40px -12px rgba(139,92,246,0.7), inset 0 1px 0 0 rgba(255,255,255,0.18)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        dashflow: {
          to: { strokeDashoffset: "-240" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.7)", opacity: "0" },
          "100%": { opacity: "0" },
        },
        "border-glow": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        dashflow: "dashflow 2.6s linear infinite",
        "dashflow-slow": "dashflow 6s linear infinite",
        float: "float 8s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        "spin-slow": "spin-slow 14s linear infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.2, 0.6, 0.4, 1) infinite",
        "border-glow": "border-glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
