# redact.digital — Audit Summary

**Date**: 2026-06-03 (overnight) · **Branch**: `cheddar-v1` · **Scope**: 8 analyzers, security excluded per request.
**Analyzers run**: redundancy, consolidation, cleanup, consistency, performance, documentation, ux, bugs.
**Skipped**: security + sql-injection (your call); reliability + forensics (N/A — static frontend, no backend/DB/queue/observability surface).

> How to read this: **§A** is your headline ask (consolidation / reusable code). **§B** is the "fix tonight" list — two are confirmed *shipped* bugs I verified by hand. The rest are dimension sections. **§H** is the ranked quick-win list. **§I** is the one thing that needs a decision from you, not a fix.
> Per-dimension detail lives in the sibling files: `redundancy.md`, `consolidation.md`, `cleanup.md`, `consistency.md`, `performance.md`, `documentation.md`, `ux.md`, `bugs.md`.
> Findings flagged by **2+ analyzers independently** are marked ⭑ (high confidence). Findings I **personally verified** (read the source / built output) are marked ✓.

---

## §A — Consolidation & reusable code (your headline ask)

The codebase is already DRY where it counts — `AppButton`, `useSeo`, `useBlogPosts`, `siteConfig`, `scrollToSection`, the `.eyebrow` class, and the new `--nav-h` token are all single-source and consumed cleanly. The duplication that remains is **presentational chrome** repeated as inline-style blocks across the section components. Total consolidatable: **~160 LOC across 7 patterns.**

| # | Pattern | Sites | Fix | LOC saved | Found by |
|---|---|---|---|---|---|
| A1 ⭑ | Section `<h2>` heading block (display font + `clamp()` + tracking) | 6 | `.section-heading` CSS class in `main.css` | ~45 | redundancy, consolidation |
| A2 ⭑ | Mono label row (uppercase 11px text-4) | 5 | `.mono-label` CSS class | ~25 | redundancy, consolidation |
| A3 ⭑ | Tech/tag display chip (`<span>` versions) | 4 (3 raw) | `.chip` CSS class (keep AppButton chip for interactive) | ~20 | redundancy, consolidation, ux |
| A4 ⭑ | `formattedDate` computed (byte-identical) | 3 | `src/utils/date.ts` (`dateUtils.long/short`) | ~14 | redundancy, consolidation, documentation |
| A5 | Hover-border card pattern (`ref` + mouseenter/leave) | 3 | `useHover()` composable | ~15 | redundancy |
| A6 ⭑ | Section wrapper `padding: 120px 0` (+ optional `bg-2`) | 5 | `.section-pad` / `.section-alt` classes (or CSS var tied to a spacing scale) | ~5 + cleaner templates | redundancy, documentation |
| A7 | `tagColors` + `secondaryTag`/`secondaryRole` business logic living in `SystemsSection.vue` | 1 file | relocate to `src/data/projects.ts` (domain knowledge, not display) | — (relocation) | redundancy, consolidation |

**Token / config consolidation** (`main.css` — your suspected `@theme`/`:root` duplication, assessed precisely by consolidation-analyzer ✓ confirmed by me earlier in the cumulative review):
- `--font-*` re-declared in `:root` (`main.css:72-75`) — pure redundancy, `@theme` already emits them globally. **Deletable.**
- `--btn-radius` / `--card-radius` inside `@theme` (`main.css:30-31`) — dead weight; those aren't Tailwind-recognized `@theme` namespaces so no utilities are minted; their real home is `:root` (69-70) where inline styles read them. **Deletable.**
- `--color-burnt` vs `--burnt` dual-naming (identical `oklch()` literals) — the deeper drift vector; a rebrand must touch both. **Decision needed** (see §I) — collapse to aliases vs leave.

