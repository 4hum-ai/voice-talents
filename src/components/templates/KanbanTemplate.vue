<template>
  <div class="min-h-screen">
    <AppBar :loading="loading" :show-back="true" @back="router.back()">
      <template #left>
        <div class="min-w-0">
          <div
            class="truncate text-base font-semibold text-gray-900 dark:text-gray-100"
          >
            {{ uiConfig?.displayName || moduleName }}
          </div>
          <div class="truncate text-xs text-gray-500 dark:text-gray-400">
            {{ uiConfig?.description }}
          </div>
        </div>
      </template>
      <template #actions>
        <template v-if="!isSearchOpen">
          <button
            v-if="hasCreateAction"
            class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 hidden items-center rounded-md px-3 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none sm:inline-flex"
            @click="openCreate()"
          >
            + Add
          </button>
          <button
            v-if="hasCreateAction"
            class="focus:ring-primary-500 inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 focus:ring-2 focus:outline-none sm:hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Add"
            @click="openCreate()"
          >
            <svg
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M12 6.75a.75.75 0 01.75.75v3.75H16.5a.75.75 0 010 1.5h-3.75V16.5a.75.75 0 01-1.5 0v-3.75H7.5a.75.75 0 010-1.5h3.75V7.5A.75.75 0 0112 6.75z"
              />
            </svg>
          </button>
          <button
            class="focus:ring-primary-500 inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Search"
            @click="openSearch"
          >
            <svg
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 104.243 11.93l3.788 3.789a.75.75 0 101.06-1.06l-3.788-3.79A6.75 6.75 0 0010.5 3.75zm-5.25 6.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <ActionsMenu
            :items="layoutMenuItems"
            size="md"
            @select="handleLayoutSelect"
          >
            <template #label>
              <svg
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M3 5.25A2.25 2.25 0 015.25 3h4.5A2.25 2.25 0 0112 5.25v4.5A2.25 2.25 0 019.75 12h-4.5A2.25 2.25 0 013 9.75v-4.5zM12 14.25A2.25 2.25 0 0114.25 12h4.5A2.25 2.25 0 0121 14.25v4.5A2.25 2.25 0 0118.75 21h-4.5A2.25 2.25 0 0112 18.75v-4.5zM3 14.25A2.25 2.25 0 015.25 12h4.5A2.25 2.25 0 0112 14.25v4.5A2.25 2.25 0 019.75 21h-4.5A2.25 2.25 0 013 18.75v-4.5zM14.25 3A2.25 2.25 0 0012 5.25v4.5A2.25 2.25 0 0014.25 12h4.5A2.25 2.25 0 0021 9.75v-4.5A2.25 2.25 0 0018.75 3h-4.5z"
                />
              </svg>
            </template>
          </ActionsMenu>
        </template>
        <template v-else>
          <div class="flex min-w-0 flex-1 items-center gap-2">
            <SearchInput
              ref="searchInputRef"
              v-model="searchQuery"
              :placeholder="`Search ${moduleName}...`"
              @update:model-value="handleSearchInputDebounced"
            />
            <div class="hidden items-center gap-2 sm:flex">
              <div
                class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
              >
                <label class="text-xs text-gray-500 dark:text-gray-400"
                  >Fields</label
                >
                <select
                  v-model="selectedSearchField"
                  class="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  @change="handleSearchInput"
                >
                  <option value="all">All fields</option>
                  <option
                    v-for="f in searchableFieldOptions"
                    :key="f.key"
                    :value="f.key"
                  >
                    {{ f.label }}
                  </option>
                </select>
              </div>
              <button
                class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-900"
                @click="openFilters"
              >
                Filters
              </button>
            </div>
          </div>
          <button
            class="focus:ring-primary-500 inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Close search"
            @click="closeSearch"
          >
            <svg
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M6.225 4.811a.75.75 0 011.06 0L12 9.525l4.715-4.714a.75.75 0 111.06 1.06L13.06 10.586l4.715 4.714a.75.75 0 11-1.06 1.06L12 11.646l-4.715 4.714a.75.75 0 11-1.06-1.06l4.714-4.714-4.714-4.715a.75.75 0 010-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </template>
      </template>
    </AppBar>

    <main class="space-y-6 p-4">
      <div
        class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="text-sm text-gray-600 dark:text-gray-300">Time window</div>
        <div class="flex items-center gap-2">
          <TimeWindowPicker
            :preset="selectedPreset"
            :from="fromISO"
            :to="toISO"
            @change="onTimeWindowChange"
          />
        </div>
      </div>

      <div
        v-if="activeFilters && activeFilters.length > 0"
        class="-mt-2 flex flex-wrap items-center gap-2"
      >
        <Chip
          v-for="chip in activeFilters"
          :key="chip.key"
          :label="chip.label"
          closable
          @close="() => emit('clear-filter', chip.key)"
        />
        <button
          class="rounded-full border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          @click="emit('clear-all-filters')"
        >
          Clear all
        </button>
      </div>

      <div
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4"
      >
        <div
          v-for="column in config.columns"
          :key="column.value"
          :ref="(el) => setColumnRef(column.value, el as HTMLElement)"
          class="min-h-[300px] rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
        >
          <div
            class="mb-4 flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700"
          >
            <div class="flex items-center space-x-2">
              <div
                class="h-3 w-3 rounded-full"
                :style="{ backgroundColor: column.color || '#6b7280' }"
              />
              <h3 class="font-medium text-gray-900 dark:text-gray-100">
                {{ column.label }}
              </h3>
            </div>
            <span
              class="rounded-full bg-white px-2 py-1 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400"
              >{{ getKanbanCount(column.value) }}</span
            >
          </div>
          <div class="space-y-3">
            <template
              v-for="item in getKanbanItems(column.value)"
              :key="item.id"
            >
              <div
                :ref="(el) => setCardRef(item.id, el as HTMLElement)"
                class="cursor-grab touch-none rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 will-change-transform select-none hover:shadow-md active:cursor-grabbing dark:border-gray-700 dark:bg-gray-800"
                :class="{ 'z-50 shadow-lg': draggingItemId === item.id }"
                :style="[baseDragStyleRefs[item.id], cardStyleRefs[item.id]]"
                @click="handleItemClick(item)"
              >
                <div
                  class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {{ item[config.cardTitleField] }}
                </div>
                <div
                  v-if="config.cardDescriptionField"
                  class="text-xs text-gray-500 dark:text-gray-400"
                >
                  {{ item[config.cardDescriptionField] }}
                </div>
              </div>
              <div
                v-if="draggingItemId === item.id"
                :style="getPlaceholderStyle(item.id)"
              />
            </template>
            <div
              v-if="getKanbanItems(column.value).length === 0"
              class="py-8 text-center text-sm text-gray-400 dark:text-gray-500"
            >
              No items
            </div>
          </div>
        </div>
      </div>
    </main>

    <DynamicFormSidebar
      v-if="showFormSidebar"
      :title="formSidebarTitle"
      :form-config="uiConfig?.formView"
      :initial-data="formSidebarData"
      :loading="formSidebarLoading"
      :submit-text="formSidebarSubmitText"
      :loading-text="formSidebarLoadingText"
      @close="closeFormSidebar"
      @submit="handleFormSubmit"
    />

    <FilterSidebar
      :show="showFilterSidebar"
      title="Filters"
      @close="closeFilters"
      @clear="clearFilters"
      @apply="applyFilters"
    >
      <div class="space-y-4">
        <div>
          <label
            class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
            >Time window</label
          >
          <TimeWindowPicker
            :preset="filterPreset"
            :from="filterFrom"
            :to="filterTo"
            @change="onTimeWindowChange"
          />
        </div>
        <div v-for="f in listFilters" :key="f.field" class="space-y-1">
          <label
            class="block text-xs font-medium text-gray-500 dark:text-gray-400"
            >{{ f.label }}</label
          >
          <template v-if="f.type === 'number'">
            <div class="flex items-center gap-2">
              <input
                type="number"
                :value="localFilterValues[f.field]?.min ?? ''"
                placeholder="Min"
                class="w-1/2 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                @input="onLocalNumberChange(f.field, 'min', $event)"
              />
              <input
                type="number"
                :value="localFilterValues[f.field]?.max ?? ''"
                placeholder="Max"
                class="w-1/2 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                @input="onLocalNumberChange(f.field, 'max', $event)"
              />
            </div>
          </template>
          <template v-else-if="f.type === 'select'">
            <select
              :value="localFilterValues[f.field]?.value ?? ''"
              class="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              @change="onLocalValueChange(f.field, $event)"
            >
              <option value="">Any</option>
              <option
                v-for="opt in f.options || []"
                :key="String(opt.value)"
                :value="String(opt.value)"
              >
                {{ opt.label }}
              </option>
            </select>
          </template>
          <template v-else-if="f.type === 'boolean'">
            <select
              :value="localFilterValues[f.field]?.value ?? ''"
              class="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              @change="onLocalValueChange(f.field, $event)"
            >
              <option value="">Any</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </template>
          <template v-else-if="f.type === 'date'">
            <div class="flex items-center gap-2">
              <input
                type="date"
                :value="localFilterValues[f.field]?.from ?? ''"
                class="w-1/2 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                @change="onLocalDateChange(f.field, 'from', $event)"
              />
              <input
                type="date"
                :value="localFilterValues[f.field]?.to ?? ''"
                class="w-1/2 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                @change="onLocalDateChange(f.field, 'to', $event)"
              />
            </div>
          </template>
        </div>
      </div>
    </FilterSidebar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDraggable } from "@vueuse/core";
