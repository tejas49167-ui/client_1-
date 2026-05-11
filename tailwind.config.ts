import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        saffron: "#d97706",
        marigold: "#f59e0b",
        vermilion: "#b42318",
        leaf: "#2f6f4e"
      },
      boxShadow: {
        soft: "0 18px 60px rgb(23 23 23 / 10%)"
      }
    }
  },
  plugins: []
};

export default config;
