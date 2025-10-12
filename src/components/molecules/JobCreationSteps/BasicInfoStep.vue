<template>
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-4">Basic Information</h1>
      <p class="text-lg text-muted-foreground">
        Tell us about your voice acting opportunity
      </p>
    </div>

    <div class="space-y-6">
      <!-- Job Title -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2">
          Job Title *
        </label>
        <input
          v-model="localTitle"
          type="text"
          required
          class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="e.g., Commercial Voice-Over for Tech Startup"
        />
        <p class="text-sm text-muted-foreground mt-1">
          Be specific and descriptive to attract the right talent
        </p>
      </div>

      <!-- Project Description -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2">
          Project Description *
        </label>
        <textarea
          v-model="localDescription"
          required
          rows="6"
          class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Describe the project, target audience, tone, style, and any specific requirements..."
        ></textarea>
        <p class="text-sm text-muted-foreground mt-1">
          {{ localDescription.length }}/1000 characters
        </p>
      </div>

      <!-- Project Type and Priority -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">
            Project Type *
          </label>
          <SelectInput
            v-model="localProjectType"
            :options="projectTypeOptions"
            placeholder="Select project type"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-foreground mb-2">
            Priority Level
          </label>
          <SelectInput
            v-model="localPriority"
            :options="priorityOptions"
            placeholder="Select priority"
          />
        </div>
      </div>

      <!-- Project Type Info Card -->
      <div v-if="selectedProjectType" class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-start space-x-3">
          <Icon name="mdi:information" class="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 class="font-medium text-foreground mb-1">{{ selectedProjectType.label }} Guidelines</h4>
            <p class="text-sm text-muted-foreground">{{ selectedProjectType.description }}</p>
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

interface Props {
  title: string
  description: string
  projectType: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

interface Emits {
  (e: 'update:title', value: string): void
  (e: 'update:description', value: string): void
  (e: 'update:projectType', value: string): void
  (e: 'update:priority', value: 'low' | 'medium' | 'high' | 'urgent'): void
  (e: 'next'): void
  (e: 'previous'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localTitle = ref(props.title)
const localDescription = ref(props.description)
const localProjectType = ref(props.projectType)
const localPriority = ref(props.priority)

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
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' },
  { value: 'urgent', label: 'Urgent' }
]

// Project type descriptions
const projectTypeDescriptions = {
  commercial: {
    label: 'Commercial',
    description: 'Short-form advertising content for TV, radio, or digital platforms. Usually 15-60 seconds with clear, engaging delivery.'
  },
  audiobook: {
    label: 'Audiobook',
    description: 'Long-form narration of books or written content. Requires consistent pacing, character differentiation, and endurance.'
  },
  animation: {
    label: 'Animation',
    description: 'Character voices for animated content including cartoons, anime, or animated films. Often requires character development.'
  },
  video_game: {
    label: 'Video Game',
    description: 'Character voices, narration, or interactive dialogue for video games. May include combat sounds and emotional range.'
  },
  documentary: {
    label: 'Documentary',
    description: 'Narration for documentary films or series. Professional, authoritative tone with clear pronunciation.'
  },
  'e-learning': {
    label: 'E-Learning',
    description: 'Educational content narration for online courses or training materials. Clear, instructional tone.'
  },
  podcast: {
    label: 'Podcast',
    description: 'Hosting, narration, or character work for podcast content. Conversational and engaging delivery.'
  },
  radio: {
    label: 'Radio',
    description: 'Commercial or program content for radio broadcasting. Clear, broadcast-quality delivery.'
  },
  television: {
    label: 'Television',
    description: 'Commercial, narration, or character work for television content. Professional broadcast standards.'
  },
  film: {
    label: 'Film',
    description: 'Character voices, narration, or ADR for film projects. High-quality production standards.'
  },
  presentation: {
    label: 'Presentation',
    description: 'Narration for corporate presentations, training videos, or educational content.'
  },
  phone_system: {
    label: 'Phone System',
    description: 'IVR (Interactive Voice Response) or phone system prompts. Clear, professional, and concise.'
  },
  app_voice: {
    label: 'App Voice',
    description: 'Voice interface for mobile apps, virtual assistants, or interactive applications.'
  }
}

const selectedProjectType = computed(() => {
  return localProjectType.value ? projectTypeDescriptions[localProjectType.value as keyof typeof projectTypeDescriptions] : null
})

const isValid = computed(() => {
  return localTitle.value.trim().length > 0 && 
         localDescription.value.trim().length > 0 && 
         localProjectType.value.length > 0
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
watch(localTitle, (newValue) => emit('update:title', newValue))
watch(localDescription, (newValue) => emit('update:description', newValue))
watch(localProjectType, (newValue) => emit('update:projectType', newValue))
watch(localPriority, (newValue) => emit('update:priority', newValue))
</script>
