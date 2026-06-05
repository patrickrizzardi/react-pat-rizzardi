# redact.digital

Patrick Rizzardi's personal-brand portfolio and blog. Live at [redact.digital](https://redact.digital).

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3.5 + Vue Router 4 + Pinia |
| Build | Vite 6 + vite-ssg (static site generation) |
| Styles | Tailwind CSS 4, dark-only |
| Types | TypeScript 5.8 + vue-tsc |
| Blog | unplugin-vue-markdown + Shiki (code highlighting) |
| UI primitives | reka-ui (dialogs, accessible interactives) |
| Icons | lucide-vue-next |
| Runtime | Bun 1.3.13 (via Docker Compose — not installed locally) |

---

## Dev Workflow

Bun runs exclusively inside Docker Compose. There is no local Bun installation required.

**Start the dev server:**
```bash
docker compose up
```
Dev server available at **http://localhost:8082** (Compose maps host `8082` → Vite's `5173`).

**Install dependencies:**
```bash
docker compose run --rm bun install
```

**Production build** (`vue-tsc --noEmit` + `vite-ssg build` → static `dist/`):
```bash
docker compose run --rm bun run build
```

**Type-check only:**
```bash
docker compose run --rm bun run type-check
```

**Lint** (prettier check + oxlint + cspell):
```bash
docker compose run --rm bun run lint
```

**Format** (prettier write):
```bash
docker compose run --rm bun run format
```

**Add a dependency:**
```bash
docker compose run --rm bun add <package>
```

### `HOST_PROJECT_PATH`

`docker-compose.yml` mounts `${HOST_PROJECT_PATH:-.}` into the container at `/app`. The default (`.`) works when running from the repo root. Set `HOST_PROJECT_PATH` to an absolute path if your Docker daemon can't resolve relative mounts (e.g., inside a devcontainer with a mounted socket).

---

## Project Structure

```
src/
  assets/
    main.css              # Theme tokens (--nav-h, oklch palette, WCAG contrast annotations)
  components/
    hero/                 # NeuronCanvas (animated bg), HeroSection
    layout/               # AppNav, AppFooter, MobileMenu, CheddarWordmark
    ui/                   # AppButton (shared button/link/chip primitive)
    blog/                 # BlogPostCard, BlogPostHeader, BlogPostNav, BlogJsonLd
    projects/             # CodeSnippet
    principles/           # PrinciplesSection
    leadership/           # LeadershipSection
    systems/              # SystemsSection
    writing/              # WritingSection
    contact/              # ContactSection
  composables/
    useBlogPosts.ts       # Markdown post discovery + frontmatter parsing
    useSeo.ts             # Per-route <head> management (title, OG, canonical)
    useScrollReveal.ts    # IntersectionObserver-based reveal
    useActiveSection.ts   # Scroll-tracked active nav section
    useDecoder.ts         # Scramble-text animation
  content/
    blog/                 # *.md — Markdown posts (Shiki-highlighted fenced code blocks)
  data/
    siteConfig.ts         # Single source: email, GitHub, LinkedIn, siteUrl
    projects.ts           # Project cards with typed metadata
    principles.ts         # Engineering principles list
    leadership.ts         # Leadership timeline
    metrics.ts            # Hero metrics (verified figures — see state.md for provenance)
  router/
    index.ts              # Routes: /, /blog, /blog/:slug
  types/
    blog.ts               # BlogPost, BlogFrontmatter types
    project.ts            # Project type
  views/
    HomeView.vue          # Single-page sections (hero → principles → systems → writing → contact)
    BlogView.vue          # Post listing
    BlogPostView.vue      # Individual post renderer
```

---

## Deploy

DigitalOcean App Platform (static tier). Auto-deploys from the `main` branch on GitHub push. No server — `vite-ssg build` pre-renders all routes to `dist/` at build time.

---

## Standards

Vue 3 / Tailwind / TypeScript conventions: `.claude/rules/vue-standards.md`.
