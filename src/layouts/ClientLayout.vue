<template>
  <div class="flex h-screen flex-row">
    <!-- Navigation Sidebar -->
    <ClientNavigation />

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
          <slot name="title" />
        </template>
        <template #subtitle>
          <slot name="subtitle" />
        </template>
        <template #actions>
          <slot name="actions" />
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
import { useRouter } from 'vue-router'
import { useSidebar } from '@/composables/useSidebar'
import ClientNavigation from '@/components/organisms/ClientNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'

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
