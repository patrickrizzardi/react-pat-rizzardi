<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import type { LocationQueryValue } from 'vue-router';
  import { useBlogPosts } from '@/composables/useBlogPosts';
  import { useSeo } from '@/composables/useSeo';
  import { siteConfig } from '@/data/siteConfig';
  import BlogPostCard from '@/components/blog/BlogPostCard.vue';
  import AppButton from '@/components/ui/AppButton.vue';

  useSeo({
    title: 'Blog — Patrick Rizzardi',
    description:
      'Engineering leadership, distributed systems, and lessons from building fault-tolerant microservices, LLVM compilers in Rust, and transformer models with CUDA kernels.',
    url: `${siteConfig.siteUrl}/blog`,
  });

  const route = useRoute();
  const router = useRouter();
  const { posts, allTags } = useBlogPosts();

  // Accept ?tag= from post-header links, but only honor a value that's an actual tag —
  // an unknown/garbage tag falls back to null (show all) instead of an empty list.
  const normalizeTag = (value: LocationQueryValue | Array<LocationQueryValue>): string | null => {
    const raw = Array.isArray(value) ? value[0] : value;
    if (typeof raw !== 'string' || raw.length === 0) return null;
    return allTags.includes(raw) ? raw : null;
  };

  const activeTag = ref<string | null>(normalizeTag(route.query.tag));

  const filteredPosts = computed(() => {
    const tag = activeTag.value;
    if (!tag) return posts;
    return posts.filter((post) => post.frontmatter.tags.includes(tag));
  });

  const setTag = (tag: string | null): void => {
    activeTag.value = tag;
    router.replace({ query: tag ? { tag } : {} });
  };

  const toggleTag = (tag: string): void => {
    setTag(activeTag.value === tag ? null : tag);
  };

  // Keep the filter in sync when the query changes from outside the buttons
  // (a tag link clicked from a post header, browser back/forward).
  watch(
    () => route.query.tag,
    (value) => {
      activeTag.value = normalizeTag(value);
    },
  );
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
          color: var(--color-fg);
          margin: 0 0 16px;
        "
      >
        blog
      </h1>
      <p style="font-size: 17px; color: var(--color-fg-2); line-height: 1.6; max-width: 480px">
        Engineering leadership, architecture, and lessons from building systems at scale.
      </p>
    </header>

    <div
      v-if="allTags.length > 0"
      class="mb-10 flex flex-wrap gap-2"
    >
      <AppButton
        v-for="tag in allTags"
        :key="tag"
        variant="chip"
        size="sm"
        :active="activeTag === tag"
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </AppButton>
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
      <p
        style="
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 20px;
          color: var(--color-fg);
          margin: 0 0 8px;
        "
      >
        No posts tagged
        <code
          style="
            font-family: var(--font-mono);
            font-size: 17px;
            color: var(--color-cheddar);
            background: var(--color-surface-3);
            border: 1px solid var(--color-line-soft);
            border-radius: 6px;
            padding: 2px 8px;
          "
          >{{ activeTag }}</code
        >
        yet.
      </p>
      <p style="color: var(--color-fg-4); font-family: var(--font-mono); font-size: 12px; margin: 0 0 20px">
        {{ posts.length }} post{{ posts.length === 1 ? '' : 's' }} published — browse all
      </p>
      <div class="mb-6 flex flex-wrap justify-center gap-2">
        <AppButton
          v-for="tag in allTags.filter((t) => t !== activeTag).slice(0, 3)"
          :key="tag"
          variant="chip"
          size="sm"
          @click="setTag(tag)"
        >
          {{ tag }}
        </AppButton>
      </div>
      <AppButton
        variant="text"
        @click="setTag(null)"
      >
        clear filter
      </AppButton>
    </div>
  </div>
</template>
