# UX Analysis

**Date**: 2026-06-03 (post-overhaul; the pre-overhaul Jun-2 run is archived as `ux-2026-06-02-preoverhaul.md`). Personal portfolio targeting recruiters + founders. 14 friction issues, 12 opportunities.

## Friction

### CRITICAL
- **No active-section nav indicator** (`AppNav.vue:15-20`, `scroll.ts`). Nav links have hover but no "you are here" state — on a long one-pager the nav reads as decorative. **Fix**: `IntersectionObserver` → `activeSection` ref; compare `link.id === activeSection`; extend AppButton `nav` variant `activeStyle` (currently `{}`) to color active link `var(--burnt)`.

### HIGH
- **"open a thread" CTA** (`HeroSection.vue:214-219`) — opaque for a skimming recruiter. → "let's talk ↗" / "get in touch", or add a `↳ contact` hint.
- **No copy-email button** (`ContactSection.vue:66-133`) — mailto only; whole row is the link so the address isn't independently copyable. **Fix**: trailing `Copy` (lucide) button → `navigator.clipboard.writeText(siteConfig.email)`, swap to checkmark 1.5s.
- **Principles grid borders break at tablet** (`PrinciplesSection.vue:41-43`) — hardcoded 3-col math (`i % 3`, `i < 3`) produces an incoherent border pattern at the `md` 2-col breakpoint. **Fix**: `nth-child` / `divide-x divide-y` responsive utilities, drop the JS math.
- **`useDecoder` no `prefers-reduced-motion` guard** (`useDecoder.ts:8-43`) — callsign scramble runs for reduced-motion users though metrics stagger respects it. Inconsistent + WCAG 2.3.3. **Fix**: check `matchMedia` at top of `onMounted`, set `output.value = final` immediately if reduced.

### MEDIUM
- **Mobile menu has no resume link** (`MobileMenu.vue:64-85`) — add a `resume ↗` `<a download>` between divider and "hire ↗".
- **Blog card tags non-interactive** (`BlogPostCard.vue:63-77`) — `<span>`s, while `BlogPostHeader` tags are filter links. → `RouterLink` to `/blog?tag=`, `@click.stop` (card is itself a link).
- **Live clock is anti-signal** (`HeroSection.vue:18-24,136`) — per-second update in prime hero real estate for zero info value; reads gimmicky to an eng audience. → replace with an availability badge (`◉ open to work`) or static build-date. (Also perf P7 + content-hierarchy.)
- **`scrollToSection` uses `offsetTop`** (`scroll.ts:24`) — sections are `position: relative` so `offsetTop` is ancestor-relative, not document; can land off (the `NAV_SCROLL_GAP=12` masks it). **Fix**: `getBoundingClientRect().top + window.scrollY - navBarHeight() - NAV_SCROLL_GAP`. *(Browser-tested as landing correctly today; rect form is strictly more correct — verify the ancestor chain.)*
- **No-link secondary project cards are dead ends** (`SystemsSection.vue:257-289`) — `error-decoder` renders no buttons; add a micro-CTA ("see featured work ↓") or make the `archived` reason prominent.

### LOW
- **AppButton hover via JS `hovered` ref** (`AppButton.vue:65,213-215`) — sticky-hover on touch (mouseleave doesn't fire on tap-away), all 5 variants. → CSS `:hover` (preserve hover<accent<active via specificity/vars).
- **Footer raw DOM hover mutation** (`AppFooter.vue:28-30`) — `$event.currentTarget.style.color = ...`; same touch bug + bypasses reactivity. → Tailwind `hover:text-[var(--burnt)]`.
- **BlogPostNav "Previous/Next" temporal direction** (`BlogPostNav.vue:45-55,79-87`) — posts sort newest-first, so `currentIndex-1` is *newer*; "Previous" may = newer. Audit + relabel "Newer/Older" or fix index logic.

## Opportunities

### HIGH
- **Availability signal above the fold** — the `↳ open to` line (`HeroSection:226`) is dimmest-palette 12px and easily missed; elevate to a badge (reuse the green dot already in the callsign pill). Answers the recruiter's first question.
- **Copy-link / share on blog posts** (`BlogPostHeader.vue`) — add `Link` (lucide) → `navigator.clipboard.writeText(location.href)` / `navigator.share` on mobile.
- **Project `since`/`lastUpdated` field** (`project.ts`, featured cards) — status badges ("training") have no temporal context; `training · since Jan 2026` signals shipping cadence (key for contract evaluators).
- **Blog index empty-state upgrade** (`BlogView.vue:110-122`) — current "No posts found" is bare; show the tag, total count, and 2-3 other tag chips (tag-URL arrivals are high-intent).
- **Blog → portfolio path** (`BlogPostHeader.vue:21-28`) — only "back to blog" exists; add `view full profile ↗` / a who-wrote-this byline card → converts organic blog traffic into hire-funnel views.

### MEDIUM
- **Code-snippet tabs** (`SystemsSection.vue:198-207`) — `trading-v3` has a **second snippet** (`snippets[1]`, the SQL window query) that's silently discarded; render `p.snippets` as tabs by `label`.
- **`aria-hidden="true"` on NeuronCanvas wrapper** (`NeuronCanvas.vue:468-481`) — decorative canvas leaks into the a11y tree (`pointer-events-none` is visual only).
- **Leadership timeline → VPM link** (`leadership.ts`) — `vpm-solutions` has `liveUrl` in `projects.ts` but the timeline entry is static text; cross-link for recruiter verification.
- **Principles cross-links** (`PrinciplesSection.vue:36-70`) — principles 03/05 reference trading-v3/Tessa with no path there; barely-perceptible hover. Add `→ see in systems` on hover or at least a `--burnt` border.
- **Reading-progress bar on posts** (`BlogPostView.vue`) — thin fixed bar (`useReadingProgress` composable, respect reduced-motion).

### LOW
- **Stack chips → systems cross-link** (`LeadershipSection.vue:103-134`).
- **`aria-pressed` on AppButton chip active state** (WCAG 4.1.2); `aria-current` on the active nav link once that ships.

## Working well (preserve)
reduced-motion handling for metrics; `goTo` off-route nextTick+rAF; Reka Dialog mobile menu (focus trap/ARIA free); global `:focus-visible`; Shiki WCAG contrast override; resume `download` attr; tag filter with URL sync + `normalizeTag` guard; AppButton merge-order comment.
