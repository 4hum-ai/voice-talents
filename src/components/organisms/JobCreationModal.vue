<template>
  <div v-if="open" class="bg-background fixed inset-0 z-50 overflow-y-auto pt-16">
    <!-- Top Navigation Bar -->
    <div
      class="border-border bg-card/95 absolute top-0 right-0 left-0 z-10 border-b backdrop-blur-sm"
    >
      <div class="flex items-center justify-between px-6 py-4">
        <!-- Left: Previous Button -->
        <Button v-if="currentStep > 1" variant="outline" size="md" @click="previousStep">
          <div class="flex items-center gap-2">
            <Icon name="mdi:chevron-left" class="h-6 w-6" />
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

        <!-- Right: Close and Next/Save -->
        <div class="flex items-center space-x-3">
          <!-- Draft Status Indicator -->
          <div v-if="currentDraftId" class="text-muted-foreground flex items-center text-sm">
            <div class="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
            Draft saved
            <span v-if="lastAutoSave" class="ml-1">
              {{ formatTime(lastAutoSave) }}
            </span>
          </div>

          <Button variant="outline" size="sm" @click="saveDraft" :disabled="isSavingDraft">
            <Icon name="mdi:content-save" class="mr-2 h-6 w-6" />
            {{ isSavingDraft ? 'Saving...' : 'Save Draft' }}
          </Button>

          <Button variant="ghost" size="sm" @click="closeModal">
            <Icon name="mdi:close" class="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="mx-auto max-w-7xl">
      <div class="mx-auto py-8">
        <!-- Step Content -->
        <Transition :name="transitionName" mode="out-in">
          <div :key="currentStep" class="min-h-[600px]">
            <!-- Step 1: Voice Type Selection -->
            <JobTypeStep
              v-if="currentStep === 1"
              :job-type="jobForm.voiceType"
              @update:job-type="selectVoiceType"
              @next="handleVoiceTypeNext"
            />

            <!-- Step 2: Basic Information & Requirements (All Types) -->
            <BasicInfoRequirementsStep
              v-if="currentStep === 2"
              v-model:title="jobForm.title"
              v-model:description="jobForm.description"
              v-model:project-type="jobForm.projectType"
              v-model:requirements="jobForm.requirements as any"
              v-model:deadline="jobForm.deadline"
              v-model:files="jobForm.files"
              :voice-type="selectedVoiceType"
              @next="nextStep"
              @previous="previousStep"
            />

            <!-- Step 3: Talent Options (All Types) -->
            <TalentOptionsStep
              v-if="currentStep === 3"
              v-model:talent-options="jobForm.talentOptions"
              v-model:ai-settings="jobForm.aiSettings"
              v-model:premium-features="jobForm.premiumFeatures"
              :voice-type="selectedVoiceType"
              @next="nextStep"
              @previous="previousStep"
            />

            <!-- Step 4: Review & Payment (All Types) -->
            <ReviewPaymentStep
              v-if="currentStep === 4"
              :job-form="jobForm as any"
              :voice-type="selectedVoiceType"
              @publish="publishJobHandler"
              @previous="previousStep"
              @save-draft="saveDraft"
              :is-submitting="isSubmitting"
            />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useJob } from '@/composables/useJob'
import { useToast } from '@/composables/useToast'
import { mockClientData } from '@/data/mock-voice-client-data'
import type { JobPosting } from '@/types/voice-client'
import type { VoiceType } from '@/types/voice-actor'

// Components
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
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

// State
const currentStep = ref(1)
// 4 steps total: Voice Type + Basic Info & Requirements + Talent Options + Review
const totalSteps = computed(() => {
  return 4
})
const transitionName = ref('slide-left')
const isSubmitting = ref(false)
const isSavingDraft = ref(false)
const currentDraftId = ref<string | null>(null)
const lastAutoSave = ref<Date | null>(null)
const autoSaveInterval = ref<number | null>(null)

// Get current client (in real app, this would come from auth)
const currentClient = ref(mockClientData.voiceClients[0])

// Voice type selection (outside of steps)
const selectedVoiceType = ref<'talent_only' | 'ai_synthesis' | 'hybrid_approach' | undefined>(undefined)

