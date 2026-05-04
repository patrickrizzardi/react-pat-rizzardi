<script setup lang="ts">
  withDefaults(defineProps<{ size?: number }>(), { size: 24 });
</script>

<template>
  <span
    class="inline-flex items-center gap-2 select-none"
    style="font-family: var(--font-mono); font-weight: 700; font-size: 13px; letter-spacing: 0.02em; color: var(--text)"
  >
    <img
      src="/cheddar-emblem.png"
      alt="Cheddar"
      :style="{ width: `${size}px`, height: `${size}px`, objectFit: 'contain' }"
    />
    <span>cheddar<span style="color: var(--burnt-hi)">.</span></span>
  </span>
</template>
