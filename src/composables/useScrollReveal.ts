import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';

export const useScrollReveal = (el: Ref<HTMLElement | null>, threshold = 0.15): { revealed: Ref<boolean> } => {
  const revealed = ref(false);
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    if (!el.value) return;
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          revealed.value = true;
          observer?.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el.value);
  });

  onUnmounted(() => {
    observer?.disconnect();
  });

  return { revealed } as const;
};
