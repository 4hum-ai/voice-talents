<template>
  <div>
    <AppBar :loading="checking || loadingCounts">
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
    <div class="h-16"></div>
    <main class="p-6">

    <section v-if="connectionStatus === 'disconnected'" class="mb-6 p-4 rounded-md border border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
      Unable to reach the API. Verify your `.env` has `VITE_PUBLIC_API_URL` configured per the README and that the gateway is running.
    </section>

    <section v-if="visibleModules.length === 0" class="mt-6">
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
    <div class="mt-4 flex items-center gap-2 text-sm w-full sm:w-auto">
          <span
            class="inline-block h-2.5 w-2.5 rounded-full"
            :class="{
              'bg-green-500': connectionStatus === 'connected',
              'bg-red-500': connectionStatus === 'disconnected',
              'bg-gray-300': connectionStatus === 'unknown'
            }"
          />
          <span class="text-gray-700 capitalize dark:text-gray-300">{{ connectionStatus }}</span>
          <span v-if="lastCheck" class="text-gray-500 dark:text-gray-400">· Last check: {{ lastCheck.toLocaleTimeString() }}</span>
    </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import Avatar from '@/components/atoms/Avatar.vue'
import { useConnectionStatus } from '@/composables/useConnectionStatus'
import { useMovieService, type AdminModuleInfo } from '@/composables/useMovieService'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

// Intentionally not using router routes for modules; rely on admin-ui modules API

const { connectionStatus, lastCheck, checking, checkConnection } = useConnectionStatus()
const movie = useMovieService()
const auth = useAuthStore()
const router = useRouter()
const { isDark, toggleTheme } = useTheme()

const counts = ref<Record<string, number | null>>({})
const adminModules = ref<AdminModuleInfo[]>([])
const loadingCounts = ref(false)
const filter = ref('')

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
    await Promise.all(
      mods.map(async (m) => {
        try {
          const res = await movie.listModuleItems(m, { page: 1, limit: 1 })
          counts.value[m] = res.pagination.total
        } catch {
          counts.value[m] = null
        }
      })
    )
  } finally {
    loadingCounts.value = false
  }
}

const onCheckConnection = async () => {
  await checkConnection()
}

const menuItems = computed(() => [
  { key: 'check-connection', label: checking.value ? 'Checking…' : 'Check Connection' },
  { key: 'refresh-stats', label: loadingCounts.value ? 'Refreshing…' : 'Refresh Stats' },
  { key: 'toggle-theme', label: isDark.value ? 'Switch to Light' : 'Switch to Dark' },
  { key: 'logout', label: 'Logout' }
])

const onMenuSelect = async (key: string) => {
  if (key === 'check-connection') {
    await onCheckConnection()
  } else if (key === 'refresh-stats') {
    await loadCounts()
  } else if (key === 'toggle-theme') {
    toggleTheme()
  } else if (key === 'logout') {
    await auth.logoutUser()
    await router.push({ name: 'Auth' })
  }
}

onMounted(async () => {
  await onCheckConnection()
  try {
    adminModules.value = await movie.listAdminModules()
  } catch {
    adminModules.value = []
  }
  await loadCounts()
})

// Visual helpers moved to Avatar atom
</script>


