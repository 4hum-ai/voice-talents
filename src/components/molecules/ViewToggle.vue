<template>
  <div class="border-border flex items-center rounded-md border">
    <button
      :class="[
        'flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors',
        modelValue === 'list'
          ? 'bg-card text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
      ]"
      @click="updateValue('list')"
    >
      <Icon name="mdi:view-list" class="h-4 w-4" />
      <span v-if="showLabels">List</span>
    </button>
    <button
      :class="[
        'flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors',
        modelValue === 'grid'
          ? 'bg-card text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
      ]"
      @click="updateValue('grid')"
    >
      <Icon name="mdi:view-grid" class="h-4 w-4" />
      <span v-if="showLabels">Grid</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/atoms/Icon.vue'

interface Props {
  modelValue: 'list' | 'grid'
  showLabels?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showLabels: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: 'list' | 'grid']
  change: [value: 'list' | 'grid']
}>()

const updateValue = (value: 'list' | 'grid') => {
  if (value !== props.modelValue) {
    emit('update:modelValue', value)
    emit('change', value)
  }
}
</script>
