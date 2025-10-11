<template>
  <div class="min-h-screen bg-background flex">
    <!-- Navigation Sidebar -->
    <VoiceActNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <div class="bg-card shadow-sm border-b border-border">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
              <Button variant="ghost" size="sm" @click="$router.back()" class="mr-4">
                <ArrowLeftIcon class="h-4 w-4" />
              </Button>
              <div>
                <h1 class="text-2xl font-bold text-foreground">
                  Submit Proposal
                </h1>
                <p class="text-sm text-muted-foreground">
                  {{ castingSession?.title }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-4xl mx-auto">
          <!-- Casting Session Overview -->
          <div v-if="castingSession" class="bg-card rounded-lg shadow-sm border border-border p-6 mb-8">
            <h2 class="text-lg font-semibold text-foreground mb-4">Casting Call Details</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="font-medium text-foreground mb-2">Project Information</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Client:</span>
                    <span class="text-foreground">{{ castingSession.clientName }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Type:</span>
                    <span class="text-foreground">{{ formatProjectType(castingSession.projectType) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Deadline:</span>
                    <span class="text-foreground">{{ formatDate(castingSession.deadline) }}</span>
                  </div>
                  <div v-if="castingSession.budget" class="flex justify-between">
                    <span class="text-muted-foreground">Budget Range:</span>
                    <span class="text-foreground">
                      ${{ castingSession.budget.min.toLocaleString() }} - ${{ castingSession.budget.max.toLocaleString() }}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 class="font-medium text-foreground mb-2">Requirements</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Languages:</span>
                    <span class="text-foreground">{{ castingSession.requirements.languages.join(', ') }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Voice Types:</span>
                    <span class="text-foreground">{{ castingSession.requirements.voiceTypes.map(formatVoiceType).join(', ') }}</span>
                  </div>
                  <div v-if="castingSession.requirements.experience" class="flex justify-between">
                    <span class="text-muted-foreground">Experience:</span>
                    <span class="text-foreground">{{ formatExperience(castingSession.requirements.experience) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-border">
              <h3 class="font-medium text-foreground mb-2">Description</h3>
              <p class="text-sm text-muted-foreground">{{ castingSession.description }}</p>
            </div>
          </div>

          <!-- Proposal Form -->
          <form @submit.prevent="submitProposal" class="space-y-8">
            <!-- Cost Proposal -->
            <div class="bg-card rounded-lg shadow-sm border border-border p-6">
              <h2 class="text-lg font-semibold text-foreground mb-4">Cost & Timeline Proposal</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Proposed Cost (USD)
                  </label>
                  <input
                    v-model="proposal.proposedCost"
                    type="number"
                    min="0"
                    step="100"
                    class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your proposed cost"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Proposed Timeline
                  </label>
                  <input
                    v-model="proposal.proposedTimeline"
                    type="text"
                    class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., 2-3 weeks, 1 month"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Estimated Hours
                  </label>
                  <input
                    v-model="proposal.estimatedHours"
                    type="number"
                    min="1"
                    step="0.5"
                    class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Estimated hours of work"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- Portfolio Samples -->
            <div class="bg-card rounded-lg shadow-sm border border-border p-6">
              <h2 class="text-lg font-semibold text-foreground mb-4">Portfolio Samples</h2>
              <p class="text-sm text-muted-foreground mb-4">
                Select samples from your portfolio that best showcase your abilities for this project.
              </p>
              <div class="space-y-4">
                <div v-for="sample in availableSamples" :key="sample.id" class="flex items-center space-x-3">
                  <input
                    :id="`sample-${sample.id}`"
                    v-model="proposal.portfolioSampleIds"
                    :value="sample.id"
                    type="checkbox"
                    class="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                  />
                  <label :for="`sample-${sample.id}`" class="flex-1 cursor-pointer">
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="text-sm font-medium text-foreground">{{ sample.title }}</h4>
                        <p class="text-xs text-muted-foreground">{{ sample.description }}</p>
                        <div class="flex items-center space-x-2 mt-1">
                          <Chip size="sm" variant="outline">{{ formatVoiceType(sample.voiceType) }}</Chip>
                          <Chip size="sm" variant="outline">{{ sample.genre }}</Chip>
                          <span class="text-xs text-muted-foreground">{{ sample.duration }}s</span>
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
            <div class="bg-card rounded-lg shadow-sm border border-border p-6">
              <h2 class="text-lg font-semibold text-foreground mb-4">Custom Samples</h2>
              <p class="text-sm text-muted-foreground mb-4">
                Upload custom samples specifically created for this casting call (optional).
              </p>
              <div class="space-y-4">
                <div v-for="(customSample, index) in proposal.customSamples" :key="index" class="border border-border rounded-lg p-4">
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="text-sm font-medium text-foreground">Custom Sample {{ index + 1 }}</h4>
                    <Button variant="ghost" size="sm" @click="removeCustomSample(index)">
                      <TrashIcon class="h-4 w-4" />
                    </Button>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-foreground mb-2">Title</label>
                      <input
                        v-model="customSample.title"
                        type="text"
                        class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Sample title"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-foreground mb-2">Description</label>
                      <input
                        v-model="customSample.description"
                        type="text"
                        class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Sample description"
                      />
                    </div>
                  </div>
                  <div class="mt-4">
                    <FileInput
                      v-model="customSample.file"
                      accept="audio/*"
                      label="Upload Audio File"
                      @change="handleCustomSampleUpload($event, index)"
                    />
                  </div>
                </div>
                <Button variant="outline" @click="addCustomSample">
                  <PlusIcon class="h-4 w-4 mr-2" />
                  Add Custom Sample
                </Button>
              </div>
            </div>

            <!-- Personal Note -->
            <div class="bg-card rounded-lg shadow-sm border border-border p-6">
              <h2 class="text-lg font-semibold text-foreground mb-4">Personal Note to Studio</h2>
              <p class="text-sm text-muted-foreground mb-4">
                Add a personal message to the studio explaining why you're perfect for this project.
              </p>
              <textarea
                v-model="proposal.personalNote"
                rows="6"
                class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tell the studio why you're the perfect fit for this project..."
              ></textarea>
            </div>

            <!-- Submit Actions -->
            <div class="flex items-center justify-between pt-6 border-t border-border">
              <Button variant="outline" @click="$router.back()">
                Cancel
              </Button>
              <div class="flex space-x-3">
                <Button variant="outline" @click="saveDraft" :disabled="isSubmitting">
                  Save Draft
                </Button>
                <Button variant="primary" type="submit" :disabled="isSubmitting">
                  <SendIcon class="h-4 w-4 mr-2" />
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { CastingSession, CastingProposal, VoiceSample, CustomSample } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'
import Button from '@/components/atoms/Button.vue'
import Chip from '@/components/atoms/Chip.vue'
import FileInput from '@/components/atoms/FileInput.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import ArrowLeftIcon from '~icons/mdi/arrow-left'
import PlayIcon from '~icons/mdi/play'
import TrashIcon from '~icons/mdi/trash'
import PlusIcon from '~icons/mdi/plus'
import SendIcon from '~icons/mdi/send'

const route = useRoute()
const router = useRouter()

// Current user ID - in real app, this would come from auth store
const currentUserId = 'va-001'

// State
const castingSession = ref<CastingSession | null>(null)
const isSubmitting = ref(false)

// Proposal form data
const proposal = ref<Partial<CastingProposal>>({
  castingSessionId: route.params.id as string,
  voiceActorId: currentUserId,
  voiceActorName: 'Sarah Johnson', // In real app, get from auth store
  status: 'draft',
  proposedCost: 0,
  proposedCurrency: 'USD',
  proposedTimeline: '',
  estimatedHours: 0,
  customSamples: [],
  portfolioSampleIds: [],
  personalNote: ''
})

// Available portfolio samples
const availableSamples = computed(() => {
  return mockData.voiceSamples.filter(sample => sample.voiceActorId === currentUserId)
})

// Methods
const loadCastingSession = () => {
  const session = mockData.castingSessions.find(s => s.id === route.params.id)
  if (session) {
    castingSession.value = session
    proposal.value.castingSessionId = session.id
  } else {
    router.push('/casting')
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
    year: 'numeric'
  })
}

const playSample = (sample: VoiceSample) => {
  // In real app, this would play the audio sample
  console.log('Playing sample:', sample.title)
}

const addCustomSample = () => {
  proposal.value.customSamples?.push({
    title: '',
    description: '',
    file: null,
    audioUrl: '',
    duration: 0,
    fileSize: 0,
    format: 'mp3',
    isPublic: false,
    tags: [],
    metadata: {
      recordingQuality: 'professional',
      equipment: '',
      recordingLocation: '',
      dateRecorded: new Date().toISOString()
    }
  })
}

const removeCustomSample = (index: number) => {
  proposal.value.customSamples?.splice(index, 1)
}

const handleCustomSampleUpload = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file && proposal.value.customSamples) {
    proposal.value.customSamples[index].file = file
    // In real app, upload file and get URL
    proposal.value.customSamples[index].audioUrl = URL.createObjectURL(file)
  }
}

const saveDraft = () => {
  // In real app, save draft to backend
  console.log('Saving draft:', proposal.value)
  // For now, just show success message
  alert('Draft saved successfully!')
}

const submitProposal = async () => {
  isSubmitting.value = true
  
  try {
    // In real app, submit proposal to backend
    console.log('Submitting proposal:', proposal.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Redirect back to casting view
    router.push('/casting')
    
    // Show success message
    alert('Proposal submitted successfully!')
  } catch (error) {
    console.error('Error submitting proposal:', error)
    alert('Error submitting proposal. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadCastingSession()
})
</script>
