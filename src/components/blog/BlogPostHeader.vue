<script setup lang="ts">
  import { computed } from 'vue';
  import { Calendar, Clock, ArrowLeft } from 'lucide-vue-next';
  import type { BlogPost } from '@/types/blog';
  import TechBadge from '@/components/projects/TechBadge.vue';

  const props = defineProps<{ post: BlogPost }>();

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
  <div class="mb-10">
    <RouterLink
      to="/blog"
      class="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-cyan"
    >
      <ArrowLeft :size="14" />
      Back to blog
    </RouterLink>

    <h1 class="text-3xl font-bold leading-tight text-white md:text-4xl">
      {{ post.frontmatter.title }}
    </h1>

    <div class="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
      <span class="inline-flex items-center gap-1.5">
        <Calendar :size="14" />
        {{ formattedDate }}
      </span>
      <span class="inline-flex items-center gap-1.5">
        <Clock :size="14" />
        {{ post.readingTime }} min read
      </span>
      <span v-if="post.frontmatter.author">
        {{ post.frontmatter.author }}
      </span>
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <RouterLink
        v-for="tag in post.frontmatter.tags"
        :key="tag"
        :to="`/blog?tag=${tag}`"
      >
        <TechBadge :label="tag" />
      </RouterLink>
    </div>

    <hr class="mt-8 border-white/10" />
  </div>
</template>
