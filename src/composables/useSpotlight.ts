import { onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';

export const useSpotlight = (el: Ref<HTMLElement | null>): void => {
  const handleMove = (e: MouseEvent): void => {
    if (!el.value) return;
    const rect = el.value.getBoundingClientRect();
    el.value.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    el.value.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  };

  const handleEnter = (): void => {
    el.value?.style.setProperty('--spot-opacity', '1');
  };

  const handleLeave = (): void => {
    el.value?.style.setProperty('--spot-opacity', '0');
  };

  onMounted(() => {
    const node = el.value;
    if (!node) return;
    node.addEventListener('mousemove', handleMove);
    node.addEventListener('mouseenter', handleEnter);
    node.addEventListener('mouseleave', handleLeave);
  });

  onUnmounted(() => {
    const node = el.value;
    if (!node) return;
    node.removeEventListener('mousemove', handleMove);
    node.removeEventListener('mouseenter', handleEnter);
    node.removeEventListener('mouseleave', handleLeave);
  });
};
