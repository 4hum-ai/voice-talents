<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <VoiceActNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <AppBar :show-back="true" @back="$router.back()">
        <template #title>My Proposal</template>
        <template #subtitle>{{ castingSession?.title }}</template>
        <template #actions>
          <StatusBadge
            :status="getProposalStatusInfo().status"
            :variant="getProposalStatusInfo().variant"
          >
            {{ getProposalStatusInfo().label }}
          </StatusBadge>
          <ThemeToggle />
        </template>
      </AppBar>

      <div class="px-4 py-8 pt-24 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl">
          <div v-if="proposal && castingSession" class="space-y-8">
            <!-- Proposal Status -->
            <div class="bg-card border-border rounded-lg border p-6 shadow-sm">
              <div class="mb-4 flex items-center justify-between">
                <h2 class="text-foreground text-lg font-semibold">Proposal Status</h2>
                <StatusBadge
                  :status="getProposalStatusInfo().status"
                  :variant="getProposalStatusInfo().variant"
                >
                  {{ getProposalStatusInfo().label }}
                </StatusBadge>
              </div>
              <div class="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
                <div>
                  <span class="text-muted-foreground">Submitted:</span>
                  <span class="text-foreground ml-2">{{ formatDate(proposal.submittedDate) }}</span>
                </div>
                <div v-if="proposal.reviewedDate">
                  <span class="text-muted-foreground">Last Updated:</span>
                  <span class="text-foreground ml-2">{{ formatDate(proposal.reviewedDate) }}</span>
                </div>
              </div>
              <div
                v-if="proposal.studioFeedback"
                class="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20"
              >
                <h4 class="mb-2 font-medium text-blue-900 dark:text-blue-100">Studio Feedback</h4>
                <p class="text-sm text-blue-800 dark:text-blue-200">
                  {{ proposal.studioFeedback }}
                </p>
              </div>
              <div
                v-if="proposal.rejectionReason"
                class="mt-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20"
              >
                <h4 class="mb-2 font-medium text-red-900 dark:text-red-100">
                  Reason for Rejection
                </h4>
                <p class="text-sm text-red-800 dark:text-red-200">{{ proposal.rejectionReason }}</p>
              </div>
            </div>

            <!-- Cost & Timeline -->
            <div class="bg-card border-border rounded-lg border p-6 shadow-sm">
              <h2 class="text-foreground mb-4 text-lg font-semibold">Cost & Timeline Proposal</h2>
              <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <h3 class="text-foreground mb-2 font-medium">Proposed Cost</h3>
                  <p class="text-foreground text-2xl font-bold">
                    ${{ proposal.proposedCost.toLocaleString() }} {{ proposal.proposedCurrency }}
                  </p>
                </div>
                <div>
                  <h3 class="text-foreground mb-2 font-medium">Timeline</h3>
                  <p class="text-foreground text-lg">{{ proposal.proposedTimeline }}</p>
                </div>
                <div>
                  <h3 class="text-foreground mb-2 font-medium">Estimated Hours</h3>
                  <p class="text-foreground text-lg">{{ proposal.estimatedHours }} hours</p>
                </div>
              </div>
            </div>

            <!-- Portfolio Samples -->
            <div
              v-if="proposal.portfolioSampleIds.length > 0"
              class="bg-card border-border rounded-lg border p-6 shadow-sm"
            >
              <h2 class="text-foreground mb-4 text-lg font-semibold">Portfolio Samples</h2>
              <div class="space-y-4">
                <div
                  v-for="sampleId in proposal.portfolioSampleIds"
                  :key="sampleId"
                  class="flex items-center space-x-3"
                >
                  <div v-if="getSampleById(sampleId)" class="flex-1">
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="text-foreground text-sm font-medium">
                          {{ getSampleById(sampleId)?.title }}
                        </h4>
                        <p class="text-muted-foreground text-xs">
                          {{ getSampleById(sampleId)?.description }}
                        </p>
                        <div class="mt-1 flex items-center space-x-2">
                          <Chip size="sm" variant="outline">{{
                            formatVoiceType(getSampleById(sampleId)?.voiceType || '')
                          }}</Chip>
                          <Chip size="sm" variant="outline">{{
                            getSampleById(sampleId)?.genre
                          }}</Chip>
                          <span class="text-muted-foreground text-xs"
                            >{{ getSampleById(sampleId)?.duration }}s</span
                          >
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        @click="playSample(getSampleById(sampleId)!)"
                      >
                        <PlayIcon class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Custom Samples -->
            <div
              v-if="proposal.customSamples.length > 0"
              class="bg-card border-border rounded-lg border p-6 shadow-sm"
            >
              <h2 class="text-foreground mb-4 text-lg font-semibold">Custom Samples</h2>
              <div class="space-y-4">
                <div
                  v-for="(customSample, index) in proposal.customSamples"
                  :key="index"
                  class="border-border rounded-lg border p-4"
                >
                  <div class="mb-3 flex items-center justify-between">
                    <h4 class="text-foreground text-sm font-medium">{{ customSample.title }}</h4>
                    <Button variant="ghost" size="sm" @click="playCustomSample(customSample)">
                      <PlayIcon class="h-4 w-4" />
                    </Button>
                  </div>
                  <p class="text-muted-foreground mb-2 text-sm">{{ customSample.description }}</p>
                  <div class="flex items-center space-x-2">
                    <Chip size="sm" variant="outline">{{ customSample.duration }}s</Chip>
                    <Chip size="sm" variant="outline">{{ customSample.format.toUpperCase() }}</Chip>
                    <span class="text-muted-foreground text-xs">{{
                      formatFileSize(customSample.fileSize)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Personal Note -->
            <div
              v-if="proposal.personalNote"
              class="bg-card border-border rounded-lg border p-6 shadow-sm"
            >
              <h2 class="text-foreground mb-4 text-lg font-semibold">Personal Note to Studio</h2>
              <p class="text-muted-foreground text-sm whitespace-pre-wrap">
                {{ proposal.personalNote }}
              </p>
            </div>

            <!-- Actions -->
            <div class="border-border flex items-center justify-center space-x-4 border-t pt-6">
              <Button variant="outline" @click="$router.push(`/casting/${castingSession.id}`)">
                <EyeIcon class="mr-2 h-4 w-4" />
                View Casting Details
              </Button>
              <Button variant="outline" @click="$router.push('/casting')">
                <ArrowLeftIcon class="mr-2 h-4 w-4" />
                Back to Casting
              </Button>
            </div>
          </div>

          <div v-else class="py-12 text-center">
            <MegaphoneIcon class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 class="text-foreground mb-2 text-lg font-medium">Proposal not found</h3>
            <p class="text-muted-foreground mb-6">
              The proposal you're looking for doesn't exist or has been removed.
            </p>
            <Button variant="primary" @click="$router.push('/casting')">
              <ArrowLeftIcon class="mr-2 h-4 w-4" />
              Back to Casting
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { CastingSession, CastingProposal, VoiceSample } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'
import Button from '@/components/atoms/Button.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import Chip from '@/components/atoms/Chip.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import PlayIcon from '~icons/mdi/play'
import EyeIcon from '~icons/mdi/eye'
import MegaphoneIcon from '~icons/mdi/megaphone'

const route = useRoute()
const router = useRouter()

// Current user ID - in real app, this would come from auth store
const currentUserId = 'va-001'

// State
const castingSession = ref<CastingSession | null>(null)
const proposal = ref<CastingProposal | null>(null)

// Methods
const loadProposal = () => {
  const session = mockData.castingSessions.find((s) => s.id === route.params.id)
  if (session) {
    castingSession.value = session
    const userProposal = session.proposals.find((p) => p.voiceActorId === currentUserId)
    if (userProposal) {
      proposal.value = userProposal
    } else {
      router.push(`/casting/${route.params.id}`)
    }
  } else {
    router.push('/casting')
  }
}

const getProposalStatusInfo = () => {
  if (!proposal.value) {
    return {
      status: 'draft' as const,
      label: 'Not Found',
      variant: 'soft' as const,
    }
  }

  switch (proposal.value.status) {
    case 'submitted':
      return {
        status: 'pending' as const,
        label: 'Applied',
        variant: 'soft' as const,
      }
    case 'under_review':
      return {
        status: 'processing' as const,
        label: 'Under Review',
        variant: 'soft' as const,
      }
    case 'shortlisted':
      return {
        status: 'success' as const,
        label: 'Shortlisted',
        variant: 'soft' as const,
      }
    case 'selected':
      return {
        status: 'success' as const,
        label: 'Selected',
        variant: 'solid' as const,
      }
    case 'rejected':
      return {
        status: 'rejected' as const,
        label: 'Not Selected',
        variant: 'soft' as const,
      }
    default:
      return {
        status: 'draft' as const,
        label: 'Draft',
        variant: 'soft' as const,
      }
  }
}

const getSampleById = (sampleId: string): VoiceSample | undefined => {
  return mockData.voiceSamples.find((sample) => sample.id === sampleId)
}

const formatVoiceType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const playSample = (sample: VoiceSample) => {
  // In real app, this would play the audio sample
  console.log('Playing sample:', sample.title)
}

const playCustomSample = (customSample: any) => {
  // In real app, this would play the custom sample
  console.log('Playing custom sample:', customSample.title)
}

onMounted(() => {
  loadProposal()
})
</script>
