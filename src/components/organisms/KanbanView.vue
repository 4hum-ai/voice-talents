<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      <div v-for="column in config.columns" :key="column.value" class="bg-gray-50 rounded-lg p-4 min-h-[300px] border border-gray-200">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: column.color || '#6b7280' }"></div>
            <h3 class="font-medium text-gray-900">{{ column.label }}</h3>
          </div>
          <span class="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">{{ getKanbanCount(column.value) }}</span>
        </div>
        <div class="space-y-3">
          <div v-for="item in getKanbanItems(column.value)" :key="item.id" class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md cursor-pointer transition-all duration-200" @click="handleItemClick(item)">
            <div class="font-medium text-sm text-gray-900 mb-1">{{ item[config.cardTitleField] }}</div>
            <div v-if="config.cardDescriptionField" class="text-xs text-gray-500">{{ item[config.cardDescriptionField] }}</div>
          </div>
          <div v-if="getKanbanItems(column.value).length === 0" class="text-center py-8 text-gray-400 text-sm">No items</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: any[]
  config: { columns: any[]; groupByField: string; cardTitleField: string; cardDescriptionField?: string; actions?: any[] }
}
const props = defineProps<Props>()
const emit = defineEmits<{ action: [action:string, item?:any]; itemClick: [item:any] }>()

const getKanbanCount = (columnValue: string) => props.data.filter(item => item[props.config.groupByField] === columnValue).length
const getKanbanItems = (columnValue: string) => props.data.filter(item => item[props.config.groupByField] === columnValue)
// Removed unused handleAction to satisfy type checks
const handleItemClick = (item:any) => emit('itemClick', item)
</script>