import TimeWindowPicker from "@/components/molecules/TimeWindowPicker.vue";
import AppBar from "@/components/molecules/AppBar.vue";
import Chip from "@/components/atoms/Chip.vue";
import SearchInput from "@/components/atoms/SearchInput.vue";
import DynamicFormSidebar from "@/components/molecules/DynamicFormSidebar.vue";
import FilterSidebar from "@/components/molecules/FilterSidebar.vue";
import ActionsMenu from "@/components/atoms/ActionsMenu.vue";

interface Props {
  data: any[];
  config: {
    columns: any[];
    groupByField: string;
    cardTitleField: string;
    cardDescriptionField?: string;
    actions?: any[];
  };
  moduleName?: string;
  uiConfig?: any;
  loading?: boolean;
  activeFilters?: { key: string; label: string }[];
}
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "action", action: string, item?: any): void;
  (e: "item-click", item: any): void;
  (e: "status-change", payload: { item: any; from: string; to: string }): void;
  (
    e: "filters-change",
    payload: { from?: string; to?: string; preset?: string },
  ): void;
  (e: "clear-filter", key: string): void;
  (e: "clear-all-filters"): void;
  (e: "create", data: Record<string, any>): void;
}>();

const route = useRoute();
const router = useRouter();

// search/layout/create
const isSearchOpen = ref(false);
const searchQuery = ref("");
const selectedSearchField = ref<"all" | string>("all");
const searchInputRef = ref<HTMLInputElement | null>(null);
function openSearch() {
  isSearchOpen.value = true;
  setTimeout(() => searchInputRef.value?.focus(), 0);
}
function closeSearch() {
  isSearchOpen.value = false;
}
function handleSearchInput() {
  const search = searchQuery.value?.trim() || "";
  const field =
    selectedSearchField.value !== "all" ? selectedSearchField.value : undefined;
  const nextQuery: Record<string, any> = { ...route.query, page: "1" };
  if (search) nextQuery.search = search;
  else delete nextQuery.search;
  if (field) nextQuery.searchField = field;
  else delete nextQuery.searchField;
  router.replace({ query: nextQuery }).catch(() => {});
}
let searchDebounceTimer: number | undefined;
function handleSearchInputDebounced() {
  if (searchDebounceTimer) window.clearTimeout(searchDebounceTimer);
  searchDebounceTimer = window.setTimeout(() => handleSearchInput(), 300);
}

