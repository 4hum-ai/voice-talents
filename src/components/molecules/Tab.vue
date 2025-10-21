<template>
  <div v-if="isActive" class="tab-panel">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, type Component } from 'vue'

interface TabNavigationContext {
  activeTab: string
  registerTab: (tab: { id: string; label: string; icon?: Component }) => void
  unregisterTab: (tabId: string) => void
  updateTab: (tabId: string, updates: { label?: string; icon?: Component }) => void
}

interface Props {
  /** Unique identifier for this tab */
  id: string
  /** Display label for the tab */
  label: string
  /** Icon component for the tab */
  icon?: Component
  /** Whether the tab is disabled */
  disabled?: boolean
  /** Badge to display on the tab */
  badge?: string | number
}

const props = defineProps<Props>()

const tabNavigation = inject<TabNavigationContext>('tabNavigation')

if (!tabNavigation) {
  throw new Error('Tab must be used within TabNavigation')
}

const isActive = computed(() => {
  return tabNavigation.activeTab === props.id
})

// Register this tab when mounted
onMounted(() => {
  tabNavigation.registerTab({
    id: props.id,
    label: props.label,
    icon: props.icon,
  })
})

// Unregister when unmounted
onUnmounted(() => {
  tabNavigation.unregisterTab(props.id)
})

// Watch for prop changes and update the tab
const updateTabProps = () => {
  tabNavigation.updateTab(props.id, {
    label: props.label,
    icon: props.icon,
  })
}

// Update tab when props change
onMounted(() => {
  updateTabProps()
})
</script>
