<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import NeuronCanvas from './NeuronCanvas.vue';
  import { useDecoder } from '@/composables/useDecoder';
  import { useMagneticButton } from '@/composables/useMagneticButton';
  import { siteConfig } from '@/data/siteConfig';
  import { metrics } from '@/data/metrics';

  const callsign = useDecoder('patrick.rizzardi', 200);
  const { buttonRef, onMouseMove, onMouseLeave } = useMagneticButton();

  const clock = ref('');
  const metricVisible = ref([false, false, false, false]);
  const ctaHover = ref(false);
  const githubHover = ref(false);

  let clockInterval = 0;
  const timeouts: Array<ReturnType<typeof setTimeout>> = [];

  const updateClock = (): void => {
    const t = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      timeZone: 'America/New_York',
    });
    clock.value = `${t} ET`;
  };

  const scrollTo = (id: string): void => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
  };

  onMounted(() => {
    updateClock();
    clockInterval = window.setInterval(updateClock, 1000);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      metricVisible.value = [true, true, true, true];
    } else {
      metrics.forEach((_, i) => {
        timeouts.push(
          setTimeout(
            () => {
              metricVisible.value[i] = true;
            },
            500 + i * 120,
          ),
        );
      });
    }
  });

  onUnmounted(() => {
    clearInterval(clockInterval);
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
          color: var(--text-4);
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
            color: var(--text-3);
            padding: 6px 12px;
            border: 1px solid var(--line);
            border-radius: 999px;
            background: var(--card);
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
          <span style="color: var(--text-2)">cheddar://</span>
          <span style="color: var(--text)">{{ callsign }}</span>
          <span style="color: var(--text-4); margin-left: 4px">·</span>
          <span>{{ clock }}</span>
        </div>

        <a
          :href="siteConfig.github"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center"
          :style="{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: githubHover ? 'var(--text)' : 'var(--text-3)',
            padding: '5px 10px',
            border: `1px solid ${githubHover ? 'var(--burnt-hi)' : 'var(--line)'}`,
            borderRadius: '999px',
            background: 'var(--card)',
            backdropFilter: 'blur(8px)',
            textDecoration: 'none',
            transition: 'color 0.2s, border-color 0.2s',
          }"
          @mouseenter="githubHover = true"
          @mouseleave="githubHover = false"
          >↗ github</a
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
          color: var(--text);
          margin: 24px 0 0;
        "
      >
        I architect
        <span
          style="
            font-family: var(--font-accent);
            font-style: italic;
            font-weight: 400;
            color: var(--burnt-hi);
            letter-spacing: -0.02em;
          "
          >backend</span
        ><br />
        systems that
        <span
          style="
            background-image: linear-gradient(transparent 70%, oklch(0.66 0.17 48 / 0.45) 70%);
            background-size: 100% 100%;
            background-repeat: no-repeat;
          "
          >stay profitable</span
        ><br />
        at scale.
      </h1>

      <!-- Subhead -->
      <p style="margin-top: 28px; max-width: 680px; font-size: 19px; line-height: 1.55; color: var(--text-2)">
        Engineering Lead &amp; Architect. From a trading platform that pays its own bills, to an LLM trained from bare
        metal. I care about the systems nobody sees until they break&thinsp;—&thinsp;and the ones that don&rsquo;t.
      </p>

      <!-- CTA row -->
      <div
        class="flex flex-wrap items-center gap-3.5"
        style="margin-top: 40px"
      >
        <button
          ref="buttonRef"
          type="button"
          class="relative inline-flex cursor-pointer items-center gap-2.5"
          style="
            font-family: var(--font-mono);
            font-size: 13px;
            font-weight: 600;
            color: var(--bg);
            background: linear-gradient(180deg, var(--burnt-hi) 0%, var(--burnt) 55%, var(--ember) 100%);
            padding: 14px 24px;
            border-radius: 999px;
            border: none;
            box-shadow:
              0 10px 30px -14px oklch(0.66 0.17 48 / 0.5),
              inset 0 1px 0 oklch(1 0 0 / 0.2);
            transition: transform 0.2s ease;
          "
          @click="scrollTo('systems')"
          @mousemove="onMouseMove"
          @mouseleave="onMouseLeave"
        >
          <span>view systems</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </button>

        <button
          type="button"
          class="inline-flex cursor-pointer items-center"
          :style="{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: ctaHover ? 'var(--burnt-hi)' : 'var(--text)',
            background: 'transparent',
            padding: '14px 22px',
            borderRadius: '999px',
            border: `1px solid ${ctaHover ? 'var(--burnt)' : 'oklch(0.66 0.17 48 / 0.5)'}`,
            transition: 'border-color 0.2s, color 0.2s',
          }"
          @click="scrollTo('contact')"
          @mouseenter="ctaHover = true"
          @mouseleave="ctaHover = false"
        >
          open a thread
        </button>

        <span
          class="ml-2"
          style="font-family: var(--font-mono); font-size: 12px; color: var(--text-3)"
        >
          ↳ available · CTO + Eng Lead
        </span>
      </div>

      <!-- Metrics row -->
      <div
        class="grid grid-cols-2 gap-7 md:grid-cols-4"
        style="margin-top: 80px; padding-top: 28px; border-top: 1px solid var(--line-soft)"
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
              color: var(--cheddar-hi);
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
              color: var(--text-3);
            "
          >
            {{ metric.label }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
