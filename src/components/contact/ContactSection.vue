<script setup lang="ts">
  import { ref } from 'vue';
  import { Github, Linkedin, Mail, FileText } from 'lucide-vue-next';
  import { siteConfig } from '@/data/siteConfig';

  const links = [
    {
      icon: Mail,
      label: 'Email',
      href: `mailto:${siteConfig.email}`,
      text: siteConfig.email,
    },
    {
      icon: Github,
      label: 'GitHub',
      href: siteConfig.github,
      text: 'patrickrizzardi',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: siteConfig.linkedin,
      text: 'patrick-rizzardi',
    },
    {
      icon: FileText,
      label: 'Resume',
      href: '/resume.pdf',
      text: 'Download PDF',
    },
  ] as const;

  const hovered = ref<string | null>(null);
</script>

<template>
  <section
    id="contact"
    style="padding: 120px 0; background: var(--bg-2)"
  >
    <div class="mx-auto max-w-6xl px-6">
      <div class="eyebrow mb-5">contact</div>
      <h2
        style="
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(32px, 4vw, 56px);
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: var(--text);
          margin: 0 0 16px;
        "
      >
        Hiring a founding CTO?
      </h2>
      <p style="font-size: 17px; color: var(--text-2); margin: 0 0 56px; max-width: 480px; line-height: 1.6">
        Open to CTO and Engineering Lead engagements — early-stage, Series A, or infrastructure turnarounds.
      </p>

      <!-- Glow card -->
      <div
        class="max-w-xl rounded-2xl border"
        style="background: var(--card); border-color: var(--line); box-shadow: var(--card-shadow-hi); overflow: hidden"
      >
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.href"
          :target="link.href.startsWith('http') ? '_blank' : undefined"
          :rel="link.href.startsWith('http') ? 'noopener noreferrer' : undefined"
          :download="link.href.endsWith('.pdf') ? 'patrick-rizzardi-resume.pdf' : null"
          class="flex items-center gap-4 border-b px-6 py-5 transition-colors duration-150 last:border-b-0"
          :style="{
            borderColor: 'var(--line-soft)',
            background: hovered === link.label ? 'oklch(1 0 0 / 0.02)' : 'transparent',
            textDecoration: 'none',
          }"
          @mouseenter="hovered = link.label"
          @mouseleave="hovered = null"
        >
          <component
            :is="link.icon"
            :size="18"
            :style="{
              color: hovered === link.label ? 'var(--burnt)' : 'var(--text-3)',
              transition: 'color 0.15s',
              flexShrink: 0,
            }"
          />
          <div class="min-w-0 flex-1">
            <div
              style="
                font-family: var(--font-mono);
                font-size: 11px;
                color: var(--text-4);
                margin-bottom: 2px;
                text-transform: uppercase;
                letter-spacing: 0.1em;
              "
            >
              {{ link.label }}
            </div>
            <div
              style="
                font-size: 14px;
                font-weight: 500;
                transition: color 0.15s;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
              :style="{ color: hovered === link.label ? 'var(--text)' : 'var(--text-2)' }"
            >
              {{ link.text }}
            </div>
          </div>
          <span
            style="
              font-size: 16px;
              transition:
                transform 0.15s,
                opacity 0.15s;
            "
            :style="{
              color: 'var(--burnt)',
              opacity: hovered === link.label ? 1 : 0,
              transform: hovered === link.label ? 'translateX(0)' : 'translateX(-4px)',
            }"
            >↗</span
          >
        </a>
      </div>
    </div>
  </section>
</template>
