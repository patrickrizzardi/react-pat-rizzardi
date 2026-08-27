lik# Plan: Portfolio Rebuild

Created: 2026-04-22
Status: approved (2026-04-22)

---

## Context & Why

**Goal**: Rebuild Patrick's portfolio site from a dead Vue demo into a production-quality showcase for backend engineering work.

**Why**: The current repo (`@redactdigital/vuei`) is a dead boilerplate with no content. The actual portfolio lives in a React + MUI repo on GitHub (`react-pat-rizzardi`) but uses outdated tech and doesn't properly showcase backend depth — CUDA kernels, microservice architecture, production-scale Postgres, custom LLM training. A recruiter or hiring manager should land on this site and immediately understand Patrick builds serious systems, not just React apps.

**Background**: All research is complete. 6 projects scanned, ranked, and locked with presentation strategies:

| # | Project | Presentation |
|---|---------|-------------|
| 1 | Tessa AI | Code snippets (CUDA, Rust transformer, tokenizer) + arch notes. Private. |
| 2 | trading-v3 | Code snippets (pub/sub, strategy, partitioning) + arch notes. Private. |
| 3 | VPM Solutions | Work experience format. Live: app.vpmsolutions.com. Screenshots OK. No source. |
| 4 | error-decoder-extension | Full card + public repo + live site (errordecoder.dev) + extension link. |
| 5 | YinzerFlow | Full card + public repo + npm link. |
| 6 | wow-inventory-management | Smaller card, shows range (Lua/event-driven). |

**Constraints**:
- **Stack**: Vue 3.5 + Vite 8 + Tailwind CSS v4 + TypeScript 6 + Pinia + Vue Router
- **Runtime**: Bun via Docker Compose service (`docker compose run --rm bun <cmd>`). Not installed in devcontainer.
- **Deploy**: Static build → DigitalOcean App Platform (free static site tier). Auto-deploy from GitHub, or GitHub Actions + Bun if App Platform doesn't support Bun natively.
- **Design**: Dark-first. Navy `#0F172A` + cyan `#22D3EE`. Mobile-responsive.
- **Privacy**: Private repos shown via curated code snippets + architecture notes only. No full source exposure.

**Success criteria**:
- Live portfolio showing all 6 projects with tier-appropriate presentation
- `docker compose run --rm --service-ports bun run dev` works locally
- `docker compose run --rm bun run build` produces deployable static files
- Lighthouse performance 90+, accessibility 90+
- Type-checks clean, lint clean, no `any` types

---

## Research Findings

### Tailwind CSS v4 (verified against tailwindcss.com)
- **CSS-first config** — no `tailwind.config.js`. Theme via `@theme` directive in CSS.
- **Install**: `bun add tailwindcss @tailwindcss/vite` (two packages, no PostCSS needed)
- **Vite plugin**: `@tailwindcss/vite` replaces PostCSS pipeline
- **CSS entry**: `@import "tailwindcss"` replaces `@tailwind base/components/utilities`
- **Custom colors**: `@theme { --color-navy: #0F172A; --color-cyan: #22D3EE; }` → generates `bg-navy`, `text-cyan`, etc.
- **Dark mode**: Media-query by default. Class-based via `@custom-variant dark (&:where(.dark, .dark *));`
- **Auto-detection**: No `content` array — v4 auto-scans, respects `.gitignore`

### Vite 8 (verified via vite.dev/blog)
- Current stable: 8.0.9 (March 2026)
- Rolldown replaces Rollup + esbuild (Rust-based bundler)
- Lightning CSS for minification
- Browser targets: Chrome 111+, Firefox 114+, Safari 16.4+
- Vue plugin: `@vitejs/plugin-vue@^6.0.6`

### TypeScript 6 (verified via devblogs.microsoft.com)
- Current stable: 6.0 (March 2026). Last JS-based compiler.
- TS 7 (Go-based) in beta — don't use yet.
- vue-tsc compatibility: likely fine, verify during scaffold.

### Vue 3.5
- Reactive props destructure (stable)
- `useTemplateRef()` for cleaner template refs
- `useId()` for SSR-safe unique IDs
- `onWatcherCleanup()` for watcher side-effect cleanup

