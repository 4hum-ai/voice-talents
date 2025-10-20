<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <ClientNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <AppBar :show-back="true" @back="$router.back()">
        <template #title>Talent Management</template>
        <template #subtitle>Browse and invite voice actors for your projects</template>
        <template #actions>
          <ThemeToggle />
          <ViewToggle v-model="viewMode" />
        </template>
      </AppBar>

      <div class="px-4 py-8 pt-24 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <!-- Search and Filters -->
          <div class="mb-8">
            <div class="flex flex-col gap-4 sm:flex-row">
              <div class="flex-1">
                <SearchInput
                  v-model="searchQuery"
                  placeholder="Search voice actors by name, skills, or location..."
                  @update:model-value="handleSearch"
                />
              </div>
              <div class="flex gap-2">
                <SelectInput
                  v-model="selectedLanguage"
                  :options="languageOptions"
                  placeholder="All Languages"
                  class="w-40"
                />
                <SelectInput
                  v-model="selectedVoiceType"
                  :options="voiceTypeOptions"
                  placeholder="All Voice Types"
                  class="w-40"
                />
                <SelectInput
                  v-model="selectedExperience"
                  :options="experienceOptions"
                  placeholder="All Experience"
                  class="w-40"
                />
                <SelectInput
                  v-model="selectedLocation"
                  :options="locationOptions"
                  placeholder="All Locations"
                  class="w-40"
                />
              </div>
            </div>
          </div>

          <!-- Talent Stats -->
          <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
            <MetricCard
              title="Total Talents"
              :value="totalTalents"
              icon="mdi:account-group"
              color="blue"
            />
            <MetricCard
              title="Available Now"
              :value="availableTalents"
              icon="mdi:account-check"
              color="green"
            />
            <MetricCard
              title="Verified"
              :value="verifiedTalents"
              icon="mdi:shield-check"
              color="purple"
            />
            <MetricCard
              title="Invited"
              :value="invitedTalents.length"
              icon="mdi:email"
              color="orange"
            />
          </div>

          <!-- Talent Grid/List -->
          <div v-if="filteredTalents.length === 0" class="py-12 text-center">
            <AccountGroupIcon class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 class="text-foreground mb-2 text-lg font-medium">No voice actors found</h3>
            <p class="text-muted-foreground mb-6">
              {{
                searchQuery
                  ? 'Try adjusting your search criteria'
                  : 'No voice actors match your current filters'
              }}
            </p>
            <Button variant="primary" @click="clearFilters">
              <RefreshIcon class="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>

          <!-- Grid View -->
          <div
            v-else-if="viewMode === 'grid'"
            class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <div
              v-for="talent in filteredTalents"
              :key="talent.id"
              class="bg-card border-border overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
            >
              <!-- Talent Header -->
              <div class="border-border border-b p-6">
                <div class="flex items-start space-x-4">
                  <Avatar
                    :src="talent.avatarUrl"
                    :alt="talent.displayName"
                    :seed="talent.displayName"
                    size="lg"
                  />
                  <div class="min-w-0 flex-1">
                    <h3 class="text-foreground mb-1 text-lg font-semibold">
                      {{ talent.displayName }}
                    </h3>
                    <p class="text-muted-foreground mb-2 text-sm">
                      {{ talent.experience }} • {{ talent.location }}
                    </p>
                    <div class="flex items-center space-x-2">
                      <StatusBadge
                        :status="talent.availability === 'available' ? 'active' : 'inactive'"
                        size="sm"
                      >
                        {{ talent.availability }}
                      </StatusBadge>
                      <StatusBadge v-if="talent.isVerified" status="success" size="sm">
                        Verified
                      </StatusBadge>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Talent Details -->
              <div class="p-6">
                <div class="mb-4 space-y-3">
                  <div>
                    <div class="text-muted-foreground mb-1 text-xs">Languages</div>
                    <div class="flex flex-wrap gap-1">
                      <Chip
                        v-for="language in talent.languages.slice(0, 3)"
                        :key="language"
                        size="sm"
                        variant="outline"
                      >
                        {{ language }}
                      </Chip>
                      <Chip v-if="talent.languages.length > 3" size="sm" variant="outline">
                        +{{ talent.languages.length - 3 }}
                      </Chip>
                    </div>
                  </div>

                  <div>
                    <div class="text-muted-foreground mb-1 text-xs">Voice Types</div>
                    <div class="flex flex-wrap gap-1">
                      <Chip
                        v-for="voiceType in talent.voiceTypes.slice(0, 3)"
                        :key="voiceType"
                        size="sm"
                        variant="secondary"
                      >
                        {{ formatVoiceType(voiceType) }}
                      </Chip>
                      <Chip v-if="talent.voiceTypes.length > 3" size="sm" variant="secondary">
                        +{{ talent.voiceTypes.length - 3 }}
                      </Chip>
                    </div>
                  </div>

                  <div class="flex items-center justify-between text-sm">
                    <span class="text-muted-foreground">Rate</span>
                    <span class="text-foreground font-medium">
                      ${{ talent.hourlyRate?.toLocaleString() }}/hour
                    </span>
                  </div>

                  <div class="flex items-center justify-between text-sm">
                    <span class="text-muted-foreground">Rating</span>
                    <div class="flex items-center space-x-1">
                      <StarIcon class="h-4 w-4 text-yellow-500" />
                      <span class="text-foreground font-medium">{{ talent.averageRating }}</span>
                    </div>
                  </div>
                </div>

                <p class="text-muted-foreground mb-4 line-clamp-2 text-sm">
                  {{ talent.bio }}
                </p>
              </div>

              <!-- Actions -->
              <div class="px-6 pb-6">
                <div class="flex items-center justify-between">
                  <div class="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="$router.push(`/client/talents/${talent.id}`)"
                    >
                      <EyeIcon class="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" @click="viewPortfolio(talent)">
                      <FolderOpenIcon class="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    @click="inviteTalent(talent)"
                    :disabled="isInvited(talent.id)"
                  >
                    <EmailIcon class="mr-2 h-4 w-4" />
                    {{ isInvited(talent.id) ? 'Invited' : 'Invite' }}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- List View -->
          <div v-else class="bg-card border-border overflow-hidden rounded-lg border">
            <div class="overflow-x-auto">
              <table class="divide-border min-w-full divide-y">
                <thead class="bg-muted">
                  <tr>
                    <th
                      class="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"
                    >
                      Voice Actor
                    </th>
                    <th
                      class="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"
                    >
                      Languages
                    </th>
                    <th
                      class="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"
                    >
                      Voice Types
                    </th>
                    <th
                      class="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"
                    >
                      Rate
                    </th>
                    <th
                      class="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"
                    >
                      Rating
                    </th>
                    <th
                      class="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"
                    >
                      Status
                    </th>
                    <th
                      class="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-card divide-border divide-y">
                  <tr
                    v-for="talent in filteredTalents"
                    :key="talent.id"
                    class="hover:bg-muted transition-colors"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center space-x-3">
                        <Avatar
                          :src="talent.avatarUrl"
                          :alt="talent.displayName"
                          :seed="talent.displayName"
                          size="sm"
                        />
                        <div>
                          <div class="text-foreground text-sm font-medium">
                            {{ talent.displayName }}
                          </div>
                          <div class="text-muted-foreground text-sm">
                            {{ talent.experience }} • {{ talent.location }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex flex-wrap gap-1">
                        <Chip
                          v-for="language in talent.languages.slice(0, 2)"
                          :key="language"
                          size="sm"
                          variant="outline"
                        >
                          {{ language }}
                        </Chip>
                        <Chip v-if="talent.languages.length > 2" size="sm" variant="outline">
                          +{{ talent.languages.length - 2 }}
                        </Chip>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex flex-wrap gap-1">
                        <Chip
                          v-for="voiceType in talent.voiceTypes.slice(0, 2)"
                          :key="voiceType"
                          size="sm"
                          variant="secondary"
                        >
                          {{ formatVoiceType(voiceType) }}
                        </Chip>
                        <Chip v-if="talent.voiceTypes.length > 2" size="sm" variant="secondary">
                          +{{ talent.voiceTypes.length - 2 }}
                        </Chip>
                      </div>
                    </td>
                    <td class="text-foreground px-6 py-4 text-sm whitespace-nowrap">
                      ${{ talent.hourlyRate?.toLocaleString() }}/hour
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center space-x-1">
                        <StarIcon class="h-4 w-4 text-yellow-500" />
                        <span class="text-foreground text-sm">{{ talent.averageRating }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="space-y-1">
                        <StatusBadge
                          :status="talent.availability === 'available' ? 'active' : 'inactive'"
                          size="sm"
                        >
                          {{ talent.availability }}
                        </StatusBadge>
                        <StatusBadge v-if="talent.isVerified" status="success" size="sm">
                          Verified
                        </StatusBadge>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <div class="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          @click="$router.push(`/client/talents/${talent.id}`)"
                        >
                          <EyeIcon class="h-4 w-4" />
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          @click="inviteTalent(talent)"
                          :disabled="isInvited(talent.id)"
                        >
                          <EmailIcon class="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Job Selection Modal -->
    <JobSelectionModal
      :is-open="isJobSelectionModalOpen"
      :talent="selectedTalent"
      @close="closeJobSelectionModal"
      @invitation-sent="handleInvitationSent"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { VoiceActor } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'
import ClientNavigation from '@/components/organisms/ClientNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import ViewToggle from '@/components/molecules/ViewToggle.vue'
import MetricCard from '@/components/molecules/MetricCard.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import Chip from '@/components/atoms/Chip.vue'
import Button from '@/components/atoms/Button.vue'
import SearchInput from '@/components/atoms/SearchInput.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import Avatar from '@/components/atoms/Avatar.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import JobSelectionModal from '@/components/molecules/JobSelectionModal.vue'
import AccountGroupIcon from '~icons/mdi/account-group'
import RefreshIcon from '~icons/mdi/refresh'
import EyeIcon from '~icons/mdi/eye'
import FolderOpenIcon from '~icons/mdi/folder-open'
import EmailIcon from '~icons/mdi/email'
import StarIcon from '~icons/mdi/star'

// State
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const selectedLanguage = ref('')
const selectedVoiceType = ref('')
const selectedExperience = ref('')
const selectedLocation = ref('')
const invitedTalents = ref<string[]>([])

// Modal state
const isJobSelectionModalOpen = ref(false)
const selectedTalent = ref<VoiceActor | null>(null)

// Mock data - in real app, this would come from API
const talents = ref<VoiceActor[]>(mockData.voiceActors)

// Computed
const filteredTalents = computed(() => {
  let filtered = talents.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (talent) =>
        talent.displayName.toLowerCase().includes(query) ||
        talent.bio.toLowerCase().includes(query) ||
        talent.location.toLowerCase().includes(query) ||
        talent.skills.some((skill) => skill.toLowerCase().includes(query)),
    )
  }

  if (selectedLanguage.value) {
    filtered = filtered.filter((talent) => talent.languages.includes(selectedLanguage.value))
  }

  if (selectedVoiceType.value) {
    filtered = filtered.filter((talent) =>
      talent.voiceTypes.includes(selectedVoiceType.value as any),
    )
  }

  if (selectedExperience.value) {
    filtered = filtered.filter((talent) => talent.experience === selectedExperience.value)
  }

  if (selectedLocation.value) {
    filtered = filtered.filter((talent) =>
      talent.location.toLowerCase().includes(selectedLocation.value.toLowerCase()),
    )
  }

  return filtered
})

