import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: "#FFC107",
        orange: "#FF5722",
        ke7li: "#0D1B2A",
        ke7li50: "rgb(30, 63, 97)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        titletextblack:"#373737",
        titletextyellow:"#f2d03b",
        paragraphtextgrey:"#a6a6a6",
        backgroundblack50:'#37373780',
        backgroundblack80:'#373737CC'
      },
    },
  },
  plugins: [],
} satisfies Config;
