/**
 * Media Library
 * Centralized media player system with CDN support
 *
 * Usage:
 * ```ts
 * import { AudioPlayer, VideoPlayer, useCdn } from '@/lib/media'
 * import type { MediaItem } from '@/lib/media'
 * ```
 */

// Re-export composables
export { useCdn, getCdnDomain, isCdnEnabled, getCdnUrl } from './composable'
export type { MediaItem, PaginatedResponse } from './type'

// Re-export components
export { AudioPlayer, VideoPlayer } from './component'
