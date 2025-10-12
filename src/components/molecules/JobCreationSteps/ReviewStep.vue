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
                <span class="text-muted-foreground">Priority:</span>
                <span class="font-medium capitalize">{{ jobForm.priority }}</span>
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
            <div v-if="jobForm.estimatedDuration" class="p-3 bg-muted/50 rounded-lg">
              <div class="text-sm text-muted-foreground">Duration</div>
              <div class="font-semibold text-foreground">{{ jobForm.estimatedDuration }}</div>
            </div>
            <div class="p-3 bg-muted/50 rounded-lg">
              <div class="text-sm text-muted-foreground">Payment Method</div>
              <div class="font-semibold text-foreground">
                {{ getPaymentMethodLabel((jobForm as any).paymentDetails?.method || 'direct') }}
              </div>
              <div v-if="(jobForm as any).paymentDetails?.method === 'online'" class="text-xs text-muted-foreground mt-1">
                {{ (jobForm as any).paymentDetails?.schedule ? (jobForm as any).paymentDetails.schedule.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'Upon completion' }}
              </div>
              <div v-if="(jobForm as any).paymentDetails?.method === 'direct'" class="text-xs text-muted-foreground mt-1">
                {{ (jobForm as any).paymentDetails?.timeline ? (jobForm as any).paymentDetails.timeline.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'Flexible' }}
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
            <h4 class="font-medium text-foreground mb-2">Voice Types</h4>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="voiceType in jobForm.requirements.voiceTypes" 
                :key="voiceType"
                class="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
              >
                {{ getVoiceTypeLabel(voiceType) }}
              </span>
            </div>
          </div>
          <div>
            <h4 class="font-medium text-foreground mb-2">Languages</h4>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="language in jobForm.requirements.languages" 
                :key="language"
                class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-sm"
              >
                {{ language }}
              </span>
            </div>
          </div>
        </div>
        
        <div v-if="hasAdditionalRequirements" class="mt-4 pt-4 border-t border-border">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div v-if="jobForm.requirements.gender !== 'any'">
              <span class="text-muted-foreground">Gender:</span>
              <span class="font-medium ml-1 capitalize">{{ jobForm.requirements.gender }}</span>
            </div>
            <div v-if="jobForm.requirements.ageRange">
              <span class="text-muted-foreground">Age Range:</span>
              <span class="font-medium ml-1">{{ jobForm.requirements.ageRange }}</span>
            </div>
          </div>
        </div>
        
        <div v-if="jobForm.requirements.specialInstructions" class="mt-4">
          <h4 class="font-medium text-foreground mb-2">Special Instructions</h4>
          <p class="text-sm text-muted-foreground">{{ jobForm.requirements.specialInstructions }}</p>
        </div>
      </div>

      <!-- Quality & Settings -->
      <div class="bg-card rounded-lg border border-border p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">Quality & Settings</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium text-foreground mb-2">Quality Level</h4>
            <div class="flex items-center space-x-2">
              <Icon :name="getQualityIcon(jobForm.requirements.quality)" class="h-4 w-4 text-primary" />
              <span class="text-sm">{{ getQualityLabel(jobForm.requirements.quality) }}</span>
            </div>
          </div>
          <div>
            <h4 class="font-medium text-foreground mb-2">Visibility</h4>
            <div class="flex items-center space-x-2">
              <Icon :name="jobForm.isPublic ? 'mdi:earth' : 'mdi:lock'" class="h-4 w-4 text-primary" />
              <span class="text-sm">{{ jobForm.isPublic ? 'Public' : 'Private' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Publishing Options -->
      <div class="bg-card rounded-lg border border-border p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">Publishing Options</h3>
        <div class="space-y-4">
          <div class="flex items-center space-x-3">
            <input
              id="requirePortfolio"
              v-model="jobForm.requirePortfolio"
              type="checkbox"
              class="h-4 w-4 text-primary focus:ring-primary border-border rounded"
            />
            <label for="requirePortfolio" class="text-sm text-foreground">
              Require portfolio samples from applicants
            </label>
          </div>
          <div class="flex items-center space-x-3">
            <input
              id="requireCustomSample"
              v-model="jobForm.requireCustomSample"
              type="checkbox"
              class="h-4 w-4 text-primary focus:ring-primary border-border rounded"
            />
            <label for="requireCustomSample" class="text-sm text-foreground">
              Require custom audition samples
            </label>
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
    priority: 'low' | 'medium' | 'high' | 'urgent'
    budget: {
      min: number
      max: number
      currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'VND'
    }
    deadline: string
    estimatedDuration: string
    requirements: {
      languages: string[]
      accents: string[]
      voiceTypes: VoiceType[]
      ageRange: string
      gender: 'male' | 'female' | 'non-binary' | 'any'
      experience: 'beginner' | 'intermediate' | 'advanced' | 'professional'
      specialInstructions: string
      quality: 'standard' | 'professional' | 'broadcast'
    }
    isPublic: boolean
    requirePortfolio: boolean
    requireCustomSample: boolean
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
         props.jobForm.requirements.ageRange ||
         props.jobForm.requirements.experience !== 'beginner'
})

// Methods
const getJobTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    open_casting: 'Open Casting',
    invite_only: 'Invite Only',
    urgent_fill: 'Urgent Fill',
    targeted_search: 'Targeted Search'
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


const getQualityLabel = (quality: string) => {
  const labels: Record<string, string> = {
    standard: 'Standard Quality',
    professional: 'Professional Quality',
    broadcast: 'Broadcast Quality'
  }
  return labels[quality] || quality
}

const getQualityIcon = (quality: string) => {
  const icons: Record<string, string> = {
    standard: 'mdi:check-circle',
    professional: 'mdi:star',
    broadcast: 'mdi:star-circle'
  }
  return icons[quality] || 'mdi:check-circle'
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
