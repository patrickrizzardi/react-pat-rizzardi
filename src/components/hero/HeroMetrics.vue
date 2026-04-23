<script setup lang="ts">
  import { ref, onMounted } from 'vue';

  interface Metric {
    value: number;
    suffix: string;
    label: string;
  }

  interface MetricConfig {
    prefix: string;
  }

  const metrics: ReadonlyArray<Metric & MetricConfig> = [
    { value: 2, suffix: 'M+/mo', label: 'Cashflow Processed', prefix: '$' },
    { value: 500, suffix: 'M+', label: 'Database Rows Managed', prefix: '' },
    { value: 12, suffix: '+', label: 'Microservices Built', prefix: '' },
    { value: 100, suffix: 'K+', label: 'Users Served', prefix: '' },
  ];

  const counts = ref<Array<number>>(metrics.map(() => 0));
  const visible = ref(false);

  const animateCount = (index: number, target: number): void => {
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const tick = (): void => {
      step += 1;
      current = Math.min(Math.round(increment * step), target);
      counts.value[index] = current;
      if (step < steps) requestAnimationFrame(tick);
    };

    setTimeout(() => requestAnimationFrame(tick), index * 150 + duration * 0.1);
  };

  onMounted(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !visible.value) {
          visible.value = true;
          metrics.forEach((m, i) => animateCount(i, m.value));
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    const el = document.getElementById('hero-metrics');
    if (el) observer.observe(el);
  });
</script>

<template>
  <div
    id="hero-metrics"
    class="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8"
    :class="visible ? 'opacity-100' : 'opacity-0'"
    style="transition: opacity 0.6s ease"
  >
    <div
      v-for="(metric, i) in metrics"
      :key="metric.label"
      class="text-center"
    >
      <p class="text-3xl font-bold text-cyan sm:text-4xl">{{ metric.prefix }}{{ counts[i] }}{{ metric.suffix }}</p>
      <p class="mt-1 text-sm text-gray-500">{{ metric.label }}</p>
    </div>
  </div>
</template>
