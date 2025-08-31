<template>
  <div>
    <AppBar :loading="loadingCounts">
      <template #title>
        Hi, {{ auth.user?.displayName || auth.user?.email || "there" }}
      </template>
      <template #subtitle>
        You are logged in as {{ auth.user?.email || "—" }}
      </template>
      <template #actions>
        <div class="flex flex-wrap items-center gap-3 sm:flex-nowrap">
          <div class="w-full sm:w-64">
            <label class="sr-only" for="module-search">Search modules</label>
            <SearchInput
              id="module-search"
              v-model="filter"
              placeholder="Search modules…"
            />
          </div>
          <ActionsMenu :items="menuItems" @select="onMenuSelect" />
        </div>
      </template>
    </AppBar>
    <div class="h-4" />
    <main class="p-6">
      <section v-if="isLoading" class="mt-6">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="i in 6"
            :key="i"
            class="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="flex animate-pulse items-start gap-3">
              <div
                class="h-10 w-10 flex-none rounded-md bg-gray-200 dark:bg-gray-700"
              />
              <div class="flex-1 space-y-2">
                <div class="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
                <div class="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="visibleModules.length === 0" class="mt-6">
        <div
          class="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          <div
            class="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700"
          >
            <svg
              class="h-5 w-5 text-gray-400 dark:text-gray-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m21 21-4.35-4.35m0-6.4a6.4 6.4 0 1 1-12.8 0 6.4 6.4 0 0 1 12.8 0Z"
              />
            </svg>
          </div>
          <div v-if="filter">No modules match “{{ filter }}”.</div>
          <div v-else>No modules available.</div>
        </div>
      </section>

      <section v-else>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <router-link
            v-for="m in visibleModules"
            :key="m.name"
            :to="`/${m.name}`"
            class="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:shadow-none dark:hover:shadow-md"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-3">
                <div class="h-10 w-10 flex-none overflow-hidden">
                  <div class="grid h-full w-full place-items-center">
                    <Avatar
                      :label="m.displayName || toTitle(m.name)"
                      :seed="m.name"
                      shape="square"
                    />
                  </div>
                </div>
                <div>
                  <h3
                    class="text-base font-semibold text-gray-900 dark:text-gray-100"
                  >
                    {{ m.displayName || toTitle(m.name) }}
                  </h3>
                  <p
                    v-if="m.description"
                    class="mt-1 text-sm text-gray-500 dark:text-gray-400"
                  >
                    {{ m.description }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <div
                  v-if="countsLoading[m.name]"
                  class="flex h-7 items-center justify-end"
                >
                  <LoadingIcon
                    class="h-5 w-5 animate-spin text-gray-400 dark:text-gray-300"
                    aria-hidden="true"
                  />
                </div>
                <div
                  v-else
                  class="text-2xl font-bold text-gray-900 dark:text-gray-100"
                >
                  {{ formatCount(counts[m.name]) }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Total
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </section>

      <section class="mt-10 space-y-6">
        <div class="grid gap-4 lg:grid-cols-2">
          <div
            class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <h2
              class="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100"
            >
              Recent visits
            </h2>
            <div
              v-if="recentVisits.length === 0"
              class="text-sm text-gray-500 dark:text-gray-400"
            >
              No recent visits yet.
            </div>
            <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
              <li
                v-for="v in recentVisits"
                :key="`${v.module}:${v.id}`"
                class="flex items-center justify-between gap-3 py-2"
              >
                <div class="min-w-0">
                  <div
                    class="truncate text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    {{ labelFor(v.module, v.data) }}
                  </div>
                  <div
                    class="truncate text-xs text-gray-500 dark:text-gray-400"
                  >
                    {{ v.module }} • {{ formatTimeAgo(v.lastVisited) }} •
                    {{ v.count }}×
                  </div>
                </div>
                <button
                  class="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-700"
                  @click="openItem(v.module, v.id)"
                >
                  Open
                </button>
              </li>
            </ul>
          </div>

          <div
            class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <h2
              class="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100"
            >
              Recent activities
            </h2>
            <div
              v-if="recentActivities.length === 0"
              class="text-sm text-gray-500 dark:text-gray-400"
            >
              No recent activities yet.
            </div>
            <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
              <li
                v-for="a in recentActivities"
                :key="`${a.module}:${a.id}:${a.at}`"
                class="flex items-center justify-between gap-3 py-2"
              >
                <div class="min-w-0">
                  <div
                    class="truncate text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    <span
                      :class="[
                        'mr-2 inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium',
                        actionBadgeClass(a.action),
                      ]"
                      >{{ a.action }}</span
                    >
                    {{ labelFor(a.module, a.afterData || a.beforeData) }}
                  </div>
                  <div
                    class="truncate text-xs text-gray-500 dark:text-gray-400"
                  >
                    {{ a.module }} • {{ formatTimeAgo(a.at) }}
                  </div>
                </div>
                <button
                  class="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-700"
                  @click="onRevert(a)"
                >
                  Revert
                </button>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "Dashboard" });
