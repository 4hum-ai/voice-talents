<template>
  <Teleport to="body">
    <Transition name="sidebar">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex justify-end"
        role="dialog"
        aria-modal="true"
        aria-label="Submit Proposal"
        @click.self="handleClose"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/40" @click="handleClose" />

        <!-- Sidebar -->
        <div
          class="border-border bg-card relative flex h-full w-full max-w-2xl flex-col border-l shadow-xl"
        >
          <!-- Header -->
          <div
            class="border-border flex flex-shrink-0 items-center justify-between border-b px-6 py-4"
          >
            <h2 class="text-foreground text-lg font-semibold">Submit Proposal</h2>
            <Button
              variant="ghost"
              size="sm"
              icon="mdi:close"
              aria-label="Close (Esc)"
              @click="handleClose"
            >
              Close
            </Button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto px-6 py-6">
            <!-- Proposal Form -->
            <form @submit.prevent="submitProposal" class="space-y-6">
              <!-- Cost Proposal -->
              <div class="bg-card border-border rounded-lg border p-6 shadow-sm">
                <h2 class="text-foreground mb-4 text-lg font-semibold">Cost & Timeline Proposal</h2>
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label class="text-foreground mb-2 block text-sm font-medium">
                      Proposed Cost (USD)
                    </label>
                    <input
                      v-model="proposal.proposedRate"
                      type="number"
                      min="0"
                      step="100"
                      :class="[
                        'w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none',
                        formErrors.proposedRate
                          ? 'border-red-500 bg-red-50 focus:ring-red-500'
                          : 'border-border bg-background text-foreground focus:ring-primary',
                      ]"
                      placeholder="Enter your proposed cost"
                      required
                    />
                    <p v-if="formErrors.proposedRate" class="mt-1 text-xs text-red-500">
                      {{ formErrors.proposedRate }}
                    </p>
                  </div>
                  <div>
                    <label class="text-foreground mb-2 block text-sm font-medium">
                      Proposed Timeline
                    </label>
                    <input
                      v-model="proposal.proposedTimeline"
                      type="text"
                      :class="[
                        'w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none',
                        formErrors.proposedTimeline
                          ? 'border-red-500 bg-red-50 focus:ring-red-500'
                          : 'border-border bg-background text-foreground focus:ring-primary',
                      ]"
                      placeholder="e.g., 2-3 weeks, 1 month"
                      required
                    />
                    <p v-if="formErrors.proposedTimeline" class="mt-1 text-xs text-red-500">
                      {{ formErrors.proposedTimeline }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Showcases -->
              <div class="bg-card border-border rounded-lg border p-6 shadow-sm">
                <h2 class="text-foreground mb-4 text-lg font-semibold">Showcases</h2>
                <p class="text-muted-foreground mb-4 text-sm">
                  Upload audio samples that showcase your voice for this specific project
                  (optional).
                </p>
                <div class="space-y-4">
                  <div
                    v-for="(customSample, index) in proposal.customSamples"
                    :key="index"
                    class="border-border rounded-lg border p-4"
                  >
                    <div class="mb-3 flex items-center justify-between">
                      <h4 class="text-foreground text-sm font-medium">
                        Custom Sample {{ index + 1 }}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="mdi:trash"
                        @click="removeCustomSample(index)"
                      />
                    </div>
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label class="text-foreground mb-2 block text-sm font-medium">Title</label>
                        <input
                          v-model="customSample.title"
                          type="text"
                          class="border-border bg-background text-foreground focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                          placeholder="Sample title"
                        />
                      </div>
                      <div>
                        <label class="text-foreground mb-2 block text-sm font-medium"
                          >Description</label
                        >
                        <input
                          v-model="customSample.description"
                          type="text"
                          class="border-border bg-background text-foreground focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                          placeholder="Sample description"
                        />
                      </div>
                    </div>
                    <div class="mt-4">
                      <input
                        type="file"
                        accept="audio/*"
                        @change="handleCustomSampleUpload($event, index)"
                        class="border-border bg-background text-foreground focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                      />
                    </div>
                  </div>
                  <Button variant="outline" icon="mdi:plus" @click="addCustomSample"
                    >Add Custom Sample</Button
                  >
                </div>
              </div>

              <!-- Agreement Template Reference -->
              <div class="bg-card border-border rounded-lg border p-6 shadow-sm">
                <h2 class="text-foreground mb-4 text-lg font-semibold">Agreement Reference</h2>
                <div
                  class="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20"
                >
                  <div class="flex items-start gap-3">
                    <Icon
                      name="mdi:information"
                      class="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400"
                    />
                    <div class="flex-1">
                      <p class="mb-2 text-sm font-medium text-blue-800 dark:text-blue-200">
                        Review Agreement Template:
                      </p>
                      <RouterLink
                        :to="getAgreementTemplateUrl"
                        target="_blank"
                        class="text-primary hover:text-primary/80 inline-flex items-center gap-2 text-sm underline"
                      >
                        <Icon name="mdi:open-in-new" class="h-4 w-4" />
                        View Agreement Template
                      </RouterLink>
                      <p class="mt-2 text-xs text-blue-700 dark:text-blue-300">
                        When your proposal is approved, a digital agreement will be automatically
                        created based on this template.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Personal Note -->
              <div class="bg-card border-border rounded-lg border p-6 shadow-sm">
                <h2 class="text-foreground mb-4 text-lg font-semibold">Personal Note to Studio</h2>
                <p class="text-muted-foreground mb-4 text-sm">
                  Add a personal message to the studio explaining why you're perfect for this
                  project.
                </p>
                <textarea
                  v-model="proposal.personalNote"
                  rows="6"
                  :class="[
                    'w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none',
                    formErrors.personalNote
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-border bg-background text-foreground focus:ring-primary',
                  ]"
                  placeholder="Tell the studio why you're the perfect fit for this project..."
                ></textarea>
                <p v-if="formErrors.personalNote" class="mt-1 text-xs text-red-500">
                  {{ formErrors.personalNote }}
                </p>
              </div>
            </form>
          </div>

          <!-- Footer -->
          <div
            class="border-border bg-card flex flex-shrink-0 items-center justify-between border-t px-6 py-4"
          >
            <Button variant="outline" shortcut="Escape" @click="handleClose"> Cancel </Button>
            <div class="flex space-x-3">
              <Button
                variant="outline"
                shortcut="Ctrl+S"
                @click="saveDraft"
                :disabled="isSubmitting || isSavingDraft"
              >
                {{ isSavingDraft ? 'Saving...' : 'Save Draft' }}
              </Button>
              <Button
                variant="primary"
                icon="mdi:send"
                shortcut="Enter"
                :disabled="isSubmitting || isSavingDraft || !isFormValid"
                @click="submitProposal"
              >
                {{ isSubmitting ? 'Submitting...' : 'Submit Proposal' }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import type { JobPosting, JobApplication } from '@/types/voice-client'
import { mockJobPostings } from '@/data/mock-voice-client-data'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'

interface Props {
  isOpen: boolean
  jobId: string
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const authStore = useAuthStore()
const { success, error, warning } = useToast()

// Current user ID - in real app, this would come from auth store
const currentUserId = authStore.user?.id || 'va-001'

// State
const job = ref<JobPosting | null>(null)
const isSubmitting = ref(false)
const isSavingDraft = ref(false)
const formErrors = ref<Record<string, string>>({})
const hasUnsavedChanges = ref(false)

// Proposal form data
const proposal = ref<Partial<JobApplication>>({
  jobId: props.jobId,
  voiceTalentId: currentUserId,
  voiceTalentName: authStore.user?.displayName || authStore.user?.email || 'Voice Talent',
  status: 'submitted',
  appliedDate: new Date().toISOString(),
  proposedRate: 0,
  proposedCurrency: 'USD',
  proposedTimeline: '',
  estimatedHours: 0,
  portfolioSampleIds: [],
  customSamples: [],
  personalNote: '',
})

// Form validation
const isFormValid = computed(() => {
  const errors: Record<string, string> = {}

  if (!proposal.value.proposedRate || proposal.value.proposedRate <= 0) {
    errors.proposedRate = 'Please enter a valid proposed rate'
  }

  if (!proposal.value.proposedTimeline?.trim()) {
    errors.proposedTimeline = 'Please enter a proposed timeline'
  }

  if (!proposal.value.personalNote?.trim()) {
    errors.personalNote = 'Please add a personal note to the client'
  }

  return Object.keys(errors).length === 0
})

// Watch for form validation changes and update formErrors
watch(isFormValid, () => {
  // Update formErrors when validation state changes
  const errors: Record<string, string> = {}

  if (!proposal.value.proposedRate || proposal.value.proposedRate <= 0) {
    errors.proposedRate = 'Please enter a valid proposed rate'
  }

  if (!proposal.value.proposedTimeline?.trim()) {
    errors.proposedTimeline = 'Please enter a proposed timeline'
  }

  if (!proposal.value.personalNote?.trim()) {
    errors.personalNote = 'Please add a personal note to the client'
  }

  formErrors.value = errors
})

// Determine agreement template URL based on job type
const getAgreementTemplateUrl = computed(() => {
  if (!job.value) return '/content/agreement-template-service'

  // In real app, check job.voiceType
  // ai_synthesis = royalty, talent_only/hybrid = service
  if (job.value.voiceType === 'ai_synthesis') {
    return '/content/agreement-template-royalty'
  }
  return '/content/agreement-template-service'
})

// Watch for form changes
watch(
  proposal,
  () => {
    hasUnsavedChanges.value = true
  },
  { deep: true },
)

// Methods
const handleClose = () => {
  emit('close')
}

const loadJobData = () => {
  const jobData = mockJobPostings.find((j) => j.id === props.jobId)

  if (jobData) {
    job.value = jobData
    proposal.value.jobId = jobData.id
  } else {
    error('Job not found')
    handleClose()
  }
}

const addCustomSample = () => {
  proposal.value.customSamples?.push({
    id: `custom-${Date.now()}`,
    title: '',
    description: '',
    audioUrl: '',
    duration: 0,
    format: 'mp3',
    fileSize: 0,
  })
}

const removeCustomSample = (index: number) => {
  proposal.value.customSamples?.splice(index, 1)
}

const handleCustomSampleUpload = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file && proposal.value.customSamples) {
    // In real app, upload file and get URL
    proposal.value.customSamples[index].audioUrl = URL.createObjectURL(file)
    proposal.value.customSamples[index].fileSize = file.size
    proposal.value.customSamples[index].format = file.type.split('/')[1] as
      | 'mp3'
      | 'wav'
      | 'aac'
      | 'flac'
  }
}

