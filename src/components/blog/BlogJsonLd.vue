<script setup lang="ts">
  import { computed } from 'vue';
  import { useHead } from '@unhead/vue';
  import type { BlogPost } from '@/types/blog';
  import { siteConfig } from '@/data/siteConfig';

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
        name: props.post.frontmatter.author ?? siteConfig.name,
        url: siteConfig.siteUrl,
      },
      publisher: {
        '@type': 'Person',
        name: siteConfig.name,
        url: siteConfig.siteUrl,
      },
      url: `${siteConfig.siteUrl}/blog/${props.post.frontmatter.slug}`,
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
