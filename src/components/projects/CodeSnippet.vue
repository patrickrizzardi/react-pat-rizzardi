<script setup lang="ts">
  import { ref, onMounted } from 'vue';

  const props = defineProps<{
    code: string;
    language: string;
    label: string;
  }>();

  const highlightedHtml = ref('');

  onMounted(async () => {
    const { codeToHtml } = await import('shiki');
    highlightedHtml.value = await codeToHtml(props.code, {
      lang: props.language,
      theme: 'github-dark',
    });
  });
</script>

<template>
  <div>
    <p class="mb-2 text-xs font-medium text-gray-500">{{ label }}</p>
    <div class="overflow-x-auto rounded-lg bg-[#0d1117] p-4 text-sm">
      <div
        v-if="highlightedHtml"
        v-html="highlightedHtml"
      />
      <pre
        v-else
        class="text-gray-400"
      ><code>{{ code }}</code></pre>
    </div>
  </div>
</template>
