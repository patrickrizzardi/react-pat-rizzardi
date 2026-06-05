<script setup lang="ts">
  import { computed } from 'vue';
  import { snippetMap } from 'virtual:shiki-snippets';

  const props = defineProps<{
    code: string;
    language: string;
    label: string;
  }>();

  const highlightedHtml = computed(() => snippetMap[props.code] ?? null);
</script>

<template>
  <div>
    <div
      class="eyebrow mb-3"
      style="color: var(--color-fg-4); font-size: 10px"
    >
      {{ label }}
    </div>
    <div class="overflow-x-auto rounded-xl">
      <div
        v-if="highlightedHtml"
        v-html="highlightedHtml"
      />
      <pre
        v-else
        class="shiki"
        style="background: #24292e; color: var(--color-fg-3)"
      ><code>{{ code }}</code></pre>
    </div>
  </div>
</template>
