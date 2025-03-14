import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: { max: '639px' },
        xxs: { max: '375px' },
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      spacing: {
        72: '18rem',
        84: '21rem',
        96: '24rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
