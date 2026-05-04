<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useBlogPosts } from '@/composables/useBlogPosts';
  import { useScrollReveal } from '@/composables/useScrollReveal';
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

  const sectionRef = ref<HTMLElement | null>(null);
  const { revealed } = useScrollReveal(sectionRef);
</script>

<template>
  <div class="mx-auto max-w-4xl px-6 py-24">
    <div
      ref="sectionRef"
      class="reveal"
      :class="{ 'is-revealed': revealed }"
    >
      <header class="mb-12 text-center">
        <h1 class="text-4xl font-bold text-white">Blog</h1>
        <p class="mt-3 text-lg text-gray-400">Engineering leadership, architecture, and building things that work.</p>
      </header>

      <div
        v-if="allTags.length > 0"
        class="mb-8 flex flex-wrap justify-center gap-2"
      >
        <button
          v-for="tag in allTags"
          :key="tag"
          type="button"
          class="rounded-full border px-3 py-1 text-xs transition-colors"
          :class="
            activeTag === tag ?
              'border-cyan bg-cyan/20 text-cyan'
            : 'hover:border-cyan/30 hover:text-cyan border-white/10 text-gray-400'
          "
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </button>
      </div>

      <div
        v-if="filteredPosts.length > 0"
        class="grid gap-6 md:grid-cols-2"
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
        <p class="text-gray-500">No posts found for this tag.</p>
        <button
          type="button"
          class="text-cyan mt-4 text-sm transition-colors hover:text-cyan-300"
          @click="activeTag = null"
        >
          Clear filter
        </button>
      </div>
    </div>
  </div>
</template>
