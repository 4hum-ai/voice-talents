<template>
  <Sidebar
    title="VoiceAct.AI"
    :sections="navigationSections"
    :active-item-id="activeItemId"
    :fixed="true"
    :default-collapsed="sidebarCollapsed"
    :is-open="sidebarOpen"
    @close="close"
    @update:collapsed="sidebarCollapsed = $event"
  >
    <template #header>
      <div class="p-4">
        <div class="flex items-center space-x-3">
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
              {{ authStore.user?.email }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="space-y-3">
        <!-- Quick Stats -->
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="bg-muted rounded p-2 text-center">
            <div class="text-foreground font-semibold">
              {{ stats.activeProjects }}
            </div>
            <div class="text-muted-foreground">Active</div>
          </div>
          <div class="bg-muted rounded p-2 text-center">
            <div class="text-foreground font-semibold">
              ${{ stats.monthlyEarnings.toLocaleString() }}
            </div>
            <div class="text-muted-foreground">This Month</div>
          </div>
        </div>

        <!-- Role Switcher -->
        <div class="mb-3">
          <Button
            variant="ghost"
            size="sm"
            class="w-full justify-start"
            icon="mdi:briefcase"
            @click="switchToClient"
            >Switch to Client</Button
          >
        </div>

        <!-- Settings & Logout -->
        <div class="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            class="flex-1"
            icon="mdi:cog"
            @click="$router.push('/talent/settings')"
          />
          <Button
            variant="ghost"
            size="sm"
            class="flex-1"
            icon="mdi:logout"
            @click="handleLogout"
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
import { useOnboarding } from '@/composables/useOnboarding'
import { useAuthStore } from '@/stores/auth'
import { useSidebar } from '@/composables/useSidebar'
import Sidebar from '@/components/atoms/Sidebar.vue'
import Button from '@/components/atoms/Button.vue'
import Avatar from '@/components/atoms/Avatar.vue'
import HomeIcon from '~icons/mdi/home'
import UserIcon from '~icons/mdi/account'
import MegaphoneIcon from '~icons/mdi/megaphone'
import BriefcaseIcon from '~icons/mdi/briefcase'
// Icons removed; using Button icon prop instead

const router = useRouter()
const route = useRoute()
const { switchMode } = useOnboarding()
const authStore = useAuthStore()
const { sidebarOpen, sidebarCollapsed, close } = useSidebar()

// Use authenticated user data instead of mock data
const currentActor = computed(() => {
  console.log('🔍 VoiceActNavigation: authStore.user:', authStore.user)
  console.log('🔍 VoiceActNavigation: authStore.isAuthenticated:', authStore.isAuthenticated)
  return {
    displayName: authStore.user?.displayName || authStore.user?.email || 'Voice Actor',
    avatarUrl: authStore.user?.photoURL,
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
    ],
  },
])

// Methods
const switchToClient = () => {
  // Switch to client mode and navigate to dashboard
  console.log('Switching to client view')
  switchMode('client')
  router.push('/client/dashboard')
}

const handleLogout = async () => {
  try {
    await authStore.logoutUser()
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
