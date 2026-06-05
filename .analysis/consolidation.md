# Consolidation Report — redact.digital

**Analyzed**: 2026-06-03
**Scope**: Single-app Vue 3 + Tailwind 4 + vite-ssg static site (`/home/patrick/development/redact-digital`)
**Adapted methodology**: WITHIN-app capability duplication (not cross-service — this is not a monorepo). Looking for the same concept derived/sourced two ways, parallel UI primitives, duplicated styling tokens, and divergent data-access patterns.
**Consolidation Opportunities Found**: 9 (1 of which is an active bug surfaced by the duplication)

---

## HIGH — `:root` and `@theme` carry overlapping token sets with divergent naming

**Type**: Shared Infrastructure (design tokens)
**Locations**:
- `src/assets/main.css:6-32` — `@theme { ... }` block
- `src/assets/main.css:34-82` — `:root { ... }` block
- Font vars duplicated verbatim: `--font-display/-accent/-body/-mono` at `main.css:24-27` (theme) AND `main.css:78-81` (`:root`)
- `--btn-radius: 6px` at `main.css:30` (theme) AND `main.css:69` (`:root`)
- `--card-radius: 14px` at `main.css:31` (theme) AND `main.css:70` (`:root`)
- Color values duplicated with different names: `--color-bg`/`--bg`, `--color-text`/`--text`, `--color-burnt`/`--burnt`, etc. (theme lines 7-22 mirror `:root` lines 35-59 with the `--color-` prefix dropped and identical `oklch()` literals)

**Current state**: Two parallel token vocabularies. Tailwind 4's `@theme` generates utility classes (`bg-bg`, `text-burnt`, `font-display`) and emits its tokens as CSS vars under `--color-*`/`--font-*`. The `:root` block defines the SAME values under shorter names (`--bg`, `--burnt`, `--font-display`) which the codebase consumes almost exclusively via inline `style="...var(--burnt)..."`. So the burnt color exists as both `--color-burnt` (theme) and `--burnt` (`:root`), set to the identical `oklch(0.66 0.17 48)`. Change the brand color and you must edit it in two places or they silently drift.

**Is the `@theme`/`:root` font + radius duplication necessary for Tailwind 4?** Partially — and the report should be precise here per the brief:

