<script setup lang="ts">
  import { ref } from 'vue';
  import { Github, Linkedin, Mail, FileText, Copy, Check } from 'lucide-vue-next';
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
  const copied = ref(false);

  const copyEmail = async (): Promise<void> => {
    await navigator.clipboard.writeText(siteConfig.email);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 1500);
  };
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
        Looking for a Principal Engineer?
      </h2>
      <p style="font-size: 17px; color: var(--text-2); margin: 0 0 56px; max-width: 480px; line-height: 1.6">
        Open to principal/staff roles, founding-engineer engagements, and high-leverage contracts. Distributed systems,
        TypeScript/Node, compilers, and everything in between.
      </p>

      <!-- Glow card -->
      <div
        class="max-w-xl rounded-2xl border"
        style="background: var(--card); border-color: var(--line); box-shadow: var(--card-shadow-hi); overflow: hidden"
      >
        <div
          v-for="link in links"
          :key="link.label"
          class="relative border-b last:border-b-0"
          style="border-color: var(--line-soft)"
        >
          <a
            :href="link.href"
            :target="link.href.startsWith('http') ? '_blank' : undefined"
            :rel="link.href.startsWith('http') ? 'noopener noreferrer' : undefined"
            :download="link.href.endsWith('.pdf') ? 'patrick-rizzardi-resume.pdf' : null"
            class="flex items-center gap-4 px-6 py-5 transition-colors duration-150"
            :style="{
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
              v-if="link.label !== 'Email'"
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
          <button
            v-if="link.label === 'Email'"
            type="button"
            :aria-label="copied ? 'Email copied to clipboard' : 'Copy email address'"
            class="absolute top-1/2 right-6 flex -translate-y-1/2 cursor-pointer items-center gap-1.5"
            style="font-family: var(--font-mono); font-size: 11px"
            @click="copyEmail"
          >
            <span
              v-if="copied"
              style="color: oklch(0.74 0.21 145)"
              >copied</span
            >
            <component
              :is="copied ? Check : Copy"
              :size="15"
              :style="{ color: copied ? 'oklch(0.74 0.21 145)' : 'var(--text-3)' }"
            />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
