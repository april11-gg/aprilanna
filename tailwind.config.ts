import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#7C3AED" }
      },
      backgroundImage: {
        "purple-radial":
          "radial-gradient(1200px 600px at 10% 10%, rgba(124,58,237,0.35), transparent), radial-gradient(1200px 600px at 90% 90%, rgba(168,85,247,0.25), transparent)"
      }
    }
  },
  plugins: []
};
export default config;