### Prettier + Tailwind v4
- `prettier-plugin-tailwindcss` requires `tailwindStylesheet` option pointing to the CSS file with `@theme`

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| vue-tsc doesn't support TS 6 | Low | Build breaks | Fall back to TS 5.8; check compat during scaffold before committing to TS 6 |
| Vite 8 plugin compat issues | Low | Dev server/build breaks | Fall back to Vite 7.x if needed; new project = no legacy baggage |
| Shiki bundle size bloats static build | Med | Slower page load | Fine-grained imports — only load rust, typescript, lua, css languages |
| Docker compose `run --rm` overhead | Low | Slower DX for quick commands | Acceptable for portfolio project; long-running dev server is fine |
| `HOST_PROJECT_PATH` env var not set | Low | Volume mount fails | Fallback `${HOST_PROJECT_PATH:-.}` in compose; devcontainer.json already sets it |
| DigitalOcean deploy config unknown | Med | Blocks final deploy | Research exact DO target (Spaces + CDN vs App Platform) in Phase 6 |
| Prettier plugin + Tailwind v4 config | Low | Class sorting broken | Set `tailwindStylesheet` in .prettierrc pointing to main.css |

---

## Questions — RESOLVED

1. **Contact section**: Mailto + GitHub + LinkedIn. No form — Mailgun requires backend proxy, scope creep for static site. Can add in future milestone.
2. **Domain**: `redact.digital` — already owned.
3. **Resume/CV**: Subtle download link (nav or footer), dummy URL for now. Portfolio IS the resume, but some HR/ATS want a PDF.
4. **DO deploy target**: App Platform static site (free tier). Auto-deploy from GitHub, free SSL, custom domain support.
5. **Code snippets**: Hardcoded in data file. No build dependency on private repos.

---

## Risk Assessment & Rollout Strategy

**Risk level: LOW**

| Criteria | Applies? | Notes |
|---|---|---|
| Touches payments/billing | No | Static site |
| Touches auth/permissions | No | No auth |
| Raw SQL / literals | No | No database |
| Modifies existing data | No | Greenfield |
| Third-party integration | No | Maybe contact form, but optional |
| Changes existing endpoints | No | No backend |

**Mitigations**: N/A — risk is already LOW.

**Rollout plan**: Ship to production on merge to main. No staged rollout needed — it's a personal portfolio site.

---

## Roadmap (milestones)

### Milestone 1: Core Portfolio — ~1.5 weeks
Patrick has a live portfolio site with hero, project showcase (all 6 projects), about section, and contact info. Deployed to DigitalOcean on every push to main.
**Flag**: N/A (personal site, no progressive rollout)
**Status**: planned

### Milestone 2: Blog — ~1 week
Patrick can publish technical blog posts (markdown-based) on the portfolio. Blog list + individual post pages with syntax highlighting.
**Flag**: N/A
**Status**: planned
**Depends on**: Milestone 1

---

## Current Milestone: Core Portfolio

### Phase 1: Project Scaffold
**PR scope**: Nuke dead code, set up Vue 3.5 + Vite 8 + Tailwind v4 + TS toolchain with Bun
**Branch**: `chore/project-scaffold`
**Flag**: N/A
**Est. lines**: ~250
**Objective**: Clean slate with working dev server. `docker compose run --rm --service-ports bun run dev` shows a blank page with Tailwind working.
**Why this phase exists**: Can't build anything on the dead vuei boilerplate. Need the toolchain first.

