<template>
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-4">Requirements & Budget</h1>
      <p class="text-lg text-muted-foreground">
        Set your voice requirements, budget, and upload project files
      </p>
    </div>

    <div class="space-y-8">
      <!-- Voice Requirements Section -->
      <div class="bg-card rounded-lg border border-border p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">Voice Requirements</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Voice Type -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-3">
              Voice Type *
            </label>
            <div class="grid grid-cols-2 gap-2">
              <div 
                v-for="voiceType in voiceTypeOptions" 
                :key="voiceType.value"
                class="relative"
              >
                <input
                  :id="voiceType.value"
                  v-model="localRequirements.voiceType"
                  type="radio"
                  :value="voiceType.value"
                  class="sr-only"
                />
                <label
                  :for="voiceType.value"
                  class="flex items-center p-2 border-2 rounded-lg cursor-pointer transition-all text-sm"
                  :class="localRequirements.voiceType === voiceType.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'"
                >
                  <Icon :name="voiceType.icon" class="h-4 w-4 mr-2" />
                  <span class="font-medium">{{ voiceType.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Language -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-3">
              Language *
            </label>
            <div class="grid grid-cols-2 gap-2">
              <div 
                v-for="language in languageOptions" 
                :key="language.value"
                class="relative"
              >
                <input
                  :id="language.value"
                  v-model="localRequirements.language"
                  type="radio"
                  :value="language.value"
                  class="sr-only"
                />
                <label
                  :for="language.value"
                  class="flex items-center justify-center p-2 border-2 rounded-lg cursor-pointer transition-all text-sm"
                  :class="localRequirements.language === language.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'"
                >
                  <span class="font-medium">{{ language.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Gender -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-foreground mb-2">
            Gender Preference
          </label>
          <SelectInput
            v-model="localRequirements.gender"
            :options="genderOptions"
            placeholder="Select gender preference"
          />
        </div>

        <!-- Special Instructions -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-foreground mb-2">
            Special Instructions
          </label>
          <textarea
            v-model="localRequirements.specialInstructions"
            rows="3"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Any specific requirements, tone, style, or other instructions..."
          ></textarea>
        </div>

        <!-- Delivery Requirements -->
        <div class="mt-6 pt-4 border-t border-border">
          <h4 class="font-medium text-foreground mb-4">Delivery Requirements</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">
                Delivery Format
              </label>
              <SelectInput
                v-model="localRequirements.deliveryFormat"
                :options="deliveryFormatOptions"
                placeholder="Select format"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">
                Delivery Timeline
              </label>
              <SelectInput
                v-model="localRequirements.deliveryTimeline"
                :options="deliveryTimelineOptions"
                placeholder="Select timeline"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">
                Revision Rounds
              </label>
              <SelectInput
                v-model="localRequirements.revisionRounds"
                :options="revisionRoundsOptions"
                placeholder="Select rounds"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Budget & Timeline Section -->
      <div class="bg-card rounded-lg border border-border p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">Budget & Timeline</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Currency
            </label>
            <SelectInput
              v-model="localBudget.currency"
              :options="currencyOptions"
              placeholder="Select currency"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Maximum Budget *
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {{ getCurrencySymbol(localBudget.currency) }}
              </span>
              <input
                v-model.number="localBudget.max"
                type="number"
                min="0"
                step="1"
                required
                class="w-full pl-8 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Project Deadline *
            </label>
            <input
              v-model="localDeadline"
              type="date"
              required
              :min="minDate"
              class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <!-- Project Files Section -->
      <div class="bg-card rounded-lg border border-border p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">Project Files</h3>
        <p class="text-sm text-muted-foreground mb-4">
          Upload scripts, reference audio, and other materials to help talent understand your project
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Script Upload -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Script/Transcript
            </label>
            <FileUpload
              v-model="localFiles.script"
              accept=".pdf,.doc,.docx,.txt"
              :max-size="10"
              @upload="handleScriptUpload"
            />
          </div>

          <!-- Reference Audio Upload -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Reference Audio
            </label>
            <FileUpload
              v-model="localFiles.referenceAudio"
              accept=".mp3,.wav,.m4a,.aac"
              :max-size="25"
              @upload="handleReferenceUpload"
            />
          </div>
        </div>
      </div>

      <!-- Premium Features Section -->
      <div class="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-lg border border-primary/20 p-6">
        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="mdi:star" class="h-6 w-6 text-primary" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-foreground mb-2">Premium Features</h3>
            <p class="text-sm text-muted-foreground mb-4">
              Enhance your job posting with AI-powered features and professional talent outreach
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex items-start space-x-3">
                <input
                  id="expressMatching"
                  v-model="localPremiumFeatures.expressMatching"
                  type="checkbox"
                  class="h-4 w-4 text-primary focus:ring-primary border-border rounded mt-0.5"
                />
                <div>
                  <label for="expressMatching" class="text-sm font-medium text-foreground">
                    Express Matching ($15)
                  </label>
                  <p class="text-xs text-muted-foreground">AI identifies perfect voice matches instantly</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <input
                  id="talentOutreach"
                  v-model="localPremiumFeatures.talentOutreach"
                  type="checkbox"
                  class="h-4 w-4 text-primary focus:ring-primary border-border rounded mt-0.5"
                />
                <div>
                  <label for="talentOutreach" class="text-sm font-medium text-foreground">
                    Talent Outreach ($19)
                  </label>
                  <p class="text-xs text-muted-foreground">Professional casting director reaches out to top talent</p>
                </div>
              </div>
            </div>
            
            <div v-if="totalPremiumCost > 0" class="mt-4 p-3 bg-primary/10 rounded-lg">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-foreground">Total Premium Cost:</span>
                <span class="text-lg font-bold text-primary">${{ totalPremiumCost }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Method Section -->
      <div class="bg-card rounded-lg border border-border p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">Payment Method</h3>
        
        <div class="space-y-4">
          <div 
            v-for="method in paymentMethods" 
            :key="method.value"
            class="relative"
          >
            <input
              :id="method.value"
              v-model="localPaymentDetails.method"
              type="radio"
              :value="method.value"
              class="sr-only"
            />
            <label
              :for="method.value"
              class="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md"
              :class="localPaymentDetails.method === method.value 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'"
            >
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                       :class="method.value === 'direct' ? 'bg-green-500/10' : 'bg-blue-500/10'">
                    <Icon :name="method.icon" 
                          :class="method.value === 'direct' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'" 
                          class="h-4 w-4" />
                  </div>
                  <div>
                    <h4 class="font-semibold text-foreground">{{ method.title }}</h4>
                    <p class="text-sm text-muted-foreground">{{ method.subtitle }}</p>
                  </div>
                </div>
                <p class="text-sm text-muted-foreground">{{ method.description }}</p>
              </div>
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
      
      <Button 
        variant="primary" 
        size="lg" 
        @click="handleNext"
        :disabled="!isValid"
        class="px-8"
      >
        Continue
        <Icon name="mdi:arrow-right" class="h-4 w-4 ml-2" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import FileUpload from '@/components/atoms/FileUpload.vue'
import type { VoiceType } from '@/types/voice-actor'

interface Requirements {
  language: string
  voiceType: VoiceType
  gender: 'male' | 'female' | 'non-binary' | 'any'
  specialInstructions: string
  deliveryFormat: string
  deliveryTimeline: string
  revisionRounds: string
}

interface Budget {
  max: number
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'VND'
}

interface ProjectFiles {
  script?: File
  referenceAudio?: File
  additional?: File[]
}

interface PremiumFeatures {
  expressMatching: boolean
  talentOutreach: boolean
}

interface PaymentDetails {
  method: 'direct' | 'online'
}

interface Props {
  requirements: Requirements
  budget: Budget
  deadline: string
  files: ProjectFiles
  premiumFeatures: PremiumFeatures
  paymentDetails: PaymentDetails
}

interface Emits {
  (e: 'update:requirements', value: Requirements): void
  (e: 'update:budget', value: Budget): void
  (e: 'update:deadline', value: string): void
  (e: 'update:files', value: ProjectFiles): void
  (e: 'update:premiumFeatures', value: PremiumFeatures): void
  (e: 'update:paymentDetails', value: PaymentDetails): void
  (e: 'next'): void
  (e: 'previous'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localRequirements = ref({ ...props.requirements })
const localBudget = ref({ ...props.budget })
const localDeadline = ref(props.deadline)
const localFiles = ref({ ...props.files })
const localPremiumFeatures = ref({ ...props.premiumFeatures })
const localPaymentDetails = ref({ ...props.paymentDetails })

// Options
const voiceTypeOptions = [
  { value: 'narrator', label: 'Narrator', icon: 'mdi:microphone' },
  { value: 'character', label: 'Character', icon: 'mdi:account' },
  { value: 'announcer', label: 'Announcer', icon: 'mdi:bullhorn' },
  { value: 'commercial', label: 'Commercial', icon: 'mdi:tv' },
  { value: 'audiobook', label: 'Audiobook', icon: 'mdi:book-open' },
  { value: 'podcast', label: 'Podcast', icon: 'mdi:podcast' }
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
  { value: 'Chinese', label: 'Chinese' }
]

const genderOptions = [
  { value: 'any', label: 'Any' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' }
]

const deliveryFormatOptions = [
  { value: 'wav', label: 'WAV (Uncompressed)' },
  { value: 'mp3', label: 'MP3 (Compressed)' },
  { value: 'aiff', label: 'AIFF' },
  { value: 'flac', label: 'FLAC (Lossless)' },
  { value: 'm4a', label: 'M4A' },
  { value: 'flexible', label: 'Flexible' }
]

const deliveryTimelineOptions = [
  { value: '24_hours', label: '24 Hours' },
  { value: '48_hours', label: '48 Hours' },
  { value: '3_days', label: '3 Days' },
  { value: '1_week', label: '1 Week' },
  { value: '2_weeks', label: '2 Weeks' },
  { value: 'flexible', label: 'Flexible' }
]

const revisionRoundsOptions = [
  { value: '0', label: 'No Revisions' },
  { value: '1', label: '1 Round' },
  { value: '2', label: '2 Rounds' },
  { value: '3', label: '3 Rounds' },
  { value: 'unlimited', label: 'Unlimited' }
]

const currencyOptions = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'VND', label: 'VND (₫)' }
]

const paymentMethods = [
  {
    value: 'direct',
    title: 'Pay Directly to Talent',
    subtitle: 'Default option - no platform fees',
    icon: 'mdi:handshake',
    description: 'You\'ll handle payments directly with the selected talent after job completion.'
  },
  {
    value: 'online',
    title: 'Online Payment (Escrow)',
    subtitle: 'Secure platform-managed payments',
    icon: 'mdi:shield-check',
    description: 'Use our secure online payment system with escrow protection.'
  }
]

// Computed properties
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const isValid = computed(() => {
  return !!localRequirements.value.voiceType && 
         !!localRequirements.value.language && 
         localBudget.value.max > 0 &&
         localDeadline.value.length > 0
})

const totalPremiumCost = computed(() => {
  let cost = 0
  if (localPremiumFeatures.value.expressMatching) cost += 15
  if (localPremiumFeatures.value.talentOutreach) cost += 19
  return cost
})

// Methods
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

const handleScriptUpload = (file: File) => {
  localFiles.value.script = file
}

const handleReferenceUpload = (file: File) => {
  localFiles.value.referenceAudio = file
}

const handleNext = () => {
  if (isValid.value) {
    emit('next')
  }
}

const handlePrevious = () => {
  emit('previous')
}

// Watch for changes and emit updates
watch(localRequirements, (newValue) => {
  emit('update:requirements', newValue)
}, { deep: true })

watch(localBudget, (newValue) => {
  emit('update:budget', newValue)
}, { deep: true })

watch(localDeadline, (newValue) => {
  emit('update:deadline', newValue)
})

watch(localFiles, (newValue) => {
  emit('update:files', newValue)
}, { deep: true })

watch(localPremiumFeatures, (newValue) => {
  emit('update:premiumFeatures', newValue)
}, { deep: true })

watch(localPaymentDetails, (newValue) => {
  emit('update:paymentDetails', newValue)
}, { deep: true })
</script>
