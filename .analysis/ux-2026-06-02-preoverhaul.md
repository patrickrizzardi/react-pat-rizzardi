# UX / Accessibility Audit Report

**Analyzed**: 2026-06-02  
**Scope**: `src/components/**`, `src/views/**`, `index.html`, `src/assets/main.css`  
**Friction Issues Found**: 14 (Critical: 3, High: 5, Medium: 4, Low: 2)  
**Opportunities Identified**: 5 (High: 2, Medium: 2, Low: 1)

---

# Part 1: Friction Analysis

---

## [CRITICAL] — `--text-4` fails WCAG AA contrast on both backgrounds

**Category**: Color Contrast  
**WCAG Criterion**: 1.4.3 Contrast (Minimum)  
**Locations where `--text-4` is used on text**:
- `src/components/layout/AppFooter.vue:39` — copyright text ("© 2026 Cheddar")
- `src/components/hero/HeroSection.vue:103–109` — vertical side label "cheddar / 2026 — engineering log"
- `src/components/systems/SystemsSection.vue:223` — project role label text (11px mono)
- `src/components/writing/WritingSection.vue:70,94` — post date and reading time columns
- `src/components/blog/BlogPostCard.vue:39` — date and reading time metadata
- `src/components/blog/BlogPostHeader.vue:45` — post metadata row
- `src/components/blog/BlogPostNav.vue:42,78` — "Previous" / "Next" labels
- `src/components/contact/ContactSection.vue:93–98` — contact row label (e.g. "EMAIL")
- `src/components/leadership/LeadershipSection.vue:116` — stack category labels

**Computed contrast ratios**:
- `--text-4` (oklch 0.42 → Y ≈ 0.14) vs `--bg` (oklch 0.15 → Y ≈ 0.017): **≈ 2.8:1** — FAILS AA (4.5:1 required for normal text, 3:1 for large/bold ≥18px or bold ≥14px)
- `--text-4` vs `--card` opaque (oklch 0.20 → Y ≈ 0.033): **≈ 2.3:1** — FAILS AA and AA large text

**Conversion note**: OKLCH → sRGB → linear via the standard OKLAB pipeline; low-chroma values are near-neutral so the hue error is minimal. These ratios are below the fail threshold by a wide enough margin (~40–45%) that they are confirmed failures, not borderline verify-in-browser cases.

**Current code (example from AppFooter.vue:39)**:
```html
<p class="text-sm" style="color: var(--text-4)">
  &copy; {{ new Date().getFullYear() }} {{ siteConfig.name }} ...
</p>
```

**Impact**: All muted metadata text — dates, reading times, category labels, copyright, the side label — is illegible for users with low vision. These are typically rendered at 11–13px, making the effective threshold even harder to meet.

**Recommended fix**: Raise `--text-4` lightness from 0.42 to approximately 0.52–0.55 in `main.css`. At oklch(0.52, 0.02, 55), Y ≈ 0.22, giving contrast ≈ 3.9:1 on `--bg` and ≈ 3.3:1 on `--card` — still below AA for small body text but meeting large/bold AA. For the very small 10–11px instances, the correct fix is to promote those labels to `--text-3` (which passes) rather than relying on `--text-4` at any size.

---

## [CRITICAL] — `--text-3` on `--card` fails AA for normal text

**Category**: Color Contrast  
**WCAG Criterion**: 1.4.3 Contrast (Minimum)  
**Locations**:
- `src/components/systems/SystemsSection.vue:165` — architecture note body text (13px)
- `src/components/systems/SystemsSection.vue:227` — secondary project description (13px)
- `src/components/principles/PrinciplesSection.vue:66` — principle body text (14px) rendered on `--card`-adjacent background
- `src/components/blog/BlogPostCard.vue:59` — post description (13px) inside card with `background: var(--card)`
- `src/components/writing/WritingSection.vue:91` — post description below title (13px)
- `src/assets/main.css:159` — `.eyebrow` global class uses `--text-3`

**Computed contrast ratios**:
- `--text-3` (oklch 0.58 → Y ≈ 0.29) vs `--card` opaque (Y ≈ 0.033): **≈ 4.1:1** — FAILS AA for normal text (4.5:1 required), passes large text (3:1)
- `--text-3` vs `--bg` (Y ≈ 0.017): **≈ 5.1:1** — passes AA, but close enough to flag as verify-in-browser

