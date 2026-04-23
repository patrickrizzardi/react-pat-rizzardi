<script setup lang="ts">
  import { ref } from 'vue';
  import { useScrollReveal } from '@/composables/useScrollReveal';
  import SkillCategory from './SkillCategory.vue';

  const sectionRef = ref<HTMLElement | null>(null);
  const { revealed } = useScrollReveal(sectionRef);

  const skillGroups = [
    { category: 'Languages', skills: ['TypeScript', 'Rust', 'Python', 'SQL', 'Lua'] },
    { category: 'Backend', skills: ['Node.js', 'Express', 'Fastify', 'Bun', 'REST APIs'] },
    { category: 'Databases', skills: ['PostgreSQL', 'Redis', 'DragonflyDB', 'Sequelize'] },
    { category: 'Infrastructure', skills: ['Docker', 'GitHub Actions', 'DigitalOcean', 'Linux'] },
    { category: 'Frontend', skills: ['Vue 3', 'Tailwind CSS', 'Vite', 'Pinia'] },
    { category: 'ML / AI', skills: ['CUDA', 'burn (Rust)', 'Transformers', 'BPE Tokenization'] },
  ] as const;
</script>

<template>
  <section
    id="about"
    ref="sectionRef"
    class="reveal px-6 py-24"
    :class="{ 'is-revealed': revealed }"
  >
    <div class="mx-auto max-w-6xl">
      <h2 class="text-3xl font-bold text-white">About</h2>

      <div class="mt-8 grid gap-12 lg:grid-cols-2">
        <div>
          <p class="text-lg leading-relaxed text-gray-400">
            Most of my career has been spent on the parts of software nobody sees — until they break. I've led
            infrastructure for an enterprise platform processing
            <span class="text-white">$2M in monthly cashflow</span>, built a trading system that's been
            <span class="text-white">profitable for over a year</span>, and I'm currently training an LLM from scratch
            because I wanted to understand transformers at the CUDA kernel level, not just the API level.
          </p>
          <p class="mt-4 text-lg leading-relaxed text-gray-400">
            I think in systems, not features. My best work is the migration nobody noticed, the indexing strategy that
            kept queries under 50ms at 500M rows, and the monitoring that caught the problem before anyone filed a
            ticket. I build things that let other engineers move faster.
          </p>
          <p class="mt-4 text-lg leading-relaxed text-gray-400">
            When I'm not writing Rust or TypeScript, I'm probably debugging why my LLM's attention kernels are 3x slower
            than they should be, or figuring out how to partition another quarter-billion rows without downtime.
          </p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2">
          <SkillCategory
            v-for="group in skillGroups"
            :key="group.category"
            :category="group.category"
            :skills="group.skills"
          />
        </div>
      </div>
    </div>
  </section>
</template>
