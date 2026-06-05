<script setup lang="ts">
  import { nextTick, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { Menu } from 'lucide-vue-next';
  import CheddarWordmark from './CheddarWordmark.vue';
  import MobileMenu from './MobileMenu.vue';
  import AppButton from '@/components/ui/AppButton.vue';
  import { scrollToSection } from '@/utils/scroll';
  import { useActiveSection } from '@/composables/useActiveSection';

  const route = useRoute();
  const router = useRouter();

  const mobileOpen = ref(false);
  const { activeSection } = useActiveSection();

  const navLinks = [
    { id: 'principles', label: 'principles' },
    { id: 'systems', label: 'systems' },
    { id: 'leadership', label: 'leadership' },
    { id: 'writing', label: 'writing' },
  ] as const;

  // Nav targets are sections that only exist on the home route. Off-home (e.g. /blog),
  // route home first, then scroll once the freshly-mounted sections have settled layout
  // (rAF after nextTick) so offsetTop measures against the real position, not 0.
  const goTo = async (id: string): Promise<void> => {
    mobileOpen.value = false;
    if (route.path !== '/') {
      await router.push('/');
      await nextTick();
      requestAnimationFrame(() => scrollToSection(id));
      return;
    }
    scrollToSection(id);
  };
</script>

<template>
  <nav
    data-app-nav
    class="fixed top-0 right-0 left-0 z-50 border-b border-line bg-card"
    style="backdrop-filter: blur(14px) saturate(140%); -webkit-backdrop-filter: blur(14px) saturate(140%)"
  >
    <!-- Inner content row: logo left, links + CTA right, constrained to site max-width -->
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
      <button
        type="button"
        aria-label="Scroll to top"
        class="cursor-pointer"
        @click="goTo('top')"
      >
        <CheddarWordmark :size="22" />
      </button>

      <!-- Desktop links -->
      <div class="hidden items-center gap-1 md:flex">
        <AppButton
          v-for="link in navLinks"
          :key="link.id"
          variant="nav"
          :active="link.id === activeSection"
          @click="goTo(link.id)"
        >
          {{ link.label }}
        </AppButton>

        <AppButton
          variant="ghost"
          size="sm"
          class="ml-2"
          @click="goTo('contact')"
        >
          hire ↗
        </AppButton>
      </div>

      <!-- Mobile hamburger -->
      <button
        type="button"
        :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
        class="cursor-pointer p-1 text-fg-3 md:hidden"
        :aria-expanded="mobileOpen"
        @click="mobileOpen = !mobileOpen"
      >
        <Menu :size="18" />
      </button>
    </div>
  </nav>

  <MobileMenu
    v-model:open="mobileOpen"
    :links="navLinks"
    @navigate="goTo"
  />
</template>