**Conversion note**: The --card background has 55% alpha in actual rendering (`oklch(0.2 0.01 260 / 0.55)`). Composited over `--bg` it blends toward `--bg`, making the effective background lighter than the opaque estimate — this makes the real contrast *worse* than my opaque-worst-case estimate. The 4.1:1 figure is therefore optimistic.

**Current code (BlogPostCard.vue:59)**:
```html
<p style="font-size: 13px; line-height: 1.65; color: var(--text-3); margin: 0 0 16px">
  {{ post.frontmatter.description }}
</p>
```

**Impact**: Card descriptions, principle body text, and architecture notes at 13–14px fail AA on card surfaces. These are the most substantive text blocks on the site — the paragraphs users read to evaluate the work.

**Recommended fix**: Use `--text-2` for body/description text inside cards (it passes at ≈7.5:1 on card). Reserve `--text-3` for explicitly large text (≥18px) or purely decorative/supplemental labels.

---

## [CRITICAL] — Nav links use `<a role="button">` — wrong semantic element, broken keyboard contract

**Category**: Semantic HTML / Interactive Elements  
**WCAG Criterion**: 4.1.2 Name, Role, Value; 2.1.1 Keyboard  
**Locations**:
- `src/components/layout/AppNav.vue:61–78` (desktop nav links)
- `src/components/layout/AppNav.vue:80–97` (desktop CTA "hire ↗")
- `src/components/layout/MobileMenu.vue:65–75` (mobile nav links)
- `src/components/layout/MobileMenu.vue:82–95` (mobile CTA "hire ↗")

**Current code (AppNav.vue:61–66)**:
```html
<a
  v-for="link in navLinks"
  :key="link.id"
  role="button"
  tabindex="0"
  class="cursor-pointer rounded-full ..."
  @click="scrollTo(link.id)"
  @keydown.enter="scrollTo(link.id)"
>
```

**Impact**: Three compounding problems:
1. `<a>` without `href` is not in the tab order by default (hence the manual `tabindex="0"`) — a signal the element type is wrong.
2. `role="button"` on an `<a>` creates a semantic conflict. Screen readers announce "link" from the tag, then "button" from the role — confusing.
3. Only `Enter` is handled; native buttons also fire on `Space`. Users pressing Space on these "buttons" get page-scroll instead of navigation. This is a WCAG 2.1.1 keyboard failure.

**Recommended fix**: Replace with `<button type="button">` for scroll-to-section actions (they are not navigation links, they are actions). Remove `role="button"` and `tabindex="0"` — buttons are natively focusable and handle both Enter and Space.

---

## [HIGH] — No focus-visible style exists anywhere on the site — keyboard navigation is invisible

**Category**: Focus States  
**WCAG Criterion**: 2.4.7 Focus Visible (AA); 2.4.11 Focus Appearance (AAA in WCAG 2.2)  
**Locations**: Global — `src/assets/main.css` (no `:focus`, `:focus-visible`, or `ring` utility anywhere), no `focus:` Tailwind classes in any `.vue` file

**Current code (main.css — the entire file contains)**:
```css
/* Zero focus rules. No :focus, :focus-visible, ring-*, or outline-* declarations. */
```

**Impact**: Tailwind v4 (via `@import 'tailwindcss'`) includes a preflight that resets browser default outlines on buttons, links, and inputs. Without any replacement focus indicator, keyboard-only users and switch-access users get zero visual feedback about which element is focused. Every interactive element on the page is invisible during keyboard navigation. This affects: all nav links, both CTA buttons, the mobile menu trigger, the mobile close button, all tag filter buttons, all social links, all contact row links, all blog post cards, all blog prev/next nav links, and every `RouterLink`.

**Recommended fix**: Add a global `focus-visible` rule in `main.css`:
```css
:focus-visible {
  outline: 2px solid var(--burnt);
  outline-offset: 3px;
  border-radius: 4px;
}
```
Then audit any element that needs a tighter radius (pills, cards) and add element-specific `focus-visible` rules or Tailwind `focus-visible:ring-2 focus-visible:ring-[var(--burnt)]` classes.

