<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <VoiceActNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <AppBar :show-back="true" @back="$router.back()">
        <template #title>{{ castingSession?.title }}</template>
        <template #subtitle>{{ castingSession?.clientName }}</template>
        <template #actions>
          <ThemeToggle />
          <Button variant="outline" size="sm" @click="shareCasting">
            <ShareIcon class="mr-2 h-4 w-4" />
            Share
          </Button>
        </template>
      </AppBar>

      <div class="px-4 py-8 pt-24 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl">
          <div v-if="castingSession" class="space-y-8">
            <!-- Casting Overview -->
            <div class="bg-card border-border rounded-lg border p-6 shadow-sm">
              <div class="mb-6 flex items-start justify-between">
                <div class="flex-1">
                  <div class="mb-4 flex items-center space-x-3">
                    <StatusBadge :status="getCastingSessionStatus(castingSession)" />
                    <StatusBadge
                      :status="getProposalStatusInfo(castingSession).status"
                      :variant="getProposalStatusInfo(castingSession).variant"
                      size="sm"
                    >
                      {{ getProposalStatusInfo(castingSession).label }}
                    </StatusBadge>
                  </div>
                  <h2 class="text-foreground mb-2 text-xl font-semibold">
                    {{ castingSession.title }}
                  </h2>
                  <p class="text-muted-foreground mb-4">
                    {{ castingSession.description }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <h3 class="text-foreground mb-3 font-medium">Project Details</h3>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Client:</span>
                      <span class="text-foreground">{{ castingSession.clientName }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Type:</span>
                      <span class="text-foreground">{{
                        formatProjectType(castingSession.projectType)
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Deadline:</span>
                      <span class="text-foreground">{{ formatDate(castingSession.deadline) }}</span>
                    </div>
                    <div v-if="castingSession.budget" class="flex justify-between">
                      <span class="text-muted-foreground">Budget:</span>
                      <span class="text-foreground">
                        ${{ castingSession.budget.min.toLocaleString() }} - ${{
                          castingSession.budget.max.toLocaleString()
                        }}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-foreground mb-3 font-medium">Requirements</h3>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Languages:</span>
                      <span class="text-foreground">{{
                        castingSession.requirements.languages.join(', ')
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Voice Types:</span>
                      <span class="text-foreground">{{
                        castingSession.requirements.voiceTypes.map(formatVoiceType).join(', ')
                      }}</span>
                    </div>
                    <div v-if="castingSession.requirements.experience" class="flex justify-between">
                      <span class="text-muted-foreground">Experience:</span>
                      <span class="text-foreground">{{
                        formatExperience(castingSession.requirements.experience)
                      }}</span>
                    </div>
                    <div v-if="castingSession.requirements.ageRange" class="flex justify-between">
                      <span class="text-muted-foreground">Age Range:</span>
                      <span class="text-foreground">{{
                        castingSession.requirements.ageRange
                      }}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-foreground mb-3 font-medium">Submission Info</h3>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Total Submissions:</span>
                      <span class="text-foreground">{{ castingSession.proposals.length }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Status:</span>
                      <span class="text-foreground">{{
                        formatDate(castingSession.createdDate)
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-center space-x-4">
              <Button
                v-if="!getUserProposalStatus(castingSession)"
                variant="primary"
                size="lg"
                @click="$router.push(`/casting/${castingSession.id}/submit`)"
                :disabled="castingSession.status !== 'open'"
              >
                <SendIcon class="mr-2 h-5 w-5" />
                Submit Proposal
              </Button>
              <Button
                v-else
                variant="outline"
                size="lg"
                @click="$router.push(`/casting/${castingSession.id}/proposal`)"
              >
                <EyeIcon class="mr-2 h-5 w-5" />
                View My Proposal
              </Button>
              <Button variant="outline" size="lg" @click="$router.push('/casting')">
                <ArrowLeftIcon class="mr-2 h-5 w-5" />
                Back to Casting
              </Button>
            </div>

            <!-- Requirements Tags -->
            <div class="bg-card border-border rounded-lg border p-6 shadow-sm">
              <h3 class="text-foreground mb-4 font-medium">Requirements</h3>
              <div class="flex flex-wrap gap-2">
                <Chip
                  v-for="language in castingSession.requirements.languages"
                  :key="language"
                  variant="outline"
                >
                  {{ language }}
                </Chip>
                <Chip
                  v-for="voiceType in castingSession.requirements.voiceTypes"
                  :key="voiceType"
                  variant="outline"
                >
                  {{ formatVoiceType(voiceType) }}
                </Chip>
                <Chip v-if="castingSession.requirements.experience" variant="outline">
                  {{ formatExperience(castingSession.requirements.experience) }}
                </Chip>
                <Chip v-if="castingSession.requirements.ageRange" variant="outline">
                  Age: {{ castingSession.requirements.ageRange }}
                </Chip>
              </div>
            </div>
          </div>

          <div v-else class="py-12 text-center">
            <MegaphoneIcon class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 class="text-foreground mb-2 text-lg font-medium">Casting call not found</h3>
            <p class="text-muted-foreground mb-6">
              The casting call you're looking for doesn't exist or has been removed.
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
import { useRoute } from 'vue-router'
import type { CastingSession, CastingProposal } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'
import Button from '@/components/atoms/Button.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import Chip from '@/components/atoms/Chip.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import ShareIcon from '~icons/mdi/share'
import SendIcon from '~icons/mdi/send'
import EyeIcon from '~icons/mdi/eye'
import MegaphoneIcon from '~icons/mdi/megaphone'

const route = useRoute()

// Current user ID - in real app, this would come from auth store
const currentUserId = 'va-001'

// State
const castingSession = ref<CastingSession | null>(null)

// Methods
const loadCastingSession = () => {
  const session = mockData.castingSessions.find((s) => s.id === route.params.id)
  if (session) {
    castingSession.value = session
  }
}

const getCastingSessionStatus = (session: CastingSession) => {
  switch (session.status) {
    case 'open':
      return 'active'
    case 'closed':
      return 'inactive'
    case 'completed':
      return 'completed'
    default:
      return 'draft'
  }
}

const getUserProposalStatus = (session: CastingSession): CastingProposal | null => {
  return session.proposals.find((proposal) => proposal.voiceActorId === currentUserId) || null
}

const getProposalStatusInfo = (session: CastingSession) => {
  const proposal = getUserProposalStatus(session)
  if (!proposal) {
    return {
      status: 'draft' as const,
      label: 'Not Applied',
      variant: 'soft' as const,
    }
  }

  switch (proposal.status) {
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

const formatProjectType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
}

const formatVoiceType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
}

const formatExperience = (experience: string) => {
  return experience.charAt(0).toUpperCase() + experience.slice(1)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const shareCasting = () => {
  const url = `${window.location.origin}/casting/${castingSession.value?.id}`
  if (navigator.share) {
    navigator.share({
      title: castingSession.value?.title,
      text: castingSession.value?.description,
      url: url,
    })
  } else {
    navigator.clipboard.writeText(url)
  }
}

onMounted(() => {
  loadCastingSession()
})
</script>
