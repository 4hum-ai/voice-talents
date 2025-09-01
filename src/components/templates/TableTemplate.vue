<template>
  <div class="min-h-screen">
    <AppBar :loading="loading" :show-back="true" @back="router.back()">
      <template #left>
        <div class="min-w-0">
          <div
            class="truncate text-base font-semibold text-gray-900 dark:text-gray-100"
          >
            {{ uiConfig?.displayName || resourceName }}
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
          <IconButton
            v-if="hasCreateAction"
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
          </IconButton>
          <IconButton aria-label="Search" @click="openSearch">
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
          </IconButton>
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
              :placeholder="`Search ${resourceName}...`"
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
          <IconButton aria-label="Close search" @click="closeSearch">
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
          </IconButton>
        </template>
      </template>
    </AppBar>

    <main class="p-4">
      <div
        v-if="activeFilters && activeFilters.length > 0"
        class="mb-3 flex flex-wrap items-center gap-2"
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
        class="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
      >
        <div class="overflow-x-auto">
          <table
            class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
          >
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th v-if="selectable" class="px-6 py-3">
                  <input
                    type="checkbox"
                    :checked="allSelected"
                    @change="toggleSelectAll"
                  />
                </th>
                <th
                  v-for="column in visibleColumns"
                  :key="column.key"
                  class="group px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase transition-colors duration-150 dark:text-gray-400"
                  :class="[
                    column.sortable
                      ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
                      : '',
                    column.align ? `text-${column.align}` : 'text-left',
                  ]"
                  :style="{ width: column.width || undefined }"
                  :aria-sort="
                    column.sortable
                      ? sortField === column.key
                        ? sortDirection === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                      : undefined
                  "
                  @click="column.sortable ? handleSort(column.key) : null"
                >
                  <div class="inline-flex items-center gap-1 select-none">
                    <span>{{ column.label }}</span>
                    <svg
                      class="h-3.5 w-3.5 transition-transform duration-150"
                      :class="[
                        column.sortable ? '' : 'hidden',
                        sortField === column.key
                          ? 'text-gray-700 opacity-100 dark:text-gray-200'
                          : 'text-gray-400 opacity-0 group-hover:opacity-60 dark:text-gray-500',
                      ]"
                      :style="{
                        transform:
                          sortField === column.key && sortDirection === 'desc'
                            ? 'rotate(180deg)'
                            : 'rotate(0deg)',
                      }"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12 7c.3 0 .58.13.77.36l4 5a1 1 0 01-.77 1.64H8a1 1 0 01-.77-1.64l4-5A1 1 0 0112 7z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody
              class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900"
            >
              <tr
                v-for="item in sortedData"
                :key="item.id"
                class="cursor-pointer transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800"
                :title="`Click to view ${item.name || item.title || 'details'}`"
                @click="handleRowClick(item)"
              >
                <td
                  v-if="selectable"
                  class="px-6 py-4 whitespace-nowrap"
                  @click.stop
                >
                  <input
                    type="checkbox"
                    :checked="isSelected(item)"
                    @change="toggleSelectRow(item)"
                  />
                </td>
                <td
                  v-for="column in visibleColumns"
                  :key="column.key"
                  class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100"
                  :class="column.align ? `text-${column.align}` : ''"
                  :style="{ width: column.width || undefined }"
                >
                  <div
                    v-if="column.key === 'actions'"
                    class="flex items-center justify-end"
                  >
                    <ActionsMenu
                      :items="
                        (config.actions || []).map((a: any) => ({
                          key: a.name,
                          label: a.label,
                        }))
                      "
                      size="sm"
                      @select="(key) => handleAction(key, item)"
                    />
                  </div>
                  <div v-else>
                    <div
                      v-if="column.titleField"
                      class="flex items-center gap-3"
                    >
                      <div class="min-w-0">
                        <div
                          class="truncate text-sm font-medium text-gray-900 dark:text-gray-100"
                        >
                          {{ getTitle(item, column) }}
                        </div>
                        <div
                          v-if="getSubtitle(item, column)"
                          class="truncate text-xs text-gray-500 dark:text-gray-400"
                        >
                          {{ getSubtitle(item, column) }}
                        </div>
                      </div>
                    </div>
                    <div
                      v-else-if="column.formatter === 'country'"
                      class="flex items-center gap-2"
                    >
                      <div
                        v-if="countryCode(item[column.key])"
                        class="shrink-0"
                      >
                        <picture>
                          <source
                            :srcset="`https://flagcdn.com/${countryCode(item[column.key])}.svg`"
                            type="image/svg+xml"
                          />
                          <img
                            :src="`https://flagcdn.com/24x18/${countryCode(item[column.key])}.png`"
                            alt=""
                            width="24"
                            height="18"
                            class="rounded-sm"
                          />
                        </picture>
                      </div>
                      <span class="text-sm text-gray-900 dark:text-gray-100">{{
                        countryName(item[column.key]) || item[column.key] || "-"
                      }}</span>
                    </div>
                    <div
                      v-else-if="column.type === 'image'"
                      class="flex items-center"
                    >
                      <img
                        :src="item[column.key]"
                        alt=""
                        class="h-8 w-8 rounded bg-gray-100 object-cover dark:bg-gray-800"
                      />
                    </div>
                    <div v-else-if="column.type === 'url'">
                      <a
                        :href="item[column.key]"
                        target="_blank"
                        rel="noopener"
                        class="text-primary-600 dark:text-primary-400 hover:underline"
                        >{{ item[column.key] }}</a
                      >
                    </div>
                    <div
                      v-else-if="column.type === 'color'"
                      class="flex items-center gap-2"
                    >
                      <span
                        class="inline-block h-4 w-4 rounded border border-gray-300 dark:border-gray-700"
                        :style="{
                          backgroundColor: String(
                            item[column.key] || '#ffffff',
                          ),
                        }"
                      />
                      <span class="text-sm text-gray-900 dark:text-gray-100">{{
                        String(item[column.key] || "-")
                      }}</span>
                    </div>
                    <div v-else-if="column.formatter === 'badge'">
                      <span
                        :class="[
                          'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
                          badgeClass(item[column.key]),
                        ]"
                        >{{ item[column.key] ?? "-" }}</span
                      >
                    </div>
                    <div
                      v-else-if="column.formatter === 'status'"
                      class="inline-flex items-center gap-2"
                    >
                      <span
                        :class="[
                          'h-2 w-2 rounded-full',
                          statusDotClass(item[column.key]),
                        ]"
                      />
                      <span
                        :class="[
                          'rounded px-2 py-0.5 text-xs font-medium',
                          statusBadgeClass(item[column.key]),
                        ]"
                        >{{ item[column.key] ?? "-" }}</span
                      >
                    </div>
                    <div v-else class="text-gray-900 dark:text-gray-100">
                      {{ formatCellValue(item[column.key], column, item) }}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          v-if="hasPagination"
          class="border-t border-gray-200 dark:border-gray-700"
        >
          <Pagination
            :current-page="Number(currentPage) || 1"
            :total-pages="Number(totalPages) || 1"
            :total="Number(total) || 0"
            :per-page="Number(perPage) || 10"
            :page-size-options="pageSizeOptions"
            @page-change="onPageChange"
            @per-page-change="onPerPageChange"
          />
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
            <DateRangeInput
              :from="localFilterValues[f.field]?.from ?? ''"
              :to="localFilterValues[f.field]?.to ?? ''"
              @update:from="
                (value) => onLocalDateChange(f.field, 'from', value)
              "
              @update:to="(value) => onLocalDateChange(f.field, 'to', value)"
            />
          </template>
        </div>
      </div>
    </FilterSidebar>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import Pagination from "@/components/molecules/Pagination.vue";
