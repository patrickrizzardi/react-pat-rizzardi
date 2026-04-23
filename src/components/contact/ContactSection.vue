<script setup lang="ts">
  import { ref } from 'vue';
  import { Github, Linkedin, Mail, FileText } from 'lucide-vue-next';
  import { useScrollReveal } from '@/composables/useScrollReveal';

  const sectionRef = ref<HTMLElement | null>(null);
  const { revealed } = useScrollReveal(sectionRef);

  const links = [
    {
      icon: Mail,
      label: 'Email',
      href: 'mailto:patrick@redact.digital',
      text: 'patrick@redact.digital',
    },
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/patrickrizzardi',
      text: 'patrickrizzardi',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/patrick-rizzardi/',
      text: 'patrickrizzardi',
    },
    {
      icon: FileText,
      label: 'Resume',
      href: '#',
      text: 'Download PDF',
    },
  ] as const;
</script>

<template>
  <section
    id="contact"
    ref="sectionRef"
    class="reveal px-6 py-24"
    :class="{ 'is-revealed': revealed }"
  >
    <div class="mx-auto max-w-6xl">
      <h2 class="text-3xl font-bold text-white">Get in Touch</h2>
      <p class="mt-2 text-gray-500">Open to interesting backend and infrastructure roles.</p>

      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.href"
          :target="link.href.startsWith('http') ? '_blank' : undefined"
          :rel="link.href.startsWith('http') ? 'noopener noreferrer' : undefined"
          class="flex items-center gap-4 rounded-xl border border-white/10 bg-navy-800 p-5 transition-all duration-300 hover:border-cyan/30 hover:shadow-lg hover:shadow-cyan/5"
        >
          <component
            :is="link.icon"
            :size="24"
            class="shrink-0 text-cyan"
          />
          <div>
            <p class="text-sm font-medium text-white">{{ link.label }}</p>
            <p class="text-xs text-gray-500">{{ link.text }}</p>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>
