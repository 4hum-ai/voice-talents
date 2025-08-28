<template>
  <div class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
    <span v-if="label"><slot>{{ label }}</slot></span>
    <slot v-else />
    <button
      v-if="closable"
      type="button"
      @click="$emit('close')"
      class="rounded hover:bg-gray-100 dark:hover:bg-gray-700 px-1"
      :aria-label="closeAriaLabel"
    >
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  closable?: boolean
  closeAriaLabel?: string
}

withDefaults(defineProps<Props>(), {
  label: undefined,
  closable: false,
  closeAriaLabel: 'Remove'
})

defineEmits(['close'])
</script>

<style scoped>
</style>


