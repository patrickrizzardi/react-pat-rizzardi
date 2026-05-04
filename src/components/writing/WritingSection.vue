<script setup lang="ts">
  import { computed } from 'vue';
  import { RouterLink } from 'vue-router';
  import { useBlogPosts } from '@/composables/useBlogPosts';

  const { posts } = useBlogPosts();
  const recent = computed(() => posts.slice(0, 4));
</script>

<template>
  <section
    id="writing"
    style="padding: 120px 0"
  >
    <div class="mx-auto max-w-6xl px-6">
      <div class="mb-16 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div class="eyebrow mb-5">writing</div>
          <h2
            style="
              font-family: var(--font-display);
              font-weight: 800;
              font-size: clamp(32px, 4vw, 56px);
              letter-spacing: -0.03em;
              line-height: 1.05;
              color: var(--text);
              margin: 0;
            "
          >
            engineering log
          </h2>
        </div>
        <RouterLink
          to="/blog"
          class="rounded-full px-4 py-2 transition-colors duration-200"
          style="
            font-family: var(--font-mono);
            font-size: 12px;
            color: var(--text-2);
            border: 1px solid var(--line);
            text-decoration: none;
          "
          >all posts ↗</RouterLink
        >
      </div>

      <div
        v-if="recent.length === 0"
        style="font-family: var(--font-mono); font-size: 13px; color: var(--text-4)"
      >
        No posts yet. First drop coming soon.
      </div>

      <div
        v-else
        class="flex flex-col"
        style="border-top: 1px solid var(--line)"
      >
        <RouterLink
          v-for="post in recent"
          :key="post.slug"
          :to="`/blog/${post.slug}`"
          class="group flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:gap-8"
          style="border-bottom: 1px solid var(--line-soft); text-decoration: none; transition: background 0.15s"
        >
          <div
            style="
              font-family: var(--font-mono);
              font-size: 11px;
              color: var(--text-4);
              min-width: 80px;
              flex-shrink: 0;
            "
          >
            {{ new Date(post.frontmatter.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) }}
          </div>
          <div class="min-w-0 flex-1">
            <div
              style="
                font-family: var(--font-display);
                font-weight: 600;
                font-size: 16px;
                color: var(--text);
                margin-bottom: 4px;
                transition: color 0.15s;
              "
            >
              {{ post.frontmatter.title }}
            </div>
            <div style="font-size: 13px; color: var(--text-3); line-height: 1.5">
              {{ post.frontmatter.description }}
            </div>
          </div>
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-4); flex-shrink: 0">
            {{ post.readingTime }} min
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
