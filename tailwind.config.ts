import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#5A0714", // Maroon
          hover: "#45040E",
          light: "#7B1020",
          dark: "#35030A",
        },
        burgundy: {
          DEFAULT: "#35030A",
          deep: "#230206",
          light: "#4D0510",
        },
        gold: {
          DEFAULT: "#C99A3D", // Temple Gold
          light: "#E8C76A",
          lighter: "#F5DE93",
          dark: "#A77B28",
          darker: "#7E5B18",
          ochre: "#D8AB34",
        },
        ivory: {
          DEFAULT: "#FFF8E8",
          warm: "#FFFDF9",
          muted: "#FAF5E9",
        },
        sandalwood: {
          DEFAULT: "#F4E6CC",
          light: "#FDF7E7",
          dark: "#E5D2B0",
        },
        dark: {
          DEFAULT: "#261A16",
          muted: "#4A3B36",
          subtle: "#665954",
        },
        ruby: {
          DEFAULT: "#8C202F",
          light: "#A82B3E",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        cinzel: ["var(--font-cinzel)", "Cinzel", "serif"],
        "cinzel-dec": ["var(--font-cinzel-dec)", "Cinzel Decorative", "serif"],
        cormorant: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        telugu: ["var(--font-telugu)", "Noto Serif Telugu", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        "gold-sm": "0 2px 10px rgba(201, 154, 61, 0.15)",
        "gold-md": "0 4px 20px rgba(201, 154, 61, 0.25)",
        "gold-lg": "0 10px 30px rgba(201, 154, 61, 0.35)",
        "gold-glow": "0 0 25px rgba(232, 199, 106, 0.4)",
        "maroon-glow": "0 0 25px rgba(90, 7, 20, 0.6)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E8C76A 0%, #C99A3D 50%, #A77B28 100%)",
        "gold-shimmer": "linear-gradient(90deg, #C99A3D 0%, #FFF8E8 50%, #C99A3D 100%)",
        "maroon-gradient": "linear-gradient(180deg, #5A0714 0%, #35030A 100%)",
        "sacred-card": "linear-gradient(180deg, rgba(74, 8, 17, 0.85) 0%, rgba(53, 3, 10, 0.95) 100%)",
        "sacred-glass": "linear-gradient(135deg, rgba(90, 7, 20, 0.6) 0%, rgba(35, 2, 6, 0.8) 100%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
