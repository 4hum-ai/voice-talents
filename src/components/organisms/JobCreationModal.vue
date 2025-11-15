<template>
  <StepContainer
    v-if="open"
    v-model="currentStep"
    :total-steps="totalSteps"
    :can-proceed="canProceedToNext"
    :complete-button-text="isSubmitting ? 'Processing...' : 'Pay & Publish'"
    :complete-button-disabled="isSubmitting"
    @next="nextStep"
    @previous="previousStep"
    @complete="publishJobHandler"
    @close="closeModal"
  >
    <!-- Auto-save Status Indicator (custom slot for desktop) -->
    <template #header-extra>
      <div
        v-if="currentDraftId && lastAutoSave"
        class="text-muted-foreground hidden items-center text-xs sm:flex"
      >
        <div class="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></div>
        Saved {{ formatTime(lastAutoSave) }}
      </div>
    </template>

    <!-- Step Content with transitions -->
    <Transition :name="transitionName" mode="out-in">
      <div :key="currentStep" class="min-h-[600px]">
        <!-- Step 1: Voice Type Selection -->
        <Step :step="1" :valid="!!selectedVoiceType">
          <JobTypeStep
            :job-type="selectedVoiceType || undefined"
            @update:job-type="selectVoiceType"
          />
        </Step>

        <!-- Step 2: Basic Information & Requirements (All Types) -->
        <Step :step="2" :valid="canProceedToNext">
          <BasicInfoRequirementsStep
            v-model:title="formTitle"
            v-model:description="formDescription"
            v-model:project-type="formProjectType"
            v-model:requirements="formRequirements"
            v-model:deadline="formDeadline"
            v-model:files="formFiles"
            :voice-type="selectedVoiceType"
            :errors="{
              title: form.getFieldError('title'),
              projectType: form.getFieldError('projectType'),
              requirementsLanguage: form.getFieldError('requirementsLanguage'),
              deadline: form.getFieldError('deadline'),
            }"
          />
        </Step>

        <!-- Step 3: Talent Options (All Types) -->
        <Step :step="3" :valid="true">
          <TalentOptionsStep
            v-model:talent-options="formTalentOptions"
            v-model:ai-settings="formAiSettings"
            v-model:premium-features="formPremiumFeatures"
            :voice-type="selectedVoiceType"
            :requirements="formRequirements"
          />
        </Step>

        <!-- Step 4: Review & Payment (All Types) -->
        <Step :step="4" :valid="true">
          <ReviewPaymentStep
            :job-form="getJobFormData() as any"
            :voice-type="selectedVoiceType"
            :is-submitting="isSubmitting"
            @payment-initiated="handlePaymentInitiated"
            @payment-confirmed="handlePaymentConfirmed"
          />
        </Step>
      </div>
    </Transition>
  </StepContainer>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useJob } from '@/composables/useJob'
import { useToast } from '@/composables/useToast'
import { useStripePayment } from '@/composables/useStripePayment'
import { useJobType } from '@/composables/useJobType'
import { useRoute, useRouter } from 'vue-router'
import { useForm, type FormDefinition } from '@/lib/form'
import { mockClientData } from '@/data/mock-voice-client-data'
import type { JobPosting } from '@/types/voice-client'
import type { VoiceType } from '@/types/voice-talent'

// Components
import StepContainer from '@/components/molecules/StepContainer.vue'
import Step from '@/components/molecules/Step.vue'
import JobTypeStep from '../molecules/JobCreationSteps/JobTypeStep.vue'
import BasicInfoRequirementsStep from '../molecules/JobCreationSteps/BasicInfoRequirementsStep.vue'
import TalentOptionsStep from '../molecules/JobCreationSteps/TalentOptionsStep.vue'
import ReviewPaymentStep from '../molecules/JobCreationSteps/ReviewPaymentStep.vue'
import { useScrollLock } from '@vueuse/core'

interface Props {
  open: boolean
  draftId?: string
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  draftId: undefined,
})

