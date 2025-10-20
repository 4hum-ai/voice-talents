<template>
  <div :class="cardClasses">
    <!-- Header slot -->
    <div v-if="$slots.header" :class="headerClasses">
      <slot name="header" />
    </div>

    <!-- Default content -->
    <slot />

    <!-- Footer slot -->
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Card variant */
  variant?: 'default' | 'outline' | 'elevated' | 'ghost' | 'bordered' | 'flat'
  /** Card preset for common use cases */
  preset?: 'default' | 'dashboard' | 'form' | 'content' | 'media' | 'stats' | 'custom'
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  /** Whether the card is interactive (hoverable) */
  interactive?: boolean
  /** Whether the card is selected/active */
  selected?: boolean
  /** Whether the card is disabled */
  disabled?: boolean
  /** Custom CSS classes */
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  preset: 'default',
  padding: 'md',
  interactive: false,
  selected: false,
  disabled: false,
})

const cardClasses = computed(() => {
  const base = 'rounded-lg border bg-card transition-all duration-200'

  // Variant styles
  const variants = {
    default: 'border-border shadow-sm',
    outline: 'border-border',
    elevated: 'border-border shadow-md',
    ghost: 'border-transparent shadow-none',
    bordered: 'border-2 border-border shadow-none',
    flat: 'border-border bg-muted',
  }

  // Preset styles
  const presets = {
    default: '',
    dashboard: 'hover:shadow-md transition-shadow duration-200',
    form: 'border-border shadow-sm',
    content: 'border-border shadow-sm max-w-none',
    media: 'overflow-hidden',
    stats: 'text-center border-0 shadow-lg',
    custom: props.customClass || '',
  }

  // Padding styles
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  }

  // Interactive styles
  const interactiveStyles = props.interactive
    ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
    : ''

  // Selected styles
  const selectedStyles = props.selected ? 'ring-2 ring-primary border-primary' : ''

  // Disabled styles
  const disabledStyles = props.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''

  return [
    base,
    variants[props.variant],
    presets[props.preset],
    paddings[props.padding],
    interactiveStyles,
    selectedStyles,
    disabledStyles,
  ]
    .filter(Boolean)
    .join(' ')
})

const headerClasses = computed(() => {
  const base = 'border-b border-border'
  const paddings = {
    none: 'px-0 py-0',
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
    xl: 'px-8 py-6',
  }
  return `${base} ${paddings[props.padding]}`
})

const footerClasses = computed(() => {
  const base = 'border-t border-border'
  const paddings = {
    none: 'px-0 py-0',
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
    xl: 'px-8 py-6',
  }
  return `${base} ${paddings[props.padding]}`
})
</script>
