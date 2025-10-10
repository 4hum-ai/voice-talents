<template>
  <div class="min-h-screen bg-background flex">
    <VoiceActNavigation />
    <div class="flex-1">
      <div class="bg-card shadow-sm border-b border-border">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
              <Button variant="ghost" size="sm" @click="$router.back()" class="mr-4">
                <ArrowLeftIcon class="h-4 w-4" />
              </Button>
              <div>
                <h1 class="text-2xl font-bold text-foreground">
                  {{ studio?.name || 'Studio Details' }}
                </h1>
                <p class="text-sm text-muted-foreground">
                  Studio information and collaboration history
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-4xl mx-auto">
          <Card>
            <div class="p-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Studio Information
              </h2>
              <div class="space-y-4">
                <div>
                  <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Name</h3>
                  <p class="text-gray-900 dark:text-white">{{ studio?.name }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Location</h3>
                  <p class="text-gray-900 dark:text-white">{{ studio?.location }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Contact</h3>
                  <p class="text-gray-900 dark:text-white">{{ studio?.contactEmail }}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import ArrowLeftIcon from '~icons/mdi/arrow-left'
import type { Studio } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'

const route = useRoute()
const studioId = computed(() => route.params.id as string)
const studio = ref<Studio | null>(null)

onMounted(() => {
  studio.value = mockData.studios.find(s => s.id === studioId.value) || null
})
</script>

