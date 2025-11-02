<template>
  <div class="bg-background min-h-screen py-8">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 v-if="title" class="text-foreground mb-4 text-4xl font-bold">{{ title }}</h1>
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
          ref="articleRef"
          class="text-foreground [&>a]:text-primary [&>a]:hover:text-primary/80 [&_a]:text-primary [&_a]:hover:text-primary/80 [&>code]:bg-muted [&_code]:bg-muted [&>pre]:bg-muted [&_pre]:bg-muted [&>blockquote]:border-primary [&_blockquote]:border-primary [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:px-2 [&_code]:py-1 [&_code]:font-mono [&_code]:text-sm [&_li]:mb-2 [&_ol]:mb-4 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:p-4 [&_strong]:font-semibold [&_ul]:mb-4 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:pl-6 [&>a]:underline [&>blockquote]:my-4 [&>blockquote]:border-l-4 [&>blockquote]:pl-4 [&>blockquote]:italic [&>code]:rounded [&>code]:px-2 [&>code]:py-1 [&>code]:font-mono [&>code]:text-sm [&>h1]:mt-8 [&>h1]:mb-4 [&>h1]:text-3xl [&>h1]:font-bold [&>h2]:mt-6 [&>h2]:mb-3 [&>h2]:text-2xl [&>h2]:font-semibold [&>h3]:mt-4 [&>h3]:mb-2 [&>h3]:text-xl [&>h3]:font-semibold [&>p]:mb-4 [&>p]:leading-relaxed [&>pre]:mb-4 [&>pre]:overflow-x-auto [&>pre]:rounded-lg [&>pre]:p-4 [&>strong]:font-semibold"
          v-html="renderedContent"
        />
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import Card from '@/components/atoms/Card.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner.vue'

const route = useRoute()
const slug = route.params.slug as string

const loading = ref(true)
const error = ref<string | null>(null)
const renderedContent = ref('')
const title = ref<string>('')
const articleRef = ref<HTMLElement | null>(null)

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
})

onMounted(async () => {
  try {
    const response = await fetch(`/content/${slug}.md`, {
      cache: 'no-cache',
    })
    if (!response.ok) {
      throw new Error(`Failed to load content`)
    }
    const markdown = await response.text()
    renderedContent.value = marked.parse(markdown) as string

    // Extract H1 from rendered content
    await nextTick()
    if (articleRef.value) {
      const h1 = articleRef.value.querySelector('h1')
      if (h1) {
        title.value = h1.textContent || ''
        // Hide the H1 in the article since we show it in the header
        h1.style.display = 'none'
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load content'
  } finally {
    loading.value = false
  }
})
</script>
