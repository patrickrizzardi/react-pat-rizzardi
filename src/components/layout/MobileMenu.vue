<script setup lang="ts">
  import { watch } from 'vue';
  import { X, Moon, Sun } from 'lucide-vue-next';

  const props = defineProps<{
    open: boolean;
    isDark: boolean;
    links: ReadonlyArray<{ readonly label: string; readonly href: string }>;
  }>();

  const emit = defineEmits<{
    close: [];
    toggleTheme: [];
  }>();

  const handleNav = (): void => {
    emit('close');
  };

  watch(
    () => props.open,
    (isOpen) => {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    },
  );
</script>

<template>
  <Transition name="slide">
    <div
      v-if="open"
      class="fixed inset-0 z-50 md:hidden"
    >
      <div
        class="absolute inset-0 bg-black/60"
        @click="emit('close')"
      />

      <div class="absolute top-0 right-0 flex h-full w-64 flex-col bg-navy-800 p-6">
        <button
          type="button"
          aria-label="Close menu"
          class="mb-8 self-end text-gray-400 transition-colors hover:text-cyan"
          @click="emit('close')"
        >
          <X :size="24" />
        </button>

        <RouterLink
          v-for="link in links"
          :key="link.label"
          :to="link.href"
          class="py-3 text-lg text-gray-300 transition-colors hover:text-cyan"
          @click="handleNav"
        >
          {{ link.label }}
        </RouterLink>

        <button
          type="button"
          class="mt-8 flex items-center gap-3 text-gray-400 transition-colors hover:text-cyan"
          @click="emit('toggleTheme')"
        >
          <Moon
            v-if="isDark"
            :size="18"
          />
          <Sun
            v-else
            :size="18"
          />
          <span class="text-sm">{{ isDark ? 'Dark' : 'Light' }} mode</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
  .slide-enter-active,
  .slide-leave-active {
    transition: opacity 0.2s ease;
  }
  .slide-enter-active > div:last-child,
  .slide-leave-active > div:last-child {
    transition: transform 0.2s ease;
  }
  .slide-enter-from,
  .slide-leave-to {
    opacity: 0;
  }
  .slide-enter-from > div:last-child,
  .slide-leave-to > div:last-child {
    transform: translateX(100%);
  }
</style>
