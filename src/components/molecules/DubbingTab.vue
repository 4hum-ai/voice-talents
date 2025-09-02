<template>
  <div class="space-y-4">
    <!-- Workflow Overview -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <MetricCard
        title="Total Workflows"
        :value="workflows.length"
        icon="mdi:workflow"
        icon-variant="primary"
      />
      <MetricCard
        title="In Progress"
        :value="inProgressCount"
        icon="mdi:play-circle"
        icon-variant="warning"
      />
      <MetricCard
        title="Completed"
        :value="completedCount"
        icon="mdi:check-circle"
        icon-variant="success"
      />
    </div>

    <!-- Language-based Workflow Groups -->
    <div v-if="workflows.length > 0" class="space-y-4">
      <div
        v-for="language in dubbingLanguages"
        :key="language"
        class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
      >
        <div class="mb-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <LanguageDisplay :value="language" :show-flag="true" />
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ getWorkflowsForLanguage(language).length }} workflows
            </span>
          </div>
          <ProgressIndicator
            :value="getLanguageProgress(language)"
            :max="100"
            size="sm"
            show-label
            label-format="percentage"
          />
        </div>

        <!-- Workflow List -->
        <div class="space-y-2">
          <div
            v-for="workflow in getWorkflowsForLanguage(language)"
            :key="workflow.id"
            class="flex items-center justify-between rounded border bg-white p-3 dark:border-gray-600 dark:bg-gray-700"
          >
            <div class="flex items-center gap-3">
              <StatusDot :status="workflow.status" />
              <div>
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ workflow.name }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Episode {{ workflow.episodeNumber }}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <ProgressIndicator
                :value="workflow.progress"
                :max="100"
                size="sm"
                show-label
                label-format="percentage"
              />
              <button
                class="text-primary-600 hover:text-primary-500 text-sm font-medium"
                @click="openWorkflow(workflow)"
              >
                Open
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="py-8 text-center">
      <div class="text-gray-500 dark:text-gray-400">
        <svg class="mx-auto mb-4 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
          No dubbing workflows yet
        </h3>
        <p class="mb-4 text-gray-500 dark:text-gray-400">
          Start creating dubbing workflows for this title.
        </p>
        <button
          class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
          @click="createWorkflow"
        >
          Create Workflow
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApiGateway } from '@/utils/useApiGateway'
import MetricCard from '@/components/molecules/MetricCard.vue'
import ProgressIndicator from '@/components/molecules/ProgressIndicator.vue'
import LanguageDisplay from '@/components/atoms/LanguageDisplay.vue'
import StatusDot from '@/components/atoms/StatusDot.vue'

interface Workflow {
  id: string
  name: string
  status: string
  progress: number
  episodeNumber: number
  language: string
}

interface Props {
  titleId: string
}

const props = defineProps<Props>()
const router = useRouter()
const api = useApiGateway()

const workflows = ref<Workflow[]>([])
const dubbingLanguages = ref<string[]>([])
const loading = ref(true)

// Computed properties
const inProgressCount = computed(
  () => workflows.value.filter((w) => w.status === 'processing').length,
)

const completedCount = computed(
  () => workflows.value.filter((w) => w.status === 'completed').length,
)

// Methods
const loadWorkflows = async () => {
  try {
    loading.value = true
    // This would be a real API call
    const response = await api.get(`/titles/${props.titleId}/workflows`)
    const data = await response.json()
    workflows.value = data || []

    // Extract unique languages
    const languages = new Set(workflows.value.map((w) => w.language))
    dubbingLanguages.value = Array.from(languages)
  } catch (err) {
    console.error('Error loading workflows:', err)
    // Fallback to mock data for development
    workflows.value = [
      {
        id: '1',
        name: 'Episode 1 Dubbing',
        status: 'processing',
        progress: 75,
        episodeNumber: 1,
        language: 'en',
      },
      {
        id: '2',
        name: 'Episode 1 Dubbing',
        status: 'completed',
        progress: 100,
        episodeNumber: 1,
        language: 'es',
      },
      {
        id: '3',
        name: 'Episode 2 Dubbing',
        status: 'queued',
        progress: 0,
        episodeNumber: 2,
        language: 'en',
      },
    ]
    dubbingLanguages.value = ['en', 'es']
  } finally {
    loading.value = false
  }
}

const getWorkflowsForLanguage = (language: string) => {
  return workflows.value.filter((w) => w.language === language)
}

const getLanguageProgress = (language: string) => {
  const languageWorkflows = getWorkflowsForLanguage(language)
  if (languageWorkflows.length === 0) return 0

  const totalProgress = languageWorkflows.reduce((sum, w) => sum + w.progress, 0)
  return Math.round(totalProgress / languageWorkflows.length)
}

const openWorkflow = (workflow: Workflow) => {
  router.push(`/titles/${props.titleId}/dubbing/${workflow.language}?workflow=${workflow.id}`)
}

const createWorkflow = () => {
  router.push(`/titles/${props.titleId}/workflows/create`)
}

// Lifecycle
onMounted(() => {
  loadWorkflows()
})
</script>
