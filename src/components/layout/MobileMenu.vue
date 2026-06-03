<script setup lang="ts">
  import { ref, watch, onUnmounted, nextTick } from 'vue';
  import { X } from 'lucide-vue-next';
  import AppButton from '@/components/ui/AppButton.vue';

  const props = defineProps<{
    open: boolean;
    links: ReadonlyArray<{ readonly id: string; readonly label: string }>;
  }>();

  const emit = defineEmits<{
    close: [];
    navigate: [id: string];
  }>();

  const dialogEl = ref<HTMLDivElement | null>(null);

  watch(
    () => props.open,
    (isOpen) => {
      if (typeof document === 'undefined') return;
      document.body.style.overflow = isOpen ? 'hidden' : '';
      // Move focus into the dialog on open so keyboard users land inside it and
      // Esc (handled on the container) works without a prior tab.
      if (isOpen) nextTick(() => dialogEl.value?.focus());
    },
  );

  onUnmounted(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  });
</script>

<template>
  <Transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 z-40 md:hidden"
    >
      <div
        class="absolute inset-0"
        style="background: oklch(0 0 0 / 0.6)"
        @click="emit('close')"
      />

      <!-- Menu pill — centered below the nav pill -->
      <div
        ref="dialogEl"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        tabindex="-1"
        class="absolute top-20 left-1/2 flex min-w-[220px] -translate-x-1/2 flex-col rounded-2xl border px-4 py-5"
        style="
          background: var(--card);
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
          border-color: var(--line);
          box-shadow:
            0 20px 60px -20px oklch(0 0 0 / 0.7),
            inset 0 1px 0 oklch(1 0 0 / 0.04);
        "
        @keydown.esc="emit('close')"
      >
        <button
          type="button"
          aria-label="Close menu"
          class="mb-3 cursor-pointer self-end p-1"
          style="color: var(--text-3)"
          @click="emit('close')"
        >
          <X :size="16" />
        </button>

        <AppButton
          v-for="link in links"
          :key="link.id"
          variant="nav"
          block
          @click="emit('navigate', link.id)"
        >
          {{ link.label }}
        </AppButton>

        <div
          class="my-3 h-px"
          style="background: var(--line-soft)"
        />

        <AppButton
          variant="ghost"
          block
          @click="emit('navigate', 'contact')"
        >
          hire ↗
        </AppButton>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
