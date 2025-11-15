<template>
  <Sidebar
    title="VoiceTalents.AI"
    :sections="navigationSections"
    :active-item-id="activeItemId"
    :default-collapsed="sidebarCollapsed"
    :is-open="sidebarOpen"
    @close="close"
    @update:collapsed="sidebarCollapsed = $event"
  >
    <template #header>
      <div class="p-4">
        <div class="flex items-center justify-between gap-3">
          <div class="flex min-w-0 flex-1 items-center space-x-3">
            <Avatar
              :src="currentClient?.logoUrl"
              :alt="currentClient?.companyName"
              :seed="currentClient?.companyName || 'Client'"
              size="sm"
            />
            <div class="min-w-0 flex-1">
              <p class="text-foreground truncate text-sm font-medium">
                {{ currentClient?.companyName }}
              </p>
              <p class="text-muted-foreground truncate text-xs">
                {{ user?.email }}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            class="flex-shrink-0"
            icon="mdi:logout"
            aria-label="Logout"
            @click="handleLogout"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="space-y-4">
        <!-- Action Buttons: Settings, Theme -->
        <div class="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            class="flex-1"
            icon="mdi:cog"
            aria-label="Settings"
            @click="$router.push('/client/settings')"
          />
          <Button
            variant="ghost"
            size="sm"
            class="flex-1"
            :icon="isDark ? 'mdi:weather-sunny' : 'mdi:weather-night'"
            :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
            @click="toggleTheme"
          />
        </div>
      </div>
    </template>
  </Sidebar>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { ClientStats } from '@/types/voice-client'
import { mockClientData } from '@/data/mock-voice-client-data'
import { useAuth } from '@/lib/auth'
import { useSidebar } from '@/composables/useSidebar'
import { useTheme } from '@/composables/useTheme'
import Sidebar from '@/components/atoms/Sidebar.vue'
import Button from '@/components/atoms/Button.vue'
import Avatar from '@/components/atoms/Avatar.vue'
import HomeIcon from '~icons/mdi/home'
import BriefcaseIcon from '~icons/mdi/briefcase'
import AccountGroupIcon from '~icons/mdi/account-group'

const router = useRouter()
const route = useRoute()
const { user, logout } = useAuth()
const { sidebarOpen, sidebarCollapsed, close } = useSidebar()
const { isDark, toggleTheme } = useTheme()

// Use authenticated user data instead of mock data
const currentClient = computed(() => ({
  companyName: user.value?.displayName || user.value?.email || 'Client',
  logoUrl: user.value?.photoURL,
  contactName: user.value?.displayName || user.value?.email || 'Contact',
}))

// Keep stats as mock for now, but this could be fetched from API based on user ID
const stats = ref<ClientStats>(mockClientData.clientStats)

// Computed
const activeItemId = computed(() => {
  const path = route.path
  if (path === '/client' || path === '/client/dashboard') return 'dashboard'
  if (path.startsWith('/client/jobs')) return 'jobs'
  if (path.startsWith('/client/talents')) return 'talents'
  if (path.startsWith('/client/invitations')) return 'invitations'
  if (path.startsWith('/client/settings')) return 'settings'
  return 'dashboard'
})

const navigationSections = computed(() => [
  {
    id: 'main',
    title: 'Main',
    items: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        description: 'Overview & analytics',
        icon: HomeIcon,
        action: () => router.push('/client/dashboard'),
      },
    ],
  },
  {
    id: 'casting',
    title: 'Casting',
    items: [
      {
        id: 'jobs',
        title: 'Jobs',
        description: 'View & manage casting jobs',
        icon: BriefcaseIcon,
        badge: stats.value.activeJobs,
        action: () => router.push('/client/jobs'),
      },
      {
        id: 'talents',
        title: 'Talents',
        description: 'Find & invite voice actors',
        icon: AccountGroupIcon,
        action: () => router.push('/client/talents'),
      },
    ],
  },
])

// Methods

const handleLogout = async () => {
  try {
    await logout()
    router.push('/auth')
  } catch (error) {
    console.error('Logout failed:', error)
    // Still redirect to auth page even if logout fails
    router.push('/auth')
  }
}

onMounted(() => {
  // In real app, fetch current client and stats from API
  console.log('Client navigation loaded')
})
</script>
