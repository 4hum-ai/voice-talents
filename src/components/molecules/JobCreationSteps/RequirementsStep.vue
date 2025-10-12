<template>
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-4">Voice Requirements</h1>
      <p class="text-lg text-muted-foreground">
        Specify the voice characteristics and experience you're looking for
      </p>
    </div>

    <div class="space-y-8">
      <!-- Voice Type -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-3">
          Voice Type *
        </label>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
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
              class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all"
              :class="localRequirements.voiceType === voiceType.value
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'"
            >
              <Icon :name="voiceType.icon" class="h-4 w-4 mr-2" />
              <span class="text-sm font-medium">{{ voiceType.label }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Language -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-3">
          Language *
        </label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
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
              class="flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all"
              :class="localRequirements.language === language.value
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'"
            >
              <span class="text-sm font-medium">{{ language.label }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Demographics -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">
            Gender
          </label>
          <SelectInput
            v-model="localRequirements.gender"
            :options="genderOptions"
            placeholder="Select gender"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-foreground mb-2">
            Age Range
          </label>
          <SelectInput
            v-model="localRequirements.ageRange"
            :options="ageRangeOptions"
            placeholder="Select age range"
          />
        </div>
      </div>

      <!-- Accents -->
      <div v-if="availableAccents.length > 0">
        <label class="block text-sm font-medium text-foreground mb-3">
          Accent (Optional)
        </label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div 
            v-for="accent in availableAccents" 
            :key="accent.value"
            class="relative"
          >
            <input
              :id="accent.value"
              v-model="localRequirements.accent"
              type="radio"
              :value="accent.value"
              class="sr-only"
            />
            <label
              :for="accent.value"
              class="flex items-center justify-center p-2 border-2 rounded-lg cursor-pointer transition-all"
              :class="localRequirements.accent === accent.value
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'"
            >
              <span class="text-sm">{{ accent.label }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Special Instructions -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2">
          Special Instructions
        </label>
        <textarea
          v-model="localRequirements.specialInstructions"
          rows="4"
          class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Any specific requirements, tone, style, or other instructions..."
        ></textarea>
      </div>

      <!-- Requirements Summary -->
      <div v-if="hasRequirements" class="bg-muted/50 rounded-lg p-4">
        <h4 class="font-medium text-foreground mb-2">Requirements Summary</h4>
        <div class="space-y-1 text-sm text-muted-foreground">
          <div v-if="localRequirements.voiceType">
            <strong>Voice Type:</strong> {{ getVoiceTypeLabel(localRequirements.voiceType) }}
          </div>
          <div v-if="localRequirements.language">
            <strong>Language:</strong> {{ localRequirements.language }}
          </div>
          <div v-if="localRequirements.gender !== 'any'">
            <strong>Gender:</strong> {{ localRequirements.gender }}
          </div>
          <div v-if="localRequirements.ageRange">
            <strong>Age Range:</strong> {{ localRequirements.ageRange }}
          </div>
          <div v-if="localRequirements.accent">
            <strong>Accent:</strong> {{ getAccentLabel(localRequirements.accent) }}
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
import type { VoiceType } from '@/types/voice-actor'

interface Requirements {
  language: string
  accent: string
  voiceType: VoiceType
  ageRange: string
  gender: 'male' | 'female' | 'non-binary' | 'any'
  specialInstructions: string
}

interface Props {
  requirements: Requirements
}

interface Emits {
  (e: 'update:requirements', value: Requirements): void
  (e: 'next'): void
  (e: 'previous'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localRequirements = ref({ ...props.requirements })

// Options
const voiceTypeOptions = [
  { value: 'narrator', label: 'Narrator', icon: 'mdi:microphone' },
  { value: 'character', label: 'Character', icon: 'mdi:account' },
  { value: 'announcer', label: 'Announcer', icon: 'mdi:bullhorn' },
  { value: 'commercial', label: 'Commercial', icon: 'mdi:tv' },
  { value: 'audiobook', label: 'Audiobook', icon: 'mdi:book-open' },
  { value: 'podcast', label: 'Podcast', icon: 'mdi:podcast' },
  { value: 'animation', label: 'Animation', icon: 'mdi:animation' },
  { value: 'video_game', label: 'Video Game', icon: 'mdi:gamepad' },
  { value: 'documentary', label: 'Documentary', icon: 'mdi:film' },
  { value: 'e_learning', label: 'E-Learning', icon: 'mdi:school' }
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

const genderOptions = [
  { value: 'any', label: 'Any' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' }
]

const ageRangeOptions = [
  { value: '18-25', label: '18-25' },
  { value: '26-35', label: '26-35' },
  { value: '36-45', label: '36-45' },
  { value: '46-55', label: '46-55' },
  { value: '56-65', label: '56-65' },
  { value: '65+', label: '65+' },
  { value: 'Any', label: 'Any Age' }
]

// Language-dependent accents
const accentMap: Record<string, Array<{value: string, label: string}>> = {
  'English': [
    { value: 'american', label: 'American' },
    { value: 'british', label: 'British' },
    { value: 'australian', label: 'Australian' },
    { value: 'canadian', label: 'Canadian' },
    { value: 'irish', label: 'Irish' },
    { value: 'scottish', label: 'Scottish' },
    { value: 'southern', label: 'Southern' },
    { value: 'neutral', label: 'Neutral' }
  ],
  'Spanish': [
    { value: 'mexican', label: 'Mexican' },
    { value: 'spain', label: 'Spain' },
    { value: 'argentinian', label: 'Argentinian' },
    { value: 'colombian', label: 'Colombian' },
    { value: 'neutral', label: 'Neutral' }
  ],
  'French': [
    { value: 'parisian', label: 'Parisian' },
    { value: 'quebec', label: 'Quebec' },
    { value: 'belgian', label: 'Belgian' },
    { value: 'neutral', label: 'Neutral' }
  ],
  'German': [
    { value: 'standard', label: 'Standard' },
    { value: 'austrian', label: 'Austrian' },
    { value: 'swiss', label: 'Swiss' },
    { value: 'neutral', label: 'Neutral' }
  ]
}

// Computed properties
const availableAccents = computed(() => {
  return accentMap[localRequirements.value.language] || []
})

const isValid = computed(() => {
  return !!localRequirements.value.voiceType && !!localRequirements.value.language
})

const hasRequirements = computed(() => {
  return !!localRequirements.value.voiceType ||
         !!localRequirements.value.language ||
         localRequirements.value.gender !== 'any' ||
         !!localRequirements.value.ageRange ||
         !!localRequirements.value.accent
})

// Methods
const getVoiceTypeLabel = (voiceType: string) => {
  const option = voiceTypeOptions.find(vt => vt.value === voiceType)
  return option?.label || voiceType
}

const getAccentLabel = (accent: string) => {
  const accents = availableAccents.value
  const option = accents.find(acc => acc.value === accent)
  return option?.label || accent
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

// Clear accent when language changes
watch(() => localRequirements.value.language, () => {
  localRequirements.value.accent = ''
})
</script>
