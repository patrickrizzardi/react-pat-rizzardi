# Bug Analysis Report

**Analyzed**: 2026-06-03
**Files Checked**: 30 (all `src/` `.ts`/`.vue`, plus `vite.config.ts`, `dist/index.html` for prerender verification)
**Critical Bugs Found**: 2
**Scope**: Runtime bugs in `redact.digital` — Vue 3 `<script setup>` + Tailwind 4 + vite-ssg static site. Focus: SSR/hydration safety, null derefs, tag-filter logic, listener/timer leaks.

---

## 🚨 CRITICAL BUGS (Fix Immediately)

### Bug #1: WritingSection renders every recent-post link as `/blog/undefined`

**File**: `src/components/writing/WritingSection.vue:56-57` (also `:key="post.slug"` on line 56)
**Severity**: CRITICAL
**Category**: Null/Undefined Dereference (wrong property path)

**Issue**: The home-page "engineering log" list binds `:to="`/blog/${post.slug}`"` and `:key="post.slug"`. The `BlogPost` type (`src/types/blog.ts`) has **no** top-level `slug` — the slug lives at `post.frontmatter.slug`. `post.slug` is therefore `undefined`.

**Why This Breaks Production**: Every recent-post link on the landing page points to `/blog/undefined`. Clicking it hits `BlogPostView`, `getBySlug('undefined')` returns `undefined`, and the user is bounced to `/blog`. The primary CTA from the homepage into any blog post is dead. `:key="post.slug"` is also `undefined` for every row, so Vue uses the same (undefined) key for all list items — defeats keyed-diffing and can cause incorrect DOM reuse if the list ever reorders.

**Verification (paper trace)**:
- Type: `BlogPost = { frontmatter: { slug, ... }, readingTime, component }` — no `slug` at top level (`src/types/blog.ts:13-17`).
- Composable builds posts as `{ frontmatter, readingTime, component }` — confirms no top-level `slug` (`src/composables/useBlogPosts.ts:37-41`).
- **Confirmed in prerendered output**: `dist/index.html:95` contains `href="/blog/undefined"`. Observed value: `/blog/undefined`. Expected: `/blog/hello-world`. This is not a theory — it shipped to the built artifact.

**Current Code**:
```vue
<RouterLink
  v-for="post in recent"
  :key="post.slug"
  :to="`/blog/${post.slug}`"
```

**Fixed Code**:
```vue
<RouterLink
  v-for="post in recent"
  :key="post.frontmatter.slug"
  :to="`/blog/${post.frontmatter.slug}`"
```

Note: line 70's date binding correctly uses `post.frontmatter.date`, and title/description correctly use `post.frontmatter.*` — only the slug references (lines 56-57) use the wrong path. Worth confirming whether TypeScript should have caught this: `post.slug` on a typed `BlogPost` should be a compile error in `<template>` with `vue-tsc`. Recommend verifying `vue-tsc` is in the build/CI gate — if it were running, this wouldn't have shipped.

---

### Bug #2: Reading time is computed from the file path, not the post content — always returns 1

**File**: `src/composables/useBlogPosts.ts:39` (helper at lines 21-24)
**Severity**: CRITICAL (data correctness on a user-facing value, every post affected)
**Category**: Logic Error (wrong argument)

**Issue**: `estimateReadingTime(path)` is passed `path` — the glob key, e.g. `'../content/blog/hello-world.md'` — instead of the markdown body. `estimateReadingTime` does `content.split(/\s+/).filter(Boolean).length`; a path string has no whitespace, so it splits to **1** "word". `Math.max(1, Math.ceil(1 / 200))` = **1**. Every post reports "1 min read" regardless of length.

**Why This Breaks Production**: "X min read" is shown on `BlogPostCard`, `BlogPostHeader`, `WritingSection`, and is fed into `BlogJsonLd` as `wordCount: readingTime * 200` (so structured-data wordCount is always 200, wrong for SEO). A 4,000-word article will advertise "1 min read."

**Verification (paper trace)**:
- Input: `path = '../content/blog/hello-world.md'`. `path.split(/\s+/)` → `['../content/blog/hello-world.md']` → length 1. Output: `Math.max(1, Math.ceil(1/200))` = 1.
- `unplugin-vue-markdown` exposes the compiled component (`default`) and frontmatter as named exports — it does **not** export the raw markdown body on the module, so there is no `mod.content`/`mod.excerpt` field currently being read (the `BlogModule` interface at lines 6-15 declares none). The reading-time source is genuinely unavailable from the current module shape.
- **Confirmed in prerendered output**: `dist/index.html:95` shows `1 min`. (Masked for the lone test post because its body is ~200 words ≈ legitimately 1 min — but the *input* is provably the path, so the value is right by coincidence here and will be wrong for any longer post.)

**Current Code**:
```typescript
return {
  frontmatter,
  readingTime: estimateReadingTime(path), // path, not content
  component: mod.default,
};
```

