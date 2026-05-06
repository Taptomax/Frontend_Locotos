/** @type {import('tailwindcss').Config} */
import locotosTheme from './theme-007a80-hex.json';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mapeamos los colores del modo DARK del JSON
        'locoto-bg': locotosTheme.dark.bg,           // #000000
        'locoto-primary': locotosTheme.dark.primary, // #D0E2E2 (Casi blanco/teal)
        'locoto-secondary': locotosTheme.dark.secondary, // #98D8E8 (Azul claro)
        'locoto-accent': locotosTheme.dark.accent,   // #81BACF (Celeste vibrante)
        'locoto-div': '#27495f', 
        'locoto-text': locotosTheme.dark.text,       // #F3F6F0 (Blanco hueso)
        'locoto-muted': locotosTheme.dark.textMuted, // #F2CDEF (Rosa/Lila apagado)
        'locoto-success': locotosTheme.dark.good,    // #ABADF7 (Lavanda)
        'locoto-error': locotosTheme.dark.bad,       // #DCDCED (Gris frío)
      },
    },
  },
  plugins: [],
}