const emit = defineEmits<{
  close: []
  complete: [job: JobPosting]
}>()

// Composables
const { saveDraft: saveDraftToStorage, autoSaveDraft, loadDraft, publishJob } = useJob()
const { addToast: showToast } = useToast()
const { verifyPayment } = useStripePayment()
const { getConfig } = useJobType()
const route = useRoute()
const router = useRouter()

// State
const transitionName = ref('slide-left')
const isSubmitting = ref(false)
const currentDraftId = ref<string | null>(null)
const lastAutoSave = ref<Date | null>(null)
const autoSaveInterval = ref<ReturnType<typeof setInterval> | null>(null)
const paymentSessionId = ref<string | null>(null)

// Get current client (in real app, this would come from auth)
const currentClient = ref(mockClientData.voiceClients[0])

// Voice type selection (outside of steps, handled separately)
const selectedVoiceType = ref<'talent_only' | 'ai_synthesis' | 'hybrid_approach' | undefined>(
  undefined,
)

// Helper function to get date 7 days from now
const getDateIn7Days = () => {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date.toISOString().split('T')[0] // Format as YYYY-MM-DD
}

// Create form definition - will be recreated when voice type changes
const createFormDefinition = (): FormDefinition => {
  const { getAllConfigs } = useJobType()

  const projectTypeOptions = getAllConfigs.value.map((config) => ({
    value: config.id,
    label: config.label,
  }))

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'vietnamese', label: 'Vietnamese' },
  ]

  const genderOptions = [
    { value: 'any', label: 'Any' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non-binary', label: 'Non-binary' },
  ]

  const ageRangeOptions = [
    { value: '18-25', label: '18-25' },
    { value: '26-35', label: '26-35' },
    { value: '36-45', label: '36-45' },
    { value: '46-55', label: '46-55' },
    { value: '56+', label: '56+' },
  ]

  const deliveryFormatOptions = [
    { value: 'mp3_44khz', label: 'MP3 44kHz' },
    { value: 'wav_48khz', label: 'WAV 48kHz' },
    { value: 'wav_96khz', label: 'WAV 96kHz' },
  ]

  const revisionRoundsOptions = [
    { value: '1', label: '1 round' },
    { value: '2', label: '2 rounds' },
    { value: '3', label: '3 rounds' },
    { value: 'unlimited', label: 'Unlimited' },
  ]

  return {
    id: 'job-creation',
    persistToStorage: true,
    excludeFromStorage: ['files'], // Files can't be serialized
    initialStep: 1,
    steps: [
      {
        step: 1,
        title: 'Voice Type Selection',
        fields: [], // Voice type handled separately
      },
      {
        step: 2,
        title: 'Basic Information & Requirements',
        fields: [
          {
            name: 'title',
            type: 'text',
            label: 'Job Title',
            placeholder: 'e.g., Commercial Voice-Over for Tech Startup',
            required: true,
            validation: [
              { type: 'required', message: 'Job title is required' },
              { type: 'minLength', value: 5, message: 'Title must be at least 5 characters' },
              {
                type: 'maxLength',
                value: 100,
                message: 'Title must be no more than 100 characters',
              },
            ],
          },
          {
            name: 'description',
            type: 'textarea',
            label: 'Project Description',
            placeholder: 'Describe your project, target audience, and any specific requirements...',
            validation: [
              {
                type: 'maxLength',
                value: 2000,
                message: 'Description must be no more than 2000 characters',
              },
            ],
          },
          {
            name: 'projectType',
            type: 'select',
            label: 'Project Type',
            required: true,
            options: projectTypeOptions,
            validation: [{ type: 'required', message: 'Project type is required' }],
          },
          {
            name: 'requirementsLanguage',
            type: 'select',
            label: 'Language',
            required: true,
            options: languageOptions,
            validation: [{ type: 'required', message: 'Language is required' }],
          },
          {
            name: 'requirementsGender',
            type: 'select',
            label: 'Gender Preference',
            options: genderOptions,
            defaultValue: 'any',
          },
          {
            name: 'requirementsAgeRange',
            type: 'select',
            label: 'Age Range',
            options: ageRangeOptions,
          },
          {
            name: 'requirementsSpecialInstructions',
            type: 'textarea',
            label: 'Special Instructions',
            placeholder: 'Any additional requirements or notes...',
          },
          {
            name: 'requirementsDeliveryFormat',
            type: 'select',
            label: 'Delivery Format',
            options: deliveryFormatOptions,
            defaultValue: 'mp3_44khz',
          },
          {
            name: 'requirementsRevisionRounds',
            type: 'select',
            label: 'Revision Rounds',
            options: revisionRoundsOptions,
            defaultValue: '1',
          },
          {
            name: 'deadline',
            type: 'date',
            label: 'Project Deadline',
            required: true,
            defaultValue: getDateIn7Days(),
            validation: [
              {
                type: 'custom',
                validator: (value) => {
                  if (!value || value === '') {
                    return 'Deadline is required'
                  }
                  const deadline = new Date(value)
                  if (isNaN(deadline.getTime())) {
                    return 'Invalid date format'
                  }
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  if (deadline < today) {
                    return 'Deadline must be in the future'
                  }
                  return true
                },
              },
            ],
          },
        ],
      },
      {
        step: 3,
        title: 'Talent Options',
        fields: [
          {
            name: 'talentOptionsIsPublic',
            type: 'checkbox',
            label: 'Public Listing',
            defaultValue: true,
          },
          {
            name: 'premiumFeaturesTalentOutreach',
            type: 'checkbox',
            label: 'Talent Outreach',
            defaultValue: false,
          },
          {
            name: 'premiumFeaturesAiMatching',
            type: 'checkbox',
            label: 'AI Matching',
            defaultValue: false,
          },
          {
            name: 'premiumFeaturesAutoPrompts',
            type: 'checkbox',
            label: 'Auto Prompts',
            defaultValue: false,
          },
        ],
      },
      {
        step: 4,
        title: 'Review & Payment',
        fields: [], // Review step, no form fields
      },
    ],
  }
}

