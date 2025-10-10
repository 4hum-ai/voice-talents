<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
    <VoiceActNavigation />
    <div class="flex-1">
      <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
              <Button variant="ghost" size="sm" @click="$router.back()" class="mr-4">
                <ArrowLeftIcon class="h-4 w-4" />
              </Button>
              <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                  Submit to Casting
                </h1>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  Submit your application for this casting call
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <Button variant="outline" size="sm" @click="$router.back()">
                Cancel
              </Button>
              <Button variant="primary" size="sm" @click="submitApplication">
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
                Application Form
              </h2>
              <p class="text-gray-600 dark:text-gray-300">
                Submit your voice sample and application details for this casting call.
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
const castingId = computed(() => route.params.id as string)

const submitApplication = () => {
  console.log('Submitting application for casting:', castingId.value)
}
</script>
