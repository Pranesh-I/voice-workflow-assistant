/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: 'rgba(255, 255, 255, 0.04)',
          hover: 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        neon: {
          cyan: '#06d6a0',
          purple: '#8b5cf6',
          blue: '#3b82f6',
          pink: '#ec4899',
        },
        "mist-bg": "#F5F7FA",
        "fog-layer": "#EEF2F6",
        "soft-graphite": "#1F2937",
        "signal-cyan": "#3DDCFF",
        "assistant-teal": "#4FD1C5",
        "assistant-violet": "#8B5CF6",
        "assistant-lavender": "#C4B5FD",
        "glow-core": "#FFFFFF"
      },
      backgroundImage: {
        "assistant-gradient": "linear-gradient(135deg, #3DDCFF 0%, #4FD1C5 35%, #8B5CF6 70%, #C4B5FD 100%)"
      },
      boxShadow: {
        "assistant-glow": "0 0 40px rgba(61,220,255,0.25), 0 0 80px rgba(139,92,246,0.18)"
      },
      backdropBlur: {
        xs: "2px"
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(1.2)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundSize: {
        '300%': '300% 300%',
      },
    },
  },
  plugins: [],
}
