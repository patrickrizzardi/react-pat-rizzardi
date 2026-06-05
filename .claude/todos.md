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

## Audit (2026-06-03/05 — full report `.analysis/AUDIT-SUMMARY.md`, 8 analyzers, security skipped) — COMPLETE
Shipped on `cheddar-v1`, all build-green + reviewer-gated + browser-verified (11 commits, f4d72ad→553f1ea):
- [x] **P0** broken home "recent posts" links (/blog/undefined) + **P1** reading time always "1 min" — `f4d72ad`
- [x] Dead code: extensionUrl, expandedCard, app-btn classes, orphaned cheddar-emblem.png — `7ec7334`
- [x] NeuronCanvas perf: off-screen/hidden pause + O(n) spatial-grid + fanOut cleanup + CANVAS constants — `ce0cc67`
- [x] a11y/ux: reduced-motion guard, responsive principles grid, doc-relative scroll, CTA, footer/canvas a11y — `2fd4323`
- [x] availability badge (clock removed), copy-email, aria-pressed — `76f062f`
- [x] active-section nav, interactive blog tags, snippet tabs, share, mobile resume, empty-state — `c910828`
- [x] **Shiki → build-time** (−401 KB client JS; was ~181 KB est) — `616b696`
- [x] README + naming/magic-number cleanup — `635320a`
- [x] content: leadership "CTO-track" → Principal-Engineer; dropped placeholder `since` — `12f911e`
- [x] **Tailwind migration**: clean `@theme` token system (phase A `06d94bb`) + inline `style=`→utilities across 14 components (phase B `553f1ea`); pixel-verified zero visual change
- [x] Content decisions: Tessa corpus kept 3.85B (English-Base); $65.8M hero metric kept; CTO-track aligned

**Remaining DRY follow-ups (redundancy §A — NOT done; the Tailwind migration consolidated tokens, not these repeated patterns):**
- [ ] `src/utils/date.ts` — extract the byte-identical `formattedDate` computed (BlogPostCard + BlogPostHeader) + WritingSection short form (~14 LOC)
- [ ] `<SectionHeading>` component — the 6 section `<h2>` now share an identical `font-display ... text-[clamp(32px,4vw,56px)] ...` utility string; extract to one component
- [ ] `<Chip>` / `.mono-label` shared component — repeated tag-chip + mono-label utility strings across systems/leadership/blog
- [ ] `useHover` composable — BlogPostCard/BlogPostNav/ContactSection each reinvent a hover ref + mouseenter/leave

Remaining (cross-workstream):
- [ ] Resume content polish (Patrick edits the PDF source): headline → "Principal Engineer & Architect"; see .analysis/resume-review.md
- [ ] bugs.md: .gitignore it (personal scratch; currently fails cspell) or fix typos
- [ ] Rename GitHub repo from react-pat-rizzardi
