<script setup lang="ts">
  // SVG intrinsic dimensions: 902×605px → 902÷605 ≈ 1.49
  const LOGO_ASPECT_RATIO = 1.49;

  withDefaults(defineProps<{ size?: number }>(), { size: 24 });
</script>

<template>
  <span
    class="inline-flex items-center gap-2 select-none"
    style="
      font-family: var(--font-mono);
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.02em;
      color: var(--color-fg);
    "
  >
    <img
      src="/cheddar-logo.svg"
      alt="Cheddar"
      :style="{ height: `${size}px`, width: `${Math.round(size * LOGO_ASPECT_RATIO)}px`, flexShrink: 0 }"
    />
    <span>cheddar<span style="color: var(--color-burnt-hi)">.</span></span>
  </span>
</template>