import ActionsMenu from "@/components/atoms/ActionsMenu.vue";
import AppBar from "@/components/molecules/AppBar.vue";
import Chip from "@/components/atoms/Chip.vue";
import SearchInput from "@/components/atoms/SearchInput.vue";
import DynamicFormSidebar from "@/components/molecules/DynamicFormSidebar.vue";
import FilterSidebar from "@/components/molecules/FilterSidebar.vue";
import TimeWindowPicker from "@/components/molecules/TimeWindowPicker.vue";
import IconButton from "@/components/atoms/IconButton.vue";
import DateRangeInput from "@/components/atoms/DateRangeInput.vue";
import { getCountryByCode } from "@/utils/countries";
import { toDate } from "@/utils/date";
import { useRoute, useRouter } from "vue-router";

type Props = {
  data: any[];
  config: { columns: any[]; actions?: any[] };
  selectable?: boolean;
  rowIdKey?: string;
  currentPage?: number;
  totalPages?: number;
  total?: number;
  perPage?: number;
  pageSizeOptions?: number[];
  resourceName?: string;
  uiConfig?: any;
  loading?: boolean;
  activeFilters?: { key: string; label: string }[];
};
const props = withDefaults(defineProps<Props>(), {
  selectable: true,
  rowIdKey: "id",
});
const emit = defineEmits<{
  (e: "action", action: string, item?: any): void;
  (e: "sort", field: string, direction: "asc" | "desc"): void;
  (e: "item-click", item: any): void;
  (e: "itemClick", item: any): void;
  (e: "selection-change", ids: (string | number)[]): void;
  (e: "page-change", page: number): void;
  (e: "per-page-change", perPage: number): void;
  (e: "clear-filter", key: string): void;
  (e: "clear-all-filters"): void;
  (
    e: "filters-change",
    payload: {
      preset?: string;
      from?: string;
      to?: string;
      filters?: Record<string, any>;
    },
  ): void;
}>();

