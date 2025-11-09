<template>
  <div class="space-y-8">
    <div class="text-center">
      <h3 class="text-foreground mb-2 text-2xl font-semibold">
        What Kind of Voice Work Do You Love?
      </h3>
      <p class="text-muted-foreground">Select all the types of voice work you specialize in.</p>
    </div>

    <div class="mx-auto max-w-4xl">
      <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <label v-for="voiceType in voiceTypeOptions" :key="voiceType.value" class="group">
          <input
            :checked="props.profileData.voiceTypes.includes(voiceType.value)"
            :value="voiceType.value"
            type="checkbox"
            class="sr-only"
            @change="toggleVoiceType(voiceType.value)"
          />
          <div
            class="cursor-pointer rounded-xl border-2 border-gray-200 p-4 transition-all duration-200 group-has-[:checked]:border-purple-500 group-has-[:checked]:bg-purple-50 hover:border-gray-400 dark:border-gray-600 dark:group-has-[:checked]:bg-purple-900/20 dark:hover:border-gray-500"
          >
            <div class="text-center">
              <div
                :class="`h-12 w-12 bg-gray-400 group-has-[:checked]:${getVoiceTypeColor(voiceType.value)} mx-auto mb-3 flex items-center justify-center rounded-lg transition-all duration-200`"
              >
                <Icon
                  :name="voiceType.icon"
                  class="h-6 w-6 text-white grayscale transition-all duration-200 group-has-[:checked]:grayscale-0"
                />
              </div>
              <h4 class="text-foreground font-medium">
                {{ voiceType.label }}
              </h4>
            </div>
          </div>
        </label>
      </div>

      <div
        v-if="props.profileData.voiceTypes.length > 0"
        class="mt-6 rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20"
      >
        <p class="text-sm text-purple-700 dark:text-purple-300">
          <Icon name="mdi:check-circle" class="mr-1 inline h-4 w-4" />
          You've selected {{ props.profileData.voiceTypes.length }} voice type{{
            props.profileData.voiceTypes.length > 1 ? 's' : ''
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useJobType } from '@/composables/useJobType'
import Icon from '@/components/atoms/Icon.vue'

interface Props {
  profileData: {
    voiceTypes: string[]
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [data: Partial<Props['profileData']>]
}>()

const { availableJobTypes } = useJobType()

// Options - using dynamic job types from useJobType composable
const voiceTypeOptions = availableJobTypes

// Methods
const toggleVoiceType = (voiceTypeValue: string) => {
  const currentTypes = [...props.profileData.voiceTypes]
  const index = currentTypes.indexOf(voiceTypeValue)

  if (index > -1) {
    // Remove if already selected
    currentTypes.splice(index, 1)
  } else {
    // Add if not selected
    currentTypes.push(voiceTypeValue)
  }

  emit('update', { voiceTypes: currentTypes })
}

const getVoiceTypeColor = (voiceTypeValue: string) => {
  const voiceType = voiceTypeOptions.value.find((vt) => vt.value === voiceTypeValue)
  return voiceType?.color || 'bg-gray-500'
}
</script>
