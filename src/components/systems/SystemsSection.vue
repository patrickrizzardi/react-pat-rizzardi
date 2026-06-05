<script setup lang="ts">
  import { computed, ref } from 'vue';
  import type { Project } from '@/types/project';
  import CodeSnippet from '@/components/projects/CodeSnippet.vue';
  import AppButton from '@/components/ui/AppButton.vue';
  import { projects } from '@/data/projects';

  const taglineMap: Record<string, string> = {
    'tessa-ai': 'LLM from bare metal — custom CUDA, three architectures, no shortcuts.',
    'trading-v3': 'Fault-tolerant by design. v1 and v2 taught me what not to do.',
    yinz: 'LLVM native code from Rust — compiler, LSP, formatter, all incremental.',
  };

  const secondaryTag = (p: Project): string => {
    if (p.tier === 'experience') return 'live';
    if (p.id === 'error-decoder') return 'archived';
    return 'open source';
  };

  const secondaryRole = (p: Project): string => {
    if (p.tier === 'experience') return `${p.role} · ${p.period}`;
    if (p.id === 'error-decoder') return 'Solo · Browser extension + web · 2023 (archived)';
    if (p.id === 'yinzerflow') return 'Open source · Node framework · 2024';
    return 'Solo · Lua addon · 2022';
  };

  const statusMap: Record<string, string> = {
    'tessa-ai': 'training',
    'trading-v3': 'active',
    yinz: 'in dev',
  };

  const featured = computed(() =>
    projects
      .filter((p) => p.tier === 'featured')
      .map((p, i) => ({
        ...p,
        rank: String(i + 1).padStart(2, '0'),
        tagline: taglineMap[p.id] ?? '',
        status: statusMap[p.id] ?? 'open source',
        // Resolved here (not in the template) so the CodeSnippet bindings need no non-null assertion.
        // Reading getActiveSnippetIndex makes this recompute when a snippet tab is clicked.
        activeSnippet: p.snippets[getActiveSnippetIndex(p.id)] ?? p.snippets[0] ?? null,
      })),
  );

  const secondary = computed(() =>
    projects
      .filter((p) => p.tier === 'experience' || p.tier === 'standard')
      .map((p) => ({ ...p, tag: secondaryTag(p), roleLabel: secondaryRole(p) })),
  );

  const tagColors: Record<string, string> = {
    live: 'oklch(0.74 0.21 145)',
    'open source': 'var(--color-fg-3)',
    archived: 'var(--color-fg-4)',
    active: 'var(--color-burnt-hi)',
    training: 'oklch(0.74 0.21 145)',
    'in dev': 'var(--color-fg-3)',
  };

  // Per-card active snippet index — keyed by project id so each card is independent.
  const activeSnippetIndex = ref<Record<string, number>>({});

  const getActiveSnippetIndex = (id: string): number => activeSnippetIndex.value[id] ?? 0;

  const setActiveSnippetIndex = (id: string, index: number): void => {
    activeSnippetIndex.value = { ...activeSnippetIndex.value, [id]: index };
  };
</script>

