import { ViteSSG as createSSGApp } from 'vite-ssg';
import { createPinia } from 'pinia';
import App from './App.vue';
import { routes } from './router';
import './assets/main.css';

export const createApp = createSSGApp(
  App,
  {
    routes,
    scrollBehavior(to) {
      if (to.hash) {
        return { el: to.hash, behavior: 'smooth' };
      }
      return { top: 0 };
    },
  },
  ({ app }) => {
    app.use(createPinia());
  },
);