// Initialize form with definition
const form = useForm({
  definition: createFormDefinition(),
  persistToStorage: true,
  excludeFromStorage: ['files'],
})

// Sync form.currentStep with StepContainer
const currentStep = computed({
  get: () => form.currentStep.value,
  set: (value: number) => form.goToStep(value),
})

const totalSteps = computed(() => form.totalSteps.value)

// Files data (handled separately, not in form)
// Use dynamic keys to support different project types with different file requirements
const files = reactive<Record<string, File | File[] | undefined>>({})

// Computed property to sync files with step component
const formFiles = computed({
  get: () => files,
  set: (value: Record<string, File | File[] | undefined>) => {
    // Update files reactively by assigning new values
    // Clear existing keys that are not in the new value
    Object.keys(files).forEach((key) => {
      if (!(key in value)) {
        delete files[key]
      }
    })
    // Set/update files from new value
    Object.keys(value).forEach((key) => {
      files[key] = value[key]
    })
  },
})

// Helper to convert form data to jobForm structure
const getJobFormData = () => {
  const formData = form.getFormData()
  return {
    voiceType: selectedVoiceType.value || 'talent_only',
    title: formData.title || '',
    description: formData.description || '',
    projectType: formData.projectType || 'commercial',
    priority: 'medium' as const,
    budget: {
      max: 0,
      currency: 'USD' as const,
    },
    deadline: formData.deadline || '',
    requirements: {
      language: formData.requirementsLanguage || '',
      voiceType: '' as VoiceType,
      gender: (formData.requirementsGender as 'male' | 'female' | 'non-binary' | 'any') || 'any',
      ageRange: formData.requirementsAgeRange as string | undefined,
      specialInstructions: formData.requirementsSpecialInstructions || '',
      deliveryFormat: formData.requirementsDeliveryFormat || 'mp3_44khz',
      deliveryTimeline: '',
      revisionRounds: formData.requirementsRevisionRounds || '1',
    },
    files: files,
    premiumFeatures: {
      talentOutreach: formData.premiumFeaturesTalentOutreach || false,
      aiMatching: formData.premiumFeaturesAiMatching || false,
      autoPrompts: formData.premiumFeaturesAutoPrompts || false,
    },
    talentOptions: {
      isPublic: formData.talentOptionsIsPublic !== false,
      pickOwn: false,
      selectedTalents: [] as string[],
    },
    aiSettings: {
      voiceModel: '',
      voiceStyle: '',
      emotion: '',
      speed: 'normal' as const,
      pitch: 'normal' as const,
    },
    paymentDetails: {
      method: 'direct' as 'direct' | 'online' | 'stripe',
    },
    isPublic: true,
    requirePortfolio: true,
  }
}