**Files** (nuke & recreate):
- `package.json` — rewrite with Bun-era deps
- `index.html` — clean HTML entry
- `vite.config.ts` — Vue + Tailwind plugins
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` — TS 6 config
- `src/main.ts` — app entry
- `src/App.vue` — minimal shell
- `src/assets/main.css` — Tailwind entry + `@theme` with navy/cyan palette + dark mode variant
- `env.d.ts` — Vue SFC type shim
- Delete: `src/` old contents, any `.sass`/`.scss` files, old tsconfigs, `vite.config.ts` (old)

**Steps**:
1. Delete all files in `src/` and old config files (keep: `.devcontainer/`, `.claude/`, `.git/`, `oxlintrc.json`, `docker-compose.yml`, `cspell.json`, `.prettierrc`, `.prettierignore`)
2. Write `package.json` with:
   - deps: `vue@^3.5`, `vue-router@^4.5`, `pinia@^2.3`
   - devDeps: `vite@^8.0`, `@vitejs/plugin-vue@^6.0`, `tailwindcss@^4.2`, `@tailwindcss/vite@^4.2`, `typescript@^6.0`, `vue-tsc@^3.2`, `prettier@^3.0`, `prettier-plugin-tailwindcss@^0.7`, `oxlint`
   - scripts: `dev`, `build`, `type-check`, `lint`, `format`
3. Write `vite.config.ts` with Vue + Tailwind plugins
4. Write tsconfig files (strict mode, paths alias `@/` → `src/`)
5. Write `src/assets/main.css` with `@import "tailwindcss"`, `@theme` block (navy/cyan palette), `@custom-variant dark`
6. Write `src/main.ts`, `src/App.vue` (hello world with Tailwind classes to verify it works)
7. Write `index.html`
8. Run `docker compose run --rm bun install`
9. Verify: `docker compose run --rm --service-ports bun run dev` — page loads, Tailwind classes render, dark mode works
10. Verify: `docker compose run --rm bun run type-check` passes
11. Remove inline `"prettier"` config from package.json (we have `.prettierrc`)
12. Update `.prettierrc` — add `"tailwindStylesheet": "./src/assets/main.css"`

**Quality gate**:
- [ ] `bun run dev` serves a page with working Tailwind classes
- [ ] `bun run type-check` passes with no errors
- [ ] `bun run build` produces dist/ with static files
- [ ] `bun run lint` passes
- [ ] Dark mode variant works (`.dark` class on `<html>` toggles styles)
- [ ] No `any` types anywhere

**Verification**:
```bash
docker compose run --rm bun install
docker compose run --rm --service-ports bun run dev
# Visit http://localhost:5173 — should see styled content
docker compose run --rm bun run type-check
docker compose run --rm bun run build
```

---

### Phase 2: Layout + Dark Theme
**PR scope**: App shell with nav, footer, routing, and dark mode toggle
**Branch**: `feature/layout-theme`
**Flag**: N/A
**Est. lines**: ~350
**Objective**: Site has a responsive nav (desktop + mobile hamburger), footer with social links, Vue Router with Home route, and a working dark mode toggle persisted to localStorage.
**Why this phase exists**: Every subsequent phase builds inside this shell. Nav + footer + theme are the foundation.

**Files**:
- `src/components/layout/AppNav.vue` — responsive nav with dark mode toggle
- `src/components/layout/AppFooter.vue` — social links (GitHub, LinkedIn, email)
- `src/components/layout/MobileMenu.vue` — hamburger slide-out
- `src/composables/useTheme.ts` — dark mode state, localStorage persistence, system preference detection
- `src/router/index.ts` — Vue Router setup (Home route, future Blog route placeholder)
- `src/views/HomeView.vue` — scrollable single-page with section slots
- `src/App.vue` — update with layout wrapper + router-view
- `src/assets/main.css` — update with transition styles for dark mode

**Steps**:
1. Create `useTheme` composable: toggles `.dark` class on `<html>`, reads localStorage, falls back to system `prefers-color-scheme`
2. Create Vue Router with `/` (HomeView) and `/blog` (lazy-loaded placeholder)
3. Build AppNav: logo/name, section links (Projects, About, Contact), dark mode toggle icon, mobile hamburger trigger
4. Build MobileMenu: slide-out overlay with nav links, closes on click/escape
5. Build AppFooter: GitHub, LinkedIn, email links with Lucide icons
6. Wire up App.vue: nav → router-view → footer
7. HomeView: wrapper div with section anchors (hero, projects, about, contact) — content comes in later phases
8. Smooth scroll behavior on router: `scrollBehavior` that handles hash links

**Quality gate**:
- [ ] Nav renders on all viewport sizes (mobile, tablet, desktop)
- [ ] Mobile menu opens/closes, traps focus
- [ ] Dark mode toggle works and persists across reload
- [ ] System preference is respected on first visit (no localStorage)
- [ ] Router navigates between / and /blog (placeholder)
- [ ] Section links smooth-scroll to anchors
- [ ] Footer social links have correct hrefs
- [ ] No `any` types, type-check passes

**Verification**:
```bash
docker compose run --rm --service-ports bun run dev
# Test: resize viewport, click hamburger, toggle dark mode, reload, check localStorage
docker compose run --rm bun run type-check
```

---

### Phase 3: Hero Section
**PR scope**: Animated hero with name, title, tagline, CTA buttons, and SVG wave
**Branch**: `feature/hero-section`
**Flag**: N/A
**Est. lines**: ~250
**Objective**: Landing impression. Visitor sees "Patrick Rizzardi — Backend Engineer" with an animated SVG wave background and CTAs to scroll to projects or contact.
**Why this phase exists**: First visual impact. Sets the tone before the projects section.

**Files**:
- `src/components/hero/HeroSection.vue` — main hero layout
- `src/components/hero/AnimatedWave.vue` — SVG wave with CSS keyframe animation
- `src/components/hero/TypeWriter.vue` — subtle typing effect for tagline (optional, cut if it feels gimmicky)
- `src/views/HomeView.vue` — update to include HeroSection

**Steps**:
1. Build AnimatedWave: inline SVG path with CSS `@keyframes` animation (no JS library). Multiple layered waves with offset timing for depth. Colors from theme (navy/cyan gradient).
2. Build HeroSection: full-viewport height, centered content over wave background. Name (h1), "Backend Engineer" subtitle, one-line tagline about systems. Two CTA buttons: "View Projects" (scrolls to #projects) and "Get in Touch" (scrolls to #contact).
3. Optional TypeWriter: if we want the tagline to type out on load. Pure CSS or lightweight composable — no library dependency. Cut it if it feels cheesy.
4. Entrance animations: fade-in + slide-up on the text content using CSS transitions triggered on mount.
5. Wire into HomeView as first section.

**Quality gate**:
- [ ] Hero is full viewport height on all screen sizes
- [ ] Wave animation is smooth (60fps, GPU-accelerated transforms)
- [ ] CTA buttons scroll to correct sections
- [ ] Text is readable over the wave background (contrast ratio meets WCAG AA)
- [ ] No layout shift on load
- [ ] Animations respect `prefers-reduced-motion`

**Verification**:
```bash
docker compose run --rm --service-ports bun run dev
# Visual: check hero at mobile, tablet, desktop widths
# Check: animations smooth, CTAs scroll correctly
docker compose run --rm bun run type-check
```

---

### Phase 4: Projects Showcase
**PR scope**: Project grid with three card variants for all 6 projects
**Branch**: `feature/projects-showcase`
**Flag**: N/A
**Est. lines**: ~500
**Objective**: The meat of the portfolio. All 6 projects displayed with tier-appropriate cards — featured projects get code snippets, VPM gets work experience format, public repos get full cards.
**Why this phase exists**: This is what hiring managers come to see. The project showcase IS the portfolio.

**Files**:
- `src/types/project.ts` — Project type definitions (title, description, tech stack, links, presentation tier, code snippets)
- `src/data/projects.ts` — All 6 projects with curated data
- `src/components/projects/ProjectsSection.vue` — section wrapper with heading
- `src/components/projects/FeaturedCard.vue` — for Tessa AI, trading-v3 (code snippets, arch notes, tech badges)
- `src/components/projects/ExperienceCard.vue` — for VPM (role, responsibilities, live link, integration callouts)
- `src/components/projects/ProjectCard.vue` — for error-decoder, YinzerFlow, WoW (description, links, tech badges)
- `src/components/projects/CodeSnippet.vue` — syntax-highlighted code block (Shiki)
- `src/components/projects/TechBadge.vue` — small pill showing a tech name
- `src/views/HomeView.vue` — update to include ProjectsSection

**Steps**:
1. Define `Project` type with discriminated union for presentation tiers: `featured` (has snippets), `experience` (has role/responsibilities), `standard` (has repo/live links)
2. Write project data file with all 6 projects. For private repos (Tessa, trading-v3): include 2-3 curated code snippets each as string literals. For VPM: role description, integration callouts (HubStaff, Wingspan — solo full-stack), live link. For public repos: GitHub URL, live site URL, npm/extension links.
3. Install Shiki: `bun add shiki`. Create CodeSnippet composable/component that renders highlighted code. Only load needed languages: `rust`, `typescript`, `lua`, `css`, `toml`. Use a dark theme that complements navy.
4. Build TechBadge: small cyan-accented pill with tech name.
5. Build FeaturedCard: large card with title, description, 1-2 code snippets (expandable/tabbed), tech badges, architecture summary paragraph. No repo link (private).
6. Build ExperienceCard: work-experience layout — company name, role, date range, bullet-point responsibilities, "Key Achievement" callout for HubStaff/Wingspan integrations, live link button, tech stack badges.
7. Build ProjectCard: standard card — title, description, tech badges, links row (GitHub, live site, npm, Chrome Web Store as applicable).
8. Build ProjectsSection: responsive grid. Featured cards span full width, experience card spans full width, standard cards in 2-3 column grid.
9. Wire into HomeView at `#projects` anchor.

