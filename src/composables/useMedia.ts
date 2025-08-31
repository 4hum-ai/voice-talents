import { ref, computed, readonly } from "vue";
import { useMovieService } from "@/composables/useMovieService";
import { useToast } from "@/composables/useToast";

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MediaItem {
  id: string;
  type: string;
  format: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  duration?: number;
  contentType: string;
  status?: string;
  language?: string;
  uploadUrl?: string;
  uploadExpiresAt?: string | Date;
  bucket?: string;
  path?: string;
}

function transformPaginatedResponse<T>(response: any): PaginatedResponse<T> {
  const pg = response?.pagination ?? {};
  const page = Number(pg.page ?? response?.page ?? 1) || 1;
  const limit = Number(pg.limit ?? response?.limit ?? 20) || 20;
  const total = Number(pg.total ?? response?.total ?? 0) || 0;
  const totalPages =
    Number(
      pg.totalPages ?? response?.totalPages ?? Math.ceil(total / (limit || 1)),
    ) || Math.max(1, Math.ceil(total / (limit || 1)));
  return {
    data: (response?.data || []) as T[],
    pagination: { page, limit, total, totalPages },
  };
}

export function useMedia() {
  const { listModuleItems, createModuleItem, updateModuleItem } =
    useMovieService();
  const { push } = useToast();

  const media = ref<MediaItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentPage = ref(1);
  const totalPages = ref(0);

  const hasMedia = computed(() => media.value.length > 0);
  const isFirstPage = computed(() => currentPage.value <= 1);
  const isLastPage = computed(() => currentPage.value >= totalPages.value);

  const fetchMedia = async (options?: {
    search?: string;
    filters?: Record<string, any>;
  }) => {
    try {
      loading.value = true;
      error.value = null;
      const params: Record<string, any> = {
        page: currentPage.value,
        limit: 20,
      };
      if (options?.search) params.search = options.search;
      if (options?.filters) Object.assign(params, options.filters);

      const raw = await listModuleItems("media", params);
      const result: PaginatedResponse<MediaItem> =
        transformPaginatedResponse<MediaItem>(raw);
      media.value = result.data as MediaItem[];
      totalPages.value = result.pagination.totalPages;
    } catch (err: any) {
      const message = err?.message || "Failed to fetch media";
      error.value = message;
      push({
        id: `${Date.now()}-media-fetch` as any,
        type: "error",
        title: "Failed to load media",
        body: message,
        position: "tr",
        timeout: 6000,
      });
    } finally {
      loading.value = false;
    }
  };

  const nextPage = async () => {
    if (isLastPage.value) return;
    currentPage.value += 1;
    await fetchMedia();
  };

  const previousPage = async () => {
    if (isFirstPage.value) return;
    currentPage.value -= 1;
    await fetchMedia();
  };

  async function createMediaRecord(params: {
    fileName: string;
    contentType: string;
    fileSize?: number;
    duration?: number;
    type: string; // domain-specific (e.g., poster, trailer, dubbed)
    format: string; // extension-like (e.g., mp4, png)
    language?: string;
    description?: string;
    tags?: string[];
    relationships?: string[]; // ["entityType:entityId:relationshipType"]
    metadata?: Record<string, any>;
  }): Promise<MediaItem> {
    const payload = {
      ...params,
      tags: params.tags || [],
      relationships: params.relationships || [],
      metadata: params.metadata || {},
    };
    const created = (await createModuleItem("media", payload)) as MediaItem;
    return created;
  }

  async function uploadFileToSignedUrl(options: {
    uploadUrl: string;
    file: File | Blob;
    contentType: string;
    onProgress?: (percent: number) => void;
  }): Promise<Response> {
    const { uploadUrl, file, contentType } = options;
    // Fetch PUT to signed URL. Native fetch lacks progress; for now, do a single PUT.
    return await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: file,
    });
  }

  async function uploadViaMediaModule(
    file: File,
    opts: {
      type?: string;
      format?: string;
      language?: string;
      description?: string;
      tags?: string[];
      relationships?: string[];
      metadata?: Record<string, any>;
      duration?: number;
      markCompleted?: boolean;
    } = {},
  ): Promise<{ media: MediaItem; fileUrl: string }> {
    const type = opts.type || "poster";
    const extension = (file.name.split(".").pop() || "").toLowerCase();
    const format = (opts.format || extension || "bin").toLowerCase();
    const contentType = file.type || "application/octet-stream";

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
    });

    if (!mediaRecord.uploadUrl) {
      throw new Error("Upload URL missing from media record");
    }

    const res = await uploadFileToSignedUrl({
      uploadUrl: mediaRecord.uploadUrl,
      file,
      contentType,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Upload failed (${res.status}): ${text.slice(0, 160)}`);
    }

    // Always try to complete the upload to finalize metadata
    try {
      await updateModuleItem("media", mediaRecord.id, {
        status: "completed",
        fileSize: file.size,
      });
    } catch (err: any) {
      const message = err?.message || "Failed to complete upload";
      push({
        id: `${Date.now()}-media-complete` as any,
        type: "error",
        title: "Upload completion failed",
        body: message,
        position: "tr",
        timeout: 6000,
      });
      // Do not throw to avoid breaking the caller; metadata can be retried later
    }

    return { media: mediaRecord, fileUrl: mediaRecord.fileUrl };
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
    // upload helpers
    uploadViaMediaModule,
  };
}