- **Fonts**: NOT necessary to duplicate the literal value. Tailwind 4 `@theme` emits `--font-display` (no `--color-` prefix; `--font-*` is its own namespace). The `:root` redefinition at `main.css:78-81` sets the SAME var name to the SAME value — it is pure redundancy. The `@theme` declaration already makes `--font-display` available globally as a CSS custom property. The `:root` copies can be deleted; every `var(--font-display)` consumer keeps working off the `@theme`-emitted var. (Verify in build output that `@theme` emits these to `:root` — it does by default unless `@theme inline` is used; this code uses plain `@theme`.)
- **`--btn-radius` / `--card-radius`**: These are NOT Tailwind-recognized namespaces (`--radius-*` is Tailwind's; `--btn-radius`/`--card-radius` are arbitrary). Inside `@theme` they do nothing for Tailwind utility generation — `@theme` only mints utilities for recognized namespaces (`--color-*`, `--font-*`, `--radius-*`, `--spacing-*`, etc.). So `--btn-radius`/`--card-radius` in the `@theme` block (lines 30-31) are dead weight; their real home is `:root` (lines 69-70), where the inline styles read them (e.g. `AppButton.vue:89` `borderRadius: 'var(--btn-radius)'`). **The `@theme` copies at lines 30-31 are deletable with zero behavioral change.**
- **Colors**: The dual `--color-burnt` + `--burnt` naming is the deepest issue. It's not strictly necessary but collapsing it is a larger change (see Risks).

**Proposed consolidation**: Pick `@theme` as the single source of truth for tokens that Tailwind needs (colors, fonts). Two clean options:

1. **Minimal (quick win, do now)**: Delete the redundant `:root` font block (`main.css:78-81`) and the `@theme` radius lines (`main.css:30-31`). Net: -6 duplicated lines, zero behavior change, removes two drift vectors. The radius vars live only in `:root`; the font vars live only in `@theme`.
2. **Full (do when a third color-consumption path appears or a rebrand is queued)**: Collapse `--burnt`→`--color-burnt` etc. so one set of names exists. Requires either (a) a find/replace of every inline `var(--burnt)` → `var(--color-burnt)` across ~12 components, or (b) keeping the short aliases as thin `--burnt: var(--color-burnt);` references in `:root` so there's one literal and the short names are aliases, not copies. Option (b) is lower-risk: literals live once in `@theme`, `:root` holds aliases only.

**Trigger condition**: Option 1 now (it's free). Option 2 when the next rebrand lands (there's an active `cheddar-rebrand` history in git — rebrands are recurring here, which is exactly when dual-source color tokens bite).
**Effort**: Low (option 1) / Medium (option 2 full collapse).
**Benefit**: Eliminates silent drift between two definitions of the same color/font/radius. A rebrand becomes a one-place edit instead of a two-place edit with a diff-review burden.
**Risk**: Option 2 — if `@theme` is later switched to `@theme inline`, the `--color-*` vars stop being emitted to `:root` and inline `var(--color-burnt)` consumers break. Document the dependency if going with full collapse.

---

## HIGH — `post.slug` used where the type only has `post.frontmatter.slug` (active bug, surfaced by the dual access pattern)

**Type**: Shared Logic (blog data access) — and a confirmed runtime defect
**Locations**:
- `src/components/writing/WritingSection.vue:56` — `:key="post.slug"`
- `src/components/writing/WritingSection.vue:57` — `:to="`/blog/${post.slug}`"`
- Contrast: `src/views/BlogView.vue:105`, `src/components/blog/BlogPostCard.vue:21`, `BlogJsonLd.vue:27`, `useBlogPosts.ts:53` all correctly use `post.frontmatter.slug`
- Type definition: `src/types/blog.ts:13-17` — `BlogPost` has `frontmatter` (which holds `slug`) and `readingTime`, `component`. There is no top-level `slug` on `BlogPost`.

**Paper trace**:
- Observed: `WritingSection.vue:57` builds the home-page "recent posts" link as `/blog/${post.slug}`. `post` is a `BlogPost` (from `useBlogPosts().posts.slice(0,4)`), and `BlogPost.slug` does not exist (`types/blog.ts:13-17`).
- Expected: `/blog/<actual-slug>`, e.g. `/blog/fault-tolerant-microservices`.
- Result: `post.slug` evaluates to `undefined` → the link resolves to `/blog/undefined`, and `:key="post.slug"` gives every row the same `undefined` key (Vue list-diffing degenerates).
- Hypothesis: copy/paste from an earlier flat-shape blog model, or hand-authored against the wrong shape; TypeScript didn't catch it because Vue SFC template expressions are not always type-checked unless `vue-tsc` strict template checking is on.
- Evidence path: `src/components/writing/WritingSection.vue:56-57` vs `src/types/blog.ts:13-17`.

**Why it's in a consolidation report**: this is the textbook payoff of the audit — the home page reaches blog data through a DIFFERENT access shape than every other consumer, and that divergence is exactly where the bug lives. Every OTHER blog consumer goes through `post.frontmatter.slug`; WritingSection went off-pattern and broke.

**Proposed consolidation**: Fix the two lines to `post.frontmatter.slug` (matches every other consumer). Then, to prevent recurrence, consider exposing a derived `slug` getter on the `BlogPost` shape in `useBlogPosts.ts` (map each post to include a top-level `slug` mirror) so BOTH access shapes are valid — OR (cleaner) enable `vue-tsc` template type-checking in the build so off-shape access fails CI. The former trades a tiny denormalization for ergonomics; the latter is the real fix (catches the whole class).

**Trigger condition**: Now — it's a live broken link on the home page. (Flagging as the brief asked for consolidation findings, but per `no-duct-tape.md` and the verification rule, this is a confirmed bug, not a "revisit later.")
**Effort**: Low (two-char-path fix). Medium if also wiring `vue-tsc` strict template checks.
**Benefit**: Restores the home page → blog post links; removes duplicate `undefined` keys.
**Risk**: None for the fix itself.

> NOTE: I am reporting, not editing, per the analyst role. This one should be escalated to fix immediately given it's a live defect.

---

## MEDIUM — Three different mechanisms emit `<head>` metadata for the same site identity

**Type**: Shared Infrastructure (SEO / meta wiring)
**Locations**:
- `index.html:6-9,17` — static `<meta name="description">` and `<title>` (hardcoded copy)
- `src/composables/useSeo.ts:21-43` — runtime `useSeoMeta()` (per-view title/description/OG/Twitter)
- `src/components/blog/BlogJsonLd.vue:33-40` — `useHead()` injecting JSON-LD `<script>`
- Consumers calling `useSeo` with inline copy: `HomeView.vue:11-16`, `BlogView.vue:11-16`, `BlogPostView.vue:26-36`

**Current state**: Site metadata is produced through three transports (static HTML, `useSeoMeta`, `useHead`) and the home-page description string is **duplicated verbatim** between `index.html:8` and `HomeView.vue:13-14`. The static `index.html` title/description are the SSR/no-JS fallback; `useSeo` overrides at runtime. With vite-ssg these mostly reconcile at build time, but the home description literally exists in two files and will drift on the next copy edit.

**Proposed consolidation**:
- Move the home-page title/description into `siteConfig.ts` (e.g. `defaultTitle`, `defaultDescription`) and have BOTH the `index.html` generation path and `HomeView.vue`'s `useSeo` call read from it. Since `index.html` is static, the practical move is: make `siteConfig` the source, and either (a) template the description into `index.html` via a vite transform/plugin, or (b) accept that `index.html` holds only a minimal generic fallback and let `useSeo` own the real per-page copy (so they're intentionally NOT the same string — fallback vs canonical — which is a documented decision, not drift).
- `useSeo` already centralizes OG/Twitter well — keep it. `BlogJsonLd` via `useHead` is a legitimately different concern (structured data) and should stay separate; it already sources from `siteConfig` correctly (`BlogJsonLd.vue:18-27`).

