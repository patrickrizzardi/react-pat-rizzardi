<script setup lang="ts">
  import { Github, Linkedin, Mail } from 'lucide-vue-next';

  const socialLinks = [
    { icon: Github, href: 'https://github.com/patrickrizzardi', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/patrick-rizzardi/', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:patrick@redact.digital', label: 'Email' },
  ] as const;
</script>

<template>
  <footer class="border-t border-white/10 bg-navy-800 py-8">
    <div class="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6">
      <div class="flex gap-6">
        <a
          v-for="link in socialLinks"
          :key="link.label"
          :href="link.href"
          :aria-label="link.label"
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray-500 transition-colors hover:text-cyan"
        >
          <component
            :is="link.icon"
            :size="20"
          />
        </a>
      </div>
      <p class="text-sm text-gray-600">&copy; {{ new Date().getFullYear() }} Patrick Rizzardi</p>
    </div>
  </footer>
</template>
