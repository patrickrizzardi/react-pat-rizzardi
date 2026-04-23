<script setup lang="ts">
  import SkillCategory from './SkillCategory.vue';

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
    class="px-6 py-24"
  >
    <div class="mx-auto max-w-6xl">
      <h2 class="text-3xl font-bold text-white">About</h2>

      <div class="mt-8 grid gap-12 lg:grid-cols-2">
        <div>
          <p class="text-lg leading-relaxed text-gray-400">
            I'm a backend engineer focused on building systems that handle real scale — hundreds of millions of database
            rows, sub-50ms latencies, and multi-service architectures that stay reliable under pressure.
          </p>
          <p class="mt-4 text-lg leading-relaxed text-gray-400">
            Currently training a large language model from scratch in Rust with custom CUDA kernels, and running a
            profitable automated trading platform. Previously spent 4+ years as co-lead developer on an enterprise
            workforce management platform serving 100K+ users.
          </p>
          <p class="mt-4 text-lg leading-relaxed text-gray-400">
            I care about strict types, thorough tests, and infrastructure that doesn't wake people up at 3am.
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
