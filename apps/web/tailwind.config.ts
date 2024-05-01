import type { Config } from 'tailwindcss'
import { mantine_tw_preset } from './tailwind.mantine.preset'
import { shadcn_tw_preset } from './tailwind.shadcn.preset'

const config = {
  darkMode: ['class', '[data-mantine-color-scheme="dark"]'],
  presets: [mantine_tw_preset, shadcn_tw_preset],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
} satisfies Config

export default config
