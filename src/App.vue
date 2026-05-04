<script setup lang="ts">
  import AppNav from '@/components/layout/AppNav.vue';
  import AppFooter from '@/components/layout/AppFooter.vue';
</script>

<template>
  <div class="min-h-screen">
    <AppNav />
    <main class="pt-20">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
