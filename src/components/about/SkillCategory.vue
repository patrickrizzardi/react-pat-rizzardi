<script setup lang="ts">
  defineProps<{
    category: string;
    skills: ReadonlyArray<string>;
  }>();
</script>

<template>
  <div>
    <h4 class="text-cyan mb-3 text-sm font-semibold tracking-wider uppercase">{{ category }}</h4>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="skill in skills"
        :key="skill"
        class="rounded-md bg-white/5 px-3 py-1.5 text-sm text-gray-300"
      >
        {{ skill }}
      </span>
    </div>
  </div>
</template>
