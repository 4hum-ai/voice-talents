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
            class="onboarding-button"
          >
            Next
            <Icon name="mdi:chevron-right" class="ml-2 h-4 w-4" />
          </Button>
          <Button v-else variant="primary" @click="completeOnboarding" class="onboarding-button">
            Get Started
            <Icon name="mdi:rocket-launch" class="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            @click="closeOnboarding"
            class="text-muted-foreground hover:text-foreground"
          >
            <Icon name="mdi:close" class="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="h-full overflow-y-auto pt-20">
      <div class="mx-auto max-w-4xl px-6 py-8">
        <!-- Content -->
        <div class="px-8 py-6">
          <Transition :name="transitionName" mode="out-in">
            <div :key="currentStep" class="space-y-8">
              <!-- Step 1: Welcome -->
              <WelcomeStep v-if="currentStep === 1" />

              <!-- Step 2: Basic Info -->
              <BasicInfoStep
                v-if="currentStep === 2"
                :profile-data="profileData"
                @update="updateProfileData"
              />

              <!-- Step 3: Voice Types -->
              <VoiceTypesStep
                v-if="currentStep === 3"
                :profile-data="profileData"
                @update="updateProfileData"
              />

              <!-- Step 4: Languages -->
              <LanguagesStep
                v-if="currentStep === 4"
                :profile-data="profileData"
                @update="updateProfileData"
              />

              <!-- Step 5: Upload Voice Samples -->
              <VoiceSamplesStep
                v-if="currentStep === 5"
                :profile-data="profileData"
                :voice-samples="voiceSamples"
                @update="updateVoiceSamples"
              />

              <!-- Step 6: Pricing & Rates -->
              <PricingStep
                v-if="currentStep === 6"
                :profile-data="profileData"
                :pricing-data="pricingData"
                @update="updatePricingData"
              />

              <!-- Step 7: Completion -->
              <CompletionStep v-if="currentStep === 7" />
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useToast } from '@/composables/useToast'
import { useOnboarding } from '@/composables/useOnboarding'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import WelcomeStep from '@/components/molecules/TalentProfile/WelcomeStep.vue'
import BasicInfoStep from '@/components/molecules/TalentProfile/BasicInfoStep.vue'
import VoiceTypesStep from '@/components/molecules/TalentProfile/VoiceTypesStep.vue'
import LanguagesStep from '@/components/molecules/TalentProfile/LanguagesStep.vue'
import VoiceSamplesStep from '@/components/molecules/TalentProfile/VoiceSamplesStep.vue'
import PricingStep from '@/components/molecules/TalentProfile/PricingStep.vue'
import CompletionStep from '@/components/molecules/TalentProfile/CompletionStep.vue'

interface Props {
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
})

const emit = defineEmits<{
  complete: []
  skip: []
  close: []
}>()

const { success, error } = useToast()
const { completeTalentOnboarding } = useOnboarding()

// State
const currentStep = ref(1)
const totalSteps = 7
const transitionName = ref('slide-left')

// Profile data
const profileData = reactive({
  displayName: '',
  bio: '',
  location: '',
  avatarUrl: '',
  voiceTypes: [] as string[],
  languages: [] as string[],
})

// Voice samples data - one per voice type
const voiceSamples = reactive<
  Record<
    string,
    {
      file: File
      name: string
      size: number
      previewUrl: string
      title: string
      description: string
    }
  >
>({})

// Preferences data
const preferencesData = reactive({
  notifications: {
    newProjects: true,
    castingCalls: true,
    messages: true,
    deadlines: true,
  },
  privacy: {
    profilePublic: true,
    showContactInfo: false,
    allowDirectMessages: true,
  },
  audioQuality: 'professional',
})

// Pricing data - now dynamic based on selected job types
const pricingData = reactive({
  hourlyRate: '',
  perWordRate: '',
  notes: '',
  // Dynamic rates based on selected job types
  jobTypeRates: {} as Record<string, string>,
})

// Computed
const showOnboarding = computed(() => props.show)

const canProceedToNext = computed(() => {
  switch (currentStep.value) {
    case 1:
      return true // Welcome step
    case 2:
      return profileData.displayName && profileData.bio && profileData.location
    case 3:
      return profileData.voiceTypes.length > 0
    case 4:
      return profileData.languages.length > 0
    case 5:
      // Allow proceeding if at least one voice type has a sample uploaded
      return Object.keys(voiceSamples).length > 0
    case 6:
      // Require at least one job type rate to be set
      return Object.values(pricingData.jobTypeRates).some(
        (rate) => rate && rate !== '' && parseFloat(rate) > 0,
      )
    case 7:
      return true // Completion
    default:
      return false
  }
})

// Update methods for child components
const updateProfileData = (data: Partial<typeof profileData>) => {
  Object.assign(profileData, data)
}

const updateVoiceSamples = (data: Partial<typeof voiceSamples>) => {
  Object.assign(voiceSamples, data)
}

const updatePricingData = (data: Partial<typeof pricingData>) => {
  Object.assign(pricingData, data)
}

// Methods

const nextStep = () => {
  if (currentStep.value < totalSteps && canProceedToNext.value) {
    transitionName.value = 'slide-left'
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    transitionName.value = 'slide-right'
    currentStep.value--
  }
}

const completeOnboarding = async () => {
  try {
    // Save all onboarding data
    const onboardingData = {
      profile: profileData,
      voiceSamples: voiceSamples,
      preferences: preferencesData,
      pricing: pricingData,
      completedAt: new Date().toISOString(),
    }

    // Use the new onboarding system
    completeTalentOnboarding(onboardingData)

    success('Welcome to VoiceTalents! Your profile is ready to go.')
    emit('complete')
  } catch {
    error('Failed to complete onboarding. Please try again.')
  }
}

const closeOnboarding = () => {
  emit('close')
}

// const navigateToFeature = (route: string) => {
//   router.push(route)
// }
</script>

<style scoped>
/* Enhanced slide transitions */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  transform: translateX(100%) scale(0.95);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%) scale(1.05);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-100%) scale(0.95);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%) scale(1.05);
  opacity: 0;
}

/* Form field animations */
.form-field-enter-active {
  transition: all 0.3s ease-out;
}

.form-field-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

/* Button hover effects */
.onboarding-button {
  transition: all 0.2s ease;
  transform: translateY(0);
}

.onboarding-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.onboarding-button:active {
  transform: translateY(0);
}

/* Progress bar animation */
.progress-bar {
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* File upload area animations */
.upload-area {
  transition: all 0.3s ease;
}

.upload-area:hover {
  transform: scale(1.02);
}

.upload-area.drag-over {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

/* Skill tag animations */
.skill-tag {
  transition: all 0.2s ease;
}

.skill-tag:hover {
  transform: scale(1.05);
}

/* Checkbox and radio animations */
input[type='checkbox'],
input[type='radio'] {
  transition: all 0.2s ease;
}

input[type='checkbox']:checked,
input[type='radio']:checked {
  transform: scale(1.1);
}

/* Card hover effects */
.feature-card {
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Icon animations */
.icon-bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-10px);
  }

  60% {
    transform: translateY(-5px);
  }
}

/* Pulse animation for important elements */
.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

/* Loading spinner animation */
.upload-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Fade in animation for content */
.fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Success checkmark animation */
.checkmark {
  animation: checkmark 0.6s ease-in-out;
}

@keyframes checkmark {
  0% {
    transform: scale(0);
    opacity: 0;
  }

  50% {
    transform: scale(1.2);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
