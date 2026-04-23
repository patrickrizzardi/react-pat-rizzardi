<script setup lang="ts">
  import { computed } from 'vue';
  import { useHead } from '@unhead/vue';
  import type { BlogPost } from '@/types/blog';

  const props = defineProps<{ post: BlogPost }>();

  const jsonLd = computed(() =>
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: props.post.frontmatter.title,
      description: props.post.frontmatter.description,
      datePublished: props.post.frontmatter.date,
      dateModified: props.post.frontmatter.date,
      author: {
        '@type': 'Person',
        name: props.post.frontmatter.author ?? 'Patrick Rizzardi',
        url: 'https://redact.digital',
      },
      publisher: {
        '@type': 'Person',
        name: 'Patrick Rizzardi',
        url: 'https://redact.digital',
      },
      url: `https://redact.digital/blog/${props.post.frontmatter.slug}`,
      keywords: [...props.post.frontmatter.tags].join(', '),
      wordCount: props.post.readingTime * 200,
    }),
  );

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: jsonLd,
      },
    ],
  });
</script>

<template>
  <div />
</template>
