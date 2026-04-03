import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#1B3A5C",
        "dark-blue": "#2F5496",
        "med-blue": "#4472C4",
        "light-blue": "#D6E4F0",
        teal: "#009688",
        amber: "#FF8F00",
        danger: "#C00000",
        zebra: "#F1F5F9",
        surface: "#F8FAFC",
      },
    },
  },
  plugins: [],
};
export default config;
