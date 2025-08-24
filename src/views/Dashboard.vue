<template>
  <main class="p-6">
    <PageHeader>
      <template #title>
        Admin Dashboard
      </template>
      <template #subtitle>
        Manage organizations, users, media, titles, revenues, distributions, and payouts
      </template>
      <template #actions>
        <div class="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div class="flex items-center gap-2 text-sm w-full sm:w-auto">
            <span
              class="inline-block h-2.5 w-2.5 rounded-full"
              :class="{
                'bg-green-500': connectionStatus === 'connected',
                'bg-red-500': connectionStatus === 'disconnected',
                'bg-gray-300': connectionStatus === 'unknown'
              }"
            />
            <span class="text-gray-700 capitalize">{{ connectionStatus }}</span>
            <span v-if="lastCheck" class="text-gray-500">· Last check: {{ lastCheck.toLocaleTimeString() }}</span>
          </div>
          <ActionsMenu
            :items="[
              { key: 'check-connection', label: checking ? 'Checking…' : 'Check Connection' },
              { key: 'refresh-stats', label: loadingCounts ? 'Refreshing…' : 'Refresh Stats' }
            ]"
            @select="onMenuSelect"
          >
            <template #label>
              More
            </template>
          </ActionsMenu>
        </div>
      </template>
    </PageHeader>

    <section v-if="connectionStatus === 'disconnected'" class="mb-6 p-4 rounded-md border border-red-200 bg-red-50 text-red-800">
      Unable to reach the API. Verify your `.env` has `VITE_PUBLIC_API_URL` configured per the README and that the gateway is running.
    </section>

    <section>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <router-link
          v-for="m in adminModules"
          :key="m.name"
          :to="`/${m.name}`"
          class="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-base font-semibold text-gray-900">{{ m.displayName || toTitle(m.name) }}</h3>
              <p v-if="m.description" class="mt-1 text-sm text-gray-500">{{ m.description }}</p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900">
                {{ formatCount(counts[m.name]) }}
              </div>
              <div class="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </router-link>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'
import { useConnectionStatus } from '@/composables/useConnectionStatus'
import { useMovieService, type AdminModuleInfo } from '@/composables/useMovieService'

// Intentionally not using router routes for modules; rely on admin-ui modules API

const { connectionStatus, lastCheck, checking, checkConnection } = useConnectionStatus()
const movie = useMovieService()

const counts = ref<Record<string, number | null>>({})
const adminModules = ref<AdminModuleInfo[]>([])
const loadingCounts = ref(false)

const toTitle = (value: string): string => {
  const base = value.replace(/^\//, '').replace(/-/g, ' ')
  return base.charAt(0).toUpperCase() + base.slice(1)
}

const formatCount = (n: number | null | undefined): string => {
  if (n === null || n === undefined) return '—'
  return new Intl.NumberFormat().format(n)
}

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

const onMenuSelect = async (key: string) => {
  if (key === 'check-connection') {
    await onCheckConnection()
  } else if (key === 'refresh-stats') {
    await loadCounts()
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
</script>


