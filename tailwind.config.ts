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
        
      },
      colors: {
        
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