**Fixed Code** (requires exposing raw content — business/build decision):
This needs the markdown body, which the plugin doesn't currently surface. Options, in order of preference:
1. Configure `unplugin-vue-markdown` to expose frontmatter+content (e.g. `wrapperComponent`/transform that attaches the raw body), then `estimateReadingTime(mod.content)`.
2. Add a second `import.meta.glob` with `{ query: '?raw', import: 'default', eager: true }` over the same `*.md` glob to get raw strings keyed by path, and read length from there:
```typescript
const rawSources = import.meta.glob('../content/blog/*.md', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>;
// ...
readingTime: estimateReadingTime(rawSources[path] ?? ''),
```
3. Move a `readingTime` (or `wordCount`) value into frontmatter and read it directly.

This requires understanding the markdown plugin's exposed surface (external system) — **escalating the exact mechanism to orchestrator**: the bug (wrong input → constant 1) is confirmed real; the chosen fix depends on which content-exposure path the project wants. The simplest verified fix is option 2 (`?raw` glob), which is fully self-contained in this repo.

---

## 🟡 LOWER-SEVERITY / NEEDS-VERIFICATION

### Note A: `BlogPostView` calls `router.replace` synchronously in setup (SSG prerender path)

**File**: `src/views/BlogPostView.vue:38-40`
**Severity**: LOW (needs verification — not a confirmed crash)
**Category**: Flow/Ordering (SSR)

`if (!post.value) { router.replace('/blog'); }` runs in component setup. `/blog/:slug` routes ARE prerendered (`vite.config.ts:34-39` enumerates them from the filesystem), so this executes server-side during SSG. For a real slug `post.value` is defined and the branch is skipped — fine. The redirect only fires for an unknown slug, which won't be prerendered, so in practice the SSG path never hits it. The template is guarded by `v-if="post"`, so there's no null deref. **Needs verification** that a client-side navigation to a bad slug (`/blog/does-not-exist` typed directly) redirects cleanly rather than throwing inside setup — couldn't confirm runtime behavior without running it. No evidence of a crash; flagging for completeness.

### Note B: `estimateReadingTime` empty-content edge case is handled

`Math.max(1, ...)` guarantees a floor of 1 min even for empty content — no division-by-zero or NaN. Behaves correctly for the empty/edge case (the bug is the *input*, not the edge handling).

---

## ✅ Verified SAFE (checked, no bug)

These were specifically in scope and were traced — confirming they are NOT bugs:

- **`utils/scroll.ts`** — `document.querySelector`/`getElementById`/`window.scrollTo` are all inside `scrollToSection` / `navBarHeight`, only invoked from click handlers (`AppNav.goTo`, `HeroSection` CTAs). Nothing runs at import time. `getElementById(id)` is null-guarded (`if (!el) return`). `querySelector(...)?.getBoundingClientRect().height ?? NAV_FALLBACK_HEIGHT` is optional-chained with a fallback. SSR-safe (never called during prerender). **Safe.**

- **`NeuronCanvas.vue`** — All `window`/`document`/`requestAnimationFrame`/`setInterval`/`performance.now()`/`matchMedia` usage is inside `onMounted`, which does not run during SSR prerender. `canvasRef.value` and `getContext('2d')` are both null-guarded (lines 51-54). Cleanup is complete: `cleanupFn` cancels the rAF, removes the resize listener, and clears all seed-fire timeouts; `onUnmounted` invokes it (lines 456-465). `prefers-reduced-motion` correctly avoids registering the rAF loop and resize listener. Array indexing throughout uses `?.`/`continue` guards (e.g. `nodes[j]?.connections.push`, `if (!entry) continue`). **Safe — no leak, no SSR crash.**

- **`HeroSection.vue`** — `new Date()`, `setInterval`, `matchMedia` all inside `onMounted`. `clock` ref initializes to `''`, so SSR renders empty and the client's pre-mount render also renders empty → **no hydration mismatch** (the live clock only populates after mount). `clearInterval` + `timeouts.forEach(clearTimeout)` in `onUnmounted` (lines 47-50) — no dangling interval/timeout. `metricVisible` is a fixed 4-element array indexed by `metrics` index (4 items) — bounds match. **Safe.**

- **`useDecoder.ts`** — `output` initializes to `final`, so SSR renders the final string and hydration matches; the scramble animation only starts after mount. `requestAnimationFrame` is cancelled in `onUnmounted`. The `t < start` early-return re-schedules correctly. **Safe — no hydration mismatch, no rAF leak.**

- **`useScrollReveal.ts`** — `IntersectionObserver` created in `onMounted` with `if (!el.value) return` guard; `observer?.disconnect()` on intersect and in `onUnmounted`. `[entry]` destructure uses `entry?.isIntersecting`. **Safe.**

