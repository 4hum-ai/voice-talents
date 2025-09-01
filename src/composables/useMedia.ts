import { ref, computed, readonly } from 'vue'
import { useResourceService } from '@/composables/useResourceService'
import { useToast } from '@/composables/useToast'

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface MediaItem {
  id: string
  type: string
  format: string
  fileUrl: string
  fileName: string
  fileSize?: number
  duration?: number
  contentType: string
  status?: string
  language?: string
  uploadUrl?: string
  uploadExpiresAt?: string | Date
  bucket?: string
  path?: string
}

function transformPaginatedResponse<T>(response: unknown): PaginatedResponse<T> {
  if (typeof response !== 'object' || response === null) {
    return { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } }
  }
  const obj = response as Record<string, unknown>
  const pg = (obj.pagination as Record<string, unknown>) ?? {}
  const page = Number(pg.page ?? obj.page ?? 1) || 1
  const limit = Number(pg.limit ?? obj.limit ?? 20) || 20
  const total = Number(pg.total ?? obj.total ?? 0) || 0
  const totalPages =
    Number(pg.totalPages ?? obj.totalPages ?? Math.ceil(total / (limit || 1))) ||
    Math.max(1, Math.ceil(total / (limit || 1)))

  return {
    data: (obj.data as T[]) ?? [],
    pagination: { page, limit, total, totalPages },
  }
}

export function useMedia() {
  const { list, create, update } = useResourceService()
  const { push } = useToast()

  const media = ref<MediaItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(0)

  const hasMedia = computed(() => media.value.length > 0)
  const isFirstPage = computed(() => currentPage.value <= 1)
  const isLastPage = computed(() => currentPage.value >= totalPages.value)

  const fetchMedia = async (options?: { search?: string; filters?: Record<string, unknown> }) => {
    try {
      loading.value = true
      error.value = null
      const params: Record<string, unknown> = {
        page: currentPage.value,
        limit: 20,
      }
      if (options?.search) params.search = options.search
      if (options?.filters) Object.assign(params, options.filters)

      const raw = await list<MediaItem>('media', params)
      const result: PaginatedResponse<MediaItem> = transformPaginatedResponse<MediaItem>(raw)
      media.value = result.data
      totalPages.value = result.pagination.totalPages
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch media'
      error.value = message
      push({
        id: `${Date.now()}-media-fetch`,
        type: 'error',
        title: 'Failed to load media',
        body: message,
        position: 'tr',
        timeout: 6000,
      })
    } finally {
      loading.value = false
    }
  }

  const nextPage = async () => {
    if (isLastPage.value) return
    currentPage.value += 1
    await fetchMedia()
  }

  const previousPage = async () => {
    if (isFirstPage.value) return
    currentPage.value -= 1
    await fetchMedia()
  }

  async function createMediaRecord(params: {
    fileName: string
    contentType: string
    fileSize?: number
    duration?: number
    type: string // domain-specific (e.g., poster, trailer, dubbed)
    format: string // extension-like (e.g., mp4, png)
    language?: string
    description?: string
    tags?: string[]
    relationships?: string[] // ["entityType:entityId:relationshipType"]
    metadata?: Record<string, unknown>
  }): Promise<MediaItem> {
    const payload = {
      ...params,
      tags: params.tags || [],
      relationships: params.relationships || [],
      metadata: params.metadata || {},
    }
    return await create<MediaItem>('media', payload)
  }

  async function uploadFileToSignedUrl(options: {
    uploadUrl: string
    file: File | Blob
    contentType: string
    onProgress?: (percent: number) => void
  }): Promise<Response> {
    const { uploadUrl, file, contentType } = options
    return await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: file,
    })
  }

  async function uploadViaMediaResource(
    file: File,
    opts: {
      type?: string
      format?: string
      language?: string
      description?: string
      tags?: string[]
      relationships?: string[]
      metadata?: Record<string, unknown>
      duration?: number
      markCompleted?: boolean
    } = {},
  ): Promise<{ media: MediaItem; fileUrl: string }> {
    const type = opts.type || 'poster'
    const extension = (file.name.split('.').pop() || '').toLowerCase()
    const format = (opts.format || extension || 'bin').toLowerCase()
    const contentType = file.type || 'application/octet-stream'

    const mediaRecord = await createMediaRecord({
      fileName: file.name,
      contentType,
      fileSize: file.size,
      duration: opts.duration,
      type,
      format,
      language: opts.language,
      description: opts.description,
      tags: opts.tags,
      relationships: opts.relationships,
      metadata: opts.metadata,
    })

    if (!mediaRecord.uploadUrl) {
      throw new Error('Upload URL missing from media record')
    }

    const res = await uploadFileToSignedUrl({
      uploadUrl: mediaRecord.uploadUrl,
      file,
      contentType,
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Upload failed (${res.status}): ${text.slice(0, 160)}`)
    }

    try {
      await update<MediaItem>('media', mediaRecord.id, {
        status: 'completed',
        fileSize: file.size,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to complete upload'
      push({
        id: `${Date.now()}-media-complete`,
        type: 'error',
        title: 'Upload completion failed',
        body: message,
        position: 'tr',
        timeout: 6000,
      })
    }

    return { media: mediaRecord, fileUrl: mediaRecord.fileUrl }
  }

  return {
    media: readonly(media),
    loading: readonly(loading),
    error: readonly(error),
    currentPage: readonly(currentPage),
    totalPages: readonly(totalPages),
    hasMedia,
    isFirstPage,
    isLastPage,
    fetchMedia,
    nextPage,
    previousPage,
    uploadViaMediaResource,
  }
}
