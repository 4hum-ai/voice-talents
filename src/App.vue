<template>
  <NetworkStatusBar />
  <GlobalProgressBar />
  <ToastContainer />
  <GlobalMediaPlayer />
  <router-view v-slot="{ Component, route }">
    <KeepAlive :include="cachedViews">
      <component :is="Component" :key="route.path" />
    </KeepAlive>
    <div
      v-if="isBootLoading"
      class="fixed inset-0 z-50 grid place-items-center bg-white/80 dark:bg-gray-900/80"
    >
      <div class="flex flex-col items-center gap-3">
        <svg
          class="h-8 w-8 animate-spin text-gray-600 dark:text-gray-300"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <div class="text-sm text-gray-600 dark:text-gray-300">
          Loading UI Configuration…
        </div>
      </div>
    </div>
  </router-view>
</template>

<script setup lang="ts">
import ToastContainer from "@/components/organisms/ToastContainer.vue";
import NetworkStatusBar from "@/components/organisms/NetworkStatusBar.vue";
import GlobalProgressBar from "@/components/organisms/GlobalProgressBar.vue";
import GlobalMediaPlayer from "@/components/organisms/GlobalMediaPlayer.vue";
import { computed } from "vue";
import { useUiConfig } from "@/composables/useUiConfig";
const cachedViews = ["Dashboard", "ItemListView", "ItemDetailView"];

const { state: uiState } = useUiConfig();
const isBootLoading = computed(() => !uiState.initialized || uiState.loading);
</script>
