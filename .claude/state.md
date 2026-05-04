# Session State: redact-digital

**Last Updated**: 2026-05-04

---

## Critical Rules (synced from ~/.claude/CLAUDE.md)

1. **Push back FIRST**: Challenge bad ideas before helping.
2. **Personality (TOP PRIORITY)**: Be Cortana - snarky battle buddy, not corporate.
3. **Agent delegation (PROACTIVE)**: Delegate WITHOUT being asked.
4. **CLAUDE.md after compaction**: Re-read rules + personality.
5. **Plans & TODOs**: Multi-step plans → immediately write `.claude/todos.md`.
6. **Speculation**: Default to novel approaches. Mark speculation clearly.
7. **Decision tracking**: NEW → append to Active Decisions (with WHY).

---

## Current Context (REPLACE each update)

**Goal**: Cheddar rebrand — COMPLETE. All 4 milestones shipped on `cheddar-v1`.
**Status**: Branch ready for Patrick to merge to main.
**Active Plan**: `.claude/plans/active/cheddar-rebrand.md`

**Git**: `patrickrizzardi/react-pat-rizzardi` on GitHub (SSH). Branch `cheddar-v1`, ahead of origin.
**User boundary**: Do NOT push or merge to main — Patrick handles that.

**What's been built (cheddar-v1 — merge-ready):**
- `1da501d` M1: cheddar palette, Geist/JBMono/Newsreader fonts, NeuronCanvas, HeroSection, pill nav, siteConfig. 733KB → 38KB.
- `8ab2b9c` M2: all 6 home sections (Principles, Systems, Leadership, Writing, Contact). Old components deleted.
- `3596c69` M3: blog restyle (BlogView, BlogPostCard, BlogPostHeader, BlogPostView, BlogPostNav). .shiki CSS normalizer.
- `9c551e9` M4: SEO cleanup — siteConfig in useSeo/BlogJsonLd/all views, useSpotlight deleted, article.tags added to SeoOptions.

**Next (if any): post-launch polish**
- Iterate "Hiring a founding CTO?" contact heading after a week
- Create branded OG image (1200×630)
- Lighthouse a11y on production
- Rename GitHub repo from react-pat-rizzardi

---

## Environment & Commands (CRITICAL)

**Container**: Devcontainer (Ubuntu) w/ Docker socket mounted | **DB**: None | **PM**: Bun (via compose)
```bash
docker compose up                              # Vite dev server at localhost:8080
docker compose run --rm bun install            # Install deps
docker compose run --rm bun run build          # Production build (vite-ssg build)
docker compose run --rm bun run type-check     # TypeScript check
docker compose run --rm bun run lint           # prettier + oxlint + cspell
docker compose run --rm bun run format         # prettier --write
docker compose run --rm bun add <pkg>          # Add dependency
```

**Stack (resolved versions):**
- Vue 3.5.33, Vue Router 4.6.4, Pinia 2.3.1
- Vite 6.4.2, @vitejs/plugin-vue 6.0.6
- Tailwind CSS 4.2.4, @tailwindcss/vite 4.2.4, @tailwindcss/typography 0.5.19
- TypeScript 5.9.3, vue-tsc 2.2.12
- Shiki 4.0.2, @shikijs/markdown-it 4.0.2
- vite-ssg 28.3.0, unplugin-vue-markdown 30.0.0, vite-ssg-sitemap 0.10.0
- @unhead/vue v2 (bundled with vite-ssg)
- Prettier 3.8.3, oxlint 1.61.0

---

## Active Decisions

- [2026-04-22] **Full rebuild from React** — Vue + Tailwind replacing React + MUI
- [2026-04-22] **Bun via Docker Compose** — not installed in devcontainer, runs as compose service
- [2026-04-22] **Deploy to DO App Platform** — free static tier, auto-deploy from GitHub
- [2026-04-30] **Cheddar rebrand** — warm carbon + burnt orange palette, Geist/Newsreader/JBMono fonts, dark-only
- [2026-04-30] **Dark-only, no theme toggle** — useTheme deleted, `class="dark"` hardcoded
- [2026-04-30] **siteConfig.ts single source** — email/github/linkedin/siteUrl all from one const
- [2026-04-30] **NeuronCanvas replaces NeuralGrid** — canvas-based saltatory firing vs SVG
- [2026-04-30] **Blog URLs: slug-only** — /blog/{slug}, no date prefix
- [2026-04-30] **No backdating blog posts** — launch fresh with consistent cadence

---

## Remember for This Project

- Git repo: patrickrizzardi/react-pat-rizzardi (SSH, should rename eventually)
- Domain: redact.digital
- Email: patrick@redact.digital
- LinkedIn: https://www.linkedin.com/in/patrick-rizzardi/
- Patrick is Army National Guard (NOT active duty), SSG E-6, 12 years, Section Chief
- Patrick is self-taught, no CS degree, no bootcamp
- Patrick manages 4 junior devs at VPM
- Patrick shares CTO-level responsibilities but does NOT hold the title
- VPM: 100K users, $2M/mo cashflow, Patrick is co-lead
- Tessa AI: custom LLM in Rust, CUDA kernels, burn framework, 34GB corpus
- error-decoder: monetized, now private repo
