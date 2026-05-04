<script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { Project } from '@/types/project';
  import CodeSnippet from '@/components/projects/CodeSnippet.vue';
  import { projects } from '@/data/projects';

  const taglineMap: Record<string, string> = {
    'tessa-ai': 'LLM from bare metal — custom CUDA, no API wrappers.',
    'trading-v3': 'Pays its own bills. v1 and v2 taught me what not to do.',
  };

  const secondaryTag = (p: Project): string => {
    if (p.tier === 'experience') return 'live';
    if (p.id === 'error-decoder') return 'shipped';
    return 'oss';
  };

  const secondaryRole = (p: Project): string => {
    if (p.tier === 'experience') return `${p.role} · ${p.period}`;
    if (p.id === 'error-decoder') return 'Solo · Browser extension + web · 2023 — Present';
    if (p.id === 'yinzerflow') return 'OSS · Node framework · 2024';
    return 'Solo · Lua addon · 2022';
  };

  const featured = computed(() =>
    projects
      .filter((p) => p.tier === 'featured')
      .map((p, i) => ({
        ...p,
        rank: String(i + 1).padStart(2, '0'),
        tagline: taglineMap[p.id] ?? '',
        status: p.id === 'tessa-ai' ? 'training' : 'profitable',
      })),
  );

  const secondary = computed(() =>
    projects
      .filter((p) => p.tier === 'experience' || p.tier === 'standard')
      .map((p) => ({ ...p, tag: secondaryTag(p), roleLabel: secondaryRole(p) })),
  );

  const expandedCard = ref<string | null>(null);
  const tagColors: Record<string, string> = {
    live: 'oklch(0.74 0.21 145)',
    shipped: 'var(--burnt)',
    oss: 'var(--text-3)',
  };
</script>

<template>
  <section
    id="systems"
    class="relative"
    style="padding: 120px 0"
  >
    <div class="mx-auto max-w-6xl px-6">
      <div class="eyebrow mb-5">systems</div>
      <h2
        style="
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(32px, 4vw, 56px);
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: var(--text);
          margin: 0 0 64px;
        "
      >
        what I've built
      </h2>

      <!-- Featured projects -->
      <div class="mb-12 flex flex-col gap-6">
        <div
          v-for="p in featured"
          :key="p.id"
          class="rounded-2xl border"
          style="background: var(--card); border-color: var(--line); box-shadow: var(--card-shadow); overflow: hidden"
        >
          <div class="grid grid-cols-1 lg:grid-cols-2">
            <!-- Left: info -->
            <div style="padding: 40px 40px 40px 40px; border-right: 1px solid var(--line)">
              <!-- Rank + status -->
              <div class="mb-6 flex items-center justify-between">
                <span
                  style="
                    font-family: var(--font-mono);
                    font-size: 11px;
                    font-weight: 700;
                    color: var(--text-4);
                    letter-spacing: 0.1em;
                  "
                  >{{ p.rank }}</span
                >
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
                  style="
                    font-family: var(--font-mono);
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    border: 1px solid;
                  "
                  :style="{
                    color: tagColors[p.status] ?? 'var(--text-3)',
                    borderColor: tagColors[p.status] ?? 'var(--line)',
                    background:
                      p.status === 'profitable' ? 'oklch(0.66 0.17 48 / 0.1)'
                      : p.status === 'training' ? 'oklch(0.74 0.21 145 / 0.08)'
                      : 'transparent',
                  }"
                  >{{ p.status }}</span
                >
              </div>

              <h3
                style="
                  font-family: var(--font-display);
                  font-weight: 800;
                  font-size: 28px;
                  letter-spacing: -0.02em;
                  color: var(--text);
                  margin: 0 0 8px;
                "
              >
                {{ p.title }}
              </h3>
              <p style="font-family: var(--font-mono); font-size: 13px; color: var(--burnt-hi); margin: 0 0 20px">
                {{ p.tagline }}
              </p>
              <p style="font-size: 14px; line-height: 1.7; color: var(--text-2); margin: 0 0 24px">
                {{ p.description }}
              </p>

              <!-- Tech chips -->
              <div class="mb-6 flex flex-wrap gap-2">
                <span
                  v-for="t in p.tech"
                  :key="t"
                  class="rounded-full px-2.5 py-1"
                  style="
                    font-family: var(--font-mono);
                    font-size: 11px;
                    color: var(--text-3);
                    background: var(--bg-3);
                    border: 1px solid var(--line-soft);
                  "
                  >{{ t }}</span
                >
              </div>

              <!-- Architecture note -->
              <div
                v-if="p.tier === 'featured'"
                class="rounded-lg px-4 py-3"
                style="background: var(--bg-3); border-left: 2px solid var(--burnt)"
              >
                <div
                  class="eyebrow mb-2"
                  style="color: var(--burnt); font-size: 10px"
                >
                  architecture note
                </div>
                <p style="font-size: 13px; line-height: 1.6; color: var(--text-3); margin: 0">{{ p.archNotes }}</p>
              </div>
            </div>

            <!-- Right: code peek -->
            <div
              v-if="p.tier === 'featured' && p.snippets[0]"
              style="padding: 32px; background: var(--card-deep)"
            >
              <CodeSnippet
                :code="p.snippets[0].code"
                :language="p.snippets[0].language"
                :label="p.snippets[0].label"
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
          class="flex flex-col gap-4 rounded-xl border"
          style="padding: 24px; background: var(--card); border-color: var(--line); box-shadow: var(--card-shadow)"
        >
          <div class="flex items-start justify-between gap-2">
            <h3
              style="
                font-family: var(--font-display);
                font-weight: 700;
                font-size: 16px;
                letter-spacing: -0.01em;
                color: var(--text);
                margin: 0;
              "
            >
              {{ p.title }}
            </h3>
            <span
              class="shrink-0 rounded-full px-2 py-0.5"
              style="
                font-family: var(--font-mono);
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                border: 1px solid;
              "
              :style="{
                color: tagColors[p.tag] ?? 'var(--text-3)',
                borderColor: tagColors[p.tag] ?? 'var(--line)',
              }"
              >{{ p.tag }}</span
            >
          </div>

          <p style="font-family: var(--font-mono); font-size: 11px; color: var(--text-4); margin: 0">
            {{ p.roleLabel }}
          </p>

          <p style="font-size: 13px; line-height: 1.6; color: var(--text-3); margin: 0; flex: 1">{{ p.description }}</p>

          <!-- Links -->
          <div class="mt-auto flex flex-wrap gap-2">
            <a
              v-if="'liveUrl' in p && p.liveUrl"
              :href="p.liveUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-full px-2.5 py-1 transition-colors duration-150"
              style="
                font-family: var(--font-mono);
                font-size: 11px;
                color: var(--burnt);
                border: 1px solid var(--burnt);
                text-decoration: none;
              "
              >↗ live</a
            >
            <a
              v-if="'repoUrl' in p && p.repoUrl"
              :href="p.repoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-full px-2.5 py-1 transition-colors duration-150"
              style="
                font-family: var(--font-mono);
                font-size: 11px;
                color: var(--text-3);
                border: 1px solid var(--line);
                text-decoration: none;
              "
              >↗ repo</a
            >
            <a
              v-if="'npmUrl' in p && p.npmUrl"
              :href="p.npmUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-full px-2.5 py-1 transition-colors duration-150"
              style="
                font-family: var(--font-mono);
                font-size: 11px;
                color: var(--text-3);
                border: 1px solid var(--line);
                text-decoration: none;
              "
              >↗ npm</a
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
