<template>
  <div class="min-h-screen bg-background flex">
    <!-- Navigation Sidebar -->
    <ClientNavigation />

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
                  Create New Job
                </h1>
                <p class="text-sm text-muted-foreground">
                  Post a new voice acting opportunity
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="outline" size="sm" @click="saveDraft">
                <SaveIcon class="h-4 w-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-4xl mx-auto">
          <form @submit.prevent="submitJob" class="space-y-8">
            <!-- Job Type Selection -->
            <div class="bg-card rounded-lg border border-border p-6">
              <h2 class="text-lg font-semibold text-foreground mb-4">Job Type</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="type in jobTypes" 
                  :key="type.value"
                  class="relative"
                >
                  <input
                    :id="type.value"
                    v-model="jobForm.jobType"
                    type="radio"
                    :value="type.value"
                    class="sr-only"
                  />
                  <label
                    :for="type.value"
                    class="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all"
                    :class="jobForm.jobType === type.value 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'"
                  >
                    <div class="flex-1">
                      <div class="flex items-center space-x-3 mb-2">
                        <component :is="type.icon" class="h-5 w-5 text-primary" />
                        <h3 class="font-medium text-foreground">{{ type.label }}</h3>
                      </div>
                      <p class="text-sm text-muted-foreground">{{ type.description }}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Basic Information -->
            <div class="bg-card rounded-lg border border-border p-6">
              <h2 class="text-lg font-semibold text-foreground mb-6">Basic Information</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Job Title *
                  </label>
                  <input
                    v-model="jobForm.title"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Commercial Voice-Over for Tech Startup"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Project Description *
                  </label>
                  <textarea
                    v-model="jobForm.description"
                    required
                    rows="4"
                    class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Describe the project, target audience, and any specific requirements..."
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Project Type *
                  </label>
                  <SelectInput
                    v-model="jobForm.projectType"
                    :options="projectTypeOptions"
                    placeholder="Select project type"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Priority
                  </label>
                  <SelectInput
                    v-model="jobForm.priority"
                    :options="priorityOptions"
                    placeholder="Select priority"
                  />
                </div>
              </div>
            </div>

            <!-- Budget & Timeline -->
            <div class="bg-card rounded-lg border border-border p-6">
              <h2 class="text-lg font-semibold text-foreground mb-6">Budget & Timeline</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Budget Range *
                  </label>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        v-model.number="jobForm.budget.min"
                        type="number"
                        required
                        min="0"
                        class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Min"
                      />
                    </div>
                    <div>
                      <input
                        v-model.number="jobForm.budget.max"
                        type="number"
                        required
                        min="0"
                        class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Currency
                  </label>
                  <SelectInput
                    v-model="jobForm.budget.currency"
                    :options="currencyOptions"
                    placeholder="Select currency"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Deadline *
                  </label>
                  <input
                    v-model="jobForm.deadline"
                    type="date"
                    required
                    class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Estimated Duration
                  </label>
                  <input
                    v-model="jobForm.estimatedDuration"
                    type="text"
                    class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., 1-2 weeks, 1 month"
                  />
                </div>
              </div>
            </div>

            <!-- Requirements -->
            <div class="bg-card rounded-lg border border-border p-6">
              <h2 class="text-lg font-semibold text-foreground mb-6">Voice Requirements</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Languages *
                  </label>
                  <SelectInput
                    v-model="jobForm.requirements.languages[0]"
                    :options="languageOptions"
                    placeholder="Select primary language"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Voice Types *
                  </label>
                  <SelectInput
                    v-model="jobForm.requirements.voiceTypes[0]"
                    :options="voiceTypeOptions"
                    placeholder="Select primary voice type"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Accents
                  </label>
                  <SelectInput
                    v-model="jobForm.requirements.accents[0]"
                    :options="accentOptions"
                    placeholder="Select accent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Experience Level
                  </label>
                  <SelectInput
                    v-model="jobForm.requirements.experience"
                    :options="experienceOptions"
                    placeholder="Select experience level"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Age Range
                  </label>
                  <input
                    v-model="jobForm.requirements.ageRange"
                    type="text"
                    class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., 25-35, 18-25"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Gender
                  </label>
                  <SelectInput
                    v-model="jobForm.requirements.gender"
                    :options="genderOptions"
                    placeholder="Select gender"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    v-model="jobForm.requirements.specialInstructions"
                    rows="3"
                    class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Any specific requirements, tone, style, or other instructions..."
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Quality Level
                  </label>
                  <SelectInput
                    v-model="jobForm.requirements.quality"
                    :options="qualityOptions"
                    placeholder="Select quality level"
                  />
                </div>
              </div>
            </div>

            <!-- Campaign Settings -->
            <div class="bg-card rounded-lg border border-border p-6">
              <h2 class="text-lg font-semibold text-foreground mb-6">Campaign Settings</h2>
              
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <input
                    v-model="jobForm.isPublic"
                    type="checkbox"
                    id="isPublic"
                    class="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                  />
                  <label for="isPublic" class="text-sm font-medium text-foreground">
                    Make this job public (visible to all voice actors)
                  </label>
                </div>

                <div class="flex items-center space-x-3">
                  <input
                    v-model="jobForm.requirePortfolio"
                    type="checkbox"
                    id="requirePortfolio"
                    class="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                  />
                  <label for="requirePortfolio" class="text-sm font-medium text-foreground">
                    Require portfolio samples
                  </label>
                </div>

                <div class="flex items-center space-x-3">
                  <input
                    v-model="jobForm.requireCustomSample"
                    type="checkbox"
                    id="requireCustomSample"
                    class="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                  />
                  <label for="requireCustomSample" class="text-sm font-medium text-foreground">
                    Require custom sample for this job
                  </label>
                </div>
              </div>
            </div>

            <!-- Submit Actions -->
            <div class="flex items-center justify-end space-x-4">
              <Button variant="outline" @click="$router.back()">
                Cancel
              </Button>
              <Button variant="outline" @click="saveDraft">
                <SaveIcon class="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button type="submit" variant="primary" :disabled="isSubmitting">
                <SendIcon class="h-4 w-4 mr-2" />
                {{ isSubmitting ? 'Publishing...' : 'Publish Job' }}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { JobPosting } from '@/types/voice-client'
