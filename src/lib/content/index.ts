/**
 * Content Library
 * Centralized content management system for markdown content
 *
 * Usage:
 * ```ts
 * import { useContent, ContentViewer, ContentRenderer } from '@/lib/content'
 * import type { ContentMetadata, UseContentOptions } from '@/lib/content'
 * ```
 */

// Re-export composables
export { useContent, clearContentCache } from './composable'
export type { UseContentOptions } from './type'

// Re-export types
export type { ContentMetadata, ContentState, ContentDefinition } from './type'

// Re-export components
export { ContentViewer, ContentRenderer } from './component'

// Re-export utilities
export {
  parseMarkdown,
  extractTitle,
  removeH1,
  processContentHtml,
  parseFrontmatter,
  configureMarked,
} from './util'

// Re-export view
export { default as ContentPage } from './view/ContentPage.vue'
