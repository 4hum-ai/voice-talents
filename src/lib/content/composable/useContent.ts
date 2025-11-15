/**
 * Content Management Composable
 * Handles markdown loading, parsing, caching, and state management
 */

import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'
import type { ContentState, ContentMetadata, UseContentOptions } from '../type'
import { parseMarkdown, processContentHtml, parseFrontmatter } from '../util/markdown'

// Content cache to avoid re-fetching
const contentCache = new Map<string, ContentState>()

/**
 * Load content from markdown file
 */
async function loadContentFile(
  slug: string,
  basePath: string = '/content',
  fetchOptions?: RequestInit,
): Promise<{ markdown: string; html: string }> {
  const url = `${basePath}/${slug}.md`
  const response = await fetch(url, {
    cache: 'no-cache',
    ...fetchOptions,
  })

  if (!response.ok) {
    throw new Error(`Failed to load content: ${response.statusText}`)
  }

  const markdown = await response.text()
  const html = parseMarkdown(markdown)

  return { markdown, html }
}

/**
 * Process content and extract metadata
 */
function processContent(
  markdown: string,
  html: string,
  options: { extractTitle?: boolean; removeH1?: boolean } = {},
): { html: string; metadata: ContentMetadata } {
  const { frontmatter, content: contentMarkdown } = parseFrontmatter(markdown)
  const processedHtml = frontmatter.content ? parseMarkdown(contentMarkdown) : html

  const { html: finalHtml, title } = processContentHtml(processedHtml, options)

  const metadata: ContentMetadata = {
    title: title || (frontmatter.title as string) || undefined,
    description: (frontmatter.description as string) || undefined,
    tags: Array.isArray(frontmatter.tags)
      ? (frontmatter.tags as string[])
      : frontmatter.tags
        ? [String(frontmatter.tags)]
        : undefined,
    lastModified: (frontmatter.lastModified as string) || undefined,
    author: (frontmatter.author as string) || undefined,
    ...frontmatter,
  }

  return { html: finalHtml, metadata }
}

/**
 * Content composable
 * Provides reactive content state and loading functionality
 */
export function useContent(
  options: UseContentOptions | Ref<string> | ComputedRef<string> | string,
) {
  // Normalize options
  const normalizedOptions = computed<UseContentOptions>(() => {
    if (typeof options === 'string') {
      return { slug: options }
    }
    if ('value' in options) {
      return { slug: options.value }
    }
    return options
  })

  // State
  const state = ref<ContentState>({
    loading: false,
    error: null,
    html: '',
    markdown: '',
    metadata: {},
  })

  // Computed
  const slug = computed(() => normalizedOptions.value.slug)
  const basePath = computed(() => normalizedOptions.value.basePath || '/content')
  const extractTitle = computed(() => normalizedOptions.value.extractTitle !== false)
  const removeH1 = computed(() => normalizedOptions.value.removeH1 !== false)
  const cacheEnabled = computed(() => normalizedOptions.value.cache !== false)

  /**
   * Load content
   */
  const load = async () => {
    const currentSlug = slug.value
    if (!currentSlug) {
      state.value.error = 'Slug is required'
      return
    }

    // Check cache
    const cacheKey = `${basePath.value}/${currentSlug}`
    if (cacheEnabled.value && contentCache.has(cacheKey)) {
      const cached = contentCache.get(cacheKey)!
      state.value = { ...cached }
      return
    }

    state.value.loading = true
    state.value.error = null

    try {
      const { markdown, html } = await loadContentFile(
        currentSlug,
        basePath.value,
        normalizedOptions.value.fetchOptions,
      )

      const { html: processedHtml, metadata } = processContent(markdown, html, {
        extractTitle: extractTitle.value,
        removeH1: removeH1.value,
      })

      const newState: ContentState = {
        loading: false,
        error: null,
        html: processedHtml,
        markdown,
        metadata,
      }

      state.value = newState

      // Cache the result
      if (cacheEnabled.value) {
        contentCache.set(cacheKey, { ...newState })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load content'
      state.value = {
        ...state.value,
        loading: false,
        error: errorMessage,
      }
    }
  }

  /**
   * Reload content (bypass cache)
   */
  const reload = async () => {
    const cacheKey = `${basePath.value}/${slug.value}`
    if (contentCache.has(cacheKey)) {
      contentCache.delete(cacheKey)
    }
    await load()
  }

  /**
   * Clear cache for this content
   */
  const clearCache = () => {
    const cacheKey = `${basePath.value}/${slug.value}`
    contentCache.delete(cacheKey)
  }

  /**
   * Clear all cached content
   */
  const clearAllCache = () => {
    contentCache.clear()
  }

  // Watch for slug changes
  watch(
    slug,
    () => {
      load()
    },
    { immediate: true },
  )

  // Computed properties for convenience
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const html = computed(() => state.value.html)
  const markdown = computed(() => state.value.markdown)
  const metadata = computed(() => state.value.metadata)
  const title = computed(() => metadata.value.title)

  return {
    // State
    state: computed(() => state.value),
    loading,
    error,
    html,
    markdown,
    metadata,
    title,

    // Methods
    load,
    reload,
    clearCache,
    clearAllCache,
  }
}

/**
 * Clear all content cache (global utility)
 */
export function clearContentCache() {
  contentCache.clear()
}
