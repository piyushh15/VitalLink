import { defineConfig } from 'vite';
import postcss from 'vite-plugin-postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [
    postcss({
      plugins: [
        autoprefixer(),
        tailwindcss(),
      ],
    }),
  ],
});
