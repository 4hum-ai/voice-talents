<template>
  <div v-if="open" class="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-hidden">
    <!-- Top Navigation Bar -->
    <div class="absolute top-0 left-0 right-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
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
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Step {{ currentStep }} of {{ totalSteps }}
          </div>
          <div class="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              :style="{ width: `${(currentStep / totalSteps) * 100}%` }" />
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ Math.round((currentStep / totalSteps) * 100) }}%
          </div>
        </div>

        <!-- Right: Close and Next/Save -->
        <div class="flex items-center space-x-3">
          <!-- Draft Status Indicator -->
          <div v-if="currentDraftId" class="flex items-center text-sm text-muted-foreground">
            <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Draft saved
            <span v-if="lastAutoSave" class="ml-1">
              {{ formatTime(lastAutoSave) }}
            </span>
          </div>
          
          <Button variant="outline" size="sm" @click="saveDraft" :disabled="isSavingDraft">
            <Icon name="mdi:content-save" class="h-4 w-4 mr-2" />
            {{ isSavingDraft ? 'Saving...' : 'Save Draft' }}
          </Button>
          
          <Button variant="ghost" size="sm" @click="closeModal">
            <Icon name="mdi:close" class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="pt-20 h-full overflow-y-auto">
      <div class="max-w-4xl mx-auto px-6 py-8">
        <!-- Step Content -->
        <Transition :name="transitionName" mode="out-in">
          <div :key="currentStep" class="min-h-[600px]">
            <!-- Step 1: Job Type Selection -->
            <JobTypeStep
              v-if="currentStep === 1"
              v-model:job-type="jobForm.jobType"
              @next="nextStep"
            />

            <!-- Step 2: Basic Information -->
            <BasicInfoStep
              v-if="currentStep === 2"
              v-model:title="jobForm.title"
              v-model:description="jobForm.description"
              v-model:project-type="jobForm.projectType"
              v-model:priority="jobForm.priority"
              @next="nextStep"
              @previous="previousStep"
            />

            <!-- Step 3: Requirements -->
            <RequirementsStep
              v-if="currentStep === 3"
              v-model:requirements="jobForm.requirements as any"
              @next="nextStep"
              @previous="previousStep"
            />

            <!-- Step 4: Budget & Timeline -->
            <BudgetTimelineStep
              v-if="currentStep === 4"
              v-model:budget="jobForm.budget as any"
              v-model:deadline="jobForm.deadline"
              v-model:estimated-duration="jobForm.estimatedDuration"
              @next="nextStep"
              @previous="previousStep"
            />

            <!-- Step 5: Review & Publish -->
            <ReviewStep
              v-if="currentStep === 5"
              :job-form="jobForm as any"
              :is-submitting="isSubmitting"
                @publish="publishJobHandler"
              @previous="previousStep"
              @save-draft="saveDraft"
            />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { useJob } from '@/composables/useJob'
import { useToast } from '@/composables/useToast'
import { mockClientData } from '@/data/mock-voice-client-data'
import type { JobPosting } from '@/types/voice-client'
import type { VoiceType } from '@/types/voice-actor'

// Components
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import JobTypeStep from '../molecules/JobCreationSteps/JobTypeStep.vue'
import BasicInfoStep from '../molecules/JobCreationSteps/BasicInfoStep.vue'
import RequirementsStep from '../molecules/JobCreationSteps/RequirementsStep.vue'
import BudgetTimelineStep from '../molecules/JobCreationSteps/BudgetTimelineStep.vue'
import ReviewStep from '../molecules/JobCreationSteps/ReviewStep.vue'

