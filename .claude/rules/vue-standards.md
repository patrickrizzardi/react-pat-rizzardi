> Extends `~/.claude/rules/vue.md` (generic Vue 3 + reusability mandate — auto-loaded). Below: PROJECT-specific deltas only.

# Redact Digital — Vue Project Deltas

## Component Script Order

Every `.vue` file uses this internal order inside `<script setup lang="ts">`:

```
// 1. Imports
// 2. Props & emits
// 3. Composables & injections
// 4. Reactive state
// 5. Computed properties
// 6. Watchers
// 7. Functions
// 8. Lifecycle hooks
```

---

## Styling: Tailwind Only

No `<style>` blocks — use Tailwind utility classes. **Two exceptions**:

1. **`<Transition>` animations** — use `<style scoped>` for enter/leave CSS classes.
2. Nothing else.

```vue
<Transition name="fade">
  <div v-if="visible">Content</div>
</Transition>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
```

---

## UI Primitives: Reka UI

Use Reka UI headless components for: Dialog, Popover, Combobox, Select, Dropdown, Tooltip, Tabs, Accordion. Don't roll your own — Reka handles keyboard navigation, focus management, and ARIA attributes. Style with Tailwind.

---

## Icons: Lucide

Icons come from `lucide-vue-next`. Don't mix icon libraries. Tree-shakeable.

---

## HTTP Client: Native Fetch Wrapper

No Axios. Use native `fetch` with a thin typed wrapper. Never call `fetch()` directly from components — always go through `api.*`.

---

## Dark Mode

Use Tailwind's class strategy:

```vue
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
```
