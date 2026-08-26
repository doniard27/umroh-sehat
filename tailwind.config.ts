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
        primary: {
          50: "#e6f5ef",
          100: "#b3e0cf",
          200: "#80ccaf",
          300: "#4db78f",
          400: "#26a877",
          500: "#0B6E4F",
          600: "#095e43",
          700: "#074e37",
          800: "#053e2c",
          900: "#032e20",
        },
        gold: {
          50: "#fdf8eb",
          100: "#f7e8c0",
          200: "#f1d896",
          300: "#ebc86b",
          400: "#d4b133",
          500: "#C9A227",
          600: "#a88720",
          700: "#876c1a",
          800: "#665113",
          900: "#45370d",
        },
        cream: "#FAF7F0",
        surface: "#FFFFFF",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "islamic-pattern": "url('/images/pattern.svg')",
      },
    },
  },
  plugins: [],
};

export default config;