- **`AppFooter.vue:41`** — `new Date().getFullYear()` renders at both SSR and client. Within a single calendar year the values match; a hydration mismatch is only theoretically possible if the page is served from a build done in a prior year and viewed across a New-Year boundary. Low enough risk that it's not worth flagging as a bug (a static-site copyright year is conventionally the build year). **Acceptable.**

- **`BlogView.vue` tag filter** — `normalizeTag` correctly handles: array query (`value[0]`), non-string/empty (`→ null`), and unknown tag (`allTags.includes(raw) ? raw : null` → falls back to "show all", not empty list). Empty-result path renders the "No posts found / clear filter" branch. The `watch` on `route.query.tag` re-normalizes on back/forward and external links. `filteredPosts` is a pure computed (no source mutation — `posts.filter(...)` returns a new array). `:key="post.frontmatter.slug"` and `:key="tag"` are correct. **Safe — edge cases covered.**

- **`SystemsSection.vue` union narrowing** — `secondary` filters to `ExperienceProject | StandardProject`. `p.liveUrl` exists on both (required `string` vs `string | null`) — valid access. `'repoUrl' in p` / `'npmUrl' in p` guards correctly narrow before access (those fields exist only on `StandardProject`). `tagColors[p.status] ?? fallback` and `taglineMap[p.id] ?? ''` handle unknown keys. `p.snippets[0]` is guarded by `v-if="p.tier === 'featured' && p.snippets[0]"`. **Safe.**

- **`BlogPostView` prev/next** — `currentIndex` uses `findIndex`; `prevPost` guards `currentIndex.value > 0`, `nextPost` guards `< posts.length - 1`. No off-by-one, no out-of-bounds. **Safe.**

- **`CodeSnippet.vue`** — Shiki dynamic import inside `onMounted` (client-only); `v-else` `<pre>` fallback renders raw code during SSR/before highlight resolves. `v-html` only ever receives Shiki output (build-trusted markdown authored by the site owner, not user input) — no XSS surface. **Safe.**

- **`MobileMenu.vue` / `AppNav.vue`** — Reka UI `DialogRoot` manages listeners/focus/escape internally and cleans up on unmount. `goTo` awaits `router.push` then `nextTick` + rAF before `scrollToSection` (correct ordering so `offsetTop` measures the real mounted layout, not 0). **Safe.**

- **`useSeo.ts` / `BlogJsonLd.vue`** — reactive getters via `computed`/`toValue`; `useSeoMeta`/`useHead` are SSR-aware (unhead). `og-default.png` referenced by `useSeo` exists at `public/assets/og-default.png`. **Safe.**

---

## 📊 Summary by Category

- Null/Undefined: **1** (Bug #1) | Types: 0 | Async: 0
- Logic: **1** (Bug #2) | Leaks: 0 | Isolation: 0 | Flow/Ordering: 0 confirmed (1 needs-verification, Note A) | Idempotency/TOCTOU: 0 (n/a — static marketing site, no mutations)

## 🎯 Prioritized Fix Order

### Must Fix Now (Production Risk)
1. **Bug #1** — `WritingSection` `/blog/undefined` links. One-line-per-binding fix (`post.slug` → `post.frontmatter.slug`, two places). Highest impact: breaks the homepage→blog funnel. Confirmed in shipped `dist/`.
2. **Bug #2** — Reading time always 1. Fix requires exposing raw content (recommend the `?raw` glob, self-contained). Affects every post's displayed read-time + JSON-LD wordCount.

### Should Fix Soon (Hardening)
3. Verify `vue-tsc` runs in the build/CI gate — Bug #1 is exactly the class of error template type-checking catches. If it's not gated, add it.

### Nice to Verify
4. Note A — client-side navigation to a non-existent slug (`router.replace` in setup). Confirm clean redirect vs. setup-time throw by running it.

---

## ✅ What's Working Well

- **Consistent SSR discipline**: every browser-API touch (`window`, `document`, `matchMedia`, `requestAnimationFrame`, `setInterval`, `IntersectionObserver`, Shiki) is correctly deferred into `onMounted`/handlers — no module-top-level or setup-time browser access that would crash the vite-ssg prerender. This is the single most common vite-ssg footgun and it's handled cleanly across the board.
- **Hydration-safe initial state**: the live clock (`''`) and decoder (`final`) both seed their refs to a value that matches the server render, animating only post-mount — textbook avoidance of hydration mismatch.
- **Thorough cleanup**: NeuronCanvas, HeroSection, useDecoder, useScrollReveal all pair their listeners/timers/observers/rAF with `onUnmounted` teardown — no leaks found.
- **Defensive array/lookup access**: pervasive `?.`, `?? fallback`, and `if (!x) continue/return` guards throughout the canvas sim and lookups.
- **Tag-filter robustness**: `normalizeTag` is genuinely well-designed — handles array params, garbage tags, and empty values with the right fallbacks, and the comments explain the WHY.
