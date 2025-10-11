<template>
  <NetworkStatusBar />
  <GlobalProgressBar />
  <ToastContainer />
  <GlobalUploadBar />
  <OnboardingFlow
    :show="showOnboarding"
    @complete="completeOnboarding"
    @skip="skipOnboarding"
    @close="closeOnboarding"
  />
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

import LoadingSpinner from '@/components/atoms/LoadingSpinner.vue'
import { computed, ref, onMounted } from 'vue'
import { useUiConfig } from '@/composables/useUiConfig'
import { useToast } from '@/composables/useToast'

const cachedViews = ['Dashboard', 'ItemListView', 'ItemDetailView']

const { state: uiState } = useUiConfig()
const { success } = useToast()

const isBootLoading = computed(() => !uiState.initialized || uiState.loading)
const showOnboarding = ref(false)

const completeOnboarding = () => {
  showOnboarding.value = false
  success('Welcome to VoiceAct! Your profile is ready to go.')
}

const skipOnboarding = () => {
  showOnboarding.value = false
}

const closeOnboarding = () => {
  showOnboarding.value = false
}

onMounted(() => {
  // Check if user has completed onboarding
  const hasCompletedOnboarding = localStorage.getItem('voiceact-onboarding-completed')
  const onboardingData = localStorage.getItem('voiceact-onboarding-data')
  
  if (!hasCompletedOnboarding) {
    // Show onboarding after a short delay
    setTimeout(() => {
      showOnboarding.value = true
    }, 1000)
  } else if (onboardingData) {
    // Check if profile is incomplete and suggest re-onboarding
    try {
      const data = JSON.parse(onboardingData)
      const isProfileIncomplete = !data.profile?.displayName || 
                                 !data.profile?.bio || 
                                 !data.profile?.experience ||
                                 !data.profile?.voiceTypes?.length ||
                                 !data.profile?.languages?.length
      
      if (isProfileIncomplete) {
        // Show a subtle notification to complete profile
        setTimeout(() => {
          success('Complete your profile to get the most out of VoiceAct!', 'Profile Incomplete')
        }, 2000)
      }
    } catch (err) {
      console.warn('Failed to parse onboarding data:', err)
    }
  }
})
</script>
