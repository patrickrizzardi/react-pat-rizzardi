<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';

  interface SimpleEdge {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }

  interface ActivePulse {
    edge: SimpleEdge;
    duration: number;
    key: number;
  }

  const seed = (n: number): number => {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  const nodeCount = 800;
  const maxDist = 6;
  const pulseCount = 10;

  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    x: seed(i * 2) * 100,
    y: seed(i * 2 + 1) * 100,
  }));

  const allEdges: ReadonlyArray<SimpleEdge> = nodes.flatMap((a, i) =>
    nodes.slice(i + 1).flatMap((b) => {
      const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
      return dist < maxDist ? [{ x1: a.x, y1: a.y, x2: b.x, y2: b.y }] : [];
    }),
  );

  const randomEdge = (): SimpleEdge => allEdges[Math.floor(Math.random() * allEdges.length)] as SimpleEdge;

  let keyCounter = 0;
  const makePulse = (): ActivePulse => {
    const edge = randomEdge();
    const len = Math.sqrt((edge.x2 - edge.x1) ** 2 + (edge.y2 - edge.y1) ** 2);
    return {
      edge,
      duration: 0.8 + len * 0.4,
      key: keyCounter++,
    };
  };

  const activePulses = ref<Array<ActivePulse>>(Array.from({ length: pulseCount }, () => makePulse()));

  const timers: Array<number> = [];

  const schedulePulse = (index: number, initialDelay: number): void => {
    const tick = (): void => {
      activePulses.value[index] = makePulse();
      const next = (activePulses.value[index] as ActivePulse).duration * 1000;
      timers[index] = window.setTimeout(tick, next);
    };
    timers[index] = window.setTimeout(tick, initialDelay);
  };

  onMounted(() => {
    for (let i = 0; i < pulseCount; i++) {
      schedulePulse(i, Math.random() * 6000);
    }
  });

  onUnmounted(() => {
    timers.forEach((t) => clearTimeout(t));
  });
</script>

<template>
  <svg
    class="pointer-events-none absolute inset-0 h-full w-full opacity-60"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <filter
        id="pulse-glow"
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
      >
        <feGaussianBlur stdDeviation="0.12" />
      </filter>
    </defs>

    <line
      v-for="(edge, i) in allEdges"
      :key="`e${i}`"
      :x1="edge.x1"
      :y1="edge.y1"
      :x2="edge.x2"
      :y2="edge.y2"
      stroke="rgba(34, 211, 238, 0.06)"
      stroke-width="0.08"
    />

    <line
      v-for="pulse in activePulses"
      :key="pulse.key"
      :x1="pulse.edge.x1"
      :y1="pulse.edge.y1"
      :x2="pulse.edge.x2"
      :y2="pulse.edge.y2"
      stroke="white"
      stroke-width="0.12"
      stroke-linecap="round"
      pathLength="100"
      filter="url(#pulse-glow)"
      class="pulse-dot"
      :style="`animation-duration: ${String(pulse.duration)}s`"
    />

    <circle
      v-for="(node, i) in nodes"
      :key="`n${i}`"
      :cx="node.x"
      :cy="node.y"
      r="0.25"
      fill="rgba(34, 211, 238, 0.1)"
    />
  </svg>
</template>

<style scoped>
  .pulse-dot {
    stroke-dasharray: 2.5 97.5;
    animation: travel 5s linear 1;
  }

  @keyframes travel {
    from {
      stroke-dashoffset: 100;
    }
    to {
      stroke-dashoffset: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pulse-dot {
      animation: none;
      stroke-dasharray: none;
    }
  }
</style>