**Quality gate**:
- [ ] All 6 projects render with correct presentation
- [ ] Code snippets have syntax highlighting with correct language detection
- [ ] Shiki only loads needed languages (check bundle — should be <50KB gzipped for 5 languages)
- [ ] Cards are responsive (stack on mobile, grid on desktop)
- [ ] All external links open in new tab with `rel="noopener noreferrer"`
- [ ] VPM live link, error-decoder live site, YinzerFlow npm link all correct
- [ ] No hardcoded colors — all from Tailwind theme
- [ ] Type-check passes, no `any`

**Verification**:
```bash
docker compose run --rm bun install  # new dep: shiki
docker compose run --rm --service-ports bun run dev
# Visual: check all 6 cards render correctly
# Click: verify all links work
# Responsive: check mobile/tablet/desktop
docker compose run --rm bun run type-check
docker compose run --rm bun run build
# Check dist/ size — flag if >500KB gzipped
```

---

### Phase 5: About + Contact
**PR scope**: About section with skills/bio and contact section with social links
**Branch**: `feature/about-contact`
**Flag**: N/A
**Est. lines**: ~250
**Objective**: Round out the single-page experience. "About" gives a brief bio + tech skills. "Contact" provides clear paths to reach Patrick.
**Why this phase exists**: Projects are the star, but about/contact complete the story and give recruiters a way to reach out.

