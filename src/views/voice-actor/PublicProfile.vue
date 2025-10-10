<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <div class="p-6">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Public Profile
          </h1>
          <p class="text-gray-600 dark:text-gray-300">
            This is the public profile view for voice actor {{ actorId }}.
          </p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Card from '@/components/atoms/Card.vue'

const route = useRoute()
const actorId = computed(() => route.params.actorId as string)
</script>

