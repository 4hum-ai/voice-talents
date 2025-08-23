<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      <div v-for="item in data" :key="item.id" class="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-sm transition-shadow" @click="handleItemClick(item)">
        <div class="aspect-square bg-gray-100 flex items-center justify-center">
          <span class="text-4xl text-gray-400 font-medium">{{ getInitials(item[config.titleField]) }}</span>
        </div>
        <div class="p-4">
          <h3 class="font-medium text-sm text-gray-900 mb-1">{{ item[config.titleField] }}</h3>
          <p v-if="config.descriptionField" class="text-xs text-gray-500">{{ item[config.descriptionField] }}</p>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
interface Props { data: any[]; config: { imageField?: string; titleField: string; descriptionField?: string; actions?: any[] } }
const props = defineProps<Props>()
const emit = defineEmits<{ action: [action:string, item?:any]; itemClick: [item:any] }>()

// Removed unused handleAction to satisfy type checks
const handleItemClick = (item:any) => emit('itemClick', item)
const getInitials = (name:string) => !name ? '?' : name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
</script>


