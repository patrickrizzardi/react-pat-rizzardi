<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { Calendar, Clock } from 'lucide-vue-next';
  import type { BlogPost } from '@/types/blog';
  import { useSpotlight } from '@/composables/useSpotlight';
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
      class="spotlight-card bg-navy-800 hover:border-cyan/30 relative overflow-hidden rounded-2xl border border-white/10 p-6 transition-all duration-300"
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

      <h3 class="group-hover:text-cyan text-xl font-bold text-white transition-colors">
        {{ post.frontmatter.title }}
      </h3>

      <p class="mt-3 text-sm leading-relaxed text-gray-400">
        {{ post.frontmatter.description }}
      </p>

      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="tag in post.frontmatter.tags"
          :key="tag"
          class="rounded-full px-2.5 py-1"
          style="
            font-family: var(--font-mono);
            font-size: 11px;
            color: var(--text-3);
            background: var(--bg-3);
            border: 1px solid var(--line-soft);
          "
          >{{ tag }}</span
        >
      </div>
    </article>
  </RouterLink>
</template>
