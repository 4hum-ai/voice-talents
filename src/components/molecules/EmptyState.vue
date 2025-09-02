<template>
  <div
    :class="[
      'rounded-lg border border-dashed border-gray-200 bg-white text-center dark:border-gray-700 dark:bg-gray-900',
      size === 'sm' && 'py-8',
      size === 'md' && 'py-12',
      size === 'lg' && 'py-16',
      size === 'xl' && 'py-20',
      preset === 'search' && 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800',
      preset === 'error' && 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20',
      preset === 'success' &&
        'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20',
      preset === 'warning' &&
        'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20',
      preset === 'info' && 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
      preset === 'custom' && customClass,
    ]"
  >
    <div
      v-if="icon !== false"
      :class="[
        'mx-auto text-gray-400 dark:text-gray-500',
        size === 'sm' && 'h-8 w-8',
        size === 'md' && 'h-10 w-10',
        size === 'lg' && 'h-12 w-12',
        size === 'xl' && 'h-16 w-16',
      ]"
      aria-hidden="true"
    >
      <slot name="icon">
        <!-- Default icon based on preset -->
        <svg
          v-if="preset === 'search'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="mx-auto h-full w-full"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m21 21-4.35-4.35m0-6.4a6.4 6.4 0 1 1-12.8 0 6.4 6.4 0 0 1 12.8 0Z"
          />
        </svg>
        <svg
          v-else-if="preset === 'error'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="mx-auto h-full w-full"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        <svg
          v-else-if="preset === 'success'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="mx-auto h-full w-full"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <svg
          v-else-if="preset === 'warning'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="mx-auto h-full w-full"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        <svg
          v-else-if="preset === 'info'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="mx-auto h-full w-full"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
        <!-- Default plus icon -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="mx-auto h-full w-full"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </slot>
    </div>

    <h3
      :class="[
        'mt-4 font-semibold text-gray-900 dark:text-gray-100',
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-base',
        size === 'lg' && 'text-lg',
        size === 'xl' && 'text-xl',
      ]"
    >
      {{ title }}
    </h3>

    <p
      v-if="subtitle"
      :class="[
        'mt-1 text-gray-500 dark:text-gray-400',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        size === 'lg' && 'text-sm',
        size === 'xl' && 'text-base',
      ]"
    >
      {{ subtitle }}
    </p>

    <div
      v-if="$slots.actions"
      :class="[
        'mt-6 flex items-center justify-center gap-3',
        size === 'sm' && 'mt-4',
        size === 'md' && 'mt-5',
        size === 'lg' && 'mt-6',
        size === 'xl' && 'mt-8',
      ]"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  /** Title text */
  title: string
  /** Subtitle text */
  subtitle?: string
  /** Whether to show icon */
  icon?: boolean
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Preset style */
  preset?: 'default' | 'search' | 'error' | 'success' | 'warning' | 'info' | 'custom'
  /** Custom CSS classes when preset is 'custom' */
  customClass?: string
}

withDefaults(defineProps<Props>(), {
  icon: true,
  size: 'lg',
  preset: 'default',
})
</script>
