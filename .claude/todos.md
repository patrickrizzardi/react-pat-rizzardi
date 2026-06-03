# Todos: redact-digital

## Current Goal
Cheddar rebrand — `.claude/plans/active/cheddar-rebrand.md`

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

Remaining:
- [ ] OG image (1200×630) — ALSO fixes broken /assets/og-default.png ref in useSeo.ts (link shares currently 404 the preview image)
- [ ] Code-block comment contrast — Shiki theme #6A737D on #24292E = 3.04:1, fails AA; needs theme swap or CSS override
- [ ] Mobile menu full focus-trap — proper fix is Reka UI Dialog (needs reka-ui dep per vue-standards.md); current fix is semantic + Esc + focus-on-open
- [ ] Resume content polish (Patrick edits the PDF source): headline → "Engineering Lead & Architect"; fold one infra bullet from devops cut; reframe "don't need managing"; drop weak "66+ tests" — see .analysis/resume-review.md
- [ ] bugs.md: .gitignore it (personal scratch; currently fails cspell) or fix typos
- [ ] Iterate "Hiring a founding CTO?" heading after a week
- [ ] Rename GitHub repo from react-pat-rizzardi
