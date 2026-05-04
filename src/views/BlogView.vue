<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useBlogPosts } from '@/composables/useBlogPosts';
  import { useSeo } from '@/composables/useSeo';
  import BlogPostCard from '@/components/blog/BlogPostCard.vue';

  useSeo({
    title: 'Blog — Patrick Rizzardi',
    description: 'Engineering leadership, AI/ML architecture, and lessons from building systems at scale.',
    url: 'https://redact.digital/blog',
  });

  const { posts, getAllTags } = useBlogPosts();
  const allTags = getAllTags();
  const activeTag = ref<string | null>(null);

  const filteredPosts = computed(() => {
    const tag = activeTag.value;
    if (!tag) return posts;
    return posts.filter((post) => post.frontmatter.tags.includes(tag));
  });

  const toggleTag = (tag: string): void => {
    activeTag.value = activeTag.value === tag ? null : tag;
  };
</script>

<template>
  <div
    class="mx-auto max-w-4xl px-6"
    style="padding-top: 120px; padding-bottom: 96px"
  >
    <header class="mb-16">
      <div class="eyebrow mb-5">engineering log</div>
      <h1
        style="
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(40px, 5vw, 64px);
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: var(--text);
          margin: 0 0 16px;
        "
      >
        blog
      </h1>
      <p style="font-size: 17px; color: var(--text-2); line-height: 1.6; max-width: 480px">
        Engineering leadership, architecture, and lessons from building systems at scale.
      </p>
    </header>

    <div
      v-if="allTags.length > 0"
      class="mb-10 flex flex-wrap gap-2"
    >
      <button
        v-for="tag in allTags"
        :key="tag"
        type="button"
        class="rounded-full px-3 py-1 transition-colors duration-150"
        :style="{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: activeTag === tag ? 'var(--bg)' : 'var(--text-3)',
          background: activeTag === tag ? 'var(--burnt)' : 'transparent',
          border: `1px solid ${activeTag === tag ? 'var(--burnt)' : 'var(--line)'}`,
          cursor: 'pointer',
        }"
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </button>
    </div>

    <div
      v-if="filteredPosts.length > 0"
      class="grid gap-4 md:grid-cols-2"
    >
      <BlogPostCard
        v-for="post in filteredPosts"
        :key="post.frontmatter.slug"
        :post="post"
      />
    </div>

    <div
      v-else
      class="py-16 text-center"
    >
      <p style="color: var(--text-4); font-family: var(--font-mono); font-size: 13px">No posts found for this tag.</p>
      <button
        type="button"
        class="mt-4 transition-colors duration-150"
        style="
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--burnt);
          cursor: pointer;
          background: none;
          border: none;
        "
        @click="activeTag = null"
      >
        clear filter
      </button>
    </div>
  </div>
</template>
