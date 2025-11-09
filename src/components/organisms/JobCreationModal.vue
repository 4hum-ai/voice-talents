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
        <Step
          :step="2"
          :valid="
            !!jobForm.title.trim() &&
            !!jobForm.projectType &&
            !!jobForm.requirements.language &&
            !!jobForm.deadline
          "
        >
          <BasicInfoRequirementsStep
            v-model:title="jobForm.title"
            v-model:description="jobForm.description"
            v-model:project-type="jobForm.projectType"
            v-model:requirements="jobForm.requirements as any"
            v-model:deadline="jobForm.deadline"
            v-model:files="jobForm.files"
            :voice-type="selectedVoiceType"
          />
        </Step>

        <!-- Step 3: Talent Options (All Types) -->
        <Step :step="3" :valid="true">
          <TalentOptionsStep
            v-model:talent-options="jobForm.talentOptions"
            v-model:ai-settings="jobForm.aiSettings"
            v-model:premium-features="jobForm.premiumFeatures"
            :voice-type="selectedVoiceType"
            :requirements="jobForm.requirements"
          />
        </Step>

        <!-- Step 4: Review & Payment (All Types) -->
        <Step :step="4" :valid="true">
          <ReviewPaymentStep
            :job-form="jobForm as any"
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
import { useRoute, useRouter } from 'vue-router'
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
const route = useRoute()
const router = useRouter()

// State
const currentStep = ref(1)
// 4 steps total: Voice Type + Basic Info & Requirements + Talent Options + Review
const totalSteps = computed(() => {
  return 4
})
const transitionName = ref('slide-left')
const isSubmitting = ref(false)
// isSavingDraft removed - using auto-save only
const currentDraftId = ref<string | null>(null)
const lastAutoSave = ref<Date | null>(null)
const autoSaveInterval = ref<number | null>(null)
const paymentSessionId = ref<string | null>(null)

// Get current client (in real app, this would come from auth)
const currentClient = ref(mockClientData.voiceClients[0])

// Voice type selection (outside of steps)
const selectedVoiceType = ref<'talent_only' | 'ai_synthesis' | 'hybrid_approach' | undefined>(
  undefined,
)

// Job form data - Dynamic based on voice type
const jobForm = reactive({
  voiceType: 'talent_only' as 'talent_only' | 'ai_synthesis' | 'hybrid_approach',
  title: '',
  description: '',
  projectType: 'commercial' as string,
  priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  budget: {
    max: 0,
    currency: 'USD' as 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'VND',
  },
  deadline: '', // Will be auto-set to 7 days in BasicInfoRequirementsStep
  requirements: {
    language: '',
    voiceType: '' as VoiceType,
    gender: 'any' as 'male' | 'female' | 'non-binary' | 'any',
    ageRange: undefined as string | undefined,
    specialInstructions: '',
    deliveryFormat: '',
    deliveryTimeline: '',
    revisionRounds: '1', // Auto-set to 1
  },
  files: {
    script: undefined as File | undefined,
    referenceAudio: undefined as File | undefined,
    additional: undefined as File[] | undefined,
  },
  premiumFeatures: {
    talentOutreach: false,
    aiMatching: false,
    autoPrompts: false,
  },
  // Talent options
  talentOptions: {
    isPublic: true,
    pickOwn: false,
    selectedTalents: [] as string[],
  },
  // AI-specific settings
  aiSettings: {
    voiceModel: '',
    voiceStyle: '',
    emotion: '',
    speed: 'normal' as 'slow' | 'normal' | 'fast',
    pitch: 'normal' as 'low' | 'normal' | 'high',
  },
  paymentDetails: {
    method: 'direct' as 'direct' | 'online' | 'stripe',
  },
  isPublic: true,
  requirePortfolio: true,
})

// Step validation for all 4 steps
const stepValidation = computed(() => {
  return {
    1: () => !!selectedVoiceType.value, // Voice type selection
    2: () =>
      !!jobForm.title.trim() &&
      !!jobForm.projectType &&
      !!jobForm.requirements.language &&
      !!jobForm.deadline, // Basic info & requirements
    3: () => true, // Talent options step is always valid (can be empty)
    4: () => true, // Review step is always valid
  }
})

