<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { RouterLink, useRouter } from 'vue-router';
  import type { BlogPost } from '@/types/blog';

  const props = defineProps<{ post: BlogPost }>();

  const router = useRouter();
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
    class="group block no-underline"
  >
    <article
      class="relative flex h-full flex-col overflow-hidden rounded-2xl border transition-colors duration-200"
      :style="{
        padding: '24px',
        background: 'var(--color-card)',
        borderColor: hovered ? 'var(--color-burnt)' : 'var(--color-line)',
        boxShadow: 'var(--card-shadow)',
      }"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
    >
      <div class="mb-3 flex items-center gap-4 font-mono text-[11px] text-fg-4">
        <span>{{ formattedDate }}</span>
        <span>{{ post.readingTime }} min</span>
      </div>

      <h3 class="mb-[12px] flex-1 font-display text-[18px] leading-[1.3] font-bold tracking-[-0.01em] text-fg">
        {{ post.frontmatter.title }}
      </h3>

      <p class="mb-[16px] text-[13px] leading-[1.65] text-fg-3">
        {{ post.frontmatter.description }}
      </p>

      <div class="mt-auto flex flex-wrap gap-1.5">
        <!-- Buttons, not links: the card itself is an <a>, and an <a>-in-<a> is invalid HTML
             (hydration mismatch). router.push gives the same tag-filter navigation. -->
        <button
          v-for="tag in post.frontmatter.tags"
          :key="tag"
          type="button"
          class="cursor-pointer rounded-full border border-line-soft bg-surface-3 px-2.5 py-1 font-mono text-[11px] text-fg-3"
          @click.stop.prevent="router.push(`/blog?tag=${tag}`)"
        >
          {{ tag }}
        </button>
      </div>
    </article>
  </RouterLink>
</template>
