# Todos: redact-digital

## Current Goal
Site overhaul (design system + content/SEO/honesty) — **COMPLETE** (`.claude/plans/active/cheddar-site-overhaul.md`, status: done). Patrick merges `cheddar-v1` → `main` when ready.

## Cheddar Rebrand: M1 — COMPLETE (commit 1da501d)
- [x] Theme tokens, fonts, body grain/glows, scan-grid
- [x] Pill nav, CheddarWordmark, siteConfig.ts, useTheme deleted, footer tagline
- [x] NeuronCanvas, useDecoder, useMagneticButton, HeroSection rewrite (ET clock, decoder, GitHub chip, 4-dev-team metric)
- [x] lint/type-check/build clean

## Cheddar Rebrand: M2 — COMPLETE (commit 8ab2b9c)
- [x] PrinciplesSection — 6-cell bordered grid, burnt hover wash
- [x] SystemsSection — featured cards (code-peek + arch note) + secondary grid
- [x] LeadershipSection — timeline rail + stack table
- [x] WritingSection — live useBlogPosts() output
- [x] ContactSection — glow card with animated link rows
- [x] HomeView wired, old components deleted, lint/build clean

## Cheddar Rebrand: M3 — COMPLETE (commit 3596c69)
- [x] BlogView restyled (cheddar header, burnt active tag, cheddar card borders)
- [x] BlogPostCard restyled (burnt hover border, display title, no orphaned useSpotlight)
- [x] BlogPostHeader restyled (display h1, mono meta, cheddar chips)
- [x] BlogPostView prose modifiers fixed (removed conflicting font-size/font-family)
- [x] BlogPostNav restyled (cheddar card borders, burnt hover)
- [x] CodeSnippet double-background fixed; .shiki CSS normalizer added

## Cheddar Rebrand: M4 — COMPLETE (commit 9c551e9)
- [x] useSpotlight.ts deleted (orphaned)
- [x] useSeo: SITE_NAME/SITE_URL replaced with siteConfig, article.tags added to interface
- [x] BlogJsonLd: author/publisher via siteConfig
- [x] HomeView, BlogView, BlogPostView: URLs via siteConfig.siteUrl
- [x] lint/type-check/build clean

## REBRAND COMPLETE — cheddar-v1 is merge-ready

Patrick merges cheddar-v1 → main when ready.

## Post-Launch Polish

Done this session (post-rebrand, cheddar-v1):
- [x] Logo: black-box PNG in nav → clean SVG wedge-shield (CheddarWordmark + public/cheddar-mark.svg); old cheddar-emblem.png retained for OG card
- [x] VPM number corrected $68M → "$65.8M+ gross since 2021" (projects.ts) to match resume; $68M was a mixup
- [x] Resume wired: main resume → public/resume.pdf + contact link (was href="#"), download attr set
- [x] Nav route-aware — works from /blog (routes home + scrolls), links reordered to match page flow, <a role=button> → real <button>, hamburger aria-expanded — axe-verified
- [x] a11y contrast: --text-3 0.58→0.70, --text-4 0.42→0.65 (axe confirms AA pass on all chrome text); global :focus-visible ring added
- [x] Mobile menu: role=dialog + aria-modal + Esc-to-close + focus-on-open + <button> conversion
- [x] Blog tag filter reads ?tag= from URL + syncs to URL (BlogView); unknown tag → show all (verified)

Done in cheddar-site-overhaul Phase 4:
- [x] OG image (1200×630) → public/assets/og-default.png (serves 200; re-rendered with honest copy in the end-of-plan fix loop)
- [x] Code-block comment contrast — Shiki #6A737D → #9da5b4 (5.92:1, axe 0 violations)
- [x] Mobile menu full focus-trap — Reka UI Dialog (reka-ui ^2.9.9)
- [x] Contact/CTA heading → "Looking for a Principal Engineer?" (was "Hiring a founding CTO?")

## Audit backlog (2026-06-03 — full report `.analysis/AUDIT-SUMMARY.md`, 8 analyzers, security skipped)
**Confirmed bugs (fix before cheddar-v1 → main merge):**
- [ ] **P0** `WritingSection.vue:56-57` — `post.slug` → `post.frontmatter.slug` (home "recent posts" links currently render `/blog/undefined`; verified in `dist/`)
- [ ] **P1** `useBlogPosts.ts:39` — `estimateReadingTime(path)` measures the file path → every post "1 min" + bad JSON-LD wordCount; pass raw content via a `?raw` glob
- [ ] **Perf** move Shiki highlighting of `projects.ts` snippets to build-time (`CodeSnippet.vue`) — drops ~181 KB from every client (blog already does this)
- [ ] Consolidation (your ask): extract `.section-heading`/`.mono-label`/`.chip` CSS classes + `utils/date.ts` (~104 LOC); see AUDIT §A
- [ ] DECISION NEEDED: inline-`style` vs Tailwind standard (AUDIT §I) — sanction the exception in vue-standards.md or migrate
- [ ] Rest (NeuronCanvas pause + magic-number extraction, active-section nav, copy-email, dead-code sweep, README, etc.) — see AUDIT-SUMMARY §H ranked

Remaining (cross-workstream):
- [ ] Resume content polish (Patrick edits the PDF source): headline → "Principal Engineer & Architect"; fold one infra bullet from devops cut; reframe "don't need managing"; drop weak "66+ tests" — see .analysis/resume-review.md
- [ ] bugs.md: .gitignore it (personal scratch; currently fails cspell) or fix typos
- [ ] Rename GitHub repo from react-pat-rizzardi
- [ ] (Patrick's call — see plan Final Review Findings Log) leadership.ts "Engineering Lead / CTO-track" vs Principal-Engineer positioning; Tessa corpus 3.85B→12.4B; $65.8M hero metric slot
