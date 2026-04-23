<script setup lang="ts">
  import { Github, Linkedin, Mail, FileText } from 'lucide-vue-next';

  const links = [
    {
      icon: Mail,
      label: 'Email',
      href: 'mailto:patrick.rizzardi@gmail.com',
      text: 'patrick.rizzardi@gmail.com',
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
      href: 'https://linkedin.com/in/patrickrizzardi',
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
    class="px-6 py-24"
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
