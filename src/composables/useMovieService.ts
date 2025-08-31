import { useApiGateway } from "@/utils/useApiGateway";
import { useEventBus, type CrudEventPayload } from "./useEventBus";

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminModuleInfo {
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
  path: string;
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

// Module-level singletons (persist across composable calls, per tab)
// UI Config caching moved to useUiConfig
// const singletonUiConfig = new Map<string, any>()
// const singletonAdminModules: { data: AdminModuleInfo[] | null } = { data: null }

export function useMovieService() {
  const client = useApiGateway();
  const bus = useEventBus();
  // Keep service focused on API calls only; local UI config handling resides in useUiConfig

  const checkConnection = async (): Promise<boolean> => {
    try {
      const base = (client as any).baseUrl as string | undefined;
      const response = await fetch(`${base}/health`, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        signal: (AbortSignal as any).timeout
          ? (AbortSignal as any).timeout(5000)
          : undefined,
      });
      return response.ok;
    } catch {
      return false;
    }
  };

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
          "Unable to reach Movie Service. Check connectivity and URL.",
          error,
        );
      }
      throw error;
    }
  };

  const get = <T>(
    endpoint: string,
    params?: Record<string, any>,
    signal?: AbortSignal,
  ): Promise<T> => {
    const toSearchParams = (input: Record<string, any>): URLSearchParams => {
      const search = new URLSearchParams();
      const append = (key: string, value: any) => {
        if (value === undefined || value === null) return;
        if (value instanceof Date) {
          search.append(key, value.toISOString());
        } else if (Array.isArray(value)) {
          // Join arrays by comma for $in / $between and similar cases
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
        // Object: recurse with bracket notation e.g. filters[field][$gte]
        Object.entries(value).forEach(([k, v]) => build(`${prefix}[${k}]`, v));
      };
      Object.entries(input).forEach(([k, v]) => build(k, v));
      return search;
    };
    const search = params ? toSearchParams(params) : new URLSearchParams();
    const q = search.toString();
    const path = q ? `${endpoint}?${q}` : endpoint;
    return request<T>(path, { signal });
  };

  const post = <T>(
    endpoint: string,
    data?: any,
    signal?: AbortSignal,
  ): Promise<T> =>
    request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      signal,
    });
  const put = <T>(
    endpoint: string,
    data?: any,
    signal?: AbortSignal,
  ): Promise<T> =>
    request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      signal,
    });
  const del = <T>(endpoint: string, signal?: AbortSignal): Promise<T> =>
    request<T>(endpoint, { method: "DELETE", signal });

  const listModuleItems = async (
    module: string,
    params?: Record<string, any>,
    signal?: AbortSignal,
  ): Promise<PaginatedResponse<any>> => {
    const payload = await get<any>(`/api/${module}`, params, signal);
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

  const getModuleItem = async (
    module: string,
    id: string,
    signal?: AbortSignal,
  ): Promise<any> => {
    const payload = await get<any>(`/api/${module}/${id}`, undefined, signal);
    return payload?.data ?? payload;
  };

  // getModuleUiConfig moved to useUiConfig

  const createModuleItem = async (
    module: string,
    data: any,
    signal?: AbortSignal,
  ): Promise<any> => {
    const result = (await post<any>(`/api/${module}`, data, signal)).data;
    try {
      const payload: CrudEventPayload = {
        module,
        id: String(result?.id ?? result?._id ?? ""),
        action: "create",
        afterData: result,
        at: Date.now(),
      };
      bus.emit("crud", payload);
    } catch { /* ignore */ }
    return result;
  };
  const updateModuleItem = async (
    module: string,
    id: string,
    data: any,
    signal?: AbortSignal,
  ): Promise<any> => {
    let beforeData: any = null;
    try {
      beforeData = await getModuleItem(module, id, signal);
    } catch { /* ignore */ }
    const result = (await put<any>(`/api/${module}/${id}`, data, signal)).data;
    try {
      const payload: CrudEventPayload = {
        module,
        id: String(id),
        action: "update",
        beforeData,
        afterData: result,
        at: Date.now(),
      };
      bus.emit("crud", payload);
    } catch { /* ignore */ }
    return result;
  };
  const deleteModuleItem = async (
    module: string,
    id: string,
    signal?: AbortSignal,
  ): Promise<void> => {
    let beforeData: any = null;
    try {
      beforeData = await getModuleItem(module, id, signal);
    } catch { /* ignore */ }
    await del<void>(`/api/${module}/${id}`, signal);
    try {
      const payload: CrudEventPayload = {
        module,
        id: String(id),
        action: "delete",
        beforeData,
        at: Date.now(),
      };
      bus.emit("crud", payload);
    } catch { /* ignore */ }
  };

  return {
    checkConnection,
    listModuleItems,
    getModuleItem,
    createModuleItem,
    updateModuleItem,
    deleteModuleItem,
  };
}
