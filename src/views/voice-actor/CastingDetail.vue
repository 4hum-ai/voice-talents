<template>
  <div class="min-h-screen bg-background flex">
    <!-- Navigation Sidebar -->
    <VoiceActNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <div class="bg-card shadow-sm border-b border-border">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
              <Button variant="ghost" size="sm" @click="$router.back()" class="mr-4">
                <ArrowLeftIcon class="h-4 w-4" />
              </Button>
              <div>
                <h1 class="text-2xl font-bold text-foreground">
                  {{ castingSession?.title }}
                </h1>
                <p class="text-sm text-muted-foreground">
                  {{ castingSession?.clientName }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="outline" size="sm" @click="shareCasting">
                <ShareIcon class="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-4xl mx-auto">
          <div v-if="castingSession" class="space-y-8">
            <!-- Casting Overview -->
            <div class="bg-card rounded-lg shadow-sm border border-border p-6">
              <div class="flex items-start justify-between mb-6">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-4">
                    <StatusBadge :status="getCastingSessionStatus(castingSession)" />
                    <StatusBadge 
                      :status="getProposalStatusInfo(castingSession).status" 
                      :variant="getProposalStatusInfo(castingSession).variant"
                      size="sm"
                    >
                      {{ getProposalStatusInfo(castingSession).label }}
                    </StatusBadge>
                  </div>
                  <h2 class="text-xl font-semibold text-foreground mb-2">
                    {{ castingSession.title }}
                  </h2>
                  <p class="text-muted-foreground mb-4">
                    {{ castingSession.description }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 class="font-medium text-foreground mb-3">Project Details</h3>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Client:</span>
                      <span class="text-foreground">{{ castingSession.clientName }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Type:</span>
                      <span class="text-foreground">{{ formatProjectType(castingSession.projectType) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Deadline:</span>
                      <span class="text-foreground">{{ formatDate(castingSession.deadline) }}</span>
                    </div>
                    <div v-if="castingSession.budget" class="flex justify-between">
                      <span class="text-muted-foreground">Budget:</span>
                      <span class="text-foreground">
                        ${{ castingSession.budget.min.toLocaleString() }} - ${{ castingSession.budget.max.toLocaleString() }}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="font-medium text-foreground mb-3">Requirements</h3>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Languages:</span>
                      <span class="text-foreground">{{ castingSession.requirements.languages.join(', ') }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Voice Types:</span>
                      <span class="text-foreground">{{ castingSession.requirements.voiceTypes.map(formatVoiceType).join(', ') }}</span>
                    </div>
                    <div v-if="castingSession.requirements.experience" class="flex justify-between">
                      <span class="text-muted-foreground">Experience:</span>
                      <span class="text-foreground">{{ formatExperience(castingSession.requirements.experience) }}</span>
                    </div>
                    <div v-if="castingSession.requirements.ageRange" class="flex justify-between">
                      <span class="text-muted-foreground">Age Range:</span>
                      <span class="text-foreground">{{ castingSession.requirements.ageRange }}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="font-medium text-foreground mb-3">Submission Info</h3>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Total Submissions:</span>
                      <span class="text-foreground">{{ castingSession.proposals.length }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Status:</span>
                      <span class="text-foreground">{{ formatDate(castingSession.createdDate) }}</span>
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
                :disabled="castingSession.status !== 'open'">
                <SendIcon class="h-5 w-5 mr-2" />
                Submit Proposal
              </Button>
              <Button 
                v-else
                variant="outline" 
                size="lg"
                @click="$router.push(`/casting/${castingSession.id}/proposal`)">
                <EyeIcon class="h-5 w-5 mr-2" />
                View My Proposal
              </Button>
              <Button variant="outline" size="lg" @click="$router.push('/casting')">
                <ArrowLeftIcon class="h-5 w-5 mr-2" />
                Back to Casting
              </Button>
            </div>

            <!-- Requirements Tags -->
            <div class="bg-card rounded-lg shadow-sm border border-border p-6">
              <h3 class="font-medium text-foreground mb-4">Requirements</h3>
              <div class="flex flex-wrap gap-2">
                <Chip v-for="language in castingSession.requirements.languages" :key="language" variant="outline">
                  {{ language }}
                </Chip>
                <Chip v-for="voiceType in castingSession.requirements.voiceTypes" :key="voiceType" variant="outline">
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

          <div v-else class="text-center py-12">
            <MegaphoneIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-foreground mb-2">
              Casting call not found
            </h3>
            <p class="text-muted-foreground mb-6">
              The casting call you're looking for doesn't exist or has been removed.
            </p>
            <Button variant="primary" @click="$router.push('/casting')">
              <ArrowLeftIcon class="h-4 w-4 mr-2" />
              Back to Casting
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { CastingSession, CastingProposal } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'
import Button from '@/components/atoms/Button.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import Chip from '@/components/atoms/Chip.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import ArrowLeftIcon from '~icons/mdi/arrow-left'
import ShareIcon from '~icons/mdi/share'
import SendIcon from '~icons/mdi/send'
import EyeIcon from '~icons/mdi/eye'
import MegaphoneIcon from '~icons/mdi/megaphone'

const route = useRoute()
const router = useRouter()

// Current user ID - in real app, this would come from auth store
const currentUserId = 'va-001'

// State
const castingSession = ref<CastingSession | null>(null)

// Methods
const loadCastingSession = () => {
  const session = mockData.castingSessions.find(s => s.id === route.params.id)
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
  return session.proposals.find(proposal => proposal.voiceActorId === currentUserId) || null
}

const getProposalStatusInfo = (session: CastingSession) => {
  const proposal = getUserProposalStatus(session)
  if (!proposal) {
    return { 
      status: 'draft' as const, 
      label: 'Not Applied', 
      variant: 'soft' as const 
    }
  }
  
  switch (proposal.status) {
    case 'submitted':
      return { 
        status: 'pending' as const, 
        label: 'Applied', 
        variant: 'soft' as const 
      }
    case 'under_review':
      return { 
        status: 'processing' as const, 
        label: 'Under Review', 
        variant: 'soft' as const 
      }
    case 'shortlisted':
      return { 
        status: 'success' as const, 
        label: 'Shortlisted', 
        variant: 'soft' as const 
      }
    case 'selected':
      return { 
        status: 'success' as const, 
        label: 'Selected', 
        variant: 'solid' as const 
      }
    case 'rejected':
      return { 
        status: 'rejected' as const, 
        label: 'Not Selected', 
        variant: 'soft' as const 
      }
    default:
      return { 
        status: 'draft' as const, 
        label: 'Draft', 
        variant: 'soft' as const 
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
    year: 'numeric'
  })
}

const shareCasting = () => {
  const url = `${window.location.origin}/casting/${castingSession.value?.id}`
  if (navigator.share) {
    navigator.share({
      title: castingSession.value?.title,
      text: castingSession.value?.description,
      url: url
    })
  } else {
    navigator.clipboard.writeText(url)
  }
}

onMounted(() => {
  loadCastingSession()
})
</script>
