<template>
  <div class="space-y-6">
    <div class="bg-[#0f1116] rounded-lg border border-[#1e2130] p-4">
      <div class="space-y-3">
        <div v-for="item in data" :key="item.id" class="flex items-center gap-3 p-3 border border-[#1e2130] rounded hover:bg-[#111318] cursor-pointer" @click="handleItemClick(item)">
          <div class="w-10 h-10 rounded bg-[#111318] flex items-center justify-center">📅</div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium">{{ item[config.titleField] }}</h3>
                <p v-if="config.dateField" class="text-xs text-gray-500 mt-1">{{ formatDate(item[config.dateField]) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props { data:any[]; config:{ titleField:string; dateField?:string; actions?:any[] } }
const props = defineProps<Props>()
const emit = defineEmits<{ action:[action:string, item?:any]; itemClick:[item:any] }>()
const handleAction = (action: string, item?: any) => emit('action', action, item)
const handleItemClick = (item:any) => emit('itemClick', item)
const formatDate = (s:string) => { try { return new Date(s).toLocaleDateString('en-US', {year:'numeric', month:'short', day:'numeric'}) } catch { return s } }
</script>