**Trigger condition**: When the home-page marketing copy changes (it will — the description embeds specific stats like "$2M/mo", "team of 4", "11 production integrations" that also appear in `metrics.ts` and the hero subhead — see next finding). Consolidate before the next copy revision so it's edited once.
**Effort**: Low–Medium (Low if you go with option (b) "fallback vs canonical, documented"; Medium if you template `index.html` from `siteConfig`).
**Benefit**: One edit for site description instead of two; clearer ownership (fallback vs canonical).
**Risk**: If `index.html` and `useSeo` are made to share one string via a build step, that's a new build dependency — only worth it if exact parity matters for crawlers that read pre-hydration HTML.

---

## MEDIUM — The same marketing facts live in `metrics.ts`, the hero subhead, and SEO descriptions

**Type**: Shared Data Source (canonical "stats" copy)
**Locations**:
- `src/data/metrics.ts:1-6` — `$65.8M+`, `11` production integrations, `100K+` users, `4` dev team
- `src/components/hero/HeroSection.vue:186-189` — subhead prose: "team of 4", "$2M/mo platform"
- `HomeView.vue:13-14` + `index.html:8` — SEO description: "$2M/mo scale", "team of 4", "11 production integrations"

**Current state**: "team of 4" appears in `metrics.ts` (`4 / dev team led`), in the hero subhead prose, and in the SEO description — three places, three literals. "11 production integrations" appears in `metrics.ts` and the SEO copy. "$2M/mo" vs "$65.8M+" are different framings of revenue scale in different spots. If you get promoted to leading 6, you edit three files and might miss one.

