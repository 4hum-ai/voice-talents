<template>
  <div class="min-h-screen bg-background flex">
    <!-- Navigation Sidebar -->
    <ClientNavigation />

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
                  Talent Management
                </h1>
                <p class="text-sm text-muted-foreground">
                  Browse and invite voice actors for your projects
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="outline" size="sm" @click="toggleView">
                <ViewGridIcon v-if="viewMode === 'list'" class="h-4 w-4 mr-2" />
                <ViewListIcon v-else class="h-4 w-4 mr-2" />
                {{ viewMode === 'list' ? 'Grid' : 'List' }}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-7xl mx-auto">
          <!-- Search and Filters -->
          <div class="mb-8">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1">
                <SearchInput 
                  v-model="searchQuery"
                  placeholder="Search voice actors by name, skills, or location..."
                  @update:model-value="handleSearch" 
                />
              </div>
              <div class="flex gap-2">
                <SelectInput v-model="selectedLanguage" :options="languageOptions" placeholder="All Languages" class="w-40" />
                <SelectInput v-model="selectedVoiceType" :options="voiceTypeOptions" placeholder="All Voice Types" class="w-40" />
                <SelectInput v-model="selectedExperience" :options="experienceOptions" placeholder="All Experience" class="w-40" />
                <SelectInput v-model="selectedLocation" :options="locationOptions" placeholder="All Locations" class="w-40" />
              </div>
            </div>
          </div>

          <!-- Talent Stats -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <MetricCard title="Total Talents" :value="totalTalents" icon="mdi:account-group" color="blue" />
            <MetricCard title="Available Now" :value="availableTalents" icon="mdi:account-check" color="green" />
            <MetricCard title="Verified" :value="verifiedTalents" icon="mdi:shield-check" color="purple" />
            <MetricCard title="Invited" :value="invitedTalents.length" icon="mdi:email" color="orange" />
          </div>

          <!-- Talent Grid/List -->
          <div v-if="filteredTalents.length === 0" class="text-center py-12">
            <AccountGroupIcon class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 class="text-lg font-medium text-foreground mb-2">
              No voice actors found
            </h3>
            <p class="text-muted-foreground mb-6">
              {{ searchQuery ? 'Try adjusting your search criteria' : 'No voice actors match your current filters' }}
            </p>
            <Button variant="primary" @click="clearFilters">
              <RefreshIcon class="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>

          <!-- Grid View -->
          <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="talent in filteredTalents" 
              :key="talent.id"
              class="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow"
            >
              <!-- Talent Header -->
              <div class="p-6 border-b border-border">
                <div class="flex items-start space-x-4">
                  <Avatar
                    :src="talent.avatarUrl"
                    :alt="talent.displayName"
                    :seed="talent.displayName"
                    size="lg"
                  />
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-semibold text-foreground mb-1">
                      {{ talent.displayName }}
                    </h3>
                    <p class="text-sm text-muted-foreground mb-2">
                      {{ talent.experience }} • {{ talent.location }}
                    </p>
                    <div class="flex items-center space-x-2">
                      <StatusBadge 
                        :status="talent.availability === 'available' ? 'active' : 'inactive'"
                        size="sm"
                      >
                        {{ talent.availability }}
                      </StatusBadge>
                      <StatusBadge 
                        v-if="talent.isVerified"
                        status="success"
                        size="sm"
                      >
                        Verified
                      </StatusBadge>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Talent Details -->
              <div class="p-6">
                <div class="space-y-3 mb-4">
                  <div>
                    <div class="text-xs text-muted-foreground mb-1">Languages</div>
                    <div class="flex flex-wrap gap-1">
                      <Chip 
                        v-for="language in talent.languages.slice(0, 3)" 
                        :key="language" 
                        size="sm" 
                        variant="outline"
                      >
                        {{ language }}
                      </Chip>
                      <Chip 
                        v-if="talent.languages.length > 3" 
                        size="sm" 
                        variant="outline"
                      >
                        +{{ talent.languages.length - 3 }}
                      </Chip>
                    </div>
                  </div>

                  <div>
                    <div class="text-xs text-muted-foreground mb-1">Voice Types</div>
                    <div class="flex flex-wrap gap-1">
                      <Chip 
                        v-for="voiceType in talent.voiceTypes.slice(0, 3)" 
                        :key="voiceType" 
                        size="sm" 
                        variant="secondary"
                      >
                        {{ formatVoiceType(voiceType) }}
                      </Chip>
                      <Chip 
                        v-if="talent.voiceTypes.length > 3" 
                        size="sm" 
                        variant="secondary"
                      >
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

                <p class="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {{ talent.bio }}
                </p>
              </div>

              <!-- Actions -->
              <div class="px-6 pb-6">
                <div class="flex items-center justify-between">
                  <div class="flex space-x-2">
                    <Button variant="ghost" size="sm" @click="$router.push(`/client/talents/${talent.id}`)">
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
                    <EmailIcon class="h-4 w-4 mr-2" />
                    {{ isInvited(talent.id) ? 'Invited' : 'Invite' }}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- List View -->
          <div v-else class="bg-card rounded-lg border border-border overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-border">
                <thead class="bg-muted">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Voice Actor
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Languages
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Voice Types
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Rate
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Rating
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-card divide-y divide-border">
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
                          <div class="text-sm font-medium text-foreground">
                            {{ talent.displayName }}
                          </div>
                          <div class="text-sm text-muted-foreground">
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
                        <Chip 
                          v-if="talent.languages.length > 2" 
                          size="sm" 
                          variant="outline"
                        >
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
                        <Chip 
                          v-if="talent.voiceTypes.length > 2" 
                          size="sm" 
                          variant="secondary"
                        >
                          +{{ talent.voiceTypes.length - 2 }}
                        </Chip>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      ${{ talent.hourlyRate?.toLocaleString() }}/hour
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center space-x-1">
                        <StarIcon class="h-4 w-4 text-yellow-500" />
                        <span class="text-sm text-foreground">{{ talent.averageRating }}</span>
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
                        <StatusBadge 
                          v-if="talent.isVerified"
                          status="success"
                          size="sm"
                        >
                          Verified
                        </StatusBadge>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" @click="$router.push(`/client/talents/${talent.id}`)">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { VoiceActor } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'
