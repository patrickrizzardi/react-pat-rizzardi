<script setup lang="ts">
  import AppNav from '@/components/layout/AppNav.vue';
  import AppFooter from '@/components/layout/AppFooter.vue';
</script>

<template>
  <div class="min-h-screen">
    <AppNav />
    <!-- pt clears the fixed full-width nav bar via the --nav-h token (src/assets/main.css), which tracks the bar height per breakpoint. Anchored scroll uses the live measured nav height (src/utils/scroll.ts). -->
    <main class="pt-[var(--nav-h)]">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
