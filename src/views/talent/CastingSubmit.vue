<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <VoiceActNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <AppBar :show-back="true" @back="$router.back()">
        <template #title>Submit Proposal</template>
        <template #subtitle>{{ castingSession?.title }}</template>
        <template #actions>
          <ThemeToggle />
        </template>
      </AppBar>

      <div class="px-4 py-8 pt-24 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl">
          <!-- Casting Session Overview -->
          <div
            v-if="castingSession"
            class="bg-card border-border mb-8 rounded-lg border p-6 shadow-sm"
          >
            <h2 class="text-foreground mb-4 text-lg font-semibold">Casting Call Details</h2>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 class="text-foreground mb-2 font-medium">Project Information</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Client:</span>
                    <span class="text-foreground">{{ castingSession.clientName }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Type:</span>
                    <span class="text-foreground">{{
                      formatProjectType(castingSession.projectType)
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Deadline:</span>
                    <span class="text-foreground">{{ formatDate(castingSession.deadline) }}</span>
                  </div>
                  <div v-if="castingSession.budget" class="flex justify-between">
                    <span class="text-muted-foreground">Budget Range:</span>
                    <span class="text-foreground">
                      ${{ castingSession.budget.min.toLocaleString() }} - ${{
                        castingSession.budget.max.toLocaleString()
                      }}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 class="text-foreground mb-2 font-medium">Requirements</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Languages:</span>
                    <span class="text-foreground">{{
                      castingSession.requirements.languages.join(', ')
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Voice Types:</span>
                    <span class="text-foreground">{{
                      castingSession.requirements.voiceTypes.map(formatVoiceType).join(', ')
                    }}</span>
                  </div>
                  <div v-if="castingSession.requirements.experience" class="flex justify-between">
                    <span class="text-muted-foreground">Experience:</span>
                    <span class="text-foreground">{{
                      formatExperience(castingSession.requirements.experience)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="border-border mt-4 border-t pt-4">
              <h3 class="text-foreground mb-2 font-medium">Description</h3>
              <p class="text-muted-foreground text-sm">{{ castingSession.description }}</p>
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
                    v-model="proposal.proposedCost"
                    type="number"
                    min="0"
                    step="100"
                    :class="[
                      'w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none',
                      formErrors.proposedCost 
                        ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                        : 'border-border bg-background text-foreground focus:ring-primary'
                    ]"
                    placeholder="Enter your proposed cost"
                    required
                  />
                  <p v-if="formErrors.proposedCost" class="text-red-500 mt-1 text-xs">
                    {{ formErrors.proposedCost }}
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
                        : 'border-border bg-background text-foreground focus:ring-primary'
                    ]"
                    placeholder="e.g., 2-3 weeks, 1 month"
                    required
                  />
                  <p v-if="formErrors.proposedTimeline" class="text-red-500 mt-1 text-xs">
                    {{ formErrors.proposedTimeline }}
                  </p>
                </div>
                <div>
                  <label class="text-foreground mb-2 block text-sm font-medium">
                    Estimated Hours
                  </label>
                  <input
                    v-model="proposal.estimatedHours"
                    type="number"
                    min="1"
                    step="0.5"
                    :class="[
                      'w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none',
                      formErrors.estimatedHours 
                        ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                        : 'border-border bg-background text-foreground focus:ring-primary'
                    ]"
                    placeholder="Estimated hours of work"
                    required
                  />
                  <p v-if="formErrors.estimatedHours" class="text-red-500 mt-1 text-xs">
                    {{ formErrors.estimatedHours }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Portfolio Samples -->
            <div class="bg-card border-border rounded-lg border p-6 shadow-sm">
              <h2 class="text-foreground mb-4 text-lg font-semibold">Portfolio Samples</h2>
              <p class="text-muted-foreground mb-4 text-sm">
                Select samples from your portfolio that best showcase your abilities for this
                project.
              </p>
              <p v-if="formErrors.samples" class="text-red-500 mb-4 text-sm">
                {{ formErrors.samples }}
              </p>
              <div class="space-y-4">
                <div
                  v-for="sample in availableSamples"
                  :key="sample.id"
                  class="flex items-center space-x-3"
                >
                  <input
                    :id="`sample-${sample.id}`"
                    v-model="proposal.portfolioSampleIds"
                    :value="sample.id"
                    type="checkbox"
                    class="text-primary focus:ring-primary border-border h-4 w-4 rounded"
                  />
                  <label :for="`sample-${sample.id}`" class="flex-1 cursor-pointer">
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="text-foreground text-sm font-medium">{{ sample.title }}</h4>
                        <p class="text-muted-foreground text-xs">{{ sample.description }}</p>
                        <div class="mt-1 flex items-center space-x-2">
                          <Chip size="sm" variant="outline">{{
                            formatVoiceType(sample.voiceType)
                          }}</Chip>
                          <Chip size="sm" variant="outline">{{ sample.genre }}</Chip>
                          <span class="text-muted-foreground text-xs">{{ sample.duration }}s</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" @click="playSample(sample)">
                        <PlayIcon class="h-4 w-4" />
                      </Button>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Custom Samples -->
            <div class="bg-card border-border rounded-lg border p-6 shadow-sm">
              <h2 class="text-foreground mb-4 text-lg font-semibold">Custom Samples</h2>
              <p class="text-muted-foreground mb-4 text-sm">
                Upload custom samples specifically created for this casting call (optional).
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
                    <Button variant="ghost" size="sm" @click="removeCustomSample(index)">
                      <TrashIcon class="h-4 w-4" />
                    </Button>
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
                <Button variant="outline" @click="addCustomSample">
                  <PlusIcon class="mr-2 h-4 w-4" />
                  Add Custom Sample
                </Button>
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
                    : 'border-border bg-background text-foreground focus:ring-primary'
                ]"
                placeholder="Tell the studio why you're the perfect fit for this project..."
              ></textarea>
              <p v-if="formErrors.personalNote" class="text-red-500 mt-1 text-xs">
                {{ formErrors.personalNote }}
              </p>
            </div>

            <!-- Submit Actions -->
            <div class="border-border flex items-center justify-between border-t pt-6">
              <div class="flex items-center space-x-2">
                <Button variant="outline" @click="$router.back()"> Cancel </Button>
                <span v-if="hasUnsavedChanges" class="text-muted-foreground text-xs">
                  • Unsaved changes
                </span>
              </div>
              <div class="flex space-x-3">
                <Button 
                  variant="outline" 
                  @click="saveDraft" 
                  :disabled="isSubmitting || isSavingDraft"
                >
                  {{ isSavingDraft ? 'Saving...' : 'Save Draft' }}
                </Button>
                <Button 
                  variant="primary" 
                  type="submit" 
                  :disabled="isSubmitting || isSavingDraft || !isFormValid"
                >
                  <SendIcon class="mr-2 h-4 w-4" />
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
import type {
  CastingSession,
  CastingProposal,
  VoiceSample,
} from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import Button from '@/components/atoms/Button.vue'
import Chip from '@/components/atoms/Chip.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import PlayIcon from '~icons/mdi/play'
import TrashIcon from '~icons/mdi/trash'
import PlusIcon from '~icons/mdi/plus'
import SendIcon from '~icons/mdi/send'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { success, error, warning } = useToast()

// Current user ID - in real app, this would come from auth store
const currentUserId = authStore.user?.id || 'va-001'

// State
const castingSession = ref<CastingSession | null>(null)
const isSubmitting = ref(false)
const isSavingDraft = ref(false)
const formErrors = ref<Record<string, string>>({})
const hasUnsavedChanges = ref(false)

// Proposal form data
const proposal = ref<Partial<CastingProposal>>({
  castingSessionId: route.params.id as string,
  voiceActorId: currentUserId,
  voiceActorName: authStore.user?.displayName || authStore.user?.email || 'Voice Actor', // Get from auth store
  status: 'draft',
  proposedCost: 0,
  proposedCurrency: 'USD',
  proposedTimeline: '',
  estimatedHours: 0,
  customSamples: [],
  portfolioSampleIds: [],
  personalNote: '',
})

// Available portfolio samples
const availableSamples = computed(() => {
  return mockData.voiceSamples.filter((sample) => sample.voiceActorId === currentUserId)
})

// Form validation
const isFormValid = computed(() => {
  const errors: Record<string, string> = {}
  
  if (!proposal.value.proposedCost || proposal.value.proposedCost <= 0) {
    errors.proposedCost = 'Please enter a valid proposed cost'
  }
  
  if (!proposal.value.proposedTimeline?.trim()) {
    errors.proposedTimeline = 'Please enter a proposed timeline'
  }
  
  if (!proposal.value.estimatedHours || proposal.value.estimatedHours <= 0) {
    errors.estimatedHours = 'Please enter estimated hours'
  }
  
  if (!proposal.value.personalNote?.trim()) {
    errors.personalNote = 'Please add a personal note to the studio'
  }
  
  if (!proposal.value.portfolioSampleIds?.length && !proposal.value.customSamples?.length) {
    errors.samples = 'Please select at least one portfolio sample or upload a custom sample'
  }
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
})

// Watch for form changes
watch(proposal, () => {
  hasUnsavedChanges.value = true
}, { deep: true })

// Methods
const loadCastingSession = () => {
  const session = mockData.castingSessions.find((s) => s.id === route.params.id)
  if (session) {
    castingSession.value = session
    proposal.value.castingSessionId = session.id
  } else {
    router.push('/talent/casting')
  }
}

const formatProjectType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
}

const formatVoiceType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
}

const formatExperience = (experience: string) => {
  return experience.charAt(0).toUpperCase() + experience.slice(1)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const playSample = (sample: VoiceSample) => {
  // In real app, this would play the audio sample
  console.log('Playing sample:', sample.title)
}

const addCustomSample = () => {
  proposal.value.customSamples?.push({
    id: `custom-${Date.now()}`,
    proposalId: proposal.value.castingSessionId || '',
    title: '',
    description: '',
    audioUrl: '',
    duration: 0,
    fileSize: 0,
    format: 'mp3',
    isPublic: false,
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      recordingQuality: 'professional',
      equipment: '',
      recordingLocation: '',
      dateRecorded: new Date().toISOString(),
    },
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
    proposal.value.customSamples[index].format = file.type.split('/')[1] as 'mp3' | 'wav' | 'aac' | 'flac'
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
  } catch (err) {
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
  loadCastingSession()
})
</script>
