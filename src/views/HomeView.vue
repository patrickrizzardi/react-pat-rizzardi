<script setup lang="ts">
  import HeroSection from '@/components/hero/HeroSection.vue';
  import PrinciplesSection from '@/components/principles/PrinciplesSection.vue';
  import SystemsSection from '@/components/systems/SystemsSection.vue';
  import LeadershipSection from '@/components/leadership/LeadershipSection.vue';
  import WritingSection from '@/components/writing/WritingSection.vue';
  import ContactSection from '@/components/contact/ContactSection.vue';
  import { useSeo } from '@/composables/useSeo';
  import { siteConfig } from '@/data/siteConfig';

  useSeo({
    title: 'Patrick Rizzardi — Principal Engineer & Architect',
    description:
      'Principal Engineer & Architect specializing in distributed systems, TypeScript/Node, and MySQL at $2M/mo scale. Building a Rust LLVM compiler, training LLMs with CUDA kernels, and leading a team of 4. Fault-tolerant microservices, 11 production integrations, OpenAI in production.',
    url: siteConfig.siteUrl,
  });
</script>

<template>
  <div>
    <HeroSection />
    <PrinciplesSection />
    <SystemsSection />
    <LeadershipSection />
    <WritingSection />
    <ContactSection />
  </div>
</template>