// Helper function to validate required files (computed for reactivity)
const validateRequiredFiles = computed(() => {
  const projectType = form.getField('projectType')
  if (!projectType) return true

  const projectConfig = getConfig(projectType as string)
  if (!projectConfig || !projectConfig.files.required.length) return true

  // Access files to ensure reactivity - iterate through all files for reactivity
  Object.keys(files).forEach(() => {
    // Accessing files keys ensures reactivity tracking
  })

  return projectConfig.files.required.every((fileReq) => {
    const file = files[fileReq.id]
    return file !== undefined && file !== null
  })
})

// Can proceed to next step
const canProceedToNext = computed(() => {
  switch (currentStep.value) {
    case 1:
      return !!selectedVoiceType.value
    case 2: {
      // Access form data to ensure reactivity - access all step 2 fields directly
      const title = form.getField('title')
      const projectType = form.getField('projectType')
      const requirementsLanguage = form.getField('requirementsLanguage')
      const deadline = form.getField('deadline')

      // Access files to track file changes - iterate through all files for reactivity
      Object.keys(files).forEach(() => {
        // Accessing files keys ensures reactivity tracking
      })

      // Manually validate step 2 to ensure validation runs
      const stepValid = form.validateStep(2)
      const hasRequiredFiles = validateRequiredFiles.value

      // Debug logging (remove in production)
      if (import.meta.env.DEV) {
        console.log('Step 2 validation:', {
          title: !!title && (title as string).trim().length > 0,
          projectType: !!projectType,
          requirementsLanguage: !!requirementsLanguage,
          deadline: !!deadline,
          stepValid,
          hasRequiredFiles,
          files: Object.keys(files),
          requiredFiles: projectType
            ? getConfig(projectType as string)?.files.required.map((f) => f.id)
            : [],
        })
      }

      return stepValid && hasRequiredFiles
    }
    case 3:
    case 4:
      return true
    default:
      return false
  }
})

// Computed properties to sync form data with step components
const formTitle = computed({
  get: () => form.getField('title') || '',
  set: (value: string) => {
    form.setField('title', value)
    form.markFieldAsTouched('title')
  },
})

const formDescription = computed({
  get: () => form.getField('description') || '',
  set: (value: string) => {
    form.setField('description', value)
    form.markFieldAsTouched('description')
  },
})

const formProjectType = computed({
  get: () => form.getField('projectType') || '',
  set: (value: string) => {
    form.setField('projectType', value)
    form.markFieldAsTouched('projectType')
  },
})

const formDeadline = computed({
  get: () => form.getField('deadline') || '',
  set: (value: string) => {
    form.setField('deadline', value)
    form.markFieldAsTouched('deadline')
  },
})

