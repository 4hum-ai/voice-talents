<template>
  <div class="bg-card border-border rounded-lg border p-6 shadow-sm">
    <!-- Section Header -->
    <div v-if="title || description" class="mb-6">
      <div v-if="icon" class="mb-4 flex items-center space-x-3">
        <div :class="['flex h-10 w-10 items-center justify-center rounded-lg', iconBgClass]">
          <component :is="icon" :class="iconClass" />
        </div>
        <div>
          <h2 v-if="title" class="text-foreground text-lg font-semibold">
            {{ title }}
          </h2>
          <p v-if="description" class="text-muted-foreground text-sm">
            {{ description }}
          </p>
        </div>
      </div>
      <div v-else>
        <h2 v-if="title" class="text-foreground mb-2 text-lg font-semibold">
          {{ title }}
        </h2>
        <p v-if="description" class="text-muted-foreground text-sm">
          {{ description }}
        </p>
      </div>
    </div>

    <!-- Section Content -->
    <div :class="contentClass">
      <slot />
    </div>

    <!-- Section Footer -->
    <div v-if="$slots.footer" class="border-border mt-6 border-t pt-6">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'

interface Props {
  title?: string
  description?: string
  icon?: Component
  iconColor?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray'
  variant?: 'default' | 'compact' | 'spacious'
  columns?: 1 | 2 | 3 | 4
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: 'blue',
  variant: 'default',
  columns: 1,
})

const iconBgClass = computed(() => {
  const colorMap = {
    blue: 'bg-blue-100 dark:bg-blue-900',
    green: 'bg-green-100 dark:bg-green-900',
    purple: 'bg-purple-100 dark:bg-purple-900',
    orange: 'bg-orange-100 dark:bg-orange-900',
    red: 'bg-red-100 dark:bg-red-900',
    gray: 'bg-gray-100 dark:bg-gray-900',
  }
  return colorMap[props.iconColor]
})

const iconClass = computed(() => {
  const colorMap = {
    blue: 'h-5 w-5 text-blue-600 dark:text-blue-400',
    green: 'h-5 w-5 text-green-600 dark:text-green-400',
    purple: 'h-5 w-5 text-purple-600 dark:text-purple-400',
    orange: 'h-5 w-5 text-orange-600 dark:text-orange-400',
    red: 'h-5 w-5 text-red-600 dark:text-red-400',
    gray: 'h-5 w-5 text-gray-600 dark:text-gray-400',
  }
  return colorMap[props.iconColor]
})

const contentClass = computed(() => {
  const baseClass = 'space-y-6'
  const variantClass = {
    default: '',
    compact: 'space-y-4',
    spacious: 'space-y-8',
  }[props.variant]

  const columnClass = {
    1: '',
    2: 'grid grid-cols-1 gap-6 md:grid-cols-2',
    3: 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4',
  }[props.columns]

  return [baseClass, variantClass, columnClass].filter(Boolean).join(' ')
})
</script>
