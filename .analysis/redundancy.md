# Redundancy Analysis (DRY)

**Date**: 2026-06-03 · Scope: `src/` (21 components, 4 composables, 5 data files, 2 types, 1 util, 1 CSS). 7 patterns, ~160 LOC consolidatable.

## CRITICAL

### R1 — Section `<h2>` heading block (6×)
`PrinciplesSection.vue:17-27`, `ContactSection.vue:44-55`, `LeadershipSection.vue:21-31`, `WritingSection.vue:21-31`, `SystemsSection.vue:70-80`, `BlogView.vue:66-77`.
Every section duplicates a 9-line inline style: `font-family: var(--font-display); font-weight: 800; font-size: clamp(32px,4vw,56px); letter-spacing: -0.03em; line-height: 1.05; color: var(--text); margin: 0 0 [16|64]px`. Only the bottom margin varies.
**Fix**: `.section-heading` class in `main.css` (margin stays as a per-site override). `<h2 class="section-heading" style="margin-bottom: 64px">`. **~45 LOC.**

### R2 — Mono label row (5×)
`ContactSection.vue:92-100`, `BlogPostNav.vue:39-47`, `LeadershipSection.vue:66-73`, `WritingSection.vue:63-70`, `SystemsSection.vue:98-103`.
Identical 4-5 prop block: `font-family: var(--font-mono); font-size: 11px; color: var(--text-4); text-transform: uppercase; letter-spacing: 0.08–0.18em`. The `.eyebrow` class is unusable here (it adds a `::before` rule-line).
**Fix**: `.mono-label` class. **~25 LOC.**

## HIGH

### R3 — Tech/tag display chip (4×, 3 raw)
`SystemsSection.vue:149-161`, `LeadershipSection.vue:122-135`, `BlogPostCard.vue:64-76` (raw `<span>`s), + `BlogPostHeader` (uses `AppButton variant="chip"` — interactive, keep). The three raw chips share `font-family: var(--font-mono); font-size: 11px; color: var(--text-3); background: var(--bg-3); border: 1px solid var(--line-soft)`.
**Fix**: `.chip` class for the display-only variant. **~20 LOC.**

### R4 — `formattedDate` computed (byte-identical, 3×)
`BlogPostCard.vue:9-16` and `BlogPostHeader.vue:9-16` are identical (`{year:'numeric',month:'long',day:'numeric'}`); `WritingSection.vue:70` inlines the short form (`{month:'short',year:'numeric'}`).
**Fix**: `src/utils/date.ts` → `dateUtils.long(date)` / `dateUtils.short(date)`. **~14 LOC, 1 new file.**

### R5 — Hover-border card pattern (3×)
`BlogPostCard.vue:26-35`, `BlogPostNav.vue:22-31`+`60-70` (two refs), `ContactSection.vue:66-82`. Each declares a `ref(false|null)` + `@mouseenter`/`@mouseleave` + a `:style` borderColor swap `var(--line)`→`var(--burnt)`.
**Fix**: `useHover()` composable returning `{ hovered, listeners }`; `v-bind="listeners"`. **~15 LOC.** Note: `ContactSection` tracks hover by label string (one shared ref) — needs per-item composables or keep its approach. (Touch-sticky-hover is a separate UX concern — see ux.md; CSS `:hover` may be the better fix for both.)

## MEDIUM

### R6 — Section wrapper `padding: 120px 0` (+ optional `bg-2`) (5×)
`ContactSection:38-40`, `PrinciplesSection:11-13`, `LeadershipSection:15-17` (all + `bg-2`), `WritingSection:13-15`, `SystemsSection:64-66` (no bg).
**Fix**: `.section-pad` / `.section-alt` classes. **~5 LOC + cleaner templates.** (documentation.md also flags the bare `120px` as an untokened magic number repeated across views.)

### R7 — Project business logic in display component
`SystemsSection.vue` holds `tagColors` (51-58) + `secondaryTag`/`secondaryRole` (14-25) — domain knowledge that belongs in `src/data/projects.ts` (or `src/utils/projects.ts`). Relocation, not duplication; relevant when a 2nd component needs project status colors.

## Already DRY (preserve)
`AppButton` (variant/size/accent/active/as), `useSeo`, `useBlogPosts`, `siteConfig`, `scrollToSection`, `.eyebrow` class, the strongly-typed data files.
