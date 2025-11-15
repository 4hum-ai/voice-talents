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
              :src="currentActor?.avatarUrl"
              :alt="currentActor?.displayName"
              :seed="currentActor?.displayName || 'User'"
              size="sm"
            />
            <div class="min-w-0 flex-1">
              <p class="text-foreground truncate text-sm font-medium">
                {{ currentActor?.displayName }}
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
            @click="$router.push('/talent/settings')"
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
import type { VoiceTalentStats } from '@/types/voice-talent'
import { mockData } from '@/data/mock-voice-talent-data'
import { useAuth } from '@/lib/auth'
import { useSidebar } from '@/composables/useSidebar'
import { useTheme } from '@/composables/useTheme'
import Sidebar from '@/components/atoms/Sidebar.vue'
import Button from '@/components/atoms/Button.vue'
import Avatar from '@/components/atoms/Avatar.vue'
import HomeIcon from '~icons/mdi/home'
import UserIcon from '~icons/mdi/account'
import MegaphoneIcon from '~icons/mdi/megaphone'
import BriefcaseIcon from '~icons/mdi/briefcase'
import WalletIcon from '~icons/mdi/wallet'
// Icons removed; using Button icon prop instead

const router = useRouter()
const route = useRoute()
const { user, isAuthenticated, logout } = useAuth()
const { sidebarOpen, sidebarCollapsed, close } = useSidebar()
const { isDark, toggleTheme } = useTheme()

// Use authenticated user data instead of mock data
const currentActor = computed(() => {
  console.log('🔍 VoiceActNavigation: user:', user.value)
  console.log('🔍 VoiceActNavigation: isAuthenticated:', isAuthenticated.value)
  return {
    displayName: user.value?.displayName || user.value?.email || 'Voice Actor',
    avatarUrl: user.value?.photoURL,
  }
})

// Keep stats as mock for now, but this could be fetched from API based on user ID
const stats = ref<VoiceTalentStats>(mockData.voiceTalentStats)

// Computed
const activeItemId = computed(() => {
  const path = route.path
  if (path === '/talent/dashboard') return 'dashboard'
  if (path.startsWith('/talent/profile')) return 'profile'
  if (path.startsWith('/talent/jobs') && path.includes('/casting')) return 'casting'
  if (path.startsWith('/talent/jobs')) return 'jobs'
  if (path.startsWith('/talent/projects')) return 'projects'
  if (path.startsWith('/talent/casting')) return 'casting'
  if (path.startsWith('/talent/payouts')) return 'payouts'
  if (path.startsWith('/talent/settings')) return 'settings'
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
        description: 'Overview & activity',
        icon: HomeIcon,
        action: () => router.push('/talent/dashboard'),
      },
      {
        id: 'profile',
        title: 'My Profile',
        description: 'Profile & voice samples',
        icon: UserIcon,
        action: () => router.push('/talent/profile/edit'),
      },
    ],
  },
  {
    id: 'work',
    title: 'Work',
    items: [
      {
        id: 'jobs',
        title: 'My Jobs',
        description: 'Assigned voice acting jobs',
        icon: BriefcaseIcon,
        badge: stats.value.activeProjects,
        action: () => router.push('/talent/jobs'),
      },
      {
        id: 'casting',
        title: 'Casting Calls',
        description: 'Find new projects',
        icon: MegaphoneIcon,
        action: () => router.push('/talent/casting'),
      },
      {
        id: 'payouts',
        title: 'Payouts',
        description: 'Balance, history & requests',
        icon: WalletIcon,
        action: () => router.push('/talent/payouts'),
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
  // In real app, fetch current actor and stats from API
  console.log('VoiceTalents navigation loaded')
})
</script>
