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
    },
    screens: {
      "2xs": "361px",
      xs: "420px",
      "2xl": "1535px",
    },
    extend: {
      gridTemplateColumns: {
        "header-table": "minmax(0, 0.5fr) 0.8fr 1fr 0.8fr 1.5fr 0.7fr",
        "header-table-xl": "minmax(0, 0.5fr) 1.2fr 1fr 1fr 1.2fr 1.8fr",
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
        error: {
          DEFAULT: "rgb(var(--error))",
          // foreground: "rgb(var(--error-foreground))",
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
        "5xl": "2.5rem",
      },
      borderWidth: {
        1: "1px",
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
      padding: {
        "7.5": "1.875rem",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin 1.3s linear infinite",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      fontSize: {
        "2xs": "0.625rem",
        "6.5xl": "4rem",
      },
      lineHeight: {
        "16": "4rem",
        "5.5": "1.375rem",
        "7.5": "1.875rem",
      },
      width: {
        "22": "5.5rem",
        "30": "7.5rem",
        "136": "34rem",
        "144": "36rem",
        "288": "72rem",
        modal: "40rem" /* this is in pixels: 536px */,
        "modal-md": "32rem",
        "modal-sm": "28rem",
        "search-bar": "65vw",
        "thumbnail-2xs": "36px",
        "thumbnail-xs": "40px",
        "thumbnail-sm": "66.67px",
        "thumbnail-md": "80px",
        "thumbnail-lg": "92px",
        "thumbnail-xl": "120px",
        "thumbnail-2xl": "140px",
        "thumbnail-3xl": "170px",
      },
      letterSpacing: {
        semiwide: "0.15px",
      },
      height: {
        "13": "3.25rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "136": "34rem",
        "144": "36rem",
        "288": "72rem",
        modal: "40rem" /* this is in pixels: 536px */,
        "modal-md": "32rem",
        "modal-sm": "28rem",
        "screen-fill": "100vh", // Fallback
        screen: "-webkit-fill-available", // For Safari
        "thumbnail-2xs": "44px",
        "thumbnail-xs": "60px",
        "thumbnail-sm": "100px",
        "thumbnail-md": "120px",
        "thumbnail-lg": "140px",
        "thumbnail-xl": "180px",
        "thumbnail-2xl": "210px",
        "thumbnail-3xl": "240px",
      },
      minHeight: {
        "screen-fill": "100vh", // Fallback
        screen: "-webkit-fill-available", // For Safari
      },
      maxHeight: {
        "screen-fill": "100vh", // Fallback
        screen: "-webkit-fill-available", // For Safari
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
