<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      <div v-for="column in config.columns" :key="column.value" class="bg-[#0f1116] rounded-lg p-4 min-h-[300px] border border-[#1e2130]">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-[#1e2130]">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: column.color || '#6b7280' }"></div>
            <h3 class="font-medium">{{ column.label }}</h3>
          </div>
          <span class="text-sm text-gray-400 bg-[#111318] px-2 py-1 rounded-full">{{ getKanbanCount(column.value) }}</span>
        </div>
        <div class="space-y-3">
          <div v-for="item in getKanbanItems(column.value)" :key="item.id" class="bg-[#111318] p-4 rounded-lg border border-[#1e2130] hover:shadow-md cursor-pointer" @click="handleItemClick(item)">
            <div class="font-medium text-sm mb-1">{{ item[config.cardTitleField] }}</div>
            <div v-if="config.cardDescriptionField" class="text-xs text-gray-500">{{ item[config.cardDescriptionField] }}</div>
          </div>
          <div v-if="getKanbanItems(column.value).length === 0" class="text-center py-8 text-gray-500 text-sm">No items</div>
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
const handleAction = (action: string, item?: any) => emit('action', action, item)
const handleItemClick = (item:any) => emit('itemClick', item)
</script>