import ClientNavigation from '@/components/organisms/ClientNavigation.vue'
import Button from '@/components/atoms/Button.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
// import MultiSelectInput from '@/components/atoms/MultiSelectInput.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import ArrowLeftIcon from '~icons/mdi/arrow-left'
import SaveIcon from '~icons/mdi/content-save'
import SendIcon from '~icons/mdi/send'
import MegaphoneIcon from '~icons/mdi/megaphone'
import EmailIcon from '~icons/mdi/email'
import ClockIcon from '~icons/mdi/clock'
import TargetIcon from '~icons/mdi/target'

const router = useRouter()

// Form state
const isSubmitting = ref(false)
const currentClient = ref(mockClientData.voiceClients[0])

const jobForm = reactive({
  jobType: 'open_casting',
  title: '',
  description: '',
  projectType: '',
  priority: 'medium',
  budget: {
    min: 0,
    max: 0,
    currency: 'USD'
  },
  deadline: '',
  estimatedDuration: '',
  requirements: {
    languages: [],
    accents: [],
    voiceTypes: [],
    ageRange: '',
    gender: '',
    experience: '',
    specialInstructions: '',
    quality: 'professional'
  },
  isPublic: true,
  requirePortfolio: true,
  requireCustomSample: false
})

// Options
const projectTypeOptions = [
  { value: 'commercial', label: 'Commercial' },
  { value: 'audiobook', label: 'Audiobook' },
  { value: 'animation', label: 'Animation' },
  { value: 'video_game', label: 'Video Game' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'e-learning', label: 'E-Learning' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'radio', label: 'Radio' },
  { value: 'television', label: 'Television' },
  { value: 'film', label: 'Film' },
  { value: 'presentation', label: 'Presentation' },
  { value: 'phone_system', label: 'Phone System' },
  { value: 'app_voice', label: 'App Voice' }
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
]

const currencyOptions = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' }
]