// search & layout state
const isSearchOpen = ref(false);
const searchQuery = ref("");
const selectedSearchField = ref<"all" | string>("all");
const searchInputRef = ref<HTMLInputElement | null>(null);

const resourceName = computed(() => props.resourceName || "");
const uiConfig = computed(() => props.uiConfig);
const loading = computed(() => !!props.loading);
const activeFilters = computed(() => props.activeFilters || []);
const dateField = computed(
  () => uiConfig.value?.views?.calendar?.dateField || "createdAt",
);

const route = useRoute();
const router = useRouter();

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
function openCreate() {
  showFormSidebar.value = true;
}

// layout switch
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
// Filters sidebar state and syncing with URL
const showFilterSidebar = ref(false);
const filterPreset = ref<"all" | "7d" | "30d" | "90d" | "custom">("all");
const filterFrom = ref<string | undefined>(undefined);
const filterTo = ref<string | undefined>(undefined);
const listFilters = computed<any[]>(
  () => uiConfig.value?.views?.list?.defaultFilters || [],
);
const localFilterValues = ref<Record<string, any>>({});

function syncFiltersFromQuery() {
  try {
    const q = route.query;
    // Time window
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
    filterPreset.value = from || to ? "custom" : "all";
    filterFrom.value = from;
    filterTo.value = to;
    // Field filters
    const next: Record<string, any> = {};
    for (const f of listFilters.value as any[]) {
      const base = `filters[${f.field}]`;
      const eq = q[base];
      const b = q[`${base}[$between]`];
      const gte = q[`${base}[$gte]`];
      const lte = q[`${base}[$lte]`];
      if (f.type === "number") {
        if (b) {
          const [min, max] = String(b).split(",");
          next[f.field] = {
            min: min !== undefined ? Number(min) : undefined,
            max: max !== undefined ? Number(max) : undefined,
          };
        } else if (gte || lte) {
          next[f.field] = {
            min: gte !== undefined ? Number(gte) : undefined,
            max: lte !== undefined ? Number(lte) : undefined,
          };
        }
      } else if (f.type === "select" || f.type === "boolean") {
        if (eq !== undefined) next[f.field] = { value: String(eq) };
      } else if (f.type === "date") {
        if (b) {
          const [fromD, toD] = String(b).split(",");
          next[f.field] = { from: fromD, to: toD };
        } else if (gte || lte) {
          next[f.field] = { from: gte || "", to: lte || "" };
        }
      }
    }
    localFilterValues.value = next;
  } catch {
    void 0;
  }
}

