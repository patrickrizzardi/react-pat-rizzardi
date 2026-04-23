<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { ArrowDown, Mail } from 'lucide-vue-next';
  import HeroMetrics from './HeroMetrics.vue';

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
    class="hero-bg relative flex min-h-screen items-center justify-center overflow-hidden"
  >
    <div class="hero-orbs pointer-events-none absolute inset-0" />

    <div
      class="hero-content relative z-10 w-full max-w-4xl px-6 text-center"
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

      <HeroMetrics />
    </div>

    <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-navy" />
  </section>
</template>

<style scoped>
  .hero-bg {
    background-color: var(--color-navy);
    background-image: radial-gradient(rgba(34, 211, 238, 0.12) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: radial-gradient(ellipse 70% 70% at 50% 45%, #000 30%, transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 45%, #000 30%, transparent 100%);
  }

  .hero-orbs {
    background:
      radial-gradient(600px circle at 25% 30%, rgba(34, 211, 238, 0.06), transparent),
      radial-gradient(500px circle at 75% 60%, rgba(34, 211, 238, 0.04), transparent),
      radial-gradient(400px circle at 50% 80%, rgba(34, 211, 238, 0.03), transparent);
  }

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
