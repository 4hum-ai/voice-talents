<template>
  <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; border:1px solid #1e2130; border-top:none; background:#0f1116;">
    <div>Showing {{ startItem }} to {{ endItem }} of {{ total }} results</div>
    <div style="display:flex; gap:4px">
      <button :disabled="currentPage<=1" @click="goToPage(currentPage-1)">Prev</button>
      <button :disabled="currentPage>=totalPages" @click="goToPage(currentPage+1)">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  totalPages: number
  total: number
  perPage: number
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e:'page-change', page:number): void }>()

const startItem = computed(() => (props.currentPage - 1) * props.perPage + 1)
const endItem = computed(() => Math.min(props.currentPage * props.perPage, props.total))

const goToPage = (page:number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) emit('page-change', page)
}
</script>