<template>
  <section
    id="systems"
    class="relative py-[120px]"
  >
    <div class="mx-auto max-w-6xl px-6">
      <div class="eyebrow mb-5">systems</div>
      <h2
        class="mb-[64px] font-display text-[clamp(32px,4vw,56px)] leading-[1.05] font-extrabold tracking-[-0.03em] text-fg"
      >
        what I've built
      </h2>

      <!-- Featured projects -->
      <div class="mb-12 flex flex-col gap-6">
        <div
          v-for="p in featured"
          :key="p.id"
          class="overflow-hidden rounded-2xl border border-line bg-card"
          style="box-shadow: var(--card-shadow)"
        >
          <div class="grid grid-cols-1 lg:grid-cols-2">
            <!-- Left: info -->
            <div class="border-r border-line p-[40px]">
              <!-- Rank + status -->
              <div class="mb-6 flex items-center justify-between">
                <span class="font-mono text-[11px] font-bold tracking-[0.1em] text-fg-4">{{ p.rank }}</span>
                <div class="flex items-center gap-2">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.1em] uppercase"
                    :style="{
                      color: tagColors[p.status] ?? 'var(--color-fg-3)',
                      borderColor: tagColors[p.status] ?? 'var(--color-line)',
                      background:
                        p.status === 'active' ? 'oklch(0.66 0.17 48 / 0.1)'
                        : p.status === 'training' ? 'oklch(0.74 0.21 145 / 0.08)'
                        : 'transparent',
                    }"
                    >{{ p.status }}</span
                  >
                </div>
              </div>

              <h3 class="mb-2 font-display text-[28px] font-extrabold tracking-[-0.02em] text-fg">
                {{ p.title }}
              </h3>
              <p class="mb-5 font-mono text-[13px] text-burnt-hi">
                {{ p.tagline }}
              </p>
              <p class="mb-6 text-[14px] leading-[1.7] text-fg-2">
                {{ p.description }}
              </p>

              <!-- Tech chips -->
              <div class="mb-6 flex flex-wrap gap-2">
                <span
                  v-for="t in p.tech"
                  :key="t"
                  class="rounded-full border border-line-soft bg-surface-3 px-2.5 py-1 font-mono text-[11px] text-fg-3"
                  >{{ t }}</span
                >
              </div>

              <!-- Architecture note -->
              <div
                v-if="p.tier === 'featured'"
                class="rounded-lg border-l-2 border-burnt bg-surface-3 px-4 py-3"
              >
                <div class="eyebrow mb-2 text-[10px] text-burnt">architecture note</div>
                <p class="m-0 text-[13px] leading-[1.6] text-fg-3">{{ p.archNotes }}</p>
              </div>

              <!-- Featured repo link (only when a public repo exists) -->
              <div
                v-if="p.tier === 'featured' && p.repoUrl"
                class="mt-4"
              >
                <AppButton
                  variant="chip"
                  as="a"
                  :href="p.repoUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  >↗ repo</AppButton
                >
              </div>
            </div>

            <!-- Right: code peek -->
            <div
              v-if="p.tier === 'featured' && p.snippets.length > 0"
              class="bg-card-deep p-8"
            >
              <!-- Snippet tabs — only rendered when there are 2+ snippets -->
              <div
                v-if="p.snippets.length > 1"
                class="mb-4 flex gap-1"
              >
                <button
                  v-for="(snippet, idx) in p.snippets"
                  :key="snippet.label"
                  type="button"
                  class="cursor-pointer rounded-md border px-3 py-1.5 font-mono text-[10px] font-semibold tracking-[0.06em] uppercase transition-colors duration-150"
                  :style="{
                    color: getActiveSnippetIndex(p.id) === idx ? 'var(--color-burnt-hi)' : 'var(--color-fg-4)',
                    borderColor: getActiveSnippetIndex(p.id) === idx ? 'var(--color-burnt)' : 'var(--color-line-soft)',
                    background: getActiveSnippetIndex(p.id) === idx ? 'oklch(0.66 0.17 48 / 0.1)' : 'transparent',
                  }"
                  @click="setActiveSnippetIndex(p.id, idx)"
                >
                  {{ snippet.label }}
                </button>
              </div>

              <CodeSnippet
                v-if="p.activeSnippet"
                :code="p.activeSnippet.code"
                :language="p.activeSnippet.language"
                :label="p.activeSnippet.label"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Secondary projects grid -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="p in secondary"
          :key="p.id"
          class="flex flex-col gap-4 rounded-xl border border-line bg-card p-6"
          style="box-shadow: var(--card-shadow)"
        >
          <div class="flex items-start justify-between gap-2">
            <h3 class="m-0 font-display text-[16px] font-bold tracking-[-0.01em] text-fg">
              {{ p.title }}
            </h3>
            <span
              class="shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.08em] uppercase"
              :style="{
                color: tagColors[p.tag] ?? 'var(--color-fg-3)',
                borderColor: tagColors[p.tag] ?? 'var(--color-line)',
              }"
              >{{ p.tag }}</span
            >
          </div>

          <p class="m-0 font-mono text-[11px] text-fg-4">
            {{ p.roleLabel }}
          </p>

          <p class="m-0 flex-1 text-[13px] leading-[1.6] text-fg-3">
            {{ p.description }}
          </p>

          <!-- Links — ExperienceProject has liveUrl as required string; StandardProject has string | null -->
          <div class="mt-auto flex flex-wrap gap-2">
            <AppButton
              v-if="p.liveUrl"
              variant="chip"
              as="a"
              :href="p.liveUrl"
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              accent
              >↗ live</AppButton
            >
            <AppButton
              v-if="'repoUrl' in p && p.repoUrl"
              variant="chip"
              as="a"
              :href="p.repoUrl"
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              >↗ repo</AppButton
            >
            <AppButton
              v-if="'npmUrl' in p && p.npmUrl"
              variant="chip"
              as="a"
              :href="p.npmUrl"
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              >↗ npm</AppButton
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
