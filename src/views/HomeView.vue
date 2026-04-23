<script setup lang="ts">
  import HeroSection from '@/components/hero/HeroSection.vue';
  import ProjectsSection from '@/components/projects/ProjectsSection.vue';
</script>

<template>
  <div>
    <HeroSection />

    <ProjectsSection />

    <section
      id="about"
      class="px-6 py-24"
    >
      <div class="mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-white">About</h2>
        <p class="mt-4 text-gray-400">Coming in Phase 5.</p>
      </div>
    </section>

    <section
      id="contact"
      class="px-6 py-24"
    >
      <div class="mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-white">Contact</h2>
        <p class="mt-4 text-gray-400">Coming in Phase 5.</p>
      </div>
    </section>
  </div>
</template>
