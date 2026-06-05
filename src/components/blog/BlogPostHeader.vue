<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { ArrowLeft, Link, Check } from 'lucide-vue-next';
  import type { BlogPost } from '@/types/blog';
  import AppButton from '@/components/ui/AppButton.vue';

  const props = defineProps<{ post: BlogPost }>();

  const copied = ref(false);

  const formattedDate = computed(() => {
    const date = new Date(props.post.frontmatter.date);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });

  const copyLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 1500);
    } catch {
      // Clipboard unavailable (denied permission / non-secure context) — leave UI unchanged.
    }
  };
</script>

<template>
  <div class="mb-12">
    <RouterLink
      to="/blog"
      class="mb-8 inline-flex items-center gap-1.5 transition-colors duration-150"
      style="font-family: var(--font-mono); font-size: 12px; color: var(--color-fg-4); text-decoration: none"
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
        color: var(--color-fg);
        margin: 0 0 20px;
      "
    >
      {{ post.frontmatter.title }}
    </h1>

    <div
      class="flex flex-wrap items-center gap-4"
      style="font-family: var(--font-mono); font-size: 12px; color: var(--color-fg-4); margin-bottom: 16px"
    >
      <span>{{ formattedDate }}</span>
      <span style="color: var(--color-line)">·</span>
      <span>{{ post.readingTime }} min read</span>
      <span
        v-if="post.frontmatter.author"
        style="color: var(--color-line)"
        >·</span
      >
      <span v-if="post.frontmatter.author">{{ post.frontmatter.author }}</span>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <AppButton
        v-for="tag in post.frontmatter.tags"
        :key="tag"
        variant="chip"
        as="RouterLink"
        :to="`/blog?tag=${tag}`"
        size="sm"
        >{{ tag }}</AppButton
      >
      <button
        type="button"
        :aria-label="copied ? 'Link copied to clipboard' : 'Copy link to this post'"
        class="ml-1 flex cursor-pointer items-center gap-1.5 transition-colors duration-150"
        style="font-family: var(--font-mono); font-size: 11px; background: none; border: none; padding: 0"
        @click="copyLink"
      >
        <span
          v-if="copied"
          style="color: oklch(0.74 0.21 145)"
          >copied</span
        >
        <component
          :is="copied ? Check : Link"
          :size="13"
          :style="{ color: copied ? 'oklch(0.74 0.21 145)' : 'var(--color-fg-4)' }"
        />
      </button>
    </div>

    <hr
      class="mt-10"
      style="border-color: var(--color-line-soft)"
    />
  </div>
</template>
