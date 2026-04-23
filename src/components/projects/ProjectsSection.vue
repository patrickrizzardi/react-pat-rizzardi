<script setup lang="ts">
  import { ref } from 'vue';
  import { projects } from '@/data/projects';
  import { useScrollReveal } from '@/composables/useScrollReveal';
  import FeaturedCard from './FeaturedCard.vue';
  import ExperienceCard from './ExperienceCard.vue';
  import ProjectCard from './ProjectCard.vue';

  const sectionRef = ref<HTMLElement | null>(null);
  const { revealed } = useScrollReveal(sectionRef);
</script>

<template>
  <section
    id="projects"
    ref="sectionRef"
    class="reveal px-6 py-24"
    :class="{ 'is-revealed': revealed }"
  >
    <div class="mx-auto max-w-6xl">
      <h2 class="text-3xl font-bold text-white">Projects</h2>
      <p class="mt-2 text-gray-500">A selection of systems I've built — from LLMs to trading infrastructure.</p>

      <div class="mt-12 space-y-8">
        <template
          v-for="project in projects"
          :key="project.id"
        >
          <FeaturedCard
            v-if="project.tier === 'featured'"
            :project="project"
          />
          <ExperienceCard
            v-else-if="project.tier === 'experience'"
            :project="project"
          />
        </template>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <template
            v-for="project in projects"
            :key="project.id"
          >
            <ProjectCard
              v-if="project.tier === 'standard'"
              :project="project"
            />
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
