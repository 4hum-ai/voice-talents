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
                  {{ castingCall?.title || 'Casting Details' }}
                </h1>
                <p class="text-sm text-muted-foreground">
                  Casting call information and requirements
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <Button variant="primary" size="sm" @click="$router.push(`/casting/${castingId}/submit`)">
                Submit Application
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-4xl mx-auto">
          <Card>
            <div class="p-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Casting Information
              </h2>
              <div class="space-y-4">
                <div>
                  <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Description</h3>
                  <p class="text-gray-900 dark:text-white">{{ castingCall?.description }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Budget</h3>
                  <p class="text-gray-900 dark:text-white">${{ castingCall?.budget?.toLocaleString() }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Deadline</h3>
                  <p class="text-gray-900 dark:text-white">{{ formatDate(castingCall?.deadline) }}</p>
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
import type { CastingCall } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'

const route = useRoute()
const castingId = computed(() => route.params.id as string)
const castingCall = ref<CastingCall | null>(null)

onMounted(() => {
  castingCall.value = mockData.castingCalls.find(c => c.id === castingId.value) || null
})

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString()
}
</script>

