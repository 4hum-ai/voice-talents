/**
 * Onboarding State Management Composable
 * Handles separate onboarding flows for talent (voice actors) and clients
 */

import { ref, computed } from 'vue'

export type UserMode = 'talent' | 'client'
export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed'

interface OnboardingState {
  mode: UserMode | null
  talentOnboarding: OnboardingStatus
  clientOnboarding: OnboardingStatus
  currentStep: number
  totalSteps: number
}

// Local storage keys
const STORAGE_KEYS = {
  USER_MODE: 'voiceact-user-mode',
  TALENT_ONBOARDING: 'voiceact-talent-onboarding-completed',
  CLIENT_ONBOARDING: 'voiceact-client-onboarding-completed',
  TALENT_ONBOARDING_DATA: 'voiceact-talent-onboarding-data',
  CLIENT_ONBOARDING_DATA: 'voiceact-client-onboarding-data',
  CURRENT_STEP: 'voiceact-current-onboarding-step',
  TOTAL_STEPS: 'voiceact-total-onboarding-steps',
}

// Global state
const onboardingState = ref<OnboardingState>({
  mode: null,
  talentOnboarding: 'not_started',
  clientOnboarding: 'not_started',
  currentStep: 1,
  totalSteps: 1,
})

export function useOnboarding() {
  // Initialize state from localStorage
  const initializeState = () => {
    const mode = localStorage.getItem(STORAGE_KEYS.USER_MODE) as UserMode | null
    const talentCompleted = localStorage.getItem(STORAGE_KEYS.TALENT_ONBOARDING) === 'true'
    const clientCompleted = localStorage.getItem(STORAGE_KEYS.CLIENT_ONBOARDING) === 'true'
    const currentStep = parseInt(localStorage.getItem(STORAGE_KEYS.CURRENT_STEP) || '1')
    const totalSteps = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_STEPS) || '1')

    onboardingState.value = {
      mode,
      talentOnboarding: talentCompleted ? 'completed' : 'not_started',
      clientOnboarding: clientCompleted ? 'completed' : 'not_started',
      currentStep,
      totalSteps,
    }
  }

  // Computed properties
  const currentMode = computed(() => onboardingState.value.mode)
  const isTalentMode = computed(() => onboardingState.value.mode === 'talent')
  const isClientMode = computed(() => onboardingState.value.mode === 'client')

  const talentOnboardingStatus = computed(() => onboardingState.value.talentOnboarding)
  const clientOnboardingStatus = computed(() => onboardingState.value.clientOnboarding)

  const isTalentOnboardingCompleted = computed(
    () => onboardingState.value.talentOnboarding === 'completed',
  )
  const isClientOnboardingCompleted = computed(
    () => onboardingState.value.clientOnboarding === 'completed',
  )

  const currentOnboardingStatus = computed(() => {
    if (onboardingState.value.mode === 'talent') {
      return onboardingState.value.talentOnboarding
    } else if (onboardingState.value.mode === 'client') {
      return onboardingState.value.clientOnboarding
    }
    return 'not_started'
  })

  const isCurrentOnboardingCompleted = computed(() => {
    return currentOnboardingStatus.value === 'completed'
  })

  const shouldShowOnboarding = computed(() => {
    return !isCurrentOnboardingCompleted.value && onboardingState.value.mode !== null
  })

  // Actions
  const setUserMode = (mode: UserMode) => {
    onboardingState.value.mode = mode
    localStorage.setItem(STORAGE_KEYS.USER_MODE, mode)
  }

  const startTalentOnboarding = () => {
    setUserMode('talent')
    onboardingState.value.talentOnboarding = 'in_progress'
    onboardingState.value.currentStep = 1
    localStorage.setItem(STORAGE_KEYS.TALENT_ONBOARDING, 'false')
    localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, '1')
  }

  const startClientOnboarding = () => {
    setUserMode('client')
    onboardingState.value.clientOnboarding = 'in_progress'
    onboardingState.value.currentStep = 1
    localStorage.setItem(STORAGE_KEYS.CLIENT_ONBOARDING, 'false')
    localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, '1')
  }

  const setOnboardingSteps = (current: number, total: number) => {
    onboardingState.value.currentStep = current
    onboardingState.value.totalSteps = total
    localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, current.toString())
    localStorage.setItem(STORAGE_KEYS.TOTAL_STEPS, total.toString())
  }

  const updateOnboardingStep = (step: number) => {
    onboardingState.value.currentStep = step
    localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, step.toString())
  }

  const completeTalentOnboarding = (data?: any) => {
    onboardingState.value.talentOnboarding = 'completed'
    localStorage.setItem(STORAGE_KEYS.TALENT_ONBOARDING, 'true')
    if (data) {
      localStorage.setItem(STORAGE_KEYS.TALENT_ONBOARDING_DATA, JSON.stringify(data))
    }
  }

  const completeClientOnboarding = (data?: any) => {
    onboardingState.value.clientOnboarding = 'completed'
    localStorage.setItem(STORAGE_KEYS.CLIENT_ONBOARDING, 'true')
    if (data) {
      localStorage.setItem(STORAGE_KEYS.CLIENT_ONBOARDING_DATA, JSON.stringify(data))
    }
  }

  const completeCurrentOnboarding = (data?: any) => {
    if (onboardingState.value.mode === 'talent') {
      completeTalentOnboarding(data)
    } else if (onboardingState.value.mode === 'client') {
      completeClientOnboarding(data)
    }
  }

  const resetTalentOnboarding = () => {
    onboardingState.value.talentOnboarding = 'not_started'
    localStorage.removeItem(STORAGE_KEYS.TALENT_ONBOARDING)
    localStorage.removeItem(STORAGE_KEYS.TALENT_ONBOARDING_DATA)
  }

  const resetClientOnboarding = () => {
    onboardingState.value.clientOnboarding = 'not_started'
    localStorage.removeItem(STORAGE_KEYS.CLIENT_ONBOARDING)
    localStorage.removeItem(STORAGE_KEYS.CLIENT_ONBOARDING_DATA)
  }

  const resetAllOnboarding = () => {
    onboardingState.value.mode = null
    onboardingState.value.talentOnboarding = 'not_started'
    onboardingState.value.clientOnboarding = 'not_started'
    onboardingState.value.currentStep = 1
    onboardingState.value.totalSteps = 1

    // Clear all localStorage
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  }

  const getOnboardingData = (mode: UserMode) => {
    const key =
      mode === 'talent' ? STORAGE_KEYS.TALENT_ONBOARDING_DATA : STORAGE_KEYS.CLIENT_ONBOARDING_DATA
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }

  const switchMode = (newMode: UserMode) => {
    setUserMode(newMode)
    // Don't automatically start onboarding when switching modes
    // Let the user decide if they want to complete onboarding for the new mode
  }

  // Initialize state on first use
  initializeState()

  return {
    // State
    onboardingState: onboardingState.value,
    currentMode,
    isTalentMode,
    isClientMode,
    talentOnboardingStatus,
    clientOnboardingStatus,
    isTalentOnboardingCompleted,
    isClientOnboardingCompleted,
    currentOnboardingStatus,
    isCurrentOnboardingCompleted,
    shouldShowOnboarding,

    // Actions
    setUserMode,
    startTalentOnboarding,
    startClientOnboarding,
    setOnboardingSteps,
    updateOnboardingStep,
    completeTalentOnboarding,
    completeClientOnboarding,
    completeCurrentOnboarding,
    resetTalentOnboarding,
    resetClientOnboarding,
    resetAllOnboarding,
    getOnboardingData,
    switchMode,

    // Storage keys (for debugging)
    STORAGE_KEYS,
  }
}
