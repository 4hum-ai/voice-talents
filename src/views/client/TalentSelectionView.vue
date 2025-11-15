<template>
  <div>
    <div class="mx-auto max-w-6xl">
      <!-- Job Overview -->
      <div class="border-border bg-card mb-8 rounded-lg border p-6">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h1 class="text-foreground mb-2 text-2xl font-bold">{{ jobTitle }}</h1>
            <p class="text-muted-foreground mb-4">{{ jobDescription }}</p>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <span class="text-muted-foreground text-sm">Budget:</span>
                <p class="text-foreground font-medium">
                  {{
                    formatBudget(
                      jobBudget
                        ? { max: jobBudget.max, currency: jobBudget.currency }
                        : { max: 0, currency: 'USD' },
                    )
                  }}
                </p>
              </div>
              <div>
                <span class="text-muted-foreground text-sm">Deadline:</span>
                <p class="text-foreground font-medium">{{ formatDeadline(jobDeadline || '') }}</p>
              </div>
              <div>
                <span class="text-muted-foreground text-sm">Applications:</span>
                <p class="text-foreground font-medium">{{ applications.length }} received</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Applications List -->
      <div v-if="applications.length === 0" class="py-12 text-center">
        <UsersIcon class="text-muted-foreground mx-auto mb-4 h-16 w-16" />
        <h3 class="text-foreground mb-2 text-lg font-medium">No Applications Yet</h3>
        <p class="text-muted-foreground">
          No voice actors have applied to this job yet. Check back later or consider extending the
          deadline.
        </p>
      </div>

      <div v-else class="space-y-6">
        <!-- Sorting and Filtering -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <label class="text-muted-foreground text-sm">Sort by:</label>
              <select
                v-model="sortBy"
                class="border-border bg-background rounded-md border px-3 py-1 text-sm"
              >
                <option value="date">Application Date</option>
                <option value="rate">Proposed Cost</option>
                <option value="rating">Talent Rating</option>
                <option value="timeline">Timeline</option>
              </select>
            </div>
            <div class="flex items-center space-x-2">
              <label class="text-muted-foreground text-sm">Order:</label>
              <Button
                variant="ghost"
                size="sm"
                :icon="sortOrder === 'asc' ? 'mdi:arrow-up' : 'mdi:arrow-down'"
                @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
              >
                {{ sortOrder === 'asc' ? 'Ascending' : 'Descending' }}
              </Button>
            </div>
          </div>
          <div class="text-muted-foreground text-sm">
            Showing {{ sortedApplications.length }} of {{ applications.length }} applications
          </div>
        </div>

        <!-- Application Cards -->
        <div class="grid gap-6 lg:grid-cols-2">
          <div
            v-for="application in sortedApplications"
            :key="application.id"
            class="border-border bg-card hover:border-primary/20 group rounded-lg border p-6 transition-all duration-200 hover:shadow-lg"
          >
            <!-- Application Header -->
            <div class="mb-4 flex items-start justify-between">
              <div class="flex items-center space-x-4">
                <Avatar
                  :seed="application.voiceTalentName"
                  :src="getTalentAvatar(application.voiceTalentId)"
                  :alt="application.voiceTalentName"
                  size="md"
                />
                <div>
                  <h3 class="text-foreground text-lg font-semibold">
                    {{ application.voiceTalentName }}
                  </h3>
                  <p class="text-muted-foreground text-sm">
                    {{ getTalentLocation(application.voiceTalentId) }}
                  </p>
                  <div class="mt-1 flex items-center space-x-2">
                    <div class="flex items-center space-x-1">
                      <StarIcon class="h-4 w-4 text-yellow-500" />
                      <span class="text-foreground text-sm font-medium">{{
                        getTalentRating(application.voiceTalentId)
                      }}</span>
                    </div>
                    <span class="text-muted-foreground text-sm">•</span>
                    <span class="text-muted-foreground text-sm">{{
                      getTalentExperience(application.voiceTalentId)
                    }}</span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-foreground text-lg font-bold">
                  {{
                    formatBudget({
                      max: application.proposedCost,
                      currency: application.proposedCurrency,
                    })
                  }}
                </div>
                <div class="text-muted-foreground text-sm">
                  {{ application.proposedTimeline }}
                </div>
              </div>
            </div>

            <!-- Application Details -->
            <div class="mb-4 space-y-3">
              <div>
                <h4 class="text-foreground mb-2 font-medium">Personal Note</h4>
                <p class="text-muted-foreground line-clamp-3 text-sm">
                  {{ application.personalNote }}
                </p>
              </div>
              <div v-if="application.customSamples?.length">
                <h4 class="text-foreground mb-2 font-medium">Showcases</h4>
                <div class="space-y-3">
                  <div
                    v-for="sample in application.customSamples"
                    :key="sample.id"
                    class="border-border rounded-md border p-3"
                  >
                    <div class="text-foreground mb-1 text-sm font-medium">{{ sample.title }}</div>
                    <div class="text-muted-foreground mb-2 text-xs">{{ sample.description }}</div>
                    <audio :src="sample.audioUrl" controls class="w-full" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                icon="mdi:eye"
                @click="viewApplication(application.id)"
                class="flex-1"
              >
                View Full Application
              </Button>
              <Button
                variant="primary"
                size="sm"
                :disabled="isTalentSelected(application.voiceTalentId)"
                icon="mdi:check"
                @click="selectTalent(application)"
                class="flex-1"
              >
                {{ isTalentSelected(application.voiceTalentId) ? 'Selected' : 'Select Talent' }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Application Detail Sidebar (slide-over from right) -->
    <Transition name="sidebar">
      <div v-if="showApplicationDetail" class="fixed inset-0 z-50 flex overflow-hidden">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50" @click="showApplicationDetail = false" />

        <!-- Sidebar Panel -->
        <div
          class="bg-background border-border relative ml-auto flex h-full w-full flex-col border-l shadow-xl sm:w-[600px] lg:w-[700px]"
        >
          <!-- Header -->
          <div
            class="border-border flex flex-shrink-0 items-center justify-between border-b p-4 sm:p-6"
          >
            <div class="min-w-0 flex-1">
              <h3 class="text-foreground text-lg font-semibold sm:text-xl">Application Details</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon="mdi:close"
              @click="showApplicationDetail = false"
              class="ml-4 flex-shrink-0"
            />
          </div>

          <!-- Content with Tabs -->
          <div v-if="selectedApplication" class="flex flex-1 flex-col overflow-hidden">
            <TabNavigation
              v-model="activeTab"
              variant="underline"
              size="md"
              class="border-border flex-shrink-0 border-b px-4 sm:px-6"
            >
              <!-- Tab Content Container with Scroll -->
              <div class="flex-1 overflow-y-auto">
                <!-- Overview Tab -->
                <Tab id="overview" label="Overview">
                  <div class="space-y-6 p-4 sm:p-6">
                    <!-- Talent Info -->
                    <div class="flex items-center space-x-4">
                      <Avatar
                        :seed="selectedApplication.voiceTalentName"
                        :src="getTalentAvatar(selectedApplication.voiceTalentId)"
                        :alt="selectedApplication.voiceTalentName"
                        size="lg"
                      />
                      <div>
                        <h3 class="text-foreground text-xl font-semibold">
                          {{ selectedApplication.voiceTalentName }}
                        </h3>
                        <p class="text-muted-foreground">
                          {{ getTalentLocation(selectedApplication.voiceTalentId) }}
                        </p>
                        <div class="mt-2 flex items-center space-x-4">
                          <div class="flex items-center space-x-1">
                            <StarIcon class="h-4 w-4 text-yellow-500" />
                            <span class="text-foreground font-medium">{{
                              getTalentRating(selectedApplication.voiceTalentId)
                            }}</span>
                          </div>
                          <span class="text-muted-foreground">•</span>
                          <span class="text-muted-foreground">{{
                            getTalentExperience(selectedApplication.voiceTalentId)
                          }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Voice Quality Description -->
                    <div>
                      <h4 class="text-foreground mb-2 font-medium">Voice Quality Description</h4>
                      <p class="text-muted-foreground">
                        {{ getVoiceQualityDescription(selectedApplication.voiceTalentId) }}
                      </p>
                    </div>

                    <!-- Portfolio Sample Voices -->
                    <div
                      v-if="
                        getPortfolioSamples((selectedApplication as any).portfolioSampleIds || [])
                          .length > 0
                      "
                    >
                      <h4 class="text-foreground mb-3 font-medium">Portfolio Sample Voices</h4>
                      <div class="space-y-3">
                        <div
                          v-for="sample in getPortfolioSamples(
                            (selectedApplication as any).portfolioSampleIds || [],
                          )"
                          :key="sample.id"
                          class="border-border rounded-md border p-3"
                        >
                          <div class="mb-2">
                            <div class="text-foreground mb-1 text-sm font-medium">
                              {{ sample.title }}
                            </div>
                            <div class="text-muted-foreground mb-2 text-xs">
                              {{ sample.description }}
                            </div>
                            <div class="text-muted-foreground flex items-center space-x-2 text-xs">
                              <span>{{ sample.voiceType }}</span>
                              <span>•</span>
                              <span>{{ sample.tone }}</span>
                              <span v-if="sample.accent">•</span>
                              <span v-if="sample.accent">{{ sample.accent }}</span>
                            </div>
                          </div>
                          <audio :src="sample.audioUrl" controls class="w-full" />
                        </div>
                      </div>
                    </div>

                    <!-- Custom Samples (Showcases) -->
                    <div v-if="selectedApplication.customSamples?.length">
                      <h4 class="text-foreground mb-3 font-medium">Custom Samples</h4>
                      <div class="space-y-3">
                        <div
                          v-for="sample in selectedApplication.customSamples"
                          :key="sample.id"
                          class="border-border rounded-md border p-3"
                        >
                          <div class="text-foreground mb-1 text-sm font-medium">
                            {{ sample.title }}
                          </div>
                          <div class="text-muted-foreground mb-2 text-xs">
                            {{ sample.description }}
                          </div>
                          <audio :src="sample.audioUrl" controls class="w-full" />
                        </div>
                      </div>
                    </div>

                    <!-- Proposal Details -->
                    <div class="border-border rounded-md border p-4">
                      <h4 class="text-foreground mb-3 font-medium">Proposal Details</h4>
                      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <h5 class="text-muted-foreground mb-1 text-xs">Proposed Cost</h5>
                          <p class="text-foreground text-lg font-semibold">
                            {{
                              formatBudget({
                                max: selectedApplication.proposedCost,
                                currency: selectedApplication.proposedCurrency,
                              })
                            }}
                          </p>
                        </div>
                        <div>
                          <h5 class="text-muted-foreground mb-1 text-xs">Timeline</h5>
                          <p class="text-foreground">{{ selectedApplication.proposedTimeline }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Personal Note -->
                    <div>
                      <h4 class="text-foreground mb-2 font-medium">Personal Note</h4>
                      <p class="text-muted-foreground whitespace-pre-wrap">
                        {{ selectedApplication.personalNote }}
                      </p>
                    </div>
                  </div>
                </Tab>

                <!-- Reviews Tab -->
                <Tab
                  id="reviews"
                  label="Reviews"
                  :badge="getRatingDistribution(selectedApplication.voiceTalentId).totalRatings"
                >
                  <div class="space-y-6 p-4 sm:p-6">
                    <!-- Rating Distribution -->
                    <div>
                      <h4 class="text-foreground mb-3 font-medium">Rating Distribution</h4>
                      <div class="space-y-2">
                        <div
                          v-for="star in [5, 4, 3, 2, 1]"
                          :key="star"
                          class="flex items-center space-x-3"
                        >
                          <div class="flex w-16 items-center space-x-1">
                            <span class="text-foreground text-sm">{{ star }}</span>
                            <StarIcon class="h-4 w-4 text-yellow-500" />
                          </div>
                          <div class="flex-1">
                            <div class="h-2 overflow-hidden rounded-full bg-gray-200">
                              <div
                                class="h-full rounded-full bg-yellow-500"
                                :style="{
                                  width: `${
                                    (getRatingDistribution(selectedApplication.voiceTalentId)
                                      .distribution[star as 1 | 2 | 3 | 4 | 5] /
                                      getRatingDistribution(selectedApplication.voiceTalentId)
                                        .totalRatings) *
                                    100
                                  }%`,
                                }"
                              />
                            </div>
                          </div>
                          <div class="text-muted-foreground w-12 text-right text-sm">
                            {{
                              getRatingDistribution(selectedApplication.voiceTalentId).distribution[
                                star as 1 | 2 | 3 | 4 | 5
                              ]
                            }}
                          </div>
                        </div>
                      </div>
                      <p class="text-muted-foreground mt-2 text-xs">
                        Based on
                        {{ getRatingDistribution(selectedApplication.voiceTalentId).totalRatings }}
                        total ratings
                      </p>
                    </div>

                    <!-- Written Feedbacks -->
                    <div v-if="getTalentFeedbacks(selectedApplication.voiceTalentId).length > 0">
                      <h4 class="text-foreground mb-3 font-medium">Client Feedback</h4>
                      <div class="space-y-4">
                        <div
                          v-for="feedback in getTalentFeedbacks(selectedApplication.voiceTalentId)"
                          :key="feedback.id"
                          class="border-border rounded-md border p-4"
                        >
                          <div class="mb-2 flex items-start justify-between">
                            <div>
                              <div class="text-foreground font-medium">
                                {{ feedback.fromClient }}
                              </div>
                              <div class="text-muted-foreground text-sm">
                                {{ feedback.jobTitle }}
                              </div>
                            </div>
                            <div class="flex items-center space-x-1">
                              <StarIcon class="h-4 w-4 text-yellow-500" />
                              <span class="text-foreground text-sm font-medium">{{
                                feedback.rating
                              }}</span>
                            </div>
                          </div>
                          <p class="text-muted-foreground text-sm">{{ feedback.feedback }}</p>
                          <div class="text-muted-foreground mt-2 text-xs">{{ feedback.date }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab>
              </div>
            </TabNavigation>
          </div>

          <!-- Footer Actions -->
          <div
            class="border-border flex flex-shrink-0 items-center justify-end space-x-3 border-t p-4 sm:p-6"
          >
            <Button variant="outline" @click="showApplicationDetail = false">Close</Button>
            <Button
              v-if="selectedApplication"
              variant="primary"
              :disabled="isTalentSelected(selectedApplication.voiceTalentId)"
              icon="mdi:check"
              @click="selectTalent(selectedApplication as any)"
            >
              Select This Talent
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/atoms/Button.vue'
import Avatar from '@/components/atoms/Avatar.vue'
import TabNavigation from '@/components/molecules/TabNavigation.vue'
import Tab from '@/components/molecules/Tab.vue'
// Using lightweight in-view modal; no external dialog imports
import { useJob, type Job } from '@/composables/useJob'
import { useJobApplication } from '@/composables/useJobApplication'
import type { Application } from '@/types/job-application'
import { useToast } from '@/lib/toast'
import { mockVoiceTalents, mockVoiceSamples } from '@/data/mock-voice-talent-data'
import type { VoiceSample } from '@/types/voice-talent'
// Close icon removed; using Button icon prop instead
import UsersIcon from '~icons/mdi/account-group'
import StarIcon from '~icons/mdi/star'
// Icons removed; using Button icon prop instead
// Arrow icons removed; using Button icon prop instead
// using common Application type for review

const route = useRoute()
const router = useRouter()
const { getJob } = useJob()
const { getApplicationsByJobId, sortApplications } = useJobApplication()
const { addToast: showToast } = useToast()

// State
const job = ref<Job | null>(null)
const applications = ref<Application[]>([])
const selectedApplication = ref<Application | null>(null)
const showApplicationDetail = ref(false)
const activeTab = ref('overview')
const sortBy = ref<'date' | 'rate' | 'rating' | 'timeline'>('date')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Computed
const jobTitle = computed(() => job.value?.title || 'Untitled Job')
const jobDescription = computed(() => job.value?.description || '')
const jobBudget = computed(() => job.value?.budget)
const jobDeadline = computed(() => job.value?.deadline)

const sortedApplications = computed(() =>
  sortApplications(
    applications.value,
    sortBy.value === 'rate' ? 'cost' : (sortBy.value as 'date' | 'rating' | 'timeline'),
    sortOrder.value,
  ),
)

// Methods
const getTalentAvatar = (talentId: string) => {
  const talent = mockVoiceTalents.find((va) => va.id === talentId)
  return talent?.avatarUrl || ''
}

const getTalentLocation = (talentId: string) => {
  const talent = mockVoiceTalents.find((va) => va.id === talentId)
  return talent?.location || 'Location not specified'
}

const getTalentRating = (talentId: string) => {
  const talent = mockVoiceTalents.find((va) => va.id === talentId)
  return talent?.averageRating || 0
}

const getTalentExperience = (talentId: string) => {
  const talent = mockVoiceTalents.find((va) => va.id === talentId)
  return talent?.experience || 'Unknown'
}

const getPortfolioSamples = (sampleIds: string[]): VoiceSample[] => {
  if (!sampleIds || sampleIds.length === 0) return []
  return mockVoiceSamples.filter((sample) => sampleIds.includes(sample.id))
}

// Mock rating distribution data - in real app, this would come from API
const getRatingDistribution = (talentId: string) => {
  const talent = mockVoiceTalents.find((va) => va.id === talentId)
  const avgRating = talent?.averageRating || 0
  // Generate realistic distribution based on average rating
  const totalRatings = 42 // Mock total rating count
  const distribution = {
    5: Math.round(
      (avgRating >= 4.5 ? 0.6 : avgRating >= 4.0 ? 0.5 : avgRating >= 3.5 ? 0.4 : 0.3) *
        totalRatings,
    ),
    4: Math.round(
      (avgRating >= 4.5 ? 0.3 : avgRating >= 4.0 ? 0.35 : avgRating >= 3.5 ? 0.35 : 0.3) *
        totalRatings,
    ),
    3: Math.round(
      (avgRating >= 4.5 ? 0.08 : avgRating >= 4.0 ? 0.12 : avgRating >= 3.5 ? 0.2 : 0.25) *
        totalRatings,
    ),
    2: Math.round(
      (avgRating >= 4.5 ? 0.02 : avgRating >= 4.0 ? 0.03 : avgRating >= 3.5 ? 0.05 : 0.1) *
        totalRatings,
    ),
    1: Math.round(
      (avgRating >= 4.5 ? 0 : avgRating >= 4.0 ? 0 : avgRating >= 3.5 ? 0 : 0.05) * totalRatings,
    ),
  }
  return { distribution, totalRatings }
}

// Mock feedback data - in real app, this would come from AssignmentFeedback or Rating API
const getTalentFeedbacks = (talentId: string) => {
  const talent = mockVoiceTalents.find((va) => va.id === talentId)
  if (!talent) return []

  const talentName = talent.displayName
  const firstName = talentName.split(' ')[0]

  // Generate mock feedbacks based on talent's average rating
  const feedbacks = [
    {
      id: 'feedback-1',
      fromClient: 'TechFlow Inc.',
      rating: 5,
      feedback: `Excellent work! ${talentName} delivered high-quality recordings that exceeded our expectations. ${firstName === 'Sarah' ? 'Her' : firstName === 'Marcus' ? 'His' : 'Their'} warm, professional voice was perfect for our brand.`,
      date: '2024-01-10',
      jobTitle: 'Tech Startup Commercial Series',
    },
    {
      id: 'feedback-2',
      fromClient: 'EduTech Solutions',
      rating: 4,
      feedback: `Great narration quality. ${talentName}'s clear delivery kept learners engaged throughout the entire module. Would definitely work with again.`,
      date: '2023-12-15',
      jobTitle: 'E-Learning Module',
    },
    {
      id: 'feedback-3',
      fromClient: 'Creative Studios',
      rating: 5,
      feedback: `Outstanding character voices and versatility. ${talentName} brought our characters to life with authentic emotion and consistency.`,
      date: '2023-11-20',
      jobTitle: 'Animation Project',
    },
  ]

  // Adjust feedbacks based on actual rating
  if (talent.averageRating < 4.5) {
    feedbacks[0].rating = 4
    feedbacks[0].feedback = `Good quality work. Professional delivery and met all project requirements.`
  }

  return feedbacks
}

const getVoiceQualityDescription = (talentId: string) => {
  const talent = mockVoiceTalents.find((va) => va.id === talentId)
  if (!talent) return ''

  // Build description from bio and skills
  const skills = talent.skills.join(', ')
  const bio = talent.bio
  const voiceTypes = talent.voiceTypes.join(', ')

  return `${bio} Specializes in ${skills}. Experienced in ${voiceTypes} voice work.`
}

const formatBudget = (budget: { max: number; currency: string }) => {
  if (!budget || !budget.max) return 'Not set'
  const symbol = getCurrencySymbol(budget.currency)
  return `${symbol}${budget.max.toLocaleString()}`
}

const formatDeadline = (deadline: string) => {
  if (!deadline) return 'Not set'
  const date = new Date(deadline)
  return date.toLocaleDateString()
}

const getCurrencySymbol = (currency: string) => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    VND: '₫',
  }
  return symbols[currency] || '$'
}

