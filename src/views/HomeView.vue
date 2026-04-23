<script setup lang="ts">
  import HeroSection from '@/components/hero/HeroSection.vue';
  import ProjectsSection from '@/components/projects/ProjectsSection.vue';
  import AboutSection from '@/components/about/AboutSection.vue';
  import ContactSection from '@/components/contact/ContactSection.vue';
  import { useSeo } from '@/composables/useSeo';

  useSeo({
    title: 'Patrick Rizzardi — Engineering Lead & Architect',
    description:
      'I architect backend systems that stay profitable at scale — from a trading platform that pays its own bills to an LLM trained from bare metal.',
    url: 'https://redact.digital',
  });
</script>

<template>
  <div>
    <HeroSection />
    <ProjectsSection />
    <AboutSection />
    <ContactSection />
  </div>
</template>
