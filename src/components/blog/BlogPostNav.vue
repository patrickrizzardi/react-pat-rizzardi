<script setup lang="ts">
  import { ArrowLeft, ArrowRight } from 'lucide-vue-next';
  import type { BlogPost } from '@/types/blog';

  defineProps<{
    prev: BlogPost | undefined;
    next: BlogPost | undefined;
  }>();
</script>

<template>
  <nav class="mt-16 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2">
    <RouterLink
      v-if="prev"
      :to="`/blog/${prev.frontmatter.slug}`"
      class="group flex items-center gap-3 rounded-xl border border-white/10 p-4 transition-colors hover:border-cyan/30"
    >
      <ArrowLeft
        :size="16"
        class="shrink-0 text-gray-500 transition-colors group-hover:text-cyan"
      />
      <div class="min-w-0">
        <div class="text-xs text-gray-500">Previous</div>
        <div class="truncate text-sm font-medium text-white transition-colors group-hover:text-cyan">
          {{ prev.frontmatter.title }}
        </div>
      </div>
    </RouterLink>
    <div v-else />

    <RouterLink
      v-if="next"
      :to="`/blog/${next.frontmatter.slug}`"
      class="group flex items-center justify-end gap-3 rounded-xl border border-white/10 p-4 text-right transition-colors hover:border-cyan/30"
    >
      <div class="min-w-0">
        <div class="text-xs text-gray-500">Next</div>
        <div class="truncate text-sm font-medium text-white transition-colors group-hover:text-cyan">
          {{ next.frontmatter.title }}
        </div>
      </div>
      <ArrowRight
        :size="16"
        class="shrink-0 text-gray-500 transition-colors group-hover:text-cyan"
      />
    </RouterLink>
  </nav>
</template>
