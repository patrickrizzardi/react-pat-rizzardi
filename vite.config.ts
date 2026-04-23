import { readdirSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import markdown from 'unplugin-vue-markdown/vite';
import shikiPlugin from '@shikijs/markdown-it';
import generateSitemap from 'vite-ssg-sitemap';

export default defineConfig({
  plugins: [
    vue({ include: [/\.vue$/, /\.md$/] }),
    markdown({
      async markdownItSetup(md) {
        md.use(
          await shikiPlugin({
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
  ssgOptions: {
    includedRoutes: (paths: Array<string>) => {
      const blogDir = fileURLToPath(new URL('./src/content/blog', import.meta.url));
      const blogSlugs = readdirSync(blogDir)
        .filter((f) => f.endsWith('.md'))
        .map((f) => `/blog/${f.replace(/\.md$/, '')}`);
      return [...paths, ...blogSlugs];
    },
    onFinished: () => {
      generateSitemap({
        hostname: 'https://redact.digital',
        exclude: ['/blog/:slug'],
      });
    },
  },
});
