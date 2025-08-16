<template>
  <div v-if="show" style="position:fixed; inset:0; display:flex; justify-content:flex-end; z-index:50">
    <div style="background:#0f1116; height:100%; width:380px; border-left:1px solid #1e2130; display:flex; flex-direction:column">
      <div style="display:flex; align-items:center; justify-content:space-between; padding:16px; border-bottom:1px solid #1e2130">
        <h3 style="margin:0">{{ title }}</h3>
        <button @click="$emit('close')">✕</button>
      </div>
      <div style="flex:1; overflow:auto; padding:16px">
        <slot />
      </div>
      <div style="padding:16px; border-top:1px solid #1e2130; display:flex; gap:8px">
        <button @click="$emit('clear')">Clear All</button>
        <button @click="$emit('apply')">Apply Filters</button>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
defineProps<{ title: string; show: boolean }>()
defineEmits(['close','clear','apply'])
</script>


