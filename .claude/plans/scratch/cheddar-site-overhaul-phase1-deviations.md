# cheddar-site-overhaul Phase 1 Deviations — round 3 (post burn/cudarc + build-fix), captured 2026-06-03T13:13

D_count: 4 distinct judges. Round-2 BLOCKs resolved: build-breaker (projects.ts:122 apostrophe) fixed + verified GREEN; Tessa "2-3x throughput" dropped; burn→cudarc corrected (verified-false claim, Patrick-confirmed); repoUrl render + type-asymmetry documented as Phase-2 deferrals.

## Scope Deviations (current working-tree state)
- **project.ts**: `repoUrl: string | null` on `FeaturedProject` (Yinz URL = github.com/yinzers/yinz-lang). Featured-card render of repoUrl DEFERRED to Phase 2 (documented in Findings Log + Phase 2 Step 6).
- **metrics.ts:3**: `11 / production integrations` (judge#2 PASS r2, unchanged).
- **principles.ts:5**: structural reframe of reads-fast (clean r2).
- **projects.ts (Tessa)**: burn→cudarc — archNotes drops "2-3x throughput", keeps burn-replaced-by-custom-CUDA history; tech tag `burn`→`cudarc`; snippet replaced with real cudarc kernel-dispatch from tessa-ai/train/model/src/ops.rs (verified faithful: k_rope_forward_reshape field + rope_forward_reshape_kernel load are real); redundant 2nd RoPE snippet removed (Patrick).
- **projects.ts:122 (Yinz)**: apostrophe build-breaker fixed (reworded, no apostrophe).
- **leadership.ts:40**: ML/AI skill `burn`→`cudarc` (factual accuracy; out of literal scope).
- **SystemsSection.vue**: statusMap/tagColors/badge (clean r2, inline featured link stays removed).
- **HomeView/BlogView**: SEO meta. **cspell.json**: + cudarc.

## Approach Deviations
- **Tessa burn→cudarc** overrides plan Step 2 "burn stays" — verified-false (research swept tessa-ai: no burn dep, cudarc 0.19 + hand-written CUDA), Patrick-confirmed. Recorded in plan `## Design Divergences`.
- **project.ts type change** (repoUrl string|null on FeaturedProject) — plan said "no type change expected"; genuinely needed (judge#1 PASS r1).

## Resolved spawn list (round 3) — re-judge all 4 on corrected diff
- Deviation #1 (repoUrl): hunks src/types/project.ts:17, src/data/projects.ts:151
- Deviation #2 (metrics): hunks src/data/metrics.ts:3
- Deviation #3 (Tessa/principles claims): hunks src/data/projects.ts:8-44, src/data/principles.ts:5, src/data/leadership.ts:40
- Deviation #4 (SystemsSection): hunks src/components/systems/SystemsSection.vue
