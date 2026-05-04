<script setup lang="ts">
  import { ref } from 'vue';
  import { principles } from '@/data/principles';

  const hovered = ref<string | null>(null);
</script>

<template>
  <section
    id="principles"
    class="relative"
    style="padding: 120px 0; background: var(--bg-2)"
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
          color: var(--text);
          margin: 0 0 64px;
        "
      >
        06 principles
      </h2>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        style="border: 1px solid var(--line); border-radius: var(--radius)"
      >
        <div
          v-for="(p, i) in principles"
          :key="p.n"
          class="relative cursor-default"
          :style="{
            padding: '36px 32px',
            borderRight: i % 3 !== 2 ? '1px solid var(--line)' : 'none',
            borderBottom: i < 3 ? '1px solid var(--line)' : 'none',
            background: hovered === p.n ? 'oklch(0.66 0.17 48 / 0.06)' : 'transparent',
            transition: 'background 0.2s ease',
          }"
          @mouseenter="hovered = p.n"
          @mouseleave="hovered = null"
        >
          <div
            class="eyebrow mb-5"
            style="color: var(--burnt)"
          >
            {{ p.n }}
          </div>
          <h3
            style="
              font-family: var(--font-display);
              font-weight: 700;
              font-size: 17px;
              letter-spacing: -0.01em;
              color: var(--text);
              margin: 0 0 12px;
            "
          >
            {{ p.title }}
          </h3>
          <p style="font-size: 14px; line-height: 1.65; color: var(--text-3); margin: 0">
            {{ p.body }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
