<template>
  <div class="mx-auto max-w-3xl">
    <div class="mb-8 text-center">
      <h1 class="text-foreground mb-4 text-3xl font-bold">Step 2: Basic Information</h1>
      <p class="text-muted-foreground text-lg">
        Tell us about your {{ getVoiceTypeLabel() }} project
      </p>
    </div>

    <div class="space-y-6">
      <!-- Job Title -->
      <div>
        <label class="text-foreground mb-2 block text-sm font-medium"> Job Title * </label>
        <input
          v-model="localTitle"
          type="text"
          required
          class="border-border focus:ring-primary w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:outline-none"
          placeholder="e.g., Commercial Voice-Over for Tech Startup"
        />
        <p class="text-muted-foreground mt-1 text-sm">
          Be specific and descriptive to attract the right talent
        </p>
      </div>

      <!-- Project Description -->
      <div>
        <label class="text-foreground mb-2 block text-sm font-medium">
          Project Description *
        </label>
        <textarea
          v-model="localDescription"
          required
          rows="6"
          class="border-border focus:ring-primary w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:outline-none"
          placeholder="Describe the project, target audience, tone, style, and any specific requirements..."
        ></textarea>
        <p class="text-muted-foreground mt-1 text-sm">
          {{ localDescription.length }}/1000 characters
        </p>
      </div>

      <!-- Project Type and Priority -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label class="text-foreground mb-2 block text-sm font-medium"> Project Type * </label>
          <SelectInput
            v-model="localProjectType"
            :options="projectTypeOptions"
            placeholder="Select project type"
            required
          />
        </div>
      </div>

      <!-- Project Type Info Card -->
      <div v-if="selectedProjectType" class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-start space-x-3">
          <Icon name="mdi:information" class="text-primary mt-0.5 h-5 w-5" />
          <div>
            <h4 class="text-foreground mb-1 font-medium">
              {{ selectedProjectType.label }} Guidelines
            </h4>
            <p class="text-muted-foreground text-sm">{{ selectedProjectType.description }}</p>
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

      <Button variant="primary" size="lg" @click="handleNext" :disabled="!isValid" class="px-8">
        Continue
        <Icon name="mdi:arrow-right" class="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'

interface Props {
  title: string
  description: string
  projectType: string
  voiceType?: 'talent_only' | 'ai_synthesis' | 'hybrid_approach'
}

interface Emits {
  (e: 'update:title', value: string): void
  (e: 'update:description', value: string): void
  (e: 'update:projectType', value: string): void
  (e: 'next'): void
  (e: 'previous'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localTitle = ref(props.title)
const localDescription = ref(props.description)
const localProjectType = ref(props.projectType)

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
  { value: 'app_voice', label: 'App Voice' },
]

// Priority removed - not needed for consistent flow

// Project type descriptions
const projectTypeDescriptions = {
  commercial: {
    label: 'Commercial',
    description:
      'Short-form advertising content for TV, radio, or digital platforms. Usually 15-60 seconds with clear, engaging delivery.',
  },
  audiobook: {
    label: 'Audiobook',
    description:
      'Long-form narration of books or written content. Requires consistent pacing, character differentiation, and endurance.',
  },
  animation: {
    label: 'Animation',
    description:
      'Character voices for animated content including cartoons, anime, or animated films. Often requires character development.',
  },
  video_game: {
    label: 'Video Game',
    description:
      'Character voices, narration, or interactive dialogue for video games. May include combat sounds and emotional range.',
  },
  documentary: {
    label: 'Documentary',
    description:
      'Narration for documentary films or series. Professional, authoritative tone with clear pronunciation.',
  },
  'e-learning': {
    label: 'E-Learning',
    description:
      'Educational content narration for online courses or training materials. Clear, instructional tone.',
  },
  podcast: {
    label: 'Podcast',
    description:
      'Hosting, narration, or character work for podcast content. Conversational and engaging delivery.',
  },
  radio: {
    label: 'Radio',
    description:
      'Commercial or program content for radio broadcasting. Clear, broadcast-quality delivery.',
  },
  television: {
    label: 'Television',
    description:
      'Commercial, narration, or character work for television content. Professional broadcast standards.',
  },
  film: {
    label: 'Film',
    description:
      'Character voices, narration, or ADR for film projects. High-quality production standards.',
  },
  presentation: {
    label: 'Presentation',
    description: 'Narration for corporate presentations, training videos, or educational content.',
  },
  phone_system: {
    label: 'Phone System',
    description:
      'IVR (Interactive Voice Response) or phone system prompts. Clear, professional, and concise.',
  },
  app_voice: {
    label: 'App Voice',
    description:
      'Voice interface for mobile apps, virtual assistants, or interactive applications.',
  },
}

const selectedProjectType = computed(() => {
  return localProjectType.value
    ? projectTypeDescriptions[localProjectType.value as keyof typeof projectTypeDescriptions]
    : null
})

const isValid = computed(() => {
  return (
    localTitle.value.trim().length > 0 &&
    localDescription.value.trim().length > 0 &&
    localProjectType.value.length > 0
  )
})

const handleNext = () => {
  if (isValid.value) {
    emit('next')
  }
}

const handlePrevious = () => {
  emit('previous')
}

// Voice type label helper
const getVoiceTypeLabel = () => {
  switch (props.voiceType) {
    case 'talent_only':
      return 'talent-based voice acting'
    case 'ai_synthesis':
      return 'AI voice synthesis'
    case 'hybrid_approach':
      return 'hybrid voice'
    default:
      return 'voice acting'
  }
}

// Watch for changes and emit updates
watch(localTitle, (newValue) => emit('update:title', newValue))
watch(localDescription, (newValue) => emit('update:description', newValue))
watch(localProjectType, (newValue) => emit('update:projectType', newValue))
// Priority removed - not needed for consistent flow
</script>
