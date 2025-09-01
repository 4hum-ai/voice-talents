import { useApiGateway } from '@/utils/useApiGateway'
import { useEventBus } from '@vueuse/core'
import { EVENT_CRUD, type CrudEventPayload } from '@/types/events'

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export class ConnectionError extends Error {
  constructor(
    message: string,
    public originalError?: Error,
  ) {
    super(message)
    this.name = 'ConnectionError'
  }
}

export function useResourceService(base: string = 'movie/api') {
  const client = useApiGateway(base)
  const crudBus = useEventBus<CrudEventPayload>(EVENT_CRUD)

  const request = async <T>(
    endpoint: string,
    options: RequestInit & { signal?: AbortSignal } = {},
  ): Promise<T> => {
    try {
      const res = await client.request(endpoint, options)
      if (!res.ok) {
        let message = `HTTP error! status: ${res.status}`
        const contentType = res.headers.get('content-type') || ''
        if (/application\/json/.test(contentType)) {
          try {
            const err: unknown = await res.json()
            if (err && typeof err === 'object') {
              message =
                (err as { message?: string }).message ||
                (err as { error?: string }).error ||
                message
            }
          } catch {
            /* ignore */
          }
        } else {
          const text = await res.text().catch(() => '')
          if (text?.startsWith('<!doctype') || text?.startsWith('<!DOCTYPE')) {
            message =
              'Received HTML from server. Check VITE_PUBLIC_API_URL; the dev server likely returned index.html for a bad URL.'
          }
        }
        throw new Error(message)
      }
      const contentType = res.headers.get('content-type') || ''
      if (!/application\/json/.test(contentType)) {
        const text = await res.text().catch(() => '')
        throw new Error(
          'Server returned non-JSON response. Verify API base URL and endpoint. Sample: ' +
            text.slice(0, 120),
        )
      }
      return (await res.json()) as T
    } catch (error: unknown) {
      if (
        (error as { name?: string })?.name === 'AbortError' ||
        /Failed to fetch|NetworkError/.test(String(error))
      ) {
        throw new ConnectionError(
          'Unable to reach API. Check connectivity and URL.',
          error instanceof Error ? error : undefined,
        )
      }
      throw error
    }
  }

  const list = async <T = Record<string, unknown>>(
    resource: string,
    query?: Record<string, unknown>,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<T>> => {
    const toSearchParams = (input: Record<string, unknown>): URLSearchParams => {
      const search = new URLSearchParams()
      const append = (key: string, value: unknown) => {
        if (value === undefined || value === null) return
        if (value instanceof Date) {
          search.append(key, value.toISOString())
        } else if (Array.isArray(value)) {
          search.append(key, value.map((v) => String(v)).join(','))
        } else {
          search.append(key, String(value))
        }
      }
      const build = (prefix: string, value: unknown) => {
        if (value === undefined || value === null) return
        if (value instanceof Date || typeof value !== 'object' || Array.isArray(value)) {
          append(prefix, value)
          return
        }
        Object.entries(value).forEach(([k, v]) => build(`${prefix}[${k}]`, v))
      }
      Object.entries(input).forEach(([k, v]) => build(k, v))
      return search
    }
    const search = query ? toSearchParams(query) : new URLSearchParams()
    const q = search.toString()
    const path = q ? `/${resource}?${q}` : `/${resource}`
    const payload = await request<{ data: T[]; pagination?: Record<string, unknown> }>(path, {
      signal,
    })
    const pg = payload?.pagination ?? {}
    const page = Number(pg.page ?? (payload as Record<string, unknown>).page ?? 1) || 1
    const limit = Number(pg.limit ?? (payload as Record<string, unknown>).limit ?? 20) || 20
    const total = Number(pg.total ?? (payload as Record<string, unknown>).total ?? 0) || 0
    const totalPages =
      Number(
        pg.totalPages ??
          (payload as Record<string, unknown>).totalPages ??
          Math.ceil(total / (limit || 1)),
      ) || Math.max(1, Math.ceil(total / (limit || 1)))
    return {
      data: payload.data || [],
      pagination: { page, limit, total, totalPages },
    }
  }

  const getById = async <T = Record<string, unknown>>(
    resource: string,
    id: string,
    signal?: AbortSignal,
  ): Promise<T> => {
    const payload = await request<{ data?: T } | T>(`/${resource}/${id}`, { signal })
    return (payload as { data?: T })?.data ?? (payload as T)
  }

  const create = async <T = Record<string, unknown>>(
    resource: string,
    body: unknown,
    signal?: AbortSignal,
  ): Promise<T> => {
    const payload = await request<{ data: T }>(`/${resource}`, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      signal,
    })
    const result = payload.data
    try {
      crudBus.emit({
        resource,
        id: String(
          (result as { id?: string; _id?: string })?.id ?? (result as { _id?: string })?._id ?? '',
        ),
        action: 'create',
        afterData: result,
        at: Date.now(),
      })
    } catch {
      /* ignore */
    }
    return result
  }

  const update = async <T = Record<string, unknown>>(
    resource: string,
    id: string,
    body: unknown,
    signal?: AbortSignal,
  ): Promise<T> => {
    let beforeData: T | null = null
    try {
      beforeData = await getById<T>(resource, id, signal)
    } catch {
      /* ignore */
    }
    const payload = await request<{ data: T }>(`/${resource}/${id}`, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      signal,
    })
    const result = payload.data
    try {
      crudBus.emit({
        resource,
        id: String(id),
        action: 'update',
        beforeData,
        afterData: result,
        at: Date.now(),
      })
    } catch {
      /* ignore */
    }
    return result
  }

  const remove = async (resource: string, id: string, signal?: AbortSignal): Promise<void> => {
    let beforeData: Record<string, unknown> | null = null
    try {
      beforeData = await getById(resource, id, signal)
    } catch {
      /* ignore */
    }
    await request<void>(`/${resource}/${id}`, {
      method: 'DELETE',
      signal,
    })
    try {
      crudBus.emit({
        resource,
        id: String(id),
        action: 'delete',
        beforeData,
        at: Date.now(),
      })
    } catch {
      /* ignore */
    }
  }

  return {
    list,
    getById,
    create,
    update,
    remove,
  }
}
