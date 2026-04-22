<script setup lang="ts">
  import { ref } from 'vue';
  import { Moon, Sun, Menu } from 'lucide-vue-next';
  import { useTheme } from '@/composables/useTheme';
  import MobileMenu from './MobileMenu.vue';

  const { isDark, toggle } = useTheme();
  const mobileOpen = ref(false);

  const navLinks = [
    { label: 'Projects', href: '/#projects' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
    { label: 'Blog', href: '/blog' },
  ] as const;
</script>

<template>
  <nav class="fixed top-0 z-50 w-full border-b border-white/10 bg-navy/80 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
      <RouterLink
        to="/"
        class="transition-opacity hover:opacity-80"
      >
        <img
          src="/assets/logo.png"
          alt="Patrick Rizzardi"
          class="h-8 w-8"
        />
      </RouterLink>

      <div class="hidden items-center gap-8 md:flex">
        <RouterLink
          v-for="link in navLinks"
          :key="link.label"
          :to="link.href"
          class="text-sm text-gray-400 transition-colors hover:text-cyan"
        >
          {{ link.label }}
        </RouterLink>

        <button
          type="button"
          aria-label="Toggle dark mode"
          class="text-gray-400 transition-colors hover:text-cyan"
          @click="toggle"
        >
          <Moon
            v-if="isDark"
            :size="18"
          />
          <Sun
            v-else
            :size="18"
          />
        </button>
      </div>

      <button
        type="button"
        aria-label="Open menu"
        class="text-gray-400 transition-colors hover:text-cyan md:hidden"
        @click="mobileOpen = true"
      >
        <Menu :size="24" />
      </button>
    </div>
  </nav>

  <MobileMenu
    :open="mobileOpen"
    :is-dark="isDark"
    :links="navLinks"
    @close="mobileOpen = false"
    @toggle-theme="toggle"
  />
</template>
