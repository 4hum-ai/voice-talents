<template>
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-4">Choose Job Type</h1>
      <p class="text-lg text-muted-foreground">
        Select the type of voice acting opportunity you want to create
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
import MegaphoneIcon from '~icons/mdi/megaphone'
import EmailIcon from '~icons/mdi/email'
import ClockIcon from '~icons/mdi/clock'
import TargetIcon from '~icons/mdi/target'

interface Props {
  jobType: 'open_casting' | 'invite_only' | 'urgent_fill' | 'targeted_search'
}

interface Emits {
  (e: 'update:jobType', value: 'open_casting' | 'invite_only' | 'urgent_fill' | 'targeted_search'): void
  (e: 'next'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localJobType = ref(props.jobType)

// Job Types with enhanced descriptions and features
const jobTypes = [
  {
    value: 'open_casting',
    label: 'Open Casting',
    description: 'Open job posting for all voice actors to apply',
    icon: MegaphoneIcon,
    features: [
      'All voice actors can apply',
      'Maximum exposure and reach',
      'Competitive selection process'
    ]
  },
  {
    value: 'invite_only',
    label: 'Invite Only',
    description: 'Send direct invitations to specific voice actors',
    icon: EmailIcon,
    features: [
      'Curated talent selection',
      'Direct invitations sent',
      'Exclusive opportunity'
    ]
  },
  {
    value: 'urgent_fill',
    label: 'Urgent Fill',
    description: 'Need to fill this position as soon as possible',
    icon: ClockIcon,
    features: [
      'Priority placement',
      'Fast-track applications',
      'Quick turnaround required'
    ]
  },
  {
    value: 'targeted_search',
    label: 'Targeted Search',
    description: 'Search for specific voice characteristics',
    icon: TargetIcon,
    features: [
      'Specific voice requirements',
      'Advanced filtering',
      'Precise talent matching'
    ]
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
