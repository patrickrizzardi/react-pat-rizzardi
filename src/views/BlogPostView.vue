<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useBlogPosts } from '@/composables/useBlogPosts';
  import { useSeo } from '@/composables/useSeo';
  import BlogPostHeader from '@/components/blog/BlogPostHeader.vue';
  import BlogPostNav from '@/components/blog/BlogPostNav.vue';
  import BlogJsonLd from '@/components/blog/BlogJsonLd.vue';

  const route = useRoute();
  const router = useRouter();
  const { posts, getBySlug } = useBlogPosts();

  const post = computed(() => {
    const slug = route.params['slug'] as string;
    return getBySlug(slug);
  });

  const currentIndex = computed(() => posts.findIndex((p) => p.frontmatter.slug === post.value?.frontmatter.slug));

  const prevPost = computed(() => (currentIndex.value > 0 ? posts[currentIndex.value - 1] : undefined));

  const nextPost = computed(() => (currentIndex.value < posts.length - 1 ? posts[currentIndex.value + 1] : undefined));

  useSeo({
    title: computed(() => post.value?.frontmatter.title ?? 'Blog — Patrick Rizzardi'),
    description: computed(() => post.value?.frontmatter.description ?? ''),
    url: computed(() => `https://redact.digital/blog/${post.value?.frontmatter.slug ?? ''}`),
    type: 'article',
    article: {
      author: computed(() => post.value?.frontmatter.author ?? 'Patrick Rizzardi'),
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
    class="mx-auto max-w-3xl px-6"
    style="padding-top: 120px; padding-bottom: 96px"
  >
    <BlogJsonLd :post="post" />
    <BlogPostHeader :post="post" />

    <article
      class="prose max-w-none prose-invert prose-headings:font-display prose-headings:tracking-tight prose-headings:text-[var(--text)] prose-p:leading-relaxed prose-p:text-[var(--text-2)] prose-a:text-[var(--burnt-hi)] prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-[var(--burnt)] prose-blockquote:text-[var(--text-3)] prose-strong:text-[var(--text)] prose-code:text-[var(--cheddar)] prose-pre:rounded-xl prose-pre:border prose-pre:border-[var(--line)] prose-li:text-[var(--text-2)] prose-hr:border-[var(--line-soft)]"
    >
      <component :is="post.component" />
    </article>

    <BlogPostNav
      :prev="prevPost"
      :next="nextPost"
    />
  </div>
</template>
