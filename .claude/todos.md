# Todos: redact-digital

## Current Goal
Rebuild portfolio site — Vue 3 + Tailwind CSS v4 + TypeScript + Bun

## Plan
`.claude/plans/portfolio-rebuild-plan.md` — approved 2026-04-22
`.claude/plans/blog-milestone-2-plan.md` — approved 2026-04-23

## Milestone 1: Core Portfolio — COMPLETE

## Milestone 2: Blog — IN PROGRESS

### Phase 1: SSG Foundation + Markdown Pipeline — COMPLETE
- [x] vite-ssg, unplugin-vue-markdown, @shikijs/markdown-it, @tailwindcss/typography installed
- [x] main.ts rewritten to ViteSSG pattern
- [x] Markdown + Shiki configured in vite.config.ts
- [x] Typography plugin, .md type declaration, robots.txt added
- [x] Build produces pre-rendered HTML, dev server works

### Phase 2: Blog Content & Index Page — COMPLETE
- [x] BlogFrontmatter types, test post, useBlogPosts composable
- [x] BlogPostCard component, BlogView with tag filtering
- [x] /blog/:slug route added

### Phase 3: Blog Post Page — COMPLETE
- [x] BlogPostView with header, prev/next nav
- [x] Prose styling for dark mode (typography customization)
- [x] ssgOptions.includedRoutes for blog slug enumeration

### Phase 4: SEO & Social Sharing — COMPLETE
- [x] useSeo composable wrapping useSeoMeta
- [x] SEO meta on HomeView, BlogView, BlogPostView
- [x] BlogJsonLd component (structured data)
- [x] vite-ssg-sitemap configured, :slug excluded
- [ ] Create branded OG image (1200x630) — deferred, using placeholder path

### Phase 5: Verification Sweep — NEXT
- [ ] TODO sweep (grep for TODO, FIXME, HACK, etc.)
- [ ] Todos cross-check (verify all M2 items actually complete)
- [ ] Shortcut detection (no placeholders, no stubs)
- [ ] Full build verification + type check + lint
- [ ] Visual verification (all pages, dark mode, mobile)
- [ ] Pre-rendered HTML verification (meta tags, JSON-LD, content)

## Post-Launch Polish
- [ ] Create branded OG image (1200x630) for social sharing
- [ ] Clean up Docker server repos (READMEs, architecture diagrams)
- [ ] Add architecture diagrams to featured project repos
- [ ] Rename GitHub repo from react-pat-rizzardi to something better
