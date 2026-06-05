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
      class="mb-8 inline-flex items-center gap-1.5 font-mono text-[12px] text-fg-4 no-underline transition-colors duration-150"
    >
      <ArrowLeft :size="12" />
      back to blog
    </RouterLink>

    <h1
      class="mb-[20px] font-display text-[clamp(28px,4vw,48px)] leading-[1.1] font-extrabold tracking-[-0.03em] text-fg"
    >
      {{ post.frontmatter.title }}
    </h1>

    <div class="mb-[16px] flex flex-wrap items-center gap-4 font-mono text-[12px] text-fg-4">
      <span>{{ formattedDate }}</span>
      <span class="text-line">·</span>
      <span>{{ post.readingTime }} min read</span>
      <span
        v-if="post.frontmatter.author"
        class="text-line"
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
        class="ml-1 flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-mono text-[11px] transition-colors duration-150"
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

    <hr class="mt-10 border-line-soft" />
  </div>
</template>
