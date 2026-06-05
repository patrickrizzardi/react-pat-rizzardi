# Documentation & Clarity

**Date**: 2026-06-03 · Comment standard = "comment only non-obvious WHY"; most fixes below are **rename/extract, not comments**. 28 items.

## Missing operational docs
- **No project README** (repo root). The dev workflow is non-obvious: docker-compose `bun` service (host 8082 → Vite 5173), `.devcontainer/docker-run.sh`, `HOST_PROJECT_PATH` mount var, `bun run build` = `vue-tsc --noEmit` + `vite-ssg build`, lint = oxlint+prettier+cspell. Write one: stack, dev-server start (native + Docker), build, lint/format, the env var.

## Logic bugs found during the naming pass (cross-ref bugs.md / AUDIT §B)
- `useBlogPosts.ts:39` — `estimateReadingTime(path)` measures the file path → every post "1 min"; `BlogJsonLd.vue:29` then `* 200` → wrong `wordCount`.
- `WritingSection.vue:56` — `:key="post.slug"` / `:to` use `post.slug` (undefined; it's `post.frontmatter.slug`) → `/blog/undefined`.

## Magic numbers without provenance
- **`NeuronCanvas.vue` (~25 literals)** — extract to a named `CANVAS_CONFIG`: density `6500` (`:86`), node clamps `120/380` (`:87`), fire cooldown `1500/7000` (`:111`), max edge length `0.28` (`:134`), refractory `30000/45000` (`:155`), jump duration `70/50` (`:177`), ember density `9000` (`:186`), spontaneous fire `0.0022` (`:380`), trail fade `900` (`:255`), packing `0.7` (`:88`), opacity `0.16/0.14` (`:108`), radius `0.9/1.1` (`:110`), edge probs `0.5/0.2` (`:129`), max dt `48` (`:413`), init fire `2/400/700` (`:449-450`).
- `HeroSection.vue:40` — metric stagger `500/120` → `METRIC_STAGGER_*`.
- `useDecoder.ts:17` — `700` → `DECODE_DURATION_MS`; `:9` scramble char pool → `SCRAMBLE_CHARS`.
- `CheddarWordmark.vue:12` — `1.49` → `LOGO_ASPECT_RATIO` (or cite SVG intrinsic dims).
- `WORDS_PER_MINUTE` (200) duplicated as a bare `200` in `BlogJsonLd.vue:29` → export + import from `useBlogPosts.ts`.
- `120px` section padding repeated across 5 sections + `BlogView.vue:62`/`BlogPostView.vue:47` (`120/96`) → tie to a token or spacing scale (also redundancy.md R6).

## Naming
- `principles.ts:4` `n` → `ordinal` · `leadership.ts:34` `cat` → `category` · `useDecoder.ts:17-18` `fixed`/`s` → `resolvedCharCount`/`scrambled` · `HeroSection:31` `reduced` + `NeuronCanvas:56` `reducedMotion` → `prefersReducedMotion` · `NeuronCanvas` `raf`→`animFrameId`, `lastT`→`lastFrameTimestamp`, `chain`→`waypoints`, `eased`→`easedProgress`, `px/py`→`perpX/perpY`, `ex/ey`→`edgeDx/edgeDy` · `AppButton:74` `linkProps` → `elementProps` (forwards button `type` too).

## Missing WHY on complex algorithms
- `NeuronCanvas.processSignal` (`:280-371`, 91 lines) — the `chain = [1, ...gaps.reverse(), 0]` direction-reversal encoding, the ease-in-out-quadratic, and the perpendicular-vector filament orientation all need a one-line WHY (or extract `drawSignalHead`). Rendering + state-mutation are interleaved.
- `NeuronCanvas.buildNetwork` — Poisson-ish rejection sampling with aesthetic tuning constants and no map of which number controls what.
- `useDecoder` contract non-obvious: `delay` = ms before *start* (not total), 700ms hardcoded animation, spaces/dots preserved during scramble, must run in component setup. One-line JSDoc.

## Misc
- `NeuronCanvas:164` `fanOut = Math.min(conns.length, 1)` always 1 → Fisher-Yates shuffle above is vestigial (also cleanup.md). Name it + comment, or simplify to single random pick.
- `HeroSection:13` `metricVisible: ref([false,false,false,false])` hardcoded to 4 → `ref(metrics.map(() => false))`.
- `AppButton` chip `active` sets visual style but no `aria-pressed` (also ux.md accessibility).

## Already exemplary (the model)
`scroll.ts` (provenance on every const), `AppNav.goTo` (nextTick+rAF WHY), `main.css` `--nav-h` + WCAG-contrast comments, `AppButton` merge-order comment, `WORDS_PER_MINUTE` extraction, `BlogView.normalizeTag` fallback comment.