const isTalentSelected = (talentId: string) => {
  return job.value?.selectedTalents?.includes(talentId) || false
}

const selectTalent = (application: Application) => {
  if (!job.value) return
  // use composable to mark selection and update job state if needed
  // (job state transition can be handled elsewhere if required)
  showToast({
    type: 'success',
    title: 'Talent Selected',
    message: `Contract awarded to ${application.voiceTalentName} for "${job.value.title}"`,
  })
  router.push('/client/jobs')
}

const viewApplication = (applicationId: string) => {
  selectedApplication.value = applications.value.find((app) => app.id === applicationId) || null
  showApplicationDetail.value = true
  activeTab.value = 'overview' // Reset to overview tab when opening
}

// Load job data
const loadJob = (id: string | undefined) => {
  if (!id) return
  const found = getJob(id)
  if (found) {
    job.value = found
    applications.value = getApplicationsByJobId(found.id)
  } else {
    showToast({
      type: 'error',
      title: 'Job Not Found',
      message: 'The requested job could not be found.',
    })
    router.push('/client/jobs')
  }
}

onMounted(() => {
  loadJob(route.params.id as string)
})

watch(
  () => route.params.id,
  (newId) => loadJob(newId as string),
)
</script>

<style scoped>
.sidebar-enter-active,
.sidebar-leave-active {
  transition: opacity 0.3s ease;
}

.sidebar-enter-active > div:last-child,
.sidebar-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

.sidebar-enter-from,
.sidebar-leave-to {
  opacity: 0;
}

.sidebar-enter-from > div:last-child {
  transform: translateX(100%);
}

.sidebar-leave-to > div:last-child {
  transform: translateX(100%);
}
</style>
