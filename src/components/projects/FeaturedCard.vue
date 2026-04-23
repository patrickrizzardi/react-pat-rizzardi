<script setup lang="ts">
  import type { FeaturedProject } from '@/types/project';
  import TechBadge from './TechBadge.vue';
  import CodeSnippet from './CodeSnippet.vue';

  defineProps<{ project: FeaturedProject }>();
</script>

<template>
  <article
    class="rounded-2xl border border-white/10 bg-navy-800 p-6 transition-all duration-300 hover:border-cyan/30 hover:shadow-lg hover:shadow-cyan/5 sm:p-8"
  >
    <div class="mb-4 flex items-start justify-between">
      <div>
        <h3 class="text-2xl font-bold text-white">{{ project.title }}</h3>
        <p class="mt-1 text-sm text-cyan">Private Repository</p>
      </div>
    </div>

    <p class="text-gray-400">{{ project.description }}</p>

    <p
      v-if="project.archNotes"
      class="mt-4 border-l-2 border-cyan/30 pl-4 text-sm text-gray-500 italic"
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
