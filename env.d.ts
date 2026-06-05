/// <reference types="vite/client" />

declare module 'virtual:shiki-snippets' {
  /** Maps raw snippet code string → Shiki-highlighted HTML (pre-rendered at build time). */
  export const snippetMap: Record<string, string>;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}

declare module '*.md' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
  export const frontmatter: Record<string, unknown>;
}
