<template>
  <div class="min-h-screen bg-background flex">
    <!-- Navigation Sidebar -->
    <VoiceActNavigation />

    <!-- Main Content -->
    <div class="flex-1 ml-72">
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
                  Studios
                </h1>
                <p class="text-sm text-muted-foreground">
                  Browse recording studios and collaborators
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
          <!-- Stats Overview -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Studios"
              :value="studios.length"
              icon="mdi:studio"
              color="blue"
            />
            <MetricCard
              title="Active Collaborations"
              :value="activeCollaborations"
              icon="mdi:handshake"
              color="green"
            />
            <MetricCard
              title="Completed Projects"
              :value="completedProjects"
              icon="mdi:check-circle"
              color="purple"
            />
            <MetricCard
              title="Total Earnings"
              :value="`$${totalEarnings.toLocaleString()}`"
              icon="mdi:currency-usd"
              color="orange"
            />
          </div>

          <!-- Studios Grid/List -->
          <div v-if="studios.length === 0" class="text-center py-12">
            <StudioIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-foreground mb-2">
              No studios found
            </h3>
            <p class="text-muted-foreground">
              Check back later for new studio partnerships
            </p>
          </div>

          <!-- Grid View -->
          <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              v-for="studio in studios"
              :key="studio.id"
              class="cursor-pointer hover:shadow-lg transition-shadow"
              @click="$router.push(`/studios/${studio.id}`)"
            >
              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="text-lg font-semibold text-foreground">
                      {{ studio.name }}
                    </h3>
                    <p class="text-sm text-muted-foreground">
                      {{ studio.location }}
                    </p>
                  </div>
                  <div class="flex items-center text-green-600">
                    <CheckIcon class="h-4 w-4 mr-1" />
                    <span class="text-xs font-medium">Verified</span>
                  </div>
                </div>
                
                <div class="space-y-3">
                  <div>
                    <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Services
                    </h4>
                    <div class="flex flex-wrap gap-1">
                      <Chip
                        v-for="service in studio.services.slice(0, 3)"
                        :key="service"
                        :label="service"
                        variant="secondary"
                        size="sm"
                      />
                      <span v-if="studio.services.length > 3" class="text-xs text-gray-500">
                        +{{ studio.services.length - 3 }} more
                      </span>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{{ studio.projects?.length || 0 }} projects</span>
                    <span>{{ studio.engineers?.length || 0 }} engineers</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <!-- List View -->
          <div v-else class="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Studio
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Services
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Projects
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr
                    v-for="studio in studios"
                    :key="studio.id"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    @click="$router.push(`/studios/${studio.id}`)"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <StudioIcon class="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-foreground">
                            {{ studio.name }}
                          </div>
                          <div class="text-sm text-muted-foreground">
                            {{ studio.contactEmail }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {{ studio.location }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex flex-wrap gap-1">
                        <Chip
                          v-for="service in studio.services.slice(0, 2)"
                          :key="service"
                          :label="service"
                          variant="secondary"
                          size="sm"
                        />
                        <span v-if="studio.services.length > 2" class="text-xs text-gray-500">
                          +{{ studio.services.length - 2 }}
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {{ studio.projects?.length || 0 }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center text-green-600">
                        <CheckIcon class="h-4 w-4 mr-1" />
                        <span class="text-sm">Verified</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          @click.stop="$router.push(`/studios/${studio.id}`)"
                        >
                          <EyeIcon class="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          @click.stop="contactStudio(studio)"
                        >
                          <MessageIcon class="h-4 w-4" />
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import Chip from '@/components/atoms/Chip.vue'
import MetricCard from '@/components/molecules/MetricCard.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import ArrowLeftIcon from '~icons/mdi/arrow-left'
import ViewGridIcon from '~icons/mdi/view-grid'
import ViewListIcon from '~icons/mdi/view-list'
import StudioIcon from '~icons/mdi/domain'
import CheckIcon from '~icons/mdi/check'
import EyeIcon from '~icons/mdi/eye'
import MessageIcon from '~icons/mdi/message'
import type { Studio } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'

const router = useRouter()

// State
const viewMode = ref<'grid' | 'list'>('grid')
const studios = ref<Studio[]>(mockData.studios)

// Computed
const activeCollaborations = computed(() => {
  return studios.value.filter(studio => 
    studio.projects?.some(project => project.status === 'in-progress')
  ).length
})

const completedProjects = computed(() => {
  return studios.value.reduce((total, studio) => {
    return total + (studio.projects?.filter(project => project.status === 'completed').length || 0)
  }, 0)
})

const totalEarnings = computed(() => {
  return studios.value.reduce((total, studio) => {
    return total + (studio.projects?.reduce((studioTotal, project) => {
      return studioTotal + (project.status === 'completed' ? (project.budget || 0) : 0)
    }, 0) || 0)
  }, 0)
})

const toggleView = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

const contactStudio = (studio: Studio) => {
  // In real app, this would open contact dialog
  console.log('Contacting studio:', studio.name)
}
</script>

