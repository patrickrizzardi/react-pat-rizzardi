import { ref, readonly, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';

export const useDecoder = (final: string, delay = 400): Readonly<Ref<string>> => {
  const output = ref(final);
  let rafId = 0;

  onMounted(() => {
    // Respect reduced-motion: skip the scramble, show the final text immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      output.value = final;
      return;
    }
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789_.';
    const start = performance.now() + delay;

    const tick = (t: number): void => {
      if (t < start) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(1, (t - start) / 700);
      const fixed = Math.floor(progress * final.length);
      let s = final.slice(0, fixed);
      for (let i = fixed; i < final.length; i++) {
        const c = final[i];
        if (c === '.' || c === ' ') {
          s += c;
          continue;
        }
        s += chars[Math.floor(Math.random() * chars.length)];
      }
      output.value = s;
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        output.value = final;
      }
    };

    rafId = requestAnimationFrame(tick);
  });

  onUnmounted(() => {
    cancelAnimationFrame(rafId);
  });

  return readonly(output);
};