**Proposed consolidation**: `metrics.ts` is already the right home for the structured numbers. The prose (hero subhead, SEO description) inherently restates them in sentence form — you can't fully dedupe prose into a data array without templating. Realistic move: treat `metrics.ts` as the canonical source for the discrete facts (team size, integration count) and have the hero/SEO copy reference those values via interpolation where it reads naturally (e.g. team size). For the parts that are genuinely prose-only, accept the restatement but add a one-line note in `metrics.ts` listing the prose locations that mirror these numbers, so a future edit knows where else to look.

**Trigger condition**: When any headline stat changes (team size, integration count, revenue). These are the most likely fields to go stale.
**Effort**: Low (interpolate team-size/integration-count from `metrics.ts`; annotate the rest).
**Benefit**: Single source for the load-bearing numbers; reduced risk of a stale "team of 4" lingering after the team grows.
**Risk**: Over-templating prose hurts readability. Keep the prose human; only dedupe the discrete numerals that are safe to interpolate.

---

## MEDIUM — Two patterns for the same "icon link list" (Footer vs Contact) sourcing the same social URLs

**Type**: Shared Logic (social-link rendering) + Shared Data Source (the URLs)
**Locations**:
- `src/components/layout/AppFooter.vue:5-9` — `socialLinks` array (Github/Linkedin/Mail icons + `siteConfig` URLs), rendered as `<a>` with inline hover JS (`AppFooter.vue:28-29`)
- `src/components/contact/ContactSection.vue:6-31` — `links` array (Mail/Github/Linkedin/FileText + `siteConfig` URLs + resume), rendered as a richer `<a>` card with `hovered` ref
- Both derive `mailto:${siteConfig.email}`, `siteConfig.github`, `siteConfig.linkedin` independently.

**Current state**: Two components each build their own social-link array from `siteConfig`, each with the same Github/Linkedin/Mail trio plus their own extras (Footer has none; Contact adds Resume). The link-array shape (`{ icon, href, label }`) is nearly identical. The hover treatment is implemented two different ways: Footer uses imperative inline `@mouseenter` DOM style mutation (`AppFooter.vue:28-29` — direct `currentTarget.style.color` writes, which is off-pattern for Vue and bypasses reactivity), Contact uses a reactive `hovered` ref (the correct pattern).

**Proposed consolidation**:
- Extract the canonical social-link definitions into `siteConfig.ts` (or a small `data/socialLinks.ts`) as `{ icon, label, href }[]` so both components consume one array. Footer takes the trio; Contact takes the trio + resume. One place to add/reorder social links.
- The rendering differs enough (Footer = compact icon row, Contact = labeled card with hover affordance) that a single shared component may be over-abstraction — but both should at least share the data source. If a third surface needs social links, promote to a shared `SocialLinks` component.
- Separately: `AppFooter.vue:28-29`'s imperative hover-color mutation is off-pattern (per the project's Vue standards — no direct DOM style writes; use reactive state or Tailwind hover utilities). Worth aligning with Contact's reactive approach or a Tailwind `hover:` class.

**Trigger condition**: When a third surface needs social links, OR when a social URL changes (right now a LinkedIn URL change is a two-file edit even though it already lives in `siteConfig` — the duplication is the per-component array construction, not the URLs themselves).
**Effort**: Low (shared data array) / Medium (shared component).
**Benefit**: One social-link list; consistent hover behavior; removes the off-pattern imperative DOM mutation in Footer.
**Risk**: Forcing one component for two visually distinct layouts would add prop complexity — share the data, not necessarily the markup.

---

## MEDIUM — Navigation targets are defined in `AppNav` but the implicit "section ids" contract is spread across every section component

**Type**: Shared Data Source (the section-id ↔ nav-label map)
**Locations**:
- `src/components/layout/AppNav.vue:15-20` — `navLinks` = `principles | systems | leadership | writing` (the canonical nav list)
- `AppNav.vue:75` and `MobileMenu.vue:79-85` — `contact` is a hardcoded nav target NOT in `navLinks` (the "hire" CTA), plus `top` (`AppNav.vue:54`)
- The actual section `id`s live independently in each section: `PrinciplesSection.vue:10` (`id="principles"`), `SystemsSection.vue:63` (`id="systems"`), `LeadershipSection.vue:12` (`id="leadership"`), `WritingSection.vue:13` (`id="writing"`), `ContactSection.vue:38` (`id="contact"`), `HeroSection.vue:55` (`id="top"`)

