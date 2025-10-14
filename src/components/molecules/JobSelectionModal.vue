<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 bg-black/60"
    role="dialog"
    aria-modal="true"
    aria-label="Invite Talent to Job"
  >
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="border-border bg-card w-full max-w-4xl rounded-lg border shadow-xl">
        <!-- Header -->
        <div class="border-border flex items-center justify-between border-b px-6 py-4">
          <h2 class="text-foreground text-lg font-semibold">
            Invite {{ talent?.displayName || 'Talent' }} to Job
          </h2>
          <button
            class="border-border text-muted-foreground hover:bg-muted flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm"
            aria-label="Close"
            @click="$emit('close')"
          >
            <CloseIcon class="h-4 w-4" aria-hidden="true" />
            Close
          </button>
        </div>

        <!-- Content -->
        <div class="max-h-[70vh] overflow-y-auto p-6">
          <div class="space-y-6">
            <!-- Talent Info -->
            <div v-if="talent" class="bg-muted flex items-center space-x-4 rounded-lg p-4">
              <Avatar
                :src="talent.avatarUrl"
                :alt="talent.displayName"
                :seed="talent.displayName"
                size="md"
              />
              <div>
                <h3 class="text-foreground font-semibold">{{ talent.displayName }}</h3>
                <p class="text-muted-foreground text-sm">
                  {{ talent.experience }} • {{ talent.location }}
                </p>
                <div class="mt-1 flex items-center space-x-2">
                  <StatusBadge
                    :status="talent.availability === 'available' ? 'active' : 'inactive'"
                    size="sm"
                  >
                    {{ talent.availability }}
                  </StatusBadge>
                  <StatusBadge v-if="talent.isVerified" status="success" size="sm">
                    Verified
                  </StatusBadge>
                </div>
              </div>
            </div>

            <!-- Jobs List -->
            <div>
              <h4 class="text-foreground mb-4 text-lg font-medium">Select a Job to Invite To</h4>

              <div v-if="pendingJobs.length === 0" class="py-8 text-center">
                <FolderOpenIcon class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 class="text-foreground mb-2 text-lg font-medium">No pending jobs found</h3>
                <p class="text-muted-foreground mb-4">
                  You need to create a job posting before you can invite talents.
                </p>
                <Button variant="primary" @click="createNewJob">
                  <PlusIcon class="mr-2 h-4 w-4" />
                  Create New Job
                </Button>
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="job in pendingJobs"
                  :key="job.id"
                  class="border-border hover:bg-muted cursor-pointer rounded-lg border p-4 transition-colors"
                  :class="{ 'ring-primary bg-primary/5 ring-2': selectedJobId === job.id }"
                  @click="selectedJobId = job.id"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="mb-2 flex items-center space-x-2">
                        <h5 class="text-foreground font-semibold">{{ job.title }}</h5>
                        <StatusBadge :status="getJobStatusColor(job.status)" size="sm">
                          {{ formatJobStatus(job.status) }}
                        </StatusBadge>
                        <StatusBadge
                          :status="getPriorityColor(job.priority)"
                          size="sm"
                          variant="outline"
                        >
                          {{ formatPriority(job.priority) }}
                        </StatusBadge>
                      </div>

                      <p class="text-muted-foreground mb-3 line-clamp-2 text-sm">
                        {{ job.description }}
                      </p>

                      <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span class="text-muted-foreground">Budget:</span>
                          <span class="text-foreground ml-1 font-medium">
                            ${{ job.budget.min.toLocaleString() }} - ${{
                              job.budget.max.toLocaleString()
                            }}
                            {{ job.budget.currency }}
                          </span>
                        </div>
                        <div>
                          <span class="text-muted-foreground">Deadline:</span>
                          <span class="text-foreground ml-1 font-medium">
                            {{ formatDate(job.deadline) }}
                          </span>
                        </div>
                        <div>
                          <span class="text-muted-foreground">Duration:</span>
                          <span class="text-foreground ml-1 font-medium">
                            {{ job.estimatedDuration }}
                          </span>
                        </div>
                        <div>
                          <span class="text-muted-foreground">Applications:</span>
                          <span class="text-foreground ml-1 font-medium">
                            {{ job.totalApplications || 0 }}
                          </span>
                        </div>
                      </div>

                      <div class="mt-3">
                        <div class="text-muted-foreground mb-1 text-xs">Requirements</div>
                        <div class="flex flex-wrap gap-1">
                          <Chip
                            v-for="language in job.requirements.languages.slice(0, 3)"
                            :key="language"
                            size="sm"
                            variant="outline"
                          >
                            {{ language }}
                          </Chip>
                          <Chip
                            v-for="voiceType in job.requirements.voiceTypes.slice(0, 2)"
                            :key="voiceType"
                            size="sm"
                            variant="secondary"
                          >
                            {{ formatVoiceType(voiceType) }}
                          </Chip>
                          <Chip
                            v-if="
                              job.requirements.languages.length > 3 ||
                              job.requirements.voiceTypes.length > 2
                            "
                            size="sm"
                            variant="outline"
                          >
                            +{{
                              job.requirements.languages.length -
                              3 +
                              (job.requirements.voiceTypes.length - 2)
                            }}
                          </Chip>
                        </div>
                      </div>
                    </div>

                    <div class="ml-4">
                      <input
                        type="radio"
                        :id="`job-${job.id}`"
                        :value="job.id"
                        v-model="selectedJobId"
                        class="text-primary focus:ring-primary border-border h-4 w-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Custom Message -->
            <div>
              <label class="text-foreground mb-2 block text-sm font-medium">
                Custom Message (Optional)
              </label>
              <Textarea
                v-model="customMessage"
                placeholder="Add a personal message to include with the invitation..."
                :rows="3"
              />
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-border flex items-center justify-between border-t px-6 py-4">
          <Button variant="ghost" @click="$emit('close')"> Cancel </Button>
          <div class="flex space-x-2">
            <Button
              variant="primary"
              @click="sendInvitation"
              :disabled="!selectedJobId || isInviting"
              :loading="isInviting"
            >
              <EmailIcon class="mr-2 h-4 w-4" />
              {{ isInviting ? 'Sending...' : 'Send Invitation' }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { VoiceActor } from '@/types/voice-actor'
import type { JobPosting } from '@/types/voice-client'
import { mockJobPostings } from '@/data/mock-voice-client-data'
import Button from '@/components/atoms/Button.vue'
import Avatar from '@/components/atoms/Avatar.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import Chip from '@/components/atoms/Chip.vue'
import Textarea from '@/components/atoms/Textarea.vue'
import { useToast } from '@/composables/useToast'
import FolderOpenIcon from '~icons/mdi/folder-open'
import PlusIcon from '~icons/mdi/plus'
import EmailIcon from '~icons/mdi/email'
import CloseIcon from '~icons/mdi/close'

interface Props {
  isOpen: boolean
  talent: VoiceActor | null
}

interface Emits {
  (e: 'close'): void
  (e: 'invitation-sent', data: { talentId: string; jobId: string; message?: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { success: showSuccess, error: showError } = useToast()

// State
const selectedJobId = ref<string>('')
const customMessage = ref('')
const isInviting = ref(false)
const pendingJobs = ref<JobPosting[]>([])

// Methods
const loadPendingJobs = async () => {
  try {
    // In real app, fetch from API
    // For now, use mock data
    pendingJobs.value = mockJobPostings.filter(
      (job) => job.status === 'active' || job.status === 'draft',
    )
  } catch (error) {
    console.error('Failed to load pending jobs:', error)
    showError('Failed to load jobs')
  }
}

const sendInvitation = async () => {
  if (!selectedJobId.value || !props.talent) return

  isInviting.value = true

  try {
    // In real app, send invitation via API
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

    emit('invitation-sent', {
      talentId: props.talent.id,
      jobId: selectedJobId.value,
      message: customMessage.value || undefined,
    })

    showSuccess(`Invitation sent to ${props.talent.displayName}`)
    emit('close')

    // Reset form
    selectedJobId.value = ''
    customMessage.value = ''
  } catch (error) {
    console.error('Failed to send invitation:', error)
    showError('Failed to send invitation')
  } finally {
    isInviting.value = false
  }
}

const createNewJob = () => {
  // Navigate to job creation
  emit('close')
  // In real app, navigate to job creation page
  console.log('Navigate to job creation')
}

const formatJobStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')
}

const formatPriority = (priority: string) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

const formatVoiceType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getJobStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'active'
    case 'draft':
      return 'warning'
    case 'closed':
      return 'inactive'
    default:
      return 'inactive'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'error'
    case 'high':
      return 'warning'
    case 'medium':
      return 'active'
    case 'low':
      return 'inactive'
    default:
      return 'inactive'
  }
}

// Lifecycle
onMounted(() => {
  if (props.isOpen) {
    loadPendingJobs()
  }
})

// Watch for modal open/close
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      loadPendingJobs()
      // Reset form when opening
      selectedJobId.value = ''
      customMessage.value = ''
    }
  },
)
</script>
