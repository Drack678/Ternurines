import { defineConfig } from 'tailwindcss';

export default defineConfig({
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/styles/**/*.{css}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});