**Current state**: The nav-to-section contract is split. `navLinks` enumerates four ids; `contact` and `top` are special-cased inline in two nav components. Meanwhile each section hardcodes its own `id` string with no shared registry. If you rename `id="systems"` to `id="projects"`, you must update the section component AND `navLinks` AND any `scrollToSection('systems')` callers (e.g. `HeroSection.vue:198` calls `scrollToSection('systems')`). Nothing ties these together — a rename silently breaks the scroll.

**Proposed consolidation**: Define the section registry once — e.g. `data/sections.ts` exporting `{ id, label, inNav }[]` (or a `const sections = { principles: 'principles', systems: 'systems', ... } as const` keyed map). Sections read their `id` from it; `AppNav` derives `navLinks` from `sections.filter(inNav)`; `contact`/`top` become typed members rather than magic strings; `scrollToSection` callers reference the const instead of a bare string literal. This turns a section rename into a one-line change with compile-time propagation.

**Trigger condition**: When a section is added, removed, renamed, or reordered (the rebrand history suggests sections do get reworked). Also do it if a section id ever needs to differ from its nav label.
**Effort**: Low–Medium (introduce the registry, repoint ~6 section `id`s + 2 nav components + scroll callers).
**Benefit**: Single source for the section/nav contract; renames become safe; `scrollToSection('typo')` can be made type-checked.
**Risk**: Minor — the registry adds one indirection. Keep it flat and typed (`as const`) so ids stay literal-typed.

---

## LOW — Date formatting reimplemented in three components

**Type**: Shared Logic (date display)
**Locations**:
- `src/components/blog/BlogPostCard.vue:9-16` — `toLocaleDateString('en-US', { year, month: 'long', day })`
- `src/components/blog/BlogPostHeader.vue:9-16` — identical `toLocaleDateString('en-US', { year, month: 'long', day })`
- `src/components/writing/WritingSection.vue:70` — `toLocaleDateString('en-US', { month: 'short', year })` (different format — month/year only)

**Current state**: The long-form date format (`Month DD, YYYY`) is copy-pasted byte-for-byte across BlogPostCard and BlogPostHeader (3+ identical lines each). WritingSection uses a shorter variant. Per the project's "3+ = extract" DRY threshold, the two identical implementations already cross the line, and the third is a sibling variant.

**Proposed consolidation**: Add a `utils/date.ts` with a grouped export, e.g. `dateUtils.long(dateStr)` and `dateUtils.monthYear(dateStr)` (the project standard is grouped const-object utils, not scattered exports). All three components consume it. This is a pure function with no Vue dependency, so it belongs in `utils/`, not `composables/`.

**Trigger condition**: Now-ish — it's already at the DRY threshold (two identical copies). Cheap to extract.
**Effort**: Low.
**Benefit**: One date-format definition; consistent locale handling; trivial to add timezone or i18n later in one place.
**Risk**: None.

---

## LOW — Tag-chip markup is hand-rolled in two cards instead of using the existing `AppButton` chip variant

**Type**: Shared Logic (UI primitive — the "tag chip")
**Locations**:
- `src/components/blog/BlogPostCard.vue:64-76` — `<span>` tag chips with full inline style (`var(--font-mono)`, `var(--bg-3)` bg, `var(--line-soft)` border)
- `src/components/systems/SystemsSection.vue:149-161` (tech chips) and `:232-247` (status chip) and `LeadershipSection.vue:121-133` (stack chips) — the SAME visual chip (`rounded-full px-2.5 py-1`, mono font, `var(--bg-3)` bg, `var(--line-soft)` border) re-implemented inline
- Contrast: `BlogPostHeader.vue:60-67` and `BlogView.vue:87-96` correctly render tags via `<AppButton variant="chip">`

