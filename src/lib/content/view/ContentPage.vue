<template>
  <div class="bg-background min-h-screen py-8">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 v-if="content.title.value" class="text-foreground mb-4 text-4xl font-bold">
          {{ content.title.value }}
        </h1>
      </div>
      <Card class="p-6 sm:p-8">
        <div v-if="content.loading.value" class="flex items-center justify-center py-12">
          <LoadingSpinner size="md" />
        </div>
        <div
          v-else-if="content.error.value"
          class="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
        >
          <p class="text-red-700 dark:text-red-400">{{ content.error.value }}</p>
        </div>
        <ContentRenderer v-else :html="content.html.value" />
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useContent } from '../composable'
import { ContentRenderer } from '../component'
import Card from '@/components/atoms/Card.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner.vue'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const content = useContent(slug)
</script>
