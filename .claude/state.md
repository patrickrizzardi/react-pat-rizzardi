# Session State: redact-digital

**Last Updated**: 2026-06-03

---

## Critical Rules (synced from ~/.claude/CLAUDE.md)

1. **Push back FIRST**: Challenge bad ideas before helping.
2. **Personality (TOP PRIORITY)**: Be Cortana - snarky battle buddy, not corporate.
3. **Agent delegation (PROACTIVE)**: Delegate WITHOUT being asked.
4. **CLAUDE.md after compaction**: Re-read rules + personality.
5. **Plans & TODOs**: Multi-step plans → immediately write `.claude/todos.md`.
6. **Speculation**: Default to novel approaches. Mark speculation clearly.
7. **Decision tracking**: NEW → append to Active Decisions (with WHY).

---

## Current Context (REPLACE each update)

**Goal**: Site overhaul (design system + content/SEO/honesty) on `cheddar-v1` — **COMPLETE**.
**Active Plan**: `.claude/plans/active/cheddar-site-overhaul.md` (status: done — radar relocates to `plans/done/` next session). Cheddar rebrand also DONE (`.claude/plans/done/cheddar-rebrand.md`).
**Git**: `patrickrizzardi/react-pat-rizzardi`, branch `cheddar-v1`. **Do NOT push/merge — Patrick handles.** Dev server: **localhost:8082**.

