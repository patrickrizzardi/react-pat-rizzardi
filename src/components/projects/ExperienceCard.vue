<script setup lang="ts">
  import { ref } from 'vue';
  import { ExternalLink } from 'lucide-vue-next';
  import type { ExperienceProject } from '@/types/project';
  import { useSpotlight } from '@/composables/useSpotlight';
  import TechBadge from './TechBadge.vue';

  defineProps<{ project: ExperienceProject }>();

  const cardRef = ref<HTMLElement | null>(null);
  useSpotlight(cardRef);
</script>

<template>
  <article
    ref="cardRef"
    class="spotlight-card bg-navy-800 hover:border-cyan/30 relative overflow-hidden rounded-2xl border border-white/10 p-6 transition-all duration-300 sm:p-8"
  >
    <div class="mb-1 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h3 class="text-2xl font-bold text-white">{{ project.title }}</h3>
        <p class="text-cyan mt-1 text-sm">{{ project.role }}</p>
        <p class="mt-1 text-xs text-gray-500">{{ project.period }}</p>
      </div>
      <a
        :href="project.liveUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="border-cyan/30 text-cyan hover:bg-cyan/10 inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm transition-colors"
      >
        <ExternalLink :size="14" />
        Live Site
      </a>
    </div>

    <p class="mt-4 text-gray-400">{{ project.description }}</p>

    <ul class="mt-4 space-y-2">
      <li
        v-for="item in project.responsibilities"
        :key="item"
        class="flex items-start gap-2 text-sm text-gray-400"
      >
        <span class="bg-cyan/50 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
        {{ item }}
      </li>
    </ul>

    <div
      v-if="project.highlights.length > 0"
      class="border-cyan/10 bg-cyan/5 mt-4 rounded-lg border p-4"
    >
      <p class="text-cyan mb-2 text-xs font-semibold tracking-wider uppercase">Key Achievements</p>
      <ul class="space-y-1">
        <li
          v-for="h in project.highlights"
          :key="h"
          class="text-sm text-gray-300"
        >
          {{ h }}
        </li>
      </ul>
    </div>

    <div class="mt-6 flex flex-wrap gap-2">
      <TechBadge
        v-for="t in project.tech"
        :key="t"
        :label="t"
      />
    </div>
  </article>
</template>