**Files**:
- `src/components/about/AboutSection.vue` — bio paragraph + tech skills grid
- `src/components/about/SkillCategory.vue` — grouped skill display (Languages, Infra, Databases, etc.)
- `src/components/contact/ContactSection.vue` — email, GitHub, LinkedIn with call-to-action
- `src/views/HomeView.vue` — update to include both sections

**Steps**:
1. Build SkillCategory: category name + list of skills. Categories: Languages (TypeScript, Rust, Python, Lua, SQL), Infrastructure (Docker, GitHub Actions, DigitalOcean, Linux), Databases (PostgreSQL, Redis, DragonflyDB), Frameworks (Vue 3, Express/Fastify, Sequelize, burn).
2. Build AboutSection: brief 2-3 sentence bio (backend engineer, systems focus, production scale). Tech skills grid using SkillCategory. Maybe a "what I'm working on now" line (Tessa AI / LLM training).
3. Build ContactSection: heading ("Let's Connect" or similar), email link (mailto:patrick.rizzardi@gmail.com), GitHub (patrickrizzardi), LinkedIn. Clean layout, no form. Subtle resume PDF download link (dummy URL, Patrick swaps later).
4. Wire into HomeView at `#about` and `#contact` anchors.

**Quality gate**:
- [ ] Skills are accurate and categorized logically
- [ ] Email link uses `mailto:` correctly
- [ ] Social links open in new tab
- [ ] Sections accessible via nav smooth-scroll
- [ ] Responsive on all viewports
- [ ] Type-check passes

**Verification**:
```bash
docker compose run --rm --service-ports bun run dev
# Visual: check about + contact sections
# Click: email link opens mail client, social links work
docker compose run --rm bun run type-check
```

---

