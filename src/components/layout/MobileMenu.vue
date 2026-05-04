<script setup lang="ts">
  import { watch, onUnmounted } from 'vue';
  import { X } from 'lucide-vue-next';

  const props = defineProps<{
    open: boolean;
    links: ReadonlyArray<{ readonly id: string; readonly label: string }>;
  }>();

  const emit = defineEmits<{
    close: [];
    navigate: [id: string];
  }>();

  watch(
    () => props.open,
    (isOpen) => {
      if (typeof document === 'undefined') return;
      document.body.style.overflow = isOpen ? 'hidden' : '';
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
      @click.self="emit('close')"
    >
      <div
        class="absolute inset-0"
        style="background: oklch(0 0 0 / 0.6)"
      />

      <!-- Menu pill — centered below the nav pill -->
      <div
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

        <a
          v-for="link in links"
          :key="link.id"
          role="button"
          tabindex="0"
          class="cursor-pointer rounded-lg px-3 py-2.5 transition-colors duration-150 select-none"
          style="font-family: var(--font-mono); font-size: 13px; color: var(--text-2)"
          @click="emit('navigate', link.id)"
          @keydown.enter="emit('navigate', link.id)"
          >{{ link.label }}</a
        >

        <div
          class="my-3 h-px"
          style="background: var(--line-soft)"
        />

        <a
          role="button"
          tabindex="0"
          class="cursor-pointer rounded-lg border px-3 py-2.5 text-center transition-colors duration-150 select-none"
          style="
            font-family: var(--font-mono);
            font-size: 13px;
            font-weight: 600;
            color: var(--text);
            border-color: var(--burnt);
          "
          @click="emit('navigate', 'contact')"
          @keydown.enter="emit('navigate', 'contact')"
          >hire ↗</a
        >
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