---

## [HIGH] — Mobile menu overlay has no ARIA dialog semantics — screen readers can't navigate it correctly

**Category**: Semantic HTML / Accessibility  
**WCAG Criterion**: 4.1.2 Name, Role, Value; 2.1.2 No Keyboard Trap (inverse — focus is NOT trapped, which is the actual problem)  
**Location**: `src/components/layout/MobileMenu.vue:33–98`

**Current code**:
```html
<div
  v-if="open"
  class="fixed inset-0 z-40 md:hidden"
  @click.self="emit('close')"
>
  <!-- backdrop -->
  <div class="absolute inset-0" style="background: oklch(0 0 0 / 0.6)" />
  <!-- menu pill -->
  <div class="absolute top-20 left-1/2 flex min-w-[220px] ...">
    <button aria-label="Close menu" ...>
```

**Impact**: The overlay is a plain `<div>` — no `role="dialog"`, no `aria-modal="true"`, no `aria-label`/`aria-labelledby`. Screen readers do not know this is a modal; they can read behind the backdrop into the page content. Focus is not trapped: keyboard users can tab out of the menu into the obscured page below. When the menu opens, focus does not move to the menu. WCAG 2.1.2 says if a modal-like UI opens, focus must be contained and returned on close.

**Recommended fix**:
- Add `role="dialog"`, `aria-modal="true"`, `aria-label="Navigation menu"` to the inner menu pill `<div>`.
- On open, move focus to the first focusable item (the close button or first nav link) using `el.focus()` in a `watch` on `props.open`.
- Implement a focus trap (tab/shift-tab cycling within the dialog). Reka UI's `FocusTrap` primitive handles this cleanly without rolling it by hand.
- On close, return focus to the hamburger button that opened it.
- Add the hamburger's `aria-expanded` state: `:aria-expanded="mobileOpen.toString()"`.

---

## [HIGH] — `--text-4` used for icon-only social links in footer — contrast failure on interactive element

**Category**: Color Contrast / Interactive Elements  
**WCAG Criterion**: 1.4.11 Non-text Contrast (UI components must meet 3:1)  
**Location**: `src/components/layout/AppFooter.vue:27–30`

**Current code**:
```html
<a ... style="color: var(--text-4)" ...>
  <component :is="link.icon" :size="20" />
</a>
```

**Impact**: The GitHub, LinkedIn, and Mail icons at rest are rendered in `--text-4` (contrast ≈ 2.8:1 on `--bg-2`). WCAG 1.4.11 requires 3:1 for the visual indicator of UI components. The icons also have no visible focus indicator. On hover they switch to `--burnt` via inline JS mutation — but hover is not available on touch/keyboard.

**Recommended fix**: Set the default icon color to `--text-3` (≈5.1:1) or `--burnt` directly. Remove the inline `@mouseenter`/`@mouseleave` style mutation in favor of Tailwind `hover:text-[var(--burnt)]` so the class-based approach is friendly to CSS and screen-reader interaction modes.

---

## [HIGH] — Active tag filter button has no `aria-pressed` state

**Category**: Interactive Element State  
**WCAG Criterion**: 4.1.2 Name, Role, Value  
**Location**: `src/views/BlogView.vue:58–74`

**Current code**:
```html
<button
  v-for="tag in allTags"
  :key="tag"
  type="button"
  class="rounded-full px-3 py-1 ..."
  :style="{
    color: activeTag === tag ? 'var(--bg)' : 'var(--text-3)',
    background: activeTag === tag ? 'var(--burnt)' : 'transparent',
    ...
  }"
  @click="toggleTag(tag)"
>
  {{ tag }}
</button>
```

**Impact**: The active/inactive state of filter tags is conveyed only via color change. Screen readers have no programmatic way to know which tag is currently active. A user navigating by keyboard hears "button: architecture" with no indication it is currently selected/pressed.

**Recommended fix**: Add `:aria-pressed="activeTag === tag"` to each tag button. Screen readers then announce "architecture, toggle button, pressed" vs "…not pressed".

---

## [HIGH] — `<a role="button">` in hero "github" chip — same semantic conflict as nav

