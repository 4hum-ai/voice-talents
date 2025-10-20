<template>
  <div class="mx-auto max-w-4xl">
    <div class="mb-8 text-center">
      <h1 class="text-foreground mb-4 text-3xl font-bold">Review & Publish</h1>
      <p class="text-muted-foreground text-lg">Review your job posting before publishing</p>
    </div>

    <div class="space-y-6">
      <!-- Job Overview -->
      <div class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-lg font-semibold">Job Overview</h3>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h4 class="text-foreground mb-2 font-medium">{{ jobForm.title }}</h4>
            <p class="text-muted-foreground mb-3 text-sm">{{ jobForm.description }}</p>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Type:</span>
                <span class="font-medium">{{ getJobTypeLabel(jobForm.voiceType) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Project:</span>
                <span class="font-medium">{{ getProjectTypeLabel(jobForm.projectType) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Payment:</span>
                <span class="font-medium">{{
                  getPaymentMethodLabel(jobForm.paymentDetails.method)
                }}</span>
              </div>
            </div>
          </div>
          <div class="space-y-3">
            <div class="bg-muted/50 rounded-lg p-3">
              <div class="text-muted-foreground text-sm">Maximum Budget</div>
              <div class="text-foreground font-semibold">
                {{ getCurrencySymbol(jobForm.budget.currency)
                }}{{ jobForm.budget.max.toLocaleString() }}
              </div>
            </div>
            <div class="bg-muted/50 rounded-lg p-3">
              <div class="text-muted-foreground text-sm">Deadline</div>
              <div class="text-foreground font-semibold">{{ formatDate(jobForm.deadline) }}</div>
            </div>
            <div class="bg-muted/50 rounded-lg p-3">
              <div class="text-muted-foreground text-sm">Payment Method</div>
              <div class="text-foreground font-semibold">
                {{ getPaymentMethodLabel(jobForm.paymentDetails.method) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Requirements Summary -->
      <div class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-lg font-semibold">Voice Requirements</h3>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h4 class="text-foreground mb-2 font-medium">Voice Type</h4>
            <span class="bg-primary/10 text-primary rounded-md px-2 py-1 text-sm">
              {{ getVoiceTypeLabel(jobForm.requirements.voiceType) }}
            </span>
          </div>
          <div>
            <h4 class="text-foreground mb-2 font-medium">Language</h4>
            <span
              class="rounded-md bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            >
              {{ jobForm.requirements.language }}
            </span>
          </div>
        </div>

        <div v-if="hasAdditionalRequirements" class="border-border mt-4 border-t pt-4">
          <div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div v-if="jobForm.requirements.gender !== 'any'">
              <span class="text-muted-foreground">Gender:</span>
              <span class="ml-1 font-medium capitalize">{{ jobForm.requirements.gender }}</span>
            </div>
          </div>
        </div>

        <div v-if="jobForm.requirements.specialInstructions" class="mt-4">
          <h4 class="text-foreground mb-2 font-medium">Special Instructions</h4>
          <p class="text-muted-foreground text-sm">
            {{ jobForm.requirements.specialInstructions }}
          </p>
        </div>

        <!-- Delivery Requirements -->
        <div
          v-if="
            jobForm.requirements.deliveryFormat ||
            jobForm.requirements.deliveryTimeline ||
            jobForm.requirements.revisionRounds
          "
          class="mt-4"
        >
          <h4 class="text-foreground mb-2 font-medium">Delivery Requirements</h4>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div v-if="jobForm.requirements.deliveryFormat" class="bg-muted/50 rounded-lg p-3">
              <div class="text-muted-foreground text-sm">Format</div>
              <div class="text-foreground font-semibold">
                {{ getDeliveryFormatLabel(jobForm.requirements.deliveryFormat) }}
              </div>
            </div>
            <div v-if="jobForm.requirements.deliveryTimeline" class="bg-muted/50 rounded-lg p-3">
              <div class="text-muted-foreground text-sm">Timeline</div>
              <div class="text-foreground font-semibold">
                {{ getDeliveryTimelineLabel(jobForm.requirements.deliveryTimeline) }}
              </div>
            </div>
            <div v-if="jobForm.requirements.revisionRounds" class="bg-muted/50 rounded-lg p-3">
              <div class="text-muted-foreground text-sm">Revisions</div>
              <div class="text-foreground font-semibold">
                {{ getRevisionRoundsLabel(jobForm.requirements.revisionRounds) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Project Files -->
      <div v-if="hasFiles" class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-lg font-semibold">Project Files</h3>
        <div class="space-y-3">
          <div v-if="jobForm.files.script" class="flex items-center space-x-3">
            <Icon name="mdi:file-document" class="text-muted-foreground h-5 w-5" />
            <span class="text-foreground text-sm">{{ jobForm.files.script.name }}</span>
          </div>
          <div v-if="jobForm.files.referenceAudio" class="flex items-center space-x-3">
            <Icon name="mdi:music" class="text-muted-foreground h-5 w-5" />
            <span class="text-foreground text-sm">{{ jobForm.files.referenceAudio.name }}</span>
          </div>
          <div
            v-if="jobForm.files.additional && jobForm.files.additional.length > 0"
            class="flex items-center space-x-3"
          >
            <Icon name="mdi:attachment" class="text-muted-foreground h-5 w-5" />
            <span class="text-foreground text-sm"
              >{{ jobForm.files.additional.length }} additional file(s)</span
            >
          </div>
        </div>
      </div>

      <!-- Premium Features -->
      <div
        v-if="hasPremiumFeatures"
        class="from-primary/5 border-primary/20 rounded-lg border bg-gradient-to-r to-purple-500/5 p-6"
      >
        <h3 class="text-foreground mb-4 text-lg font-semibold">Premium Features</h3>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div v-if="jobForm.premiumFeatures.expressMatching" class="flex items-center space-x-2">
            <Icon name="mdi:star" class="text-primary h-4 w-4" />
            <span class="text-foreground text-sm">Express Matching ($15)</span>
          </div>
          <div v-if="jobForm.premiumFeatures.talentOutreach" class="flex items-center space-x-2">
            <Icon name="mdi:star" class="text-primary h-4 w-4" />
            <span class="text-foreground text-sm">Talent Outreach ($19)</span>
          </div>
        </div>
        <div v-if="totalPremiumCost > 0" class="border-primary/20 mt-4 border-t pt-4">
          <div class="flex items-center justify-between">
            <span class="text-foreground text-sm font-medium">Total Premium Cost:</span>
            <span class="text-primary text-lg font-bold">${{ totalPremiumCost }}</span>
          </div>
        </div>
      </div>

      <!-- Quality & Settings -->
      <div class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-lg font-semibold">Quality & Settings</h3>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h4 class="text-foreground mb-2 font-medium">Visibility</h4>
            <div class="flex items-center space-x-2">
              <Icon
                :name="jobForm.isPublic ? 'mdi:earth' : 'mdi:lock'"
                class="text-primary h-4 w-4"
              />
              <span class="text-sm">{{ jobForm.isPublic ? 'Public' : 'Private' }}</span>
            </div>
          </div>
          <div>
            <h4 class="text-foreground mb-2 font-medium">Portfolio Required</h4>
            <div class="flex items-center space-x-2">
              <Icon
                :name="jobForm.requirePortfolio ? 'mdi:check-circle' : 'mdi:close-circle'"
                class="text-primary h-4 w-4"
              />
              <span class="text-sm">{{ jobForm.requirePortfolio ? 'Yes' : 'No' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="mt-8 flex justify-between">
      <Button variant="outline" size="lg" @click="handlePrevious">
        <Icon name="mdi:arrow-left" class="mr-2 h-4 w-4" />
        Previous
      </Button>

      <div class="flex space-x-3">
        <Button variant="outline" size="lg" @click="handleSaveDraft" :disabled="isSubmitting">
          <Icon name="mdi:content-save" class="mr-2 h-4 w-4" />
          Save Draft
        </Button>

        <Button
          variant="primary"
          size="lg"
          @click="handlePublish"
          :disabled="isSubmitting"
          class="px-8"
        >
          <Icon name="mdi:send" class="mr-2 h-4 w-4" />
          {{ isSubmitting ? 'Publishing...' : 'Publish Job' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
// import type { JobPosting } from '@/types/voice-client' // Not used in this component
import type { VoiceType } from '@/types/voice-actor'

interface Props {
  jobForm: {
    voiceType: 'talent_only' | 'ai_synthesis' | 'hybrid_approach'
    title: string
    description: string
    projectType: string
    budget: {
      max: number
      currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'VND'
    }
    deadline: string
    requirements: {
      language: string
      voiceType: VoiceType
      gender: 'male' | 'female' | 'non-binary' | 'any'
      specialInstructions: string
      deliveryFormat: string
      deliveryTimeline: string
      revisionRounds: string
    }
    files: {
      script?: File
      referenceAudio?: File
      additional?: File[]
    }
    premiumFeatures: {
      expressMatching: boolean
      talentOutreach: boolean
    }
    aiSettings: {
      voiceModel: string
      voiceStyle: string
      emotion: string
      speed: 'slow' | 'normal' | 'fast'
      pitch: 'low' | 'normal' | 'high'
    }
    paymentDetails: {
      method: 'direct' | 'online'
    }
    isPublic: boolean
    requirePortfolio: boolean
  }
  voiceType?: 'talent_only' | 'ai_synthesis' | 'hybrid_approach'
  isSubmitting: boolean
}

interface Emits {
  (e: 'publish'): void
  (e: 'previous'): void
  (e: 'save-draft'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Computed properties
const hasAdditionalRequirements = computed(() => {
  return (
    props.jobForm.requirements.gender !== 'any' ||
    props.jobForm.requirements.specialInstructions ||
    props.jobForm.requirements.deliveryFormat ||
    props.jobForm.requirements.deliveryTimeline ||
    props.jobForm.requirements.revisionRounds
  )
})

const hasFiles = computed(() => {
  return (
    props.jobForm.files.script ||
    props.jobForm.files.referenceAudio ||
    (props.jobForm.files.additional && props.jobForm.files.additional.length > 0)
  )
})

const hasPremiumFeatures = computed(() => {
  return (
    props.jobForm.premiumFeatures.expressMatching || props.jobForm.premiumFeatures.talentOutreach
  )
})


const totalPremiumCost = computed(() => {
  let cost = 0
  if (props.jobForm.premiumFeatures.expressMatching) cost += 15
  if (props.jobForm.premiumFeatures.talentOutreach) cost += 19
  return cost
})

// Methods
const getJobTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    talent_only: 'Talent Only',
    ai_synthesis: 'AI Voice Synthesis',
    hybrid_approach: 'Hybrid Approach',
  }
  return labels[type] || type
}

const getProjectTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    commercial: 'Commercial',
    audiobook: 'Audiobook',
    animation: 'Animation',
    video_game: 'Video Game',
    documentary: 'Documentary',
    'e-learning': 'E-Learning',
    podcast: 'Podcast',
    radio: 'Radio',
    television: 'Television',
    film: 'Film',
    presentation: 'Presentation',
    phone_system: 'Phone System',
    app_voice: 'App Voice',
  }
  return labels[type] || type
}

const getVoiceTypeLabel = (type: VoiceType) => {
  const labels: Record<string, string> = {
    narrator: 'Narrator',
    character: 'Character',
    announcer: 'Announcer',
    commercial: 'Commercial',
    audiobook: 'Audiobook',
    podcast: 'Podcast',
    animation: 'Animation',
    video_game: 'Video Game',
    documentary: 'Documentary',
    e_learning: 'E-Learning',
  }
  return labels[type] || type
}

const getCurrencySymbol = (currency: string) => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    VND: '₫',
  }
  return symbols[currency] || '$'
}

const getPaymentMethodLabel = (method: string) => {
  const labels: Record<string, string> = {
    direct: 'Pay Directly to Talent',
    online: 'Online Payment (Escrow)',
  }
  return labels[method] || method
}

const getDeliveryFormatLabel = (format: string) => {
  const labels: Record<string, string> = {
    wav: 'WAV (Uncompressed)',
    mp3: 'MP3 (Compressed)',
    aiff: 'AIFF',
    flac: 'FLAC (Lossless)',
    m4a: 'M4A',
    flexible: 'Flexible',
  }
  return labels[format] || format
}

const getDeliveryTimelineLabel = (timeline: string) => {
  const labels: Record<string, string> = {
    '24_hours': '24 Hours',
    '48_hours': '48 Hours',
    '3_days': '3 Days',
    '1_week': '1 Week',
    '2_weeks': '2 Weeks',
    flexible: 'Flexible',
  }
  return labels[timeline] || timeline
}

const getRevisionRoundsLabel = (rounds: string) => {
  const labels: Record<string, string> = {
    '0': 'No Revisions',
    '1': '1 Round',
    '2': '2 Rounds',
    '3': '3 Rounds',
    unlimited: 'Unlimited',
  }
  return labels[rounds] || rounds
}


const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const handlePublish = () => {
  emit('publish')
}

const handlePrevious = () => {
  emit('previous')
}

const handleSaveDraft = () => {
  emit('save-draft')
}
</script>
