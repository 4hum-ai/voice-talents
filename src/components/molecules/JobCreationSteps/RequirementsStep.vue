<template>
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-4">Voice Requirements</h1>
      <p class="text-lg text-muted-foreground">
        Specify the voice characteristics and experience you're looking for
      </p>
    </div>

    <div class="space-y-8">
      <!-- Voice Types -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-3">
          Voice Types * (Select at least one)
        </label>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div 
            v-for="voiceType in voiceTypeOptions" 
            :key="voiceType.value"
            class="relative"
          >
            <input
              :id="voiceType.value"
              v-model="localRequirements.voiceTypes"
              type="checkbox"
              :value="voiceType.value"
              class="sr-only"
            />
            <label
              :for="voiceType.value"
              class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all"
              :class="localRequirements.voiceTypes.includes(voiceType.value)
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'"
            >
              <Icon :name="voiceType.icon" class="h-4 w-4 mr-2" />
              <span class="text-sm font-medium">{{ voiceType.label }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Languages -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-3">
          Languages
        </label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div 
            v-for="language in languageOptions" 
            :key="language.value"
            class="relative"
          >
            <input
              :id="language.value"
              v-model="localRequirements.languages"
              type="checkbox"
              :value="language.value"
              class="sr-only"
            />
            <label
              :for="language.value"
              class="flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all"
              :class="localRequirements.languages.includes(language.value)
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'"
            >
              <span class="text-sm font-medium">{{ language.label }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Demographics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <input
            v-model="localRequirements.ageRange"
            type="text"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., 25-35, 18-25"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-foreground mb-2">
            Experience Level
          </label>
          <SelectInput
            v-model="localRequirements.experience"
            :options="experienceOptions"
            placeholder="Select experience"
          />
        </div>
      </div>

      <!-- Accents -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-3">
          Accents (Optional)
        </label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div 
            v-for="accent in accentOptions" 
            :key="accent.value"
            class="relative"
          >
            <input
              :id="accent.value"
              v-model="localRequirements.accents"
              type="checkbox"
              :value="accent.value"
              class="sr-only"
            />
            <label
              :for="accent.value"
              class="flex items-center justify-center p-2 border-2 rounded-lg cursor-pointer transition-all"
              :class="localRequirements.accents.includes(accent.value)
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
          <div v-if="localRequirements.voiceTypes.length > 0">
            <strong>Voice Types:</strong> {{ localRequirements.voiceTypes.join(', ') }}
          </div>
          <div v-if="localRequirements.languages.length > 0">
            <strong>Languages:</strong> {{ localRequirements.languages.join(', ') }}
          </div>
          <div v-if="localRequirements.gender !== 'any'">
            <strong>Gender:</strong> {{ localRequirements.gender }}
          </div>
          <div v-if="localRequirements.ageRange">
            <strong>Age Range:</strong> {{ localRequirements.ageRange }}
          </div>
          <div v-if="localRequirements.experience !== 'beginner'">
            <strong>Experience:</strong> {{ localRequirements.experience }}
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
  languages: string[]
  accents: string[]
  voiceTypes: VoiceType[]
  ageRange: string
  gender: 'male' | 'female' | 'non-binary' | 'any'
  experience: 'beginner' | 'intermediate' | 'advanced' | 'professional'
  specialInstructions: string
  quality: 'standard' | 'professional' | 'broadcast'
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

const experienceOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'professional', label: 'Professional' }
]

const accentOptions = [
  { value: 'american', label: 'American' },
  { value: 'british', label: 'British' },
  { value: 'australian', label: 'Australian' },
  { value: 'canadian', label: 'Canadian' },
  { value: 'irish', label: 'Irish' },
  { value: 'scottish', label: 'Scottish' },
  { value: 'southern', label: 'Southern' },
  { value: 'neutral', label: 'Neutral' }
]

const isValid = computed(() => {
  return localRequirements.value.voiceTypes.length > 0
})

const hasRequirements = computed(() => {
  return localRequirements.value.voiceTypes.length > 0 ||
         localRequirements.value.languages.length > 0 ||
         localRequirements.value.gender !== 'any' ||
         localRequirements.value.ageRange ||
         localRequirements.value.experience !== 'beginner'
})

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
</script>
