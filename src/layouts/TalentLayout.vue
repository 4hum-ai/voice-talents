<template>
  <div class="flex h-screen flex-row">
    <!-- Navigation Sidebar -->
    <VoiceActNavigation />

    <!-- Main Content -->
    <div class="flex-auto overflow-auto">
      <!-- Header -->
      <AppBar
        v-if="showAppBar"
        :show-menu="true"
        :show-back="showBack"
        :fixed="false"
        class="sticky top-0 z-10"
        @menu="toggleSidebar"
        @back="handleBack"
      >
        <template #title>
          <slot name="title">
            <span v-if="title && typeof title === 'string'">{{ title }}</span>
            <component v-else-if="title" :is="title" />
          </slot>
        </template>
        <template #subtitle>
          <slot name="subtitle">
            <span v-if="subtitle && typeof subtitle === 'string'">{{ subtitle }}</span>
            <component v-else-if="subtitle" :is="subtitle" />
          </slot>
        </template>
        <template #actions>
          <slot name="actions">
            <template v-if="actions && Array.isArray(actions)">
              <component v-for="(action, idx) in actions" :key="idx" :is="action" />
            </template>
            <component v-else-if="actions" :is="actions" />
          </slot>
        </template>
      </AppBar>

      <!-- Page Content -->
      <div :class="['px-4 py-8 sm:px-6 lg:px-8']">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSidebar } from '@/composables/useSidebar'
import { provideLayoutSlots } from '@/composables/useLayoutSlots'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'

const route = useRoute()

// Provide layout slots for views to inject (for actions and dynamic subtitle)
const { actions: actionsRef, subtitle: subtitleRef } = provideLayoutSlots()

// Get title and subtitle from route meta first, then fall back to composable
const title = computed(() => route.meta.title || '')
const subtitle = computed(() => route.meta.subtitle || subtitleRef.value || '')
const actions = computed(() => actionsRef.value)

interface Props {
  /** Whether to show the back button in the AppBar */
  showBack?: boolean
  /** Whether to show the AppBar */
  showAppBar?: boolean
  /** Whether the AppBar should be fixed */
  appBarFixed?: boolean
}

withDefaults(defineProps<Props>(), {
  showBack: false,
  showAppBar: true,
  appBarFixed: true,
})

const emit = defineEmits<{
  back: []
}>()

const router = useRouter()
const { toggle: toggleSidebar } = useSidebar()

const handleBack = () => {
  emit('back')
  // Fallback to router.back() if no custom handler
  router.back()
}
</script>
