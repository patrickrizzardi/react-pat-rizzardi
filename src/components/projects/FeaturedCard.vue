<script setup lang="ts">
  import { ref } from 'vue';
  import type { FeaturedProject } from '@/types/project';
  import { useSpotlight } from '@/composables/useSpotlight';
  import TechBadge from './TechBadge.vue';
  import CodeSnippet from './CodeSnippet.vue';

  defineProps<{ project: FeaturedProject }>();

  const cardRef = ref<HTMLElement | null>(null);
  useSpotlight(cardRef);
</script>

<template>
  <article
    ref="cardRef"
    class="spotlight-card bg-navy-800 hover:border-cyan/30 relative overflow-hidden rounded-2xl border border-white/10 p-6 transition-all duration-300 sm:p-8"
  >
    <div class="mb-4 flex items-start justify-between">
      <div>
        <h3 class="text-2xl font-bold text-white">{{ project.title }}</h3>
        <p class="text-cyan mt-1 text-sm">Private Repository</p>
      </div>
    </div>

    <p class="text-gray-400">{{ project.description }}</p>

    <p
      v-if="project.archNotes"
      class="border-cyan/30 mt-4 border-l-2 pl-4 text-sm text-gray-500 italic"
    >
      {{ project.archNotes }}
    </p>

    <div class="mt-6 flex flex-wrap gap-2">
      <TechBadge
        v-for="t in project.tech"
        :key="t"
        :label="t"
      />
    </div>

    <div
      v-if="project.snippets.length > 0"
      class="mt-6 space-y-4"
    >
      <CodeSnippet
        v-for="snippet in project.snippets"
        :key="snippet.label"
        :code="snippet.code"
        :language="snippet.language"
        :label="snippet.label"
      />
    </div>
  </article>
</template>
