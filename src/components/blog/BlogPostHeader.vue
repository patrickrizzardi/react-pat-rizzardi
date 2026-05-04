<script setup lang="ts">
  import { computed } from 'vue';
  import { ArrowLeft } from 'lucide-vue-next';
  import type { BlogPost } from '@/types/blog';

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
  <div class="mb-12">
    <RouterLink
      to="/blog"
      class="mb-8 inline-flex items-center gap-1.5 transition-colors duration-150"
      style="font-family: var(--font-mono); font-size: 12px; color: var(--text-4); text-decoration: none"
    >
      <ArrowLeft :size="12" />
      back to blog
    </RouterLink>

    <h1
      style="
        font-family: var(--font-display);
        font-weight: 800;
        font-size: clamp(28px, 4vw, 48px);
        letter-spacing: -0.03em;
        line-height: 1.1;
        color: var(--text);
        margin: 0 0 20px;
      "
    >
      {{ post.frontmatter.title }}
    </h1>

    <div
      class="flex flex-wrap items-center gap-4"
      style="font-family: var(--font-mono); font-size: 12px; color: var(--text-4); margin-bottom: 16px"
    >
      <span>{{ formattedDate }}</span>
      <span style="color: var(--line)">·</span>
      <span>{{ post.readingTime }} min read</span>
      <span
        v-if="post.frontmatter.author"
        style="color: var(--line)"
        >·</span
      >
      <span v-if="post.frontmatter.author">{{ post.frontmatter.author }}</span>
    </div>

    <div class="flex flex-wrap gap-2">
      <RouterLink
        v-for="tag in post.frontmatter.tags"
        :key="tag"
        :to="`/blog?tag=${tag}`"
        class="rounded-full px-2.5 py-1 no-underline transition-colors duration-150"
        style="
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-3);
          background: var(--bg-3);
          border: 1px solid var(--line-soft);
        "
        >{{ tag }}</RouterLink
      >
    </div>

    <hr
      class="mt-10"
      style="border-color: var(--line-soft)"
    />
  </div>
</template>
