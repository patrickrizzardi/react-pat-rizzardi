<script setup lang="ts">
  import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogTitle,
    VisuallyHidden,
  } from 'reka-ui';
  import { X } from 'lucide-vue-next';
  import AppButton from '@/components/ui/AppButton.vue';

  defineProps<{
    links: ReadonlyArray<{ readonly id: string; readonly label: string }>;
  }>();

  const emit = defineEmits<{
    navigate: [id: string];
  }>();

  const open = defineModel<boolean>('open', { required: true });

  const handleNavigate = (id: string): void => {
    open.value = false;
    emit('navigate', id);
  };
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-40 md:hidden"
        style="background: oklch(0 0 0 / 0.6)"
      />
      <DialogContent
        class="fixed top-[var(--nav-h)] left-1/2 z-50 flex min-w-[220px] -translate-x-1/2 flex-col rounded-2xl border px-4 py-5 md:hidden"
        style="
          background: var(--color-card);
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
          border-color: var(--color-line);
          box-shadow:
            0 20px 60px -20px oklch(0 0 0 / 0.7),
            inset 0 1px 0 oklch(1 0 0 / 0.04);
        "
      >
        <VisuallyHidden>
          <DialogTitle>Site menu</DialogTitle>
          <DialogDescription>Primary navigation for redact.digital.</DialogDescription>
        </VisuallyHidden>

        <!-- Explicit close: reliable on touch (backdrop-tap can be swallowed) + discoverable. -->
        <DialogClose
          aria-label="Close menu"
          class="mb-1 cursor-pointer self-end p-1 text-fg-3"
        >
          <X :size="16" />
        </DialogClose>

        <AppButton
          v-for="link in links"
          :key="link.id"
          variant="nav"
          block
          @click="handleNavigate(link.id)"
        >
          {{ link.label }}
        </AppButton>

        <div class="my-3 h-px bg-line-soft" />

        <AppButton
          variant="nav"
          block
          as="a"
          href="/resume.pdf"
          download="patrick-rizzardi-resume.pdf"
        >
          resume ↗
        </AppButton>

        <AppButton
          variant="ghost"
          block
          @click="handleNavigate('contact')"
        >
          hire ↗
        </AppButton>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
  /* Fade DialogContent on open/close — Reka toggles [data-state] on enter/leave */
  [data-state='open'] {
    animation: fadeIn 0.15s ease;
  }
  [data-state='closed'] {
    animation: fadeOut 0.15s ease;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
</style>
