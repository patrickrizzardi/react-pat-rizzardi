# Performance Analysis

**Date**: 2026-06-03 · Vue 3 + Tailwind 4 + vite-ssg static site. 9 issues (1 critical, 4 high, 4 medium).

## CRITICAL

### P1 — Shiki runtime highlighter shipped to the client (~181 KB)
`src/components/projects/CodeSnippet.vue:12-31`. Dynamic-imports `shiki/core` + `shiki/engine/javascript` + `github-dark` theme + 3 grammars in `onMounted` — client-side, after hydration, on the home page (`SystemsSection` mounts one per featured project). These split into the `typescript-*.js` (~181 KB) / `engine-javascript` / `core` chunks but are still downloaded + executed by every visitor to highlight 3 **hardcoded** strings. The blog already highlights at build time via `@shikijs/markdown-it`.
**Impact**: ~181 KB JS (pre-gzip) + ~290ms transfer on median mobile + main-thread parse/exec + 400–800ms flash of unstyled `<pre>` on cold cache. No `dispose()` → highlighter leak on remount.
**Fix**: highlight `projects.ts` snippets at build time (Vite plugin/transform), store HTML alongside code, make `CodeSnippet` a pure `v-html` renderer. Drops the entire Shiki graph from the client.

## HIGH

### P2 — NeuronCanvas rAF never pauses off-screen/backgrounded
`NeuronCanvas.vue:432` — `requestAnimationFrame(tick)` runs unconditionally while `!reducedMotion`. No `visibilitychange`, no `IntersectionObserver`. Full-speed draws when scrolled past (not throttled) or tab hidden (browser only throttles to ~1fps). On 1440p@DPR2 the canvas is the dominant CPU/GPU workload.
**Fix**: add `visibilitychange` + `IntersectionObserver(threshold:0)` on the canvas; `cancelAnimationFrame` when hidden/off-screen, resume with `lastT = performance.now()` reset (avoids dt spike). Add both to `cleanupFn`.

### P3 — NeuronCanvas `buildNetwork` is O(n² log n) per resize
`NeuronCanvas.vue:80-148`. Node placement checks each candidate against all placed nodes (O(n²)); edge computation does per-node distance-to-all + sort (O(n² log n)); `edges.find()` dedup is another O(e) per candidate. At n=380 (~1440p): ~290K `Math.sqrt` ≈ 15ms synchronous → jank frame on any resize/orientation/devtools-open.
**Fix**: uniform spatial grid (cell = `minDist`) → O(1) neighbor lookup; `Set` keyed `${min(i,j)}-${max(i,j)}` for dedup. Brings it to O(n log n).

### P4 — CodeSnippet: new highlighter per mount, no singleton, no dispose
`CodeSnippet.vue:22-30`. Even setting aside P1, 3 featured snippets → 3 `createHighlighterCore` calls loading the same theme+grammars, none disposed.
**Fix**: superseded by P1 (build-time). If runtime kept, hoist to a module-level cached `Promise<Highlighter>`.

### P5 — `getAllTags()` rebuilds Set+sort on every call
`useBlogPosts.ts:55-63`, `BlogView.vue:21`. Tags don't change at runtime on a static site; `allPosts` is already a module const — `allTags` should be too.
**Fix**: compute `allTags` once at module load (IIFE), return it directly. O(1) after init.

## MEDIUM

### P6 — `estimateReadingTime` measures the file path, not content (also a functional bug — see bugs.md / AUDIT §B2)
`useBlogPosts.ts:39` passes `path` (glob key) → 1 "word" → every post "1 min". **Fix**: parallel `?raw` glob, count real words.

### P7 — Hero clock `setInterval` has no visibility guard
`HeroSection.vue:28`. 1s reactive update fires when tab hidden / hero off-screen. Low cost, principled. **Fix**: `if (document.visibilityState === 'hidden') return;` in `updateClock`. (UX also recommends replacing the clock entirely — see ux.md.)

### P8 — `metricVisible` array-index mutation relies on Proxy subtlety
`HeroSection.vue:38-44` — `metricVisible.value[i] = true` works (Vue 3 Proxy tracks it) but breaks if refactored to `shallowRef`. Not a current bug. **Fix**: full-array swap or individual refs. (documentation.md: also hardcoded to 4 elements — derive from `metrics.length`.)

### P9 — `currentIndex` O(p) `findIndex` per navigation
`BlogPostView.vue:20`. Negligible at 1 post; wrong shape at scale. **Fix**: `Map<slug,index>` built once in `useBlogPosts`.

## Already performant (preserve)
`useScrollReveal` (IO + disconnect after first hit), `useDecoder` (rAF, self-terminates, cancels on unmount), lazy-loaded blog routes, `dpr` cap at 2, `dt` cap at 48ms, full `NeuronCanvas` cleanup, `filteredPosts` as computed, module-level `allPosts`, font-stack fallbacks (no layout shift).