const layoutMenuItems = computed(() => [
  { key: "list", label: "Table" },
  { key: "gallery", label: "Gallery" },
  { key: "calendar", label: "Calendar" },
  { key: "kanban", label: "Kanban" },
]);
function handleLayoutSelect(key: string) {
  if (!["list", "gallery", "calendar", "kanban"].includes(key)) return;
  const nextQuery: Record<string, any> = { view: key };
  router.replace({ query: nextQuery }).catch(() => {});
}

const showFormSidebar = ref(false);
const formSidebarTitle = ref("Add New");
const formSidebarData = ref<Record<string, any>>({});
const formSidebarLoading = ref(false);
const formSidebarSubmitText = ref("Create");
const formSidebarLoadingText = ref("Creating...");
function openCreate() {
  showFormSidebar.value = true;
}
function closeFormSidebar() {
  showFormSidebar.value = false;
  formSidebarData.value = {};
}
function handleFormSubmit(data: Record<string, any>) {
  emit("create", data);
  closeFormSidebar();
}

// filters sidebar (time window + default filters)
const showFilterSidebar = ref(false);
const filterPreset = ref<"all" | "7d" | "30d" | "90d" | "custom">("all");
const filterFrom = ref<string | undefined>(undefined);
const filterTo = ref<string | undefined>(undefined);
function openFilters() {
  showFilterSidebar.value = true;
}
function closeFilters() {
  showFilterSidebar.value = false;
}
function clearFilters() {
  filterPreset.value = "all";
  filterFrom.value = undefined;
  filterTo.value = undefined;
}
const listFilters = computed<any[]>(
  () => uiConfig.value?.views?.list?.defaultFilters || [],
);
const localFilterValues = ref<Record<string, any>>({});
function onLocalValueChange(field: string, e: Event) {
  const value = (e.target as HTMLSelectElement).value;
  localFilterValues.value[field] = {
    ...(localFilterValues.value[field] || {}),
    value,
  };
}
function onLocalNumberChange(field: string, key: "min" | "max", e: Event) {
  const raw = (e.target as HTMLInputElement).value;
  const value = raw === "" ? undefined : Number(raw);
  localFilterValues.value[field] = {
    ...(localFilterValues.value[field] || {}),
    [key]: value,
  };
}
function onLocalDateChange(field: string, key: "from" | "to", e: Event) {
  const value = (e.target as HTMLInputElement).value;
  localFilterValues.value[field] = {
    ...(localFilterValues.value[field] || {}),
    [key]: value,
  };
}

