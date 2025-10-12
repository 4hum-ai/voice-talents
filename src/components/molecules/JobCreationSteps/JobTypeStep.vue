<template>
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-4">Choose Voice Solution</h1>
      <p class="text-lg text-muted-foreground">
        Select how you want to create your voice content
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div 
        v-for="type in jobTypes" 
        :key="type.value"
        class="relative group"
      >
        <input
          :id="type.value"
          v-model="localJobType"
          type="radio"
          :value="type.value"
          class="sr-only"
        />
        <label
          :for="type.value"
          class="flex flex-col p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg"
          :class="localJobType === type.value 
            ? 'border-primary bg-primary/5 shadow-md' 
            : 'border-border hover:border-primary/50'"
        >
          <div class="flex items-center space-x-4 mb-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center"
                 :class="localJobType === type.value 
                   ? 'bg-primary text-white' 
                   : 'bg-muted text-muted-foreground'">
              <component :is="type.icon" class="h-6 w-6" />
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-foreground">{{ type.label }}</h3>
              <p class="text-sm text-muted-foreground">{{ type.description }}</p>
            </div>
          </div>
          
          <div class="space-y-2 text-sm text-muted-foreground">
            <div class="flex items-center space-x-2">
              <Icon name="mdi:check-circle" class="h-4 w-4 text-green-500" />
              <span>{{ type.features[0] }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <Icon name="mdi:check-circle" class="h-4 w-4 text-green-500" />
              <span>{{ type.features[1] }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <Icon name="mdi:check-circle" class="h-4 w-4 text-green-500" />
              <span>{{ type.features[2] }}</span>
            </div>
          </div>
          
          <!-- Pricing Info -->
          <div v-if="type.pricing" class="mt-4 pt-4 border-t border-border">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-foreground">Starting from:</span>
              <span class="text-lg font-bold text-primary">{{ type.pricing }}</span>
            </div>
          </div>
        </label>
      </div>
    </div>

    <div class="flex justify-center mt-8">
      <Button 
        variant="primary" 
        size="lg" 
        @click="handleNext"
        :disabled="!localJobType"
        class="px-8"
      >
        Continue
        <Icon name="mdi:arrow-right" class="h-4 w-4 ml-2" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import AccountIcon from '~icons/mdi/account'
import RobotIcon from '~icons/mdi/robot'
import AccountGroupIcon from '~icons/mdi/account-group'

interface Props {
  jobType: 'talent_only' | 'ai_synthesis' | 'hybrid_approach'
}

interface Emits {
  (e: 'update:jobType', value: 'talent_only' | 'ai_synthesis' | 'hybrid_approach'): void
  (e: 'next'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localJobType = ref(props.jobType)

// Voice Solution Types with enhanced descriptions and features
const jobTypes = [
  {
    value: 'talent_only',
    label: 'Talent Only',
    description: 'Hire professional voice actors for authentic human voice',
    icon: AccountIcon,
    features: [
      'Authentic human voice',
      'Professional voice actors',
      'Full creative control'
    ],
    pricing: '$50-500'
  },
  {
    value: 'ai_synthesis',
    label: 'AI Voice Synthesis',
    description: 'Generate voice using licensed AI voice models',
    icon: RobotIcon,
    features: [
      'Instant voice generation',
      'Licensed voice models',
      '24/7 availability'
    ],
    pricing: '$25-150'
  },
  {
    value: 'hybrid_approach',
    label: 'Hybrid Approach',
    description: 'AI-generated base with talent refinement',
    icon: AccountGroupIcon,
    features: [
      'AI efficiency + human touch',
      'Faster turnaround',
      'Cost-effective solution'
    ],
    pricing: '$35-200'
  }
]

const handleNext = () => {
  if (localJobType.value) {
    emit('next')
  }
}

// Watch for changes and emit updates
watch(localJobType, (newValue) => {
  emit('update:jobType', newValue)
})
</script>
