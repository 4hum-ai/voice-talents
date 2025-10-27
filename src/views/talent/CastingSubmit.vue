<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <VoiceActNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <AppBar :show-back="true" @back="$router.back()">
        <template #title>Submit Proposal</template>
        <template #subtitle>{{ job?.title }}</template>
        <template #actions>
          <ThemeToggle />
        </template>
      </AppBar>

      <div class="px-4 py-8 pt-24 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl">
          <!-- Casting Session Overview -->
          <div v-if="job" class="bg-card border-border mb-8 rounded-lg border p-6 shadow-sm">
            <h2 class="text-foreground mb-4 text-lg font-semibold">Casting Call Details</h2>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 class="text-foreground mb-2 font-medium">Project Information</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Client:</span>
                    <span class="text-foreground">{{ job.clientName }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Type:</span>
                    <span class="text-foreground">{{ formatProjectType(job.projectType) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Deadline:</span>
                    <span class="text-foreground">{{ formatDate(job.deadline) }}</span>
                  </div>
                  <div v-if="job.budget" class="flex justify-between">
                    <span class="text-muted-foreground">Budget Range:</span>
                    <span class="text-foreground">
                      ${{ job.budget.max.toLocaleString() }} {{ job.budget.currency }}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 class="text-foreground mb-2 font-medium">Requirements</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Language:</span>
                    <span class="text-foreground">{{ job.requirements.language }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Voice Type:</span>
                    <span class="text-foreground">{{ job.requirements.voiceType }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="border-border mt-4 border-t pt-4">
              <h3 class="text-foreground mb-2 font-medium">Description</h3>
              <p class="text-muted-foreground text-sm">{{ job.description }}</p>
            </div>
          </div>

          <!-- Proposal Form -->
          <form @submit.prevent="submitProposal" class="space-y-8">
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
                Upload audio samples that showcase your voice for this specific project (optional).
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

            <!-- Personal Note -->
            <div class="bg-card border-border rounded-lg border p-6 shadow-sm">
              <h2 class="text-foreground mb-4 text-lg font-semibold">Personal Note to Studio</h2>
              <p class="text-muted-foreground mb-4 text-sm">
                Add a personal message to the studio explaining why you're perfect for this project.
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

            <!-- Submit Actions -->
            <div class="border-border flex items-center justify-between border-t pt-6">
              <div class="flex items-center space-x-2">
                <Button variant="outline" shortcut="Escape" @click="$router.back()">
                  Cancel
                </Button>
                <span v-if="hasUnsavedChanges" class="text-muted-foreground text-xs">
                  • Unsaved changes
                </span>
              </div>
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
                  type="submit"
                  icon="mdi:send"
                  shortcut="Enter"
                  :disabled="isSubmitting || isSavingDraft || !isFormValid"
                >
                  {{ isSubmitting ? 'Submitting...' : 'Submit Proposal' }}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { JobPosting, JobApplication } from '@/types/voice-client'
import { mockJobPostings } from '@/data/mock-voice-client-data'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import Button from '@/components/atoms/Button.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'
// Icons removed; using Button icon prop instead

const route = useRoute()
const router = useRouter()
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
  jobId: route.params.id as string,
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

// Watch for form changes
watch(
  proposal,
  () => {
    hasUnsavedChanges.value = true
  },
  { deep: true },
)

// Methods
const loadJobData = () => {
  const jobId = route.params.id as string
  const jobData = mockJobPostings.find((j) => j.id === jobId)

  if (jobData) {
    job.value = jobData
    proposal.value.jobId = jobData.id
  } else {
    error('Job not found')
    router.push('/talent/casting')
  }
}

const formatProjectType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
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

    // Redirect back to casting view
    router.push('/talent/casting')
  } catch (err) {
    console.error('Error submitting proposal:', err)
    error('Error submitting proposal. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadJobData()
})
</script>
