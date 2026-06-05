<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useBlogPosts } from '@/composables/useBlogPosts';
  import { useSeo } from '@/composables/useSeo';
  import { siteConfig } from '@/data/siteConfig';
  import BlogPostHeader from '@/components/blog/BlogPostHeader.vue';
  import BlogPostNav from '@/components/blog/BlogPostNav.vue';
  import BlogJsonLd from '@/components/blog/BlogJsonLd.vue';

  const route = useRoute();
  const router = useRouter();
  const { posts, getBySlug, getIndexBySlug } = useBlogPosts();

  const post = computed(() => {
    const slug = route.params['slug'] as string;
    return getBySlug(slug);
  });

  const currentIndex = computed(() => (post.value ? getIndexBySlug(post.value.frontmatter.slug) : -1));

  const prevPost = computed(() => (currentIndex.value > 0 ? posts[currentIndex.value - 1] : undefined));

  const nextPost = computed(() => (currentIndex.value < posts.length - 1 ? posts[currentIndex.value + 1] : undefined));

  useSeo({
    title: computed(() => post.value?.frontmatter.title ?? 'Blog — Patrick Rizzardi'),
    description: computed(() => post.value?.frontmatter.description ?? ''),
    url: computed(() => `${siteConfig.siteUrl}/blog/${post.value?.frontmatter.slug ?? ''}`),
    type: 'article',
    article: {
      author: computed(() => post.value?.frontmatter.author ?? siteConfig.name),
      publishedTime: computed(() => post.value?.frontmatter.date ?? ''),
      tags: computed(() => post.value?.frontmatter.tags ?? []),
    },
  });

  if (!post.value) {
    router.replace('/blog');
  }
</script>

<template>
  <div
    v-if="post"
    class="mx-auto max-w-3xl px-6 pt-[120px] pb-[96px]"
  >
    <BlogJsonLd :post="post" />
    <BlogPostHeader :post="post" />

    <article
      class="prose max-w-none prose-invert prose-headings:font-display prose-headings:tracking-tight prose-headings:text-[var(--color-fg)] prose-p:leading-relaxed prose-p:text-[var(--color-fg-2)] prose-a:text-[var(--color-burnt-hi)] prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-[var(--color-burnt)] prose-blockquote:text-[var(--color-fg-3)] prose-strong:text-[var(--color-fg)] prose-code:text-[var(--color-cheddar)] prose-pre:rounded-xl prose-pre:border prose-pre:border-[var(--color-line)] prose-li:text-[var(--color-fg-2)] prose-hr:border-[var(--color-line-soft)]"
    >
      <component :is="post.component" />
    </article>

    <BlogPostNav
      :prev="prevPost"
      :next="nextPost"
    />
  </div>
</template>