**WHERE WE LEFT OFF (resume here):** cheddar-site-overhaul plan **COMPLETE** — all 4 phases committed on `cheddar-v1`, plus the end-of-plan cumulative-review fix loop. Commits: P1 `e961c19`+`bbd4166` (honesty/Yinz/SEO), P2 `db39055` (AppButton + radius tokens), P3 `117fe42` (nav full-width bar), P4 `c1e5b6c` (a11y/OG/reka dialog/favicon), final fix-loop `3c04011` (honesty + nav-height token + plan done). End-of-plan cumulative review = 5 reviewers + 9 deviation-judges (all Opus) → all PASS after a Step-4.c fix loop that resolved 4 confirmed defects (LLM completion overstatement in principles.ts; nav-height 3-literals→`--nav-h` token; Tessa "measurably outperformed"→architectural truth; index.html/hero/OG "from-scratch LLVM compiler" + "$2M/mo distributed" weld→honest copy). The metrics BLOCK (judge P1#2) was NOT confirmed (flat-rate fallacy — cumulative-gross vs current-monthly-rate are different quantities, both true). Build GREEN: type-check + lint + `vite-ssg build` (4 pages). **NEXT: Patrick reviews → merges `cheddar-v1` → `main` (DO App Platform auto-deploys).**

**Flagged for Patrick (his call — full detail in the plan's Final Review Findings Log):**
- `src/data/leadership.ts` 2026 timeline "Engineering Lead / Independent CTO-track engagements" contradicts the resolved Principal-Engineer/non-CTO positioning. Career framing — left untouched for his decision.
- Tessa corpus "3.85B-token" (`projects.ts:9`) — that's the English-Base figure; tessa-ai is now at 12.4B (was 3.85B). Understated, not overstated (honest-safe); he may want to bump it.
- `$65.8M+ gross since 2021` now occupies a hero metric slot (his "swap one out for the 65m" call). Not a defect; flagged for visibility.

**Plan phases (all done)**: 1 Content/honesty+Yinz+SEO → 2 AppButton+radius tokens → 3 nav full-width bar → 4 a11y/OG+logo/favicon.

---

## Environment & Commands (CRITICAL)

**Container**: Devcontainer (Ubuntu) w/ Docker socket mounted | **DB**: None | **PM**: Bun (via compose)
```bash
docker compose up                              # Vite dev server at localhost:8082 (compose port remapped 8080→8082)
docker compose run --rm bun install            # Install deps
docker compose run --rm bun run build          # Production build (vite-ssg build)
docker compose run --rm bun run type-check     # TypeScript check
docker compose run --rm bun run lint           # prettier + oxlint + cspell
docker compose run --rm bun run format         # prettier --write
docker compose run --rm bun add <pkg>          # Add dependency
```

**Stack (resolved versions):**
- Vue 3.5.33, Vue Router 4.6.4, Pinia 2.3.1
- Vite 6.4.2, @vitejs/plugin-vue 6.0.6
- Tailwind CSS 4.2.4, @tailwindcss/vite 4.2.4, @tailwindcss/typography 0.5.19
- TypeScript 5.9.3, vue-tsc 2.2.12
- Shiki 4.0.2, @shikijs/markdown-it 4.0.2
- vite-ssg 28.3.0, unplugin-vue-markdown 30.0.0, vite-ssg-sitemap 0.10.0
- @unhead/vue v2 (bundled with vite-ssg)
- Prettier 3.8.3, oxlint 1.61.0
- reka-ui ^2.9.9 (headless dialog primitives — added in Phase 4)

---

## Active Decisions

- [2026-04-22] **Full rebuild from React** — Vue + Tailwind replacing React + MUI
- [2026-04-22] **Bun via Docker Compose** — not installed in devcontainer, runs as compose service
- [2026-04-22] **Deploy to DO App Platform** — free static tier, auto-deploy from GitHub
- [2026-04-30] **Cheddar rebrand** — warm carbon + burnt orange palette, Geist/Newsreader/JBMono fonts, dark-only
- [2026-04-30] **Dark-only, no theme toggle** — useTheme deleted, `class="dark"` hardcoded
- [2026-04-30] **siteConfig.ts single source** — email/github/linkedin/siteUrl all from one const
- [2026-04-30] **NeuronCanvas replaces NeuralGrid** — canvas-based saltatory firing vs SVG
- [2026-04-30] **Blog URLs: slug-only** — /blog/{slug}, no date prefix
- [2026-04-30] **No backdating blog posts** — launch fresh with consistent cadence
- [2026-06-02] **Site positioning = "Principal Engineer & Architect" umbrella** — serves BOTH full-time leadership AND contract audiences (senior IC who leads; not "manager", not junior). Gun.io profile stays "Backend Engineer" (separate funnel). Contact heading → "Looking for a Principal Engineer?"
- [2026-06-02] **Aesthetic = personality-forward, NOT sterile-executive** — Patrick: hiring a "stick in the mud" is dumb for startups. Keep NeuronCanvas + `cheddar://` signature + scan-grid (ambient atmosphere). Trim only "look-at-my-trick" elements (decoder scramble, maybe live clock) — pending Patrick confirm. Principle: earned-confidence atmosphere YES, performative animation NO.
- [2026-06-02] **Logo = geometric convergence/wedge-to-point** — NO literal cheese, subtle wedge easter egg, monochrome-safe. Name stays "Cheddar" (Cheddar=Value). Wired into nav + SVG favicon (Phase 4 done).
- [2026-06-02] **Brand narrative**: Cheddar=Value · Redaction=Removing Noise · Leadership=Creating Alignment · Engineering=Creating Leverage. Tagline candidate (Patrick undecided).
- [2026-06-02] **Honesty corrections (job-hunt.md is source of truth)** — DONE in Phase 1 + end-of-plan fix loop. Single source for claims: `src/data/projects.ts` + `HomeView.vue` useSeo. "from scratch / bare metal" is accurate ONLY for the Tessa LLM (hand-written CUDA, no framework); Yinz is "Rust LLVM compiler" (LLVM-native via inkwell), NOT from-scratch. `$2M/mo` = VPM current run-rate (MySQL); `$65.8M+` = cumulative gross since 2021 — distinct quantities. index.html meta + OG card mirror the vetted HomeView copy.

---

## Remember for This Project

- Git repo: patrickrizzardi/react-pat-rizzardi (SSH, should rename eventually)
- Domain: redact.digital
- Email: patrick@redact.digital
- LinkedIn: https://www.linkedin.com/in/patrick-rizzardi/
- Patrick is Army National Guard (NOT active duty), SSG E-6, 12 years, Section Chief
- Patrick is self-taught, no CS degree, no bootcamp
- Patrick manages 4 junior devs at VPM
- Patrick shares CTO-level responsibilities but does NOT hold the title
- VPM: 100K users, $2M/mo cashflow ($65.8M+ gross via Stripe since 2021), Patrick is co-lead
- Tessa AI: custom LLM in Rust, hand-written CUDA kernels via **cudarc** (burn framework was REMOVED — do NOT reintroduce "burn" in copy), 34GB / 3.85B-token English-Base corpus (tessa-ai now at 12.4B total), three architectures (LLaMA-style / RWKV-7 / hybrid), base training in progress
- Yinz: Rust LLVM compiler (LLVM-native via **inkwell**; salsa, LSP) — repo `github.com/yinzers/yinz-lang` (under the yinzers org). NOT "from scratch" — it builds on LLVM.
- error-decoder: monetized, server taken down (offline); VS Code extension still published but non-functional (no AI API server)
- **Nav-bar height**: single source = `--nav-h` CSS token in `main.css` (54px mobile / 61px desktop). Consumed by `App.vue` padding + `MobileMenu` dropdown top; `scroll.ts` measures the live bar via `[data-app-nav]` for anchored scroll.
- **Logo re-derivation recipe** (if regenerating from PNG): use **vtracer** (`~/.cargo/bin/vtracer` 0.6.5, `cargo install vtracer`). `convert public/cheddar-logo.png -fuzz 10% -transparent black t.png; convert t.png -trim +repage trim.png; vtracer --input trim.png --output out.svg --colormode color --mode polygon --filter_speckle 10 --color_precision 6 --gradient_step 24 --corner_threshold 60` then add `viewBox="0 0 902 605"`. Colors remapped to theme tokens (burnt-hi #f88a3d / burnt #e26b1b / ember #c33c00 / cheddar #feb51f). **Don't hand-draw or hand-de-round — vtracer polygon mode only.** Source PNG: `public/cheddar-logo.png`.
- **OG card re-render recipe**: create a 1200×630 HTML template in `public/` (dark bg, oklch palette, Geist + JBMono fonts, `/cheddar-logo.svg` mark), Playwright `navigate` → `resize 1200×630` → await `document.fonts.ready` → screenshot to `public/assets/og-default.png`, then delete the temp template. Copy must match the hero subhead / HomeView SEO.