const formRequirements = computed({
  get: () => ({
    language: form.getField('requirementsLanguage') || '',
    voiceType: '' as VoiceType,
    gender:
      (form.getField('requirementsGender') as 'male' | 'female' | 'non-binary' | 'any') || 'any',
    ageRange: form.getField('requirementsAgeRange') as string | undefined,
    specialInstructions: form.getField('requirementsSpecialInstructions') || '',
    deliveryFormat: form.getField('requirementsDeliveryFormat') || 'mp3_44khz',
    deliveryTimeline: '',
    revisionRounds: form.getField('requirementsRevisionRounds') || '1',
  }),
  set: (value: {
    language?: string
    gender?: 'male' | 'female' | 'non-binary' | 'any'
    ageRange?: string
    specialInstructions?: string
    deliveryFormat?: string
    revisionRounds?: string
  }) => {
    if (value.language !== undefined) {
      form.setField('requirementsLanguage', value.language)
      form.markFieldAsTouched('requirementsLanguage')
    }
    if (value.gender !== undefined) form.setField('requirementsGender', value.gender)
    if (value.ageRange !== undefined) form.setField('requirementsAgeRange', value.ageRange)
    if (value.specialInstructions !== undefined)
      form.setField('requirementsSpecialInstructions', value.specialInstructions)
    if (value.deliveryFormat !== undefined)
      form.setField('requirementsDeliveryFormat', value.deliveryFormat)
    if (value.revisionRounds !== undefined)
      form.setField('requirementsRevisionRounds', value.revisionRounds)
  },
})

const formTalentOptions = computed({
  get: () => ({
    isPublic: form.getField('talentOptionsIsPublic') !== false,
    pickOwn: false,
    selectedTalents: [] as string[],
  }),
  set: (value: { isPublic?: boolean }) => {
    if (value.isPublic !== undefined) form.setField('talentOptionsIsPublic', value.isPublic)
  },
})

const formPremiumFeatures = computed({
  get: () => ({
    talentOutreach: form.getField('premiumFeaturesTalentOutreach') || false,
    aiMatching: form.getField('premiumFeaturesAiMatching') || false,
    autoPrompts: form.getField('premiumFeaturesAutoPrompts') || false,
  }),
  set: (value: { talentOutreach?: boolean; aiMatching?: boolean; autoPrompts?: boolean }) => {
    if (value.talentOutreach !== undefined)
      form.setField('premiumFeaturesTalentOutreach', value.talentOutreach)
    if (value.aiMatching !== undefined) form.setField('premiumFeaturesAiMatching', value.aiMatching)
    if (value.autoPrompts !== undefined)
      form.setField('premiumFeaturesAutoPrompts', value.autoPrompts)
  },
})

const formAiSettings = computed({
  get: () => ({
    voiceModel: '',
    voiceStyle: '',
    emotion: '',
    speed: 'normal' as const,
    pitch: 'normal' as const,
  }),
  set: () => {
    // AI settings not in form yet
  },
})

// Methods
const selectVoiceType = (type: 'talent_only' | 'ai_synthesis' | 'hybrid_approach') => {
  selectedVoiceType.value = type
  // Don't change currentStep - let user navigate manually
}

const nextStep = () => {
  // Handle step 1: ensure voice type is set
  if (currentStep.value === 1) {
    if (selectedVoiceType.value) {
      transitionName.value = 'slide-left'
      form.nextStep()
    }
  } else if (currentStep.value === 2) {
    // For step 2, validate before proceeding
    if (canProceedToNext.value) {
      transitionName.value = 'slide-left'
      form.nextStep()
    } else {
      // Mark all required fields as touched to show errors
      form.markFieldAsTouched('title')
      form.markFieldAsTouched('projectType')
      form.markFieldAsTouched('requirementsLanguage')
      form.markFieldAsTouched('deadline')
    }
  } else {
    transitionName.value = 'slide-left'
    form.nextStep()
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    transitionName.value = 'slide-right'
    form.previousStep()
  }
}