**Category**: Semantic HTML / Interactive Elements  
**WCAG Criterion**: 4.1.2 Name, Role, Value  
**Location**: `src/components/hero/HeroSection.vue:147–167`

**Current code**:
```html
<a
  :href="siteConfig.github"
  target="_blank"
  rel="noopener noreferrer"
  class="inline-flex items-center"
  ...
  @mouseenter="githubHover = true"
  @mouseleave="githubHover = false"
>↗ github</a>
```

**Impact**: This instance is actually a proper `<a href>` link — which is correct. However, the link text is "↗ github" with no aria-label indicating it opens in a new tab. WCAG 2.4.4 (Link Purpose) and 3.2.2 (On Input) flag new-tab links that don't warn users. Screen readers that announce link text without context will hear "↗ github" — the arrow glyph will be read literally by some readers ("northeast arrow github").

**Recommended fix**: Add `aria-label="GitHub profile, opens in new tab"` so the arrow glyph doesn't pollute the accessible name. The same pattern applies to every `↗ live`, `↗ repo`, `↗ npm`, and `↗ github` link in SystemsSection.vue and ContactSection.vue.

---

## [MEDIUM] — `<canvas>` in NeuronCanvas has no accessible alternative

**Category**: Images / Non-text Content  
**WCAG Criterion**: 1.1.1 Non-text Content  
**Location**: `src/components/hero/NeuronCanvas.vue:469–481`

**Current code**:
```html
<div class="pointer-events-none absolute inset-0 z-0" ...>
  <canvas ref="canvasRef" style="display: block; width: 100%; height: 100%" />
</div>
```

**Impact**: The `<canvas>` element has no fallback content, no `aria-label`, and no `role`. For purely decorative animation this is acceptable if `aria-hidden="true"` is declared — but it is currently missing. Some screen readers will announce "canvas" as a focusable landmark. The wrapping `<div>` also lacks `aria-hidden`.

**Recommended fix**: Since the canvas is purely decorative, add `aria-hidden="true"` to the wrapping `<div>`. The canvas element itself needs no additional attributes once the wrapper is hidden.

---

## [MEDIUM] — `<a>` tag-filter links in BlogPostHeader use query-string navigation but BlogView reads `ref` state — filter won't apply

**Category**: Navigation / UX Friction  
**WCAG Criterion**: 3.2.4 Consistent Identification  
**Location**: `src/components/blog/BlogPostHeader.vue:59–73`

**Current code**:
```html
<RouterLink
  v-for="tag in post.frontmatter.tags"
  :key="tag"
  :to="`/blog?tag=${tag}`"
  ...
>{{ tag }}</RouterLink>
```

**Impact**: Clicking a tag on a blog post routes to `/blog?tag=architecture`. But `BlogView.vue` uses `const activeTag = ref<string | null>(null)` and never reads `useRoute().query`. The query param is silently ignored — users land on the blog page with no filter applied, wondering why all posts are showing. This is a broken interaction.

**Recommended fix**: In `BlogView.vue`, initialize `activeTag` from the route query: `const activeTag = ref<string | null>((route.query.tag as string) ?? null)`. Also watch for query changes in case the user navigates between tags.

---

## [MEDIUM] — `eyebrow` class text is 11px — below WCAG recommended minimum for non-decorative text

**Category**: Color Contrast / Typography  
**WCAG Criterion**: 1.4.3 Contrast (Minimum) — size threshold  
**Location**: `src/assets/main.css:154–163` (global `.eyebrow`); used in every section

**Current code**:
```css
.eyebrow {
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--text-3);
}
```

**Impact**: 11px uppercase text using `--text-3` is rendered at a size below WCAG's 18px threshold for "large text," and the uppercase-with-letter-spacing rendering style does not substitute for physical size. At 11px, `--text-3` on `--bg` (≈5.1:1) barely passes AA for normal text — but on `--card` (≈4.1:1) it fails. The eyebrow is used as a semantic section label — it is not decorative.

**Recommended fix**: Raise eyebrow font-size to at minimum 12px (preferably 13px). This is a single-line change in main.css and affects every section simultaneously. Alternatively, pair the size raise with `--text-2` for eyebrow color on card surfaces.

---

