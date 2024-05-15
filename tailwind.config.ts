import plugin from "tailwindcss/plugin";

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
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      gridTemplateColumns: {
        "header-table": "minmax(0, 0.5fr) 0.8fr 1fr 0.8fr 1.5fr 0.7fr",
        "header-table-xl": "minmax(0, 0.5fr) 1.2fr 1fr 1fr 1.2fr 1.8fr",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "landing-page": "hsl(var(--landing-page))",
        "landing-cover": "hsl(var(--landing-cover))",
        "landing-cover-brighter": "hsl(var(--landing-cover-brighter))",
      },
      backgroundColor: {
        "statistic-card-gradient-start":
          "hsl(var(--statistic-card-gradient-start), 0.5)",
        "statistic-card-gradient-end":
          "hsl(var(--statistic-card-gradient-end), 0.035)",
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
        "15": "3.75rem",
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
        "thumbnail-2xl": "133px",
        "thumbnail-3xl": "170px",
        "thumbnail-5xl": "266.67px",
      },
      letterSpacing: {
        semiwide: "0.15px",
      },
      height: {
        "13": "3.25rem",
        "15": "3.75rem",
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
        "thumbnail-2xl": "200px",
        "thumbnail-3xl": "240px",
        "thumbnail-5xl": "400px",
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
        risque: ["Risque", "cursive"],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "translate-z": (value) => ({
            "--tw-translate-z": value,
            transform: ` translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`,
          }), // this is actual CSS
        },
        { values: theme("translate"), supportsNegativeValues: true }
      );
    }),
    plugin(function ({ addUtilities, theme }) {
      const rotateValues = theme("rotate", {}); // Ensure you define rotate values in your theme configuration

      const rotateXUtilities = Object.fromEntries(
        Object.entries(rotateValues).map(([key, value]) => {
          return [
            `.rotate-x-${key}`, // Class name, e.g., rotate-x-45
            {
              "--tw-rotate-x": `${value}`, // Use your rotate values from theme
              transform: "rotateX(var(--tw-rotate-x))",
            },
          ];
        })
      );

      const rotateYUtilities = Object.fromEntries(
        Object.entries(rotateValues).map(([key, value]) => {
          return [
            `.rotate-y-${key}`, // Class name, e.g., rotate-y-45
            {
              "--tw-rotate-y": `${value}`, // Use your rotate values from theme
              transform: "rotateY(var(--tw-rotate-y))",
            },
          ];
        })
      );

      addUtilities(rotateXUtilities);
      addUtilities(rotateYUtilities);
    }),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "rotate-x": (value) => ({
            "--tw-rotate-x": value,
            transform: `rotateX(var(--tw-rotate-x))`,
          }),
          "rotate-y": (value) => ({
            "--tw-rotate-y": value,
            transform: `rotateY(var(--tw-rotate-y))`,
          }),
        },
        {
          values: theme("rotate", {
            auto: "auto", // default or common values can still be specified in theme
          }),
          supportsNegativeValues: true,
        }
      );
    }),
  ],
};
