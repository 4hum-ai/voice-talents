<template>
  <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
    <!-- Calendar header -->
    <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button @click="goPrevMonth" class="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">Prev</button>
        <button @click="goToday" class="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">Today</button>
        <button @click="goNextMonth" class="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">Next</button>
      </div>
      <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ monthLabel }} {{ currentYear }}</div>
      <div class="w-[96px]"></div>
    </div>

    <!-- Weekdays -->
    <div class="grid grid-cols-7 text-xs font-medium text-gray-500 dark:text-gray-400 px-4 pt-3">
      <div class="pb-2" v-for="w in weekdays" :key="w">{{ w }}</div>
    </div>

    <!-- Days grid -->
    <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
      <div
        v-for="day in calendarDays"
        :key="day.key"
        class="bg-white dark:bg-gray-900 min-h-[110px] p-2 overflow-hidden"
        :class="day.inMonth ? '' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500'"
      >
        <div class="flex items-center justify-between">
          <div class="text-xs font-medium text-gray-900 dark:text-gray-100" :class="isToday(day.date) ? 'text-red-600' : ''">{{ day.date.getDate() }}</div>
          <div v-if="isToday(day.date)" class="text-[10px] text-red-600 font-semibold">Today</div>
        </div>
        <div class="mt-2 space-y-1">
          <button
            v-for="(evt, idx) in day.events.slice(0, 3)"
            :key="evt.id ?? idx"
            @click.stop="handleItemClick(evt)"
            class="w-full text-left px-2 py-1 rounded text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 truncate"
            :title="eventTitle(evt)"
          >
            {{ eventTitle(evt) }}
          </button>
          <div v-if="day.events.length > 3" class="text-[10px] text-gray-500 dark:text-gray-400">+{{ day.events.length - 3 }} more</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { toDate, toISODate } from '@/utils/date'

interface Props { data:any[]; config:{ titleField:string; dateField?:string; actions?:any[] } }
const props = defineProps<Props>()
const emit = defineEmits<{ action:[action:string, item?:any]; itemClick:[item:any]; filtersChange:[payload:{ from?: string; to?: string; preset?: string }] }>()

const today = new Date()
const currentMonth = ref<number>(today.getMonth())
const currentYear = ref<number>(today.getFullYear())

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const monthLabel = computed(() => monthNames[currentMonth.value])

function isToday(d: Date): boolean {
  return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate()
}


const eventByDayKey = computed<Record<string, any[]>>(() => {
  const byKey: Record<string, any[]> = {}
  const dateField = props.config.dateField || 'date'
  for (const item of props.data || []) {
    const d = toDate((item as any)[dateField])
    if (!d) continue
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    ;(byKey[key] ||= []).push(item)
  }
  return byKey
})

const calendarDays = computed(() => {
  const days: { date: Date; inMonth: boolean; key: string; events: any[] }[] = []
  const firstOfMonth = new Date(currentYear.value, currentMonth.value, 1)
  const startDay = firstOfMonth.getDay() // 0 Sun
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
  const prevMonthDays = new Date(currentYear.value, currentMonth.value, 0).getDate()

  // Leading days from previous month
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(currentYear.value, currentMonth.value - 1, prevMonthDays - i)
    const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
    days.push({ date, inMonth: false, key, events: eventByDayKey.value[key] || [] })
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(currentYear.value, currentMonth.value, d)
    const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
    days.push({ date, inMonth: true, key, events: eventByDayKey.value[key] || [] })
  }

  // Trailing days to complete 6 weeks (42 cells)
  const total = days.length
  const remaining = total % 7 === 0 ? 0 : 7 - (total % 7)
  for (let i = 1; i <= remaining; i++) {
    const date = new Date(currentYear.value, currentMonth.value + 1, i)
    const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
    days.push({ date, inMonth: false, key, events: eventByDayKey.value[key] || [] })
  }

  // Ensure 6 rows for consistent height
  while (days.length < 42) {
    const last = days[days.length - 1]
    const date = new Date(last.date)
    date.setDate(date.getDate() + 1)
    const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
    days.push({ date, inMonth: false, key, events: eventByDayKey.value[key] || [] })
  }

  return days
})

function eventTitle(item: any): string {
  const t = (item || {})[props.config.titleField]
  return typeof t === 'string' ? t : String(t ?? '')
}

function goPrevMonth() {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value -= 1 } else { currentMonth.value -= 1 }
  emitMonthRange()
}
function goNextMonth() {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value += 1 } else { currentMonth.value += 1 }
  emitMonthRange()
}
function goToday() {
  currentMonth.value = today.getMonth(); currentYear.value = today.getFullYear()
  emitMonthRange()
}

const handleItemClick = (item:any) => emit('itemClick', item)

function emitMonthRange() {
  const start = new Date(currentYear.value, currentMonth.value, 1)
  const end = new Date(currentYear.value, currentMonth.value + 1, 0)
  emit('filtersChange', { preset: 'custom', from: toISODate(start), to: toISODate(end) })
}
</script>


