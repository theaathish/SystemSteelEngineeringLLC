import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    // Add other paths as needed
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        carousel: {
          '0%, 26.66%': { opacity: 1 },
          '33.33%, 93.33%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scrollRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        carousel: 'carousel 15s infinite',
        'scroll-right': 'scrollRight 30s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
