<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    :aria-label="ariaLabel"
    :aria-disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <span
      v-if="loading"
      class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />

    <!-- Icon only -->
    <Icon
      v-else-if="icon && !$slots.default"
      :name="icon"
      :class="iconClasses"
      :size="iconPixelSize"
      aria-hidden="true"
    />

    <!-- Icon with text -->
    <template v-else-if="icon && $slots.default">
      <Icon :name="icon" :class="iconClasses" :size="iconPixelSize" aria-hidden="true" />
      <span :class="textClasses">
        <slot />
      </span>
    </template>

    <!-- Text only -->
    <span v-else-if="$slots.default" :class="textClasses">
      <slot />
    </span>

    <!-- Fallback for accessibility -->
    <span v-else class="sr-only">Button</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from './Icon.vue'

interface Props {
  /** Icon name from unplugin-icons */
  icon?: string
  /** Button variant */
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'success'
    | 'warning'
    | 'ghost'
    | 'outline'
  /** Button size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Button type */
  type?: 'button' | 'submit' | 'reset'
  /** Whether the button is disabled */
  disabled?: boolean
  /** Whether the button is in loading state */
  loading?: boolean
  /** Whether the button is rounded */
  rounded?: boolean
  /** Whether the button is full width */
  fullWidth?: boolean
  /** Custom CSS classes */
  customClass?: string
  /** ARIA label for accessibility */
  ariaLabel?: string
}

interface Emits {
  (e: 'click', event: MouseEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  rounded: false,
  fullWidth: false,
})

const emit = defineEmits<Emits>()

const ariaLabel = computed(() => {
  if (props.ariaLabel) return props.ariaLabel
  if (props.loading) return 'Loading...'
  return 'Button'
})

const buttonClasses = computed(() => {
  const base =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  // Size classes
  const sizes = {
    xs: 'h-6 px-2 text-xs gap-1',
    sm: 'h-8 px-3 text-sm gap-1.5',
    md: 'h-9 px-4 text-sm gap-2',
    lg: 'h-10 px-5 text-base gap-2',
    xl: 'h-12 px-6 text-lg gap-2.5',
  }

  // Variant classes
  const variants = {
    default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary',
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary',
    danger:
      'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
    ghost: 'bg-transparent text-foreground hover:bg-accent focus:ring-accent',
    outline:
      'bg-transparent border border-border text-foreground hover:bg-accent focus:ring-accent',
  }

  // Shape classes
  const shape = props.rounded ? 'rounded-full' : 'rounded-md'

  // Width classes
  const width = props.fullWidth ? 'w-full' : ''

  // Custom classes
  const custom = props.customClass || ''

  return [base, sizes[props.size], variants[props.variant], shape, width, custom]
    .filter(Boolean)
    .join(' ')
})

const iconClasses = computed(() => {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6',
  }
  return sizes[props.size]
})

// Provide a concrete pixel size to Icon to avoid clipping with external SVGs
const iconPixelSize = computed(() => {
  const sizeMap: Record<typeof props.size, string> = {
    xs: '12px',
    sm: '16px',
    md: '16px',
    lg: '20px',
    xl: '24px',
  }
  return sizeMap[props.size]
})

const textClasses = computed(() => {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  }
  return sizes[props.size]
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
