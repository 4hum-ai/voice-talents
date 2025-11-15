<template>
  <StepContainer
    v-if="show"
    v-model="currentStep"
    :total-steps="totalSteps"
    :can-proceed="canProceedToNext"
    @next="nextStep"
    @previous="previousStep"
    @complete="completeOnboarding"
    @close="closeOnboarding"
  >
    <!-- Content with transition animations -->
    <Transition :name="transitionName" mode="out-in">
      <div :key="currentStep">
        <!-- Step 1: Welcome -->
        <Step :step="1" :valid="true">
          <WelcomeStep />
        </Step>

        <!-- Step 2: Basic Info -->
        <Step :step="2" :valid="form.isStepValid.value">
          <BasicInfoStep :profile-data="profileData" @update="updateProfileData" />
        </Step>

        <!-- Step 3: Voice Types -->
        <Step :step="3" :valid="form.isStepValid.value">
          <VoiceTypesStep :profile-data="profileData" @update="updateProfileData" />
        </Step>

        <!-- Step 4: Languages -->
        <Step :step="4" :valid="form.isStepValid.value">
          <LanguagesStep :profile-data="profileData" @update="updateProfileData" />
        </Step>

        <!-- Step 5: Upload Voice Samples -->
        <Step :step="5" :valid="Object.keys(voiceSamples).length > 0">
          <VoiceSamplesStep
            :profile-data="profileData"
            :voice-samples="voiceSamples"
            @update="updateVoiceSamples"
          />
        </Step>

        <!-- Step 6: Pricing & Rates -->
        <Step
          :step="6"
          :valid="
            Object.values(pricingData.jobTypeRates).some(
              (rate) => rate && rate !== '' && parseFloat(rate) > 0,
            )
          "
        >
          <PricingStep
            :profile-data="profileData"
            :pricing-data="pricingData"
            @update="updatePricingData"
          />
        </Step>

        <!-- Step 7: Payout Preferences -->
        <Step :step="7" :valid="form.isStepValid.value">
          <PayoutPreferencesStep
            :payout-data="{
              frequency: form.getField('payoutFrequency') || 'manual',
              thresholdAmount: form.getField('thresholdAmount'),
              currency: form.getField('currency') || 'USD',
            }"
            @update="updatePayoutData"
          />
        </Step>

        <!-- Step 8: Agreement & Legal Requirements (Final Step) -->
        <Step :step="8" :valid="form.isStepValid.value">
          <AgreementStep
            :model-value="{
              isAgeVerified: form.getField('isAgeVerified') || false,
              acceptedTerms: form.getField('acceptedTerms') || false,
              acceptedPlatformAgreement: form.getField('acceptedPlatformAgreement') || false,
            }"
            @update:model-value="
              (data) => {
                form.setField('isAgeVerified', data.isAgeVerified)
                form.setField('acceptedTerms', data.acceptedTerms)
                form.setField('acceptedPlatformAgreement', data.acceptedPlatformAgreement)
              }
            "
          />
        </Step>
      </div>
    </Transition>
  </StepContainer>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useToast } from '@/lib/toast'
import { useOnboarding } from '@/composables/useOnboarding'
import { useJobType } from '@/composables/useJobType'
import { useForm, type FormDefinition } from '@/lib/form'
import StepContainer from '@/components/molecules/StepContainer.vue'
import Step from '@/components/molecules/Step.vue'
import WelcomeStep from '@/components/molecules/TalentProfile/WelcomeStep.vue'
import AgreementStep from '@/components/molecules/TalentProfile/AgreementStep.vue'
import BasicInfoStep from '@/components/molecules/TalentProfile/BasicInfoStep.vue'
import VoiceTypesStep from '@/components/molecules/TalentProfile/VoiceTypesStep.vue'
import LanguagesStep from '@/components/molecules/TalentProfile/LanguagesStep.vue'
import VoiceSamplesStep from '@/components/molecules/TalentProfile/VoiceSamplesStep.vue'
import PricingStep from '@/components/molecules/TalentProfile/PricingStep.vue'
import PayoutPreferencesStep from '@/components/molecules/TalentProfile/PayoutPreferencesStep.vue'

interface Props {
  show?: boolean
}

withDefaults(defineProps<Props>(), {
  show: false,
})

const emit = defineEmits<{
  complete: []
  skip: []
  close: []
}>()

const { success, error } = useToast()
const { completeTalentOnboarding } = useOnboarding()
const { availableJobTypes } = useJobType()

