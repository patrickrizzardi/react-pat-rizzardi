<script setup lang="ts">
  import HeroSection from '@/components/hero/HeroSection.vue';
  import PrinciplesSection from '@/components/principles/PrinciplesSection.vue';
  import SystemsSection from '@/components/systems/SystemsSection.vue';
  import LeadershipSection from '@/components/leadership/LeadershipSection.vue';
  import WritingSection from '@/components/writing/WritingSection.vue';
  import ContactSection from '@/components/contact/ContactSection.vue';
  import { useSeo } from '@/composables/useSeo';

  useSeo({
    title: 'Cheddar — Patrick Rizzardi · Engineering Lead & Architect',
    description:
      'Engineering Lead & Architect. Backend systems that stay profitable at scale — from a trading platform that pays its own bills to an LLM trained from bare metal.',
    url: 'https://redact.digital',
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
