<script setup lang="ts">
  import { ref } from 'vue';
  import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-vue-next';
  import type { BlogPost } from '@/types/blog';

  defineProps<{
    prev: BlogPost | undefined;
    next: BlogPost | undefined;
  }>();

  const prevHover = ref(false);
  const nextHover = ref(false);
</script>

<template>
  <nav class="mt-16 grid gap-4 border-t border-line-soft pt-8 sm:grid-cols-2">
    <RouterLink
      v-if="prev"
      :to="`/blog/${prev.frontmatter.slug}`"
      class="group flex items-center gap-3 rounded-xl border p-4 transition-colors duration-150"
      :style="{
        borderColor: prevHover ? 'var(--color-burnt)' : 'var(--color-line)',
        background: 'var(--color-card)',
        textDecoration: 'none',
      }"
      @mouseenter="prevHover = true"
      @mouseleave="prevHover = false"
    >
      <ArrowLeft
        :size="14"
        :style="{
          color: prevHover ? 'var(--color-burnt)' : 'var(--color-fg-4)',
          flexShrink: 0,
          transition: 'color 0.15s',
        }"
      />
      <div class="min-w-0">
        <div class="mb-[4px] font-mono text-[10px] tracking-[0.1em] text-fg-4 uppercase">Newer</div>
        <div
          class="truncate text-[13px] font-semibold"
          style="transition: color 0.15s"
          :style="{ color: prevHover ? 'var(--color-fg)' : 'var(--color-fg-2)' }"
        >
          {{ prev.frontmatter.title }}
        </div>
      </div>
    </RouterLink>
    <div v-else />

    <RouterLink
      v-if="next"
      :to="`/blog/${next.frontmatter.slug}`"
      class="group flex items-center justify-end gap-3 rounded-xl border p-4 text-right transition-colors duration-150"
      :style="{
        borderColor: nextHover ? 'var(--color-burnt)' : 'var(--color-line)',
        background: 'var(--color-card)',
        textDecoration: 'none',
      }"
      @mouseenter="nextHover = true"
      @mouseleave="nextHover = false"
    >
      <div class="min-w-0">
        <div class="mb-[4px] font-mono text-[10px] tracking-[0.1em] text-fg-4 uppercase">Older</div>
        <div
          class="truncate text-[13px] font-semibold"
          style="transition: color 0.15s"
          :style="{ color: nextHover ? 'var(--color-fg)' : 'var(--color-fg-2)' }"
        >
          {{ next.frontmatter.title }}
        </div>
      </div>
      <ArrowRight
        :size="14"
        :style="{
          color: nextHover ? 'var(--color-burnt)' : 'var(--color-fg-4)',
          flexShrink: 0,
          transition: 'color 0.15s',
        }"
      />
    </RouterLink>
  </nav>

  <div class="mt-10 flex justify-center border-t border-line-soft pt-[32px]">
    <RouterLink
      to="/"
      class="inline-flex items-center gap-1.5 font-mono text-[11px] text-fg-4 no-underline transition-colors duration-150"
    >
      view full profile
      <ArrowUpRight
        :size="11"
        class="text-fg-4"
      />
    </RouterLink>
  </div>
</template>