interface Props {
  open: boolean
  draftId?: string
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  draftId: undefined
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
const totalSteps = 5
const transitionName = ref('slide-left')
const isSubmitting = ref(false)
const isSavingDraft = ref(false)
const currentDraftId = ref<string | null>(null)
const lastAutoSave = ref<Date | null>(null)
const autoSaveInterval = ref<number | null>(null)

// Get current client (in real app, this would come from auth)
const currentClient = ref(mockClientData.voiceClients[0])

// Job form data
const jobForm = reactive({
  jobType: 'open_casting' as 'open_casting' | 'invite_only' | 'urgent_fill' | 'targeted_search',
  title: '',
  description: '',
  projectType: 'commercial' as any,
  priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  budget: {
    min: 0,
    max: 0,
    currency: 'USD' as 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'VND'
  },
  deadline: '',
  estimatedDuration: '',
  requirements: {
    language: '',
    accent: '',
    voiceType: '' as VoiceType,
    ageRange: '',
    gender: 'any' as 'male' | 'female' | 'non-binary' | 'any',
    specialInstructions: ''
  },
  isPublic: true,
  requirePortfolio: true,
  requireCustomSample: false
})

// Step validation
const stepValidation = {
  1: () => !!jobForm.jobType,
  2: () => !!jobForm.title.trim() && !!jobForm.description.trim() && !!jobForm.projectType,
  3: () => !!jobForm.requirements.voiceType && !!jobForm.requirements.language,
  4: () => jobForm.budget.max > 0,
  5: () => true // Review step is always valid
}

// Methods
const nextStep = () => {
  if (currentStep.value < totalSteps && stepValidation[currentStep.value as keyof typeof stepValidation]()) {
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
      currentDraftId.value || undefined
    )
    
    currentDraftId.value = draft.id
    lastAutoSave.value = new Date()
    
    showToast({
      type: 'success',
      title: 'Draft Saved',
      message: 'Your job draft has been saved successfully.'
    })
  } catch (error) {
    console.error('Error saving draft:', error)
    showToast({
      type: 'error',
      title: 'Save Failed',
      message: 'Failed to save draft. Please try again.'
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
      currentDraftId.value || undefined
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
    jobForm.jobType = draft.jobType
    jobForm.title = draft.title
    jobForm.description = draft.description
    jobForm.projectType = draft.projectType
    jobForm.priority = draft.priority
    jobForm.budget = { min: 0, max: draft.budget.max, currency: draft.budget.currency }
    jobForm.deadline = draft.deadline
    jobForm.estimatedDuration = draft.estimatedDuration
    jobForm.requirements = {
      language: (draft.requirements as any).language || '',
      accent: (draft.requirements as any).accent || '',
      voiceType: (draft.requirements as any).voiceType || '',
      ageRange: draft.requirements.ageRange || '',
      gender: draft.requirements.gender || 'any',
      specialInstructions: draft.requirements.specialInstructions || ''
    }
    jobForm.isPublic = draft.isPublic
    
    showToast({
      type: 'info',
      title: 'Draft Loaded',
      message: `Loaded draft: ${draft.title}`
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
        currentClient.value.companyName
      )
      currentDraftId.value = draft.id
    }
    
    // Publish the job using the composable
    const publishedJob = publishJob(currentDraftId.value)
    
    if (publishedJob) {
      showToast({
        type: 'success',
        title: 'Job Published!',
        message: `"${jobForm.title}" has been published successfully.`
      })
      
      emit('complete', publishedJob)
      closeModal()
    } else {
      throw new Error('Failed to publish job')
    }
  } catch (error) {
    console.error('Error publishing job:', error)
    showToast({
      type: 'error',
      title: 'Publishing Failed',
      message: 'Failed to publish job. Please try again.'
    })
  } finally {
    isSubmitting.value = false
  }
}

const closeModal = () => {
  stopAutoSave()
  emit('close')
}

const loadClientDefaults = () => {
  const client = currentClient.value
  if (client) {
    // Load default budget
    jobForm.budget.min = client.preferences.defaultBudget.min
    jobForm.budget.max = client.preferences.defaultBudget.max
    jobForm.budget.currency = client.preferences.defaultBudget.currency
    
    // Load default language and voice type (use first preference)
    jobForm.requirements.language = client.preferences.preferredLanguages[0] || ''
    jobForm.requirements.voiceType = client.preferences.preferredVoiceTypes[0] as VoiceType || ''
    
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
watch(jobForm, () => {
  if (autoSaveInterval.value) {
    clearTimeout(autoSaveInterval.value)
    autoSaveInterval.value = setTimeout(autoSaveHandler, 5000)
  }
}, { deep: true })

// Watch for modal open/close
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    startAutoSave()
  } else {
    stopAutoSave()
  }
})
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
