/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          cyan: "#00f0ff",
          pink: "#ff007f",
          purple: "#9d00ff",
          yellow: "#ffe600",
          green: "#00ff66",
          dark: "#05070e",
          card: "rgba(10, 14, 28, 0.75)",
          gold: "#ffd700",
        },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite',
        'spin-slow': 'spin 12s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'glitch': 'glitch 1s infinite linear alternate-reverse',
        'border-flow': 'borderFlow 4s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(0, 240, 255, 0.8))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 35px rgba(255, 0, 127, 0.9))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        borderFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        }
      },
      backgroundImage: {
        'hologram-gradient': 'linear-gradient(135deg, rgba(0,240,255,0.2) 0%, rgba(157,0,255,0.2) 50%, rgba(255,0,127,0.2) 100%)',
        'gold-sheen': 'linear-gradient(105deg, #ffd700 0%, #fff2a3 50%, #d4af37 100%)',
      }
    },
  },
  plugins: [],
}
