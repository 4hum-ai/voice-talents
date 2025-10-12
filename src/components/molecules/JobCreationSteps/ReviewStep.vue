<template>
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-4">Review & Publish</h1>
      <p class="text-lg text-muted-foreground">
        Review your job posting before publishing
      </p>
    </div>

    <div class="space-y-6">
      <!-- Job Overview -->
      <div class="bg-card rounded-lg border border-border p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">Job Overview</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium text-foreground mb-2">{{ jobForm.title }}</h4>
            <p class="text-sm text-muted-foreground mb-3">{{ jobForm.description }}</p>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Type:</span>
                <span class="font-medium">{{ getJobTypeLabel(jobForm.jobType) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Project:</span>
                <span class="font-medium">{{ getProjectTypeLabel(jobForm.projectType) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Payment:</span>
                <span class="font-medium">{{ getPaymentMethodLabel(jobForm.paymentDetails.method) }}</span>
              </div>
            </div>
          </div>
          <div class="space-y-3">
            <div class="p-3 bg-muted/50 rounded-lg">
              <div class="text-sm text-muted-foreground">Maximum Budget</div>
              <div class="font-semibold text-foreground">
                {{ getCurrencySymbol(jobForm.budget.currency) }}{{ jobForm.budget.max.toLocaleString() }}
              </div>
            </div>
            <div class="p-3 bg-muted/50 rounded-lg">
              <div class="text-sm text-muted-foreground">Deadline</div>
              <div class="font-semibold text-foreground">{{ formatDate(jobForm.deadline) }}</div>
            </div>
            <div class="p-3 bg-muted/50 rounded-lg">
              <div class="text-sm text-muted-foreground">Payment Method</div>
              <div class="font-semibold text-foreground">
                {{ getPaymentMethodLabel(jobForm.paymentDetails.method) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Requirements Summary -->
      <div class="bg-card rounded-lg border border-border p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">Voice Requirements</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium text-foreground mb-2">Voice Type</h4>
            <span class="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
              {{ getVoiceTypeLabel(jobForm.requirements.voiceType) }}
            </span>
          </div>
          <div>
            <h4 class="font-medium text-foreground mb-2">Language</h4>
            <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-sm">
              {{ jobForm.requirements.language }}
            </span>
          </div>
        </div>
        
        <div v-if="hasAdditionalRequirements" class="mt-4 pt-4 border-t border-border">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div v-if="jobForm.requirements.gender !== 'any'">
              <span class="text-muted-foreground">Gender:</span>
              <span class="font-medium ml-1 capitalize">{{ jobForm.requirements.gender }}</span>
            </div>
          </div>
        </div>
        
        <div v-if="jobForm.requirements.specialInstructions" class="mt-4">
          <h4 class="font-medium text-foreground mb-2">Special Instructions</h4>
          <p class="text-sm text-muted-foreground">{{ jobForm.requirements.specialInstructions }}</p>
        </div>

        <!-- Delivery Requirements -->
        <div v-if="jobForm.requirements.deliveryFormat || jobForm.requirements.deliveryTimeline || jobForm.requirements.revisionRounds" class="mt-4">
          <h4 class="font-medium text-foreground mb-2">Delivery Requirements</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-if="jobForm.requirements.deliveryFormat" class="p-3 bg-muted/50 rounded-lg">
              <div class="text-sm text-muted-foreground">Format</div>
              <div class="font-semibold text-foreground">{{ getDeliveryFormatLabel(jobForm.requirements.deliveryFormat) }}</div>
            </div>
            <div v-if="jobForm.requirements.deliveryTimeline" class="p-3 bg-muted/50 rounded-lg">
              <div class="text-sm text-muted-foreground">Timeline</div>
              <div class="font-semibold text-foreground">{{ getDeliveryTimelineLabel(jobForm.requirements.deliveryTimeline) }}</div>
            </div>
            <div v-if="jobForm.requirements.revisionRounds" class="p-3 bg-muted/50 rounded-lg">
              <div class="text-sm text-muted-foreground">Revisions</div>
              <div class="font-semibold text-foreground">{{ getRevisionRoundsLabel(jobForm.requirements.revisionRounds) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Project Files -->
      <div v-if="hasFiles" class="bg-card rounded-lg border border-border p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">Project Files</h3>
        <div class="space-y-3">
          <div v-if="jobForm.files.script" class="flex items-center space-x-3">
            <Icon name="mdi:file-document" class="h-5 w-5 text-muted-foreground" />
            <span class="text-sm text-foreground">{{ jobForm.files.script.name }}</span>
          </div>
          <div v-if="jobForm.files.referenceAudio" class="flex items-center space-x-3">
            <Icon name="mdi:music" class="h-5 w-5 text-muted-foreground" />
            <span class="text-sm text-foreground">{{ jobForm.files.referenceAudio.name }}</span>
          </div>
          <div v-if="jobForm.files.additional && jobForm.files.additional.length > 0" class="flex items-center space-x-3">
            <Icon name="mdi:attachment" class="h-5 w-5 text-muted-foreground" />
            <span class="text-sm text-foreground">{{ jobForm.files.additional.length }} additional file(s)</span>
          </div>
        </div>
      </div>

      <!-- Premium Features -->
      <div v-if="hasPremiumFeatures" class="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-lg border border-primary/20 p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">Premium Features</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="jobForm.premiumFeatures.expressMatching" class="flex items-center space-x-2">
            <Icon name="mdi:star" class="h-4 w-4 text-primary" />
            <span class="text-sm text-foreground">Express Matching ($15)</span>
          </div>
          <div v-if="jobForm.premiumFeatures.talentOutreach" class="flex items-center space-x-2">
            <Icon name="mdi:star" class="h-4 w-4 text-primary" />
            <span class="text-sm text-foreground">Talent Outreach ($19)</span>
          </div>
        </div>
        <div v-if="totalPremiumCost > 0" class="mt-4 pt-4 border-t border-primary/20">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-foreground">Total Premium Cost:</span>
            <span class="text-lg font-bold text-primary">${{ totalPremiumCost }}</span>
          </div>
        </div>
      </div>

      <!-- Quality & Settings -->
      <div class="bg-card rounded-lg border border-border p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">Quality & Settings</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium text-foreground mb-2">Visibility</h4>
            <div class="flex items-center space-x-2">
              <Icon :name="jobForm.isPublic ? 'mdi:earth' : 'mdi:lock'" class="h-4 w-4 text-primary" />
              <span class="text-sm">{{ jobForm.isPublic ? 'Public' : 'Private' }}</span>
            </div>
          </div>
          <div>
            <h4 class="font-medium text-foreground mb-2">Portfolio Required</h4>
            <div class="flex items-center space-x-2">
              <Icon :name="jobForm.requirePortfolio ? 'mdi:check-circle' : 'mdi:close-circle'" class="h-4 w-4 text-primary" />
              <span class="text-sm">{{ jobForm.requirePortfolio ? 'Yes' : 'No' }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Navigation -->
    <div class="flex justify-between mt-8">
      <Button variant="outline" size="lg" @click="handlePrevious">
        <Icon name="mdi:arrow-left" class="h-4 w-4 mr-2" />
        Previous
      </Button>
      
      <div class="flex space-x-3">
        <Button 
          variant="outline" 
          size="lg" 
          @click="handleSaveDraft"
          :disabled="isSubmitting"
        >
          <Icon name="mdi:content-save" class="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        
        <Button 
          variant="primary" 
          size="lg" 
          @click="handlePublish"
          :disabled="isSubmitting"
          class="px-8"
        >
          <Icon name="mdi:send" class="h-4 w-4 mr-2" />
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
    jobType: 'open_casting' | 'invite_only' | 'urgent_fill' | 'targeted_search'
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
    paymentDetails: {
      method: 'direct' | 'online'
    }
    isPublic: boolean
    requirePortfolio: boolean
  }
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
  return props.jobForm.requirements.gender !== 'any' ||
         props.jobForm.requirements.specialInstructions ||
         props.jobForm.requirements.deliveryFormat ||
         props.jobForm.requirements.deliveryTimeline ||
         props.jobForm.requirements.revisionRounds
})

const hasFiles = computed(() => {
  return props.jobForm.files.script || 
         props.jobForm.files.referenceAudio || 
         (props.jobForm.files.additional && props.jobForm.files.additional.length > 0)
})

const hasPremiumFeatures = computed(() => {
  return props.jobForm.premiumFeatures.expressMatching ||
         props.jobForm.premiumFeatures.talentOutreach
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
    hybrid_approach: 'Hybrid Approach'
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
    app_voice: 'App Voice'
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
    e_learning: 'E-Learning'
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
    VND: '₫'
  }
  return symbols[currency] || '$'
}

const getPaymentMethodLabel = (method: string) => {
  const labels: Record<string, string> = {
    direct: 'Pay Directly to Talent',
    online: 'Online Payment (Escrow)'
  }
  return labels[method] || method
}

const getDeliveryFormatLabel = (format: string) => {
  const labels: Record<string, string> = {
    'wav': 'WAV (Uncompressed)',
    'mp3': 'MP3 (Compressed)',
    'aiff': 'AIFF',
    'flac': 'FLAC (Lossless)',
    'm4a': 'M4A',
    'flexible': 'Flexible'
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
    'flexible': 'Flexible'
  }
  return labels[timeline] || timeline
}

const getRevisionRoundsLabel = (rounds: string) => {
  const labels: Record<string, string> = {
    '0': 'No Revisions',
    '1': '1 Round',
    '2': '2 Rounds',
    '3': '3 Rounds',
    'unlimited': 'Unlimited'
  }
  return labels[rounds] || rounds
}



const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
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