const totalTalents = computed(() => talents.value.length)
const availableTalents = computed(
  () => talents.value.filter((talent) => talent.availability === 'available').length,
)
const verifiedTalents = computed(() => talents.value.filter((talent) => talent.isVerified).length)
// const invitedTalentsCount = computed(() => invitedTalents.value.length)

// Options
const languageOptions = computed(() => [
  { value: '', label: 'All Languages' },
  ...Array.from(new Set(talents.value.flatMap((t) => t.languages))).map((lang) => ({
    value: lang,
    label: lang,
  })),
])

const voiceTypeOptions = computed(() => [
  { value: '', label: 'All Voice Types' },
  ...Array.from(new Set(talents.value.flatMap((t) => t.voiceTypes))).map((type) => ({
    value: type,
    label: formatVoiceType(type),
  })),
])

const experienceOptions = computed(() => [
  { value: '', label: 'All Experience' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'professional', label: 'Professional' },
])

const locationOptions = computed(() => [
  { value: '', label: 'All Locations' },
  ...Array.from(new Set(talents.value.map((t) => t.location))).map((location) => ({
    value: location,
    label: location,
  })),
])

// Methods

const handleSearch = () => {
  // Search is handled by computed property
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedLanguage.value = ''
  selectedVoiceType.value = ''
  selectedExperience.value = ''
  selectedLocation.value = ''
}

const formatVoiceType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
}

const isInvited = (talentId: string) => {
  return invitedTalents.value.includes(talentId)
}

const inviteTalent = (talent: VoiceActor) => {
  selectedTalent.value = talent
  isJobSelectionModalOpen.value = true
}

const handleInvitationSent = (data: { talentId: string; jobId: string; message?: string }) => {
  // Add to invited talents list
  if (!invitedTalents.value.includes(data.talentId)) {
    invitedTalents.value.push(data.talentId)
  }

  console.log('Invitation sent:', {
    talentId: data.talentId,
    jobId: data.jobId,
    message: data.message,
  })

  // In real app, this would be handled by the API response
}

const closeJobSelectionModal = () => {
  isJobSelectionModalOpen.value = false
  selectedTalent.value = null
}

const viewPortfolio = (talent: VoiceActor) => {
  // In real app, open portfolio in modal or new page
  console.log('Viewing portfolio for:', talent.displayName)
}

onMounted(() => {
  // In real app, fetch talents from API
  console.log('Talent management loaded')
})
</script>
