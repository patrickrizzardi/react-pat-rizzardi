<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useBlogPosts } from '@/composables/useBlogPosts';

  const route = useRoute();
  const router = useRouter();
  const { getBySlug } = useBlogPosts();

  const post = computed(() => {
    const slug = route.params['slug'] as string;
    return getBySlug(slug);
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
    <article class="prose prose-invert max-w-none">
      <component :is="post.component" />
    </article>
  </div>
</template>
