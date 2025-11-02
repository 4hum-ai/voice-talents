<template>
  <div class="space-y-8">
    <div class="text-center">
      <div
        class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600"
      >
        <Icon name="mdi:briefcase" class="h-8 w-8 text-white" />
      </div>
      <h2 class="text-foreground mb-2 text-2xl font-bold">What Types of Voice Work Do You Need?</h2>
      <p class="text-muted-foreground">
        Select the types of voice projects you typically create. This helps us match you with the
        right voice talents for your needs.
      </p>
    </div>

    <div class="mx-auto max-w-4xl">
      <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <label
          v-for="projectType in projectTypeOptions"
          :key="projectType.value"
          class="group cursor-pointer"
        >
          <input
            :checked="localProjectTypes.includes(projectType.value)"
            :value="projectType.value"
            type="checkbox"
            class="sr-only"
            @change="toggleProjectType(projectType.value)"
          />
          <div
            class="rounded-xl border-2 border-gray-200 p-4 transition-all duration-200 group-has-[:checked]:border-blue-500 group-has-[:checked]:bg-blue-50 hover:border-gray-400 dark:border-gray-600 dark:group-has-[:checked]:bg-blue-900/20 dark:hover:border-gray-500"
          >
            <div class="text-center">
              <div
                :class="`h-12 w-12 bg-gray-400 group-has-[:checked]:${getProjectTypeColor(
                  projectType.value,
                )} mx-auto mb-3 flex items-center justify-center rounded-lg transition-all duration-200`"
              >
                <Icon
                  :name="projectType.icon"
                  class="h-6 w-6 text-white grayscale transition-all duration-200 group-has-[:checked]:grayscale-0"
                />
              </div>
              <h4 class="text-foreground font-medium">
                {{ projectType.label }}
              </h4>
            </div>
          </div>
        </label>
      </div>

      <div
        v-if="localProjectTypes.length > 0"
        class="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20"
      >
        <p class="text-sm text-blue-700 dark:text-blue-300">
          <Icon name="mdi:check-circle" class="mr-1 inline h-4 w-4" />
          You've selected {{ localProjectTypes.length }} project type{{
            localProjectTypes.length > 1 ? 's' : ''
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useJobType } from '@/composables/useJobType'
import Icon from '@/components/atoms/Icon.vue'

interface Props {
  modelValue?: string[]
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
  (e: 'validation-change', isValid: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { availableJobTypes } = useJobType()

// Local state for project types
const localProjectTypes = ref<string[]>(props.modelValue || [])

// Options - using dynamic job types from useJobType composable
const projectTypeOptions = availableJobTypes

// Validation - at least one project type must be selected
const isValid = computed(() => localProjectTypes.value.length > 0)

// Watch for changes and emit updates
watch(
  localProjectTypes,
  (newTypes) => {
    emit('update:modelValue', newTypes)
    emit('validation-change', isValid.value)
  },
  { deep: true },
)

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      localProjectTypes.value = [...newValue]
    }
  },
)

// Methods
const toggleProjectType = (projectTypeValue: string) => {
  const index = localProjectTypes.value.indexOf(projectTypeValue)

  if (index > -1) {
    // Remove if already selected
    localProjectTypes.value.splice(index, 1)
  } else {
    // Add if not selected
    localProjectTypes.value.push(projectTypeValue)
  }
}

const getProjectTypeColor = (projectTypeValue: string) => {
  const projectType = projectTypeOptions.value.find((pt) => pt.value === projectTypeValue)
  return projectType?.color || 'bg-blue-500'
}

// Emit initial validation state
emit('validation-change', isValid.value)
</script>
