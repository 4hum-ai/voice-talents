<template>
  <Menu ref="rootEl" as="div" class="relative inline-block text-left">
    <MenuButton as="template">
      <button ref="buttonEl" :class="triggerClass" :aria-label="buttonAriaLabel">
        <slot name="label">
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"
            />
          </svg>
        </slot>
      </button>
    </MenuButton>

    <!-- Popover (desktop) -->
    <TransitionRoot
      appear
      as="template"
      enter="transition ease-out duration-100"
      enter-from="opacity-0 scale-95"
      enter-to="opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leave-from="opacity-100 scale-100"
      leave-to="opacity-0 scale-95"
    >
      <MenuItems as="div" class="contents">
        <div
          ref="itemsEl"
          :style="floatingStyles"
          class="ring-opacity-5 fixed z-50 min-w-[16rem] rounded-md border border-gray-200 bg-white shadow-lg ring-1 ring-black focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:ring-white/10"
        >
          <!-- Header (optional) -->
          <div
            v-if="title || subtitle"
            class="border-b border-gray-200 px-4 py-2 dark:border-gray-700"
          >
            <h3 v-if="title" class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ title }}
            </h3>
            <p v-if="subtitle" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ subtitle }}
            </p>
          </div>

          <div class="py-1" role="none">
            <HMenuItem v-for="item in items" :key="item.key" v-slot="{ active }">
              <button
                type="button"
                :class="[
                  'group flex w-full items-start gap-3 text-left focus:outline-none',
                  itemPadding,
                  active ? 'bg-gray-50 dark:bg-gray-700' : '',
                  item.key === activeItemKey ? 'bg-blue-50 dark:bg-blue-900/20' : '',
                ]"
                @click="onSelect(item)"
              >
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between">
                    <span class="truncate text-sm text-gray-800 dark:text-gray-100">{{
                      item.label
                    }}</span>
                    <div class="flex items-center gap-2">
                      <span
                        v-if="item.value"
                        class="ml-4 shrink-0 text-xs text-gray-500 dark:text-gray-400"
                        >{{ item.value }}</span
                      >
                      <!-- Active indicator -->
                      <svg
                        v-if="item.key === activeItemKey"
                        class="h-4 w-4 text-blue-600 dark:text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <p
                    v-if="item.description"
                    class="mt-0.5 line-clamp-2 text-xs leading-snug text-gray-500 dark:text-gray-400"
                  >
                    {{ item.description }}
                  </p>
                </div>
              </button>
            </HMenuItem>
          </div>
        </div>
      </MenuItems>
    </TransitionRoot>
  </Menu>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem as HMenuItem, TransitionRoot } from '@headlessui/vue'
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom'

export interface MenuItem {
  key: string
  label: string
  description?: string
  value?: string
  disabled?: boolean
  action?: () => void // Custom action function
}

const props = defineProps<{
  items: MenuItem[]
  size?: 'sm' | 'md' | 'lg' | 'xl'
  title?: string
  subtitle?: string
  activeItemKey?: string
}>()
const emit = defineEmits<{ (e: 'select', key: string): void }>()

const rootEl = ref<HTMLElement | null>(null)
const buttonEl = ref<HTMLElement | null>(null)
const itemsEl = ref<HTMLElement | null>(null)
const cleanup = ref<(() => void) | null>(null)
const floatingStyles = ref<Record<string, string>>({})
const buttonAriaLabel = computed(() => 'Open actions menu')
const size = computed(() => props.size || 'md')
const triggerClass = computed(() => {
  const base =
    'inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500'
  const sizes: Record<string, string> = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
  }
  return `${base} ${sizes[size.value]}`
})
const itemPadding = computed(() => {
  const map: Record<string, string> = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-4 py-2.5',
    xl: 'px-5 py-3',
  }
  return map[size.value]
})

const updatePosition = async () => {
  if (!buttonEl.value || !itemsEl.value) return
  const { x, y } = await computePosition(buttonEl.value, itemsEl.value, {
    strategy: 'fixed',
    middleware: [offset(8), flip(), shift({ padding: 8 })],
  })
  floatingStyles.value = { position: 'fixed', left: `${x}px`, top: `${y}px` }
}

const onSelect = (item: MenuItem) => {
  // Execute custom action if provided
  if (item.action) {
    item.action()
  }
  // Emit the select event for backward compatibility
  emit('select', item.key)
}

const onWindowKeydown = () => {}
const onDocumentClick = () => {}

// Floating autoUpdate tied to presence of trigger and items
const stopWatch = watch(
  [buttonEl, itemsEl],
  ([btn, items]) => {
    cleanup.value?.()
    if (btn && items) {
      cleanup.value = autoUpdate(btn, items, updatePosition)
      updatePosition()
    } else {
      cleanup.value = null
    }
  },
  { immediate: true },
)

onMounted(() => {
  window.addEventListener('keydown', onWindowKeydown)
  document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onWindowKeydown)
  document.removeEventListener('click', onDocumentClick)
  stopWatch()
  cleanup.value?.()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.12s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
