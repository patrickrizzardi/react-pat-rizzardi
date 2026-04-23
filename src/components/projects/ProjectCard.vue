<script setup lang="ts">
  import { ref } from 'vue';
  import { Github, ExternalLink, Package, Chrome } from 'lucide-vue-next';
  import type { StandardProject } from '@/types/project';
  import { useSpotlight } from '@/composables/useSpotlight';
  import TechBadge from './TechBadge.vue';

  defineProps<{ project: StandardProject }>();

  const cardRef = ref<HTMLElement | null>(null);
  useSpotlight(cardRef);

  const linkConfig = {
    repoUrl: { icon: Github, text: 'Source' },
    liveUrl: { icon: ExternalLink, text: 'Live' },
    npmUrl: { icon: Package, text: 'npm' },
    extensionUrl: { icon: Chrome, text: 'Extension' },
  } as const;

  type LinkKey = keyof typeof linkConfig;

  const linkKeys: ReadonlyArray<LinkKey> = ['repoUrl', 'liveUrl', 'npmUrl', 'extensionUrl'];
</script>

<template>
  <article
    ref="cardRef"
    class="spotlight-card relative overflow-hidden rounded-2xl border border-white/10 bg-navy-800 p-6 transition-all duration-300 hover:border-cyan/30"
  >
    <h3 class="text-xl font-bold text-white">{{ project.title }}</h3>
    <p class="mt-3 text-sm text-gray-400">{{ project.description }}</p>

    <div class="mt-4 flex flex-wrap gap-2">
      <TechBadge
        v-for="t in project.tech"
        :key="t"
        :label="t"
      />
    </div>

    <div class="mt-5 flex flex-wrap gap-3">
      <template
        v-for="key in linkKeys"
        :key="key"
      >
        <a
          v-if="project[key]"
          :href="project[key]"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-cyan"
        >
          <component
            :is="linkConfig[key].icon"
            :size="14"
          />
          {{ linkConfig[key].text }}
        </a>
      </template>
    </div>
  </article>
</template>