// Create form definition with dynamic options
const createFormDefinition = (): FormDefinition => {
  const voiceTypeOptions = availableJobTypes.value.map((type) => ({
    value: type.value,
    label: type.label,
  }))

  const languageOptions = [
    { value: 'English', label: 'English' },
    { value: 'Vietnamese', label: 'Vietnamese' },
    { value: 'German', label: 'German' },
  ]

  return {
    id: 'talent-onboarding',
    persistToStorage: true,
    excludeFromStorage: ['voiceSamples'], // Files can't be serialized
    initialStep: 1,
    steps: [
      {
        step: 1,
        title: 'Welcome',
        fields: [], // No fields, just content
      },
      {
        step: 2,
        title: 'Basic Info',
        fields: [
          {
            name: 'displayName',
            type: 'text',
            label: 'What should we call you?',
            placeholder: 'Your professional name',
            required: true,
            validation: [
              { type: 'required', message: 'Display name is required' },
              { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' },
            ],
          },
          {
            name: 'location',
            type: 'text',
            label: 'Where do you call home?',
            placeholder: 'City, Country',
            required: true,
            validation: [
              { type: 'required', message: 'Location is required' },
              { type: 'minLength', value: 2, message: 'Location must be at least 2 characters' },
            ],
          },
          {
            name: 'bio',
            type: 'textarea',
            label: 'Describe your voice',
            placeholder: 'Describe your voice tone, range, style, characteristics...',
            required: true,
            validation: [
              { type: 'required', message: 'Bio is required' },
              { type: 'minLength', value: 10, message: 'Bio must be at least 10 characters' },
              { type: 'maxLength', value: 500, message: 'Bio must be no more than 500 characters' },
            ],
          },
        ],
      },
      {
        step: 3,
        title: 'Voice Types',
        fields: [
          {
            name: 'voiceTypes',
            type: 'multiselect',
            label: 'Select all the types of voice work you specialize in',
            required: true,
            options: voiceTypeOptions,
            validation: [
              {
                type: 'custom',
                validator: (value) => {
                  if (!Array.isArray(value) || value.length === 0) {
                    return 'Please select at least one voice type'
                  }
                  return true
                },
              },
            ],
          },
        ],
      },
      {
        step: 4,
        title: 'Languages',
        fields: [
          {
            name: 'languages',
            type: 'multiselect',
            label: 'Select all languages you can perform in',
            required: true,
            options: languageOptions,
            validation: [
              {
                type: 'custom',
                validator: (value) => {
                  if (!Array.isArray(value) || value.length === 0) {
                    return 'Please select at least one language'
                  }
                  return true
                },
              },
            ],
          },
        ],
      },
      {
        step: 5,
        title: 'Upload Voice Samples',
        fields: [], // File uploads handled separately
      },
      {
        step: 6,
        title: 'Pricing & Rates',
        fields: [], // Dynamic pricing fields handled separately
      },
      {
        step: 7,
        title: 'Payout Preferences',
        fields: [
          {
            name: 'payoutFrequency',
            type: 'radio',
            label: 'Payout Frequency',
            required: true,
            options: [
              { value: 'monthly', label: 'Monthly Automatic Payout' },
              { value: 'threshold', label: 'Threshold-Based Payout' },
              { value: 'manual', label: 'Manual Payout (Request Anytime)' },
            ],
            defaultValue: 'manual',
          },
          {
            name: 'thresholdAmount',
            type: 'number',
            label: 'Payout Threshold Amount',
            placeholder: '500',
            dependencies: [
              {
                field: 'payoutFrequency',
                operator: 'equals',
                value: 'threshold',
              },
            ],
            validation: [
              {
                type: 'custom',
                validator: (value, formData) => {
                  if (formData.payoutFrequency === 'threshold') {
                    if (!value || value < 5) {
                      return 'Minimum threshold is $5.00'
                    }
                  }
                  return true
                },
              },
            ],
          },
          {
            name: 'currency',
            type: 'select',
            label: 'Preferred Currency',
            defaultValue: 'USD',
            options: [
              { value: 'USD', label: 'USD - US Dollar' },
              { value: 'EUR', label: 'EUR - Euro' },
              { value: 'JPY', label: 'JPY - Japanese Yen' },
              { value: 'KRW', label: 'KRW - South Korean Won' },
              { value: 'CNY', label: 'CNY - Chinese Yuan' },
              { value: 'INR', label: 'INR - Indian Rupee' },
            ],
          },
        ],
      },
      {
        step: 8,
        title: 'Agreement & Legal Requirements',
        fields: [
          {
            name: 'isAgeVerified',
            type: 'checkbox',
            label: 'I confirm that I am at least 18 years old',
            required: true,
            validation: [
              {
                type: 'custom',
                validator: (value) => {
                  if (value !== true) {
                    return 'You must confirm your age to continue'
                  }
                  return true
                },
              },
            ],
          },
          {
            name: 'acceptedTerms',
            type: 'checkbox',
            label: 'I have read and agree to the Terms of Service',
            required: true,
            validation: [
              {
                type: 'custom',
                validator: (value) => {
                  if (value !== true) {
                    return 'You must accept the terms and conditions to continue'
                  }
                  return true
                },
              },
            ],
          },
          {
            name: 'acceptedPlatformAgreement',
            type: 'checkbox',
            label: 'I have read and agree to the Platform Agreement',
            required: true,
            validation: [
              {
                type: 'custom',
                validator: (value) => {
                  if (value !== true) {
                    return 'You must accept the platform agreement to continue'
                  }
                  return true
                },
              },
            ],
          },
        ],
      },
    ],
  }
}

// Initialize form with definition
const form = useForm({
  definition: createFormDefinition(),
  persistToStorage: true,
  excludeFromStorage: ['voiceSamples'],
})

// Sync form.currentStep with StepContainer
const currentStep = computed({
  get: () => form.currentStep.value,
  set: (value: number) => form.goToStep(value),
})

const totalSteps = computed(() => form.totalSteps.value)
const transitionName = ref('slide-left')

// Avatar data (handled separately, not in form - files can't be serialized)
const avatarUrl = ref<string>('')

// Voice samples data - one per voice type (handled separately, not in form)
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

// Pricing data - dynamic based on selected job types (handled separately)
const pricingData = reactive({
  hourlyRate: '',
  perWordRate: '',
  notes: '',
  jobTypeRates: {} as Record<string, string>,
})

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

// Computed - use form validation for steps with form fields, custom for others
const canProceedToNext = computed((): boolean => {
  switch (currentStep.value) {
    case 1:
      return true // Welcome step
    case 2:
    case 3:
    case 4:
    case 7:
    case 8:
      // Steps with form fields - use form validation
      return form.isStepValid.value
    case 5:
      // Voice samples - at least one sample required
      return Object.keys(voiceSamples).length > 0
    case 6:
      // Pricing - at least one job type rate required
      return Object.values(pricingData.jobTypeRates).some(
        (rate) => rate && rate !== '' && parseFloat(rate) > 0,
      )
    default:
      return false
  }
})

// Profile data computed from form
const profileData = computed(() => ({
  displayName: form.getField('displayName') || '',
  bio: form.getField('bio') || '',
  location: form.getField('location') || '',
  avatarUrl: avatarUrl.value,
  voiceTypes: (form.getField('voiceTypes') as string[]) || [],
  languages: (form.getField('languages') as string[]) || [],
}))

// Update methods for child components
const updateProfileData = (data: Partial<typeof profileData.value>) => {
  if (data.displayName !== undefined) form.setField('displayName', data.displayName)
  if (data.bio !== undefined) form.setField('bio', data.bio)
  if (data.location !== undefined) form.setField('location', data.location)
  if (data.avatarUrl !== undefined) avatarUrl.value = data.avatarUrl
  if (data.voiceTypes !== undefined) form.setField('voiceTypes', data.voiceTypes)
  if (data.languages !== undefined) form.setField('languages', data.languages)
}

const updateVoiceSamples = (data: Partial<typeof voiceSamples>) => {
  Object.assign(voiceSamples, data)
}

const updatePricingData = (data: Partial<typeof pricingData>) => {
  Object.assign(pricingData, data)
}

const updatePayoutData = (
  data: Partial<{ frequency: string; thresholdAmount?: number; currency: string }>,
) => {
  if (data.frequency !== undefined) form.setField('payoutFrequency', data.frequency)
  if (data.thresholdAmount !== undefined) form.setField('thresholdAmount', data.thresholdAmount)
  if (data.currency !== undefined) form.setField('currency', data.currency)
}

// Methods
const nextStep = () => {
  if (currentStep.value < totalSteps.value && canProceedToNext.value) {
    transitionName.value = 'slide-left'
    if (form.nextStep()) {
      // Step navigation handled by form
    }
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    transitionName.value = 'slide-right'
    form.previousStep()
  }
}

const completeOnboarding = async () => {
  try {
    // Get form data
    const formData = form.getFormData()

    // Save all onboarding data
    const onboardingData = {
      agreement: {
        isAgeVerified: formData.isAgeVerified || false,
        acceptedTerms: formData.acceptedTerms || false,
        acceptedPlatformAgreement: formData.acceptedPlatformAgreement || false,
      },
      profile: {
        displayName: formData.displayName || '',
        bio: formData.bio || '',
        location: formData.location || '',
        avatarUrl: avatarUrl.value || '',
        voiceTypes: (formData.voiceTypes as string[]) || [],
        languages: (formData.languages as string[]) || [],
      },
      voiceSamples: voiceSamples,
      preferences: preferencesData,
      pricing: pricingData,
      payoutPreferences: {
        frequency: formData.payoutFrequency || 'manual',
        thresholdAmount: formData.thresholdAmount,
        currency: formData.currency || 'USD',
      },
      completedAt: new Date().toISOString(),
    }

    // Use the new onboarding system
    completeTalentOnboarding(onboardingData)

    // Clear form storage
    form.clear()

    success('Welcome to VoiceTalents! Your profile is ready to go.')
    emit('complete')
  } catch {
    error('Failed to complete onboarding. Please try again.')
  }
}

const closeOnboarding = () => {
  emit('close')
}
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