// Job form data - Dynamic based on voice type
const jobForm = reactive({
  voiceType: 'talent_only' as 'talent_only' | 'ai_synthesis' | 'hybrid_approach',
  title: '',
  description: '',
  projectType: 'commercial' as any,
  priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  budget: {
    max: 0,
    currency: 'USD' as 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'VND',
  },
  deadline: '',
  requirements: {
    language: '',
    voiceType: '' as VoiceType,
    gender: 'any' as 'male' | 'female' | 'non-binary' | 'any',
    specialInstructions: '',
    deliveryFormat: '',
    deliveryTimeline: '',
    revisionRounds: '',
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
    method: 'direct' as 'direct' | 'online',
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

// Methods
const selectVoiceType = (type: 'talent_only' | 'ai_synthesis' | 'hybrid_approach') => {
  selectedVoiceType.value = type
  jobForm.voiceType = type
  // Don't change currentStep - let user navigate manually
}

const handleVoiceTypeNext = () => {
  // This method is called when user clicks "Continue" in JobTypeStep
  // Move to step 2 (Basic Information)
  if (selectedVoiceType.value) {
    currentStep.value = 2
  }
}

const nextStep = () => {
  if (
    currentStep.value < totalSteps.value &&
    stepValidation.value[currentStep.value as keyof typeof stepValidation.value]?.()
  ) {
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

const saveDraft = async () => {
  isSavingDraft.value = true

  try {
    const draft = saveDraftToStorage(
      jobForm as any,
      currentClient.value.id,
      currentClient.value.companyName,
      currentDraftId.value || undefined,
    )

    currentDraftId.value = draft.id
    lastAutoSave.value = new Date()

    showToast({
      type: 'success',
      title: 'Draft Saved',
      message: 'Your job draft has been saved successfully.',
    })
  } catch (error) {
    console.error('Error saving draft:', error)
    showToast({
      type: 'error',
      title: 'Save Failed',
      message: 'Failed to save draft. Please try again.',
    })
  } finally {
    isSavingDraft.value = false
  }
}

const autoSaveHandler = () => {
  if (jobForm.title.trim() || jobForm.description.trim()) {
    const draft = autoSaveDraft(
      jobForm as any,
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
    jobForm.voiceType = (draft.jobType as any) || 'talent_only'
    selectedVoiceType.value = jobForm.voiceType
    jobForm.title = draft.title
    jobForm.description = draft.description
    jobForm.projectType = draft.projectType
    jobForm.priority = draft.priority || 'medium'
    jobForm.budget = { max: draft.budget.max, currency: draft.budget.currency }
    jobForm.deadline = draft.deadline
    jobForm.requirements = {
      language: (draft.requirements as any).language || '',
      voiceType: (draft.requirements as any).voiceType || '',
      gender: draft.requirements.gender || 'any',
      specialInstructions: draft.requirements.specialInstructions || '',
      deliveryFormat: (draft.requirements as any).deliveryFormat || '',
      deliveryTimeline: (draft.requirements as any).deliveryTimeline || '',
      revisionRounds: (draft.requirements as any).revisionRounds || '',
    }
    jobForm.files = (draft as any).files || {
      script: undefined,
      referenceAudio: undefined,
      additional: undefined,
    }
    jobForm.premiumFeatures = (draft as any).premiumFeatures || {
      expressMatching: false,
      talentOutreach: false,
    }
    jobForm.aiSettings = (draft as any).aiSettings || {
      voiceModel: '',
      voiceStyle: '',
      emotion: '',
      speed: 'normal',
      pitch: 'normal',
    }
    jobForm.paymentDetails = (draft as any).paymentDetails || {
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

const publishJobHandler = async () => {
  isSubmitting.value = true

  try {
    // First save as draft if not already saved
    if (!currentDraftId.value) {
      const draft = saveDraftToStorage(
        jobForm as any,
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
  } catch (error) {
    console.error('Error publishing job:', error)
    showToast({
      type: 'error',
      title: 'Publishing Failed',
      message: 'Failed to publish job. Please try again.',
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
    projectType: 'commercial' as any,
    budget: {
      max: 0,
      currency: 'USD' as 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'VND',
    },
    deadline: '',
    requirements: {
      language: '',
      voiceType: '' as VoiceType,
      gender: 'any' as 'male' | 'female' | 'non-binary' | 'any',
      specialInstructions: '',
      deliveryFormat: '',
      revisionRounds: '',
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
      method: 'direct' as 'direct' | 'online',
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