**Current state**: There are TWO ways to render a chip: the `AppButton variant="chip"` component (used for interactive/clickable tags) and a hand-rolled `<span>` with duplicated inline styling (used for display-only tags/tech/stack). The display-only spans repeat the same ~6-line style block across BlogPostCard, SystemsSection (twice), and LeadershipSection. They're visually the same chip as `AppButton`'s chip variant minus the interactivity.

**Proposed consolidation**: Either (a) add a non-interactive mode to `AppButton`'s chip variant (it already renders as `<span>`-like content; a `static`/display prop that drops cursor/hover would let display chips reuse it), or (b) extract a tiny presentational `Chip.vue` (or `Tag.vue`) that both `AppButton` and the display sites share for the base styling. Option (b) is cleaner — `AppButton` is interactive-first; a display chip is a different primitive. The key win is that the chip's visual tokens (`var(--bg-3)`, `var(--line-soft)`, mono font, radius) live in ONE place so a chip restyle isn't a 4-file hunt.

**Trigger condition**: When the chip visual changes (during a restyle/rebrand — which has happened), OR when a fifth chip site appears. Right now it's at 4 hand-rolled copies, already past the DRY threshold.
**Effort**: Low (extract presentational `Chip.vue`) / Medium (retrofit `AppButton` with a display mode and migrate).
**Benefit**: One definition of the chip look; restyle is one edit; removes ~24 lines of duplicated inline style.
**Risk**: Low. Keep display-chip and interactive-chip conceptually distinct so you don't overload `AppButton` with display-only concerns.

---

## LOW — Repeated section-header block (eyebrow + clamp() h2) across five sections

**Type**: Shared Logic (UI primitive — section header)
**Locations**:
- `PrinciplesSection.vue:15-28`, `SystemsSection.vue:68-81`, `LeadershipSection.vue:19-32`, `ContactSection.vue:42-55`, `WritingSection.vue:19-32`, and `BlogView.vue:63-81`

**Current state**: Every top-level section opens with the same pattern: a `<div class="eyebrow">label</div>` followed by an `<h2>` carrying an identical inline style block (`font-family: var(--font-display); font-weight: 800; font-size: clamp(32px, 4vw, 56px); letter-spacing: -0.03em; line-height: 1.05; color: var(--text)`). The `clamp()` heading style is copy-pasted across 5+ sections (BlogView uses a slightly larger `clamp(40px, 5vw, 64px)` for the page h1). The `.eyebrow` class is already extracted to CSS (`main.css:172-188`) — good — but the heading style is not.