const autoSaveHandler = () => {
  // Form already persists to storage, but we also save draft
  const formData = form.getFormData()

  if ((formData.title as string)?.trim() || (formData.description as string)?.trim()) {
    const jobFormData = getJobFormData()
    const draft = autoSaveDraft(
      jobFormData as Record<string, unknown>,
      currentClient.value.id,
      currentClient.value.companyName,
      currentDraftId.value || undefined,
    )

    if (draft) {
      currentDraftId.value = draft.id
      lastAutoSave.value = new Date()
    }
  }
}

const startAutoSave = () => {
  // Auto-save every 30 seconds
  autoSaveInterval.value = setInterval(autoSaveHandler, 30000)
}

const stopAutoSave = () => {
  if (autoSaveInterval.value) {
    clearInterval(autoSaveInterval.value)
    autoSaveInterval.value = null
  }
}

const loadDraftData = (draftId: string) => {
  const draft = loadDraft(draftId)
  if (draft) {
    currentDraftId.value = draft.id

    // Populate form with draft data
    selectedVoiceType.value = draft.voiceType || 'talent_only'
    form.setField('title', draft.title || '')
    form.setField('description', draft.description || '')
    form.setField('projectType', draft.projectType || 'commercial')
    form.setField('deadline', draft.deadline || '')
    form.setField(
      'requirementsLanguage',
      ((draft.requirements as Record<string, unknown>).language as string) || '',
    )
    form.setField('requirementsGender', draft.requirements.gender || 'any')
    form.setField(
      'requirementsAgeRange',
      (draft.requirements as Record<string, unknown>).ageRange as string,
    )
    form.setField('requirementsSpecialInstructions', draft.requirements.specialInstructions || '')
    form.setField(
      'requirementsDeliveryFormat',
      ((draft.requirements as Record<string, unknown>).deliveryFormat as string) || 'mp3_44khz',
    )
    form.setField(
      'requirementsRevisionRounds',
      ((draft.requirements as Record<string, unknown>).revisionRounds as string) || '1',
    )

    const premiumFeatures =
      ((draft as unknown as Record<string, unknown>).premiumFeatures as Record<string, boolean>) ||
      {}
    form.setField('premiumFeaturesTalentOutreach', premiumFeatures.talentOutreach || false)
    form.setField('premiumFeaturesAiMatching', premiumFeatures.aiMatching || false)
    form.setField('premiumFeaturesAutoPrompts', premiumFeatures.autoPrompts || false)

    const talentOptions =
      ((draft as unknown as Record<string, unknown>).talentOptions as Record<string, unknown>) || {}
    form.setField('talentOptionsIsPublic', talentOptions.isPublic !== false)

    // Load files (can't be in form)
    const draftFiles =
      ((draft as unknown as Record<string, unknown>).files as Record<
        string,
        File | File[] | undefined
      >) || {}
    Object.keys(draftFiles).forEach((key) => {
      files[key] = draftFiles[key]
    })

    showToast({
      type: 'info',
      title: 'Draft Loaded',
      message: `Loaded draft: ${draft.title}`,
    })
  }
}

// Handle payment initiated - save draft and store session ID
const handlePaymentInitiated = async (sessionId: string) => {
  paymentSessionId.value = sessionId

  // Save job as draft before payment
  if (!currentDraftId.value) {
    const jobFormData = getJobFormData()
    const draft = saveDraftToStorage(
      jobFormData as Record<string, unknown>,
      currentClient.value.id,
      currentClient.value.companyName,
    )
    currentDraftId.value = draft.id
  }

  // Store session ID in localStorage for verification
  if (currentDraftId.value) {
    localStorage.setItem(`payment_session_${currentDraftId.value}`, sessionId)
  }
}

