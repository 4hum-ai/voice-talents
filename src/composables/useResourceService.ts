import { useApiGateway } from "@/utils/useApiGateway";
import { useEventBus } from "@vueuse/core";
import { EVENT_CRUD, type CrudEventPayload } from "@/types/events";
import type { ResourceQuery } from "@/types/query";
import { ref, computed } from "vue";

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

// Common resource types - extend this as needed
export type ResourceType = "titles" | "organizations" | string; // Allow custom resources

export function useResourceService(base: string = "movie/api") {
  const client = useApiGateway(base);
  const crudBus = useEventBus<CrudEventPayload>(EVENT_CRUD);

  // Loading state management
  const loadingStates = ref<Record<string, boolean>>({});

  const isLoading = computed(() =>
    Object.values(loadingStates.value).some(Boolean),
  );

  const setLoading = (operation: string, loading: boolean) => {
    if (loading) {
      loadingStates.value[operation] = true;
    } else {
      delete loadingStates.value[operation];
    }
  };

  const isOperationLoading = (operation: string) =>
    loadingStates.value[operation] || false;

  // Reactive data management
  const items = ref<any[]>([]);
  const item = ref<any>(null);
  const pagination = ref<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const error = ref<string | null>(null);

  // Computed helpers
  const hasItems = computed(() => items.value.length > 0);
  const isEmpty = computed(() => !isLoading.value && items.value.length === 0);
  const hasError = computed(() => error.value !== null);

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

  // Removed helper methods (get/post/put/del) in favor of direct request usage

  const list = async (
    resource: ResourceType,
    query?: ResourceQuery,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<any>> => {
    const operation = `list:${resource}`;
    setLoading(operation, true);
    error.value = null;
    try {
      const toSearchParams = (input: ResourceQuery): URLSearchParams => {
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
          Object.entries(value).forEach(([k, v]) =>
            build(`${prefix}[${k}]`, v),
          );
        };
        Object.entries(input).forEach(([k, v]) => build(k, v));
        return search;
      };
      const search = query ? toSearchParams(query) : new URLSearchParams();
      const q = search.toString();
      const path = q ? `/${resource}?${q}` : `/${resource}`;
      const payload = await request<any>(path, { signal });
      const pg = payload?.pagination ?? {};
      const page = Number(pg.page ?? payload.page ?? 1) || 1;
      const limit = Number(pg.limit ?? payload.limit ?? 20) || 20;
      const total = Number(pg.total ?? payload.total ?? 0) || 0;
      const totalPages =
        Number(
          pg.totalPages ??
            payload.totalPages ??
            Math.ceil(total / (limit || 1)),
        ) || Math.max(1, Math.ceil(total / (limit || 1)));

      const result = {
        data: payload.data || [],
        pagination: { page, limit, total, totalPages },
      };

      // Update reactive data
      items.value = result.data;
      pagination.value = result.pagination;

      return result;
    } catch (err: any) {
      error.value = err?.message || "Failed to load data";
      throw err;
    } finally {
      setLoading(operation, false);
    }
  };

  const getById = async (
    resource: ResourceType,
    id: string,
    signal?: AbortSignal,
  ): Promise<any> => {
    const operation = `get:${resource}:${id}`;
    setLoading(operation, true);
    error.value = null;
    try {
      const payload = await request<any>(`/${resource}/${id}`, { signal });
      const result = payload?.data ?? payload;

      // Update reactive data
      item.value = result;

      return result;
    } catch (err: any) {
      error.value = err?.message || "Failed to load item";
      throw err;
    } finally {
      setLoading(operation, false);
    }
  };

  const create = async (
    resource: ResourceType,
    body: any,
    signal?: AbortSignal,
  ): Promise<any> => {
    const operation = `create:${resource}`;
    setLoading(operation, true);
    error.value = null;
    try {
      const payload = await request<any>(`/${resource}`, {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
        signal,
      });
      const result = payload.data;

      // Update reactive data - add to items list
      items.value.unshift(result);
      pagination.value.total += 1;

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
    } catch (err: any) {
      error.value = err?.message || "Failed to create item";
      throw err;
    } finally {
      setLoading(operation, false);
    }
  };

  const update = async (
    resource: ResourceType,
    id: string,
    body: any,
    signal?: AbortSignal,
  ): Promise<any> => {
    const operation = `update:${resource}:${id}`;
    setLoading(operation, true);
    error.value = null;
    try {
      let beforeData: any = null;
      try {
        beforeData = await getById(resource, id, signal);
      } catch {
        /* ignore */
      }
      const payload = await request<any>(`/${resource}/${id}`, {
        method: "PUT",
        body: body ? JSON.stringify(body) : undefined,
        signal,
      });
      const result = payload.data;

      // Update reactive data
      if (item.value?.id === id || item.value?._id === id) {
        item.value = result;
      }

      // Update in items list if present
      const itemIndex = items.value.findIndex(
        (i: any) => i.id === id || i._id === id,
      );
      if (itemIndex !== -1) {
        items.value[itemIndex] = result;
      }

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
    } catch (err: any) {
      error.value = err?.message || "Failed to update item";
      throw err;
    } finally {
      setLoading(operation, false);
    }
  };

  const remove = async (
    resource: ResourceType,
    id: string,
    signal?: AbortSignal,
  ): Promise<void> => {
    const operation = `delete:${resource}:${id}`;
    setLoading(operation, true);
    error.value = null;
    try {
      let beforeData: any = null;
      try {
        beforeData = await getById(resource, id, signal);
      } catch {
        /* ignore */
      }
      await request<void>(`/${resource}/${id}`, {
        method: "DELETE",
        signal,
      });

      // Update reactive data
      if (item.value?.id === id || item.value?._id === id) {
        item.value = null;
      }

      // Remove from items list
      const itemIndex = items.value.findIndex(
        (i: any) => i.id === id || i._id === id,
      );
      if (itemIndex !== -1) {
        items.value.splice(itemIndex, 1);
        pagination.value.total = Math.max(0, pagination.value.total - 1);
      }

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
    } catch (err: any) {
      error.value = err?.message || "Failed to delete item";
      throw err;
    } finally {
      setLoading(operation, false);
    }
  };

  // Utility methods for data management
  const clearError = () => {
    error.value = null;
  };

  const clearData = () => {
    items.value = [];
    item.value = null;
    pagination.value = {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    };
    error.value = null;
  };

  return {
    // Methods
    list,
    getById,
    create,
    update,
    remove,

    // Loading state utilities
    isLoading,
    isOperationLoading,

    // Reactive data
    items,
    item,
    pagination,
    error,

    // Computed helpers
    hasItems,
    isEmpty,
    hasError,

    // Utility methods
    clearError,
    clearData,
  };
}
