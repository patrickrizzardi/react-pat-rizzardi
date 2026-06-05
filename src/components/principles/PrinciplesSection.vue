<script setup lang="ts">
  import { ref } from 'vue';
  import { principles } from '@/data/principles';

  const hovered = ref<string | null>(null);
</script>

<template>
  <section
    id="principles"
    class="relative bg-surface-2 py-[120px]"
  >
    <div class="mx-auto max-w-6xl px-6">
      <div class="eyebrow mb-5">operating principles</div>
      <h2
        class="mb-[64px] font-display text-[clamp(32px,4vw,56px)] leading-[1.05] font-extrabold tracking-[-0.03em] text-fg"
      >
        06 principles
      </h2>

      <!-- Grid lines via gap-px over a line-colored container: correct at any column count
           (1/2/3 across breakpoints) with no per-cell nth-child math. -->
      <div
        class="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line md:grid-cols-2 lg:grid-cols-3"
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
          <div class="eyebrow mb-5 text-burnt">
            {{ p.ordinal }}
          </div>
          <h3 class="mb-3 font-display text-[17px] font-bold tracking-[-0.01em] text-fg">
            {{ p.title }}
          </h3>
          <p class="m-0 text-[14px] leading-[1.65] text-fg-3">
            {{ p.body }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