## [MEDIUM] — Blog post article content rendered via `<component :is="post.component" />` from markdown — heading levels inside posts are uncontrolled

**Category**: Heading Order  
**WCAG Criterion**: 1.3.1 Info and Relationships  
**Location**: `src/views/BlogPostView.vue:52–56`

**Current code**:
```html
<article class="prose ...">
  <component :is="post.component" />
</article>
```

**Impact**: Markdown authors can start a post with `##` (h2) after the `<BlogPostHeader>` already emits an `<h1>`. If a markdown post uses `#` headings, a second `h1` appears on the page — violating the single-h1 rule. If posts skip from h2 to h4, WCAG 1.3.1 is violated. There is no enforcement layer.

**Current heading structure on a blog post page**:
- `h1` from BlogPostHeader (post title)
- `h?` unpredictable from markdown content

**Recommended fix**: Document a convention that blog posts must start headings at `##` (h2). Consider a Vite/markdown-it plugin or rehype transform that enforces or remaps heading levels so that markdown `#` becomes `h2` in the rendered output, preventing inadvertent duplicate h1s.

---

## [LOW] — `<main>` element exists in App.vue but has no `id` — skip-to-content link is missing

**Category**: Keyboard Navigation / Landmark  
**WCAG Criterion**: 2.4.1 Bypass Blocks  
**Location**: `src/App.vue:9`

**Current code**:
```html
<main class="pt-20">
  <RouterView />
</main>
```

**Impact**: The `<main>` landmark exists, which is good. However, there is no skip-navigation link at the top of the page. Keyboard users must tab through every nav item (wordmark button, 4 nav links, CTA) before reaching main content on every page load and every route change. WCAG 2.4.1 requires a mechanism to bypass repeated navigation blocks.

**Recommended fix**: Add `id="main-content"` to `<main>`. Add a visually-hidden skip link as the very first focusable element in the DOM:
```html
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 ...">
  Skip to main content
</a>
```

---

## [LOW] — `<footer>` lacks `role="contentinfo"` as a belt-and-suspenders for older AT

**Category**: Semantic HTML / Landmarks  
**WCAG Criterion**: 1.3.6 Identify Purpose (WCAG 2.1 AA+)  
**Location**: `src/components/layout/AppFooter.vue:13`

**Current code**:
```html
<footer class="border-t py-8" style="...">
```

**Impact**: Modern browsers and ATs correctly map `<footer>` to the contentinfo landmark. Older assistive technology (JAWS <18, NVDA <2019, older iOS VoiceOver) may not. Adding an explicit `role="contentinfo"` is a one-attribute belt-and-suspenders fix with no downside.

**Recommended fix**: `<footer role="contentinfo" class="border-t py-8" ...>`. Similarly, add `role="navigation"` to `<nav>` in AppNav.vue and BlogPostNav.vue (the `<nav>` element in BlogPostNav.vue doesn't have an `aria-label` to distinguish it from AppNav's `<nav>`, which violates WCAG 2.4.6 when multiple `<nav>` landmarks exist on a page).

---

# Part 2: Opportunity Analysis

---

## [HIGH OPPORTUNITY] — No skip-navigation + no route-change focus management

**Category**: Missing Interaction / Workflow Gap  
**Relevant Area**: `src/App.vue`, `src/components/layout/AppNav.vue`  
**User Story**: As a keyboard user, I expect that after navigating to a new route, focus moves to a logical starting point (page heading or main content), not back to the browser chrome.

**What's Missing**: Vue Router does not automatically manage focus on route changes. After navigating from `/` to `/blog` or to a blog post, focus stays wherever it was — often on the link that triggered navigation, which is now in a different context. Screen reader users hear the old page context, not the new one.

**What Users Probably Do Instead**: Re-read the entire page from the top using their screen reader's virtual cursor — a frustrating workaround that defeats the purpose of SPA navigation.

**Suggested Approach**: In `App.vue`, add a `router.afterEach()` hook that moves focus to a `<h1>` ref or the `#main-content` anchor after each navigation. Alternatively, use a Vue Router scroll-behavior hook combined with a `focus()` call on the main content region.

