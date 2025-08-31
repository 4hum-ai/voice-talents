import { useApiGateway } from "@/utils/useApiGateway";
import { useEventBus } from "@vueuse/core";
import { EVENT_CRUD, type CrudEventPayload } from "@/types/events";

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ConnectionError extends Error {
  constructor(
    message: string,
    public originalError?: Error,
  ) {
    super(message);
    this.name = "ConnectionError";
  }
}

export function useResourceService(base: string = "movie") {
  const client = useApiGateway(base);
  const crudBus = useEventBus<CrudEventPayload>(EVENT_CRUD);

  const request = async <T>(
    endpoint: string,
    options: RequestInit & { signal?: AbortSignal } = {},
  ): Promise<T> => {
    try {
      const res = await client.request(endpoint, options);
      if (!res.ok) {
        let message = `HTTP error! status: ${res.status}`;
        const contentType = res.headers.get("content-type") || "";
        if (/application\/json/.test(contentType)) {
          try {
            const err = await res.json();
            message = err.message || err.error || message;
          } catch {
            void 0;
          }
        } else {
          const text = await res.text().catch(() => "");
          if (text?.startsWith("<!doctype") || text?.startsWith("<!DOCTYPE")) {
            message =
              "Received HTML from server. Check VITE_PUBLIC_API_URL; the dev server likely returned index.html for a bad URL.";
          }
        }
        throw new Error(message);
      }
      const contentType = res.headers.get("content-type") || "";
      if (!/application\/json/.test(contentType)) {
        const text = await res.text().catch(() => "");
        throw new Error(
          "Server returned non-JSON response. Verify API base URL and endpoint. Sample: " +
            text.slice(0, 120),
        );
      }
      return await res.json();
    } catch (error: any) {
      if (
        error?.name === "AbortError" ||
        /Failed to fetch|NetworkError/.test(String(error))
      ) {
        throw new ConnectionError(
          "Unable to reach API. Check connectivity and URL.",
          error,
        );
      }
      throw error;
    }
  };

  const get = <T>(
    endpoint: string,
    query?: Record<string, any>,
    signal?: AbortSignal,
  ): Promise<T> => {
    const toSearchParams = (input: Record<string, any>): URLSearchParams => {
      const search = new URLSearchParams();
      const append = (key: string, value: any) => {
        if (value === undefined || value === null) return;
        if (value instanceof Date) {
          search.append(key, value.toISOString());
        } else if (Array.isArray(value)) {
          search.append(key, value.map((v) => String(v)).join(","));
        } else {
          search.append(key, String(value));
        }
      };
      const build = (prefix: string, value: any) => {
        if (value === undefined || value === null) return;
        if (
          value instanceof Date ||
          typeof value !== "object" ||
          Array.isArray(value)
        ) {
          append(prefix, value);
          return;
        }
        Object.entries(value).forEach(([k, v]) => build(`${prefix}[${k}]`, v));
      };
      Object.entries(input).forEach(([k, v]) => build(k, v));
      return search;
    };
    const search = query ? toSearchParams(query) : new URLSearchParams();
    const q = search.toString();
    const path = q ? `${endpoint}?${q}` : endpoint;
    return request<T>(path, { signal });
  };

  const post = <T>(
    endpoint: string,
    body?: any,
    signal?: AbortSignal,
  ): Promise<T> =>
    request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  const put = <T>(
    endpoint: string,
    body?: any,
    signal?: AbortSignal,
  ): Promise<T> =>
    request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  const del = <T>(endpoint: string, signal?: AbortSignal): Promise<T> =>
    request<T>(endpoint, { method: "DELETE", signal });

  const list = async (
    resource: string,
    query?: Record<string, any>,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<any>> => {
    const payload = await get<any>(`/api/${resource}`, query, signal);
    const pg = payload?.pagination ?? {};
    const page = Number(pg.page ?? payload.page ?? 1) || 1;
    const limit = Number(pg.limit ?? payload.limit ?? 20) || 20;
    const total = Number(pg.total ?? payload.total ?? 0) || 0;
    const totalPages =
      Number(
        pg.totalPages ?? payload.totalPages ?? Math.ceil(total / (limit || 1)),
      ) || Math.max(1, Math.ceil(total / (limit || 1)));
    return {
      data: payload.data || [],
      pagination: { page, limit, total, totalPages },
    };
  };

  const getById = async (
    resource: string,
    id: string,
    signal?: AbortSignal,
  ): Promise<any> => {
    const payload = await get<any>(`/api/${resource}/${id}`, undefined, signal);
    return payload?.data ?? payload;
  };

  const create = async (
    resource: string,
    body: any,
    signal?: AbortSignal,
  ): Promise<any> => {
    const result = (await post<any>(`/api/${resource}`, body, signal)).data;
    try {
      crudBus.emit({
        resource,
        id: String(result?.id ?? result?._id ?? ""),
        action: "create",
        afterData: result,
        at: Date.now(),
      });
    } catch {
      /* ignore */
    }
    return result;
  };

  const update = async (
    resource: string,
    id: string,
    body: any,
    signal?: AbortSignal,
  ): Promise<any> => {
    let beforeData: any = null;
    try {
      beforeData = await getById(resource, id, signal);
    } catch {
      /* ignore */
    }
    const result = (await put<any>(`/api/${resource}/${id}`, body, signal))
      .data;
    try {
      crudBus.emit({
        resource,
        id: String(id),
        action: "update",
        beforeData,
        afterData: result,
        at: Date.now(),
      });
    } catch {
      /* ignore */
    }
    return result;
  };

  const remove = async (
    resource: string,
    id: string,
    signal?: AbortSignal,
  ): Promise<void> => {
    let beforeData: any = null;
    try {
      beforeData = await getById(resource, id, signal);
    } catch {
      /* ignore */
    }
    await del<void>(`/api/${resource}/${id}`, signal);
    try {
      crudBus.emit({
        resource,
        id: String(id),
        action: "delete",
        beforeData,
        at: Date.now(),
      });
    } catch {
      /* ignore */
    }
  };

  return {
    list,
    getById,
    create,
    update,
    remove,
  };
}
