# cheddar-site-overhaul Phase 4 Deviations — captured 2026-06-03T18:49

BASE: 117fe42 (end of Phase 3). a11y + OG + reka dialog + favicon + (critical) index.html honesty leftover.
D_count: 2 distinct judges.

## Approach Deviations (executor)
- **Shiki CSS override** (vs plan's "prefer theme swap"): justified — theme swap changes the code-block bg (breaks visual consistency); CSS override targeting the comment-token color is surgical. #6A737D→#9da5b4 (6.14:1). Coordinator axe-verified 0 violations on / and /blog/hello-world.
- **Reka dialog close path** in MobileMenu: round-1 removed the X (relied on Escape + overlay-tap), which judge J1 BLOCKed — mobile has no Esc and reka's overlay `pointerdown.prevent` swallows the synthetic touch→click, so backdrop-tap was unreliable. Round-2 restored a reka `<DialogClose>` X button (real `<button>` click handler, input-agnostic) and made the AppNav hamburger a toggle. Judge J1 round-2: PASS.

## Scope Deviations (executor)
- AppNav.vue: 3-line MobileMenu binding update (:open/@close → v-model:open) — mechanical consequence of the reka refactor.
- cspell.json: reka/dialog allowlist words.

## Coordinator changes (Phase 4)
- OG image rendered (Playwright, 1200x630, 178KB) → public/assets/og-default.png (serves 200).
- **CRITICAL honesty fix**: index.html static <title> + meta description had live banned claims (stay profitable / pays its own bills) + old "Engineering Lead" — Phase 1's src/-only grep MISSED repo-root index.html. Fixed → Principal-Engineer + accurate copy. Repo-wide grep now clean. siteConfig.ts:4 title (stale, unused) → Principal Engineer & Architect.
- MobileMenu: added VisuallyHidden DialogDescription (fix executor's dangling aria-describedby → console warning gone; ARIA refs now resolve). Coordinator browser-verified focus-trap + aria.
- favicon: old-brand public/favicon.ico DELETED (unlinked but auto-serves on /favicon.ico); SVG favicon (/cheddar-logo.svg) linked.

## Flagged to Patrick (not auto-fixed)
- leadership.ts timeline 2026: "Engineering Lead" / "CTO-track engagements" — positioning-consistency (his career framing, not a false claim); his call.

## Resolved spawn list
### Deviation #1 — reka dialog close/a11y (X-removal + mobile close UX + aria)
- type: approach
- judge identity hash: 9e2eb384c8b98a7a50c2c6cf9ba0ed1899cb1e1c
- diff hunks: src/components/layout/MobileMenu.vue, src/components/layout/AppNav.vue

### Deviation #2 — index.html/OG honesty (new static copy — any NEW unverified claim?)
- type: approach (coordinator honesty correction)
- judge identity hash: 99a663acfd543c96c3f7ebd1dbe0f6ffa8459e01
- diff hunks: index.html:8, index.html:17, public/assets/og-default.png
