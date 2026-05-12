import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        secondary: '#888888',
        border: '#E8E8E8',
        bg: '#FAFAFA',
        success: '#1D9E75',
        error: '#E24B4A',
        warning: '#D85A30',
      },
      spacing: {
        '4.5': '1.125rem',
      },
    },
  },
  plugins: [],
} satisfies Config
