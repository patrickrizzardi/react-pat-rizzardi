<script setup lang="ts">
  import { ref, onMounted } from 'vue';

  const props = defineProps<{
    code: string;
    language: string;
    label: string;
  }>();

  const highlightedHtml = ref('');

  onMounted(async () => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }, theme, langTs, langSql, langRust] =
      await Promise.all([
        import('shiki/core'),
        import('shiki/engine/javascript'),
        import('shiki/themes/github-dark.mjs'),
        import('shiki/langs/typescript.mjs'),
        import('shiki/langs/sql.mjs'),
        import('shiki/langs/rust.mjs'),
      ]);
    const highlighter = await createHighlighterCore({
      themes: [theme],
      langs: [langTs, langSql, langRust],
      engine: createJavaScriptRegexEngine(),
    });
    highlightedHtml.value = highlighter.codeToHtml(props.code, {
      lang: props.language,
      theme: 'github-dark',
    });
  });
</script>

<template>
  <div>
    <div
      class="eyebrow mb-3"
      style="color: var(--text-4); font-size: 10px"
    >
      {{ label }}
    </div>
    <div class="overflow-x-auto rounded-xl">
      <div
        v-if="highlightedHtml"
        v-html="highlightedHtml"
      />
      <pre
        v-else
        class="shiki"
        style="background: #24292e; color: var(--text-3)"
      ><code>{{ code }}</code></pre>
    </div>
  </div>
</template>
