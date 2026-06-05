import type { Plugin } from 'vite';
import type { HighlighterCore } from 'shiki/core';
import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import { projects } from '../data/projects';

const VIRTUAL_ID = 'virtual:shiki-snippets';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

/**
 * Collects every snippet.code value from projects.ts at build time, highlights
 * them with Shiki (github-dark, langs: typescript/sql/rust), and exposes the
 * resulting map as a virtual module consumed by CodeSnippet.vue.
 *
 * The entire Shiki graph (core + engine + grammars + theme) is tree-shaken
 * out of the client bundle because no client module imports it — only this
 * plugin does, at build time inside Node.
 */
const shikiSnippetsPlugin = (): Plugin => {
  let highlightedMap: Record<string, string> = {};

  return {
    name: 'vite-plugin-shiki-snippets',
    enforce: 'pre',

    async buildStart() {
      const [theme, langTs, langSql, langRust] = await Promise.all([
        import('shiki/themes/github-dark.mjs'),
        import('shiki/langs/typescript.mjs'),
        import('shiki/langs/sql.mjs'),
        import('shiki/langs/rust.mjs'),
      ]);

      const highlighter: HighlighterCore = await createHighlighterCore({
        themes: [theme],
        langs: [langTs, langSql, langRust],
        engine: createJavaScriptRegexEngine(),
      });

      const map: Record<string, string> = {};

      for (const project of projects) {
        if (project.tier !== 'featured') continue;
        for (const snippet of project.snippets) {
          if (snippet.code in map) continue;
          map[snippet.code] = highlighter.codeToHtml(snippet.code, {
            lang: snippet.language,
            theme: 'github-dark',
          });
        }
      }

      highlighter.dispose();
      highlightedMap = map;
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return undefined;
    },

    load(id) {
      if (id !== RESOLVED_ID) return undefined;
      return `export const snippetMap = ${JSON.stringify(highlightedMap)};`;
    },
  };
};

export default shikiSnippetsPlugin;