import ClientNavigation from '@/components/organisms/ClientNavigation.vue'
import MetricCard from '@/components/molecules/MetricCard.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import Chip from '@/components/atoms/Chip.vue'
import Button from '@/components/atoms/Button.vue'
import SearchInput from '@/components/atoms/SearchInput.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import Avatar from '@/components/atoms/Avatar.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import ArrowLeftIcon from '~icons/mdi/arrow-left'
import ViewGridIcon from '~icons/mdi/view-grid'
import ViewListIcon from '~icons/mdi/view-list'
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

// Mock data - in real app, this would come from API
const talents = ref<VoiceActor[]>(mockData.voiceActors)

// Computed
const filteredTalents = computed(() => {
  let filtered = talents.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(talent =>
      talent.displayName.toLowerCase().includes(query) ||
      talent.bio.toLowerCase().includes(query) ||
      talent.location.toLowerCase().includes(query) ||
      talent.skills.some(skill => skill.toLowerCase().includes(query))
    )
  }

  if (selectedLanguage.value) {
    filtered = filtered.filter(talent =>
      talent.languages.includes(selectedLanguage.value)
    )
  }

  if (selectedVoiceType.value) {
    filtered = filtered.filter(talent =>
      talent.voiceTypes.includes(selectedVoiceType.value as any)
    )
  }

  if (selectedExperience.value) {
    filtered = filtered.filter(talent =>
      talent.experience === selectedExperience.value
    )
  }

  if (selectedLocation.value) {
    filtered = filtered.filter(talent =>
      talent.location.toLowerCase().includes(selectedLocation.value.toLowerCase())
    )
  }

  return filtered
})

const totalTalents = computed(() => talents.value.length)
const availableTalents = computed(() => 
  talents.value.filter(talent => talent.availability === 'available').length
)
const verifiedTalents = computed(() => 
  talents.value.filter(talent => talent.isVerified).length
)
// const invitedTalentsCount = computed(() => invitedTalents.value.length)

// Options
const languageOptions = computed(() => [
  { value: '', label: 'All Languages' },
  ...Array.from(new Set(talents.value.flatMap(t => t.languages))).map(lang => ({
    value: lang,
    label: lang
  }))
])

const voiceTypeOptions = computed(() => [
  { value: '', label: 'All Voice Types' },
  ...Array.from(new Set(talents.value.flatMap(t => t.voiceTypes))).map(type => ({
    value: type,
    label: formatVoiceType(type)
  }))
])

const experienceOptions = computed(() => [
  { value: '', label: 'All Experience' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'professional', label: 'Professional' }
])

const locationOptions = computed(() => [
  { value: '', label: 'All Locations' },
  ...Array.from(new Set(talents.value.map(t => t.location))).map(location => ({
    value: location,
    label: location
  }))
])

// Methods
const toggleView = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

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
  // In real app, send invitation via API
  invitedTalents.value.push(talent.id)
  console.log('Inviting talent:', talent.displayName)
  // Show success message
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
