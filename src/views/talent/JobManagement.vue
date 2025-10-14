<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <VoiceActNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <AppBar :show-back="true" @back="$router.back()">
        <template #title>My Jobs</template>
        <template #subtitle>View and manage your assigned voice acting jobs</template>
        <template #actions>
          <ThemeToggle />
          <Button variant="outline" size="sm" @click="refreshJobs">
            <RefreshIcon class="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </template>
      </AppBar>

      <div class="px-4 py-8 pt-24 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <!-- Stats Overview -->
          <div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Active Jobs"
              :value="activeJobsCount"
              icon="mdi:briefcase-check"
              color="blue"
            />
            <MetricCard
              title="Pending Review"
              :value="pendingReviewCount"
              icon="mdi:clock-outline"
              color="yellow"
            />
            <MetricCard
              title="Completed"
              :value="completedJobsCount"
              icon="mdi:check-circle"
              color="green"
            />
            <MetricCard
              title="Total Earnings"
              :value="`$${totalEarnings.toLocaleString()}`"
              icon="mdi:currency-usd"
              color="purple"
            />
          </div>

          <!-- Filters and Search -->
          <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
              <SearchInput
                v-model="searchQuery"
                placeholder="Search jobs..."
                class="w-full sm:w-64"
              />
              <SelectInput
                v-model="statusFilter"
                :options="statusOptions"
                placeholder="Filter by status"
                class="w-full sm:w-48"
              />
            </div>
            <ViewToggle v-model="viewMode" />
          </div>

          <!-- Jobs List -->
          <div v-if="filteredJobs.length > 0" class="space-y-4">
            <!-- Grid View -->
            <div v-if="viewMode === 'grid'" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card
                v-for="job in filteredJobs"
                :key="job.id"
                class="cursor-pointer transition-all hover:shadow-lg"
                @click="$router.push(`/talent/jobs/${job.id}`)"
              >
                <div class="p-6">
                  <div class="mb-4 flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="text-foreground mb-2 text-lg font-semibold">{{ job.title }}</h3>
                      <p class="text-muted-foreground mb-3 text-sm">{{ job.clientName }}</p>
                    </div>
                    <StatusBadge :status="getJobStatus(job.status)" />
                  </div>

                  <div class="mb-4 space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Type:</span>
                      <span class="text-foreground">{{ formatProjectType(job.projectType) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Deadline:</span>
                      <span class="text-foreground">{{ formatDate(job.deadline) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Budget:</span>
                      <span class="text-foreground font-medium text-green-600">
                        ${{ job.budget.toLocaleString() }}
                      </span>
                    </div>
                  </div>

                  <div class="mb-4">
                    <div class="mb-2 flex items-center justify-between text-sm">
                      <span class="text-muted-foreground">Progress</span>
                      <span class="text-foreground">{{ job.progress }}%</span>
                    </div>
                    <div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        class="h-2 rounded-full bg-blue-600 transition-all duration-300"
                        :style="{ width: `${job.progress}%` }"
                      ></div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <Chip
                        v-for="tag in job.tags.slice(0, 2)"
                        :key="tag"
                        size="sm"
                        variant="outline"
                      >
                        {{ tag }}
                      </Chip>
                      <span v-if="job.tags.length > 2" class="text-muted-foreground text-xs">
                        +{{ job.tags.length - 2 }} more
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRightIcon class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <!-- List View -->
            <div v-else class="bg-card border-border rounded-lg border shadow-sm">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="border-border border-b bg-muted/50">
                    <tr>
                      <th class="text-left p-4 font-medium">Job</th>
                      <th class="text-left p-4 font-medium">Client</th>
                      <th class="text-left p-4 font-medium">Status</th>
                      <th class="text-left p-4 font-medium">Deadline</th>
                      <th class="text-left p-4 font-medium">Budget</th>
                      <th class="text-left p-4 font-medium">Progress</th>
                      <th class="text-right p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="job in filteredJobs"
                      :key="job.id"
                      class="border-border border-b hover:bg-muted/25 cursor-pointer"
                      @click="$router.push(`/talent/jobs/${job.id}`)"
                    >
                      <td class="p-4">
                        <div>
                          <h4 class="text-foreground font-medium">{{ job.title }}</h4>
                          <p class="text-muted-foreground text-sm">{{ formatProjectType(job.projectType) }}</p>
                        </div>
                      </td>
                      <td class="p-4">
                        <span class="text-foreground">{{ job.clientName }}</span>
                      </td>
                      <td class="p-4">
                        <StatusBadge :status="getJobStatus(job.status)" />
                      </td>
                      <td class="p-4">
                        <span class="text-foreground">{{ formatDate(job.deadline) }}</span>
                      </td>
                      <td class="p-4">
                        <span class="text-foreground font-medium text-green-600">
                          ${{ job.budget.toLocaleString() }}
                        </span>
                      </td>
                      <td class="p-4">
                        <div class="flex items-center space-x-2">
                          <div class="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              class="h-2 rounded-full bg-blue-600"
                              :style="{ width: `${job.progress}%` }"
                            ></div>
                          </div>
                          <span class="text-muted-foreground text-sm">{{ job.progress }}%</span>
                        </div>
                      </td>
                      <td class="p-4 text-right">
                        <Button variant="ghost" size="sm">
                          <ArrowRightIcon class="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="py-12 text-center">
            <BriefcaseIcon class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 class="text-foreground mb-2 text-lg font-medium">No jobs found</h3>
            <p class="text-muted-foreground mb-6">
              {{ searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'You don\'t have any assigned jobs yet. Check out casting opportunities!' }}
            </p>
            <div class="flex justify-center space-x-4">
              <Button v-if="searchQuery || statusFilter !== 'all'" variant="outline" @click="clearFilters">
                Clear Filters
              </Button>
              <Button variant="primary" @click="$router.push('/talent/casting')">
                <MegaphoneIcon class="mr-2 h-4 w-4" />
                Browse Casting Calls
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import MetricCard from '@/components/molecules/MetricCard.vue'
import SearchInput from '@/components/atoms/SearchInput.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import ViewToggle from '@/components/molecules/ViewToggle.vue'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import Chip from '@/components/atoms/Chip.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import RefreshIcon from '~icons/mdi/refresh'
import ArrowRightIcon from '~icons/mdi/arrow-right'
import BriefcaseIcon from '~icons/mdi/briefcase'
import MegaphoneIcon from '~icons/mdi/megaphone'

// Mock data - in real app, this would come from API
const jobs = ref([
  {
    id: 'job-001',
    title: 'Product Commercial Voice Over',
    clientName: 'Acme Studios',
    projectType: 'commercial',
    status: 'in_progress',
    deadline: '2024-12-25',
    budget: 1500,
    progress: 65,
    tags: ['Commercial', 'Professional', '30s'],
    description: 'Professional voice over for product commercial',
  },
  {
    id: 'job-002',
    title: 'E-Learning Module Narration',
    clientName: 'EduTech Solutions',
    projectType: 'e_learning',
    status: 'pending_review',
    deadline: '2024-12-20',
    budget: 2200,
    progress: 100,
    tags: ['Educational', 'Narration', 'Long-form'],
    description: 'Complete narration for online course module',
  },
  {
    id: 'job-003',
    title: 'Audiobook Chapter Recording',
    clientName: 'Book Publishers Inc',
    projectType: 'audiobook',
    status: 'completed',
    deadline: '2024-12-15',
    budget: 3200,
    progress: 100,
    tags: ['Audiobook', 'Fiction', 'Character voices'],
    description: 'Chapter 5-8 recording for fantasy novel',
  },
  {
    id: 'job-004',
    title: 'Podcast Intro/Outro',
    clientName: 'Tech Talk Podcast',
    projectType: 'podcast',
    status: 'draft',
    deadline: '2024-12-30',
    budget: 800,
    progress: 25,
    tags: ['Podcast', 'Intro', 'Tech'],
    description: 'Catchy intro and outro for tech podcast',
  },
])

// State
const searchQuery = ref('')
const statusFilter = ref('all')
const viewMode = ref<'grid' | 'list'>('grid')

// Computed
const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'completed', label: 'Completed' },
]

const filteredJobs = computed(() => {
  let filtered = jobs.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.clientName.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  }

  // Filter by status
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter((job) => job.status === statusFilter.value)
  }

  return filtered
})

const activeJobsCount = computed(() => 
  jobs.value.filter((job) => ['draft', 'in_progress'].includes(job.status)).length
)

const pendingReviewCount = computed(() => 
  jobs.value.filter((job) => job.status === 'pending_review').length
)

const completedJobsCount = computed(() => 
  jobs.value.filter((job) => job.status === 'completed').length
)

const totalEarnings = computed(() => 
  jobs.value
    .filter((job) => job.status === 'completed')
    .reduce((sum, job) => sum + job.budget, 0)
)

// Methods
const getJobStatus = (status: string) => {
  switch (status) {
    case 'draft':
      return 'draft'
    case 'in_progress':
      return 'active'
    case 'pending_review':
      return 'pending'
    case 'completed':
      return 'completed'
    default:
      return 'draft'
  }
}

const formatProjectType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const refreshJobs = () => {
  // In real app, this would fetch fresh data from API
  console.log('Refreshing jobs...')
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
}

onMounted(() => {
  console.log('Talent Job Management loaded')
})
</script>
