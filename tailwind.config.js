/** @type {import('tailwindcss').Config} */
import locotosTheme from './theme-007a80-hex.json';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
      heading: ['Syne', 'sans-serif'],
      body: ['"DM Sans"', 'sans-serif'],
      display: ['Syne', 'sans-serif'],
    },
      colors: {
        // Usamos la estructura del JSON para que sea intuitivo
        locoto: {
          bg: locotosTheme.dark.bg,           // #000000
          card: locotosTheme.dark.card,       // #000000
          text: locotosTheme.dark.text,       // #F3F6F0
          muted: locotosTheme.dark.textMuted, // #F2CDEF
          primary: locotosTheme.dark.primary, // #D0E2E2
          secondary: locotosTheme.dark.secondary, // #98D8E8
          accent: locotosTheme.dark.accent,   // #81BACF
          border: locotosTheme.dark.border,   // #0A0C08
          good: locotosTheme.dark.good,       // #ABADF7
          bad: locotosTheme.dark.bad,         // #DCDCED
          warn: locotosTheme.dark.warn,       // #AEAFE1
        },
        // Paleta definida
        palette: {
          white:   '#FAFBFD',
          pink:    '#E182CB',
          sky:     '#8AD5DF',
          purple:  '#7D7ECF',
          deep:    '#27495F',
        },
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
      },
    },
  },
  plugins: [],
}