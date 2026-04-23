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
            Self-taught engineer,
            <span class="text-white">12 years US Army</span> including 4 as a Staff Sergeant. I went from leading
            soldiers to leading engineering teams — the problems are different but the accountability isn't. Today I
            manage a team of 4 developers, sit in every business meeting, and share technical leadership of a platform
            processing <span class="text-white">$2M in monthly cashflow</span>.
          </p>
          <p class="mt-4 text-lg leading-relaxed text-gray-400">
            I think in systems, not features. My best work is the migration nobody noticed, the indexing strategy that
            kept queries under 50ms at 500M rows, and the cost optimization that saved thousands without anyone asking
            me to. I build things that let other engineers move faster — and I make sure the budget makes sense while
            doing it.
          </p>
          <p class="mt-4 text-lg leading-relaxed text-gray-400">
            On the side, I built a <span class="text-white">profitable trading platform</span> and I'm training an
            <span class="text-white">LLM from bare metal</span> — custom CUDA kernels, not API wrappers. No CS degree,
            no bootcamp. Just a decade of solving problems that got progressively harder.
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
