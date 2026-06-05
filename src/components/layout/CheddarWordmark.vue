<script setup lang="ts">
  // SVG intrinsic dimensions: 902×605px → 902÷605 ≈ 1.49
  const LOGO_ASPECT_RATIO = 1.49;

  withDefaults(defineProps<{ size?: number }>(), { size: 24 });
</script>

<template>
  <span class="inline-flex items-center gap-2 font-mono text-[13px] font-bold tracking-[0.02em] text-fg select-none">
    <img
      src="/cheddar-logo.svg"
      alt="Cheddar"
      :style="{ height: `${size}px`, width: `${Math.round(size * LOGO_ASPECT_RATIO)}px`, flexShrink: 0 }"
    />
    <span>cheddar<span class="text-burnt-hi">.</span></span>
  </span>
</template>
