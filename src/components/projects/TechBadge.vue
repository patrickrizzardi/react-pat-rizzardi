<script setup lang="ts">
  defineProps<{ label: string }>();
</script>

<template>
  <span class="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs text-cyan">
    {{ label }}
  </span>
</template>