**Cross-source duplication** (consolidation §):
- Home meta description duplicated **verbatim** between `index.html:8` and `HomeView.vue:13-14` — the end-of-plan fix loop already aligned them; consider a build-time single source so they can't drift again.
- Marketing facts ("team of 4", "11 integrations", "$2M/mo") restated across `metrics.ts` + hero prose + SEO copy — acceptable for prose, but worth knowing they're N places if a number changes.
- Social links re-derived in `AppFooter` and `ContactSection` (both pull from `siteConfig` — good — but Footer uses raw DOM hover mutation; see §F).
- No shared section-id registry tying `AppNav.navLinks` → the six hardcoded section `id`s → `scrollToSection` callers. A `sections.ts` const consumed by all three would prevent an id typo from silently breaking a nav link.

---

## §B — Fix now (confirmed defects)

### B1 ✓⭑ — Home-page "recent posts" links are broken: `/blog/undefined` (P0)
**`src/components/writing/WritingSection.vue:56-57`** — `:key="post.slug"` and `:to="\`/blog/${post.slug}\`"`. The `BlogPost` type (`blog.ts:13-17`) has **no top-level `slug`** — it's `post.frontmatter.slug` (line 70 right below correctly uses `post.frontmatter.date`). So `post.slug` is `undefined`.
**Verified**: bug-analyzer confirmed `href="/blog/undefined"` in the shipped `dist/index.html:95`; I read the source + type myself. Flagged by consolidation + documentation + bugs (documentation mis-stated that only the `:key` was affected — it's the link too).
**Impact**: every "recent writing" link on the home page is dead → breaks the homepage→blog funnel.
**Fix**: `post.slug` → `post.frontmatter.slug` on both lines. Trivial.

### B2 ✓⭑ — Every blog post reads "1 min" + JSON-LD `wordCount` is garbage
**`src/composables/useBlogPosts.ts:39`** — `readingTime: estimateReadingTime(path)` passes the glob key (`../content/blog/hello-world.md`, no spaces) instead of post content. `split(/\s+/)` → 1 "word" → `Math.max(1, ceil(1/200))` = 1 for every post. `BlogJsonLd.vue:29` then does `readingTime * 200` → wrong `wordCount` emitted to search engines.
**Verified**: I read the source + type. Flagged by performance + documentation + bugs.
**Fix**: add a parallel raw glob and count real words:
```ts
const raw = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true });
// ...
readingTime: estimateReadingTime(raw[path] as string),
```

---

## §C — Performance (full detail: `performance.md`)

### C1 — Shiki ships its 181 KB highlighter to every visitor to colorize 3 hardcoded strings (highest-leverage change in the repo)
**`src/components/projects/CodeSnippet.vue:12-31`** dynamic-imports `shiki/core` + engine + grammars in `onMounted` — client-side, after hydration, on the home page (`SystemsSection` mounts it per featured project). The blog already highlights at build time via `@shikijs/markdown-it`; the project snippets in `projects.ts` are static strings that should get the **same build-time treatment** and become pure `v-html` render. Drops ~181 KB JS + the unstyled-code flash + a highlighter memory leak (no `dispose`, new instance per mount).
**Fix**: highlight `projects.ts` snippets at build time (Vite plugin / transform), store the HTML alongside the code, make `CodeSnippet` a dumb renderer.

### C2 — `NeuronCanvas` rAF loop never pauses off-screen/backgrounded
**`NeuronCanvas.vue:432`** — `requestAnimationFrame(tick)` runs full-speed when the hero is scrolled past or the tab is hidden (browsers only throttle hidden tabs to ~1fps, scroll-past not at all). Add an `IntersectionObserver` + `visibilitychange` listener (reset `lastT` on resume), both into `cleanupFn`. Zero CPU/GPU when invisible.

### C3 — `NeuronCanvas.buildNetwork` is O(n² log n) on every resize (~290K `sqrt` at n=380 → ~15ms jank frame). Spatial grid → O(n log n). Only fires on resize, so lower urgency. (`NeuronCanvas.vue:80-148`)

**Smaller**: `getAllTags()` recomputes a Set+sort per call → make it a module const (`useBlogPosts.ts:55`); `BlogPostView` slug lookup is O(p) `findIndex` → Map when post count grows; hero clock `setInterval` + `metricVisible` array-index mutation are low-cost footguns.

**Already performant (preserve)**: `useScrollReveal` (IO + disconnect), `useDecoder` (rAF, self-terminates), lazy-loaded blog routes, `dpr` cap at 2, `dt` cap at 48ms, full canvas cleanup.

---

## §D — Dead code / cleanup (full detail: `cleanup.md` — 6 items)

- `main.css` `--card-radius` declared in **both** `@theme` and `:root`; `--font-*` duplicated in `:root` — see §A token notes.
- `AppButton.vue` emits `app-btn` / `app-btn--${variant}` BEM classes that match **no stylesheet rule** — inert dead markup; either drop them or they're a (harmless) hook left for nothing.
- `SystemsSection.vue` `expandedCard` ref — declared, unused in template.
- `project.ts` / `projects.ts` `extensionUrl` field — orphaned (no render branch). (Confirmed pre-existing in the cumulative review — predates this plan.)
- `NeuronCanvas.vue` `fanOut = Math.min(conns.length, 1)` is always 1 → the Fisher-Yates shuffle above it is vestigial (does no useful work). Simplify to a single random pick or name the constant.
- Orphaned `public/` assets: confirm `cheddar-emblem.png` / `cheddar-logo.png` are still needed (logo is now `cheddar-logo.svg`). See `cleanup.md` for the grep evidence.

---

## §E — Consistency (full detail: `consistency.md` — 13 items, mostly one theme)

**The dominant finding is ONE architectural call, not 13 scattered nits.** vue-standards.md says "no `<style>` blocks, Tailwind utilities" — but the codebase uses inline `style="{...}"` objects/attributes in **58+ places across 9 components** to bind CSS-var theme tokens (`var(--burnt)` etc.) to dynamic state. It's **internally consistent and arguably justified** (vanilla Tailwind can't bind a CSS var to dynamic state without arbitrary values). The analyzer's verdict: this is a deliberate pattern, but it **contradicts your own written standard** → either (a) document it as a sanctioned exception in vue-standards.md, or (b) migrate to Tailwind arbitrary-value + CSS-var injection. This is §I. The remaining consistency items (composable return-type annotations, pixel-unit drift, icon sizing) are minor and fall out of whichever way you decide A.

