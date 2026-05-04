<script setup lang="ts">
  defineProps<{ label: string }>();
</script>

<template>
  <span class="border-cyan/20 bg-cyan/10 text-cyan rounded-full border px-3 py-1 text-xs">
    {{ label }}
  </span>
</template>
