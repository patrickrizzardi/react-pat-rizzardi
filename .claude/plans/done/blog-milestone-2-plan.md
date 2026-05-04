# Plan: Milestone 2 — Blog

Created: 2026-04-23
Status: approved

---

## Context & Why

**Goal**: Add a blog to Patrick's portfolio site that positions him as an engineering leader and ranks in search.

**Why**: The portfolio site (Milestone 1) showcases projects but doesn't demonstrate thought leadership. A blog with engineering leadership, AI/ML, and architecture content signals CTO-level thinking to recruiters and hiring managers. SEO-optimized posts will drive organic traffic and establish domain authority for redact.digital.

**Background**: The site is a Vue 3 SPA deployed to DigitalOcean App Platform as a static site. A BlogView stub exists at `/blog` with placeholder text. The current SPA has no pre-rendering, no meta tag management, no sitemap, and no robots.txt — all critical gaps for blog SEO. Social crawlers (LinkedIn, Twitter, Slack) cannot execute JavaScript, so shared links currently show blank previews.

**Constraints**:
- Must stay static — no SSR server, no database, no CMS
- Must work with existing DO App Platform deployment (static file hosting)
- Must pre-render for SEO (social crawlers can't execute JS)
- Blog posts are markdown files committed to the repo
- Must integrate with existing Shiki setup for code blocks
- Existing site functionality must not regress

**Success criteria**:
- Blog index page lists posts with cards, tags, reading time
- Individual post pages render markdown with proper typography and code highlighting
- All pages have proper meta/OG tags (social sharing shows correct previews)
- Sitemap.xml auto-generated at build time
- JSON-LD structured data on blog posts
- Existing site pages (home, nav, footer) work identically
- Build succeeds and deploys to DO without changes to CI

---

## Research Findings

**Stack (confirmed compatible with Vite 6 + Vue 3.5):**

| Library | Version | Purpose |
|---------|---------|---------|
| vite-ssg | 28.3.0 | Pre-renders Vue app to static HTML at build time |
| @unhead/vue | v2 (bundled with vite-ssg) | Per-page meta tags, OG tags, useSeoMeta() |
| unplugin-vue-markdown | 30.0.0 | Use .md files as Vue components with frontmatter |
| @shikijs/markdown-it | 4.0.2 | Shiki code highlighting in markdown (pairs with existing shiki@4.0.2) |
| @tailwindcss/typography | latest | `prose` class for rendered markdown content |
| vite-ssg-sitemap | 0.10.0 | Auto-generates sitemap.xml from SSG routes |
| gray-matter | 4.0.3 | Frontmatter parsing in build scripts (if needed beyond unplugin) |

**Key architectural decisions from research:**
- vite-ssg replaces `createApp().mount()` with `ViteSSG()` export — entry point change is the riskiest part
- @unhead/vue v2 vs v3: vite-ssg bundles v2, so we use v2. No separate install needed.
- unplugin-vue-markdown handles frontmatter extraction — no separate gray-matter needed for runtime
- `import.meta.glob` discovers blog posts at build time for both index page and SSG route generation
- Blog code highlighting is separate from existing CodeSnippet.vue — markdown uses @shikijs/markdown-it, project cards keep their own Shiki setup

**What NOT to build (scope control):**
- No CMS — posts are .md files in the repo
- No comments system
- No search (maybe later)
- No RSS feed (maybe later)
- No pagination on index (won't have enough posts to need it initially)

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| vite-ssg conversion breaks existing site | Medium | High — site goes down | Phase 1 is ONLY the SSG conversion + verify. No other changes mixed in. |
| @unhead/vue v2 bundled by vite-ssg conflicts with latest v3 | Low | Medium — build errors | Don't install @unhead/vue separately. Use what vite-ssg provides. |
| SSG build fails on dynamic routes | Medium | Medium — blog posts 404 | Use `includedRoutes` to explicitly enumerate blog slugs from filesystem scan |
| DO App Platform doesn't serve pre-rendered HTML correctly | Low | High — SEO doesn't work | Test with `vite preview` locally first. DO serves static files natively — should work. |
| Tailwind v4 typography plugin incompatibility | Low | Low — styling issue | Fallback: custom prose CSS in main.css |
| Shiki async highlighting in markdown-it | Medium | Low — code blocks unstyled | Use @shikijs/markdown-it/async with markdown-it-async as documented |
| Build time increases significantly with SSG | Low | Low — dev experience | Portfolio has <10 routes. SSG adds seconds, not minutes. |

---

## Questions — RESOLVED

1. **OG image**: ✅ Yes — create a branded default OG image (1200x630px) in Phase 4
2. **Blog post URL structure**: ✅ Slug-only (`/blog/{slug}`, no date prefix)
3. **Tag pages**: ✅ In-place filtering on index page (no separate tag routes)
4. **Shiki languages**: ✅ Add everything in Patrick's stack — TypeScript, SQL, Rust (already have), plus: Python, Bash, Vue, JSON, YAML, TOML, CSS, HTML, C++ (for CUDA snippets). Lazy-load all languages.

---

## Risk Assessment & Rollout Strategy

**Risk level: LOW**

| Criteria | Applies? | Notes |
|---|---|---|
| Touches payments/billing | No | |
| Touches auth/permissions | No | |
| Raw SQL / literals | No | |
| Modifies existing data | No | |
| Third-party integration | No | |
| Changes existing endpoints | No | New pages only |
| Changes existing setup | Yes | main.ts entry point changes for vite-ssg |

**Mitigations applied:**
- Phase 1 isolates the SSG conversion and verifies existing site works before adding blog content
- Feature flag: N/A — personal site, no other users. Ship directly to main.

**Rollout plan:**
1. Each phase merged to main after verification
2. DO auto-deploys from main — each merge is a deploy
3. No staged rollout needed (personal site)

---

## Anti-Pattern Check

- **Splitting into commits instead of PRs** → ✅ Avoided: 5 phases = 5 PRs. Each phase is independently mergeable.
- **Shadow main branches** → ✅ Avoided: Every branch targets main. No long-lived feature branch.
- **Building the engine before shipping value** → ✅ Avoided: Phase 1 ships SSG (improves existing site SEO). Phase 2 ships a visible blog index. No "build all infrastructure first" pattern.
- **Hotfix that isn't** → ✅ N/A: No hotfixes in this plan.
- **Abandoned branches** → ✅ Avoided: Each phase is 1-2 days max. Short-lived by design.
- **Flag graveyards** → ✅ N/A: No feature flags used (personal site, no users to gate).

---

## Phases

### Phase 1: SSG Foundation + Markdown Pipeline
**PR scope**: Convert app to static site generation, add markdown processing capability
**Branch**: `feature/blog-ssg-foundation`
**Flag**: N/A
**Est. lines**: ~150
**Objective**: Replace the standard Vue `createApp` with vite-ssg's `ViteSSG` so the entire site pre-renders to static HTML. Wire up the markdown plugin so .md files can be used as Vue components. This is the foundation everything else builds on.
**Why this phase exists**: Without SSG, the blog won't rank in search and social sharing will show blank previews. This must land first and be verified before adding blog content.

**Files**:
- `package.json` — add deps
- `src/main.ts` — rewrite entry point to ViteSSG pattern
- `vite.config.ts` — add unplugin-vue-markdown + @shikijs/markdown-it config
- `src/assets/main.css` — add @tailwindcss/typography plugin
- `public/robots.txt` — create
- `env.d.ts` — add .md module declaration
- `tsconfig.app.json` — may need adjustment for vite-ssg

**Steps**:
1. Install dependencies: `vite-ssg`, `unplugin-vue-markdown`, `@shikijs/markdown-it`, `@tailwindcss/typography`, `vite-ssg-sitemap`
2. Rewrite `src/main.ts`: replace `createApp(App).use(pinia).use(router).mount('#app')` with `ViteSSG(App, { routes }, ({ app }) => { app.use(pinia) })` export pattern
3. Update `vite.config.ts`: add `Markdown()` plugin, update `Vue({ include: [/\.vue$/, /\.md$/] })`, configure @shikijs/markdown-it for code highlighting in markdown
4. Add `@plugin '@tailwindcss/typography'` to `src/assets/main.css`
5. Add `.md` module type declaration to `env.d.ts`
6. Create `public/robots.txt` with `User-agent: *`, `Allow: /`, `Sitemap: https://redact.digital/sitemap.xml`
7. Run build (`docker compose run --rm bun run build`) — verify it produces pre-rendered HTML in `dist/`
8. Run dev server (`docker compose up`) — verify existing home page and nav still work identically

**Quality gate**:
- [ ] `docker compose run --rm bun run build` succeeds
- [ ] `dist/index.html` contains pre-rendered HTML content (not empty `<div id="app">`)
- [ ] `dist/blog/index.html` exists (pre-rendered blog stub)
- [ ] Dev server works — home page renders correctly
- [ ] No TypeScript errors (`docker compose run --rm bun run type-check`)
- [ ] robots.txt accessible at `/robots.txt`

**Verification**: Build the site, open `dist/index.html` in a text editor and confirm it contains actual rendered content (hero text, project names, etc.) not just an empty shell. Run dev server and visually verify home page.

---

### Phase 2: Blog Content Structure & Index Page
**PR scope**: Create blog content directory, post types, data composable, and the blog index page
**Branch**: `feature/blog-content-index`
**Flag**: N/A
**Est. lines**: ~350
**Objective**: Build the blog index page that displays post cards with title, date, description, reading time, and tags. Create the content directory structure and a first test post. Wire up `import.meta.glob` to discover posts at build time.
**Why this phase exists**: Phase 1 gave us the SSG + markdown capability. This phase makes the blog visible — users can navigate to /blog and see posts listed.

**Files**:
- `src/content/blog/hello-world.md` — test post (will be replaced with real content later)
- `src/types/blog.ts` — BlogPost interface, BlogFrontmatter type
- `src/composables/useBlogPosts.ts` — blog post discovery and data composable
- `src/views/BlogView.vue` — rewrite from stub to full index page
- `src/components/blog/BlogPostCard.vue` — post card for index page
- `src/router/index.ts` — add blog post dynamic route

**Steps**:
1. Create `src/types/blog.ts` with `BlogFrontmatter` type: title (string), date (string), description (string), tags (string[]), slug (string), author (string, default "Patrick Rizzardi"), draft (boolean, optional — drafts excluded from build)
2. Create `src/content/blog/hello-world.md` with valid frontmatter and 200+ words of test content including a code block (to verify Shiki works in markdown)
3. Create `src/composables/useBlogPosts.ts`:
   - Use `import.meta.glob('../../content/blog/*.md', { eager: true })` to discover all posts
   - Extract frontmatter from each module
   - Sort by date descending
   - Filter out drafts
   - Calculate reading time (~200 words/min)
   - Return typed array of posts with metadata
4. Create `src/components/blog/BlogPostCard.vue`: card component showing title, date, description, reading time, tags (reuse existing card styles — spotlight effect optional)
5. Rewrite `src/views/BlogView.vue`: header section ("Blog" title + subtitle), grid of BlogPostCard components, tag filter chips (click to filter in-place), empty state if no posts
6. Update `src/router/index.ts`: add `/blog/:slug` route (lazy-loaded, component TBD in Phase 3)
7. Update nav — ensure "Blog" link in AppNav shows as active when on /blog routes

**Quality gate**:
- [ ] `/blog` page renders with at least one post card
- [ ] Post card shows: title, date, description, reading time, tags
- [ ] Tags filter posts when clicked
- [ ] Blog page matches site's dark theme and design language
- [ ] Mobile responsive (1-column on mobile, 2-column on md+)
- [ ] No TypeScript errors
- [ ] Build succeeds and blog index is pre-rendered

**Verification**: Navigate to /blog in dev server. Verify test post card appears with all metadata. Click tag chips to verify filtering. Check mobile layout. Build and verify `dist/blog/index.html` contains pre-rendered post list.

---

### Phase 3: Blog Post Page
**PR scope**: Individual blog post page with rendered markdown, typography, navigation
**Branch**: `feature/blog-post-page`
**Flag**: N/A
**Est. lines**: ~250
**Objective**: Create the individual blog post reading experience — rendered markdown with proper typography, code highlighting, post header with metadata, and navigation between posts.
**Why this phase exists**: Phase 2 built the index. Users can see posts listed but can't read them yet. This phase completes the core blog reading experience.

**Files**:
- `src/views/BlogPostView.vue` — individual post page
- `src/components/blog/BlogPostHeader.vue` — post title, date, author, reading time, tags
- `src/components/blog/BlogPostNav.vue` — previous/next post links
- `src/router/index.ts` — wire up BlogPostView to /blog/:slug route
- `src/main.ts` — add `includedRoutes` to vite-ssg config to enumerate blog slugs for pre-rendering

**Steps**:
1. Create `src/views/BlogPostView.vue`:
   - Accept slug from route params
   - Resolve the matching .md component from `import.meta.glob`
   - Render the markdown component inside a `prose` container (Tailwind typography)
   - Include BlogPostHeader above content
   - Include BlogPostNav below content
   - Handle 404 — redirect to /blog if slug not found
2. Create `src/components/blog/BlogPostHeader.vue`: displays title, formatted date, author name, reading time badge, tag chips (linking back to /blog?tag=X)
3. Create `src/components/blog/BlogPostNav.vue`: previous/next post links based on date ordering, styled as subtle nav at bottom of post
4. Update `src/router/index.ts`: wire `/blog/:slug` to BlogPostView (lazy-loaded)
5. Update `src/main.ts` vite-ssg config: add `includedRoutes` function that scans `src/content/blog/*.md` files and adds `/blog/{slug}` for each, so SSG pre-renders every post
6. Style the prose content area: customize Tailwind typography colors for dark mode (prose-invert), ensure code blocks use the navy/cyan color scheme, ensure links are cyan-400

**Quality gate**:
- [ ] Clicking a post card on /blog navigates to /blog/{slug}
- [ ] Post page renders full markdown content with proper typography
- [ ] Code blocks have Shiki syntax highlighting (test with the test post's code block)
- [ ] Headings, lists, blockquotes, inline code all render correctly
- [ ] Dark mode typography looks good (not washed out white on dark background)
- [ ] Previous/next navigation works and loops correctly
- [ ] Back-to-blog link works
- [ ] 404 slug redirects to /blog
- [ ] Build succeeds — `dist/blog/hello-world/index.html` exists with pre-rendered content
- [ ] No TypeScript errors

**Verification**: Navigate to /blog, click the test post, read through it. Verify code blocks are highlighted. Check prev/next links. Try a bogus slug (/blog/nonexistent). Build and verify pre-rendered post HTML exists in dist/.

---

### Phase 4: SEO & Social Sharing
**PR scope**: Meta tags, structured data, OG tags, sitemap, canonical URLs
**Branch**: `feature/blog-seo`
**Flag**: N/A
**Est. lines**: ~200
**Objective**: Make the blog discoverable by search engines and shareable on social platforms. Every page gets proper meta tags, blog posts get JSON-LD structured data, and a sitemap is auto-generated.
**Why this phase exists**: Phases 1-3 built a functional blog. This phase makes it findable. Without this, search engines underindex the content and social shares show generic/blank previews.

**Files**:
- `src/composables/useSeo.ts` — reusable SEO composable wrapping useSeoMeta
- `src/views/HomeView.vue` — add useSeoMeta call
- `src/views/BlogView.vue` — add useSeoMeta call
- `src/views/BlogPostView.vue` — add useSeoMeta + JSON-LD structured data
- `src/components/blog/BlogJsonLd.vue` — JSON-LD script injection component
- `vite.config.ts` — add vite-ssg-sitemap plugin
- `public/robots.txt` — verify sitemap URL

**Steps**:
1. Create `src/composables/useSeo.ts`: a thin wrapper around `useSeoMeta` from `@unhead/vue` that sets common defaults (site name: "Patrick Rizzardi", default OG image, twitter card type) and accepts per-page overrides
2. Add `useSeo()` call to `HomeView.vue`: title "Patrick Rizzardi — Engineering Lead & Architect", description from hero subtitle, OG type "website"
3. Add `useSeo()` call to `BlogView.vue`: title "Blog — Patrick Rizzardi", description "Engineering leadership, AI/ML, and architecture insights", OG type "website"
4. Add `useSeo()` call to `BlogPostView.vue`: title from frontmatter, description from frontmatter, OG type "article", article:author, article:published_time, article:tag
5. Create `src/components/blog/BlogJsonLd.vue`: injects `<script type="application/ld+json">` with BlogPosting schema — @type, headline, description, datePublished, dateModified, author (@type Person, name, url), publisher, url, keywords
6. Add BlogJsonLd to BlogPostView.vue for each blog post
7. Configure vite-ssg-sitemap in `vite.config.ts`: hostname "https://redact.digital", auto-discovers routes from SSG
8. Verify robots.txt has correct sitemap URL

**Quality gate**:
- [ ] View page source on home page — `<title>` and `<meta name="description">` present in HTML
- [ ] View page source on blog post — OG tags present (`og:title`, `og:description`, `og:image`, `og:type="article"`)
- [ ] View page source on blog post — JSON-LD `<script>` block present with BlogPosting schema
- [ ] `dist/sitemap.xml` exists after build and lists all pages including blog posts
- [ ] `dist/robots.txt` exists and points to correct sitemap URL
- [ ] Each page has a `<link rel="canonical">` tag
- [ ] No TypeScript errors, build succeeds

**Verification**: Build the site. Open `dist/blog/hello-world/index.html` in a text editor — verify meta tags, OG tags, and JSON-LD are in the HTML. Open `dist/sitemap.xml` and verify all routes are listed. Test social sharing preview using a validator (LinkedIn Post Inspector or Twitter Card Validator) if accessible.

---

### Phase 5: Verification Sweep
**PR scope**: Final verification, cleanup, build check
**Branch**: `chore/blog-verification`
**Flag**: N/A
**Est. lines**: ~0 (fixes only)
**Objective**: Verify the entire blog implementation works end-to-end. Catch any TODO comments, stubs, or shortcuts that slipped through.
**Why this phase exists**: Required final phase per plan standards. Catches the "it works in dev but breaks in prod" and "I left a placeholder that I forgot about" problems.

**Steps**:
1. **TODO sweep**: Grep for `TODO`, `FIXME`, `HACK`, `XXX`, `TEMP`, `PLACEHOLDER`, and any comments referencing "Phase", "will be", "later", "eventually" — move to todos.md or fix in-place
2. **Todos cross-check**: Verify all Milestone 2 items in todos.md are actually complete — read the code, don't trust checkboxes
3. **Shortcut detection**: Look for hardcoded values, mock data, placeholder text, partial implementations
4. **Full build verification**: `docker compose run --rm bun run build` — verify clean build, check dist/ output
5. **Type check**: `docker compose run --rm bun run type-check` — zero errors
6. **Lint**: `docker compose run --rm bun run lint` — clean
7. **Visual verification**: Run dev server, navigate every page (home, blog index, blog post), check dark mode, check mobile layout
8. **Pre-rendered HTML check**: Verify dist/ contains proper HTML for: index.html, blog/index.html, blog/hello-world/index.html — all should have full content, meta tags, and structured data

**Quality gate**:
- [ ] Zero TODO/FIXME/HACK comments in blog-related code
- [ ] All todos.md items for Milestone 2 verified complete
- [ ] Build succeeds with zero warnings
- [ ] Type check passes
- [ ] Lint passes
- [ ] All pre-rendered pages contain full content
- [ ] Visual spot-check passes (home, blog index, blog post — desktop + mobile)

**Verification**: This IS the verification phase. All checks above must pass before marking Milestone 2 complete.

---

## Quality Checklist (verify at completion)

- [ ] All inputs validated (frontmatter types, slug params)
- [ ] No security issues (v-html only on trusted markdown, no user input rendered raw)
- [ ] Error handling: 404 slugs redirect gracefully, missing frontmatter fields have defaults
- [ ] Performance: blog post components lazy-loaded, Shiki languages loaded on demand
- [ ] Types are complete (no `any`, no non-null assertions)
- [ ] Follows existing codebase conventions (composable patterns, component structure, Tailwind-only styling)
- [ ] All existing pages work identically (no regressions from SSG conversion)
- [ ] Pre-rendered HTML contains full content for all pages
- [ ] Social sharing previews work (OG tags in HTML)
- [ ] Sitemap auto-generated with all routes
