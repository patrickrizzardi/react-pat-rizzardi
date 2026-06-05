<script setup lang="ts">
  import { Github, Linkedin, Mail } from 'lucide-vue-next';
  import { siteConfig } from '@/data/siteConfig';

  const socialLinks = [
    { icon: Github, href: siteConfig.github, label: 'GitHub' },
    { icon: Linkedin, href: siteConfig.linkedin, label: 'LinkedIn' },
    { icon: Mail, href: `mailto:${siteConfig.email}`, label: 'Email' },
  ] as const;
</script>

<template>
  <footer class="border-t border-line-soft bg-surface-2 py-8">
    <div class="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6">
      <div class="flex gap-6">
        <a
          v-for="link in socialLinks"
          :key="link.label"
          :href="link.href"
          :aria-label="link.label"
          target="_blank"
          rel="noopener noreferrer"
          class="text-[var(--color-fg-4)] transition-colors duration-200 hover:text-[var(--color-burnt)]"
        >
          <component
            :is="link.icon"
            :size="20"
          />
        </a>
      </div>
      <p class="text-sm text-fg-4">
        &copy; {{ new Date().getFullYear() }} {{ siteConfig.name }}
        &nbsp;&middot;&nbsp;
        <span class="text-fg-3">shipped with intent · not by accident</span>
      </p>
    </div>
  </footer>
</template>