// Can proceed to next step (for top navigation button)
const canProceedToNext = computed(() => {
  return stepValidation.value[currentStep.value as keyof typeof stepValidation.value]?.() ?? false
})

// Methods
const selectVoiceType = (type: 'talent_only' | 'ai_synthesis' | 'hybrid_approach') => {
  selectedVoiceType.value = type
  jobForm.voiceType = type
  // Don't change currentStep - let user navigate manually
}

const nextStep = () => {
  // Handle step 1: ensure voice type is set
  if (currentStep.value === 1) {
    if (selectedVoiceType.value) {
      jobForm.voiceType = selectedVoiceType.value
      transitionName.value = 'slide-left'
    }
  } else {
    transitionName.value = 'slide-left'
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    transitionName.value = 'slide-right'
  }
}

// Manual save removed - using auto-save only

const autoSaveHandler = () => {
  if (jobForm.title.trim() || jobForm.description.trim()) {
    const draft = autoSaveDraft(
      jobForm as Record<string, unknown>,
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
    jobForm.voiceType = draft.voiceType || 'talent_only'
    selectedVoiceType.value = jobForm.voiceType
    jobForm.title = draft.title
    jobForm.description = draft.description
    jobForm.projectType = draft.projectType
    jobForm.priority = draft.priority || 'medium'
    jobForm.budget = { max: draft.budget.max, currency: draft.budget.currency }
    jobForm.deadline = draft.deadline
    jobForm.requirements = {
      language: ((draft.requirements as Record<string, unknown>).language as string) || '',
      voiceType:
        ((draft.requirements as Record<string, unknown>).voiceType as VoiceType) || 'commercial',
      gender: draft.requirements.gender || 'any',
      ageRange: (draft.requirements as Record<string, unknown>).ageRange as string | undefined,
      specialInstructions: draft.requirements.specialInstructions || '',
      deliveryFormat:
        ((draft.requirements as Record<string, unknown>).deliveryFormat as string) || '',
      deliveryTimeline:
        ((draft.requirements as Record<string, unknown>).deliveryTimeline as string) || '',
      revisionRounds:
        ((draft.requirements as Record<string, unknown>).revisionRounds as string) || '',
    }
    jobForm.files = ((draft as unknown as Record<string, unknown>)
      .files as typeof jobForm.files) || {
      script: undefined,
      referenceAudio: undefined,
      additional: undefined,
    }
    jobForm.premiumFeatures = ((draft as unknown as Record<string, unknown>)
      .premiumFeatures as typeof jobForm.premiumFeatures) || {
      expressMatching: false,
      talentOutreach: false,
    }
    jobForm.aiSettings = ((draft as unknown as Record<string, unknown>)
      .aiSettings as typeof jobForm.aiSettings) || {
      voiceModel: '',
      voiceStyle: '',
      emotion: '',
      speed: 'normal',
      pitch: 'normal',
    }
    jobForm.paymentDetails = ((draft as unknown as Record<string, unknown>)
      .paymentDetails as typeof jobForm.paymentDetails) || {
      method: 'direct',
    }
    jobForm.isPublic = draft.isPublic

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
    const draft = saveDraftToStorage(
      jobForm as Record<string, unknown>,
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
        const draft = saveDraftToStorage(
          jobForm as Record<string, unknown>,
          currentClient.value.id,
          currentClient.value.companyName,
        )
        currentDraftId.value = draft.id
      }

      if (currentDraftId.value) {
        jobForm.paymentDetails = { method: 'stripe' }
        saveDraftToStorage(
          jobForm as Record<string, unknown>,
          currentClient.value.id,
          currentClient.value.companyName,
          currentDraftId.value,
        )

        const publishedJob = publishJob(currentDraftId.value)
        if (publishedJob) {
          // Clean up
          localStorage.removeItem(`payment_session_${currentDraftId.value}`)
          showToast({
            type: 'success',
            title: 'Payment Successful & Job Published!',
            message: `"${jobForm.title}" has been published successfully.`,
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
          const draft = saveDraftToStorage(
            jobForm as Record<string, unknown>,
            currentClient.value.id,
            currentClient.value.companyName,
          )
          currentDraftId.value = draft.id
        }

        // Update payment details
        if (currentDraftId.value) {
          jobForm.paymentDetails = {
            method: 'stripe',
          }
          // Save updated draft with payment info
          saveDraftToStorage(
            jobForm as Record<string, unknown>,
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

          showToast({
            type: 'success',
            title: 'Payment Successful & Job Published!',
            message: `"${jobForm.title}" has been published successfully.`,
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
        const draft = saveDraftToStorage(
          jobForm as Record<string, unknown>,
          currentClient.value.id,
          currentClient.value.companyName,
        )
        currentDraftId.value = draft.id
      }

      // Publish the job using the composable
      const publishedJob = publishJob(currentDraftId.value)

      if (publishedJob) {
        showToast({
          type: 'success',
          title: 'Job Published!',
          message: `"${jobForm.title}" has been published successfully.`,
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
  // Reset form to initial state
  Object.assign(jobForm, {
    voiceType: 'talent_only' as 'talent_only' | 'ai_synthesis' | 'hybrid_approach',
    title: '',
    description: '',
    projectType: 'commercial' as string,
    budget: {
      max: 0,
      currency: 'USD' as 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'VND',
    },
    deadline: '',
    requirements: {
      language: '',
      voiceType: '' as VoiceType,
      gender: 'any' as 'male' | 'female' | 'non-binary' | 'any',
      ageRange: undefined as string | undefined,
      specialInstructions: '',
      deliveryFormat: '',
      revisionRounds: '1',
    },
    files: {
      script: undefined as File | undefined,
      referenceAudio: undefined as File | undefined,
      additional: undefined as File[] | undefined,
    },
    premiumFeatures: {
      talentOutreach: false,
      aiMatching: false,
      autoPrompts: false,
    },
    talentOptions: {
      isPublic: true,
      pickOwn: false,
      selectedTalents: [] as string[],
    },
    aiSettings: {
      voiceModel: '',
      voiceStyle: '',
      emotion: '',
      speed: 'normal' as 'slow' | 'normal' | 'fast',
      pitch: 'normal' as 'low' | 'normal' | 'high',
    },
    paymentDetails: {
      method: 'direct' as 'direct' | 'online' | 'stripe',
    },
    isPublic: true,
    requirePortfolio: true,
  })

  // Reset step and voice type
  currentStep.value = 1
  selectedVoiceType.value = undefined
  currentDraftId.value = null

  // Load client defaults for new job
  loadClientDefaults()
}

const closeModal = () => {
  stopAutoSave()
  emit('close')
}

const loadClientDefaults = () => {
  const client = currentClient.value
  if (client) {
    // Load default budget
    jobForm.budget.max = client.preferences.defaultBudget.max
    jobForm.budget.currency = client.preferences.defaultBudget.currency

    // Load default language and voice type (use first preference)
    jobForm.requirements.language = client.preferences.preferredLanguages[0] || ''
    jobForm.requirements.voiceType = (client.preferences.preferredVoiceTypes[0] as VoiceType) || ''

    // Load default preferences
    jobForm.requirePortfolio = true
    jobForm.isPublic = client.isPublic
  }
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Lifecycle
onMounted(() => {
  loadClientDefaults()
  startAutoSave()

  // Load draft if provided
  if (props.draftId) {
    loadDraftData(props.draftId)

    // Check if returning from payment
    const sessionId = localStorage.getItem(`payment_session_${props.draftId}`)
    if (sessionId && route.query.payment === 'success') {
      // Navigate to review step to show payment success
      currentStep.value = 4
    }
  }

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
watch(
  jobForm,
  () => {
    if (autoSaveInterval.value) {
      clearTimeout(autoSaveInterval.value)
      autoSaveInterval.value = setTimeout(autoSaveHandler, 5000)
    }
  },
  { deep: true },
)
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
      }
      startAutoSave()
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
