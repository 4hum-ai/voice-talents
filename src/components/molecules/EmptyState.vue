<template>
  <div class="py-16 text-center border border-dashed border-gray-200 rounded-lg bg-white dark:border-gray-700 dark:bg-gray-900">
    <div
      v-if="icon !== false"
      class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
      aria-hidden="true"
    >
      <slot name="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-12 w-12 mx-auto"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </slot>
    </div>
    <h3 class="mt-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
      {{ title }}
    </h3>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {{ subtitle }}
    </p>
    <div class="mt-6 flex items-center justify-center gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle?: string; icon?: boolean }>()
</script>


