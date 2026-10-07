import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds (NUPPA)
        'studio-black': '#0E0E0E',
        'studio-deep': '#131313',
        'studio-dark': '#1A1A1A',
        'studio-mid': '#202020',
        'studio-surface': '#282828',

        // Lima NUPPA accent
        'gold': '#DFF818',
        'gold-light': '#EAFF4D',
        'gold-dark': '#8BA000',

        // Text
        'warm-white': '#F2EEEA',

        // Status
        'teal': '#12C5DC',
        'crimson': '#FB3794',
        'blue': '#2A45F6',
      },
      fontFamily: {
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        body: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '2px',
        'sm': '2px',
        'md': '2px',
        'lg': '4px',
      },
      backgroundImage: {
        'studio-gradient': 'linear-gradient(135deg, #08060F 0%, #120D28 50%, #1A1235 100%)',
      },
    },
  },
  plugins: [],
}

export default config
