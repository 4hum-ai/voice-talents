<template>
  <div>
    <AppBar :loading="loadingCounts">
      <template #title>
        Hi, {{ auth.user?.displayName || auth.user?.email || 'there' }}
      </template>
      <template #subtitle>
        You are logged in as {{ auth.user?.email || '—' }}
      </template>
      <template #actions>
        <div class="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div class="w-full sm:w-64">
            <label class="sr-only" for="module-search">Search modules</label>
            <input
              id="module-search"
              v-model="filter"
              type="search"
              placeholder="Search modules…"
              class="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm focus:border-gray-300 dark:focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
            />
          </div>
          <ActionsMenu :items="menuItems" @select="onMenuSelect" />
        </div>
      </template>
    </AppBar>
    <div class="h-4"></div>
    <main class="p-6">

    <section v-if="isLoading" class="mt-6">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="i in 6"
          :key="i"
          class="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="animate-pulse flex items-start gap-3">
            <div class="flex-none h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-else-if="visibleModules.length === 0" class="mt-6">
      <div class="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <div class="mx-auto mb-2 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center dark:bg-gray-700">
          <svg class="h-5 w-5 text-gray-400 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-4.35-4.35m0-6.4a6.4 6.4 0 1 1-12.8 0 6.4 6.4 0 0 1 12.8 0Z"/>
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
          class="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition hover:-translate-y-0.5 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none dark:hover:shadow-md"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3">
              <div class="flex-none overflow-hidden h-10 w-10">
                <div class="h-full w-full grid place-items-center">
                  <Avatar :label="m.displayName || toTitle(m.name)" :seed="m.name" shape="square" />
                </div>
              </div>
              <div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">{{ m.displayName || toTitle(m.name) }}</h3>
                <p v-if="m.description" class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ m.description }}</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {{ formatCount(counts[m.name]) }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Total</div>
            </div>
          </div>
        </router-link>
      </div>
    </section>
    
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import Avatar from '@/components/atoms/Avatar.vue'
import { useMovieService, type AdminModuleInfo } from '@/composables/useMovieService'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

// Intentionally not using router routes for modules; rely on admin-ui modules API

// Connection health check removed as it's low value for UX
const movie = useMovieService()
const auth = useAuthStore()
const router = useRouter()
const { isDark, toggleTheme } = useTheme()

const counts = ref<Record<string, number | null>>({})
const adminModules = ref<AdminModuleInfo[]>([])
const loadingCounts = ref(false)
const loadingModules = ref(true)
const filter = ref('')
const isLoading = computed(() => loadingModules.value || loadingCounts.value)

const toTitle = (value: string): string => {
  const base = value.replace(/^\//, '').replace(/-/g, ' ')
  return base.charAt(0).toUpperCase() + base.slice(1)
}

const formatCount = (n: number | null | undefined): string => {
  if (n === null || n === undefined) return '—'
  return new Intl.NumberFormat().format(n)
}

const visibleModules = computed(() => {
  const q = filter.value.trim().toLowerCase()
  const mods = q
    ? adminModules.value.filter((m) => {
        const name = (m.displayName || m.name).toLowerCase()
        const desc = (m.description || '').toLowerCase()
        return name.includes(q) || desc.includes(q)
      })
    : adminModules.value.slice()

  return mods.sort((a, b) => {
    const an = (a.displayName || a.name).toLowerCase()
    const bn = (b.displayName || b.name).toLowerCase()
    return an.localeCompare(bn)
  })
})

const loadCounts = async () => {
  loadingCounts.value = true
  try {
    if (adminModules.value.length === 0) {
      try {
        adminModules.value = await movie.listAdminModules()
      } catch {
        adminModules.value = []
      }
    }
    const mods = adminModules.value.map((m) => m.name)
    // Prime placeholders
    const seed: Record<string, number | null> = {}
    mods.forEach((m) => (seed[m] = null))
    counts.value = seed
    // Limit concurrency to avoid overwhelming API if many modules
    const queue = mods.slice()
    const workers = Array.from({ length: 4 }).map(async () => {
      while (queue.length) {
        const mod = queue.shift()!
        try {
          const res = await movie.listModuleItems(mod, { page: 1, limit: 1 })
          counts.value[mod] = res.pagination.total
        } catch {
          counts.value[mod] = null
        }
      }
    })
    await Promise.all(workers)
  } finally {
    loadingCounts.value = false
  }
}

// No connection check

const menuItems = computed(() => [
  { key: 'refresh-stats', label: loadingCounts.value ? 'Refreshing…' : 'Refresh Stats' },
  { key: 'toggle-theme', label: isDark.value ? 'Switch to Light' : 'Switch to Dark' },
  { key: 'logout', label: 'Logout' }
])

const onMenuSelect = async (key: string) => {
  if (key === 'refresh-stats') {
    await loadCounts()
  } else if (key === 'toggle-theme') {
    toggleTheme()
  } else if (key === 'logout') {
    await auth.logoutUser()
    await router.push({ name: 'Auth' })
  }
}

onMounted(async () => {
  loadingModules.value = true
  try {
    adminModules.value = await movie.listAdminModules()
  } catch {
    adminModules.value = []
  } finally {
    loadingModules.value = false
  }
  await loadCounts()
})

// Visual helpers moved to Avatar atom
</script>


