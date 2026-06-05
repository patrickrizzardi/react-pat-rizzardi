<script setup lang="ts">
  import { ref } from 'vue';
  import { timeline, stack } from '@/data/leadership';
  import { useScrollReveal } from '@/composables/useScrollReveal';

  const sectionRef = ref<HTMLElement | null>(null);
  const { revealed } = useScrollReveal(sectionRef);
</script>

<template>
  <section
    id="leadership"
    ref="sectionRef"
    class="reveal relative"
    :class="{ 'is-revealed': revealed }"
    style="padding: 120px 0; background: var(--color-surface-2)"
  >
    <div class="mx-auto max-w-6xl px-6">
      <div class="eyebrow mb-5">leadership</div>
      <h2
        style="
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(32px, 4vw, 56px);
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: var(--color-fg);
          margin: 0 0 16px;
        "
      >
        how I operate
      </h2>
      <p style="font-size: 17px; line-height: 1.6; color: var(--color-fg-2); max-width: 560px; margin: 0 0 72px">
        Self-taught. National Guard NCO. A decade of progressively harder problems — and I still prefer the hard ones.
      </p>

      <!-- Timeline + stack layout -->
      <div class="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <!-- Timeline -->
        <div>
          <div
            class="relative"
            style="padding-left: 28px; border-left: 1px solid var(--color-line)"
          >
            <div
              v-for="entry in timeline"
              :key="entry.year"
              class="relative mb-10 last:mb-0"
            >
              <!-- Rail dot -->
              <div
                class="absolute"
                style="
                  left: -34px;
                  top: 4px;
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  background: var(--color-surface-2);
                  border: 1px solid var(--color-burnt);
                "
              />

              <div
                style="
                  font-family: var(--font-mono);
                  font-size: 11px;
                  color: var(--color-burnt);
                  letter-spacing: 0.1em;
                  margin-bottom: 4px;
                  text-transform: uppercase;
                "
              >
                {{ entry.year }}
              </div>
              <div
                style="
                  font-family: var(--font-display);
                  font-weight: 700;
                  font-size: 16px;
                  color: var(--color-fg);
                  margin-bottom: 2px;
                "
              >
                {{ entry.label }}
              </div>
              <div style="font-family: var(--font-mono); font-size: 12px; color: var(--color-fg-3); margin-bottom: 6px">
                {{ entry.org }}
              </div>
              <p style="font-size: 13px; line-height: 1.6; color: var(--color-fg-3); margin: 0">{{ entry.detail }}</p>
            </div>
          </div>
        </div>

        <!-- Stack table -->
        <div>
          <div
            class="eyebrow mb-6"
            style="color: var(--color-fg-3)"
          >
            stack
          </div>
          <div class="flex flex-col gap-4">
            <div
              v-for="row in stack"
              :key="row.category"
              class="flex items-baseline gap-4"
            >
              <div
                style="
                  font-family: var(--font-mono);
                  font-size: 11px;
                  color: var(--color-fg-4);
                  min-width: 80px;
                  flex-shrink: 0;
                "
              >
                {{ row.category }}
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="item in row.items"
                  :key="item"
                  class="rounded-full px-2.5 py-1"
                  style="
                    font-family: var(--font-mono);
                    font-size: 11px;
                    color: var(--color-fg-2);
                    background: var(--color-surface-3);
                    border: 1px solid var(--color-line-soft);
                  "
                  >{{ item }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
