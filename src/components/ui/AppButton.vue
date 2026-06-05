<script setup lang="ts">
  import { RouterLink } from 'vue-router';
  import { computed, ref } from 'vue';

  const variantValues = {
    primary: 'primary',
    ghost: 'ghost',
    chip: 'chip',
    text: 'text',
    nav: 'nav',
  } as const;
  type Variant = (typeof variantValues)[keyof typeof variantValues];

  const sizeValues = {
    sm: 'sm',
    md: 'md',
  } as const;
  type Size = (typeof sizeValues)[keyof typeof sizeValues];

  const asValues = {
    button: 'button',
    a: 'a',
    RouterLink: 'RouterLink',
  } as const;
  type AsElement = (typeof asValues)[keyof typeof asValues];

  const props = withDefaults(
    defineProps<{
      variant: Variant;
      size?: Size;
      as?: AsElement;
      href?: string | null;
      to?: string | null;
      type?: 'button' | 'submit' | 'reset';
      target?: string | null;
      rel?: string | null;
      download?: string | null;
      // Stretches the button to full container width with left-aligned content.
      // For nav variant: also applies flex-start justify. For other variants: centers content.
      block?: boolean;
      // Selected state — CHIP VARIANT ONLY (burnt fill, e.g. active filter tag); no-op on other variants.
      active?: boolean;
      // Emphasis — CHIP VARIANT ONLY (burnt outline, e.g. a "live demo" link ranked above repo/npm); no-op on other variants.
      accent?: boolean;
    }>(),
    {
      size: 'md',
      as: 'button',
      href: null,
      to: null,
      type: 'button',
      target: null,
      rel: null,
      download: null,
      block: false,
      active: false,
      accent: false,
    },
  );

  defineEmits<{
    click: [event: MouseEvent];
  }>();

  const hovered = ref(false);

  // Resolve which element renders. RouterLink requires the `to` prop from vue-router.
  const tag = computed(() => {
    if (props.as === 'RouterLink') return RouterLink;
    return props.as;
  });

  // Forward href/to to the underlying element.
  const linkProps = computed(() => {
    if (props.as === 'RouterLink') return { to: props.to ?? '/' };
    if (props.as === 'a') {
      return {
        href: props.href ?? '#',
        target: props.target ?? undefined,
        rel: props.rel ?? undefined,
        download: props.download ?? undefined,
      };
    }
    return { type: props.type };
  });

  const baseStyle: Record<string, string> = {
    fontFamily: 'var(--font-mono)',
    borderRadius: 'var(--btn-radius)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    border: 'none',
    background: 'transparent',
    transition: 'color 0.2s, border-color 0.2s, background 0.2s',
    userSelect: 'none',
  };

  // Variant-specific styles. fontSize is variant-owned (single owner — no sizeStyle collision).
  // primary/ghost scale font with `size`; chip/text/nav are fixed-size by design.
  const variantStyle = computed((): Record<string, string> => {
    switch (props.variant) {
      case 'primary':
        return {
          color: 'var(--bg)',
          background: 'var(--burnt)',
          boxShadow: '0 6px 18px -12px oklch(0.66 0.17 48 / 0.45)',
          fontWeight: '600',
          fontSize: props.size === 'sm' ? '11px' : '13px',
          padding: '14px 24px',
        };
      case 'ghost':
        return {
          color: 'var(--text)',
          border: '1px solid var(--burnt)',
          padding: props.size === 'sm' ? '5px 10px' : '14px 22px',
          fontSize: props.size === 'sm' ? '11px' : '13px',
          fontWeight: '600',
        };
      case 'chip':
        return {
          color: 'var(--text-3)',
          border: '1px solid var(--line)',
          padding: props.size === 'sm' ? '4px 10px' : '6px 12px',
          fontSize: '11px',
          background: 'var(--card)',
          backdropFilter: 'blur(8px)',
        };
      case 'text':
        return {
          color: 'var(--burnt)',
          padding: '0',
          fontSize: '12px',
        };
      case 'nav':
        return {
          color: 'var(--text-2)',
          padding: '8px 12px',
          fontSize: '13px',
          border: 'none',
          background: 'transparent',
        };
      default:
        return {};
    }
  });

  // Consistent hover across every variant — subtle warm shift, no transform/magnetic gimmick.
  const hoverStyle = computed((): Record<string, string> => {
    if (!hovered.value) return {};
    switch (props.variant) {
      case 'primary':
        return { background: 'var(--burnt-hi)' };
      case 'ghost':
        return { borderColor: 'var(--burnt-hi)', color: 'var(--burnt-hi)', background: 'oklch(0.66 0.17 48 / 0.08)' };
      case 'chip':
        return { borderColor: 'var(--burnt)', color: 'var(--text)' };
      case 'text':
        return { color: 'var(--burnt-hi)' };
      case 'nav':
        return { color: 'var(--text)' };
      default:
        return {};
    }
  });

  const blockStyle = computed((): Record<string, string> => {
    if (!props.block) return {};
    return {
      width: '100%',
      justifyContent: props.variant === 'nav' ? 'flex-start' : 'center',
    };
  });

  // Selected state (e.g. active filter chip) — merged last so it wins over hover (stable when selected).
  const activeStyle = computed((): Record<string, string> => {
    if (!props.active) return {};
    if (props.variant === 'chip') {
      return { color: 'var(--bg)', background: 'var(--burnt)', borderColor: 'var(--burnt)' };
    }
    return {};
  });

  // Emphasis outline (e.g. a "live" link ranked above repo/npm) for the chip variant.
  // Hover-aware: brightens burnt → burnt-hi so the accented link still signals interactivity,
  // while keeping its burnt-family emphasis (merged after hoverStyle, so it wins the color).
  const accentStyle = computed((): Record<string, string> => {
    if (!props.accent || props.variant !== 'chip') return {};
    const shade = hovered.value ? 'var(--burnt-hi)' : 'var(--burnt)';
    return { color: shade, borderColor: shade };
  });

  // Merge order matters: hover is transient and merges before accent/active (identity states),
  // so a "live" accent or a selected chip keeps its emphasis while hovered. active wins over accent.
  const computedStyle = computed(() => ({
    ...baseStyle,
    ...variantStyle.value,
    ...blockStyle.value,
    ...hoverStyle.value,
    ...accentStyle.value,
    ...activeStyle.value,
  }));
</script>

<template>
  <component
    :is="tag"
    v-bind="linkProps"
    :style="computedStyle"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click="$emit('click', $event as MouseEvent)"
  >
    <slot />
  </component>
</template>
