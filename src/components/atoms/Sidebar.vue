<template>
  <aside
    :class="[
      'bg-card border-border flex flex-col border-r transition-all duration-300 ease-in-out',
      collapsed ? 'w-16' : 'w-72',
      fixed ? 'fixed top-0 left-0 z-30 h-screen' : 'relative h-screen',
    ]"
  >
    <!-- Header -->
    <div class="border-border flex h-16 flex-shrink-0 items-center justify-between border-b px-4">
      <div v-if="!collapsed" class="flex min-w-0 items-center space-x-2">
        <h2 class="text-foreground truncate text-lg font-semibold">{{ title }}</h2>
        <span v-if="subtitle" class="text-muted-foreground truncate text-sm">{{ subtitle }}</span>
      </div>
      <button
        @click="collapsed = !collapsed"
        class="text-muted-foreground hover:text-foreground hover:bg-muted flex-shrink-0 rounded-md p-2 transition-colors"
        :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      >
        <IconChevronLeft
          class="h-4 w-4 transition-transform"
          :class="{ 'rotate-180': collapsed }"
        />
      </button>
    </div>

    <!-- Custom Header Slot -->
    <div v-if="!collapsed && $slots.header" class="border-border flex-shrink-0 border-b">
      <slot name="header" />
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-x-hidden overflow-y-auto py-4">
      <div class="space-y-6 px-3">
        <div v-for="section in sections" :key="section.id" class="space-y-2">
          <!-- Section Header -->
          <div v-if="!collapsed && section.title" class="px-3 py-2">
            <h3 class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              {{ section.title }}
            </h3>
          </div>

          <!-- Section Items -->
          <div class="space-y-1">
            <button
              v-for="item in section.items"
              :key="item.id"
              @click="handleItemClick(item)"
              :class="[
                'flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                'hover:bg-muted/60 hover:text-foreground',
                'focus:ring-primary/20 focus:ring-2 focus:ring-offset-1 focus:outline-none',
                item.id === activeItemId
                  ? 'bg-primary/10 text-primary border-primary/20 border'
                  : 'text-muted-foreground',
              ]"
              :title="collapsed ? item.title : undefined"
            >
              <!-- Icon -->
              <div class="flex-shrink-0">
                <component :is="item.icon" v-if="item.icon" class="h-4 w-4" aria-hidden="true" />
                <div v-else class="h-4 w-4" />
              </div>

              <!-- Text (hidden when collapsed) -->
              <div v-if="!collapsed" class="ml-3 min-w-0 flex-1 text-left">
                <span class="block truncate">{{ item.title }}</span>
                <p
                  v-if="item.description"
                  class="text-muted-foreground mt-1 truncate text-xs leading-relaxed"
                >
                  {{ item.description }}
                </p>
              </div>

              <!-- Badge (hidden when collapsed) -->
              <div v-if="!collapsed && item.badge" class="ml-auto flex-shrink-0">
                <span
                  class="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                >
                  {{ item.badge }}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Footer (optional) -->
    <div v-if="!collapsed && $slots.footer" class="border-border flex-shrink-0 border-t p-4">
      <slot name="footer" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, type Component } from 'vue'
import IconChevronLeft from '~icons/mdi/chevron-left'

interface SidebarItem {
  id: string
  title: string
  description?: string
  icon?: Component
  badge?: string | number
  action?: () => void
}

interface SidebarSection {
  id: string
  title?: string
  items: SidebarItem[]
}

interface Props {
  /** Title of the sidebar */
  title: string
  /** Optional subtitle */
  subtitle?: string
  /** Navigation sections */
  sections: SidebarSection[]
  /** ID of the currently active item */
  activeItemId?: string
  /** Whether the sidebar is fixed positioned */
  fixed?: boolean
  /** Whether the sidebar starts collapsed */
  defaultCollapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fixed: false,
  defaultCollapsed: false,
})

const collapsed = ref(props.defaultCollapsed)

const handleItemClick = (item: SidebarItem) => {
  if (item.action) {
    item.action()
  }
}
</script>
