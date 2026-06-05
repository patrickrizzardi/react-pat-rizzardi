# Cleanup Report

**Analyzed**: 2026-06-03  
**Scope**: src/, public/, root config files  
**Dead Code Found**: 6 instances (high confidence)

---

## Findings by Category

### Unused Type Fields (1 found)

- **`src/types/project.ts:35`** — `extensionUrl: string | null;` in `StandardProject` interface
  - Evidence: Declared in type definition, populated in `src/data/projects.ts` (lines 182, 194, 206), but never referenced in any component's render logic
  - Grep result: No matches for `extensionUrl` in `/src/components/`
  - Impact: Dead field in 3 project records (error-decoder, yinzerflow, wow-inventory)
  - Safe to remove: Yes — verified no dynamic usage patterns

---

### Unused CSS Variables (2 found)

#### 1. `--card-radius` (duplicate + unused)
- **`src/assets/main.css:31`** — `--card-radius: 14px;` in `@theme` block
- **`src/assets/main.css:70`** — `--card-radius: 14px;` in `:root` block
- Evidence: Declared in both places; grep for `--card-radius` returns only the two declarations, zero usage
- Impact: Dead variable consuming maintenance burden (two copies to keep in sync)
- Safe to remove: Yes — `--btn-radius` is used elsewhere (AppButton.vue:89); `--card-radius` is orphaned

#### 2. `--color-*` CSS variables (unused theme block)
- **`src/assets/main.css:18-22`** — `--color-burnt`, `--color-burnt-hi`, `--color-cheddar`, `--color-cheddar-hi`, `--color-ember` in `@theme` block
- Evidence: Declared only in `@theme`; never referenced via `var(--color-*)` in any component or stylesheet
  - Grep for `--color-cheddar` / `--color-burnt` / `--color-ember`: found only in main.css declarations
  - Components use `var(--burnt)`, `var(--burnt-hi)`, `var(--cheddar)`, `var(--cheddar-hi)`, `var(--ember)` (defined in `:root`, lines 55-59)
- Impact: Duplicate variable namespace (color- prefix) that shadows the non-prefixed versions used everywhere
- Safe to remove: Yes — equivalent `:root` versions exist and are actively used

---

### Unused React Props / State (1 found)

- **`src/components/systems/SystemsSection.vue:50`** — `const expandedCard = ref<string | null>(null);`
  - Evidence: Declared on line 50; template (lines 61-293) never reads or writes to `expandedCard`; no `v-if="expandedCard"`, no `@click="expandedCard = ..."`, no interpolation
  - Context: Likely leftover from a planned card-expansion feature that was never completed
  - Safe to remove: Yes — verified via full template scan

---

### Inert Markup (Dead CSS Classes) (1 found)

- **`src/components/ui/AppButton.vue:212`** — `:class="\`app-btn app-btn--${variant}\`"`
  - Evidence: Component emits BEM-style classes (`app-btn`, `app-btn--primary`, `app-btn--ghost`, `app-btn--chip`, `app-btn--text`, `app-btn--nav`) but zero stylesheet rules match these selectors
    - All styling comes from inline `computed()` style bindings (baseStyle, variantStyle, hoverStyle, blockStyle, activeStyle, accentStyle, computedStyle)
    - Grep for `app-btn`: found only in AppButton.vue line 212 (the declaration), zero matches in .css or other .vue files
  - Impact: Dead markup; classes are rendered to DOM but do nothing (no CSS hooks)
  - Safe to remove: Yes — all styling is already via computed styles; classes add zero value

---

### Orphaned Public Assets (2 found, medium confidence)

- **`public/cheddar-emblem.png`** — orphaned image file
  - Evidence: Not referenced in any active source file; found only in plan/state documentation
  - Context: From rebrand project (superseded by `cheddar-logo.svg`)
  - Safe to remove: Verify — check if used in any external links, social metadata, or build output not visible to grep

- **`public/cheddar-logo.png`** — orphaned image file
  - Evidence: Not referenced in any active source file; found only in plan/state documentation
  - Context: From rebrand project (superseded by `cheddar-logo.svg`)
  - Safe to remove: Verify — check if used in any external links, social metadata, or build output not visible to grep

---

## Priority

### Must Clean (High Confidence)

1. **Remove `extensionUrl` from `StandardProject` interface** (`src/types/project.ts:35`)
   - Safe: No render branch anywhere, no dynamic references detected
   - Cleanup: Delete field definition + all 3 occurrences in `src/data/projects.ts` (lines 182, 194, 206)

2. **Remove duplicate `--card-radius`** (`src/assets/main.css:70`)
   - Safe: `:root` version is in-use via var(--radius); this one is never referenced
   - Cleanup: Delete line 70 (leave line 31 in `@theme` for consistency, or delete both if `@theme` duplication is intentional per Tailwind v4 design)

3. **Remove unused `--color-*` theme variables** (`src/assets/main.css:18-22`)
   - Safe: Equivalent `:root` versions (--burnt, --cheddar, --ember, etc.) are actively used
   - Cleanup: Delete lines 18-22 from `@theme` block to eliminate duplicate namespace

4. **Remove `expandedCard` ref** (`src/components/systems/SystemsSection.vue:50`)
   - Safe: Never read or written in template; safe to delete declaration + import context
   - Cleanup: Delete line 50 (declaration and comma removal on line 2 if needed)

5. **Remove `app-btn` BEM classes** (`src/components/ui/AppButton.vue:212`)
   - Safe: All styling is computed; classes add zero visual/functional value
   - Cleanup: Change line 212 to `:class="null"` or remove `:class` binding entirely (component still renders, no style loss)

### Verify First (Medium Confidence)

1. **`public/cheddar-emblem.png` and `public/cheddar-logo.png`**
   - May be referenced in: build-time metadata, external links (Twitter, Open Graph), third-party integrations, or SSG output not visible to grep
   - Action: Check build output, verify social preview, confirm no external site references before deletion

---

## Escalated (Need Decision)

None. All findings are confirmed dead code with clear removal paths.

---

## Notes

- **CSS variable duplication**: The `@theme` block and `:root` block both define similar variables. Tailwind v4 may have intended the `@theme` block for design tokens, but all active code uses the `:root` versions. The `@theme` color- prefixed variables are dead; recommend cleaning them up for clarity.

- **Lint limitations**: oxlint correctly did not flag these because:
  - Unused variables in Vue require template tracing (oxlint can't fully trace Vue templates)
  - CSS custom properties unused by imports are not caught (no CSS dead-code analyzer is standard)
  - Type fields unused at runtime (TypeScript-only) are not flagged unless explicitly checked
