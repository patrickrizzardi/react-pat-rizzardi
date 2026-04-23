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
    class="mx-auto max-w-3xl px-6 py-24"
  >
    <BlogJsonLd :post="post" />
    <BlogPostHeader :post="post" />

    <article
      class="prose max-w-none prose-invert prose-headings:text-white prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-cyan/30 prose-code:text-cyan-300 prose-pre:border prose-pre:border-white/10 prose-pre:bg-navy-800"
    >
      <component :is="post.component" />
    </article>

    <BlogPostNav
      :prev="prevPost"
      :next="nextPost"
    />
  </div>
</template>
