/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)"
          },
          "50%": {
            opacity: "0.8",
            transform: "scale(1.05)"
          }
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0px)"
          },
          "50%": {
            transform: "translateY(-10px)"
          }
        },
        "spin-slow": {
          "from": {
            transform: "rotate(0deg)"
          },
          "to": {
            transform: "rotate(360deg)"
          }
        },
        "shimmer": {
          "0%": {
            backgroundPosition: "-200% 0"
          },
          "100%": {
            backgroundPosition: "200% 0"
          }
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" }
        },
        "heartbeat": {
          "0%, 50%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.1)" }
        },
        "bounce-in": {
          "0%": {
            transform: "scale(0.3)",
            opacity: "0"
          },
          "50%": {
            transform: "scale(1.05)"
          },
          "70%": {
            transform: "scale(0.9)"
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1"
          }
        },
        "tada": {
          "0%": {
            transform: "scale3d(1, 1, 1)"
          },
          "10%, 20%": {
            transform: "scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)"
          },
          "30%, 50%, 70%, 90%": {
            transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)"
          },
          "40%, 60%, 80%": {
            transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)"
          },
          "100%": {
            transform: "scale3d(1, 1, 1)"
          }
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.4)"
          },
          "50%": {
            opacity: "0.8",
            transform: "scale(1.05)",
            boxShadow: "0 0 0 10px rgba(59, 130, 246, 0)"
          }
        },
        "scale-up": {
          "from": {
            transform: "scale(0.95)",
            opacity: "0.8"
          },
          "to": {
            transform: "scale(1)",
            opacity: "1"
          }
        },
        "success-bounce": {
          "0%": {
            transform: "scale(1)"
          },
          "50%": {
            transform: "scale(1.1)"
          },
          "100%": {
            transform: "scale(1)"
          }
        },
        "reject-shake": {
          "0%, 100%": {
            transform: "translateX(0)"
          },
          "10%, 30%, 50%, 70%, 90%": {
            transform: "translateX(-3px)"
          },
          "20%, 40%, 60%, 80%": {
            transform: "translateX(3px)"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "spin-slow": "spin-slow 3s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
        "wiggle": "wiggle 1s ease-in-out",
        "heartbeat": "heartbeat 2s ease-in-out infinite",
        "bounce-in": "bounce-in 0.6s ease-out",
        "tada": "tada 1s ease-in-out",
        "scale-up": "scale-up 0.3s ease-out",
        "success-bounce": "success-bounce 0.6s ease-out",
        "reject-shake": "reject-shake 0.5s ease-in-out"
      },
      boxShadow: {
        "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        "neon": "0 0 5px theme('colors.primary.DEFAULT'), 0 0 20px theme('colors.primary.DEFAULT'), 0 0 35px theme('colors.primary.DEFAULT')",
        "glow": "0 0 20px rgba(59, 130, 246, 0.5)",
        "elevated": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        "floating": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}