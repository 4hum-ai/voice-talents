/**
 * Content-related TypeScript types
 * Centralized type definitions for content system
 */

/**
 * Content metadata extracted from markdown
 */
export interface ContentMetadata {
  /** Content title (extracted from H1 or frontmatter) */
  title?: string
  /** Content description */
  description?: string
  /** Content tags/categories */
  tags?: string[]
  /** Last modified date */
  lastModified?: string
  /** Author */
  author?: string
  /** Custom metadata fields */
  [key: string]: unknown
}

/**
 * Content loading state
 */
export interface ContentState {
  /** Whether content is currently loading */
  loading: boolean
  /** Error message if loading failed */
  error: string | null
  /** Parsed HTML content */
  html: string
  /** Raw markdown content */
  markdown: string
  /** Extracted metadata */
  metadata: ContentMetadata
}

/**
 * Options for loading content
 */
export interface UseContentOptions {
  /** Content slug (filename without .md extension) */
  slug: string
  /** Whether to cache the content (default: true) */
  cache?: boolean
  /** Custom content base path (default: '/content') */
  basePath?: string
  /** Whether to extract title from H1 (default: true) */
  extractTitle?: boolean
  /** Whether to remove H1 from content after extraction (default: true) */
  removeH1?: boolean
  /** Custom fetch options */
  fetchOptions?: RequestInit
}

/**
 * Content definition for declarative content management
 */
export interface ContentDefinition {
  /** Unique content identifier */
  id: string
  /** Content slug */
  slug: string
  /** Display title */
  title?: string
  /** Content description */
  description?: string
  /** Content category */
  category?: string
  /** Content tags */
  tags?: string[]
  /** Whether content requires authentication */
  requiresAuth?: boolean
  /** Custom metadata */
  metadata?: Record<string, unknown>
}