import { onMounted, ref, computed } from "vue";
import ActionsMenu from "@/components/atoms/ActionsMenu.vue";
import AppBar from "@/components/molecules/AppBar.vue";
import Avatar from "@/components/atoms/Avatar.vue";
import SearchInput from "@/components/atoms/SearchInput.vue";
import {
  useMovieService,
  type AdminModuleInfo,
} from "@/composables/useMovieService";
import { useUiConfig } from "@/composables/useUiConfig";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { useTheme } from "@/composables/useTheme";
import LoadingIcon from "~icons/mdi/loading";
import { useActivity } from "@/composables/useActivity";
import { useEventBus } from "@/composables/useEventBus";

// Intentionally not using router routes for modules; rely on admin-ui modules API

// Connection health check removed as it's low value for UX
const movie = useMovieService();
const uiConfig = useUiConfig();
const auth = useAuthStore();
const router = useRouter();
const { isDark, toggleTheme } = useTheme();
const activity = useActivity();
const { on: onBus } = useEventBus();

const counts = ref<Record<string, number | null>>({});
const countsLoading = ref<Record<string, boolean>>({});
const adminModules = ref<AdminModuleInfo[]>([]);
const loadingCounts = ref(false);
const loadingModules = ref(true);
const filter = ref("");
const isLoading = computed(() => loadingModules.value);

