<script setup lang="ts">
  import { computed } from 'vue';
  import { RouterLink } from 'vue-router';
  import { useBlogPosts } from '@/composables/useBlogPosts';
  import AppButton from '@/components/ui/AppButton.vue';

  const { posts } = useBlogPosts();
  const recent = computed(() => posts.slice(0, 4));
</script>

<template>
  <section
    id="writing"
    class="py-[120px]"
  >
    <div class="mx-auto max-w-6xl px-6">
      <div class="mb-16 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div class="eyebrow mb-5">writing</div>
          <h2
            class="m-0 font-display text-[clamp(32px,4vw,56px)] leading-[1.05] font-extrabold tracking-[-0.03em] text-fg"
          >
            engineering log
          </h2>
        </div>
        <AppButton
          variant="chip"
          as="RouterLink"
          to="/blog"
          >all posts ↗</AppButton
        >
      </div>

      <div
        v-if="recent.length === 0"
        class="font-mono text-[13px] text-fg-4"
      >
        No posts yet. First drop coming soon.
      </div>

      <div
        v-else
        class="flex flex-col border-t border-line"
      >
        <RouterLink
          v-for="post in recent"
          :key="post.frontmatter.slug"
          :to="`/blog/${post.frontmatter.slug}`"
          class="group flex flex-col gap-2 border-b border-line-soft py-6 no-underline sm:flex-row sm:items-baseline sm:gap-8"
          style="transition: background 0.15s"
        >
          <div class="min-w-[80px] shrink-0 font-mono text-[11px] text-fg-4">
            {{ new Date(post.frontmatter.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) }}
          </div>
          <div class="min-w-0 flex-1">
            <div
              class="mb-[4px] font-display text-[16px] font-semibold text-fg"
              style="transition: color 0.15s"
            >
              {{ post.frontmatter.title }}
            </div>
            <div class="text-[13px] leading-[1.5] text-fg-3">
              {{ post.frontmatter.description }}
            </div>
          </div>
          <div class="shrink-0 font-mono text-[11px] text-fg-4">{{ post.readingTime }} min</div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