const languageOptions = [
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Italian', label: 'Italian' },
  { value: 'Portuguese', label: 'Portuguese' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Korean', label: 'Korean' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'Russian', label: 'Russian' },
  { value: 'Dutch', label: 'Dutch' }
]

const voiceTypeOptions = [
  { value: 'narrator', label: 'Narrator' },
  { value: 'character', label: 'Character' },
  { value: 'announcer', label: 'Announcer' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'audiobook', label: 'Audiobook' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'animation', label: 'Animation' },
  { value: 'video_game', label: 'Video Game' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'e-learning', label: 'E-Learning' }
]

const accentOptions = [
  { value: 'American', label: 'American' },
  { value: 'British', label: 'British' },
  { value: 'Australian', label: 'Australian' },
  { value: 'Canadian', label: 'Canadian' },
  { value: 'Irish', label: 'Irish' },
  { value: 'Scottish', label: 'Scottish' },
  { value: 'Southern', label: 'Southern' },
  { value: 'New York', label: 'New York' },
  { value: 'California', label: 'California' },
  { value: 'Neutral', label: 'Neutral' }
]

const experienceOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'professional', label: 'Professional' }
]

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'any', label: 'Any' }
]

const qualityOptions = [
  { value: 'standard', label: 'Standard' },
  { value: 'professional', label: 'Professional' },
  { value: 'broadcast', label: 'Broadcast' }
]

// Job Types (replacing campaign types)
const jobTypes = [
  {
    value: 'open_casting',
    label: 'Open Casting',
    description: 'Open job posting for all voice actors to apply',
    icon: MegaphoneIcon
  },
  {
    value: 'invite_only',
    label: 'Invite Only',
    description: 'Send direct invitations to specific voice actors',
    icon: EmailIcon
  },
  {
    value: 'urgent_fill',
    label: 'Urgent Fill',
    description: 'Need to fill this position as soon as possible',
    icon: ClockIcon
  },
  {
    value: 'targeted_search',
    label: 'Targeted Search',
    description: 'Search for specific voice characteristics',
    icon: TargetIcon
  }
]

// Methods
const saveDraft = () => {
  // In real app, save draft to API
  console.log('Saving draft:', jobForm)
  // Show success message
}

const loadClientDefaults = () => {
  const client = currentClient.value
  if (client) {
    // Load default budget
    jobForm.budget.min = client.preferences.defaultBudget.min
    jobForm.budget.max = client.preferences.defaultBudget.max
    jobForm.budget.currency = client.preferences.defaultBudget.currency
    
    // Load default languages and voice types
    jobForm.requirements.languages = [...client.preferences.preferredLanguages]
    jobForm.requirements.voiceTypes = [...client.preferences.preferredVoiceTypes]
    
    // Load default preferences
    jobForm.requirePortfolio = true // Default from settings
    jobForm.isPublic = client.isPublic
  }
}

const submitJob = async () => {
  isSubmitting.value = true
  
  try {
    // In real app, submit job to API
    const newJob: JobPosting = {
      id: `job-${Date.now()}`,
      clientId: currentClient.value.id,
      clientName: currentClient.value.companyName,
      title: jobForm.title,
      description: jobForm.description,
      jobType: jobForm.jobType as any,
      projectType: jobForm.projectType as any,
      status: 'published',
      priority: jobForm.priority as any,
      budget: {
        min: jobForm.budget.min,
        max: jobForm.budget.max,
        currency: jobForm.budget.currency as 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD'
      },
      deadline: jobForm.deadline,
      estimatedDuration: jobForm.estimatedDuration,
      requirements: {
        languages: jobForm.requirements.languages,
        accents: jobForm.requirements.accents,
        voiceTypes: jobForm.requirements.voiceTypes as any,
        ageRange: jobForm.requirements.ageRange,
        gender: jobForm.requirements.gender as any,
        experience: jobForm.requirements.experience as any,
        specialInstructions: jobForm.requirements.specialInstructions,
        quality: jobForm.requirements.quality as any
      },
      deliverables: [],
      files: [],
      isPublic: jobForm.isPublic,
      applications: [],
      selectedTalents: [],
      totalApplications: 0,
      viewCount: 0,
      createdDate: new Date().toISOString(),
      publishedDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    console.log('Submitting job:', newJob)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Redirect to job management
    router.push('/client/jobs')
  } catch (error) {
    console.error('Error submitting job:', error)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadClientDefaults()
})
</script>
