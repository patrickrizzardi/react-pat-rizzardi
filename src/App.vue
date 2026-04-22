<script setup lang="ts">
  import { useTheme } from '@/composables/useTheme';
  import AppNav from '@/components/layout/AppNav.vue';
  import AppFooter from '@/components/layout/AppFooter.vue';

  useTheme();
</script>

<template>
  <div class="min-h-screen bg-navy text-white dark:bg-navy dark:text-white">
    <AppNav />
    <main class="pt-16">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
