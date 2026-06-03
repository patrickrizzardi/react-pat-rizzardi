<script setup lang="ts">
  import AppNav from '@/components/layout/AppNav.vue';
  import AppFooter from '@/components/layout/AppFooter.vue';
</script>

<template>
  <div class="min-h-screen">
    <AppNav />
    <!-- pt clears the fixed full-width nav bar (~61px desktop / ~54px mobile); 64px clears both with a hairline gap. Anchored scroll uses the live measured nav height (src/utils/scroll.ts). -->
    <main class="pt-[64px]">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
