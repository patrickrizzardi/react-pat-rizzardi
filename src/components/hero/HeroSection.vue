<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { ArrowDown, Mail } from 'lucide-vue-next';
  import AnimatedWave from './AnimatedWave.vue';

  const visible = ref(false);

  onMounted(() => {
    requestAnimationFrame(() => {
      visible.value = true;
    });
  });

  const scrollTo = (id: string): void => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };
</script>

<template>
  <section
    id="hero"
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy"
  >
    <div
      class="hero-content relative z-10 px-6 text-center"
      :class="visible ? 'is-visible' : ''"
    >
      <h1 class="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">Patrick Rizzardi</h1>

      <p class="mt-4 text-xl text-cyan sm:text-2xl">Backend Engineer</p>

      <p class="mx-auto mt-6 max-w-xl text-lg text-gray-400">
        Building high-throughput systems, training LLMs from scratch, and shipping production infrastructure that
        handles hundreds of millions of rows.
      </p>

      <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-cyan px-6 py-3 text-sm font-semibold text-navy transition-all hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan/25"
          @click="scrollTo('#projects')"
        >
          <ArrowDown :size="16" />
          View Projects
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-cyan hover:text-cyan"
          @click="scrollTo('#contact')"
        >
          <Mail :size="16" />
          Get in Touch
        </button>
      </div>
    </div>

    <AnimatedWave />
  </section>
</template>

<style scoped>
  .hero-content {
    opacity: 0;
    transform: translateY(24px);
    transition:
      opacity 0.8s ease,
      transform 0.8s ease;
  }
  .hero-content.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-content {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
</style>
