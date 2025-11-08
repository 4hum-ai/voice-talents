<template>
  <NetworkStatusBar />
  <GlobalProgressBar />
  <ToastContainer />
  <GlobalUploadBar />
  <router-view v-slot="{ Component, route }">
    <KeepAlive :include="cachedViews">
      <LayoutRenderer
        v-if="Layout && layoutName !== 'none' && Component"
        :layout="Layout"
        :component="Component"
        :route="route"
      />
      <component v-else :is="Component" :key="route.path" />
    </KeepAlive>
    <div
      v-if="isBootLoading"
      class="fixed inset-0 z-50 grid place-items-center bg-white/80 dark:bg-gray-900/80"
    >
      <div class="flex flex-col items-center gap-3">
        <LoadingSpinner size="md" color="gray" />
        <div class="text-sm text-gray-600 dark:text-gray-300">Loading UI Configuration…</div>
      </div>
    </div>
  </router-view>
</template>

<script setup lang="ts">
import ToastContainer from '@/components/organisms/ToastContainer.vue'
import NetworkStatusBar from '@/components/organisms/NetworkStatusBar.vue'
import GlobalProgressBar from '@/components/organisms/GlobalProgressBar.vue'
import GlobalUploadBar from '@/components/organisms/GlobalUploadBar.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner.vue'
import { computed, defineAsyncComponent, defineComponent, h } from 'vue'
import { useRoute } from 'vue-router'
import { useUiConfig } from '@/composables/useUiConfig'

// Component to render layout with view and forward slots
const LayoutRenderer = defineComponent({
  props: {
    layout: { type: Object, required: true },
    component: { type: Object, required: true },
    route: { type: Object, required: true },
  },
  setup(props) {
    return () => {
      // Create a fragment to render the view component and capture its slots
      const viewComponent = h(props.component, { key: props.route.path })

      // Render layout with view as default slot
      // Note: In Vue 3, slots from dynamically rendered components need special handling
      return h(
        props.layout,
        {
          key: props.route.path,
        },
        {
          default: () => viewComponent,
        },
      )
    }
  },
})

const cachedViews = ['Dashboard', 'ItemListView', 'ItemDetailView']

const { state: uiState } = useUiConfig()
const isBootLoading = computed(() => !uiState.initialized || uiState.loading)

const route = useRoute()

// Map layout names to components (lazy-loaded)
const layouts = {
  talent: defineAsyncComponent(() => import('@/layouts/TalentLayout.vue')),
  client: defineAsyncComponent(() => import('@/layouts/ClientLayout.vue')),
  default: defineAsyncComponent(() => import('@/layouts/DefaultLayout.vue')),
}

// Get layout name from route meta, default to 'default'
const layoutName = computed(() => {
  return (route.meta.layout as string) || 'default'
})

// Get the layout component
const Layout = computed(() => {
  if (layoutName.value === 'none') {
    return null
  }
  return layouts[layoutName.value as keyof typeof layouts] || layouts.default
})
</script>
