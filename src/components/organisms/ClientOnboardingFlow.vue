<template>
  <OnboardingStepContainer
    v-if="showOnboarding"
    v-model="currentStep"
    :total-steps="totalSteps"
    :can-proceed="canProceedToNext"
    @next="nextStep"
    @previous="previousStep"
    @complete="completeOnboarding"
    @close="closeOnboarding"
  >
    <!-- Step 1: About Your Company -->
    <OnboardingStep :step="1" :valid="stepValidation[1]">
      <AccountInformation
        :model-value="accountData"
        :required-fields="['companyName']"
        mode="company"
        @validation-change="updateStepValidation(1, $event)"
        @update:modelValue="handleAccountDataUpdate"
      />
    </OnboardingStep>

    <!-- Step 2: About You -->
    <OnboardingStep :step="2" :valid="stepValidation[2]">
      <AccountInformation
        :model-value="accountData"
        :required-fields="['contactName', 'email']"
        mode="personal"
        @validation-change="updateStepValidation(2, $event)"
        @update:modelValue="handleAccountDataUpdate"
      />
    </OnboardingStep>

    <!-- Step 3: Project Types -->
    <OnboardingStep :step="3" :valid="stepValidation[3]">
      <ClientProjectTypesStep
        :model-value="projectTypesData"
        @update:model-value="handleProjectTypesUpdate"
        @validation-change="updateStepValidation(3, $event)"
      />
    </OnboardingStep>

    <!-- Step 4: Agreement & Legal Requirements (Final Step) -->
    <OnboardingStep :step="4" :valid="stepValidation[4]">
      <ClientAgreementStep
        :model-value="agreementData"
        @update:model-value="Object.assign(agreementData, $event)"
        @validation-change="updateStepValidation(4, $event)"
      />
    </OnboardingStep>
  </OnboardingStepContainer>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { AccountInformationData } from '@/types/onboarding'
import { useOnboarding } from '@/composables/useOnboarding'
import OnboardingStepContainer from '@/components/molecules/OnboardingStepContainer.vue'
import OnboardingStep from '@/components/molecules/OnboardingStep.vue'
import {
  AccountInformation,
  ClientAgreementStep,
  ClientProjectTypesStep,
} from '@/components/molecules/ClientSettings'

const router = useRouter()
const {
  shouldShowOnboarding,
  currentMode,
  isClientMode,
  setOnboardingSteps,
  updateOnboardingStep,
  completeCurrentOnboarding,
} = useOnboarding()

// State
const showOnboarding = ref(false)
const currentStep = ref(1)
const totalSteps = ref(4)
// Use a Map-like approach with explicit refs for better reactivity tracking
const stepValidation = reactive({
  1: false,
  2: false,
  3: false,
  4: false,
} as Record<number, boolean>)

// Agreement data
const agreementData = reactive({
  acceptedTerms: false,
})

// Component data structures
const accountData = reactive({
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  website: '',
  location: '',
  timezone: '',
  industry: '',
  companySize: 'small' as 'startup' | 'small' | 'medium' | 'large' | 'enterprise',
  description: '',
})

// Project types data
const projectTypesData = reactive<string[]>([])

// Legacy onboarding data for compatibility
const onboardingData = ref<Record<string, unknown>>({
  companyName: '',
  contactName: '',
  email: '',
  industry: '',
  autoApprove: false,
  requireNDA: false,
  requirePortfolio: true,
})

// Methods
const updateStepValidation = (step: number, isValid: boolean) => {
  console.log(`updateStepValidation called - Step ${step} validation:`, isValid)

  // Ensure the property exists in the reactive object to help Vue track it
  if (!(step in stepValidation)) {
    // Initialize the property if it doesn't exist
    stepValidation[step] = false
  }

  // Update the value
  stepValidation[step] = isValid

  // Force reactivity by accessing the object
  console.log('Current stepValidation after update:', JSON.parse(JSON.stringify(stepValidation)))
  console.log('Current step:', currentStep.value)
  console.log('Step validation value for current step:', stepValidation[currentStep.value])
  console.log('stepValidation object keys:', Object.keys(stepValidation))
}

const handleAccountDataUpdate = (newData: AccountInformationData) => {
  console.log('handleAccountDataUpdate called with:', newData)
  // Update each field individually to ensure reactivity
  Object.keys(newData).forEach((key) => {
    if (key in accountData) {
      const value = newData[key as keyof AccountInformationData]
      if (key === 'companySize' && typeof value === 'string') {
        accountData.companySize = value as 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
      } else if (key !== 'companySize') {
        ;(accountData as Record<string, unknown>)[key] = value
      }
    }
  })
  console.log('Updated accountData:', accountData)
}

const handleProjectTypesUpdate = (newTypes: string[]) => {
  projectTypesData.length = 0
  projectTypesData.push(...newTypes)
  console.log('Updated projectTypesData:', projectTypesData)
}

// Computed - track both currentStep and stepValidation explicitly
const canProceedToNext = computed(() => {
  // Access both to ensure reactivity tracking
  const step = currentStep.value
  const validation = stepValidation[step]
  const result = validation ?? false
  console.log(
    `canProceedToNext for step ${step}:`,
    result,
    'stepValidation[step]:',
    validation,
    'Full stepValidation:',
    { ...stepValidation },
  )
  return result
})

// Methods
const nextStep = () => {
  if (currentStep.value < totalSteps.value) {
    currentStep.value++
    updateOnboardingStep(currentStep.value)
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    updateOnboardingStep(currentStep.value)
  }
}

const completeOnboarding = () => {
  // Update legacy data for compatibility
  onboardingData.value = {
    companyName: accountData.companyName,
    contactName: accountData.contactName,
    email: accountData.email,
    industry: accountData.industry,
    autoApprove: false,
    requireNDA: false,
    requirePortfolio: true,
    projectTypes: [...projectTypesData], // Store selected project types
  }

  // Save onboarding data
  completeCurrentOnboarding(onboardingData.value)

  // Hide onboarding
  showOnboarding.value = false

  // Navigate to client dashboard
  router.push('/client/dashboard')
}

const closeOnboarding = () => {
  showOnboarding.value = false
}

// Initialize
onMounted(() => {
  // Check if we should show client onboarding
  if (isClientMode.value && shouldShowOnboarding.value) {
    showOnboarding.value = true
    setOnboardingSteps(currentStep.value, totalSteps.value)
  }
})

// Watch for mode changes
watch(
  () => currentMode.value,
  (newMode) => {
    if (newMode === 'client' && shouldShowOnboarding.value) {
      showOnboarding.value = true
      setOnboardingSteps(currentStep.value, totalSteps.value)
    } else {
      showOnboarding.value = false
    }
  },
)
</script>
