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
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      colors: {
        minimal: {
          bg: '#ffffff',
          card: '#fafafa',
          text: '#1a1a2e',
          textMuted: '#6b6b6b',
          border: '#e5e5e5',
          accent: '#2563eb',
        },
        dark: {
          bg: '#0f0f12',
          card: '#1a1a1f',
          text: '#f3f4f6',
          textMuted: '#9ca3af',
          border: '#2e2e3a',
          accent: '#60a5fa',
        },
        warm: {
          bg: '#fdf8f3',
          card: '#fff5eb',
          text: '#4a3728',
          textMuted: '#8b7355',
          border: '#e8d5c4',
          accent: '#d97706',
        },
        mono: {
          bg: '#000000',
          card: '#111111',
          text: '#ffffff',
          textMuted: '#888888',
          border: '#333333',
          accent: '#ffffff',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'flip-out': 'flipOut 0.4s ease-in forwards',
        'flip-in': 'flipIn 0.4s ease-out 0.2s forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flipOut: {
          '0%': { transform: 'rotateX(0deg)', opacity: '1' },
          '100%': { transform: 'rotateX(-90deg)', opacity: '0' },
        },
        flipIn: {
          '0%': { transform: 'rotateX(90deg)', opacity: '0' },
          '100%': { transform: 'rotateX(0deg)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

