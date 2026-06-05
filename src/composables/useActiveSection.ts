import { nextTick, onMounted, onUnmounted, readonly, ref, watch } from 'vue';
import type { Ref } from 'vue';
import { useRoute } from 'vue-router';

// The ordered section ids that exist on the home route — must match AppNav.navLinks.
const HOME_SECTION_IDS = ['principles', 'systems', 'leadership', 'writing'] as const;
type SectionId = (typeof HOME_SECTION_IDS)[number];

interface UseActiveSectionReturn {
  readonly activeSection: Readonly<Ref<SectionId | null>>;
}

export const useActiveSection = (): UseActiveSectionReturn => {
  const route = useRoute();
  const _activeSection = ref<SectionId | null>(null);
  const activeSection = readonly(_activeSection);

  let observer: IntersectionObserver | null = null;

  // Track which sections are currently intersecting so we can pick the topmost visible one.
  const intersecting = new Set<SectionId>();

  const pickActive = (): void => {
    if (intersecting.size === 0) {
      // Nothing intersecting — keep whatever was last active so the indicator doesn't flicker
      // as the user scrolls between sections.
      return;
    }
    // When multiple sections overlap the observe window, prefer the one that appears
    // earliest in document order (top of viewport wins).
    for (const id of HOME_SECTION_IDS) {
      if (intersecting.has(id)) {
        _activeSection.value = id;
        return;
      }
    }
  };

  const teardown = (): void => {
    observer?.disconnect();
    observer = null;
    intersecting.clear();
    _activeSection.value = null;
  };

  const setup = (): void => {
    // SSR guard — document and IntersectionObserver only exist in the browser.
    if (typeof document === 'undefined' || typeof IntersectionObserver === 'undefined') return;

    // Sections only live on the home route.
    if (route.path !== '/') return;

    // rootMargin top offset accounts for the fixed nav (~52px) so a section anchored
    // at the top of the viewport registers as active once it clears the nav bar.
    // The bottom margin shrinks the observe window so a section needs to occupy a
    // meaningful portion of the viewport before it becomes "active".
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as SectionId;
          if (entry.isIntersecting) {
            intersecting.add(id);
          } else {
            intersecting.delete(id);
          }
        }
        pickActive();
      },
      {
        rootMargin: '-60px 0px -40% 0px',
        threshold: 0,
      },
    );

    for (const id of HOME_SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
  };

  onMounted(setup);
  onUnmounted(teardown);
  // AppNav (the consumer) mounts once at the app root and never unmounts across SPA navigation,
  // so onMounted fires only once. Rebuild the observer on every route change — otherwise the
  // highlight stays dead after navigating onto home, or stale after navigating off it. Both
  // setup() (guards route.path !== '/') and teardown() (clears state) are idempotent.
  watch(
    () => route.path,
    async () => {
      teardown();
      // Wait for the destination route's DOM (the home sections) to render before observing —
      // the watch fires on route change, before RouterView swaps in the new component.
      await nextTick();
      setup();
    },
  );

  return { activeSection } as const;
};
