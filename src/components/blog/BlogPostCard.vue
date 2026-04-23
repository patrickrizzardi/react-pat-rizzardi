<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { Calendar, Clock } from 'lucide-vue-next';
  import type { BlogPost } from '@/types/blog';
  import { useSpotlight } from '@/composables/useSpotlight';
  import TechBadge from '@/components/projects/TechBadge.vue';

  const props = defineProps<{ post: BlogPost }>();

  const cardRef = ref<HTMLElement | null>(null);
  useSpotlight(cardRef);

  const formattedDate = computed(() => {
    const date = new Date(props.post.frontmatter.date);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });
</script>

<template>
  <RouterLink
    :to="`/blog/${post.frontmatter.slug}`"
    class="group block"
  >
    <article
      ref="cardRef"
      class="spotlight-card relative overflow-hidden rounded-2xl border border-white/10 bg-navy-800 p-6 transition-all duration-300 hover:border-cyan/30"
    >
      <div class="mb-3 flex items-center gap-4 text-xs text-gray-500">
        <span class="inline-flex items-center gap-1">
          <Calendar :size="12" />
          {{ formattedDate }}
        </span>
        <span class="inline-flex items-center gap-1">
          <Clock :size="12" />
          {{ post.readingTime }} min read
        </span>
      </div>

      <h3 class="text-xl font-bold text-white transition-colors group-hover:text-cyan">
        {{ post.frontmatter.title }}
      </h3>

      <p class="mt-3 text-sm leading-relaxed text-gray-400">
        {{ post.frontmatter.description }}
      </p>

      <div class="mt-4 flex flex-wrap gap-2">
        <TechBadge
          v-for="tag in post.frontmatter.tags"
          :key="tag"
          :label="tag"
        />
      </div>
    </article>
  </RouterLink>
</template>