**Effort Estimate**: Small  
**Impact**: Required for WCAG 2.4.3 (Focus Order) compliance during SPA navigation. Without it the site is technically non-compliant on every page transition for keyboard/AT users.

---

## [HIGH OPPORTUNITY] — Tag filter on BlogView is not reflected in URL — filter state is lost on refresh/share

**Category**: Workflow Gap / Missing Feedback  
**Relevant Area**: `src/views/BlogView.vue`  
**User Story**: As a reader who filtered posts by "architecture" and wants to share that view, I expect the URL to reflect the active filter so I can copy it.

**What's Missing**: `activeTag` is local `ref` state only. Filtering posts does not update the URL. The back button cannot restore a filtered state. The tag links from `BlogPostHeader.vue` navigate to `/blog?tag=X` but `BlogView.vue` ignores the query param (confirmed broken interaction already flagged as Medium friction finding above — this is the opportunity angle).

**What Users Probably Do Instead**: They can't share filtered views. They navigate to the blog, re-apply their filter manually.

**Suggested Approach**: Use `router.replace({ query: { tag: activeTag.value ?? undefined } })` when the tag changes. Initialize `activeTag` from `route.query.tag` on mount. This syncs the BlogPostHeader tag links with the actual filter behavior (fixing the Medium friction issue simultaneously).

**Effort Estimate**: Small  
**Impact**: Shareable filtered views, working tag links from post pages, and browser history support for filters — three wins from one reactive binding change.

---

## [MEDIUM OPPORTUNITY] — Code snippets in SystemsSection have no copy-to-clipboard action

**Category**: Missing Interaction  
**Relevant Area**: `src/components/projects/CodeSnippet.vue`  
**User Story**: As a developer reading the portfolio, I expect to be able to copy a code snippet with one click — this is the baseline expectation for any syntax-highlighted code block on a technical site.

**What's Missing**: `CodeSnippet.vue` renders Shiki-highlighted HTML but provides no copy button. The label eyebrow and the code block are the only content.

**What Users Probably Do Instead**: Select text manually and copy — which is unreliable in `pre` blocks with line numbers and gradient backgrounds.

**Suggested Approach**: Overlay a "copy" button (absolute-positioned top-right of the code block) that calls `navigator.clipboard.writeText(props.code)`. Show a brief "Copied!" confirmation (1.5s) via a local `ref`. This is a common pattern that Shiki-based sites are expected to include.

**Effort Estimate**: Small  
**Impact**: Developer portfolios are evaluated by developers. A missing copy button on code snippets signals the site was not built with that audience in mind.

---

## [MEDIUM OPPORTUNITY] — No `<meta name="theme-color">` and no PWA manifest — mobile browser chrome is default white

**Category**: Info Architecture / Missing Feature  
**Relevant Area**: `index.html`  
**User Story**: As a mobile user who added the site to their home screen, I expect the browser chrome and splash screen to match the site's dark aesthetic.

**What's Missing**: `index.html` has no `<meta name="theme-color">`, no `<link rel="manifest">`, no apple-touch-icon. The mobile browser address bar will render in the OS default color (white/grey) against a near-black site, creating a jarring mismatch.

**Suggested Approach**: Add `<meta name="theme-color" content="#22201a">` (approximate sRGB of `--bg`) and optionally a minimal `manifest.json` with icons and `"display": "browser"`. No service worker required.

**Effort Estimate**: Small  
**Impact**: Visual polish on mobile. The site is a personal portfolio — first impressions on mobile matter.

---

## [LOW OPPORTUNITY] — Contact section "Resume" link is a dead `href="#"` placeholder

**Category**: Workflow Gap  
**Relevant Area**: `src/components/contact/ContactSection.vue:27–30`  
**User Story**: As a hiring manager who clicked "Resume → Download PDF", I expect to get a PDF, not a no-op anchor that scrolls to the top of the page.

**What's Missing**: The Resume row in the contact card points to `href="#"`. This is a live site and a portfolio — a broken resume link directly undermines the conversion goal of the contact section.

**Current code**:
```typescript
{
  icon: FileText,
  label: 'Resume',
  href: '#',
  text: 'Download PDF',
},
```

**What Users Probably Do Instead**: They notice the link does nothing, question whether the portfolio is maintained, and move on.