**Proposed consolidation**: Extract a `SectionHeader.vue` (props: `eyebrow`, `title`, optional `subtitle`) that owns the eyebrow + h2 markup and the heading style. Five sections collapse to `<SectionHeader eyebrow="systems" title="what I've built" />`. The heading inline style becomes a single `@apply`-style utility or a class in `main.css` (the project allows a CSS class when a combo is used 2+ times). This pairs naturally with the section-registry idea (Finding #6) — `SectionHeader` could take the registry entry directly.

**Trigger condition**: When the heading typography changes (rebrand/restyle), OR when adding a sixth section. The clamp() heading is the single most-copied style block in the app.
**Effort**: Low.
**Benefit**: One heading definition; consistent type scale; a typography tweak is one edit instead of six.
**Risk**: Section headers occasionally differ (h1 on BlogView vs h2 on home sections; different clamp ceilings). Make the tag/size configurable via props so the component covers both without forking.

---

## Dependency Map (intra-app)

```
siteConfig.ts ──┬──> useSeo.ts ──> HomeView / BlogView / BlogPostView   (canonical site identity + OG)
                ├──> BlogJsonLd.vue                                       (structured data)
                ├──> AppFooter.vue       (social links — own array)       ← DUP data-shape
                ├──> ContactSection.vue  (social links — own array)       ← DUP data-shape
                └──> HeroSection.vue     (github url)

index.html ─────> (static title/description)   ← DUPLICATES HomeView's useSeo copy

metrics.ts ─────> HeroSection.vue (metric grid)
                  └─ same facts restated in: hero subhead prose, SEO descriptions   ← DUP facts

useBlogPosts.ts ─┬──> BlogView (list + tags)        via post.frontmatter.slug ✓
                 ├──> BlogPostView (single + nav)    via post.frontmatter.slug ✓
                 ├──> BlogPostCard                    via post.frontmatter.slug ✓
                 └──> WritingSection (home recent)    via post.slug             ✗ BUG

main.css @theme  ──┐
main.css :root   ──┴── overlapping token sets (colors/fonts/radius)   ← DUP tokens

scroll.ts (scrollToSection) ── called with bare-string section ids from AppNav, MobileMenu, HeroSection
section ids hardcoded in 6 section components, nav list in AppNav.navLinks   ← no shared registry

AppButton (chip variant) ── interactive tags         ┐
hand-rolled <span> chips  ── display tags/tech/stack  ┴── two chip implementations   ← DUP primitive
```

## Priority

### Quick Wins (low effort, clear benefit — do now)
1. **Fix `post.slug` → `post.frontmatter.slug`** in `WritingSection.vue:56-57` (active bug; escalate to fix).
2. **Delete redundant token copies** in `main.css`: `:root` font block (78-81) + `@theme` radius lines (30-31). Free, zero behavior change.
3. **Extract `dateUtils`** (`utils/date.ts`) — already past DRY threshold (two byte-identical copies).

### Strategic (medium effort, do when triggered)
4. **Section registry** (`data/sections.ts`) — do at next section add/rename/reorder.
5. **Shared social-link data source** — do when a 3rd surface needs them or on next URL change; also fix Footer's imperative hover.
6. **Consolidate home description** between `index.html` and `HomeView`/`useSeo` — do at next marketing-copy revision.
7. **`SectionHeader.vue`** + **display `Chip.vue`** — do at next restyle/rebrand (highest-leverage moment, given recurring rebrands).

### Future State (larger, revisit later)
8. **Collapse `--color-*` / short-name color tokens** into one set — do at next rebrand; lower-risk path is short names as aliases of `@theme` literals, not copies.
9. **Wire `vue-tsc` strict template type-checking** into the build — would have caught the `post.slug` bug at compile time and prevents the whole off-shape-access class.

## What's Already Well-Shared (preserve)
- **`siteConfig.ts`** — single source for name/email/URLs/social. Correctly consumed by `useSeo`, `BlogJsonLd`, Footer, Contact, Hero. The duplication is in per-component re-derivation, not the config itself.
- **`useSeo` composable** — clean central OG/Twitter/title wiring; the right abstraction. Keep it.
- **`useBlogPosts` composable** — single glob-based blog loader with `getBySlug`/`getAllTags`; all consumers but one route through it correctly. This is the model the rest should follow.
- **`AppButton`** — genuinely good consolidation of primary/ghost/chip/text/nav button variants across `button`/`a`/`RouterLink`. Most interactive elements already use it. The gap is display-only chips (Finding #8), not the button system.
- **`.eyebrow` class** (`main.css:172-188`) — already extracted and reused everywhere. The companion h2 style should follow its lead (Finding #9).
- **`--nav-h` token + `scroll.ts`** — well-documented single-source-with-live-measurement pattern for nav height. The comments explicitly explain why the fallback exists. Preserve as-is.
- **`useScrollReveal` / `useDecoder`** — clean, single-purpose composables with no overlap. No consolidation needed.

---

## Note on escalation

Two items lean toward orchestrator decisions but I'm flagging rather than escalating, since each has a clear low-risk default:
- **Finding #1 option 2** (collapsing color token names) is a design decision with a real coupling tradeoff (`@theme` vs `@theme inline` behavior). The quick-win subset (option 1) is unambiguous; the full collapse should get a design call before execution.
- **Finding #2** is a confirmed live bug, not a design choice — recommend immediate fix outside the consolidation track.
