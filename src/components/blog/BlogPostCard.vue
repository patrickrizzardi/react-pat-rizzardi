<script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { BlogPost } from '@/types/blog';

  const props = defineProps<{ post: BlogPost }>();

  const hovered = ref(false);

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
    style="text-decoration: none"
  >
    <article
      class="relative flex h-full flex-col overflow-hidden rounded-2xl border transition-colors duration-200"
      :style="{
        padding: '24px',
        background: 'var(--card)',
        borderColor: hovered ? 'var(--burnt)' : 'var(--line)',
        boxShadow: 'var(--card-shadow)',
      }"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
    >
      <div
        class="mb-3 flex items-center gap-4"
        style="font-family: var(--font-mono); font-size: 11px; color: var(--text-4)"
      >
        <span>{{ formattedDate }}</span>
        <span>{{ post.readingTime }} min</span>
      </div>

      <h3
        class="mb-3 flex-1"
        style="
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 18px;
          letter-spacing: -0.01em;
          line-height: 1.3;
          color: var(--text);
          margin: 0 0 12px;
        "
      >
        {{ post.frontmatter.title }}
      </h3>

      <p style="font-size: 13px; line-height: 1.65; color: var(--text-3); margin: 0 0 16px">
        {{ post.frontmatter.description }}
      </p>

      <div class="mt-auto flex flex-wrap gap-1.5">
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