---

## §F — UX (full detail: `ux.md` — 14 friction + 12 opportunities)

**Highest-value friction:**
- **No active-section indicator in the nav** — the nav has hover but no "you are here" state; on a long one-pager it reads as decorative. Wire an `IntersectionObserver` → `activeSection`, extend AppButton's `nav` variant `activeStyle` (currently `{}`) to color the active link burnt. (ux flagged Critical.)
- **`scrollToSection` uses `el.offsetTop`** (`scroll.ts:24`) — sections are `position: relative`, so `offsetTop` is relative to the positioned ancestor, not the document; can land scrolls slightly off (the `NAV_SCROLL_GAP=12` masks it). Switch to `getBoundingClientRect().top + window.scrollY`. *(Worth a quick verify — it's been browser-tested as landing correctly, so the current ancestor chain may happen to be unpositioned at the measured point; but the rect form is strictly more correct.)*
- **`useDecoder` has no `prefers-reduced-motion` guard** — the hero callsign scramble runs for reduced-motion users even though the metrics stagger respects it. Inconsistent + WCAG 2.3.3. Two-line fix.
- **"open a thread" CTA** — too clever for a skimming recruiter; "let's talk ↗" / "get in touch" converts better (or add a `↳ contact` hint).
- **No copy-email button** on the contact card (mailto only). Add a `Copy` lucide button → `navigator.clipboard`.
- **Principles grid borders** hardcode 3-column math (`i % 3`) → border pattern breaks at the `md` 2-col breakpoint (tablets). Use `nth-child` / `divide-*` utilities instead.
- **AppButton hover is JS (`hovered` ref)** → sticky-hover on touch devices (mouseleave doesn't fire on tap-away). Move to CSS `:hover`. Same bug in `AppFooter` (raw DOM mutation).
- **Blog card tags are non-interactive `<span>`s** while header tags are filter links — inconsistent; make card tags `RouterLink` to `?tag=`.

**Top opportunities** (high-signal for a hire-funnel portfolio): availability badge above the fold (replace the gimmicky live clock — also a perf + content-hierarchy win three analyzers touched), blog→portfolio path from post pages, copy-link/share on posts, code-snippet **tabs** (trading-v3 has a *second* snippet that's silently discarded), `since`/`lastUpdated` on featured project cards, `aria-hidden` on the decorative canvas, mobile-menu resume link.

---

## §G — Documentation / naming / magic numbers (full detail: `documentation.md` — 28 items)

Your comment standard is "comment only non-obvious WHY" — so most of this is **rename/extract, not comment-spam**:
- **No project README** — the docker-compose/bun/vite-ssg workflow is non-obvious to a contributor (or you in 6 months). Worth one.
- **`NeuronCanvas.vue` is a magic-number minefield** — ~25 unnamed tuning literals (density `6500`, node clamps `120/380`, fire cooldowns, easing, opacity/radius ranges). Extract to a named `CANVAS_CONFIG` block so the animation is tunable without reverse-engineering. Plus cryptic names (`raf`, `lastT`, `px/py`, `ex/ey`, `chain`, `eased`).
- **`WORDS_PER_MINUTE`** (200) is duplicated as a bare `200` in `BlogJsonLd.vue:29` — export + import the constant.
- Naming: `principles.ts` `n` → `ordinal`; `leadership.ts` `cat` → `category`; `reduced`/`reducedMotion` → `prefersReducedMotion`; `AppButton` `linkProps` → `elementProps` (it forwards button `type` too).
- `HeroSection` `metricVisible: ref([false,false,false,false])` is hardcoded to 4 — derive from `metrics.length` so a new metric animates in.

**Already exemplary (the model for the rest)**: `scroll.ts` (every constant has provenance), `AppNav.goTo` (the nextTick+rAF WHY comment), the `--nav-h` + WCAG-contrast comments in `main.css`, `AppButton`'s merge-order comment.

---

## §H — Quick-win ranking (highest ROI first)

1. **B1** — fix `/blog/undefined` (one-line, broken funnel). ✓ verified
2. **B2** — fix reading-time (small, every post + SEO affected). ✓ verified
3. **C1** — move Shiki to build-time (−181 KB to every visitor; biggest perf win).
4. **A1–A4** — extract `.section-heading` / `.mono-label` / `.chip` classes + `date.ts` (~104 LOC, your headline ask, all low-risk).
5. **C2** — pause NeuronCanvas off-screen (battery/CPU; one observer).
6. **F: active-section nav indicator** + **useDecoder reduced-motion guard** + **copy-email** (UX wins, all small).
7. **D** — sweep the 6 dead-code items + the `@theme`/`:root` token deletions.
8. **G: README** + extract `NeuronCanvas` constants + `WORDS_PER_MINUTE` import.

Items 1–5 are a single focused session. The consolidation extractions (A1–A6) are mechanical and ideal for a `refactor-executor` pass with the reviewer gate.

---

## §I — Needs your decision (not a fix)

**The inline-style-vs-Tailwind question (§E).** Your vue-standards.md mandates Tailwind utilities; the code deliberately uses inline `style` objects to bind theme tokens to dynamic state (58+ sites). Both are defensible. Pick one:
- **(a) Sanction it** — add an exception clause to vue-standards.md ("token-bound dynamic styles may use inline `:style`") and the §A consolidation becomes CSS utility classes layered on top. Lowest effort, keeps the working code.
- **(b) Migrate** — move to Tailwind arbitrary values + CSS-var injection everywhere. Larger, churns working code, but makes the standard literally true.

Secondary decision: the **`--color-burnt` vs `--burnt` dual-token** collapse (§A) — quick-win deletions are safe; the name-collapse has a real `@theme inline` coupling tradeoff worth a deliberate call.

Everything else in this report has a clear low-risk default and is ready to execute on your say-so.

---

*No source files were modified by this audit (read-only analysis). The two confirmed bugs in §B are the only items I'd recommend fixing before the `cheddar-v1` → `main` merge — say the word and I'll do §B + §H1–5 as a gated pass.*
