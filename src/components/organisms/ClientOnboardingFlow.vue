<template>
  <div v-if="showOnboarding" class="bg-background fixed inset-0 z-50 overflow-hidden">
    <!-- Top Navigation Bar -->
    <div
      class="border-border bg-card/95 absolute top-0 right-0 left-0 z-10 border-b backdrop-blur-sm"
    >
      <div class="flex items-center justify-between px-6 py-4">
        <!-- Left: Previous Button -->
        <Button v-if="currentStep > 1" variant="outline" size="md" @click="previousStep">
          <div class="flex items-center gap-2">
            <Icon name="mdi:chevron-left" class="h-4 w-4" />
            <span>Previous</span>
          </div>
        </Button>
        <div v-else class="w-20" />

        <!-- Center: Progress -->
        <div class="flex items-center space-x-4">
          <div class="text-muted-foreground text-sm">
            Step {{ currentStep }} of {{ totalSteps }}
          </div>
          <div class="bg-muted h-2 w-32 rounded-full">
            <div
              class="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
              :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
            />
          </div>
          <div class="text-muted-foreground text-sm">
            {{ Math.round((currentStep / totalSteps) * 100) }}%
          </div>
        </div>

        <!-- Right: Close and Next/Skip -->
        <div class="flex items-center space-x-3">
          <Button
            v-if="currentStep < totalSteps"
            variant="primary"
            :disabled="!canProceedToNext"
            @click="nextStep"
          >
            Next
            <Icon name="mdi:chevron-right" class="ml-2 h-4 w-4" />
          </Button>
          <Button v-else variant="primary" @click="completeOnboarding">
            Get Started
            <Icon name="mdi:rocket-launch" class="ml-2 h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" @click="closeOnboarding">
            <Icon name="mdi:close" class="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="h-full overflow-y-auto pt-20">
      <div class="mx-auto max-w-4xl px-6 py-8">
        <!-- Step 1: About Your Company -->
        <div v-if="currentStep === 1" class="space-y-8">
          <AccountInformation
            :model-value="accountData"
            :required-fields="['companyName']"
            mode="company"
            @validation-change="updateStepValidation(1, $event)"
            @update:modelValue="handleAccountDataUpdate"
          />
        </div>

        <!-- Step 2: About You -->
        <div v-if="currentStep === 2" class="space-y-8">
          <AccountInformation
            :model-value="accountData"
            :required-fields="['contactName', 'email']"
            mode="personal"
            @validation-change="updateStepValidation(2, $event)"
            @update:modelValue="handleAccountDataUpdate"
          />
        </div>

        <!-- Step 3: Agreement & Legal Requirements (Final Step) -->
        <div v-if="currentStep === 3" class="space-y-8">
          <ClientAgreementStep
            :model-value="agreementData"
            @update:model-value="Object.assign(agreementData, $event)"
            @validation-change="updateStepValidation(3, $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { AccountInformationData } from '@/types/onboarding'
import { useOnboarding } from '@/composables/useOnboarding'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import { AccountInformation, ClientAgreementStep } from '@/components/molecules/ClientSettings'

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
const totalSteps = ref(3)
const stepValidation = reactive<Record<number, boolean>>({})

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

// Legacy onboarding data for compatibility
const onboardingData = ref({
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
  stepValidation[step] = isValid
  console.log('Current stepValidation after update:', stepValidation)
  console.log('canProceedToNext will be:', stepValidation[currentStep.value] ?? false)
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

// Computed
const canProceedToNext = computed(() => {
  const result = stepValidation[currentStep.value] ?? false
  console.log(
    `canProceedToNext for step ${currentStep.value}:`,
    result,
    'stepValidation:',
    stepValidation,
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
