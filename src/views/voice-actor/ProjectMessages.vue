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
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                  Project Messages
                </h1>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  Communication for project {{ projectId }}
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
                Project Messages
              </h2>
              <p class="text-gray-600 dark:text-gray-300">
                View and manage messages for this specific project.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import ArrowLeftIcon from '~icons/mdi/arrow-left'

const route = useRoute()
const projectId = computed(() => route.params.projectId as string)
</script>

