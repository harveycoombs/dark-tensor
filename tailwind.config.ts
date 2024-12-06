import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)"
      },
      width: {
        "650": "650px"
      },
      height: {
        "1/2-screen": "50vh",
        "3/4-screen": "75vh"
      }
    },
  },
  plugins: [],
} satisfies Config;
