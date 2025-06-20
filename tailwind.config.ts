import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}", 
  ],
  theme: {
    extend: {
      fontFamily: {
        dmsans: ['var(--font-dmsans)'],
        outfit: ['var(--font-outfit)'],
      },
      colors: {
        primary: {
          DEFAULT: "#FBBF24", // Yellow
          light: "#FEF3C7", // Light Yellow
          dark: "#B45309", // Dark Yellow
        },
        secondary: {
          DEFAULT: "#06B6D4", // Cyan
          light: "#CCFBF1", // Light Cyan
          dark: "#0891B2", // Dark Cyan
        },
        background: {
          DEFAULT: "#FFFFFF", // White
          light: "#F9FAFB", // Light Gray
          dark: "#111827", // Dark Gray
        },
      },
      keyframes: {
        
      },
    },
  },
  plugins: [
    // require("tailwindcss-animate"), 
    // require("@tailwindcss/forms"),
    // require("@tailwindcss/typography"), 
  ],
};

export default config;
