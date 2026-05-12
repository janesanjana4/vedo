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
        '0.25': '0.0625rem',
        '0.5': '0.125rem',
        '0.75': '0.1875rem',
        '1.25': '0.3125rem',
        '1.5': '0.375rem',
        '1.75': '0.4375rem',
        '2.25': '0.5625rem',
        '2.5': '0.625rem',
        '3.25': '0.8125rem',
        '3.5': '0.875rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7': '1.75rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
        '9.5': '2.375rem',
        '10.5': '2.625rem',
        '11.5': '2.875rem',
        '12.5': '3.125rem',
        '13.5': '3.375rem',
        '14.5': '3.625rem',
        '15': '3.75rem',
        '46': '11.5rem',
        '104': '26rem',
      },
    },
  },
  plugins: [],
} satisfies Config