**Suggested Approach**: Either link to a hosted PDF (`/resume.pdf` in the public dir) or hide the resume row until a resume is available. A placeholder `href="#"` on a live portfolio is worse than a missing row.

**Effort Estimate**: Small (requires a PDF asset or removing the row)  
**Impact**: Direct hit to the primary conversion goal of the site.

---

# Summary Table

| Dimension | # Issues | Worst Severity |
|---|---|---|
| Color contrast (`--text-4`) | 1 (affects 9+ locations) | Critical |
| Color contrast (`--text-3` on card) | 1 (affects 5+ locations) | Critical |
| Focus states (no focus-visible anywhere) | 1 (affects all interactives) | High |
| Semantic HTML / `<a role="button">` | 4 locations (nav + mobile x2) | Critical |
| Mobile menu dialog semantics | 1 | High |
| ARIA states (aria-pressed, aria-expanded) | 2 missing | High |
| Heading order (blog post markdown) | 1 | Medium |
| Canvas / non-text content | 1 | Medium |
| Broken tag filter navigation | 1 | Medium |
| Eyebrow font size | 1 | Medium |
| Skip navigation link | 1 | Low |
| Footer/nav landmark roles | 1 | Low |
| New-tab link accessible names | Multiple (↗ links) | High |
| Dead resume link | 1 | Low (opportunity) |

## Opportunities
| Category | # | Priority |
|---|---|---|
| SPA route focus management | 1 | High |
| Tag filter URL sync (+ fixes broken nav) | 1 | High |
| Copy-to-clipboard on code snippets | 1 | Medium |
| Theme-color / mobile meta | 1 | Medium |
| Resume link / dead href | 1 | Low |

---

## Priority

### Fix Now (Blocking or Critically Degrading)
1. `--text-4` contrast failures — affects every metadata text element site-wide
2. `--text-3` on card contrast failures — affects all body/description text in cards
3. `<a role="button">` → replace with `<button>` throughout nav and mobile menu
4. Add global `:focus-visible` rule — keyboard users currently get zero focus indicator

### Fix Soon (Substantial Friction)
5. Mobile menu: `role="dialog"`, `aria-modal`, focus trap, `aria-expanded` on hamburger
6. Tag filter buttons: add `aria-pressed`
7. `↗` link text: add `aria-label` with "opens in new tab" on all external links
8. Footer icon colors: raise from `--text-4` to `--text-3` minimum
9. Tag filter state: sync with URL query params (fixes broken BlogPostHeader tag links simultaneously)
10. SPA route navigation: add focus management in `router.afterEach`

### High-Value Opportunities
11. Code snippet copy button — expected by developer audience
12. Mobile theme-color meta

### Backlog (Polish)
13. Skip-to-content link
14. Footer/nav explicit landmark roles
15. Blog markdown heading convention doc / enforcement
16. Resume link — either host a PDF or remove the row
17. `aria-hidden` on decorative NeuronCanvas wrapper

---

## What's Working Well

- **Wordmark SVG**: Correctly uses `role="img"` + `aria-label="Cheddar"` — the right pattern for decorative-but-meaningful SVG logos.
- **Footer social links**: `aria-label` is set on every icon-only anchor (GitHub, LinkedIn, Mail) — the pattern is right even if the color contrast of the icon itself needs a bump.
- **Mobile hamburger and close buttons**: Both have explicit `aria-label` and use semantic `<button type="button">` — correct.
- **`prefers-reduced-motion`**: Both `NeuronCanvas.vue` and `HeroSection.vue` respect the OS reduced-motion preference and disable or skip animations. This is exemplary.
- **`<main>` landmark**: Present in `App.vue` — just needs an `id` and a skip link to complete the pattern.
- **`rel="noopener noreferrer"`**: Consistently applied to all external `target="_blank"` links throughout the codebase.
- **No `v-html` on user content**: The only `v-html` usage is in `CodeSnippet.vue` on Shiki-generated HTML — static, sanitized at build time, not a runtime XSS vector.
- **Semantic sectioning**: `<section>`, `<article>`, `<nav>`, `<footer>`, `<header>` are all used correctly and in the right places — good structural foundation to build ARIA landmarks on top of.
