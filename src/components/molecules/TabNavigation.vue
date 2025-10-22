<template>
  <div class="w-full">
    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          v-for="tab in tabList"
          :key="tab.id"
          :disabled="tab.disabled"
          :class="[
            'border-b-2 px-1 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200',
            'focus:ring-primary-500 focus:ring-2 focus:ring-offset-2 focus:outline-none',
            isActive(tab.id) ? activeClasses : inactiveClasses,
            tab.disabled ? disabledClasses : '',
            variantClasses,
          ]"
          @click="selectTab(tab.id)"
        >
          <div class="flex items-center gap-2">
            <!-- Icon -->
            <component
              v-if="tab.icon"
              :is="tab.icon"
              :class="['flex-shrink-0', sizeClasses.icon]"
              aria-hidden="true"
            />

            <!-- Label -->
            <span>{{ tab.label }}</span>

            <!-- Badge -->
            <span
              v-if="tab.badge !== undefined"
              :class="[
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                badgeClasses,
              ]"
            >
              {{ tab.badge }}
            </span>
          </div>
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, type Component } from 'vue'

interface Tab {
  id: string
  label: string
  icon?: Component
  disabled?: boolean
  badge?: string | number
}

interface Props {
  /** Active tab ID */
  modelValue?: string
  /** Visual variant */
  variant?: 'default' | 'pills' | 'underline'
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

// Tab management
const tabList = ref<Tab[]>([])
const activeTab = computed(() => props.modelValue || tabList.value[0]?.id)

// Provide tab management functions to child Tab components
const registerTab = (tab: Tab) => {
  if (!tabList.value.find((t) => t.id === tab.id)) {
    tabList.value.push(tab)
  }
}

const unregisterTab = (tabId: string) => {
  const index = tabList.value.findIndex((t) => t.id === tabId)
  if (index > -1) {
    tabList.value.splice(index, 1)
  }
}

const updateTab = (tabId: string, updates: Partial<Tab>) => {
  const tab = tabList.value.find((t) => t.id === tabId)
  if (tab) {
    Object.assign(tab, updates)
  }
}

provide('tabNavigation', {
  activeTab: computed(() => activeTab.value),
  registerTab,
  unregisterTab,
  updateTab,
})

const isActive = (tabId: string) => {
  return activeTab.value === tabId
}

const selectTab = (tabId: string) => {
  if (activeTab.value !== tabId) {
    emit('update:modelValue', tabId)
    emit('change', tabId)
  }
}

const activeClasses = computed(() => {
  switch (props.variant) {
    case 'pills':
      return 'bg-primary-100 text-primary-700 border-primary-500 dark:bg-primary-900 dark:text-primary-300 dark:border-primary-400'
    case 'underline':
      return 'border-primary-500 text-primary-600 dark:text-primary-400'
    default:
      return 'border-primary-500 text-primary-600 dark:text-primary-400'
  }
})

const inactiveClasses = computed(() => {
  switch (props.variant) {
    case 'pills':
      return 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border-transparent dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800'
    case 'underline':
      return 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
    default:
      return 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
  }
})

const disabledClasses = computed(() => {
  return 'opacity-50 cursor-not-allowed'
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'pills':
      return 'rounded-t-lg border-b-0 border-l border-r border-t'
    case 'underline':
      return ''
    default:
      return ''
  }
})

const badgeClasses = computed(() => {
  return 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        icon: 'w-4 h-4',
      }
    case 'lg':
      return {
        icon: 'w-5 h-5',
      }
    default:
      return {
        icon: 'w-4 h-4',
      }
  }
})
</script>