### Phase 6: Deploy Pipeline
**PR scope**: GitHub Actions workflow for static build + deploy to DigitalOcean
**Branch**: `chore/deploy-pipeline`
**Flag**: N/A
**Est. lines**: ~100
**Objective**: Push to main → automatic build → deploy to DigitalOcean. Zero manual steps.
**Why this phase exists**: Site needs to be live. CI/CD makes it stay live with every push.

**Files**:
- `.github/workflows/deploy.yml` — build + deploy workflow
- `vite.config.ts` — possibly update `base` path if needed for DO hosting

**Steps**:
1. Set up DigitalOcean App Platform static site:
   - Connect GitHub repo to DO App Platform
   - Configure: build command = Bun install + build (or Node fallback if Bun not supported)
   - Output directory = `dist`
   - Custom domain: `redact.digital`
   - Free SSL via Let's Encrypt (auto)
2. If App Platform supports Bun natively: configure build command as `bun install && bun run build`
3. If App Platform doesn't support Bun: create GitHub Actions workflow that builds with `oven/bun` action, then deploys dist/ via `doctl` or DO deploy action
4. Configure DNS: point `redact.digital` to DO App Platform
5. Verify: push to main triggers auto-deploy, site accessible at `redact.digital`

**Quality gate**:
- [ ] Workflow runs on push to main
- [ ] Build step uses Bun (not Node)
- [ ] Type-check and lint run before build (fail fast)
- [ ] Deploy only happens if build succeeds
- [ ] Secrets are in GitHub Actions secrets, never in code

**Verification**:
```bash
# Push to main and verify:
# 1. GitHub Actions workflow triggers
# 2. Build succeeds
# 3. Site is accessible at the target URL
```

---

### Phase 7: Verification Sweep
**PR scope**: Final quality pass — no orphaned TODOs, all items verified
**Branch**: `chore/verification-sweep`
**Flag**: N/A
**Est. lines**: ~0-50 (fixes only)
**Objective**: Confirm everything is actually done, not "marked done."

**Steps**:
1. **TODO sweep**: grep for `TODO`, `FIXME`, `HACK`, `XXX`, `TEMP`, `PLACEHOLDER` in codebase. Move any to `todos.md` or fix.
2. **Todos cross-check**: verify every checked item in `todos.md` against actual code.
3. **Shortcut detection**: look for hardcoded values, placeholder text, stub implementations.
4. **Lighthouse audit**: run Lighthouse on the built site. Target 90+ performance, 90+ accessibility.
5. **Browser test**: check Chrome, Firefox, Safari (if accessible). Mobile + desktop.
6. **Build size check**: `dist/` should be reasonable for a static portfolio (<1MB gzipped total).
7. **Link check**: all external links (live sites, repos, npm, extension) return 200.

---

## Anti-Pattern Check

- **Splitting into commits instead of PRs** → ✅ Avoided: 7 phases = 7 branches = 7 PRs. Each merges to main independently.
- **Shadow main branches** → ✅ Avoided: every PR targets main. No long-lived parent branch.
- **Building engine before shipping value** → ✅ Avoided: Phase 1 is minimal scaffold (~250 lines). By Phase 3, there's visible content. No "build the framework then fill it in" pattern.
- **Hotfix that isn't** → ✅ N/A: no hotfixes in this plan.
- **Abandoned branches** → ✅ Avoided: each phase is ~1 day of work. No branch should live more than 2 days.
- **Flag graveyards** → ✅ N/A: no feature flags (personal portfolio, no staged rollout needed).

---

## Quality Checklist (verify at completion)

- [ ] All inputs validated (contact form if applicable)
- [ ] No XSS vectors (no v-html with untrusted content)
- [ ] No secrets in code (deploy tokens in GitHub Actions secrets only)
- [ ] Performance: Lighthouse 90+, bundle <1MB gzipped, Shiki languages lazy-loaded
- [ ] Accessibility: WCAG AA contrast ratios, keyboard navigable, semantic HTML
- [ ] Responsive: mobile, tablet, desktop tested
- [ ] Types complete: no `any`, no non-null assertions, strict mode
- [ ] Lint clean: prettier + oxlint + cspell all pass
- [ ] All 6 projects display correctly with tier-appropriate cards
- [ ] All external links work (GitHub repos, live sites, npm, extension)
- [ ] Dark mode works and persists
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Deploy pipeline works (push to main → live site updates)