function openFilters() {
  syncFiltersFromQuery();
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
function onTimeWindowChange(payload: {
  preset?: string;
  from?: string;
  to?: string;
}) {
  if (payload.preset) filterPreset.value = payload.preset as any;
  if (payload.from !== undefined) filterFrom.value = payload.from;
  if (payload.to !== undefined) filterTo.value = payload.to;
}
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
function onLocalDateChange(field: string, key: "from" | "to", value: string) {
  localFilterValues.value[field] = {
    ...(localFilterValues.value[field] || {}),
    [key]: value,
  };
}
function applyFilters() {
  const payload: Record<string, any> = {
    preset: filterPreset.value,
    from: filterFrom.value,
    to: filterTo.value,
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
  closeFilters();
}

onMounted(() => {
  syncFiltersFromQuery();
  syncSortFromQuery();
});
watch(
  () => route.query,
  () => {
    syncFiltersFromQuery();
  },
);
watch(
  () => route.query.sort,
  () => {
    syncSortFromQuery();
  },
);

// existing sorting, selection, etc.

const sortField = ref("");
const sortDirection = ref<"asc" | "desc">("asc");
function syncSortFromQuery() {
  try {
    const raw = String(route.query.sort || "");
    if (!raw) {
      sortField.value = "";
      sortDirection.value = "asc";
      return;
    }
    const [field, dir] = raw.split(":");
    sortField.value = field || "";
    sortDirection.value = dir === "desc" ? "desc" : "asc";
  } catch {
    void 0;
  }
}
const selectedIds = ref<Set<string | number>>(new Set());

const visibleColumns = computed(() =>
  (props.config?.columns || []).filter((c: any) => !c.hidden),
);

const sortedData = computed(() => {
  const d = [...props.data];
  if (sortField.value) {
    d.sort((a, b) => {
      const av = a[sortField.value];
      const bv = b[sortField.value];
      return sortDirection.value === "asc"
        ? av > bv
          ? 1
          : -1
        : av < bv
          ? 1
          : -1;
    });
  }
  return d;
});

const hasCreateAction = computed(
  () =>
    Array.isArray(props.config?.actions) &&
    (props.config.actions as any[]).some((a) => a?.name === "create"),
);

const showFormSidebar = ref(false);
const formSidebarTitle = ref("");
const formSidebarData = ref({});
const formSidebarLoading = ref(false);
const formSidebarSubmitText = ref("");
const formSidebarLoadingText = ref("");

function closeFormSidebar() {
  showFormSidebar.value = false;
}
function handleFormSubmit(data: any) {
  console.log("Form submitted:", data);
  closeFormSidebar();
}

// row/action/sort handlers referenced in template
function handleRowClick(item: any) {
  emit("item-click", item);
  emit("itemClick", item);
}
function handleAction(actionKey: string, item: any) {
  emit("action", actionKey, item);
}
function handleSort(field: string) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
  // Defer emitting to allow local UI to reflect immediately before route updates
  window.setTimeout(() => emit("sort", field, sortDirection.value), 0);
}

// ... existing handlers unchanged below ...

const hasPagination = computed(() => {
  const total = Number(props.total);
  const totalPages = Number(props.totalPages);
  return !isNaN(total) && total > 0 && !isNaN(totalPages) && totalPages >= 1;
});
const onPageChange = (page: number) => emit("page-change", page);
const onPerPageChange = (perPage: number) => emit("per-page-change", perPage);

const getRowId = (item: any): string | number =>
  item?.[props.rowIdKey as string];
const isSelected = (item: any): boolean =>
  selectedIds.value.has(getRowId(item));
const allSelected = computed(
  () =>
    sortedData.value.length > 0 &&
    sortedData.value.every((it) => selectedIds.value.has(getRowId(it))),
);
const toggleSelectRow = (item: any) => {
  const id = getRowId(item);
  if (selectedIds.value.has(id)) selectedIds.value.delete(id);
  else selectedIds.value.add(id);
  emit("selection-change", Array.from(selectedIds.value));
};
const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value.clear();
  } else {
    sortedData.value.forEach((it) => selectedIds.value.add(getRowId(it)));
  }
  emit("selection-change", Array.from(selectedIds.value));
};

