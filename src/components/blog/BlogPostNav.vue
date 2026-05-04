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
      class="group hover:border-cyan/30 flex items-center gap-3 rounded-xl border border-white/10 p-4 transition-colors"
    >
      <ArrowLeft
        :size="16"
        class="group-hover:text-cyan shrink-0 text-gray-500 transition-colors"
      />
      <div class="min-w-0">
        <div class="text-xs text-gray-500">Previous</div>
        <div class="group-hover:text-cyan truncate text-sm font-medium text-white transition-colors">
          {{ prev.frontmatter.title }}
        </div>
      </div>
    </RouterLink>
    <div v-else />

    <RouterLink
      v-if="next"
      :to="`/blog/${next.frontmatter.slug}`"
      class="group hover:border-cyan/30 flex items-center justify-end gap-3 rounded-xl border border-white/10 p-4 text-right transition-colors"
    >
      <div class="min-w-0">
        <div class="text-xs text-gray-500">Next</div>
        <div class="group-hover:text-cyan truncate text-sm font-medium text-white transition-colors">
          {{ next.frontmatter.title }}
        </div>
      </div>
      <ArrowRight
        :size="16"
        class="group-hover:text-cyan shrink-0 text-gray-500 transition-colors"
      />
    </RouterLink>
  </nav>
</template>