const saveDraft = async () => {
  isSavingDraft.value = true

  try {
    // In real app, save draft to backend
    console.log('Saving draft:', proposal.value)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    hasUnsavedChanges.value = false
    success('Draft saved successfully!')
  } catch {
    error('Failed to save draft. Please try again.')
  } finally {
    isSavingDraft.value = false
  }
}

const submitProposal = async () => {
  if (!isFormValid.value) {
    warning('Please fix the form errors before submitting')
    return
  }

  isSubmitting.value = true

  try {
    // In real app, submit proposal to backend
    console.log('Submitting proposal:', proposal.value)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    hasUnsavedChanges.value = false
    success('Proposal submitted successfully!')

    // Close modal and refresh parent view
    handleClose()
  } catch (err) {
    console.error('Error submitting proposal:', err)
    error('Error submitting proposal. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

// Watch for jobId changes
watch(
  () => props.jobId,
  (newJobId) => {
    if (newJobId && props.isOpen) {
      proposal.value.jobId = newJobId
      loadJobData()
    }
  },
)

// Watch for modal open/close
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.jobId) {
      loadJobData()
    }
  },
)

onMounted(() => {
  if (props.isOpen && props.jobId) {
    loadJobData()
  }
})
</script>

<style scoped>
.sidebar-enter-active,
.sidebar-leave-active {
  transition: opacity 0.3s ease;
}

.sidebar-enter-active > div:last-child,
.sidebar-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

.sidebar-enter-from,
.sidebar-leave-to {
  opacity: 0;
}

.sidebar-enter-from > div:last-child {
  transform: translateX(100%);
}

.sidebar-leave-to > div:last-child {
  transform: translateX(100%);
}
</style>
