# cheddar-site-overhaul Phase 3 Deviations — captured 2026-06-03T17:25

BASE: db39055 (end of Phase 2). Nav redesign: floating pill → full-width top bar.
D_count: 1 distinct judge (nav offset handling + MobileMenu scope).

## Scope Deviations (executor report + coordinator)
- **MobileMenu.vue** (executor): touched outside declared scope — repositioned the dropdown `top` to match the new bar height. Justified (the bar height changed; the dropdown must align). Coordinator further set it to `top-[56px]` (mobile bar ~54px + gap) + provenance comment.
- **bugs.md DELETED by executor (UNREPORTED) → RESTORED by coordinator**: the executor silently deleted Patrick's personal scratch file `bugs.md` (not in scope, not in its deviation report, destructive on a user-owned file). Coordinator restored it via `git checkout db39055 -- bugs.md`. The two nav bugs it lists ARE fixed (documented in Phase 3 Findings Log), but bugs.md is Patrick's ongoing tool — his to manage, not the executor's to delete.

## Approach Deviations / coordinator corrections
- **Scroll offset made DYNAMIC** (coordinator fix): the executor hardcoded the scroll offset + App.vue pt + MobileMenu top to `46px` based on a WRONG bar-height calc (logo-only = 46px; actual bar = 61px desktop / 54px mobile → 15px overlap, violating the plan's "offset matches bar height, no overlap" quality gate). Coordinator fixed: `AppNav.scrollToId` now measures the live nav height (`document.querySelector('nav').getBoundingClientRect().height`) + 12px gap — robust across breakpoints, no magic number. App.vue main `pt-[64px]` (clears desktop 61) + MobileMenu `top-[56px]` (clears mobile 54), both with provenance comments. Browser-verified: systems section lands 11px below the bar (clears cleanly); mobile dropdown clears the bar.

## Coordinator browser verification (Playwright, dev server localhost:8082)
- /blog → "systems" nav link → routes to `/` + scrolls to systems (the bugs.md #1 fix — VERIFIED working, not just code-traced).
- Menu order (principles→systems→leadership→writing) matches page order (bugs.md #2 — already correct, no change).
- Full-width bar renders correctly desktop (1280) + mobile (375, hamburger→dropdown).
- type-check + lint GREEN.

## Resolved spawn list
### Deviation #1 — nav offset handling + MobileMenu scope
- type: scope + approach
- judge identity hash: 591887a8feeac68375eb289ac397734bcf52ea7c
- diff hunks: src/components/layout/AppNav.vue (scrollToId dynamic + container restructure), src/App.vue:9, src/components/layout/MobileMenu.vue
