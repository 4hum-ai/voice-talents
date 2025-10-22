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
        <!-- Step 1: Welcome & Company Info -->
        <div v-if="currentStep === 1" class="space-y-8">
          <AccountInformation
            :model-value="accountData"
            :required-fields="['companyName', 'contactName', 'email']"
            @validation-change="updateStepValidation(1, $event)"
            @update:modelValue="handleAccountDataUpdate"
          />
        </div>

        <!-- Step 2: Workflow Preferences -->
        <div v-if="currentStep === 2" class="space-y-8">
          <JobPreferences
            v-model="jobPreferencesData"
            :show-public-profile="false"
            @validation-change="updateStepValidation(2, $event)"
          />
        </div>

        <!-- Step 3: Complete Setup -->
        <div v-if="currentStep === 3" class="space-y-8">
          <div class="text-center">
            <div
              class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600"
            >
              <Icon name="mdi:check-circle" class="h-10 w-10 text-white" />
            </div>
            <h1 class="text-foreground mb-4 text-3xl font-bold">You're All Set!</h1>
            <p class="text-muted-foreground mb-8 text-lg">
              Your client account is ready. Start posting jobs and finding amazing voice talent.
            </p>
          </div>

          <div class="bg-card rounded-lg p-8 shadow-lg">
            <h2 class="text-foreground mb-6 text-xl font-semibold">What's Next?</h2>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div class="rounded-lg border border-gray-200 p-6 text-center dark:border-gray-600">
                <Icon name="mdi:plus-circle" class="mx-auto mb-3 h-8 w-8 text-blue-600" />
                <h3 class="text-foreground mb-2 font-medium">Post Your First Job</h3>
                <p class="text-muted-foreground text-sm">
                  Create a job posting to find voice talents
                </p>
              </div>

              <div class="rounded-lg border border-gray-200 p-6 text-center dark:border-gray-600">
                <Icon name="mdi:account-group" class="mx-auto mb-3 h-8 w-8 text-green-600" />
                <h3 class="text-foreground mb-2 font-medium">Browse Talent</h3>
                <p class="text-muted-foreground text-sm">
                  Discover voice talents in our talent pool
                </p>
              </div>

              <div class="rounded-lg border border-gray-200 p-6 text-center dark:border-gray-600">
                <Icon name="mdi:email" class="mx-auto mb-3 h-8 w-8 text-purple-600" />
                <h3 class="text-foreground mb-2 font-medium">Send Invitations</h3>
                <p class="text-muted-foreground text-sm">
                  Invite specific voice talents to your projects
                </p>
              </div>
            </div>
          </div>
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
import { AccountInformation, JobPreferences } from '@/components/molecules/ClientSettings'

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

const jobPreferencesData = reactive({
  autoApprove: false,
  requireNDA: false,
  requirePortfolio: true,
  isPublic: false,
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
    autoApprove: jobPreferencesData.autoApprove,
    requireNDA: jobPreferencesData.requireNDA,
    requirePortfolio: jobPreferencesData.requirePortfolio,
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
