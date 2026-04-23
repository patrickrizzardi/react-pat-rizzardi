<script setup lang="ts">
  import { ExternalLink } from 'lucide-vue-next';
  import type { ExperienceProject } from '@/types/project';
  import TechBadge from './TechBadge.vue';

  defineProps<{ project: ExperienceProject }>();
</script>

<template>
  <article
    class="rounded-2xl border border-white/10 bg-navy-800 p-6 transition-all duration-300 hover:border-cyan/30 hover:shadow-lg hover:shadow-cyan/5 sm:p-8"
  >
    <div class="mb-1 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h3 class="text-2xl font-bold text-white">{{ project.title }}</h3>
        <p class="mt-1 text-sm text-cyan">{{ project.role }}</p>
        <p class="mt-1 text-xs text-gray-500">{{ project.period }}</p>
      </div>
      <a
        :href="project.liveUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 rounded-lg border border-cyan/30 px-4 py-2 text-sm text-cyan transition-colors hover:bg-cyan/10"
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
        <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan/50" />
        {{ item }}
      </li>
    </ul>

    <div
      v-if="project.highlights.length > 0"
      class="mt-4 rounded-lg border border-cyan/10 bg-cyan/5 p-4"
    >
      <p class="mb-2 text-xs font-semibold tracking-wider text-cyan uppercase">Key Achievements</p>
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