// Handle payment confirmed (for embedded checkout)
const handlePaymentConfirmed = async () => {
  if (!paymentSessionId.value) {
    showToast({
      type: 'error',
      title: 'Payment Error',
      message: 'Payment session not found. Please try again.',
    })
    return
  }

  // Verify payment and publish job
  isSubmitting.value = true
  try {
    const paymentResult = await verifyPayment(paymentSessionId.value)

    if (paymentResult.status === 'paid') {
      // Payment verified, proceed with publishing
      if (!currentDraftId.value) {
        const jobFormData = getJobFormData()
        const draft = saveDraftToStorage(
          jobFormData as Record<string, unknown>,
          currentClient.value.id,
          currentClient.value.companyName,
        )
        currentDraftId.value = draft.id
      }

      if (currentDraftId.value) {
        const jobFormData = getJobFormData()
        jobFormData.paymentDetails = { method: 'stripe' }
        saveDraftToStorage(
          jobFormData as Record<string, unknown>,
          currentClient.value.id,
          currentClient.value.companyName,
          currentDraftId.value,
        )

        const publishedJob = publishJob(currentDraftId.value)
        if (publishedJob) {
          // Clean up
          localStorage.removeItem(`payment_session_${currentDraftId.value}`)
          // Clear form storage on successful publish
          form.clear()
          showToast({
            type: 'success',
            title: 'Payment Successful & Job Published!',
            message: `"${form.getField('title')}" has been published successfully.`,
          })
          emit('complete', publishedJob)
          resetForm()
          closeModal()
        } else {
          throw new Error('Failed to publish job')
        }
      }
    } else {
      throw new Error('Payment not verified. Please contact support.')
    }
  } catch (error) {
    console.error('Error processing payment:', error)
    showToast({
      type: 'error',
      title: 'Payment Processing Failed',
      message:
        error instanceof Error ? error.message : 'Failed to process payment. Please try again.',
    })
  } finally {
    isSubmitting.value = false
  }
}

