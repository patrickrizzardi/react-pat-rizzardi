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
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 1500);
    } catch {
      // Clipboard unavailable (denied permission / non-secure context) — leave UI unchanged.
    }
  };
</script>

<template>
  <section
    id="contact"
    class="bg-surface-2 py-[120px]"
  >
    <div class="mx-auto max-w-6xl px-6">
      <div class="eyebrow mb-5">contact</div>
      <h2
        class="mb-[16px] font-display text-[clamp(32px,4vw,56px)] leading-[1.05] font-extrabold tracking-[-0.03em] text-fg"
      >
        Looking for a Principal Engineer?
      </h2>
      <p class="mb-[56px] max-w-[480px] text-[17px] leading-[1.6] text-fg-2">
        Open to principal/staff roles, founding-engineer engagements, and high-leverage contracts. Distributed systems,
        TypeScript/Node, compilers, and everything in between.
      </p>

      <!-- Glow card -->
      <div
        class="max-w-xl overflow-hidden rounded-2xl border border-line bg-card"
        style="box-shadow: var(--card-shadow-hi)"
      >
        <div
          v-for="link in links"
          :key="link.label"
          class="relative border-b border-line-soft last:border-b-0"
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
                color: hovered === link.label ? 'var(--color-burnt)' : 'var(--color-fg-3)',
                transition: 'color 0.15s',
                flexShrink: 0,
              }"
            />
            <div class="min-w-0 flex-1">
              <div class="mb-[2px] font-mono text-[11px] tracking-[0.1em] text-fg-4 uppercase">
                {{ link.label }}
              </div>
              <div
                class="truncate text-[14px] font-medium"
                style="transition: color 0.15s"
                :style="{ color: hovered === link.label ? 'var(--color-fg)' : 'var(--color-fg-2)' }"
              >
                {{ link.text }}
              </div>
            </div>
            <span
              v-if="link.label !== 'Email'"
              class="text-[16px]"
              style="
                transition:
                  transform 0.15s,
                  opacity 0.15s;
              "
              :style="{
                color: 'var(--color-burnt)',
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
            class="absolute top-1/2 right-6 flex -translate-y-1/2 cursor-pointer items-center gap-1.5 font-mono text-[11px]"
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
              :style="{ color: copied ? 'oklch(0.74 0.21 145)' : 'var(--color-fg-3)' }"
            />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
