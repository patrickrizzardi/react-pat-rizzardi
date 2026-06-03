# cheddar-site-overhaul Phase 2 Deviations — round 2 (post-fix), captured 2026-06-03T15:55

BASE: bbd4166. Round-1 BLOCKs resolved: judge#1 (text-variant escape hatch) → real `nav` variant + `block` prop; code-reviewer must-fix (type hole) → `in` guards restored; plan-adherence (3 silent deviations) → documented in plan Findings Log. PLUS proactive cleanup eliminating ALL remaining AppButton inline-style escape hatches (active/accent props, hire CTA, writing/blogpostheader/live-link). Zero inline style on any `<AppButton>` now. type-check + lint GREEN.

D_count: 2 distinct judges.

## Approach Deviations (current)
- **AppButton API extensions**: plan said variant primary|ghost|chip. Now: primary|ghost|chip|text|nav variants + block/active/accent props. All additive, each eliminates a real per-site inline-style escape hatch (nav links → nav+block; active filter chips → active; live-link emphasis → accent). Quality gate prefers extending variants over one-off overrides.
- **Step-7 guard correction**: plan said "simplify `in` guards to p.url"; that was defective for StandardProject-only fields (repoUrl/npmUrl) since `secondary` includes ExperienceProject. Restored `in` narrowing for those; liveUrl (both members) stays simplified.

## Documented coverage skips (plan-adherence verified justified)
- ContactSection.vue: composite link-rows (icon+label+value+arrow), not button CTAs — not refactored (judge#2 PASS r1).
- BlogPostNav.vue: `<RouterLink>` prev/next nav cards, not buttons — not refactored.

## Coordinator changes (Patrick-directed / approved)
- Step 4: --btn-radius 6px + solid-burnt primary (mockup-approved).
- Magnetic hero animation removed + useMagneticButton.ts deleted + consistent hover added (Patrick request).

## Resolved spawn list (round 2)
### Deviation #1 — AppButton API extensions
- type: approach
- judge identity hash: b0062f157cfec9c9b787f9b523cc6ae888072042
- diff hunks: src/components/ui/AppButton.vue (variants + block/active/accent props), call sites AppNav/MobileMenu/BlogView/WritingSection/BlogPostHeader/SystemsSection

### Deviation #2 — ContactSection skip (re-confirm, PASSed r1)
- type: scope (coverage)
- judge identity hash: d5d901e7051d0b17f5edc8b123f61e29dca5b66c
- diff hunks: src/components/contact/ContactSection.vue (not in diff — coverage skip)
