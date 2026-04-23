import type { RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/blog',
    name: 'blog',
    component: async () => import('@/views/BlogView.vue'),
  },
  {
    path: '/blog/:slug',
    name: 'blog-post',
    component: async () => import('@/views/BlogPostView.vue'),
  },
];
