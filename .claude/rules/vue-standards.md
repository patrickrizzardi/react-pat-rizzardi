# Vue 3 + Tailwind Standards

All frontend code uses Vue 3 Composition API with `<script setup>`, TypeScript, and Tailwind CSS.

---

## Component Structure

Every `.vue` file follows this order:

```vue
<script setup lang="ts">
  // 1. Imports
  // 2. Props & emits
  // 3. Composables & injections
  // 4. Reactive state
  // 5. Computed properties
  // 6. Watchers
  // 7. Functions
  // 8. Lifecycle hooks
</script>

<template>
  <!-- Single root element preferred but not required (Vue 3 supports fragments) -->
</template>
```

No `<style>` blocks — use Tailwind utility classes. The one exception is Vue `<Transition>` animations (see Transitions section). If component-specific styles are absolutely necessary beyond transitions, use `<style scoped>` as a last resort.

---

## Reactivity

### Use ref() over reactive()

`ref()` is the default for all state. `reactive()` has footguns that `ref()` avoids.

```typescript
// ✅ Good
const count = ref(0);
const user = ref<User | null>(null);

// ❌ Avoid
const state = reactive({ count: 0, user: null as User | null });
```

**Why**: `reactive()` loses reactivity when destructured, can't be reassigned, and has proxy identity issues with `===`. `ref()` is predictable — always use `.value` in scripts, auto-unwraps in templates.

### Never destructure reactive() objects

```typescript
// ❌ Kills reactivity
const { name, email } = reactive({ name: 'test', email: 'test@test.com' });

// ✅ If you must use reactive, access properties directly
const state = reactive({ name: 'test', email: 'test@test.com' });
// use state.name, state.email
```

### Use shallowRef() for large objects and non-reactive library instances

```typescript
// ❌ Deep reactivity overhead on chart library instance
const chart = ref(new ChartInstance());

// ✅ Shallow — only triggers on .value reassignment
const chart = shallowRef(new ChartInstance());
```

Also use `markRaw()` for objects that should never be reactive (library instances, class instances with internal state).

---

## Computed

### No side effects in computed getters

Computed getters must be pure — no API calls, no mutations, no DOM manipulation.

### Computed over methods for derived state

```typescript
// ❌ Recalculates every render
const getFullName = (): string => `${first.value} ${last.value}`;

// ✅ Cached until dependencies change
const fullName = computed(() => `${first.value} ${last.value}`);
```

### Never mutate source data in computed — return new arrays/objects

```typescript
// ❌ Mutates original array
const sorted = computed(() => items.value.sort((a, b) => a - b));

// ✅ Returns new array
const sorted = computed(() => [...items.value].sort((a, b) => a - b));
```

### Use computed for conditional class logic

```typescript
const statusClass = computed(() => {
  const classes: Record<string, string> = {
    error: 'bg-red-500',
    ok: 'bg-green-500',
    warn: 'bg-yellow-500',
  };
  return classes[status.value] ?? 'bg-gray-500';
});
```

---

## Watchers

### Use getter function to watch reactive object properties

```typescript
// ✅ Watches specific property
watch(
  () => state.count,
  (newVal) => {
    /* fires only when count changes */
  },
);
```

### Avoid deep watch on large objects — use specific property watches

### Use watchEffect for side effects that depend on multiple reactive sources

### watch vs watchEffect

- `watch`: explicit sources, access to old + new values, lazy by default
- `watchEffect`: auto-tracks dependencies, runs immediately, no old value access

Use `watch` when you need old/new comparison. Use `watchEffect` for "run this whenever any dependency changes."

---

## Components

### Props down, events up

Parents pass data via props. Children communicate via `defineEmits()`. No `ref()` access to child components for data flow.

```typescript
// ✅ Child component
const props = defineProps<{ title: string; active: boolean }>();
const emit = defineEmits<{ update: [value: string] }>();
```

### Use provide/inject for deep component trees (avoid prop drilling)

Use Symbol keys to avoid collisions. Mutations happen in the provider, not consumers.

### Pinia vs provide/inject

- **Pinia stores** — app-wide state that multiple unrelated components need. Survives navigation.
- **provide/inject** — scoped state within a component subtree. Dies when the provider unmounts.

### PascalCase for component names in templates