const toTitle = (value: string): string => {
  const base = value.replace(/^\//, "").replace(/-/g, " ");
  return base.charAt(0).toUpperCase() + base.slice(1);
};

const formatCount = (n: number | null | undefined): string => {
  if (n === null || n === undefined) return "—";
  return new Intl.NumberFormat().format(n);
};

const visibleModules = computed(() => {
  const q = filter.value.trim().toLowerCase();
  const mods = q
    ? adminModules.value.filter((m) => {
        const name = (m.displayName || m.name).toLowerCase();
        const desc = (m.description || "").toLowerCase();
        return name.includes(q) || desc.includes(q);
      })
    : adminModules.value.slice();

  return mods.sort((a, b) => {
    const an = (a.displayName || a.name).toLowerCase();
    const bn = (b.displayName || b.name).toLowerCase();
    return an.localeCompare(bn);
  });
});

const loadCounts = async () => {
  loadingCounts.value = true;
  try {
    if (adminModules.value.length === 0) {
      try {
        adminModules.value = await uiConfig.listModules();
      } catch {
        adminModules.value = [];
      }
    }
    const mods = adminModules.value.map((m) => m.name);
    // Prime placeholders
    const seed: Record<string, number | null> = {};
    mods.forEach((m) => (seed[m] = null));
    counts.value = seed;
    const loadingSeed: Record<string, boolean> = {};
    mods.forEach((m) => (loadingSeed[m] = true));
    countsLoading.value = loadingSeed;
    // Limit concurrency to avoid overwhelming API if many modules
    const queue = mods.slice();
    const workers = Array.from({ length: 4 }).map(async () => {
      while (queue.length) {
        const mod = queue.shift()!;
        try {
          const res = await movie.listModuleItems(mod, { page: 1, limit: 1 });
          counts.value[mod] = res.pagination.total;
        } catch {
          counts.value[mod] = null;
        } finally {
          countsLoading.value[mod] = false;
        }
      }
    });
    await Promise.all(workers);
  } finally {
    loadingCounts.value = false;
  }
};

// No connection check

const menuItems = computed(() => [
  {
    key: "refresh-stats",
    label: loadingCounts.value ? "Refreshing…" : "Refresh Stats",
  },
  {
    key: "toggle-theme",
    label: isDark.value ? "Switch to Light" : "Switch to Dark",
  },
  { key: "logout", label: "Logout" },
]);

const onMenuSelect = async (key: string) => {
  if (key === "refresh-stats") {
    await loadCounts();
  } else if (key === "toggle-theme") {
    toggleTheme();
  } else if (key === "logout") {
    await auth.logoutUser();
    await router.push({ name: "Auth" });
  }
};

onMounted(async () => {
  loadingModules.value = true;
  try {
    adminModules.value = await uiConfig.listModules();
  } catch {
    adminModules.value = [];
  } finally {
    loadingModules.value = false;
  }
  await loadCounts();
  refreshActivityLists();
  try {
    onBus("visits:updated", () => refreshActivityLists());
    onBus("activities:updated", () => refreshActivityLists());
  } catch {
    /* ignore */
  }
});

// Visual helpers moved to Avatar atom
// Activity and label helpers
const recentVisits = ref<any[]>([]);
const recentActivities = ref<any[]>([]);
const limit =
  Number((import.meta as any).env?.VITE_DASHBOARD_ACTIVITY_LIMIT) || 10;

function refreshActivityLists() {
  try {
    recentVisits.value = activity.getRecentVisits(limit);
    recentActivities.value = activity.getRecentActivities(limit);
  } catch {
    recentVisits.value = [];
    recentActivities.value = [];
  }
}

function openItem(module: string, id: string) {
  router.push({ path: `/${module}/${id}` }).catch(() => {});
}

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function actionBadgeClass(action: string): string {
  if (action === "create")
    return "bg-green-50 text-green-700 border border-green-200";
  if (action === "update")
    return "bg-yellow-50 text-yellow-700 border border-yellow-200";
  if (action === "delete")
    return "bg-red-50 text-red-700 border border-red-200";
  return "bg-gray-50 text-gray-700 border border-gray-200";
}

async function onRevert(a: any) {
  try {
    await activity.revert(a);
    refreshActivityLists();
  } catch {
    /* ignore */
  }
}

function labelFor(moduleName: string, data: any): string {
  if (!data || typeof data !== "object") return String(data ?? "-");
  const cfg = (useUiConfig() as any).state?.configs?.[moduleName] as any;
  const pick = (key?: string) => (key && data[key] ? String(data[key]) : "");
  // Try known config keys
  const fromGallery = pick(cfg?.views?.gallery?.titleField);
  if (fromGallery) return fromGallery;
  const fromKanban = pick(cfg?.views?.kanban?.cardTitleField);
  if (fromKanban) return fromKanban;
  const fromCalendar = pick(cfg?.views?.calendar?.titleField);
  if (fromCalendar) return fromCalendar;
  // Try list column with titleField set
  const columns = (cfg?.views?.list?.columns || []) as any[];
  for (const c of columns) {
    const t = pick(c?.titleField) || pick(c?.key);
    if (t) return t;
  }
  // Common fallbacks
  return (
    data.name ||
    data.title ||
    data.displayName ||
    data.email ||
    data.id ||
    data._id ||
    "-"
  );
}
</script>
