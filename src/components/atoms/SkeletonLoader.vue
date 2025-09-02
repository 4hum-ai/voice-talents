<template>
  <div
    :class="[
      'animate-pulse',
      preset === 'card' &&
        'rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800',
      preset === 'table-row' && 'border-b border-gray-200 py-3 dark:border-gray-700',
      preset === 'gallery-item' &&
        'rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800',
      preset === 'kanban-card' &&
        'rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800',
      preset === 'list-item' && 'border-b border-gray-200 py-2 dark:border-gray-700',
      preset === 'custom' && customClass,
    ]"
  >
    <!-- Card Preset -->
    <div v-if="preset === 'card'" class="flex items-start gap-3">
      <div class="h-10 w-10 flex-none rounded-md bg-gray-200 dark:bg-gray-700" />
      <div class="flex-1 space-y-2">
        <div class="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>

    <!-- Table Row Preset -->
    <div v-else-if="preset === 'table-row'" class="flex items-center gap-3">
      <div class="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700" />
      <div class="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
      <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
      <div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
    </div>

    <!-- Gallery Item Preset -->
    <div v-else-if="preset === 'gallery-item'" class="space-y-3">
      <div class="aspect-square rounded-lg bg-gray-200 dark:bg-gray-700" />
      <div class="space-y-2">
        <div class="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>

    <!-- Kanban Card Preset -->
    <div v-else-if="preset === 'kanban-card'" class="space-y-2">
      <div class="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
      <div class="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
      <div class="flex items-center gap-2">
        <div class="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div class="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>

    <!-- List Item Preset -->
    <div v-else-if="preset === 'list-item'" class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="space-y-1">
          <div class="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700" />
          <div class="h-2 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      <div class="h-6 w-16 rounded bg-gray-200 dark:bg-gray-700" />
    </div>

    <!-- Custom Preset -->
    <div v-else-if="preset === 'custom'" class="space-y-2">
      <div
        v-for="(line, index) in lines"
        :key="index"
        :class="[
          'rounded bg-gray-200 dark:bg-gray-700',
          line.width === 'full'
            ? 'w-full'
            : line.width === 'half'
              ? 'w-1/2'
              : line.width === 'third'
                ? 'w-1/3'
                : line.width === 'quarter'
                  ? 'w-1/4'
                  : line.width,
          line.height === 'full'
            ? 'h-full'
            : line.height === 'half'
              ? 'h-1/2'
              : line.height === 'third'
                ? 'h-1/3'
                : line.height === 'quarter'
                  ? 'h-1/4'
                  : line.height,
        ]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface SkeletonLine {
  width?: 'full' | 'half' | 'third' | 'quarter' | string
  height?: 'full' | 'half' | 'third' | 'quarter' | string
}

interface Props {
  /** Preset skeleton layout */
  preset?: 'card' | 'table-row' | 'gallery-item' | 'kanban-card' | 'list-item' | 'custom'
  /** Custom CSS classes when preset is 'custom' */
  customClass?: string
  /** Custom skeleton lines when preset is 'custom' */
  lines?: SkeletonLine[]
}

withDefaults(defineProps<Props>(), {
  preset: 'card',
  lines: () => [
    { width: 'full', height: 'h-4' },
    { width: '2/3', height: 'h-3' },
    { width: '1/2', height: 'h-3' },
  ],
})
</script>