```vue
<!-- ✅ -->
<TradeCard :symbol="sym" />

<!-- ❌ -->
<trade-card :symbol="sym" />
```

### Prefer local component registration

Only register globally if the component is used in 5+ places across the app. Global registration defeats tree-shaking.

---

## TypeScript Integration

### Type-based defineProps (no runtime declaration)

```typescript
const props = defineProps<{
  title: string;
  count: number;
  items?: Array<Item>;
}>();

// With defaults
const props = withDefaults(
  defineProps<{
    title: string;
    limit?: number;
  }>(),
  { limit: 50 },
);
```

### Type-based defineEmits

```typescript
const emit = defineEmits<{
  select: [id: string];
  update: [value: number];
}>();
```

### Template refs need null handling

```typescript
const el = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!el.value) return;
  initChart(el.value);
});
```

### Use defineModel for two-way binding

```typescript
const modelValue = defineModel<string>({ required: true });
// Parent: <SearchInput v-model="query" />
```

---

## Composables

### Naming: use{Feature}, return object with named refs

```typescript
export const useTheme = () => {
  const isDark = ref(true);
  const toggle = () => { isDark.value = !isDark.value; };
  return { isDark, toggle } as const;
};
```

### Composable vs utility function

- **Composable**: uses Vue reactivity (ref, computed, watch, lifecycle hooks). Lives in `composables/`.
- **Utility**: pure function, no Vue dependency. Lives in `utils/`.

### Expose readonly state, keep mutations internal

```typescript
export const useItems = () => {
  const _items = ref<Array<Item>>([]);
  const items = readonly(_items);
  const add = (item: Item): void => { _items.value.push(item); };
  return { items, add } as const;
};
```

---

## Templates

### Never use v-html with untrusted content (XSS)

### Never combine v-if and v-for on the same element

```vue
<!-- ❌ v-if evaluated for every item -->
<li v-for="item in items" v-if="item.active">

<!-- ✅ Filter first with computed -->
<li v-for="item in activeItems">
```

### Use v-show for frequent toggles, v-if for rare ones

### Always use :key with v-for

```vue
<ProjectCard v-for="project in projects" :key="project.id" :project="project" />
```

---

## Tailwind CSS

### No utility extraction for one-off styles

Use Tailwind classes directly in templates. Don't create `@apply` abstractions unless the same combination is used in 2+ places.

### Dynamic classes — use object syntax or computed

### Never concatenate Tailwind class names dynamically

```typescript
// ❌ Tailwind can't detect these at build time
const color = `text-${status}-500`;

// ✅ Use complete class names
const colorMap: Record<string, string> = {
  success: 'text-green-500',
  error: 'text-red-500',
};
```

### Responsive design: mobile-first

```vue
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### Dark mode: use class strategy

```vue
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
```

---

## State Management: Pinia

### Setup-style stores, one per domain

```typescript
export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Array<Project>>([]);
  const selectedId = ref<string | null>(null);
  const selected = computed(() => projects.value.find((p) => p.id === selectedId.value) ?? null);

  const select = (id: string) => { selectedId.value = id; };

  return { projects, selectedId, selected, select };
});
```

### Pinia rules

- **One store per domain**. No mega-stores.
- **Setup-style** (`defineStore('name', () => { ... })`). Options-style stores are banned.
- **Actions mutate, getters derive** — computed properties are read-only; mutations happen in named functions.

---

## UI Libraries

### Reka UI for interactive primitives

Use Reka UI headless components for: Dialog, Popover, Combobox, Select, Dropdown, Tooltip, Tabs, Accordion. Don't roll your own — Reka handles keyboard navigation, focus management, ARIA attributes.

### Lucide for icons

Icons come from `lucide-vue-next`. Don't mix icon libraries. Tree-shakeable — only icons you import are bundled.

---

## Performance

### Lazy-load heavy components

```typescript
const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: ChartSkeleton,
  delay: 200,
});
```

### Use v-once for static content

### Use shallowRef for large datasets that replace entirely (not mutate)

### Prefer computed over watchers for derived state

---

## Transitions

The one exception to "no `<style>` blocks" — Vue `<Transition>` components need CSS classes:

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

Only use scoped styles for transition animations. Everything else stays in Tailwind.
