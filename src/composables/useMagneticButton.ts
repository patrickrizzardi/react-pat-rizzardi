import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';

interface MagneticButtonReturn {
  readonly buttonRef: Ref<HTMLElement | null>;
  readonly onMouseMove: (e: MouseEvent) => void;
  readonly onMouseLeave: () => void;
}

export const useMagneticButton = (): MagneticButtonReturn => {
  const buttonRef = ref<HTMLElement | null>(null);
  let reducedMotion = false;

  onMounted(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const onMouseMove = (e: MouseEvent): void => {
    const el = buttonRef.value;
    if (!el || reducedMotion) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.25;
    const y = (e.clientY - r.top - r.height / 2) * 0.25;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const onMouseLeave = (): void => {
    const el = buttonRef.value;
    if (!el) return;
    el.style.transform = 'translate(0, 0)';
  };

  return { buttonRef, onMouseMove, onMouseLeave } as const;
};