// existing Kanban logic

const items = ref<any[]>([]);
watch(
  () => props.data,
  (newData) => {
    items.value = Array.isArray(newData) ? newData.map((d) => ({ ...d })) : [];
  },
  { immediate: true },
);

const getKanbanCount = (columnValue: string) =>
  items.value.filter((item) => item[props.config.groupByField] === columnValue)
    .length;
const getKanbanItems = (columnValue: string) =>
  items.value.filter((item) => item[props.config.groupByField] === columnValue);

const handleItemClick = (item: any) => emit("item-click", item);

const selectedPreset = ref<"all" | "7d" | "30d" | "90d" | "custom">("all");
const fromISO = ref<string | undefined>(undefined);
const toISO = ref<string | undefined>(undefined);
const dateField = computed(
  () => uiConfig.value?.views?.calendar?.dateField || "createdAt",
);
function onTimeWindowChange(payload: {
  preset?: string;
  from?: string;
  to?: string;
}) {
  if (payload.preset) selectedPreset.value = payload.preset as any;
  if ("from" in payload) fromISO.value = payload.from;
  if ("to" in payload) toISO.value = payload.to;
  emit("filters-change", {
    preset: selectedPreset.value,
    from: fromISO.value,
    to: toISO.value,
  });
}

function syncTimeWindowFromQuery() {
  try {
    const q = route.query;
    const betweenKey = `filters[${dateField.value}][$between]`;
    const gteKey = `filters[${dateField.value}][$gte]`;
    const lteKey = `filters[${dateField.value}][$lte]`;
    let from: string | undefined;
    let to: string | undefined;
    if (q[betweenKey]) {
      const val = String(q[betweenKey]);
      const [a, b] = val.split(",").map((s) => s.trim());
      from = a || undefined;
      to = b || undefined;
    } else {
      if (q[gteKey]) from = String(q[gteKey]);
      if (q[lteKey]) to = String(q[lteKey]);
    }
    selectedPreset.value = from || to ? "custom" : "all";
    fromISO.value = from;
    toISO.value = to;
  } catch {
    void 0;
  }
}

