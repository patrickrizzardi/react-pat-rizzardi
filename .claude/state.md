# Session State: redact-digital

**Last Updated**: 2026-05-04

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

**Goal**: Site overhaul (design system + content/SEO/honesty) — plan APPROVED on `cheddar-v1`.
**Active Plan**: `.claude/plans/active/cheddar-site-overhaul.md` (plan-reviewer: PASS, approved). Cheddar rebrand is DONE (`.claude/plans/done/cheddar-rebrand.md`).
**Git**: `patrickrizzardi/react-pat-rizzardi`, branch `cheddar-v1`. **Do NOT push/merge — Patrick handles.** Dev server: **localhost:8082**.

**WHERE WE LEFT OFF (resume here):** EXECUTING via /execute-plan (in-place on cheddar-v1). plan_base `96e37ae`. **Phase 2 (AppButton + radius tokens) DONE + COMMITTED `db39055`** — AppButton (primary/ghost/chip/text/nav variants + size/as/block/active/accent props); ~19 button sites refactored, zero inline button-style overrides; radius 6px + solid-burnt primary (Patrick mockup pick); magnetic hero animation removed; featured repoUrl + StandardProject url-type deferrals cleared. 4 fix rounds, 5 reviewers + 2 judges all PASS. **Phase 3 (nav full-width bar) DONE + COMMITTED `117fe42`** — shared scrollToSection util ([data-app-nav] + named consts), /blog nav verified, bugs.md restored. **Phase 4 (a11y/OG/logo-favicon) IN PROGRESS (last phase).** Patrick: ADD reka-ui (real dialog); coordinator renders OG. DONE: **OG image** rendered via Playwright (1200x630, 178KB) → public/assets/og-default.png, serves 200, useSeo.ts path correct. Executor (background) doing: shiki comment contrast ≥4.5:1, reka-ui add + MobileMenu→DialogRoot/Portal/Overlay/Content refactor (wire AppNav hamburger v-model:open), favicon swap (index.html → /cheddar-logo.svg). AFTER executor: coordinator runs axe via Playwright on / + a blog post (AC#1 = 0 contrast violations), then gate Phase 4 (5 reviewers + judges), commit, then END-OF-PLAN cumulative review + flip status→done + move scratch to done/.** ORIGINAL Phase 3 in-gate note below: --- Built: AppNav full-width bar (logo left, links right, border-b, blur); NO blog nav link (Patrick's call — keep 'writing', /blog via "all posts"); menu order already matched page order. Coordinator caught + fixed the executor's wrong 46px offset (real bar 61px desktop/54px mobile) → scrollToId now measures LIVE nav height + 12px gap (robust); App.vue pt-[64px] + MobileMenu top-[56px] (commented). Browser-verified (Playwright): /blog→"systems" routes home+scrolls (lands 11px below bar); bar renders 1280 + 375 (hamburger→dropdown). Executor had silently DELETED Patrick's bugs.md (unauthorized) → coordinator RESTORED it. type-check+lint GREEN. Gate: 5 reviewers + 1 judge running. **NEXT after Phase 3 commits: Phase 4 (a11y: shiki contrast; OG image 1200x630 fixing the 404; reka-ui mobile dialog [Q d — needs Patrick approve] OR document deferral; logo+favicon swap — logo asset DONE at public/cheddar-logo.svg, needs favicon wiring).** Then end-of-plan cumulative review + flip status→done. --- **Phase 1 DONE — commits `e961c19` (honesty+Yinz+SEO) + `bbd4166` (refinements: Yinz refocus on teaching-diagnostics+no-coloring-concurrency+sensitive, verified vs real yinz-lang repo; Error Decoder→archived/offline; $65.8M gross metric; OSS→Open source).** **Phase 2 (AppButton + radius tokens) IN GATE — round 1.** Built AppButton (primary/ghost/chip/text variants), --btn-radius/--card-radius tokens; refactored ~19 button sites; rendered featured repoUrl as AppButton chip; normalized StandardProject url fields →string|null; Patrick picks applied: **radius 6px + solid-burnt primary CTA** (via mockup); **magnetic hero animation REMOVED** (Patrick: too performative) + useMagneticButton.ts deleted + consistent hover added to all variants. Verified 375/768/1280 via Playwright (clean). Phase 2 gate r1: rules/design/acceptance/plan-adherence + judge#2(ContactSection-skip) PASS; **judge#1 BLOCK — 'text' variant: AppNav+MobileMenu nav links override color/padding/font inline on top of variant="text" (escape hatch the quality gate forbids); fix = add a 'nav' variant.** Awaiting code-reviewer, then fix round. Phase 2 NOT yet committed (working tree staged via git add -N AppButton.vue). **NEXT: fix 'text'→'nav' variant, re-gate, commit Phase 2 → Phase 3 (nav full-width bar) → Phase 4 (a11y/OG/favicon).**

**Already done this session (uncommitted on `cheddar-v1` working tree — NOT yet committed):**
- a11y: contrast tokens `--text-3` 0.58→0.70 / `--text-4` 0.42→0.65 (axe-verified AA), global `:focus-visible` ring
- nav: route-aware `goTo` (works from /blog) + link reorder (principles→systems…) + `<a>`→`<button>` semantics + hamburger aria-expanded; MobileMenu semantic dialog + Esc + focus-on-open
- blog: `?tag=` query read+sync + unknown-tag→show-all
- resume: `public/resume.pdf` + contact link wired (download attr)
- content: `$68M`→`$65.8M` number fix
- hero: 3 button contrast/feel fixes (github chip, open-a-thread border, view-systems gradient tone-down)
- logo: DONE (final = **vtracer polygon trace**). Hand-drawn rebuilds (v1–v4) and a hand-rolled de-round+RDP both failed (jaggies). Correct tool = **vtracer** (installed via `cargo install vtracer`, now at `~/.cargo/bin/vtracer` 0.6.5). **Re-derivation recipe:** `convert public/cheddar-logo.png -fuzz 10% -transparent black t.png; convert t.png -trim +repage trim.png; vtracer --input trim.png --output out.svg --colormode color --mode polygon --filter_speckle 10 --color_precision 6 --gradient_step 24 --corner_threshold 60` then add `viewBox="0 0 902 605"`. Output → `public/cheddar-logo.svg` (2.5 KB, 8 paths, sharp, transparent, faithful). Wired into nav via `<img>` in `CheddarWordmark.vue` (height=size, width=size*1.49). Source PNG: `public/cheddar-logo.png` (also `/mnt/c/Users/patri/Downloads/`). Colors NOW remapped to exact theme tokens (resolved oklch→sRGB via canvas): burnt-hi #f88a3d / burnt #e26b1b / ember #c33c00 / cheddar #feb51f — solid fills, 3-tier orange shading + gold preserved for depth. Perfect theme match, DONE. Favicon swap = Phase 4. **Don't hand-draw or hand-de-round — use vtracer polygon mode.**
- todos.md deduped; `bugs.md` is Patrick's scratch (fails cspell — suggest gitignore)

**Plan phases**: 1 Content/honesty+Yinz+SEO → 2 AppButton component+radius tokens → 3 nav full-width top bar → 4 a11y/OG+logo.

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
- [2026-06-02] **Logo = geometric convergence/wedge-to-point** (GPT brief) — NO literal cheese, subtle wedge easter egg, monochrome-safe. Name stays "Cheddar" (Cheddar=Value). Patrick generating via external AI; wire in + favicon swap at Phase 4.
- [2026-06-02] **Brand narrative**: Cheddar=Value · Redaction=Removing Noise · Leadership=Creating Alignment · Engineering=Creating Leverage. Tagline candidate (Patrick undecided).
- [2026-06-02] **Honesty corrections (job-hunt.md is source of truth)** — site had a LIVE false claim ("trading platform profitable for over a year" — it's NOT). Plan Phase 1 fixes: drop profit claim, 88/282→100+/190+, 300-500M→~100M+, exactly-once→effectively-once, AWS cost-reduction→re-architected, Tessa→in-progress, DROP unverified latency numbers, ADD Yinz (LLVM compiler) + OpenAI-in-prod.

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
- Tessa AI: custom LLM in Rust, CUDA kernels, burn framework, 34GB corpus
- error-decoder: monetized, now private repo
