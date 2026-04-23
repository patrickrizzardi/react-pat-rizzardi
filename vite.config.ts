import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import Markdown from 'unplugin-vue-markdown/vite';
import Shiki from '@shikijs/markdown-it';

export default defineConfig({
  plugins: [
    vue({ include: [/\.vue$/, /\.md$/] }),
    Markdown({
      async markdownItSetup(md) {
        md.use(
          await Shiki({
            theme: 'github-dark',
          }),
        );
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
