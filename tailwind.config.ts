/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      gridTemplateColumns: {
        "header-table": "minmax(0, 0.5fr) 1.2fr 2fr 2fr 1.2fr 1.4fr",
      },
      colors: {
        border: "rgb(var(--border))",
        input: "rgb(var(--input))",
        ring: "rgb(var(--ring))",
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
          weak: "rgb(var(--primary-weak))",
          // foreground: "rgb(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive))",
          foreground: "rgb(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "rgb(var(--popover))",
          foreground: "rgb(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "rgb(var(--card))",
          foreground: "rgb(var(--card-foreground))",
        },
      },
      backgroundColor: {
        "statistic-card-gradient-start":
          "rgba(var(--statistic-card-gradient-start), 0.5)",
        "statistic-card-gradient-end":
          "rgba(var(--statistic-card-gradient-end), 0.035)",
      },
      transitionDuration: {
        "250": "250ms",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontSize: {
        "6.5xl": "4rem",
      },
      lineHeight: {
        "16": "4rem",
      },
      width: {
        "22": "5.5rem",
        "288": "72rem",
        comments: "33.5rem",
        modal: "82rem",
      },
      height: {
        "22": "5.5rem",
        "136": "34rem",
        "144": "36rem",
        "288": "72rem",
        modal: "33.5rem" /* this is in pixels: 536px */,
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