onMounted(() => {
  syncTimeWindowFromQuery();
});

watch(
  () => route.query,
  () => {
    syncTimeWindowFromQuery();
  },
);

const columnRefs = reactive<Record<string, HTMLElement | null>>({});
const setColumnRef = (value: string, el: HTMLElement | null) => {
  columnRefs[value] = el;
};

const cardElRefs = reactive<Record<string, { el: HTMLElement | null }>>({});
const draggableMap = new Map<string, ReturnType<typeof useDraggable>>();
const cardStyleRefs = reactive<Record<string, any>>({});
const baseDragStyleRefs = reactive<Record<string, any>>({});
const draggingItemId = ref<string | null>(null);
const lastPointer = ref<{ x: number; y: number } | null>(null);
const dragMeta = reactive<Record<string, { width: number; height: number }>>(
  {},
);

const setCardRef = (id: string, el: HTMLElement | null) => {
  if (!cardElRefs[id]) cardElRefs[id] = { el: null };
  cardElRefs[id].el = el;
  if (el && !draggableMap.has(id)) {
    const targetRef = ref<HTMLElement | null>(el);
    const instance = useDraggable(targetRef, {
      preventDefault: true,
      pointerTypes: ["mouse", "touch", "pen"],
      onStart: () => {
        const rect = el.getBoundingClientRect();
        dragMeta[id] = { width: rect.width, height: rect.height };
        baseDragStyleRefs[id] = {
          position: "fixed",
          left: `${rect.left}px`,
          top: `${rect.top}px`,
          width: `${rect.width}px`,
          pointerEvents: "none",
        };
        draggingItemId.value = id;
      },
      onMove: (_evPos, ev: PointerEvent | MouseEvent | TouchEvent) => {
        if ("clientX" in ev && "clientY" in ev) {
          lastPointer.value = {
            x: (ev as PointerEvent).clientX,
            y: (ev as PointerEvent).clientY,
          };
        }
      },
      onEnd: () => {
        handleDropFromDraggable(id);
        baseDragStyleRefs[id] = undefined as any;
      },
    });
    draggableMap.set(id, instance);
    cardStyleRefs[id] = instance.style;
  }
};

const getPlaceholderStyle = (id: string) => {
  const meta = dragMeta[id];
  if (!meta) return {};
  return { height: `${meta.height}px` };
};

