---
slug: cheddar-rebrand
owner: patrick
status: active
files:
  - src/**
  - public/**
  - index.html
  - vite.config.ts
created: 2026-04-30
last_updated: 2026-05-04
---

<!-- Round 1 review: BLOCK with 7 required fixes — all addressed. -->
<!-- Round 2 review: PASS. Tier B. -->
<!-- Status: APPROVED 2026-04-30. Implementation HANDED OFF to Sonnet mid-Phase-1. -->

## M1 COMPLETE — committed 2026-05-04 (commit 1da501d)

**Branch**: `cheddar-v1`. **User boundary**: do NOT push or merge to `main`.

### Phase progress

- ✅ **Phase 0** — baseline captured: `dist/index.html` 733 KB SSR bloat from NeuralGrid SVG.
- ✅ **Phase 1** — cheddar palette (`@theme` + `:root` CSS vars), Geist/Newsreader/JBMono fonts, body grain + radial glows, `.scan-grid`, `.eyebrow`, scrollbar, selection. Build verified.
- ✅ **Phase 2** — `cheddar-emblem.png` (renamed, orphan PNGs deleted), `CheddarWordmark.vue`, pill `AppNav` + `MobileMenu` (no theme toggle), `siteConfig.ts` const, `useTheme.ts` deleted, `AppFooter` updated with tagline.
- ✅ **Phase 3** — `NeuronCanvas.vue` (saltatory firing, refractory trails, ember dust, reduced-motion safe), `useDecoder.ts`, `useMagneticButton.ts`, `HeroSection.vue` rewritten (ET clock, callsign chip, GitHub chip, 4-up metrics, side label), deleted `NeuralGrid.vue` + `HeroMetrics.vue`. `dist/index.html` now **38 KB** (was 733 KB).
- ✅ **Phase 4** — lint clean (0 errors, 5 warnings), type-check via vue-tsc clean, build + all 4 SSG routes clean.

### M2 next: Home Sections

Deliverable: entire home page visually complete in Cheddar. All 6 sections render.

**Sections to build** (in order — each needs a section `id` for nav scroll targets):
1. `id="principles"` — 6-cell bordered grid, PRINCIPLES data from `data.jsx` (copy already in plan). Subhead = `06 principles` (no year).
2. `id="systems"` — featured cards with rank numeral, status pill, tagline, tech chips, 3-up metrics, code-peek panel (first snippet from existing `projects.ts`). Adapt `FeaturedCard.vue` or replace.
3. `id="leadership"` — sticky-left lede + vertical timeline (LEADERSHIP data) + key-value STACK table.
4. `id="writing"` — real `useBlogPosts()` output (index sidebar of post titles). Q3 answer: real data, not hardcoded.
5. `id="contact"` — glow-card with sliding link rows (email/github/linkedin/resume). Email = `siteConfig.email`. Contact heading copy: ship with design's "Hiring a founding CTO?" — deferred iteration post-launch.
6. Footer — already updated (tagline, siteConfig). Full visual rewrite in this milestone.

**Data references for M2:**
- PRINCIPLES, SYSTEMS (code peeks), SECONDARY, LEADERSHIP, STACK: all in `/tmp/cheddar-design/cheddar/project/cheddar/data.jsx`
- Design components: `principles.jsx`, `systems.jsx`, `leadership.jsx`, `writing.jsx`, `contact.jsx`
- Existing data: `src/data/projects.ts` (adapt per Q4 — first snippet → code peek, `archNotes` → architecture note block)
- Blog data: `src/composables/useBlogPosts.ts` (real `useBlogPosts()` for writing section)

**M2 pickup checklist:**
1. Read design files for each section before implementing.
2. Build `HomeView.vue` to import and sequence all 6 sections (currently only has HeroSection).
3. Implement sections in order above, committing after each pair or when logical.
4. Run `bun run lint && bun run build` clean before M2 commit.
5. Visual smoke: `docker compose up` → verify all 6 sections render at desktop + mobile.
6. Do NOT push to main.

### Locked decisions (do not re-litigate)

- Q1: dark-only, no toggle. Q2: keep `patrick@redact.digital`, surface via `siteConfig.ts` const. Q3: real `useBlogPosts()` in writing section. Q4: adapt existing rich project data (first snippet → code peek, archNotes → "architecture note" block).
- Hero slot-4 metric = `4 dev team` (NOT `12 yr shipping`, NOT `4 yr profitable`).
- Hero side label = `cheddar / 2026 — engineering log` (drop `v3`).
- Principles subhead = `06 principles` (drop `2026 edition`).
- Footer tagline = `shipped with intent · not by accident`.
- Hero callsign chip includes a small `↗ github` chip linking to `siteConfig.github`.
- Clock = `ET` (not `EST`), formatted via `toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false })`.
- Decoder Ref initial value = final string; scramble starts in `onMounted` (prevents hydration mismatch).
- Mobile breakpoints translated to Tailwind `md:`/`lg:` (no scoped `@media`).
- Delete BOTH `public/Glowing golden arcane emblem and seal.png` AND legacy `public/assets/logo.png` outright (no orphan files).
- Phase 1+2+3 ship as ONE PR (M1) — never deploy the half-flipped intermediate.

## User-confirmed answers (2026-04-30)

- **Q1 — Theme toggle**: KILL it. Dark only. Confirmed.
- **Q2 — Email**: keep `patrick@redact.digital`. Surface as a `const` (single source of truth) — see siteConfig addition below.
- **Q3 — Writing section**: real `useBlogPosts()` output. Confirmed.
- **Q4 — Project data shape**: ADAPT existing rich data. Confirmed.
- **Stack**: Vue 3 + Pinia + Vite + Tailwind 4 (no React — JSX in design files is just the prototype medium; we port to Vue components).

## Design-feedback decisions (APPROVED 2026-04-30 — rolled into phases below)

Verdict on the design as a whole: **good — keep it**. Neuron canvas, Geist + Newsreader + JetBrains Mono trio, and the operating-principles section are the load-bearing wins. Pushback items:

| Tweak | Reason | Proposed change |
|---|---|---|
| Hero side label `cheddar / v3 — engineering log` | "v3" doesn't pay off anywhere; pretends the portfolio is a versioned system | `cheddar / 2026 — engineering log` |
| Principles subhead `06 principles · 2026 edition` | "edition" implies yearly updates that won't happen | `06 principles` (drop the year) |
| Footer tagline `built from bare metal · no frameworks · no apologies` | Literal contradiction — we ship on Vue/Tailwind/vite-ssg | `shipped with intent · not by accident` |
| `Hiring a founding CTO?` contact heading | Coin-flip — swagger fits brand, reads presumptuous to some founders | **DEFERRED** — ship rebrand with design's copy as-is, iterate after living with it for a week. See "Post-rebrand polish" todo at bottom. |
| `12 yr shipping` metric | Missing leadership signal — pure scale story. CTO differentiator is "I lead engineers." | **LOCKED → `4 dev team`** (real number — the 4 juniors at VPM). Adds the leadership signal the hero metrics row currently lacks. |
| GitHub link visibility | Founders look at GitHub before they reply; today only in Contact | Add small `↗ github` chip near hero callsign |
| Email + social URLs hardcoded | Q2 user feedback — make a const | NEW: `src/data/siteConfig.ts` exporting `siteConfig` const. Imported by Contact, AppFooter, hero callsign, JSON-LD. |

If user greenlights, these fold into M1 Phase 2 (siteConfig + tagline copy) and Phase 3 (hero side label + GitHub chip + metric swap).

## Next steps

1. ✅ User approved design tweaks (2026-04-30). Slot-4 metric → `4 dev team`. Contact heading copy → deferred.
2. **NOW**: execute Phase 0 (baseline build) → Phase 1 → Phase 2 → Phase 3 → Phase 4 verification.
3. M2 / M3 / M4 follow as separate commits/PRs on `cheddar-v1`. **User handles merge to `main` themselves** — agent does NOT push or merge to main.

## Post-rebrand polish (deferred, after M4)

- [ ] Iterate on `Hiring a founding CTO?` contact heading after living with it for a week. Test alternates: `Hiring engineering leadership?` / `Looking for a CTO-track engineer?` / keep as-is.
- [ ] Lighthouse a11y audit on production deploy — verify color contrast on text-3 over `--bg` passes AA at small font sizes.
- [ ] Decide whether to bump LCP-trigger from Phase 2 step 2 (resize emblem PNG if LCP regresses >200ms vs baseline).


<!-- cSpell:words lede Yinzer cheddar oklch Geist Newsreader saltatory ranvier myelin refractory Tessa -->

# Plan: cheddar-rebrand

Created: 2026-04-30
Status: pending_approval

## Context & Why

**Goal.** Port the "Cheddar" handoff bundle from Claude Design (an HTML/JSX prototype at `/tmp/cheddar-design/cheddar/`) into the existing Vue 3 + Tailwind 4 + vite-ssg portfolio at `redact.digital`. This is a full visual rebrand — Patrick is rebranding his personal/professional identity to "Cheddar" (his existing nickname in games and coding) while keeping his real name as a system callsign in the hero. Color palette shifts from **navy + cyan** to **warm carbon + burnt orange + cheddar gold**. Typography shifts from generic Inter to **Geist (display) / Newsreader (italic accent) / JetBrains Mono (chrome)**.

**Why this matters.** Current portfolio looks like every other engineer's site (navy + cyan + Inter). Patrick is positioning himself for CTO / Engineering Lead engagements at startups and needs a brand that signals (a) leadership weight without being stiff, (b) developer-credible terminal aesthetic, (c) personality — the thing CTOs-for-hire trade on. The Cheddar design hits all three: editorial × terminal feel, magnetic CTA + neuron canvas + decoder callsign giving "live system" energy, six "operating principles" in copy that reads as Patrick's own voice. The rebrand is the differentiator.

**Background — what exists today.**
- Vue 3 (3.5.33), Tailwind 4 (4.2.4) with `@theme` block defining navy/cyan tokens, vite-ssg (28.3.0) for static generation.
- Routes: `/` (HomeView with HeroSection + ProjectsSection + AboutSection + ContactSection), `/blog` (BlogView), `/blog/:slug` (BlogPostView).
- Blog: markdown → unplugin-vue-markdown → Shiki (github-dark theme) → vite-ssg pre-renders all posts. Sitemap auto-generated. Currently 1 post (`hello-world.md`).
- Theme toggle: `useTheme` composable with localStorage persistence + system preference fallback. Toggleable dark/light via the navbar icon.
- Hero: `NeuralGrid.vue` is SVG-based (800 nodes, 10 pulses, simple linear stroke-dashoffset travel — no neuron physics).
- Logo: 32×32 PNG at `/public/assets/logo.png`.
- Project data: `src/data/projects.ts` has rich shape (tech array, archNotes, snippets w/ language + code, role/period for experience tier, repoUrl/liveUrl/extensionUrl/npmUrl).
- SEO: `useSeo` composable, JSON-LD via `BlogJsonLd.vue`, sitemap on build.

**Background — what the design changes.**
- Single dark theme (warm carbon, no light variant).
- 6 sections instead of 4: Hero / **Principles (NEW)** / Systems (replaces Projects) / Leadership (replaces About) / Writing (preview of blog) / Contact.
- Hero: callsign chip (`cheddar://patrick.rizzardi` with decoder animation + EST clock), magnetic primary CTA, Geist 800 headline with Newsreader-italic accent words, 4-up metrics row, **canvas-based neuron animation** (saltatory firing, refractory trails, ember dust — see `/tmp/cheddar-design/cheddar/project/cheddar/neurons.jsx`).
- Principles: 6-cell bordered grid, hover lights up burnt-orange wash. Content already written in Patrick's voice (see `/tmp/cheddar-design/cheddar/project/cheddar/data.jsx` — PRINCIPLES const).
- Systems: featured cards with rank numerals + status pill + tagline + tech chips + 3-up metrics + a syntax-highlighted code-peek panel. Existing data shape mostly compatible.
- Leadership: sticky-left lede + vertical timeline (years on the rail, role + org + detail per row) + key-value stack table.
- Writing: index sidebar of post titles + article surface with editorial prose styles (lede class, italic Newsreader em, blockquote, code, etc.).
- Contact: glow-card with sliding link rows (email/github/linkedin/resume), site footer beneath.

**Constraints.**
- Keep vite-ssg pipeline intact (no SSG regression).
- Keep blog architecture (markdown → Shiki → routes) — only the visual prose styles change.
- Keep TypeScript strictness (no `any`, type-only field unions, etc. — see `~/.claude/rules/coding-style.md`).
- Vue Composition API + `<script setup>` only; arrow functions; `T | null` for optional fields (see `.claude/rules/vue-standards.md`).
- vite-ssg pre-renders during `bun run build` — anything client-only (canvas, IntersectionObserver, decoder animation) must be guarded so SSR doesn't crash.
- The two emblem PNGs already in `public/` are the logo source. Filenames have spaces — must be renamed before reference.

**Success criteria.**
1. `bun run build` succeeds with no SSR crash and outputs static HTML for `/`, `/blog`, `/blog/:slug`.
2. Home page renders all 6 sections in the new visual language at desktop AND mobile.
3. Blog routes inherit the new theme tokens / typography but keep existing functionality (tag filter, prev/next nav, JSON-LD, reading time, slug pages).
4. Lighthouse a11y stays ≥ 95 (color contrast on text-2/text-3 over `--bg` verified).
5. `bun run lint` and `bun run type-check` pass clean.
6. No `as any`, no `!` non-null assertions, no `key?: T` on object types per coding-style rules.
7. Branch `cheddar-v1` merges cleanly to `main` once approved.

## Research Findings

**Tailwind 4 + oklch.** Tailwind 4's `@theme` block accepts arbitrary CSS values including `oklch(...)`. Tokens declared there generate corresponding utility classes. However, the design uses a LOT of inline CSS variables (`var(--burnt)`, `var(--card-shadow)`, etc.) that don't map cleanly to utility classes. **Strategy:** keep raw CSS variables (declared in `main.css` `:root`) as the source of truth for theme values; declare matching Tailwind tokens in `@theme` only for tokens we'll actually use as utility classes (e.g., `bg-cheddar-bg`, `text-burnt`, `border-line`). This avoids forcing every inline-style oklch into a utility we don't need.

**vite-ssg + canvas.** vite-ssg pre-renders the Vue app to HTML at build time using a JSDOM-like environment. `<canvas>` element renders as DOM (no crash), but `getContext('2d')` returns null in SSR. **Strategy:** initialize canvas inside `onMounted` only — already what the design does (`React.useEffect`). The Vue port will use `onMounted` + ref guard. No `<ClientOnly>` wrapper needed. Verified pattern in existing `NeuralGrid.vue`.

**Geist + Newsreader fonts.** Both available on Google Fonts. Design loads via `<link>` in HTML head with `&display=swap`. **Strategy:** add the same `<link>` to `index.html` head. Avoid build-time bundling — Google Fonts CDN serves with proper caching, lower initial bundle than self-hosted (~85KB Geist + 60KB Newsreader subsetted).

**Shiki vs design's mini-highlighter.** Design has a tiny inline regex-based syntax highlighter (`systems.jsx:131-154`). We already use Shiki for blog markdown. **Strategy:** reuse Shiki for code peeks in Systems section — single highlighter across the app, better quality (tokens match dark theme), and we get language-pack tree-shaking already configured. Render snippets to HTML at build via Shiki and embed.

**Theme toggle.** Design is dark-only — no light variants for any of the new tokens. Current `useTheme` composable persists `dark` / `light` to localStorage and toggles `<html class="dark">`. **Strategy:** delete the toggle. Hard-code `class="dark"` on `<html>` in `index.html`. Remove `useTheme` import from `App.vue` and `AppNav.vue`. Delete `useTheme.ts`. Tailwind's `dark:` variants still work — they just always match.

**Canvas performance on mobile.** Design has 120-380 nodes with cascade firing. Mobile devices (lower-end) can struggle with 380 nodes drawing every frame. **Strategy:** scale node count by viewport size already (it does — `(width*height)/6500`). Add a `prefers-reduced-motion` short-circuit that renders the canvas as a single static state (no animation). This is a strict additive over the design.

**Inline-style heaviness in design.** The JSX uses inline `style={{...}}` extensively. Vue with `<script setup>` plus Tailwind typically uses utility classes. **Strategy:** convert to Tailwind utility classes where the design's value matches a token (gap, padding, font-size); keep inline style or scoped style only for truly bespoke values (oklch shadows, specific blur values, gradients). This is consistent with `vue-standards.md` (Tailwind utilities preferred, scoped styles only for transitions).

**Blog frontmatter today.** `BlogModule` interface expects `title`, `date`, `description`, `tags`, `slug`, optional `author`, optional `draft`. The hello-world post is the only existing post — its frontmatter shape works as-is. **Strategy:** preserve the frontmatter contract; only restyle the rendering.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Canvas SSR crash during `vite-ssg build` (getContext on null) | Med | High | onMounted-only init + ref null-check. Test `bun run build` end of M1. |
| Tailwind 4 `@theme` rejects oklch literals | Low | High | Tailwind 4 docs confirm oklch is accepted in `@theme`; if rejected, fall back to declaring tokens as raw CSS vars in `:root` only. |
| Removing `useTheme` breaks an unforeseen import | Low | Med | Grep for `useTheme` usages before deletion (currently 2: `App.vue`, `AppNav.vue`); remove both call sites + the file in one PR. |
| Logo PNG (1MB) too heavy for nav, hurts LCP | High | Med | Resize to 64×64 WebP for nav use; keep full PNG for hero accent if needed. Aim for <30KB nav asset. |
| Decoder text animation, magnetic button, IntersectionObserver crash SSR | Low | High | All three guarded by `onMounted` + `typeof window` checks. Existing `useScrollReveal` already handles this. |
| Geist + Newsreader + JetBrains Mono triples font-load count → CLS | Med | Low | Use `display=swap` + preconnect (design already does); only request weights actually used (Geist 400/500/700/800/900; Newsreader italic 400/500; JBMono 400/500/700). |
| Color contrast on text-3 (`oklch(0.58)`) over bg (`oklch(0.15)`) fails AA on small text | Med | Med | Verify with browser devtools / axe. text-3 is meta/eyebrow only — not body copy. text-2 (oklch 0.78) carries body. |
| Project data shape mismatch (current has `archNotes` + multi-snippet array, design has single `code` block) | Low | Low | LOCKED DECISION (per Q4 default): render first snippet as the code peek; render `archNotes` as a smaller "architecture note" block under the description. Loses nothing, gains the new visual. Executor does NOT re-litigate in M2. |
| Existing components (`FeaturedCard`, `ProjectCard`, etc.) become orphaned | Low | Low | Delete them in the same PR as the section that replaces them. No backward-compat shims (per `no-duct-tape.md`). |
| Prose styles clash with `@tailwindcss/typography` plugin's `prose` class | Med | Med | Use a unique class name (`.prose-cheddar`) on the article element; configure Tailwind typography plugin off OR scope our overrides via the new class to avoid double-application. |
| Blog post `hello-world.md` re-renders broken under new prose | Low | Low | Smoke-test `/blog/hello-world` in dev after M3; rules apply via class wrapper. |
| Mobile breakpoints in design hard-coded at 880px / 980px don't match Tailwind's `md` (768) / `lg` (1024) | Low | Low | LOCKED DECISION: translate to Tailwind breakpoints — design's 880px → `md:` (768px), 980px → `lg:` (1024px). Cosmetic difference of <10% viewport width is acceptable and keeps everything in Tailwind utilities (no scoped `@media` rules). Executor does NOT decide per-component. |
| Performance regression — adding canvas + 3 fonts increases initial paint time | Med | Low | Lazy-defer canvas init by 1 RAF (already does); fonts use `display=swap`. Acceptable for the brand uplift. |
| The user's "better logo" mention implies they may swap PNGs again later | Med | Low | Wire logo via a single import path (`@/assets/logo` or `/logo.png`) so swapping is one file change. |

## Questions

Four points needed confirmation. Two are gating M1 (must answer before Phase 2 begins). Two are gating M2 (must answer before that milestone begins). Each has a default decision baked in below — user overrides take precedence.

**Q1 — Theme toggle: kill it (default: YES, dark-only).** Design has zero light variants. Inventing a light-mode palette is design work outside scope. Default decision: delete `useTheme.ts`, hardcode `<html class="dark">` in `index.html`, remove the toggle button from `AppNav.vue` and `MobileMenu.vue`. **GATING M1 PHASE 2** — the answer drives Phase 2 step 6/7. If user vetoes, Phase 2 is replanned to add a `--bg-light` etc. token set and the toggle stays.

**Q2 — Email contact: keep `patrick@redact.digital` (default: YES).** Design hardcodes `patrick@cheddar.dev`. User owns `redact.digital`. Default: keep `patrick@redact.digital` — no new domain purchase. **GATING M2 CONTACT SECTION** — affects Contact section copy only. Doesn't block M1.

**Q3 — Writing section data source: real `useBlogPosts()` output (default: YES).** Design has 4 hardcoded "drafts." We have 1 real post. Default: render writing index from `useBlogPosts()`. List grows as posts ship. **GATING M2 WRITING SECTION**.

**Q4 — Project data shape: adapt existing rich data, render first snippet as code peek, render `archNotes` as smaller "architecture note" block under description (default: ADAPT, not rewrite).** This is the locked decision; the risk-table reference at line 91 reads the same way. Decision is locked HERE, not deferred to executor. **GATING M2 SYSTEMS SECTION**.

If user vetoes any default, the affected milestone replans before that milestone executes; M1 is unaffected by Q2/Q3/Q4 vetoes.

## Risk Assessment & Rollout Strategy

**Risk level: LOW**

| Criteria | Applies? | Notes |
|---|---|---|
| Touches payments/billing | No | |
| Touches auth/permissions | No | |
| Raw SQL / literals | No | |
| Modifies existing data | No | Frontend-only, no DB |
| Third-party integration | No | Google Fonts CDN doesn't count (read-only public CDN) |
| Changes existing endpoints | No | No API in this repo |

**Mitigations applied:**
- Feature branch (`cheddar-v1`) with PR-per-milestone review → Any → one level lower (already at LOW)
- Frontend-only / display-only → MEDIUM → LOW (already at LOW)
- Backwards-compatible visual change (all routes still resolve and render) → reinforces LOW

**Rollout plan:**
1. Internal testing: 1-2 days per milestone — Patrick reviews each PR locally (`docker compose up`) and on a Vercel/DO preview if wired.
2. Skip small rollout — go straight to 100% (LOW risk, no users to roll out to).
3. Final merge to `main` after Milestone 4 (cleanup) lands. Auto-deploys via DO App Platform.

No feature flag — visual rebrand of a personal portfolio without traffic. Per `no-duct-tape.md`: a flag here would be ceremonial, not load-bearing.

## Roadmap (milestones)

### Milestone 1: Foundation + Hero — single-session
After this ships: the home page hero looks fully Cheddar — new theme tokens, new fonts, new logo, new nav, new hero with the neuron canvas firing, decoder callsign, magnetic CTA, metrics. The rest of the home page below the hero will visually be in flux until M2.
**Status**: in_progress
**Deliverable PR**: foundation + hero

### Milestone 2: Home Sections (Principles + Systems + Leadership + Writing + Contact + Footer) — single-session
After this ships: the entire home page is visually complete in the Cheddar look. All 6 sections render. Footer matches.
**Status**: planned
**Depends on**: Milestone 1
**Deliverable PR**: home sections + footer

### Milestone 3: Blog Restyle — single-session
After this ships: `/blog` and `/blog/:slug` inherit the Cheddar theme — index cards, post header, prose styles, prev/next nav. Blog functionality (tags, JSON-LD, sitemap) unchanged.
**Status**: planned
**Depends on**: Milestone 1 (theme tokens)
**Deliverable PR**: blog restyle

### Milestone 4: SEO + Cleanup + Ship — single-session
After this ships: all "Patrick Rizzardi"-branded SEO meta updated to "Cheddar / Patrick Rizzardi", a11y verified, lint/type-check green, branch merged to main, auto-deploy to redact.digital.
**Status**: planned
**Depends on**: Milestones 1-3
**Deliverable PR**: SEO + cleanup → merge to main

---

## Current Milestone: Foundation + Hero

### Phase 0 (pre-implementation): Capture Lighthouse baseline
**Not a PR phase** — single command run BEFORE Phase 1 starts so post-M1 Lighthouse comparison is meaningful.
**Steps**:
1. On `main` branch, run `docker compose run --rm bun run build && bun run preview` and capture Lighthouse mobile scores for `/` and `/blog`. Record numbers (Performance, Accessibility, Best Practices, SEO) in the M1 PR description as the comparison baseline.
2. Switch back to `cheddar-v1`. Phase 1 begins.

---

### Phase 1: Theme tokens + fonts + global styles
**PR scope**: New theme tokens (CSS vars + Tailwind `@theme`), font loading, ambient body background (grain + radial glows), scan-grid utility, scrollbar styles, selection styles. No component changes yet.
**Branch**: `cheddar-v1` (single branch — Phase 1, 2, 3 all land as separate commits but ship together as ONE PR for M1, NOT as three separately mergeable PRs).
**Flag**: N/A
**Est. lines**: ~150
**Objective**: Replace navy/cyan palette with cheddar/burnt/carbon palette globally so existing components shift colors automatically. Set up font stack.
**Why this phase exists**: Lock the design tokens before touching components. Component PRs reference `var(--burnt)` etc. — the variables must exist first.
**PR boundary**: Phase 1's diff is a commit on the M1 branch, NOT a standalone deployable state. The intermediate state between Phase 1 and Phase 2 (existing nav still references `bg-navy` while tokens flip to cheddar — visually broken) MUST NOT be a deployed/merged state. M1 ships as one PR containing all three phases. This is enforced by NOT pushing the Phase 1 commit alone to a state that auto-deploys to redact.digital. Per `no-duct-tape.md`: shipping the half-flipped intermediate would be the duct-tape pattern this rule prohibits.
**Current-state anchors**:
- `src/assets/main.css:6-32` — current `@theme` block with navy/cyan tokens (replace)
- `index.html:1-13` — current `<head>` (add font links, fix lang, fix description meta)
- `/tmp/cheddar-design/cheddar/project/Cheddar.html:15-152` — design's `:root` token block + body styles (port verbatim, adapted to Tailwind 4 syntax)
**Files (expected scope)**:
- `src/assets/main.css` — rewrite tokens
- `index.html` — add Google Fonts links, update title + description, hardcode `class="dark"` already there
**Deviation rule**: Executor MAY adjust adjacent CSS for the cleanup. Document any change beyond these two files in the PR description.
**Steps**:
1. In `src/assets/main.css`, replace the `@theme` block: drop navy/cyan tokens; add `--font-display: 'Geist'`, `--font-accent: 'Newsreader'`, `--font-mono: 'JetBrains Mono'`, `--font-body: 'Geist'`. Add Tailwind tokens for `bg-cheddar-bg` / `text-cheddar` / `border-line` only — for tokens we'll consume as utility classes.
2. In the same file, after `@theme`, add a `:root` block with all the design's CSS vars verbatim from `Cheddar.html:15-152` (bg, bg-2, bg-3, line, line-soft, card, card-deep, card-chrome, card-blur, card-shadow, card-shadow-hi, text/text-2/text-3/text-4, burnt, burnt-hi, cheddar, cheddar-hi, ember, primary, primary-glow, shadow-1, shadow-glow, radius, radius-sm, font-display, font-accent, font-body, font-mono).
3. Add body styles: `font-family`, `color`, `background`, `font-feature-settings`, `-webkit-font-smoothing`, `line-height`, `overflow-x`. Add `body::before` (radial glows) and `body::after` (noise SVG) per design.
4. Add `.scan-grid` utility class (used in hero).
5. Add `::selection`, `::-webkit-scrollbar` rules.
6. Keep existing `.spotlight-card::before` and `.reveal` if still referenced; otherwise delete after M2 audit.
7. In `index.html`: update `<title>` to "Cheddar — Patrick Rizzardi · Engineering Lead & Architect"; update meta description; add `<link rel="preconnect">` and `<link href="...family=Geist...Newsreader...JetBrains+Mono">` per design. The `class="dark"` on `<html>` is already present — keep it.
8. Run `docker compose up` — confirm fonts load and warm carbon background renders. Existing components will look mismatched (navy classes still referenced). That's expected.
**Acceptance criteria**:
- [ ] `bun run build` succeeds
- [ ] `<body>` background renders the warm carbon + radial glows + noise overlay in dev
- [ ] Geist font visible on existing h1/h2 (or whatever they currently use); JetBrains Mono renders where `var(--font-mono)` is referenced
- [ ] All design CSS vars resolvable in browser devtools `getComputedStyle(document.documentElement)`
**Quality gate**:
- [ ] No `any` introduced
- [ ] No console errors in dev
- [ ] Existing routes still load (`/`, `/blog`)
- [ ] Lighthouse perf doesn't drop more than 5pt vs baseline
**Verification**: `docker compose up` → visit `localhost:8080` → inspect `<html>` and `<body>` computed styles → confirm `--burnt` resolves to `oklch(0.66 0.17 48)`.

---

### Phase 2: Logo + AppNav rebuild
**PR scope**: Rename emblem PNG, build optimized nav-size variant, replace `AppNav.vue` with the design's pill-style fixed nav (Cheddar wordmark + section anchors + ghost-style hire CTA), delete theme toggle wiring.
**Flag**: N/A
**Est. lines**: ~120
**Objective**: Nav matches the design — pill-shaped fixed at top center, Cheddar wordmark on left, anchor links in mono lowercase, ghost burnt-orange CTA on right. No theme toggle. Logo asset is a real image, not the existing 32×32 png.
**Why this phase exists**: Nav appears on every route. Doing it once now means M2 (sections) and M3 (blog) inherit the new nav for free.
**Current-state anchors**:
- `public/Glowing emblem within ancient rune frame.png` — chosen logo source (744KB raw PNG)
- `public/Glowing golden arcane emblem and seal.png` — alternate (1MB)
- `public/assets/logo.png` — existing 10KB nav logo (replace)
- `src/components/layout/AppNav.vue:1-77` — current nav (rewrite)
- `src/composables/useTheme.ts` — delete entirely
- `src/App.vue:6` — delete `useTheme()` call
- `src/components/layout/MobileMenu.vue` — currently takes `isDark` + `@toggle-theme` props (rewrite or delete)
- `/tmp/cheddar-design/cheddar/project/cheddar/nav.jsx` — design reference
- `/tmp/cheddar-design/cheddar/project/cheddar/logo.jsx:166-184` — `CheddarWordmark` component reference
**Files (expected scope)**:
- `public/cheddar-emblem.png` (renamed from "Glowing emblem within ancient rune frame.png", ideally resized)
- `public/cheddar-emblem-256.png` (optional 256× variant for hero)
- `src/components/layout/AppNav.vue` (rewrite)
- `src/components/layout/MobileMenu.vue` (rewrite — drop theme toggle props)
- `src/components/layout/CheddarWordmark.vue` (NEW — small component for logo + "cheddar." text)
- `src/composables/useTheme.ts` (DELETE)
- `src/App.vue` (drop `useTheme` import + call)
**Deviation rule**: Executor MAY consolidate the wordmark into AppNav directly if the wordmark isn't reused elsewhere yet. Decision deferred to executor.
**Steps**:
1. Rename `public/Glowing emblem within ancient rune frame.png` → `public/cheddar-emblem.png` via `mv` (spaces in filenames break URL-encoding). **Delete** `public/Glowing golden arcane emblem and seal.png` outright — keeping it as an unused source asset is the orphan-file pattern (`no-duct-tape.md` rule #10 family). If user wants to swap emblems later, they can re-supply the file. No "we might use this later" deferred decision without a named follow-up trigger. Also delete the legacy `public/assets/logo.png` (the 10KB current nav logo) — it's superseded.
2. (Optional perf) — generate a 256×256 WebP or smaller PNG for nav use to keep nav asset under ~30KB. If the raw 744KB PNG renders fine downsized via CSS, skip this. **Decision rule**: if Lighthouse LCP regresses >200ms post-merge, come back and resize.
3. Create `CheddarWordmark.vue`: small component, renders `<img src="/cheddar-emblem.png">` next to `cheddar.` text in JetBrains Mono with the dot in `var(--burnt-hi)`.
4. Rewrite `AppNav.vue`: fixed pill at top center, glass background (`var(--card)` + backdrop-blur), 4 anchor links (systems / principles / leadership / writing) using mono font, click-scroll-to-section behavior, ghost CTA "hire ↗" linking to #contact. Hover transitions match design (`oklch(1 0 0 / 0.04)` link hover background, burnt-orange wash on CTA hover).
5. Rewrite `MobileMenu.vue`: same pill pattern but expand vertically; drop `isDark` and `@toggle-theme` props. Take only `:open` and `@close` plus the links array.
6. Delete `src/composables/useTheme.ts`.
7. In `src/App.vue`: remove the `import { useTheme }` line, remove the `useTheme()` call. The `<html class="dark">` in `index.html` carries dark mode now.
8. Test mobile breakpoint — at <768px the pill collapses to just wordmark + hamburger; mobile menu opens with full link list.
**Acceptance criteria**:
- [ ] Nav renders as a pill fixed top-center on desktop
- [ ] Wordmark renders Cheddar emblem + "cheddar." text
- [ ] Clicking section links smooth-scrolls to anchor (anchors won't exist yet — verify `getElementById` doesn't throw, link is harmless if anchor missing)
- [ ] Hire CTA renders ghost style with burnt border, hover wash
- [ ] No theme toggle visible anywhere
- [ ] `useTheme.ts` deleted, no orphan imports
- [ ] Mobile menu opens/closes
**Quality gate**:
- [ ] No `function` keyword (arrow functions only)
- [ ] No `key?: T` optional fields on the props type — use `T | null` if needed
- [ ] All Vue 3 conventions per `vue-standards.md` (Composition API, `<script setup>`, no `<style>` blocks except for transitions)
**Verification**: `docker compose up` → nav renders correctly desktop + mobile. `bun run type-check` clean. `grep -r 'useTheme' src/` returns zero hits.

---

### Phase 3: Hero rebuild + neuron canvas
**PR scope**: Rewrite `HeroSection.vue` to match design (callsign chip + decoder + EST clock + Geist 800 headline + Newsreader italic + magnetic CTA + ghost CTA + 4-up metrics row), build new `NeuronCanvas.vue` (port `neurons.jsx`), delete old `NeuralGrid.vue` + `HeroMetrics.vue`.
**Flag**: N/A
**Est. lines**: ~450 (canvas component is dense)
**Objective**: Home hero is the Cheddar hero. Canvas fires neurons with saltatory conduction + ember dust. Decoder animation runs once on mount. Magnetic button reacts to mouse. EST clock ticks every second. Metrics fade in staggered.
**Why this phase exists**: This is the centerpiece of the rebrand. Visually, the user sees this first when they hit the site. Locking it in early validates that the canvas works under vite-ssg.
**Current-state anchors**:
- `src/components/hero/HeroSection.vue:1-99` — current hero (rewrite)
- `src/components/hero/NeuralGrid.vue:1-153` — old SVG neurons (DELETE)
- `src/components/hero/HeroMetrics.vue:1-74` — old metrics (DELETE — design's metrics are inline in hero)
- `/tmp/cheddar-design/cheddar/project/cheddar/hero.jsx` — design hero reference
- `/tmp/cheddar-design/cheddar/project/cheddar/neurons.jsx` — design canvas reference
- `/tmp/cheddar-design/cheddar/project/cheddar/data.jsx:156-161` — METRICS const
**Files (expected scope)**:
- `src/components/hero/HeroSection.vue` (rewrite)
- `src/components/hero/NeuronCanvas.vue` (NEW)
- `src/components/hero/NeuralGrid.vue` (DELETE)
- `src/components/hero/HeroMetrics.vue` (DELETE)
- `src/composables/useDecoder.ts` (NEW — decoder text effect)
- `src/composables/useMagneticButton.ts` (NEW — mouse-tracking transform)
- `src/data/metrics.ts` (NEW — port METRICS const)
**Deviation rule**: Executor MAY co-locate `useDecoder` / `useMagneticButton` inside the hero component if they're truly single-use. Recommend separating per `vue-standards.md` composables convention.
**SSR-safety enumeration (mandatory pre-step before any code changes)** — the canvas component is the load-bearing SSR risk. Before writing `NeuronCanvas.vue`, enumerate every `window.*`, `document.*`, `navigator.*`, `performance.*`, `setTimeout`, `setInterval`, `requestAnimationFrame`, `matchMedia`, `IntersectionObserver`, and `getContext` reference from `neurons.jsx` + `hero.jsx`. From the source files at `/tmp/cheddar-design/cheddar/project/cheddar/`:

| Reference | Source | Vue placement |
|---|---|---|
| `window.devicePixelRatio` | `neurons.jsx:15` | inside `onMounted` — store as `let dpr` after mount |
| `canvas.parentElement.offsetWidth/Height` | `neurons.jsx:23-24` | inside `onMounted` (DOM access) |
| `canvas.getContext('2d')` | `neurons.jsx:13` | inside `onMounted` (canvas ref guard) |
| `performance.now()` | `neurons.jsx:58, 154` + `hero.jsx:147, 150` | inside `onMounted` only — initial Ref values must NOT call this at setup time |
| `requestAnimationFrame` / `cancelAnimationFrame` | `neurons.jsx:155, 368, 378, 382` + `hero.jsx:147, 159, 163` | inside `onMounted`; cleanup in `onUnmounted` |
| `window.addEventListener('resize')` | `neurons.jsx:380` | inside `onMounted`; cleanup `removeEventListener` in `onUnmounted` |
| `setTimeout` for fade-in / decoder delay | `hero.jsx:191, 213` | inside `onMounted`; cleanup in `onUnmounted` |
| `setInterval` for clock | `hero.jsx:213` | inside `onMounted`; `clearInterval` in `onUnmounted` |
| `new Date().toLocaleTimeString` | `hero.jsx:209` | inside `onMounted` callback (clock Ref initial value = empty string) |
| `e.clientX / e.getBoundingClientRect()` | `hero.jsx:171-172` | event handler — only fires post-mount, safe at setup |
| `window.matchMedia('prefers-reduced-motion')` | NEW (we add it) | inside `onMounted`; checked once at init, NOT re-checked on resize |

**Invariant (Given/When/Then)**: Given the canvas component imports zero browser globals at module scope, when `bun run build` runs (vite-ssg + vue-tsc), then SSG output renders `<canvas>` as an empty element with no script-time errors, and the build for `/`, `/blog`, `/blog/hello-world` all succeed. Verified via `grep -nE 'window\.|document\.|navigator\.|performance\.|requestAnimationFrame|setInterval|setTimeout|matchMedia' src/components/hero/NeuronCanvas.vue src/composables/useDecoder.ts src/composables/useMagneticButton.ts` — every match must be inside an `onMounted` / event-handler / `onUnmounted` body, never at module-scope or `<script setup>` top level.

**Steps**:
1. Create `src/data/metrics.ts` exporting `metrics: ReadonlyArray<{ value: string; label: string }>` from design (`$2M+`, `500M+`, `100K+`, `12 yr`).
2. Create `src/composables/useDecoder.ts` — port `useDecoder` from `hero.jsx:140-166`. **SSR-safety**: initial `Ref<string>` value MUST be the final string (no scramble). Scramble loop starts inside `onMounted`. Without this, hydration sees a different string than SSR rendered → mismatch warning. Returns `Ref<string>`. Uses `requestAnimationFrame` + `performance.now()` inside the mount-time tick function only. Cleanup on unmount.
3. Create `src/composables/useMagneticButton.ts` — returns `{ buttonRef, onMouseMove, onMouseLeave }` per `hero.jsx:168-187`. Ref attaches to the button via `:ref="buttonRef"`; mouse events translate the element by 25% of mouse offset. Honors `prefers-reduced-motion` (no transform if matches).
4. Create `src/components/hero/NeuronCanvas.vue` — port the entire neuron simulation from `neurons.jsx`. **SSR-safety**: ALL canvas/window/performance references inside `onMounted` per the enumeration table above. Use `onUnmounted` for `cancelAnimationFrame` + resize listener removal. Add `prefers-reduced-motion` short-circuit: at mount time, `matchMedia('(prefers-reduced-motion: reduce)').matches` → if true, run `tick` exactly once (single static frame) and DO NOT schedule the RAF loop, AND skip starting the resize-driven `buildNetwork` rebuild on subsequent resize events (resize listener becomes a no-op). Apply the `mask-image` radial gradient on the wrapper div per design.
5. Rewrite `HeroSection.vue`:
   - Section wrapper: `relative min-h-screen flex items-center overflow-hidden pt-[120px] pb-[80px]`.
   - Mount `<NeuronCanvas />` absolute inset-0 z-0.
   - Add the dark veil + radial vignette overlays per design (z-1).
   - Add `.scan-grid` div (z-1).
   - Inner container z-2. Vertical-rl side label "cheddar / v3 — engineering log".
   - Callsign chip: pill with green dot, "cheddar://" + decoder result + "·" + ET clock. Use `useDecoder('patrick.rizzardi', 200)`. **Clock format**: `toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false })` → append literal ` ET` (not `EST` — the unambiguous label that's correct year-round across DST; design used `EST` which is technically wrong for ~8 months of the year).
   - h1 with `var(--font-display)` 800, italic Newsreader on "backend", highlighted underline on "stay profitable".
   - Subhead paragraph using design's copy.
   - CTA row: magnetic primary (gradient burnt → ember) + ghost secondary + meta line "↳ available · CTO + Eng Lead".
   - Metrics row: 4-up grid w/ stagger fade-in via `setTimeout` on mount.
6. Delete `NeuralGrid.vue` + `HeroMetrics.vue`. Verify no orphan imports anywhere.
7. Test the build: `docker compose run --rm bun run build` — must succeed without canvas SSR error.
8. Test in browser: canvas fires, decoder runs once, clock ticks, magnetic button responds to mouse, metrics stagger in.
9. Test prefers-reduced-motion: enable in OS / dev tools, reload — canvas should render one frame and stop. Magnetic button should not transform on hover.
**Acceptance criteria**:
- [ ] Hero matches design layout at desktop (1240px container)
- [ ] Canvas paints neurons + signals + ember dust without console errors
- [ ] Decoder cycles through scramble for ~700ms then settles on "patrick.rizzardi"
- [ ] ET clock updates every second, format `HH:MM:SS ET` (24h, America/New_York timezone, label is `ET` not `EST` to remain correct across DST)
- [ ] No hydration mismatch warning in console (decoder Ref starts as final string, scramble runs onMounted only)
- [ ] Magnetic primary CTA translates toward cursor on mouseover
- [ ] Metrics fade in with 120ms stagger
- [ ] Prefers-reduced-motion stops the canvas animation loop
- [ ] `bun run build` succeeds (validates SSR safety)
**Quality gate**:
- [ ] All canvas/window references inside `onMounted` or guarded by `typeof window !== 'undefined'`
- [ ] No `any`, no `!`, no `key?: T`
- [ ] `prefers-reduced-motion` respected (rule from existing `useScrollReveal` pattern)
- [ ] Memory: `cancelAnimationFrame` + listener cleanup in `onUnmounted`
- [ ] Canvas DPR scaling correct (device pixel ratio capped at 2 per design)
**Verification**:
- `bun run build && bun run preview` — confirm SSG output renders hero correctly
- `bun run type-check` clean
- DevTools Performance: 60fps on canvas at desktop, no obvious memory leak over 60s
- DevTools rendering: enable "Emulate CSS prefers-reduced-motion: reduce" — animation halts

---

### Phase 4: Milestone 1 verification + demo
**PR scope**: No code changes. Verification sweep before requesting user review.
**Steps**:
1. Run `docker compose run --rm bun run lint` — must be clean (prettier + oxlint + cspell). Add new domain-specific words to cspell custom dictionary if flagged: `cheddar`, `oklch`, `Geist`, `Newsreader`, `JetBrains`, `saltatory`, `ranvier`, `myelin`, `refractory`, `Tessa`, `Yinzer`, `lede`, `Rizzardi`. Each word added once, deduped against existing dictionary.
2. Run `docker compose run --rm bun run type-check` — must be clean.
3. Run `docker compose run --rm bun run build` — must succeed end-to-end (vue-tsc + vite-ssg).
4. Run the SSR-safety grep from Phase 3 invariant: `grep -nE 'window\.|document\.|navigator\.|performance\.|requestAnimationFrame|setInterval|setTimeout|matchMedia' src/components/hero/NeuronCanvas.vue src/composables/useDecoder.ts src/composables/useMagneticButton.ts` — every hit must be inside `onMounted` / event handler / `onUnmounted` body. Report results in PR description.
5. Run `bun run preview` against the built `dist/` and Lighthouse the home page (Chrome DevTools → Lighthouse → mobile profile). **Assert**: a11y ≥ 95, perf no worse than -10pt vs current main baseline (record both numbers in PR description). If a11y < 95, identify failing audits — most likely color contrast on text-3 or missing alt text on logo.
6. Open `/blog` and `/blog/hello-world` — they will look mismatched (using new tokens but old layout). That's expected and stays that way until M3.
7. Visual smoke test desktop + mobile (Chrome DevTools mobile emulation at 375×667 iPhone SE viewport — the floor target).
8. Reduced-motion smoke: DevTools rendering pane → "Emulate CSS prefers-reduced-motion: reduce" → reload → confirm canvas paints exactly one frame and stops. Resize the window — the canvas should NOT restart the animation loop (resize handler must short-circuit when reduced-motion is set).
9. Commit and push the branch. Open PR. Report back to user.
**Acceptance criteria**:
- [ ] Lint clean
- [ ] Type-check clean
- [ ] Build clean (SSR works)
- [ ] SSR-safety grep clean (no module-scope window/document/etc references)
- [ ] Hero renders correctly desktop + mobile
- [ ] Other routes don't crash (visual mismatch is fine — M3 fixes them)
- [ ] Lighthouse a11y ≥ 95
- [ ] Reduced-motion: canvas single-frame, no loop, resize doesn't re-arm

---

## Anti-Pattern Callouts

- **Splitting into commits instead of PRs**: Each milestone = one PR against `cheddar-v1` or, if user prefers, separate sub-branches per milestone with PRs into `cheddar-v1` and a final merge to main. Default chosen: 4 PRs against the rebrand branch, last PR merges to main.
- **Shadow main branches**: Only `cheddar-v1` exists. No long-lived parallel branches.
- **Building the engine before shipping value**: M1 alone delivers a Cheddar hero — visible value even if M2/M3/M4 never landed. Each subsequent milestone independently increases coverage.
- **Hotfix that isn't**: This is feature work, not a fix. Branch prefix is `feat/`, not `fix/`. No urgency framing.
- **Abandoned branches**: Branch is short-lived (target: ~4 sessions). If M2 stalls, M1 can still merge to main alone — the hero rebrand is independently valuable. We don't ship "almost done" — each milestone has its own done bar.
- **Flag graveyards**: No feature flags introduced. Visual rebrand of a personal portfolio doesn't warrant flag overhead.

## Quality Checklist (verify at completion)

- [ ] All inputs validated — N/A (no user input in this rebrand)
- [ ] Auth/authz enforced — N/A (no endpoints)
- [ ] Error handling — N/A (no async data fetches)
- [ ] No SQL injection, XSS, path traversal — N/A. Sanity check: any `v-html` introduced uses static content only (e.g., highlighted code from Shiki at build time, not user input).
- [ ] Performance: canvas 60fps on desktop; mobile gracefully degrades; reduced-motion respected
- [ ] No console errors in dev or production build
- [ ] Lighthouse a11y ≥ 95 (color contrast on text-2 over bg verified)
- [ ] Existing tests still pass (no test suite currently — add note)
- [ ] Types complete (no `any`, no `!`, no `key?: T` on object types)
- [ ] Follows existing codebase conventions (Vue 3 Composition API, arrow functions, Tailwind utility classes preferred, kebab-case files, PascalCase components)
- [ ] No `// TODO` / `// FIXME` left in code
- [ ] All "Patrick Rizzardi"-only branding swept (M4)
- [ ] `bun run lint` + `bun run type-check` + `bun run build` all clean
