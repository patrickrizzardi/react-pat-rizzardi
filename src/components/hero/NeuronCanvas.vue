<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';

  interface Node {
    x: number;
    y: number;
    base: number;
    level: number;
    r: number;
    nextFire: number;
    connections: Array<number>;
  }

  interface Edge {
    a: number;
    b: number;
    d: number;
    gaps: Array<number>;
  }

  interface Signal {
    edge: number;
    reverse: boolean;
    gap: number;
    gapT: number;
    jumpDur: number;
    gapElapsed: number;
    depth: number;
  }

  interface TrailSegment {
    aT: number;
    bT: number;
    life: number;
  }

  interface Ember {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    hue: number;
    phase: number;
  }

  // Animation tuning — the knobs that shape the neuron field. Grouped so the look can be
  // re-tuned without spelunking the draw loop. Times in ms, distances in px.
  const CANVAS = {
    nodeDensityArea: 6500, // px² of canvas per node (lower = denser field)
    minNodes: 120,
    maxNodes: 380,
    packingFactor: 0.7, // min node spacing as a fraction of the even-distribution distance
    baseOpacityMin: 0.16,
    baseOpacityRange: 0.14,
    radiusMin: 0.9,
    radiusRange: 1.1,
    fireCooldownMinMs: 1500,
    fireCooldownRangeMs: 7000,
    refractoryMinMs: 30000, // post-fire quiet period before a node may spontaneously fire again
    refractoryRangeMs: 45000,
    maxEdgeLengthFraction: 0.28, // longest edge as a fraction of min(width, height)
    jumpDurationBaseMs: 70,
    jumpDurationRangeMs: 50,
    emberDensityArea: 9000,
    spontaneousFireProbability: 0.0022, // per-frame chance a cooled-down node fires on its own
    cascadeContinueProbability: 0.25, // chance a depth>0 signal propagates onward
    trailFadeMs: 900,
    maxFrameDtMs: 48, // clamps dt after a tab resume so the physics step can't explode
    initialFireCount: 2,
    initialFireDelayMs: 400,
    initialFireStaggerMs: 700,
  } as const;

  const canvasRef = ref<HTMLCanvasElement | null>(null);
  let cleanupFn: (() => void) | null = null;

  onMounted(() => {
    const canvas = canvasRef.value;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let nodes: Array<Node> = [];
    let edges: Array<Edge> = [];
    let signals: Array<Signal> = [];
    let embers: Array<Ember> = [];
    let animFrameId = 0;
    // Loop runs only while the canvas is on-screen AND the tab is visible (see updateLoopState).
    let running = false;
    let onScreen = true;
    const trails = new Map<number, Array<TrailSegment>>();
    const timeouts: Array<ReturnType<typeof setTimeout>> = [];

    const resize = (): void => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNetwork();
    };

    // Perf: spatial hash grid (cell = minDist) buckets node indices so neighbor queries scan
    // only nearby cells, keeping buildNetwork ~O(n) instead of O(n²) over every placed node.
    // `near` allocates a small array per call (build-time only, not per frame).
    interface SpatialGrid {
      add: (idx: number, x: number, y: number) => void;
      near: (x: number, y: number, radius: number) => Array<number>;
    }

    const makeSpatialGrid = (cell: number): SpatialGrid => {
      const cols = Math.max(1, Math.ceil(width / cell));
      const buckets = new Map<number, Array<number>>();
      return {
        add: (idx: number, x: number, y: number): void => {
          const key = Math.floor(y / cell) * cols + Math.floor(x / cell);
          const bucket = buckets.get(key);
          if (bucket) bucket.push(idx);
          else buckets.set(key, [idx]);
        },
        near: (x: number, y: number, radius: number): Array<number> => {
          const cx = Math.floor(x / cell);
          const cy = Math.floor(y / cell);
          const result: Array<number> = [];
          for (let gx = cx - radius; gx <= cx + radius; gx++) {
            for (let gy = cy - radius; gy <= cy + radius; gy++) {
              const bucket = buckets.get(gy * cols + gx);
              if (bucket) result.push(...bucket);
            }
          }
          return result;
        },
      };
    };

    const placeNodes = (count: number, minDist: number, grid: SpatialGrid): void => {
      const minDistSq = minDist * minDist;
      let attempts = 0;
      while (nodes.length < count && attempts < count * 80) {
        attempts++;
        const x = Math.random() * width;
        const y = Math.random() * height;
        let tooClose = false;
        for (const ni of grid.near(x, y, 1)) {
          const n = nodes[ni];
          if (!n) continue;
          const dx = n.x - x;
          const dy = n.y - y;
          if (dx * dx + dy * dy < minDistSq) {
            tooClose = true;
            break;
          }
        }
        if (tooClose) continue;
        const idx = nodes.length;
        nodes.push({
          x,
          y,
          base: CANVAS.baseOpacityMin + Math.random() * CANVAS.baseOpacityRange,
          level: 0,
          r: CANVAS.radiusMin + Math.random() * CANVAS.radiusRange,
          nextFire: performance.now() + CANVAS.fireCooldownMinMs + Math.random() * CANVAS.fireCooldownRangeMs,
          connections: [],
        });
        grid.add(idx, x, y);
      }
    };

    const connectNodes = (maxEdgeLength: number, cellRadius: number, grid: SpatialGrid): void => {
      const seenEdges = new Set<number>(); // one key per node pair = min(i,j) * nodes.length + max(i,j)
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (!a) continue;
        const candidates: Array<{ j: number; d: number }> = [];
        for (const j of grid.near(a.x, a.y, cellRadius)) {
          if (j === i) continue;
          const bNode = nodes[j];
          if (!bNode) continue;
          const dx = bNode.x - a.x;
          const dy = bNode.y - a.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d <= maxEdgeLength) candidates.push({ j, d });
        }
        candidates.sort((p, q) => p.d - q.d);
        const k = 2 + (Math.random() < 0.5 ? 1 : 0) + (Math.random() < 0.2 ? 1 : 0);
        for (let m = 0; m < Math.min(k, candidates.length); m++) {
          const entry = candidates[m];
          if (!entry) continue;
          const { j, d } = entry;
          const edgeKey = Math.min(i, j) * nodes.length + Math.max(i, j);
          if (seenEdges.has(edgeKey)) continue;
          seenEdges.add(edgeKey);
          const gapCount = 3 + Math.floor(Math.random() * 4);
          const gaps: Array<number> = [];
          for (let g = 1; g <= gapCount; g++) {
            gaps.push(g / (gapCount + 1));
          }
          edges.push({ a: i, b: j, d, gaps });
          a.connections.push(edges.length - 1);
          nodes[j]?.connections.push(edges.length - 1);
        }
      }
    };

    const buildNetwork = (): void => {
      nodes = [];
      edges = [];
      signals = [];
      trails.clear();

      const target = Math.floor((width * height) / CANVAS.nodeDensityArea);
      const count = Math.max(CANVAS.minNodes, Math.min(CANVAS.maxNodes, target));
      const minDist = Math.sqrt((width * height) / count) * CANVAS.packingFactor;
      const cell = Math.max(1, minDist);
      const grid = makeSpatialGrid(cell);

      placeNodes(count, minDist, grid);

      const maxEdgeLength = Math.min(width, height) * CANVAS.maxEdgeLengthFraction;
      const cellRadius = Math.max(1, Math.ceil(maxEdgeLength / cell));
      connectNodes(maxEdgeLength, cellRadius, grid);
    };

    const fireNode = (idx: number, depth = 0): void => {
      const n = nodes[idx];
      if (!n) return;
      n.level = 1;
      n.nextFire = performance.now() + CANVAS.refractoryMinMs + Math.random() * CANVAS.refractoryRangeMs;

      const conns = n.connections;
      if (conns.length === 0) return;
      // Single fan-out: fire along ONE random outgoing connection so the field stays sparse
      // instead of cascading every node at once. A deeper signal continues only sometimes.
      if (depth > 0 && Math.random() > CANVAS.cascadeContinueProbability) return;
      const eIdx = conns[Math.floor(Math.random() * conns.length)];
      if (eIdx === undefined) return;
      const e = edges[eIdx];
      if (!e) return;
      signals.push({
        edge: eIdx,
        reverse: e.b === idx,
        gap: 0,
        gapT: 0,
        jumpDur: CANVAS.jumpDurationBaseMs + Math.random() * CANVAS.jumpDurationRangeMs,
        gapElapsed: 0,
        depth,
      });
    };

    const seedEmbers = (): void => {
      embers = [];
      const count = Math.floor((width * height) / CANVAS.emberDensityArea);
      for (let i = 0; i < count; i++) {
        embers.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.04,
          vy: -0.02 - Math.random() * 0.04,
          r: 0.4 + Math.random() * 1.1,
          hue: Math.random() < 0.7 ? 35 + Math.random() * 25 : 270 + Math.random() * 30,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const addTrail = (edgeIdx: number, aT: number, bT: number): void => {
      let arr = trails.get(edgeIdx);
      if (!arr) {
        arr = [];
        trails.set(edgeIdx, arr);
      }
      arr.push({ aT, bT, life: 1 });
    };

    let lastFrameTimestamp = performance.now();

    const drawEmbers = (dt: number): void => {
      for (const em of embers) {
        em.x += em.vx;
        em.y += em.vy;
        em.phase += dt * 0.003;
        if (em.y < -10) {
          em.y = height + 10;
          em.x = Math.random() * width;
        }
        if (em.x < -10) em.x = width + 10;
        if (em.x > width + 10) em.x = -10;
        const twinkle = 0.5 + Math.sin(em.phase) * 0.4;
        ctx.fillStyle = `oklch(0.78 0.16 ${em.hue} / ${twinkle * 0.55})`;
        ctx.beginPath();
        ctx.arc(em.x, em.y, em.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawAxons = (): void => {
      ctx.lineWidth = 0.6;
      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        if (!a || !b) continue;
        ctx.strokeStyle = 'oklch(0.5 0.08 50 / 0.10)';
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    };

    const drawTrails = (dt: number): void => {
      ctx.lineCap = 'round';
      for (const [eIdx, arr] of trails) {
        const e = edges[eIdx];
        if (!e) continue;
        const a = nodes[e.a];
        const b = nodes[e.b];
        if (!a || !b) continue;
        for (let i = arr.length - 1; i >= 0; i--) {
          const tr = arr[i];
          if (!tr) continue;
          tr.life -= dt / CANVAS.trailFadeMs;
          if (tr.life <= 0) {
            arr.splice(i, 1);
            continue;
          }
          const x1 = a.x + (b.x - a.x) * tr.aT;
          const y1 = a.y + (b.y - a.y) * tr.aT;
          const x2 = a.x + (b.x - a.x) * tr.bT;
          const y2 = a.y + (b.y - a.y) * tr.bT;
          const tg = ctx.createLinearGradient(x1, y1, x2, y2);
          tg.addColorStop(0, 'oklch(0.62 0.18 280 / 0)');
          tg.addColorStop(0.55, `oklch(0.62 0.18 280 / ${0.18 * tr.life})`);
          tg.addColorStop(1, `oklch(0.7 0.2 290 / ${0.5 * tr.life})`);
          ctx.strokeStyle = tg;
          ctx.lineWidth = 1.2 * tr.life + 0.4;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        if (arr.length === 0) trails.delete(eIdx);
      }
      ctx.lineCap = 'butt';
    };

    const processSignal = (s: Signal, dt: number): Signal | null => {
      const e = edges[s.edge];
      if (!e) return null;
      const a = nodes[e.a];
      const b = nodes[e.b];
      if (!a || !b) return null;
      const { gaps } = e;

      const chain = s.reverse ? [1, ...gaps.slice().reverse(), 0] : [0, ...gaps, 1];
      s.gapElapsed += dt;
      const tFrac = Math.min(1, s.gapElapsed / s.jumpDur);

      const fromT = chain[s.gap] ?? 0;
      const toT = chain[s.gap + 1] ?? 1;
      const eased = tFrac < 0.5 ? 2 * tFrac * tFrac : 1 - Math.pow(-2 * tFrac + 2, 2) / 2;
      const curT = fromT + (toT - fromT) * eased;
      const sx = a.x + (b.x - a.x) * curT;
      const sy = a.y + (b.y - a.y) * curT;

      const ex = b.x - a.x;
      const ey = b.y - a.y;
      const elen = Math.sqrt(ex * ex + ey * ey) || 1;
      const px = -ey / elen;
      const py = ex / elen;

      const lx1 = a.x + (b.x - a.x) * fromT;
      const ly1 = a.y + (b.y - a.y) * fromT;
      const grad = ctx.createLinearGradient(lx1, ly1, sx, sy);
      grad.addColorStop(0, 'oklch(0.95 0.14 85 / 0)');
      grad.addColorStop(1, 'oklch(0.99 0.13 92 / 1)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lx1, ly1);
      ctx.lineTo(sx, sy);
      ctx.stroke();
      ctx.lineCap = 'butt';

      const filaments = 2 + Math.floor(Math.random() * 2);
      ctx.lineWidth = 0.8;
      for (let f = 0; f < filaments; f++) {
        const angle = (Math.random() - 0.5) * Math.PI * 1.6;
        const len = 3 + Math.random() * 5;
        const dirX = Math.cos(angle) * (ex / elen) - Math.sin(angle) * px;
        const dirY = Math.cos(angle) * (ey / elen) - Math.sin(angle) * py;
        const ex2 = sx + dirX * len;
        const ey2 = sy + dirY * len;
        const fg = ctx.createLinearGradient(sx, sy, ex2, ey2);
        fg.addColorStop(0, 'oklch(0.99 0.12 92 / 0.95)');
        fg.addColorStop(1, 'oklch(0.95 0.14 80 / 0)');
        ctx.strokeStyle = fg;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex2, ey2);
        ctx.stroke();
      }

      const sparks = 3 + Math.floor(Math.random() * 3);
      for (let k = 0; k < sparks; k++) {
        const a2 = Math.random() * Math.PI * 2;
        const r = 3 + Math.random() * 6;
        ctx.fillStyle = `oklch(0.98 0.12 ${82 + Math.random() * 10} / ${0.7 + Math.random() * 0.3})`;
        ctx.beginPath();
        ctx.arc(sx + Math.cos(a2) * r, sy + Math.sin(a2) * r, 0.5 + Math.random() * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = 'oklch(0.92 0.18 80 / 0.28)';
      ctx.beginPath();
      ctx.arc(sx, sy, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'oklch(0.99 0.10 95 / 1)';
      ctx.beginPath();
      ctx.arc(sx, sy, 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(sx, sy, 0.7, 0, Math.PI * 2);
      ctx.fill();

      if (tFrac >= 1) {
        addTrail(s.edge, fromT, toT);
        s.gap += 1;
        s.gapElapsed = 0;
        if (s.gap >= chain.length - 1) {
          fireNode(s.reverse ? e.a : e.b, s.depth + 1);
          return null;
        }
      }
      return s;
    };

    const drawNodes = (now: number, dt: number): void => {
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!n) continue;
        n.level *= Math.pow(0.9, dt / 16);
        if (n.level < 0.001) n.level = 0;

        if (now > n.nextFire && Math.random() < CANVAS.spontaneousFireProbability) {
          fireNode(i, 0);
        }

        if (n.level > 0.05) {
          const g2 = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 18 + n.level * 16);
          g2.addColorStop(0, `oklch(0.85 0.18 60 / ${0.35 * n.level})`);
          g2.addColorStop(0.5, `oklch(0.7 0.18 30 / ${0.18 * n.level})`);
          g2.addColorStop(1, 'oklch(0.5 0.18 280 / 0)');
          ctx.fillStyle = g2;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 18 + n.level * 16, 0, Math.PI * 2);
          ctx.fill();
        }

        const lightness = 0.5 + n.level * 0.45;
        const chroma = 0.1 + n.level * 0.14;
        const hue = 35 + n.level * 15;
        ctx.fillStyle = `oklch(${lightness} ${chroma} ${hue} / ${0.55 + n.base * 0.45 + n.level * 0.4})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + n.level * 1.4, 0, Math.PI * 2);
        ctx.fill();

        if (n.level > 0.1 || n.base > 0.25) {
          ctx.fillStyle = `oklch(0.98 0.06 80 / ${0.4 + n.level * 0.6})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const tick = (now: number): void => {
      const dt = Math.min(CANVAS.maxFrameDtMs, now - lastFrameTimestamp);
      lastFrameTimestamp = now;

      ctx.fillStyle = 'rgba(0,0,0,0.16)';
      ctx.fillRect(0, 0, width, height);

      drawEmbers(dt);
      drawAxons();
      drawTrails(dt);

      const remaining: Array<Signal> = [];
      for (const s of signals) {
        const result = processSignal(s, dt);
        if (result) remaining.push(result);
      }
      signals = remaining;

      drawNodes(now, dt);

      if (running) animFrameId = requestAnimationFrame(tick);
    };

    const onResize = (): void => {
      if (prefersReducedMotion) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      resize();
      seedEmbers();
    };

    const startLoop = (): void => {
      if (running || prefersReducedMotion) return;
      running = true;
      lastFrameTimestamp = performance.now();
      animFrameId = requestAnimationFrame(tick);
    };
    const stopLoop = (): void => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(animFrameId);
    };
    // Run only while the canvas is on-screen AND the tab is visible — no frames drawn to a
    // scrolled-past or backgrounded canvas.
    const updateLoopState = (): void => {
      if (onScreen && document.visibilityState !== 'hidden') startLoop();
      else stopLoop();
    };
    const onVisibilityChange = (): void => updateLoopState();
    const observer = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? true;
        updateLoopState();
      },
      { threshold: 0 },
    );

    resize();
    seedEmbers();

    if (prefersReducedMotion) {
      tick(performance.now());
    } else {
      for (let i = 0; i < CANVAS.initialFireCount; i++) {
        const idx = Math.floor(Math.random() * nodes.length);
        timeouts.push(setTimeout(() => fireNode(idx, 0), CANVAS.initialFireDelayMs + i * CANVAS.initialFireStaggerMs));
      }
      window.addEventListener('resize', onResize);
      document.addEventListener('visibilitychange', onVisibilityChange);
      observer.observe(canvas);
      startLoop();
    }

    cleanupFn = (): void => {
      stopLoop();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      observer.disconnect();
      timeouts.forEach(clearTimeout);
    };
  });

  onUnmounted(() => {
    cleanupFn?.();
  });
</script>

<template>
  <div
    class="pointer-events-none absolute inset-0 z-0"
    style="
      mask-image: radial-gradient(ellipse 95% 75% at 50% 45%, #000 40%, transparent 85%);
      -webkit-mask-image: radial-gradient(ellipse 95% 75% at 50% 45%, #000 40%, transparent 85%);
    "
  >
    <canvas
      ref="canvasRef"
      style="display: block; width: 100%; height: 100%"
    />
  </div>
</template>
