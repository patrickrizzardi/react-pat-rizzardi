<script setup lang="ts">
  import { nextTick, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { Menu } from 'lucide-vue-next';
  import CheddarWordmark from './CheddarWordmark.vue';
  import MobileMenu from './MobileMenu.vue';

  const route = useRoute();
  const router = useRouter();

  const mobileOpen = ref(false);
  const linkHover = ref<string | null>(null);
  const ctaHover = ref(false);

  const navLinks = [
    { id: 'principles', label: 'principles' },
    { id: 'systems', label: 'systems' },
    { id: 'leadership', label: 'leadership' },
    { id: 'writing', label: 'writing' },
  ] as const;

  const scrollToId = (id: string): void => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
  };

  // Nav targets are sections that only exist on the home route. Off-home (e.g. /blog),
  // route home first, then scroll once the freshly-mounted sections have settled layout
  // (rAF after nextTick) so offsetTop measures against the real position, not 0.
  const goTo = async (id: string): Promise<void> => {
    mobileOpen.value = false;
    if (route.path !== '/') {
      await router.push('/');
      await nextTick();
      requestAnimationFrame(() => scrollToId(id));
      return;
    }
    scrollToId(id);
  };
</script>

<template>
  <nav
    class="fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center rounded-full border"
    style="
      gap: 4px;
      padding: 10px 14px 10px 18px;
      background: var(--card);
      backdrop-filter: blur(14px) saturate(140%);
      -webkit-backdrop-filter: blur(14px) saturate(140%);
      border-color: var(--line);
      box-shadow:
        0 10px 40px -10px oklch(0 0 0 / 0.5),
        inset 0 1px 0 oklch(1 0 0 / 0.04);
    "
  >
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
      <div
        class="mx-3 h-[18px] w-px"
        style="background: var(--line)"
      />

      <button
        v-for="link in navLinks"
        :key="link.id"
        type="button"
        class="cursor-pointer rounded-full px-3 py-1.5 transition-colors duration-200 select-none"
        :style="{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: linkHover === link.id ? 'var(--text)' : 'var(--text-2)',
          background: linkHover === link.id ? 'oklch(1 0 0 / 0.04)' : 'transparent',
          border: 'none',
        }"
        @click="goTo(link.id)"
        @mouseenter="linkHover = link.id"
        @mouseleave="linkHover = null"
      >
        {{ link.label }}
      </button>

      <button
        type="button"
        class="ml-1 cursor-pointer rounded-full border px-[14px] py-2 transition-colors duration-200 select-none"
        :style="{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          fontWeight: '600',
          color: ctaHover ? 'var(--burnt-hi)' : 'var(--text)',
          background: ctaHover ? 'oklch(0.66 0.17 48 / 0.12)' : 'transparent',
          borderColor: 'var(--burnt)',
        }"
        @click="goTo('contact')"
        @mouseenter="ctaHover = true"
        @mouseleave="ctaHover = false"
      >
        hire ↗
      </button>
    </div>

    <!-- Mobile hamburger -->
    <button
      type="button"
      aria-label="Open menu"
      class="ml-3 cursor-pointer p-1 md:hidden"
      style="color: var(--text-3)"
      :aria-expanded="mobileOpen"
      @click="mobileOpen = true"
    >
      <Menu :size="18" />
    </button>
  </nav>

  <MobileMenu
    :open="mobileOpen"
    :links="navLinks"
    @close="mobileOpen = false"
    @navigate="goTo"
  />
</template>
