<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import NeuronCanvas from './NeuronCanvas.vue';
  import AppButton from '@/components/ui/AppButton.vue';
  import { scrollToSection } from '@/utils/scroll';
  import { useDecoder } from '@/composables/useDecoder';
  import { siteConfig } from '@/data/siteConfig';
  import { metrics } from '@/data/metrics';

  const METRIC_STAGGER_INITIAL_MS = 500;
  const METRIC_STAGGER_INTERVAL_MS = 120;

  const callsign = useDecoder('patrick.rizzardi', 200);

  const metricVisible = ref(metrics.map(() => false));

  const timeouts: Array<ReturnType<typeof setTimeout>> = [];

  onMounted(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      metricVisible.value = metrics.map(() => true);
    } else {
      metrics.forEach((_, i) => {
        timeouts.push(
          setTimeout(
            () => {
              metricVisible.value[i] = true;
            },
            METRIC_STAGGER_INITIAL_MS + i * METRIC_STAGGER_INTERVAL_MS,
          ),
        );
      });
    }
  });

  onUnmounted(() => {
    timeouts.forEach(clearTimeout);
  });
</script>

<template>
  <section
    id="top"
    class="relative flex min-h-screen items-center overflow-hidden pt-[120px] pb-[80px]"
  >
    <NeuronCanvas />

    <!-- Dark veil -->
    <div
      class="pointer-events-none absolute inset-0 z-[1]"
      style="background: oklch(0.14 0.012 55 / 0.55)"
    />
    <!-- Radial vignette -->
    <div
      class="pointer-events-none absolute inset-0 z-[1]"
      style="
        background: radial-gradient(
          ellipse 70% 60% at 50% 45%,
          transparent 0%,
          oklch(0.12 0.01 50 / 0.55) 70%,
          oklch(0.1 0.01 50 / 0.85) 100%
        );
      "
    />

    <div class="scan-grid z-[1]" />

    <!-- Content container -->
    <div class="relative z-[2] mx-auto w-full max-w-6xl px-6">
      <!-- Vertical side label (desktop only) -->
      <div
        class="absolute top-0 right-6 hidden font-mono text-[11px] tracking-[0.18em] text-fg-4 uppercase md:block"
        style="writing-mode: vertical-rl"
      >
        cheddar / 2026 — engineering log
      </div>

      <!-- Callsign + GitHub chip row -->
      <div class="flex flex-wrap items-center gap-3">
        <div
          class="inline-flex items-center gap-2.5 rounded-full border border-line bg-card px-3 py-1.5 font-mono text-[12px] text-fg-3"
          style="backdrop-filter: blur(8px)"
        >
          <span
            style="
              width: 6px;
              height: 6px;
              border-radius: 99px;
              background: oklch(0.74 0.21 145);
              box-shadow: 0 0 12px oklch(0.74 0.21 145 / 0.7);
              flex-shrink: 0;
            "
          />
          <span class="text-fg-2">cheddar://</span>
          <span class="text-fg">{{ callsign }}</span>
          <span class="ml-1 text-fg-4">·</span>
          <span style="color: oklch(0.74 0.21 145)">open to work</span>
        </div>

        <AppButton
          variant="chip"
          as="a"
          :href="siteConfig.github"
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
          >↗ github</AppButton
        >
      </div>

      <!-- Headline -->
      <h1
        class="mt-[24px] font-display text-[clamp(40px,6vw,88px)] leading-none font-extrabold tracking-[-0.04em] text-fg"
      >
        I architect
        <span class="font-accent font-normal tracking-[-0.02em] text-burnt-hi italic">backend</span><br />
        systems built
        <span
          style="
            background-image: linear-gradient(transparent 70%, oklch(0.66 0.17 48 / 0.45) 70%);
            background-size: 100% 100%;
            background-repeat: no-repeat;
          "
          >to last</span
        ><br />
        at scale.
      </h1>

      <!-- Subhead -->
      <p class="mt-[28px] max-w-[680px] text-[19px] leading-[1.55] text-fg-2">
        Principal Engineer &amp; Architect. Leading a team of 4 at a $2M/mo platform, while building a Rust LLVM
        compiler and an LLM from bare metal, solo. Leadership creates alignment&thinsp;—&thinsp;engineering creates
        leverage.
      </p>

      <!-- CTA row -->
      <div class="mt-[40px] flex flex-wrap items-center gap-3.5">
        <AppButton
          variant="primary"
          @click="scrollToSection('systems')"
        >
          <span>view systems</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            class="ml-[10px]"
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </AppButton>

        <AppButton
          variant="ghost"
          @click="scrollToSection('contact')"
        >
          let's talk ↗
        </AppButton>

        <span class="ml-2 font-mono text-[12px] text-fg-3">
          ↳ open to · principal/staff · founding eng · contract
        </span>
      </div>

      <!-- Metrics row -->
      <div class="mt-[80px] grid grid-cols-2 gap-7 border-t border-line-soft pt-[28px] md:grid-cols-4">
        <div
          v-for="(metric, i) in metrics"
          :key="metric.label"
          :style="{
            opacity: metricVisible[i] ? 1 : 0,
            transform: metricVisible[i] ? 'none' : 'translateY(10px)',
            transition: 'opacity 0.6s, transform 0.6s',
          }"
        >
          <div class="font-display text-[40px] leading-none font-bold tracking-[-0.03em] text-cheddar-hi">
            {{ metric.value }}
          </div>
          <div class="mt-2 font-mono text-[11px] tracking-[0.14em] text-fg-3 uppercase">
            {{ metric.label }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