const formatCellValue = (value: any, column: any, item?: any) => {
  if (value === null || value === undefined) return "-";
  switch (column.formatter) {
    case "date": {
      const d = toDate(value);
      if (!d) return "-";
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    case "currency": {
      const num = typeof value === "string" ? parseFloat(value) : value;
      if (isNaN(num)) return "-";
      return num.toLocaleString("en-US", {
        style: "currency",
        currency: item?.currency || "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    case "number": {
      const num = typeof value === "string" ? parseFloat(value) : value;
      if (isNaN(num)) return "-";
      return num.toLocaleString("en-US");
    }
    case "rating": {
      const num = typeof value === "string" ? parseFloat(value) : value;
      if (isNaN(num)) return "-";
      return `${num.toFixed(1)} / 5`;
    }
    case "badge":
    case "status":
    case "country":
      return String(value ?? "-");
  }
  switch (column.type) {
    case "date": {
      const d = toDate(value);
      if (!d) return "-";
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    case "number": {
      const num = typeof value === "string" ? parseFloat(value) : value;
      if (isNaN(num)) return "-";
      return num.toLocaleString("en-US");
    }
    case "boolean":
      return value ? "Yes" : "No";
    case "array":
      return Array.isArray(value) ? value.join(", ") : String(value);
    case "object":
      return JSON.stringify(value);
    default:
      return String(value);
  }
};

const getTitle = (item: any, column: any): string => {
  const key = column.titleField || column.key;
  const val = item?.[key];
  if (val === null || val === undefined) return "-";
  return String(val);
};

const getSubtitle = (item: any, column: any): string => {
  const key = column.subtitleField;
  if (!key) return "";
  const val = item?.[key];
  if (val === null || val === undefined) return "";
  return String(val);
};

const badgeClass = (value: any): string => {
  const v = String(value || "").toLowerCase();
  if (
    ["active", "success", "paid", "publisher", "large", "enterprise"].includes(
      v,
    )
  )
    return "bg-green-100 text-green-800";
  if (["pending", "warning", "medium"].includes(v))
    return "bg-yellow-100 text-yellow-800";
  if (["inactive", "secondary", "small", "startup"].includes(v))
    return "bg-gray-100 text-gray-800";
  if (["suspended", "error", "failed"].includes(v))
    return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

const statusDotClass = (value: any): string => {
  const v = String(value || "").toLowerCase();
  if (["active", "success", "paid", "online"].includes(v))
    return "bg-green-500";
  if (["pending", "warning"].includes(v)) return "bg-yellow-500";
  if (["inactive", "offline"].includes(v)) return "bg-gray-400";
  if (["suspended", "error", "failed"].includes(v)) return "bg-red-500";
  return "bg-gray-400";
};

const statusBadgeClass = (value: any): string => {
  const v = String(value || "").toLowerCase();
  if (["active", "success", "paid", "online"].includes(v))
    return "bg-green-50 text-green-700 border border-green-200";
  if (["pending", "warning"].includes(v))
    return "bg-yellow-50 text-yellow-700 border border-yellow-200";
  if (["inactive", "offline"].includes(v))
    return "bg-gray-50 text-gray-700 border border-gray-200";
  if (["suspended", "error", "failed"].includes(v))
    return "bg-red-50 text-red-700 border border-red-200";
  return "bg-gray-50 text-gray-700 border border-gray-200";
};

const countryCode = (raw: any): string | "" => {
  if (!raw) return "";
  const val = String(raw).trim();
  if (val.length === 2) return val.toLowerCase();
  const c = getCountryByCode(val);
  if (c) return c.code.toLowerCase();
  return "";
};

const countryName = (raw: any): string => {
  if (!raw) return "";
  const val = String(raw).trim();
  const c = getCountryByCode(val);
  return c?.name || val;
};
</script>
