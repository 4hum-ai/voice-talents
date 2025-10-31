<template>
  <div class="bg-background min-h-screen py-8">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-foreground mb-4 text-4xl font-bold">Terms of Service</h1>
        <p class="text-muted-foreground text-sm">Last Updated: January 2025</p>
      </div>
      <Card class="p-6 sm:p-8">
        <div v-if="loading" class="flex items-center justify-center py-12">
          <LoadingSpinner size="md" />
        </div>
        <div
          v-else-if="error"
          class="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
        >
          <p class="text-red-700 dark:text-red-400">{{ error }}</p>
        </div>
        <article
          v-else
          class="prose prose-slate dark:prose-invert max-w-none"
          v-html="renderedContent"
        />
      </Card>
      <div class="mt-6 text-center">
        <Button variant="outline" @click="$router.back()">
          <Icon name="mdi:arrow-left" class="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { marked } from 'marked'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner.vue'

const loading = ref(true)
const error = ref<string | null>(null)
const renderedContent = ref('')

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
})

onMounted(async () => {
  try {
    const response = await fetch('/content/terms-of-service.md', {
      cache: 'no-cache',
    })
    if (!response.ok) {
      throw new Error('Failed to load Terms of Service')
    }
    const markdown = await response.text()
    renderedContent.value = marked.parse(markdown) as string
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load content'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Prose styles for markdown content */
.prose {
  @apply text-foreground;
}

.prose h1 {
  @apply mt-8 mb-4 text-3xl font-bold;
}

.prose h2 {
  @apply mt-6 mb-3 text-2xl font-semibold;
}

.prose h3 {
  @apply mt-4 mb-2 text-xl font-semibold;
}

.prose p {
  @apply mb-4 leading-relaxed;
}

.prose ul,
.prose ol {
  @apply mb-4 ml-6;
}

.prose li {
  @apply mb-2;
}

.prose strong {
  @apply font-semibold;
}

.prose a {
  @apply text-primary hover:text-primary/80 underline;
}

.prose code {
  @apply bg-muted rounded px-2 py-1 font-mono text-sm;
}

.prose pre {
  @apply bg-muted mb-4 overflow-x-auto rounded-lg p-4;
}

.prose blockquote {
  @apply border-primary my-4 border-l-4 pl-4 italic;
}
</style>
