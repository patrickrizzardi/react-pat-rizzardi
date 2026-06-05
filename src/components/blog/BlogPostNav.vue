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
  <nav
    class="mt-16 grid gap-4 pt-8 sm:grid-cols-2"
    style="border-top: 1px solid var(--line-soft)"
  >
    <RouterLink
      v-if="prev"
      :to="`/blog/${prev.frontmatter.slug}`"
      class="group flex items-center gap-3 rounded-xl border p-4 transition-colors duration-150"
      :style="{
        borderColor: prevHover ? 'var(--burnt)' : 'var(--line)',
        background: 'var(--card)',
        textDecoration: 'none',
      }"
      @mouseenter="prevHover = true"
      @mouseleave="prevHover = false"
    >
      <ArrowLeft
        :size="14"
        :style="{ color: prevHover ? 'var(--burnt)' : 'var(--text-4)', flexShrink: 0, transition: 'color 0.15s' }"
      />
      <div class="min-w-0">
        <div
          style="
            font-family: var(--font-mono);
            font-size: 10px;
            color: var(--text-4);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 4px;
          "
        >
          Newer
        </div>
        <div
          class="truncate"
          style="font-size: 13px; font-weight: 600; transition: color 0.15s"
          :style="{ color: prevHover ? 'var(--text)' : 'var(--text-2)' }"
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
        borderColor: nextHover ? 'var(--burnt)' : 'var(--line)',
        background: 'var(--card)',
        textDecoration: 'none',
      }"
      @mouseenter="nextHover = true"
      @mouseleave="nextHover = false"
    >
      <div class="min-w-0">
        <div
          style="
            font-family: var(--font-mono);
            font-size: 10px;
            color: var(--text-4);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 4px;
          "
        >
          Older
        </div>
        <div
          class="truncate"
          style="font-size: 13px; font-weight: 600; transition: color 0.15s"
          :style="{ color: nextHover ? 'var(--text)' : 'var(--text-2)' }"
        >
          {{ next.frontmatter.title }}
        </div>
      </div>
      <ArrowRight
        :size="14"
        :style="{ color: nextHover ? 'var(--burnt)' : 'var(--text-4)', flexShrink: 0, transition: 'color 0.15s' }"
      />
    </RouterLink>
  </nav>

  <div
    class="mt-10 flex justify-center"
    style="border-top: 1px solid var(--line-soft); padding-top: 32px"
  >
    <RouterLink
      to="/"
      class="inline-flex items-center gap-1.5 transition-colors duration-150"
      style="font-family: var(--font-mono); font-size: 11px; color: var(--text-4); text-decoration: none"
    >
      view full profile
      <ArrowUpRight
        :size="11"
        style="color: var(--text-4)"
      />
    </RouterLink>
  </div>
</template>
