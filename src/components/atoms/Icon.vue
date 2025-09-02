<template>
  <component :is="iconComponent" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
}

const props = defineProps<Props>()

// Dynamic icon import based on name
const iconComponent = computed(() => {
  const iconName = props.name

  // Handle mdi collection prefix
  if (iconName.startsWith('mdi:')) {
    const iconPath = iconName.replace('mdi:', '')
    return () => import(`~icons/mdi/${iconPath}`)
  }

  // Default to mdi if no collection specified
  return () => import(`~icons/mdi/${iconName}`)
})
</script>
