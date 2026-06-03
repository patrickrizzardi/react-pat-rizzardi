---
slug: cheddar-site-overhaul
type: execution
owner: Patrick
status: active
files:
  - src/data/projects.ts
  - src/components/**
  - src/views/**
  - src/assets/main.css
  - src/composables/useSeo.ts
  - public/**
created: 2026-06-02
last_updated: 2026-06-03
plan_base: 96e37aec7b97cf3288e321f8adbe80bb0fec9b6d
---

# Plan: Cheddar Site Overhaul (design system + content/SEO/honesty)

Created: 2026-06-02
Status: pending_approval

## Context & Why

`redact.digital` is Patrick's personal engineering brand site (Vue 3 + Tailwind 4, SSG, deploys to DO App Platform). The Cheddar rebrand (visual theme) is done and merge-ready on branch `cheddar-v1`. This plan is the next initiative on top of it. Four motivations, in priority order:

1. **Correctness/honesty (urgent).** Patrick's own `~/resume/job-hunt.md` flags: *"the redact.digital site still claims 'profitable for over a year' — FIX THE SITE."* Several live claims are now known-false or unverified against code-verified facts. A personal brand site that overstates is worse than one that understates — hiring leaders verify. This is the highest-priority slice.
2. **Design-system debt.** 19 buttons are hand-styled inline across 12 files with ZERO shared component (audited). Patrick wants (a) to move off the pill/rounded aesthetic and (b) a primary-CTA treatment that "feels good" — neither is doable cleanly today because there's no single place to change. The fix is a shared `<AppButton>` + radius tokens.
3. **Nav UX.** Patrick wants the floating centered rounded pill replaced with a conventional full-width top bar.
4. **Missing flagship + differentiators.** Yinz (a from-scratch LLVM compiler in Rust) is not on the site at all — arguably Patrick's strongest signal for a senior-eng audience. Plus real differentiators (OpenAI-in-production at VPM, 11 integrations) are absent.

**Brand narrative (Patrick's logo-AI session, 2026-06-02):**
> Cheddar = Value · Redaction = Removing Noise · **Leadership = Creating Alignment** · **Engineering = Creating Leverage**

Positioning + tagline fuel. Crucially it encodes BOTH sides — *leadership (alignment)* and *engineering (leverage)* — which is exactly why the site can serve both audiences under one banner.

**Audience (RESOLVED 2026-06-02 — serve BOTH):** Patrick was unsure full-time-leadership vs part-time-Gun.io-contracting and asked to serve both. It can — under the **Principal Engineer & Architect** umbrella. "Principal Engineer" reads credibly to BOTH a startup hiring a founding/principal engineer AND a contract client wanting a heavy hitter, because it's a senior *IC who leads* — NOT a "manager" (would scare off IC contract gigs) and NOT a junior IC (would undersell leadership). Body copy carries the dual signal: leadership (co-leads a team of 4, drives direction = *alignment*) + deep hands-on IC (builds compilers/LLMs solo = *leverage*). The Gun.io *profile* stays separately positioned as "Backend Engineer" per `job-hunt.md` — different funnel; the site is the higher-end umbrella both land on.

**Aesthetic direction (RESOLVED 2026-06-02 — personality-forward, NOT sterile):** Patrick's call, and I agree — for a startup/founder audience, *zero personality reads as hiding behind corporate beige*; "stick in the mud" is the wrong target. A logo-AI brief (GPT) pushed toward minimal/architectural/"avoid hacker aesthetics & animation," which over-corrects. The resolved line: **earned-confidence atmosphere YES, performative "look-at-my-trick" animation NO.**
- **KEEP** (ambient character, reads senior): NeuronCanvas + overlay (systems-thinking signal, not hacker), the `cheddar://patrick.rizzardi` signature, scan-grid texture, mono labels, warm palette.
- **No trims (RESOLVED 2026-06-02):** Patrick's call — the decoder scramble + live ET clock are subtle enough that they don't tip it toward junior; keep ALL current personality elements as-is. Full personality preserved — the overhaul touches content + component structure + nav, NOT the existing vibe/animations.
- **Logo — ASSET DONE 2026-06-03**: final mark at `public/cheddar-logo.svg` (sharp, transparent, 2.5 KB), wired into nav via `<img>` in `CheddarWordmark.vue`. Produced with **vtracer polygon mode** (`cargo install vtracer`; recipe in state.md) — the correct raster→vector tool; hand-drawn + hand-de-round attempts failed, so don't redo manually. Colors remapped to exact theme tokens (burnt-hi #f88a3d / burnt #e26b1b / ember #c33c00 / cheddar #feb51f), solid fills, shading tiers kept — DONE. Original PNG → `public/cheddar-logo.png`. **Remaining for Phase 4**: favicon swap (SVG favicon) + final placement/sizing within the redesigned nav (Phase 3). Name stays **Cheddar** (Cheddar = Value).
- **Palette**: GPT proposes violet-tinted backgrounds (`#1A1A26/#242432/#313144`) vs the current near-neutral cool gray; accents (`#C75A2F` burnt / `#E8BF61` gold) ≈ current. Decide via side-by-side mockup in Phase 2 (Q b's sibling).

**Success criteria:** every factual claim on the site is true and matches code-verified facts in `job-hunt.md`; Yinz featured; one shared button component drives all CTAs (radius + treatment are one-line changes); nav is a full-width top bar; SEO keywords woven; axe-clean; logo + favicon swapped when Patrick's new mark lands.

## Source-of-truth inputs
- `~/resume/job-hunt.md` — code-verified facts + honesty constraints (THE authority for claims).
- `~/resume/patrick-rizzardi-resume.{html,pdf}` — HTML is editable source (polish notes actionable + regeneratable via the documented `google-chrome --headless --print-to-pdf` command). **Out of scope for this plan** (site only) — noted for a possible follow-up.
- `~/resume/diagrams/{vpm,trading}-architecture.png` — candidate visuals for the systems section.
- `.analysis/ux.md`, `.analysis/resume-review.md` — prior audit reports.

## Research Findings
- **Reka UI** = `/unovue/reka-ui` (High reputation, v2). `<DialogRoot v-model:open>` + `DialogPortal/DialogOverlay/DialogContent` provide focus-trap, `aria-modal`, and Escape-close out of the box; `FocusScope :trapped` is the lower-level util. This is the project-standard fix for the mobile-menu dialog per `.claude/rules/vue-standards.md` ("Reka UI for interactive primitives… don't roll your own"). Adding it is a new dependency → gated on Patrick (Question d).
- **Tailwind 4 `@theme`** tokens already drive the palette in `src/assets/main.css` (`@theme { --color-*: … }` + mirrored `:root { --* }`). New radius tokens follow the SAME established pattern — no new mechanism.
- **OG meta** already wired via `useSeoMeta` in `src/composables/useSeo.ts:6` pointing at `/assets/og-default.png` — which does NOT exist (live 404 on every share). Fix = create the asset (no code change beyond confirming the path).
- **Existing project model** (`src/types/project.ts` via `src/data/projects.ts`): tiers are `featured | experience | standard`; featured cards support `archNotes` + `snippets[]`; standard cards support `repoUrl/npmUrl/liveUrl/extensionUrl`. Yinz slots in as a NEW `featured` entry — same shape as `tessa-ai`/`trading-v3`, no type change needed (executor confirms `src/types/project.ts` covers the fields used).
- **No `.claude/design-sources.md`** present → no `[locked]` design docs to gate against. De-facto design references: `.claude/plans/done/cheddar-rebrand.md` + `.claude/rules/vue-standards.md`. Proceeding without a locked-design gate.

## Confirmed honesty defects (current file:line → corrected)
| Location | Current (WRONG) | Correct (per job-hunt.md) |
|---|---|---|
| `projects.ts:65` | "has been profitable for over a year" | DROP. Reframe as "fault-tolerant automated trading system"; lead with architecture, not P&L |
| `projects.ts:65` | "exactly-once delivery" | "effectively-once (at-least-once + idempotent upserts)" |
| `projects.ts:65,68` | "300-500M … rows" / "500M rows" | "~100M+ rows" |
| `projects.ts:68` | "every query stays under 50ms" / "12-second query into a 40ms one" | DROP unless Patrick confirms real (Question e) — job-hunt.md: "NOT verifiable in code" |
| `projects.ts:66` | tech: "Redis Streams" | DragonflyDB (Redis Streams + Pub/Sub) — snippet already calls `dragonfly.*` |
| `projects.ts:9` | Tessa "a LLaMA-style architecture" + "inference, built from the ground up" | Three architectures (LLaMA-style / RWKV-7 / hybrid); base training in-progress, inference planned — do NOT imply a finished model |
| `projects.ts:125` | "88 models and 282 controllers" | "100+ models / 190+ controllers" |
| `projects.ts:128` | "AWS cost reduction" | "re-architected AWS for redundancy, cost-controlled" (NOT cost-reduction, NOT from-scratch) |
| `projects.ts:120` | "joined early and grew into co-lead" | OK to keep, but can sharpen: "sole backend/DB/infra engineer from the start; now co-lead of a team of 4" |
| `HeroSection` headline/subhead | "systems that **stay profitable**" + "a trading platform that **pays its own bills**" | Remove the trading-profit implication; "stay profitable at scale" is defensible for VPM ($2M/mo) but must not be anchored to the trading platform |

## Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Ship another false/overstated claim while "fixing" claims | Med | High (credibility — the whole point) | Every claim traced to `job-hunt.md`; Patrick reviews Phase 1 copy before commit; when in doubt, understate |
| Button refactor visually regresses one of 19 sites | Med | Med | `<AppButton>` is a pure refactor (same rendered output first, THEN restyle); screenshot each touch-point on home + /blog before commit |
| Nav redesign breaks mobile/responsive or the route-aware scroll | Med | Med | Verify at 375/768/1280 widths in browser; the route-aware `goTo` logic already works — reuse it, don't rewrite |
| Adding reka-ui bloats bundle / new dep churn | Low | Low | One small tree-shakeable lib; gated on Patrick (Q d). If declined, keep current semantic dialog |
| Radius/CTA aesthetic picked blind, Patrick dislikes again | Med | Low | Decide via side-by-side screenshots in-phase, Patrick picks by eye (no blind guessing) — this already burned us twice |
| Logo dependency (external AI) blocks the nav phase | Low | Low | Nav ships with a placeholder/text logo slot; logo + favicon swap is a tiny separate step when the asset lands |
| Featuring resume diagram PNGs looks off / heavy | Low | Low | Optional — evaluate in Phase 1; drop if it doesn't elevate the section |

## Questions (need Patrick before/at execution)
- **(a) Heading / positioning — RESOLVED 2026-06-02:** Serve BOTH audiences under the **Principal Engineer & Architect** umbrella (Patrick: "tailor to both… I assume the leadership stuff suits both better"). Contact heading → **"Looking for a Principal Engineer?"**; hero subhead → Principal-Engineer-&-Architect framing; the `available · CTO + Eng Lead` label → an "open to" line spanning principal/staff + founding-engineer + high-leverage contract. Leadership-leaning but IC-credible so it keeps contract appeal. (Remaining nuance for Patrick: is a tagline from the 4-line narrative wanted — see Question f.)
- **(b) Radius direction** — square (`0`) or softened (`~6px`)? Decided via mockup in Phase 2. *My lean: 6px (clearly not pills, still modern, less harsh than hard 0).*
- **(c) Primary-CTA treatment** — pick from 2–3 rendered options in Phase 2 (solid burnt / flat fill no-glow / outline-only).
- **(d) reka-ui dependency** — approve adding `reka-ui` for a proper mobile-menu dialog (focus-trap)? If no, keep the current semantic + Esc + focus-on-open and close the a11y item as "good enough, documented."
- **(e) Trading latency — RESOLVED 2026-06-02: DROP the numbers.** Not replaced with a vaguer-but-still-unverified figure ("12s → <50ms" is the same unverifiable claim, just blurrier). Keep the TRUE, demonstrable architecture story instead (monthly range-partitioning + window functions for fast time-range reads — the real SQL snippet stays). Re-add a concrete latency only if Patrick produces a real benchmark to cite.
- **(f) Brand tagline** — weave the "Value · Less noise · More leverage" narrative into the hero/contact as a tagline? (optional)

## Risk Assessment & Rollout Strategy

**Risk level: LOW.** Static marketing/portfolio site — no backend, no auth, no DB writes, no payments, no third-party runtime integrations, no user input. Most of the standard security/idempotency/rollout checklist is **N/A** (noted explicitly in the Quality Checklist).

| Criteria | Applies? | Notes |
|---|---|---|
| Touches payments/billing | No | static site |
| Touches auth/permissions | No | none |
| Raw SQL / literals | No | no DB |
| Modifies existing data | No | static |
| Third-party integration (runtime) | No | content only |
| Changes existing endpoints | No | no server |

**Mitigations applied:** content traced to single source of truth (job-hunt.md); per-phase browser/axe verification; button refactor is render-preserving before restyle.

**Rollout:** no feature flags / staged rollout (static site, single deploy). Work commits to `cheddar-v1`; Patrick merges `cheddar-v1 → main` (single DO App Platform deploy) when the overhaul is complete. The honesty fixes (Phase 1) should land first so the truthful site is what merges even if later phases slip.

## Design Divergences

| Doc | What it says | What we do instead | Approved rationale (named cost + reversal path) |
|-----|-------------|-------------------|------------------------------------------------|
| This plan, Phase 1 Step 2 | "keep CUDA kernels + corpus; **`burn` stays**" | Replaced all `burn` refs → `cudarc`; archNotes keeps burn only as *history* (custom CUDA replaced it after outperforming) | Step 2 was written on stale info. Research-agent swept `tessa-ai`: burn is NOT a dependency (real stack = `cudarc 0.19` + 9 hand-written `.cu` kernels); Patrick confirmed burn was benchmarked and removed. Cost: none — the corrected framing is MORE accurate and a stronger eng signal. Reversal: re-add `burn` only if the code re-adopts it. Approved by Patrick 2026-06-03. |

## Phase Execution Protocol

Each phase ends with an **Exit Sequence** (persist plan state → fan out reviewers + deviation-judges in parallel → coordinator writes Evidence + Phase Review Gates → handle verdicts → prompt commit). The canonical fan-out spec is `~/.claude/commands/execute-plan.md` Step 3.d–3.h. **Ships via:** commit to `cheddar-v1` (no per-phase PR — personal branch; Patrick merges branch → `main` at the end). Reviewer fan-out still runs at every phase boundary before commit.

---

## Phases

### Phase 1: Content truth + SEO + Yinz (HIGHEST PRIORITY)
**Scope**: Make every claim true, add the missing flagship + differentiators, weave SEO, set positioning. No design/layout changes.
**Branch/commit**: commit on `cheddar-v1` — `fix(content): honesty corrections + Yinz + SEO`
**Objective**: A reader (and Google) sees accurate, sharp, keyword-rich copy; nothing on the site contradicts `job-hunt.md`.
**Why this phase exists**: There is a live false claim ("profitable for over a year"). Ship truth first, independent of the design work.
**Current-state anchors**:
- `src/data/projects.ts:65,68` — trading-v3 false-profit + exactly-once + row-count + latency claims
- `src/data/projects.ts:9-12` — Tessa single-architecture / finished-model framing
- `src/data/projects.ts:125,128` — VPM model/controller counts + "AWS cost reduction"
- `src/data/projects.ts` (whole file) — no Yinz entry; tiers are `featured|experience|standard`
- `src/components/hero/HeroSection.vue:170-208` — headline "stay profitable" + subhead "trading platform that pays its own bills" + `available · CTO + Eng Lead` label (line ~274)
- `src/components/contact/ContactSection.vue:54` — "Hiring a founding CTO?" heading
- `src/composables/useSeo.ts` — per-page meta (title/description) source
- `src/types/project.ts` — Project shape (confirm Yinz fields fit)
**Files (expected scope)**: `src/data/projects.ts`, `src/components/hero/HeroSection.vue`, `src/components/contact/ContactSection.vue`, `src/composables/useSeo.ts`, possibly `src/components/systems/SystemsSection.vue` (if featuring a diagram), possibly `src/data/metrics.ts`.
**Steps**:
1. **Trading v3** (`projects.ts`): drop "profitable for over a year"; reframe lead as "fault-tolerant automated trading system, architecture-first." `exactly-once` → "effectively-once (at-least-once + idempotent upserts)". `300-500M`/`500M` → `~100M+`. Latency claim ("under 50ms", "12-second query into a 40ms one"): DROP unless Question (e) = keep. **Reconcile the DragonflyDB swap END-TO-END (reviewer Concern 2):** the description tech tag `'Redis Streams'` (`:66`), the snippet LABEL "Redis Streams Consumer" (`:71`), AND the `archNotes` prose (`:67-68`, which holds the 500M/12s/40ms strings) must all be corrected together — a half-swap leaves the page saying DragonflyDB in one spot and Redis Streams / 500M two lines down. Keep the (accurate) Kelly/backtest-fidelity angle if added.
2. **Tessa** (`projects.ts:9-12`): three architectures (LLaMA-style / RWKV-7 / hybrid); frame as in-progress (base training in progress, inference planned); keep CUDA kernels + 34GB/3.85B-token corpus; `burn` stays. Do not imply a shipped model.
3. **VPM** (`projects.ts:125,128`): "88 models and 282 controllers" → "100+ models / 190+ controllers"; "AWS cost reduction" → "re-architected AWS for redundancy, cost-controlled"; optionally sharpen the intro to "sole backend/DB/infra engineer from the start; now co-lead of 4." Add differentiator bullet: **OpenAI in production (video-interview analysis)**; note **11 integrations** (Stripe/Wingspan/Hubstaff/Google Calendar/S3/Transcribe/SendGrid/Mixpanel/OpenAI/HubSpot/Paycor).
4. **Add Yinz** (new `featured` entry in `projects.ts`): compiled systems language → LLVM native code; full compiler in **Rust** (lexer/parser/type-checker/LLVM codegen via `inkwell`); incremental recompilation via `salsa`; + LSP server, formatter, watch daemon, VSCode extension. Public repo, not live (repoUrl only). Add 1 representative code snippet if a good one exists (executor: ask Patrick or use a small illustrative Rust snippet — do NOT fabricate internals).
5. **Hero** (`HeroSection.vue`): remove the trading-profit implication from headline/subhead; keep "$2M/mo" scale (VPM, true). Apply heading/positioning per Question (a). Align the `available · CTO + Eng Lead` label to the chosen positioning. Optionally add the brand tagline (Question f).
6. **Contact heading** (`ContactSection.vue:54`): replace "Hiring a founding CTO?" per Question (a).
7. **SEO** (`useSeo.ts` + visible copy): weave keywords — LLVM, compiler, Rust, distributed systems, transformers, CUDA, microservices, fault-tolerant, MySQL, TypeScript/Node, Redis Streams — into per-page descriptions + project prose. Keep human, not stuffed.
8. (Optional) Evaluate featuring `~/resume/diagrams/*.png` in SystemsSection; copy into `public/` if used. Drop if it doesn't elevate.
**Acceptance criteria**:
- [x] Banned-claim grep clean in `src/` — covers description, `archNotes`, AND snippet labels (reviewer Concern 3): `profitable`, `pays its own bills`, `exactly-once`, `300-500M`, `500M`, `88 models`, `282 controllers`, `cost reduction`, plus (if Q(e)=DROP) `40ms`, `12-second`, `12s`, `under 50ms`
  - Evidence: acceptance-verifier ran `grep -rEi "profitable|pays its own bills|exactly-once|300-500M|500M|88 models|282 controllers|cost reduction|40ms|12-second|12s|under 50ms" src/` live at HEAD → zero output (exit 1). DragonflyDB swap end-to-end (tech tag + snippet label + archNotes all consistent, no half-swap). Also swept the new perf-claim class (`reads fast`/`2-3x`/`sub-100ms`/`p99`) → clean.
- [x] Yinz exists as a `featured` project with LLVM/Rust/inkwell/salsa/LSP details
  - Evidence: `src/data/projects.ts` — `id:'yinz'`, `tier:'featured'`, `tech:['Rust','LLVM','inkwell','salsa','LSP']`, description names LLVM/Rust/inkwell/salsa/LSP, `repoUrl:'https://github.com/yinzers/yinz-lang'` (verified 200, yinzers org). Snippet = real `#[salsa::tracked]` query (non-fabricated).
- [x] Tessa copy reads as in-progress + three architectures; VPM reads 100+/190+ + re-architected + OpenAI-in-prod
  - Evidence: Tessa `projects.ts:9` "three architectures under active exploration: a LLaMA-style transformer, RWKV-7, and a hybrid. Base training is in progress; inference service is planned." VPM responsibilities: "100+ models and 190+ controllers", "OpenAI in production: video-interview analysis pipeline", "Re-architected AWS infrastructure for redundancy and fault-tolerance; cost-controlled". (Tessa burn→cudarc corrected — verified-false claim, see Design Divergences.)
- [x] Hero + contact heading reflect the approved positioning (Question a); no trading-profit implication anywhere
  - Evidence: Hero headline "systems built to last", subhead "Principal Engineer & Architect…", label "↳ open to · principal/staff · founding eng · contract"; contact "Looking for a Principal Engineer?". Live grep of hero+contact for `profitable|pays its own bills|trading.*profit` → zero (exit 1).
- [x] `type-check` + `lint` clean (project's `bun run` scripts)
  - Evidence: acceptance-verifier ran `docker compose run --rm bun run type-check` → `vue-tsc --noEmit -p tsconfig.app.json` exit 0; `docker compose run --rm bun run lint` → prettier clean, oxlint 5 warnings/0 errors (pre-existing), cspell 0 issues, exit 0. (Round-2 apostrophe build-breaker fixed round 3.)
**Quality gate**:
- [ ] Every changed claim is traceable to a line in `job-hunt.md`
- [ ] No keyword stuffing — copy still reads like a human wrote it
- [ ] Follows existing `projects.ts` shape (no type changes unless `src/types/project.ts` genuinely needs a field)
**Verification**: `grep -rEi "profitable|pays its own bills|exactly-once|300-500M|500M|88 models|282 controllers|cost reduction|40ms|12-second|12s|under 50ms" src/` returns nothing (the `*ms`/`12s` terms only if Q(e)=DROP); load `/` and `/blog`, read every project card; `bun run type-check && bun run lint`.

**Phase Review Gates** (round 3 = final; all PASS):
- [x] code-reviewer: PASS 2026-06-03T13:13 (snippet authenticity cross-checked vs tessa-ai ops.rs; build GREEN)
- [x] rules-compliance-reviewer: PASS 2026-06-03T13:13
- [x] plan-adherence-verifier: PASS 2026-06-03T13:13 (8/8 steps MET; burn→cudarc documented divergence)
- [x] acceptance-verifier: PASS 2026-06-03T13:13 (5/5 ACs MET, commands run live)
- [x] design-compliance-reviewer: PASS 2026-06-03T13:13 (no registry; divergence rationale real)
- [x] deviation-judge #1 (scope+approach: repoUrl string|null on FeaturedProject): PASS 2026-06-03T13:13 — render deferred to Phase 2, documented; r2 "renders live" claim retracted (featured cards have no link)
- [x] deviation-judge #2 (scope: metrics → 11 production integrations): PASS 2026-06-03T13:13 — count verified 11; FYI: "production" label vs Wingspan-in-progress flagged for Patrick (non-blocking)
- [x] deviation-judge #3 (scope+approach: Tessa burn→cudarc, claims accuracy): PASS 2026-06-03T13:13 — "2-3x" dropped, cudarc snippet authentic vs ops.rs, no surviving perf-outcome claim
- [x] deviation-judge #4 (scope: SystemsSection statusMap/badge): PASS 2026-06-03T13:13 — inline featured link stays removed, only banned-claim badge fixes
- [x] Committed: e961c192cb3ef5cbec54beb6ff38312ea744b5c2

**Findings Log**:
- 2026-06-03T12:02 — deviation-judge #2 (metrics) round 1: BLOCK. `metrics.ts:3` swapped banned `500M+` → `~100M+ rows managed`, but the hero strip's other 3 stats are VPM, so it reads as a VPM row-count claim that doesn't exist in job-hunt.md. Fix: Patrick chose to replace slot 2 with `11 / production integrations` (verified, job-hunt.md:64).
- 2026-06-03T12:02 — deviation-judge #3 (principles) round 1: BLOCK. `principles.ts:5` ("the index that kept reads fast") + `projects.ts:69` ("keep reads fast as the dataset grows") are performance-OUTCOME claims for the trading system, where job-hunt.md:65 says DROP all latency/perf claims. Fix: reframe to structural facts (partition pruning), not speed assertions.
- 2026-06-03T12:02 — code-reviewer round 1: BLOCK. (1) `projects.ts:140` Yinz `repoUrl` → `github.com/patrickrizzardi/yinz` returns HTTP 404 (fabricated). Correct URL is `https://github.com/yinzers/yinz-lang` (200, Patrick-confirmed — yinzers org). (2) `public/yinz-compiler.png` orphan (153KB, referenced nowhere) — delete (optional Step 8, not wired). Type-check conflict resolved: project script `vue-tsc -p tsconfig.app.json` exits 0 (AC#5 MET); code-reviewer's 8 errors were from bare vue-tsc on app-tsconfig-excluded files (pre-existing, out of contract).
- 2026-06-03T12:02 — deviation-judge #4 (SystemsSection) round 1: BLOCK. Inline `<a>...↗ repo</a>` block (`SystemsSection.vue:178-195`) with hardcoded `border-radius: 999px` + inline styles is premature Phase-2 button work shipped in Phase 1 (becomes a 20th untracked inline-button site Phase 2's AC can't pass cleanly). Fix: remove the inline block; keep `repoUrl` data; Phase 2 renders it as `<AppButton variant="chip">`. statusMap/tagColors/badge changes stay (legit banned-claim fixes).
- Verified NOT a defect: VPM `PostgreSQL`→`MySQL` tech swap is correct per job-hunt.md:59,64 ("MySQL definitive"). code-reviewer cross-flagged it (no job-hunt.md access); confirmed legitimate.
- 2026-06-03 round 1→2 RESOLUTIONS: metrics → `11 / production integrations` (judge#2 PASS r2); `reads fast` reframed to structural facts (judge#3 r1 item fixed); SystemsSection inline featured repo-link removed (judge#4 PASS r2); Yinz `repoUrl` → `github.com/yinzers/yinz-lang` + orphan png deleted (code-reviewer r1 items fixed).
- 2026-06-03T12:28 — coordinator self-inflicted BLOCK round 2: my direct `sub-100ms` removal edit put `didn't` in a single-quoted string at `projects.ts:122` → unterminated literal → type-check + lint RED (code-reviewer + acceptance-verifier r2 BLOCK). LESSON: coordinator must not hand-edit code without running the build. Fixed round 3 (reworded to "skip recompiling unchanged stages"), build verified GREEN.
- 2026-06-03T12:28 — deviation-judge #3 (principles) round 2: BLOCK. A *different* surviving unverified perf claim — Tessa archNotes "2-3x throughput on consumer GPUs" (pre-existing, no benchmark, not in job-hunt.md). Research-agent swept `/home/patrick/development/tessa-ai`: NO saved benchmark for any multiplier, AND burn is not even a dependency (real stack = cudarc 0.19 + hand-written CUDA). Patrick confirmed: burn was used, benchmarked, REMOVED after custom CUDA won. Round 3 fix: dropped "2-3x"; reframed archNotes to true history (custom CUDA replaced burn after measurably outperforming it); tech tag `burn`→`cudarc`; replaced the burn-API snippet with a real cudarc kernel-dispatch excerpt from `tessa-ai/train/model/src/ops.rs`; `leadership.ts` skill `burn`→`cudarc`. Patrick then had the redundant 2nd Tessa RoPE snippet removed.
- 2026-06-03T13:11 — DESIGN DIVERGENCE (plan Step 2 override): plan said "burn stays"; verified-false (burn removed from tessa-ai). Corrected all burn refs → cudarc per Patrick confirmation. Recorded in `## Design Divergences`.
- 2026-06-03T13:11 — DEFERRED TO PHASE 2 (documents code-reviewer r2 + judge#1 r2): (a) Yinz `repoUrl` is correct data that the *featured* cards do not render in Phase 1 (rendering a repo link is Phase-2 `<AppButton>` work — judge#4 r1 explicitly ruled inline featured links premature). Phase 2 wires featured `repoUrl`. (b) Type asymmetry: `FeaturedProject.repoUrl: string | null` (new, correct per coding-style) vs pre-existing `StandardProject.repoUrl?: string` (+ npm/live/extension `?:`). Normalizing StandardProject url fields to `string | null` touches data construction sites + the secondary template — Phase 2 owns exactly that code (SystemsSection project links), so deferred there with a named trigger. Both added to Phase 2 Steps below.
- 2026-06-03T14:30 — POST-COMMIT REFINEMENTS (Patrick review of committed Phase 1; separate refinement commit on cheddar-v1): (1) **Metrics dedup** — hero strip slot 1 `$2M+ cashflow/month` → `$65.8M+ gross since 2021` (hero subhead keeps `$2M/mo`; de-dupes the 3× `$2M` echo; both figures owner-verified). (2) **Yinz refocus** — verified the real yinz-lang repo (cloned, research agent): re-led the card on the *compiler-enforced teaching-diagnostics* standard (SHIPPED — `Diagnostic` type asserts what/what-instead/why at construction; snippet swapped to the real `Diagnostic` struct from `ynz-diagnostics/src/diagnostic.rs`), the *no-function-coloring concurrency* model (framed "core runs today; whole-program propagation + auto-parallelization in active development" — NOT done), and the on-brand `sensitive` auto-redaction type (SHIPPED). (3) **Error Decoder honesty fix** — Patrick confirmed the hosted service is OFFLINE; dropped the false "Monetized and actively maintained", removed the dead `liveUrl`/`extensionUrl`, reframed as archived (status `archived`, `2023 (archived)`). (4) **OSS clarity** — visible `oss` tag → `open source` (tag + role label + tagColors key). code-reviewer caught + I fixed one self-introduced overstatement: Yinz desc "can't even compile" → "enforced at construction… never reaches a user" (it's a runtime assert-panic, not compile-time). type-check + lint GREEN. "11 production integrations" left as Patrick chose (Wingspan-in-progress FYI standing).

---

### Phase 2: Button/CTA component system + radius tokens (KEYSTONE)
**Scope**: Extract `<AppButton>`; add radius tokens; refactor all 19 button/CTA sites to it. Decide radius + primary-CTA treatment via mockups.
**Branch/commit**: `refactor(ui): AppButton component + radius tokens`
**Objective**: One component + tokens drive every CTA; changing radius or the primary treatment is a one-line edit.
**Why this phase exists**: It's the prerequisite that makes Patrick's rounded-button and CTA-feel fixes tractable and consistent. Currently impossible cleanly (19 inline styles).
**Current-state anchors**:
- 19 button sites enumerated in `.analysis/` audit + this session's notes: `AppNav.vue` (logo/links/CTA/hamburger), `HeroSection.vue:146-166,215-268` (github chip / view-systems / open-a-thread), `ContactSection.vue:65-131`, `BlogView.vue` (tag filters / clear), `MobileMenu.vue`, `WritingSection.vue`, `SystemsSection.vue:231-274` (project links), `BlogPostNav.vue`, `BlogPostHeader.vue` (tag chips)
- `src/assets/main.css:64-65` — `--radius: 14px; --radius-sm: 8px` (used in only 2 places); pill radius is `999px`/`rounded-full` hardcoded ~23×
**Files (expected scope)**: NEW `src/components/ui/AppButton.vue`; `src/assets/main.css` (add `--btn-radius`, `--card-radius` tokens + matching `@theme`); the ~10 component files above; `src/types/project.ts` + `src/data/projects.ts` (Step 7 url-field type normalization, carried from Phase 1).
**Steps**:
1. Define `AppButton.vue` (`<script setup lang="ts">`, arrow-fn idiom): props `variant: 'primary'|'ghost'|'chip'` (union+as const, NO enum), `size?: 'sm'|'md'`, optional `as` ('button'|'a'|'RouterLink') so CTAs that navigate stay semantic. Type-based `defineProps`/`defineEmits` per `vue-standards.md`. Radius from `var(--btn-radius)`.
2. Add tokens to `main.css` (both `@theme --color-…` style and `:root`): `--btn-radius`, `--card-radius`. Start at current values to keep render identical.
3. **Render-preserving refactor**: replace each inline button with `<AppButton variant=…>` mapping current colors to variants. Verify each touch-point screenshots identical BEFORE any restyle.
4. **Mockup decision (Q b + c)**: render side-by-side (a) radius square `0` vs soft `6px`; (b) primary CTA: solid burnt / flat fill no-glow / outline. Screenshot, present, Patrick picks. Apply chosen values to the tokens + primary variant — one edit propagates everywhere.
5. Confirm `:focus-visible` ring (added this session) still applies to `AppButton`.
6. **[Carried from Phase 1 — repo-link render deferral]** Wire the **featured-project** `repoUrl` as `<AppButton variant="chip" as="a">↗ repo</AppButton>` in the SystemsSection featured card (Yinz currently has a valid `repoUrl` rendered nowhere; tessa-ai/trading-v3 are `null` → no link). This is the natural home — judge#4 (Phase 1) ruled an inline featured repo-link premature; here the button system exists. Trigger satisfied.
7. **[Carried from Phase 1 — type normalization]** Normalize `StandardProject` url fields (`repoUrl`/`npmUrl`/`liveUrl`/`extensionUrl`) from `?: string` to `string | null` in `src/types/project.ts`, declaring `null` at every standard-project construction site in `projects.ts`, to match `FeaturedProject.repoUrl: string | null` (coding-style `T | null` rule — eliminates the two-null-convention asymmetry flagged by judge#1 in Phase 1). Update the secondary-card `'url' in p && p.url` guards accordingly (with required fields, the `in` check is redundant → simplify to `p.url`).
**Acceptance criteria**:
- [x] `AppButton.vue` exists with primary/ghost/chip variants + size; no inline button styles remain in the refactored files
  - Evidence: `src/components/ui/AppButton.vue` (NEW) — variants primary/ghost/chip/text/nav (`as const`+union), `size`/`as`/`block`/`active`/`accent` props. acceptance-verifier grep: every `<AppButton>` call site across all 9 refactored files is 100% variant/prop-driven — ZERO inline `style`/`:style` overrides (the one HeroSection `style=` hit is a sibling `<span>`, not an AppButton). Round-2 cleanup moved all former inline overrides into props (nav/block/active/accent).
- [x] `--btn-radius` token controls all button rounding; flipping it changes every button (demonstrated)
  - Evidence: `--btn-radius` in main.css `@theme` (L30) + `:root` (L69); `AppButton.baseStyle.borderRadius: var(--btn-radius)` is the sole rounding source (no variant overrides it). Demonstrated by the flip 999px→6px propagating to all buttons. A `border-radius:8px` on the MobileMenu hire CTA that BYPASSED the token was found + removed (round 2) — now nothing competes with the token.
- [x] Chosen radius + primary-CTA treatment applied via tokens/variant (Patrick-approved)
  - Evidence: `--btn-radius: 6px`; primary variant = solid `var(--burnt)` + soft shadow `0 6px 18px -12px oklch(0.66 0.17 48 / 0.45)` (no gradient/glow). Patrick approved 6px + solid-burnt via /tmp side-by-side mockup (Findings Log).
- [x] All 19 sites render correctly at 375/768/1280; `type-check` + `lint` clean
  - Evidence: acceptance-verifier ran `docker compose run --rm bun run type-check` (vue-tsc -p tsconfig.app.json) → exit 0 and `... bun run lint` → exit 0 (prettier clean, oxlint 0 errors, cspell 0 issues), live. Responsive: coordinator Playwright-captured + reviewed `/` at 375/768/1280 — buttons render at 6px, solid-burnt primary, consistent hover, no layout break.
**Quality gate**:
- [ ] No `enum`, no `as any`, no `function` keyword (arrow fns), `T | null` not `?:` for object fields
- [ ] Variants cover every existing button without a one-off escape hatch
- [ ] Component is locally registered / imported where used (no needless global registration)
**Verification**: `grep -rn "border-radius: 999px\|rounded-full" src/components` shrinks to only intentional non-button uses; screenshot each variant; `bun run type-check && bun run lint`.

**Phase Review Gates** (final; all PASS — 4 fix rounds):
- [x] code-reviewer: PASS 2026-06-03T16:30 (round 4 — fontSize single-owner + accent hover-aware; "right design, ship it")
- [x] rules-compliance-reviewer: PASS 2026-06-03T15:55
- [x] plan-adherence-verifier: PASS 2026-06-03T15:55 (all 3 prior silent deviations documented; audit trail complete)
- [x] acceptance-verifier: PASS 2026-06-03T15:55 (4/4 ACs MET, commands run live)
- [x] design-compliance-reviewer: PASS 2026-06-03T15:55 (KEEP list intact, palette tokens, magnetic gone)
- [x] deviation-judge #1 (approach: AppButton API extensions — nav/text variants + block/active/accent props): PASS 2026-06-03T16:30 — every call site prop-driven, merge order correct (identity beats transient), accent hover-aware
- [x] deviation-judge #2 (scope: ContactSection skip): PASS 2026-06-03T15:55 — composite link-rows, not button CTAs
- [ ] Committed: <commit SHA>

**Findings Log**:
- 2026-06-03 Step 4 (Patrick mockup pick): radius `--btn-radius` 999px→6px; primary CTA gradient+glow → solid `var(--burnt)` + soft shadow. Approved via /tmp side-by-side mockup.
- 2026-06-03 Patrick request (mid-phase): removed the hero "view systems" magnetic cursor-follow animation (too performative — aligns with the plan's "no performative animation" aesthetic principle). **Deleted orphaned `src/composables/useMagneticButton.ts`** (was unused after inline removal). Replaced with a consistent restrained hover on ALL AppButton variants (mouseenter/leave + hoverStyle: primary→burnt-hi, ghost→burnt-hi+tint, chip→burnt border, text/nav→brighter).
- 2026-06-03 round-1 gate: judge#1 BLOCK + plan-adherence BLOCK + code-reviewer must-fix concern.
  - **judge#1 (4th `text` variant) BLOCK**: AppNav + MobileMenu nav links used `variant="text"` PLUS inline `style=` overriding color/padding/font — the escape hatch the quality gate forbids, relocated into AppButton. **Fix**: added a real **`nav` variant** (bakes text-2 color + padding + font + hover) and a **`block` prop** (full-width; nav→flex-start, others→center) so nav links carry ZERO inline style. `text` variant kept for BlogView clear-filter (was already clean).
  - **code-reviewer must-fix (Rule 11)**: Step-7 guard simplification (`'repoUrl' in p && p.repoUrl` → `p.repoUrl`) was wrong — `repoUrl`/`npmUrl` are `StandardProject`-only but `secondary` includes `ExperienceProject`; latent type hole. **Fix**: restored `in` narrowing for Standard-only URL fields; `liveUrl` (on both members) stays simplified. (The plan's Step-7 instruction was defective for union-member-specific fields.)
  - **DOCUMENTED DEVIATIONS (plan-adherence BLOCK — audit-trail)**: (1) **4th `text` variant** + later `nav`/`block`/`active`/`accent` props are intentional AppButton API extensions to eliminate per-site escape hatches (quality gate prefers extending variants over one-offs). (2) **`BlogPostNav.vue` not refactored** — plan anchor listed it as a button site, but it contains `<RouterLink>` prev/next *navigation cards*, not button/CTA elements; correctly left as-is. (3) **`useMagneticButton.ts` deleted** — see magnetic-removal entry above (Patrick request).
- 2026-06-03 round-2 proactive cleanup (eliminate ALL remaining AppButton inline-style escape hatches → AC#1 literally true): MobileMenu "hire" CTA inline `style` (incl. a `border-radius: 8px` that BYPASSED `--btn-radius`, violating AC#2) → `variant="ghost" block`; BlogView active-filter chips inline `:style` → new **`active` prop** (chip selected = burnt fill, stable over hover — fixes the hover-frozen concern); WritingSection "all posts" color override removed; BlogPostHeader tag chips bg/border override removed; SystemsSection "live" link burnt emphasis → new **`accent` prop** (chip burnt outline). Final sweep: zero inline style/`:style` on any `<AppButton>`. type-check + lint GREEN; Playwright-verified 375/768/1280.

---

### Phase 3: Nav redesign — floating pill → full-width top bar
**Scope**: Replace the centered rounded pill nav with a conventional full-width top bar; use `AppButton` for links/CTA.
**Branch/commit**: `feat(nav): full-width top bar`
**Objective**: Standard top nav (logo left, links right, subtle bottom border, blurred bg on scroll), no floating oval.
**Why this phase exists**: Patrick's explicit request; the pill-over-dark-gradient reads as goofy.
**Current-state anchors**:
- `src/components/layout/AppNav.vue` — current `fixed top-4 left-1/2 -translate-x-1/2 rounded-full` pill; route-aware `goTo()` + reordered links + `<button>` semantics already done this session (REUSE, don't rewrite)
- `src/App.vue:9` — `<main class="pt-20">` offset (adjust to bar height)
- `src/components/layout/CheddarWordmark.vue` — logo slot
**Files (expected scope)**: `AppNav.vue`, `App.vue` (top offset), possibly `MobileMenu.vue` (trigger position), `CheddarWordmark.vue`.
**Steps**:
1. Rework `AppNav.vue` container: `fixed top-0 left-0 right-0`, full width, inner `max-w` content row (logo left, links+CTA right), `border-b var(--line)`, blurred/semi-opaque bg. Keep `z-50`.
2. Swap nav links/CTA to `<AppButton variant="ghost"/"primary">`. Preserve `goTo()` route-aware behavior + `aria-expanded` hamburger.
3. Adjust `App.vue` `<main>` top padding to the new bar height.
4. Logo slot: keep current mark as placeholder; leave a clean single-line swap point for Patrick's new logo (Phase 4).
5. Verify responsive: desktop links visible, mobile hamburger → `MobileMenu`; route-aware scroll still lands at the right offset (recompute the `scrollToId` 60px offset for the new bar height).
**Acceptance criteria**:
- [ ] Nav is full-width with bottom border; no floating pill; logo left / links right
  - Evidence: (filled at phase completion)
- [ ] Nav links/CTA use `AppButton`; route-aware `goTo` from `/blog` still works (lands at correct offset)
  - Evidence: (filled at phase completion)
- [ ] Responsive at 375/768/1280; hamburger + MobileMenu work; `type-check` + `lint` clean
  - Evidence: (filled at phase completion)
**Quality gate**:
- [ ] Scroll-offset constant matches the new bar height (no overlap, no gap)
- [ ] No regression in the route-aware nav (verify click "systems" from `/blog`)
- [ ] Reduced-motion respected (existing behavior preserved)
**Verification**: browser at 3 widths; click each nav item from `/` and `/blog`; `bun run type-check && bun run lint`.

**Phase Review Gates**:
- [ ] code-reviewer: <verdict + ISO timestamp>
- [ ] rules-compliance-reviewer: <verdict + ISO timestamp>
- [ ] plan-adherence-verifier: <verdict + ISO timestamp>
- [ ] acceptance-verifier: <verdict + ISO timestamp>
- [ ] design-compliance-reviewer: <verdict + ISO timestamp>
- [ ] Committed: <commit SHA>

**Findings Log**: _(empty)_

---

### Phase 4: a11y/OG polish + logo & favicon swap
**Scope**: Close the carryover a11y items, build the OG card (fix the 404), and wire Patrick's new logo + favicon when it arrives.
**Branch/commit**: `fix(polish): shiki contrast + OG image + mobile dialog + logo/favicon`
**Objective**: axe-clean; shared links render a real preview; mobile menu is a proper dialog (if Reka approved); new logo + SVG favicon live.
**Why this phase exists**: Carryover polish + the external-logo dependency lands here.
**Current-state anchors**:
- Shiki code-comment contrast `#6A737D` on `#24292E` = 3.04:1 (axe-confirmed); theme set wherever Shiki/markdown-it is configured (executor locates — `@shikijs/markdown-it` config)
- `src/composables/useSeo.ts:6` — `og:image` → `/assets/og-default.png` (404)
- `src/components/layout/MobileMenu.vue` — current semantic dialog + Esc + focus-on-open (this session); full focus-trap pending
- `index.html:9` — `<link rel="icon" href="/favicon.ico" />` (old brand); `public/cheddar-mark.svg` exists
**Files (expected scope)**: Shiki config file, `public/assets/og-default.png` (new), `index.html`, `MobileMenu.vue` (if Reka), `public/` logo/favicon assets, possibly `package.json` (if reka-ui approved).
**Steps**:
1. **Shiki contrast**: bump comment-token contrast to ≥4.5:1 — prefer swapping to a theme with accessible comments, else a CSS override on `.shiki` comment spans. Re-run axe to confirm 0 contrast violations.
2. **OG card**: build a 1200×630 PNG (cheddar palette; use the ornate `cheddar-emblem.png` and/or new logo + name + tagline). Save to `public/assets/og-default.png`. Verify `og:image` resolves 200 + preview renders.
3. **Mobile dialog (Q d)**: if reka-ui approved → refactor `MobileMenu.vue` to `DialogRoot/DialogPortal/DialogOverlay/DialogContent` (focus-trap + Esc + aria-modal free); else leave current + document "good enough" deferral with trigger.
4. **Logo + favicon (when Patrick delivers asset)**: drop into `public/`, wire into the new nav logo slot, switch `index.html` favicon to the new mark (SVG favicon + ico fallback). If the asset hasn't arrived, ship the rest and leave this sub-step open.
**Acceptance criteria**:
- [ ] axe color-contrast run on `/` and a blog post = 0 violations (including code blocks)
  - Evidence: (filled at phase completion)
- [ ] `/assets/og-default.png` exists, serves 200, renders as a real share preview
  - Evidence: (filled at phase completion)
- [ ] Mobile menu: Reka dialog (if approved) with focus-trap, OR documented deferral; `type-check` + `lint` clean
  - Evidence: (filled at phase completion)
- [ ] Favicon + nav logo show the new mark (or explicitly deferred if asset not yet delivered)
  - Evidence: (filled at phase completion)
**Quality gate**:
- [ ] axe: 0 contrast violations site-wide
- [ ] If reka-ui added: it's the only new dep, tree-shaken, version pinned
- [ ] OG image is optimized (not multi-MB)
**Verification**: axe via Playwright on `/` + post; `fetch('/assets/og-default.png')` → 200; keyboard-tab the mobile menu (focus stays trapped if Reka); `bun run type-check && bun run lint`.

**Phase Review Gates**:
- [ ] code-reviewer: <verdict + ISO timestamp>
- [ ] rules-compliance-reviewer: <verdict + ISO timestamp>
- [ ] plan-adherence-verifier: <verdict + ISO timestamp>
- [ ] acceptance-verifier: <verdict + ISO timestamp>
- [ ] design-compliance-reviewer: <verdict + ISO timestamp>
- [ ] Committed: <commit SHA>

**Findings Log**: _(empty)_

---

## Anti-Pattern Callouts
- **Splitting into commits instead of PRs**: each phase is a self-contained, reviewable commit on `cheddar-v1` with its own reviewer fan-out; not arbitrary mid-work commits. Branch merges to `main` once whole.
- **Shadow main branches**: all work on the existing `cheddar-v1`; no parallel long-lived branch. `main` is the merge target.
- **Building the engine before shipping value**: Phase 1 (content/honesty) ships standalone value first and is independent of the design-system work; the `AppButton` "engine" (Phase 2) is immediately consumed by Phase 3.
- **Hotfix that isn't**: the honesty fix is genuinely urgent (live false claim) and is scoped tightly to content in Phase 1 — no smuggled refactors.
- **Abandoned branches**: single branch, merged at completion; no spawned throwaways.
- **Flag graveyards**: no feature flags introduced (static site, single deploy) — nothing to leave behind.

## Quality Checklist (verify at completion)
- [ ] Inputs validated — **N/A** (static site, no user input)
- [ ] Auth/authz — **N/A** (no server/endpoints)
- [ ] Error handling — **N/A** (no runtime error surfaces beyond build)
- [ ] No SQL injection / XSS / path traversal / secret exposure — XSS: no `v-html` on untrusted content (confirm none added); rest N/A
- [ ] Performance: bundle stays lean (one optional dep, tree-shaken); OG image optimized
- [ ] Tests — site has no unit tests; verification is browser + axe + type-check + lint (stated per phase)
- [ ] Existing build still passes (`vite-ssg build`)
- [ ] Types complete (no `any`, no non-null assertions, union+as const not enum, `T | null` not `?:`)
- [ ] Follows existing conventions (`vue-standards.md`, projects.ts shape, `@theme` token pattern)
- [ ] Every phase received all-reviewer + all-judge PASS before committing
- [ ] Final cumulative reviewer sweep passed
- [ ] Plan-file acceptance-criteria checkboxes accurate across all phases
- [ ] **Honesty**: final grep clean of all banned claim strings; Patrick signed off on Phase 1 copy
