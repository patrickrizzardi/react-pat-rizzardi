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
    class="reveal relative bg-surface-2 py-[120px]"
    :class="{ 'is-revealed': revealed }"
  >
    <div class="mx-auto max-w-6xl px-6">
      <div class="eyebrow mb-5">leadership</div>
      <h2
        class="mb-[16px] font-display text-[clamp(32px,4vw,56px)] leading-[1.05] font-extrabold tracking-[-0.03em] text-fg"
      >
        how I operate
      </h2>
      <p class="mb-[72px] max-w-[560px] text-[17px] leading-[1.6] text-fg-2">
        Self-taught. National Guard NCO. A decade of progressively harder problems — and I still prefer the hard ones.
      </p>

      <!-- Timeline + stack layout -->
      <div class="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <!-- Timeline -->
        <div>
          <div class="relative border-l border-line pl-[28px]">
            <div
              v-for="entry in timeline"
              :key="entry.year"
              class="relative mb-10 last:mb-0"
            >
              <!-- Rail dot -->
              <div
                class="absolute top-[4px] left-[-34px] h-[12px] w-[12px] rounded-full border border-burnt bg-surface-2"
              />

              <div class="mb-[4px] font-mono text-[11px] tracking-[0.1em] text-burnt uppercase">
                {{ entry.year }}
              </div>
              <div class="mb-[2px] font-display text-[16px] font-bold text-fg">
                {{ entry.label }}
              </div>
              <div class="mb-[6px] font-mono text-[12px] text-fg-3">
                {{ entry.org }}
              </div>
              <p class="m-0 text-[13px] leading-[1.6] text-fg-3">{{ entry.detail }}</p>
            </div>
          </div>
        </div>

        <!-- Stack table -->
        <div>
          <div class="eyebrow mb-6 text-fg-3">stack</div>
          <div class="flex flex-col gap-4">
            <div
              v-for="row in stack"
              :key="row.category"
              class="flex items-baseline gap-4"
            >
              <div class="min-w-[80px] shrink-0 font-mono text-[11px] text-fg-4">
                {{ row.category }}
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="item in row.items"
                  :key="item"
                  class="rounded-full border border-line-soft bg-surface-3 px-2.5 py-1 font-mono text-[11px] text-fg-2"
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
