import { reactive, readonly, computed } from "vue";
// import { useMovieService } from '@/composables/useMovieService'
import { useApiGateway } from "@/utils/useApiGateway";
import type { UiConfig } from "@/types/ui-config";

export interface GetUiConfigOptions {
  force?: boolean;
  signal?: AbortSignal;
}

type UiConfigState = {
  configs: Record<string, UiConfig>;
  initialized: boolean;
  loading: boolean;
  error: string | null;
};

const state = reactive<UiConfigState>({
  configs: {},
  initialized: false,
  loading: false,
  error: null,
});

const LOCAL_STORAGE_KEY = "admin-ui:configs";

const configFromLocal = (() => {
  const env: any = (import.meta as any).env || {};
  return (
    env?.VITE_ADMIN_UI_CONFIG_FROM_LOCAL === "true" ||
    env?.VITE_ADMIN_UI_CONFIG_FROM_LOCAL === true
  );
})();
const localPath = (() => {
  const env: any = (import.meta as any).env || {};
  // Path to modules index file served from public. Default to /ui-configs/index.json
  return env?.VITE_ADMIN_UI_CONFIG_LOCAL_PATH || "/ui-configs/index.json";
})();

// Shared singleton cache across composable instances
type AdminModuleInfo = {
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
  path: string;
};
let cachedModules: AdminModuleInfo[] | null = null;
let modulesPromise: Promise<AdminModuleInfo[]> | null = null;

export function useUiConfig() {
  // movie service kept available for future extension; not used in current flow
  // const movie = useMovieService()
  const api = useApiGateway();

  const loadFromCache = () => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        const incoming = parsed as Record<string, any>;
        const normalized: Record<string, UiConfig> = {};
        let mutated = false;
        for (const [mod, cfg] of Object.entries(incoming)) {
          const flat =
            cfg && typeof cfg === "object" && "config" in cfg
              ? (cfg as any).config
              : cfg;
          if (flat !== cfg) mutated = true;
          normalized[mod] = flat as UiConfig;
        }
        state.configs = normalized;
        if (mutated) saveToCache();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveToCache = () => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.configs));
    } catch {
      /* ignore */
    }
  };

  const setConfig = (moduleName: string, cfg: UiConfig) => {
    state.configs[moduleName] = cfg;
    saveToCache();
  };

  const getConfig = (moduleName: string): UiConfig | null => {
    return state.configs[moduleName] || null;
  };
  const modules = computed(() => Object.keys(state.configs));

  const fetchconfigFromLocal = async (
    moduleName: string,
    signal?: AbortSignal,
  ): Promise<UiConfig | null> => {
    const res = await fetch(`/ui-configs/${moduleName}.json`, {
      cache: "no-store",
      signal,
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!/application\/json/.test(contentType)) return null;
    try {
      return (await res.json()) as UiConfig;
    } catch {
      return null;
    }
  };

  const listModules = async (
    opts: { force?: boolean; signal?: AbortSignal } = {},
  ): Promise<AdminModuleInfo[]> => {
    if (!opts.force && cachedModules) return cachedModules;
    if (!opts.force && modulesPromise) return modulesPromise;
    modulesPromise = (async () => {
      // Try local index first
      try {
        const res = await fetch(localPath, {
          cache: "no-store",
          signal: opts.signal,
        });
        if (res.ok) {
          const contentType = res.headers.get("content-type") || "";
          if (!/application\/json/.test(contentType)) {
            return cachedModules ?? [];
          }
          const json = await res.json().catch(() => null);
          const modules = Array.isArray(json?.modules) ? json.modules : [];
          if (modules.length > 0) {
            cachedModules = modules as AdminModuleInfo[];
            return cachedModules;
          }
        }
      } catch {
        /* ignore */
      }
      if (configFromLocal) {
        // local-only mode: do not hit backend
        return cachedModules ?? [];
      }
      // Fallback to backend
      try {
        const res = await api.request(`/api/admin-ui/modules`, {
          method: "GET",
          signal: opts.signal,
        });
        if (!res.ok) return cachedModules ?? [];
        const contentType = res.headers.get("content-type") || "";
        if (!/application\/json/.test(contentType)) return cachedModules ?? [];
        const payload = await res.json().catch(() => null);
        const modules = Array.isArray(payload?.modules) ? payload.modules : [];
        cachedModules = modules as AdminModuleInfo[];
        return cachedModules;
      } catch {
        return cachedModules ?? [];
      }
    })();
    const result = await modulesPromise;
    modulesPromise = null;
    return result;
  };

  const get = async (
    moduleName: string,
    opts: GetUiConfigOptions = {},
  ): Promise<UiConfig | null> => {
    if (!opts.force) {
      const cached = getConfig(moduleName);
      if (cached) return cached;
    }

    // Try local JSON next
    const localCfg = await fetchconfigFromLocal(moduleName, opts.signal);
    if (localCfg) {
      setConfig(moduleName, localCfg);
      return localCfg;
    }

    // Fallback to backend
    try {
      const res = await api.request(
        `/api/admin-ui/modules/${moduleName}/config`,
        { method: "GET", signal: opts.signal },
      );
      if (!res.ok) return null;
      const contentType = res.headers.get("content-type") || "";
      if (!/application\/json/.test(contentType)) return null;
      const payload = await res.json().catch(() => null);
      const cfg = (payload as any)?.config ?? payload;
      if (cfg) setConfig(moduleName, cfg);
      return cfg ?? null;
    } catch {
      return null;
    }
  };

  const init = async (opts: { force?: boolean } = {}) => {
    if (state.initialized && !opts.force) return;
    state.loading = true;
    state.error = null;
    try {
      if (!opts.force) {
        loadFromCache();
        if (Object.keys(state.configs).length > 0) {
          state.initialized = true;
          return;
        }
      }
      // Load module list via unified helper
      let moduleNames: string[] = [];
      const moduleInfos = await listModules({ force: true });
      moduleNames = moduleInfos.map((m) => m.name);

      // Load each module's UI config based on env preference
      for (const name of moduleNames) {
        if (!name) continue;
        if (configFromLocal) {
          const cfg = await fetchconfigFromLocal(name);
          if (cfg) {
            setConfig(name, cfg);
            continue;
          }
        }
        try {
          const res = await api.request(
            `/api/admin-ui/modules/${name}/config`,
            { method: "GET" },
          );
          if (res.ok) {
            const contentType = res.headers.get("content-type") || "";
            if (/application\/json/.test(contentType)) {
              const payload = await res.json().catch(() => null);
              const remoteCfg = (payload as any)?.config ?? payload;
              if (remoteCfg) setConfig(name, remoteCfg as any);
            }
          }
        } catch {
          /* ignore single module failure */
        }
      }
      state.initialized = true;
    } catch (e: any) {
      state.error = e?.message || "Failed to initialize UI configs";
    } finally {
      state.loading = false;
    }
  };

  return { get, modules, init, listModules, state: readonly(state) };
}
