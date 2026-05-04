# Session State: redact-digital

**Last Updated**: 2026-04-23

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

**Goal**: Rebuild portfolio site — Vue 3 + Tailwind CSS v4 + TypeScript + Bun
**Status**: Milestone 2 (Blog) — Phases 1-4 COMPLETE. Phase 4 awaiting commit. Phase 5 (verification sweep) is next.

**Git**: `patrickrizzardi/react-pat-rizzardi` on GitHub (SSH). Multiple commits ahead of origin.
**Playwright MCP**: working via `http://172.17.0.1:8080` (gateway IP, not localhost)

**Milestone 2 Blog — What's Built:**
- Phase 1: vite-ssg 28.3.0, unplugin-vue-markdown 30.0.0, @shikijs/markdown-it, @tailwindcss/typography
- Phase 2: Blog index page with tag filtering, BlogPostCard, useBlogPosts composable, test post
- Phase 3: BlogPostView with header (title/date/author/tags), prev/next nav, prose styling, SSG route enumeration
- Phase 4: useSeo composable, OG tags, Twitter cards, JSON-LD BlogPosting, vite-ssg-sitemap

**Key technical findings during implementation:**
- unplugin-vue-markdown exports frontmatter as individual named exports (mod.title, mod.tags), NOT as mod.frontmatter object
- `includedRoutes` goes in vite.config.ts ssgOptions, not in ViteSSG() 4th arg
- `articleAuthor` in @unhead/vue expects string[], not string
- useTheme needed isClient guard for SSG compatibility (localStorage/window)
- `exactOptionalPropertyTypes` requires conditional spread for optional fields

**Phase 5 (next): Verification Sweep**
- TODO sweep, todos cross-check, shortcut detection
- Build + type check + lint
- Visual verification + pre-rendered HTML check

**Plan**: `.claude/plans/blog-milestone-2-plan.md` — approved 2026-04-23
**Blog skill**: `.claude/commands/blog.md`

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
- [2026-04-23] **Title: "Engineering Lead & Architect"** — signals leadership + technical depth
- [2026-04-23] **vite-ssg for pre-rendering** — replaces standard vite build
- [2026-04-23] **Blog URLs: slug-only** — /blog/{slug}, no date prefix
- [2026-04-23] **Tag filtering: in-place** — no separate tag pages
- [2026-04-23] **Shiki languages: full stack** — TS, SQL, Rust, Python, Bash, Vue, JSON, YAML, TOML, CSS, HTML, C++
- [2026-04-23] **No backdating blog posts** — launch fresh with consistent cadence
- [2026-04-23] **OG image deferred** — path set to /assets/og-default.png, actual image TBD

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