const publishJobHandler = async () => {
  isSubmitting.value = true

  try {
    // Check if we're returning from Stripe payment
    const paymentStatus = route.query.payment as string | undefined
    const sessionId = route.query.session_id as string | undefined

    if (paymentStatus === 'success' && sessionId) {
      // Verify payment before publishing
      const paymentResult = await verifyPayment(sessionId)

      if (paymentResult.status === 'paid') {
        // Payment verified, proceed with publishing
        // First save as draft if not already saved
        if (!currentDraftId.value) {
          const jobFormData = getJobFormData()
          const draft = saveDraftToStorage(
            jobFormData as Record<string, unknown>,
            currentClient.value.id,
            currentClient.value.companyName,
          )
          currentDraftId.value = draft.id
        }

        // Update payment details and save draft
        if (currentDraftId.value) {
          const jobFormData = getJobFormData()
          jobFormData.paymentDetails = {
            method: 'stripe',
          }
          // Save updated draft with payment info
          saveDraftToStorage(
            jobFormData as Record<string, unknown>,
            currentClient.value.id,
            currentClient.value.companyName,
            currentDraftId.value,
          )
        }

        // Publish the job using the composable
        const publishedJob = publishJob(currentDraftId.value)

        if (publishedJob) {
          // Clean up payment session from localStorage
          if (currentDraftId.value) {
            localStorage.removeItem(`payment_session_${currentDraftId.value}`)
          }

          // Clear form storage on successful publish
          form.clear()

          showToast({
            type: 'success',
            title: 'Payment Successful & Job Published!',
            message: `"${form.getField('title')}" has been published successfully.`,
          })

          emit('complete', publishedJob)
          resetForm() // Reset form for next job creation
          closeModal()

          // Clean up URL params
          router.replace({ query: {} })
        } else {
          throw new Error('Failed to publish job')
        }
      } else {
        throw new Error('Payment not verified. Please contact support.')
      }
    } else {
      // No payment flow - direct publish (for backward compatibility or testing)
      // First save as draft if not already saved
      if (!currentDraftId.value) {
        const jobFormData = getJobFormData()
        const draft = saveDraftToStorage(
          jobFormData as Record<string, unknown>,
          currentClient.value.id,
          currentClient.value.companyName,
        )
        currentDraftId.value = draft.id
      }

      // Publish the job using the composable
      const publishedJob = publishJob(currentDraftId.value)

      if (publishedJob) {
        // Clear current session on successful publish
        // Form storage is cleared by form.clear() in resetForm()

        showToast({
          type: 'success',
          title: 'Job Published!',
          message: `"${form.getField('title')}" has been published successfully.`,
        })

        emit('complete', publishedJob)
        resetForm() // Reset form for next job creation
        closeModal()
      } else {
        throw new Error('Failed to publish job')
      }
    }
  } catch (error) {
    console.error('Error publishing job:', error)
    showToast({
      type: 'error',
      title: 'Publishing Failed',
      message: error instanceof Error ? error.message : 'Failed to publish job. Please try again.',
    })
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  // Clear form
  form.clear()

  // Reset files - clear all dynamic file keys
  Object.keys(files).forEach((key) => {
    delete files[key]
  })

  // Reset step and voice type
  form.goToStep(1)
  selectedVoiceType.value = undefined
  currentDraftId.value = null

  // Set default deadline after clearing
  const defaultDeadline = getDateIn7Days()
  form.setField('deadline', defaultDeadline)

  // Load client defaults for new job
  loadClientDefaults()
}

const closeModal = () => {
  // Form already handles persistence, just stop auto-save
  stopAutoSave()
  emit('close')
}

const loadClientDefaults = () => {
  const client = currentClient.value
  if (client) {
    // Load default language (use first preference)
    form.setField('requirementsLanguage', client.preferences.preferredLanguages[0] || '')
  }
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Lifecycle
onMounted(() => {
  // Load draft if provided
  if (props.draftId) {
    loadDraftData(props.draftId)

    // Check if returning from payment
    const sessionId = localStorage.getItem(`payment_session_${props.draftId}`)
    if (sessionId && route.query.payment === 'success') {
      // Navigate to review step to show payment success
      currentStep.value = 4
    }
  } else {
    // Form already loads from storage, just load client defaults if needed
    const formData = form.getFormData()
    if (!formData.title && !formData.description) {
      loadClientDefaults()
    }
  }

  startAutoSave()

  // Check URL params for payment status
  if (route.query.payment === 'success' && route.query.session_id) {
    // Auto-trigger publish if we have a draft
    if (currentDraftId.value) {
      // Small delay to ensure component is fully mounted
      setTimeout(() => {
        publishJobHandler()
      }, 500)
    }
  }
})

onUnmounted(() => {
  stopAutoSave()
})

// Watch for form changes to trigger auto-save
// Watch specific fields instead of entire formData to avoid reactivity issues
watch(
  () => [
    form.getField('title'),
    form.getField('description'),
    form.getField('projectType'),
    form.getField('deadline'),
  ],
  () => {
    // Form already persists to storage, just trigger auto-save if needed
    if (autoSaveInterval.value) {
      clearTimeout(autoSaveInterval.value)
      autoSaveInterval.value = setTimeout(autoSaveHandler, 5000)
    }
  },
)

// Form already handles persistence automatically, no need to watch step changes
const scrollLock = useScrollLock(document.documentElement) // or document.body

// Watch for modal open/close
watch(
  () => props.open,
  (isOpen) => {
    scrollLock.value = isOpen
    if (isOpen) {
      // If opening for a new job (no draftId), reset the form
      if (!props.draftId) {
        resetForm()
      } else {
        // Ensure deadline is set even when loading from draft
        const currentDeadline = form.getField('deadline')
        if (!currentDeadline) {
          const defaultDeadline = getDateIn7Days()
          form.setField('deadline', defaultDeadline)
        }
      }
      startAutoSave()

      // Ensure modal parameter is in URL when modal opens
      if (route.query.modal !== 'createJob') {
        router.replace({
          query: { ...route.query, modal: 'createJob' },
        })
      }
    } else {
      stopAutoSave()
    }
  },
)
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
