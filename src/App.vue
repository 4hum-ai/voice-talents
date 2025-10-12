<template>
  <NetworkStatusBar />
  <GlobalProgressBar />
  <ToastContainer />
  <GlobalUploadBar />
  <!-- Talent Onboarding -->
  <OnboardingFlow
    :show="showTalentOnboarding"
    @complete="completeTalentOnboarding"
    @skip="skipTalentOnboarding"
    @close="closeTalentOnboarding"
  />

  <!-- Client Onboarding -->
  <ClientOnboardingFlow />
  <router-view v-slot="{ Component, route }">
    <KeepAlive :include="cachedViews">
      <component :is="Component" :key="route.path" />
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
import OnboardingFlow from '@/components/organisms/OnboardingFlow.vue'
import ClientOnboardingFlow from '@/components/organisms/ClientOnboardingFlow.vue'

import LoadingSpinner from '@/components/atoms/LoadingSpinner.vue'
import { computed, onMounted } from 'vue'
import { useUiConfig } from '@/composables/useUiConfig'
import { useToast } from '@/composables/useToast'
import { useOnboarding } from '@/composables/useOnboarding'

const cachedViews = ['Dashboard', 'ItemListView', 'ItemDetailView']

const { state: uiState } = useUiConfig()
const { success } = useToast()
const { shouldShowOnboarding, isTalentMode } = useOnboarding()

const isBootLoading = computed(() => !uiState.initialized || uiState.loading)
const showTalentOnboarding = computed(() => isTalentMode.value && shouldShowOnboarding.value)

const completeTalentOnboarding = () => {
  success('Welcome to VoiceAct! Your talent profile is ready to go.')
}

const skipTalentOnboarding = () => {
  success('You can complete your profile later in settings.')
}

const closeTalentOnboarding = () => {
  // Onboarding will be hidden automatically by the computed property
}

onMounted(() => {
  // The onboarding system will automatically handle showing the appropriate onboarding
  // based on the current mode and completion status
  console.log('App mounted - onboarding system initialized')
})
</script>
