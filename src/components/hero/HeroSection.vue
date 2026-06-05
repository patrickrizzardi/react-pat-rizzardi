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
    class="relative flex min-h-screen items-center overflow-hidden"
    style="padding-top: 120px; padding-bottom: 80px"
  >
    <NeuronCanvas />

    <!-- Dark veil -->
    <div
      class="pointer-events-none absolute inset-0"
      style="background: oklch(0.14 0.012 55 / 0.55); z-index: 1"
    />
    <!-- Radial vignette -->
    <div
      class="pointer-events-none absolute inset-0"
      style="
        background: radial-gradient(
          ellipse 70% 60% at 50% 45%,
          transparent 0%,
          oklch(0.12 0.01 50 / 0.55) 70%,
          oklch(0.1 0.01 50 / 0.85) 100%
        );
        z-index: 1;
      "
    />

    <div
      class="scan-grid"
      style="z-index: 1"
    />

    <!-- Content container -->
    <div
      class="relative mx-auto w-full max-w-6xl px-6"
      style="z-index: 2"
    >
      <!-- Vertical side label (desktop only) -->
      <div
        class="absolute hidden md:block"
        style="
          right: 24px;
          top: 0;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-fg-4);
          text-transform: uppercase;
          letter-spacing: 0.18em;
          writing-mode: vertical-rl;
        "
      >
        cheddar / 2026 — engineering log
      </div>

      <!-- Callsign + GitHub chip row -->
      <div class="flex flex-wrap items-center gap-3">
        <div
          class="inline-flex items-center gap-2.5"
          style="
            font-family: var(--font-mono);
            font-size: 12px;
            color: var(--color-fg-3);
            padding: 6px 12px;
            border: 1px solid var(--color-line);
            border-radius: 999px;
            background: var(--color-card);
            backdrop-filter: blur(8px);
          "
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
          <span style="color: var(--color-fg-2)">cheddar://</span>
          <span style="color: var(--color-fg)">{{ callsign }}</span>
          <span style="color: var(--color-fg-4); margin-left: 4px">·</span>
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
        style="
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(40px, 6vw, 88px);
          line-height: 1;
          letter-spacing: -0.04em;
          color: var(--color-fg);
          margin: 24px 0 0;
        "
      >
        I architect
        <span
          style="
            font-family: var(--font-accent);
            font-style: italic;
            font-weight: 400;
            color: var(--color-burnt-hi);
            letter-spacing: -0.02em;
          "
          >backend</span
        ><br />
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
      <p style="margin-top: 28px; max-width: 680px; font-size: 19px; line-height: 1.55; color: var(--color-fg-2)">
        Principal Engineer &amp; Architect. Leading a team of 4 at a $2M/mo platform, while building a Rust LLVM
        compiler and an LLM from bare metal, solo. Leadership creates alignment&thinsp;—&thinsp;engineering creates
        leverage.
      </p>

      <!-- CTA row -->
      <div
        class="flex flex-wrap items-center gap-3.5"
        style="margin-top: 40px"
      >
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
            style="margin-left: 10px"
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

        <span
          class="ml-2"
          style="font-family: var(--font-mono); font-size: 12px; color: var(--color-fg-3)"
        >
          ↳ open to · principal/staff · founding eng · contract
        </span>
      </div>

      <!-- Metrics row -->
      <div
        class="grid grid-cols-2 gap-7 md:grid-cols-4"
        style="margin-top: 80px; padding-top: 28px; border-top: 1px solid var(--color-line-soft)"
      >
        <div
          v-for="(metric, i) in metrics"
          :key="metric.label"
          :style="{
            opacity: metricVisible[i] ? 1 : 0,
            transform: metricVisible[i] ? 'none' : 'translateY(10px)',
            transition: 'opacity 0.6s, transform 0.6s',
          }"
        >
          <div
            style="
              font-family: var(--font-display);
              font-weight: 700;
              font-size: 40px;
              line-height: 1;
              letter-spacing: -0.03em;
              color: var(--color-cheddar-hi);
            "
          >
            {{ metric.value }}
          </div>
          <div
            style="
              margin-top: 8px;
              font-family: var(--font-mono);
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.14em;
              color: var(--color-fg-3);
            "
          >
            {{ metric.label }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
