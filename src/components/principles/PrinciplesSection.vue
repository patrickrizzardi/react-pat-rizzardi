<script setup lang="ts">
  import { ref } from 'vue';
  import { principles } from '@/data/principles';

  const hovered = ref<string | null>(null);
</script>

<template>
  <section
    id="principles"
    class="relative"
    style="padding: 120px 0; background: var(--color-surface-2)"
  >
    <div class="mx-auto max-w-6xl px-6">
      <div class="eyebrow mb-5">operating principles</div>
      <h2
        style="
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(32px, 4vw, 56px);
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: var(--color-fg);
          margin: 0 0 64px;
        "
      >
        06 principles
      </h2>

      <!-- Grid lines via gap-px over a line-colored container: correct at any column count
           (1/2/3 across breakpoints) with no per-cell nth-child math. -->
      <div
        class="grid grid-cols-1 gap-px overflow-hidden md:grid-cols-2 lg:grid-cols-3"
        style="border: 1px solid var(--color-line); border-radius: var(--radius); background: var(--color-line)"
      >
        <div
          v-for="p in principles"
          :key="p.ordinal"
          class="relative cursor-default"
          :style="{
            padding: '36px 32px',
            background: 'var(--color-surface-2)',
            boxShadow:
              hovered === p.ordinal ? 'inset 0 0 0 999px oklch(0.66 0.17 48 / 0.06)' : 'inset 0 0 0 999px transparent',
            transition: 'box-shadow 0.2s ease',
          }"
          @mouseenter="hovered = p.ordinal"
          @mouseleave="hovered = null"
        >
          <div
            class="eyebrow mb-5"
            style="color: var(--color-burnt)"
          >
            {{ p.ordinal }}
          </div>
          <h3
            style="
              font-family: var(--font-display);
              font-weight: 700;
              font-size: 17px;
              letter-spacing: -0.01em;
              color: var(--color-fg);
              margin: 0 0 12px;
            "
          >
            {{ p.title }}
          </h3>
          <p style="font-size: 14px; line-height: 1.65; color: var(--color-fg-3); margin: 0">
            {{ p.body }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