const handleDropFromDraggable = (id: string) => {
  const item = items.value.find((i) => i.id === id);
  const groupBy = props.config.groupByField;
  if (!item) return;
  let cx: number | null = lastPointer.value?.x ?? null;
  let cy: number | null = lastPointer.value?.y ?? null;
  if (cx == null || cy == null) {
    const cardEl = cardElRefs[id]?.el;
    if (cardEl) {
      const rect = cardEl.getBoundingClientRect();
      cx = rect.left + rect.width / 2;
      cy = rect.top + rect.height / 2;
    }
  }
  const inst = draggableMap.get(id);
  if (inst) {
    inst.x.value = 0;
    inst.y.value = 0;
  }
  if (cx == null || cy == null) {
    draggingItemId.value = null;
    return;
  }
  let targetColumnValue: string | null = null;
  for (const [value, el] of Object.entries(columnRefs)) {
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) {
      targetColumnValue = value;
      break;
    }
  }
  const from = String(item[groupBy]);
  const to = targetColumnValue != null ? String(targetColumnValue) : from;
  if (!targetColumnValue || from === to) {
    draggingItemId.value = null;
    return;
  }
  const idx = items.value.findIndex((i) => i.id === id);
  if (idx !== -1) items.value[idx] = { ...items.value[idx], [groupBy]: to };
  emit("status-change", { item: { ...item }, from, to });
  draggingItemId.value = null;
};

const moduleName = computed(() => props.moduleName || "");
const uiConfig = computed(() => props.uiConfig);
const loading = computed(() => !!props.loading);
const activeFilters = computed(() => props.activeFilters || []);
const hasCreateAction = computed(
  () =>
    Array.isArray(props.config?.actions) &&
    (props.config.actions as any[]).some((a) => a?.name === "create"),
);

const searchableFieldOptions = computed<{ key: string; label: string }[]>(
  () => {
    const cfg = uiConfig.value;
    if (!cfg?.views?.list) return [];
    const explicit = cfg.views.list.searchableFields as string[] | undefined;
    const columns = (cfg.views.list.columns || []) as any[];
    const fromColumns = columns
      .filter(
        (c) =>
          c?.type === "text" ||
          c?.type === "url" ||
          c?.type === "email" ||
          c?.searchable === true,
      )
      .map((c) => ({ key: String(c.key), label: String(c.label || c.key) }));
    const fromExplicit = (explicit || []).map((k) => {
      const col = columns.find((c) => c.key === k);
      return { key: String(k), label: String(col?.label || k) };
    });
    const merged: Record<string, { key: string; label: string }> = {};
    for (const f of [...fromColumns, ...fromExplicit]) merged[f.key] = f;
    return Object.values(merged);
  },
);

function applyFilters() {
  const payload: Record<string, any> = {
    preset: selectedPreset.value,
    from: fromISO.value,
    to: toISO.value,
  };
  const filters: Record<string, any> = {};
  for (const f of listFilters.value as any[]) {
    const v = localFilterValues.value[f.field];
    if (!v) continue;
    if (f.type === "number") {
      const min = v.min;
      const max = v.max;
      if (
        typeof min === "number" &&
        !isNaN(min) &&
        typeof max === "number" &&
        !isNaN(max)
      )
        filters[f.field] = { $between: [min, max] };
      else if (typeof min === "number" && !isNaN(min))
        filters[f.field] = { $gte: min };
      else if (typeof max === "number" && !isNaN(max))
        filters[f.field] = { $lte: max };
    } else if (f.type === "select") {
      const value = v.value;
      if (value !== "" && value !== undefined) filters[f.field] = value;
    } else if (f.type === "boolean") {
      const value = v.value;
      if (value === "true") filters[f.field] = true;
      if (value === "false") filters[f.field] = false;
    } else if (f.type === "date") {
      const from = v.from || undefined;
      const to = v.to || undefined;
      if (from && to) filters[f.field] = { $between: [from, to] };
      else if (from) filters[f.field] = { $gte: from };
      else if (to) filters[f.field] = { $lte: to };
    }
  }
  if (Object.keys(filters).length > 0) payload.filters = filters;
  emit("filters-change", payload as any);
}
</script>
