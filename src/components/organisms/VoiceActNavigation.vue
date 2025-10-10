<template>
  <Sidebar
    title="VoiceAct"
    subtitle="Voice Actor Platform"
    :sections="navigationSections"
    :active-item-id="activeItemId"
    :fixed="false"
    :default-collapsed="false"
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
            <p class="text-sm font-medium text-foreground truncate">
              {{ currentActor?.displayName }}
            </p>
            <p class="text-xs text-muted-foreground truncate">
              {{ currentActor?.experience }} • {{ currentActor?.location }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="space-y-3">
        <!-- Quick Stats -->
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="text-center p-2 bg-muted rounded">
            <div class="font-semibold text-foreground">
              {{ stats.activeProjects }}
            </div>
            <div class="text-muted-foreground">Active</div>
          </div>
          <div class="text-center p-2 bg-muted rounded">
            <div class="font-semibold text-foreground">
              ${{ stats.monthlyEarnings.toLocaleString() }}
            </div>
            <div class="text-muted-foreground">This Month</div>
          </div>
        </div>

        <!-- Settings & Logout -->
        <div class="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            class="flex-1"
            @click="$router.push('/settings')"
          >
            <CogIcon class="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            class="flex-1"
            @click="handleLogout"
          >
            <LogoutIcon class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </template>
  </Sidebar>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { VoiceActor, VoiceActorStats } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'
import Sidebar from '@/components/atoms/Sidebar.vue'
import Button from '@/components/atoms/Button.vue'
import Avatar from '@/components/atoms/Avatar.vue'
import HomeIcon from '~icons/mdi/home'
import UserIcon from '~icons/mdi/account'
import MicrophoneIcon from '~icons/mdi/microphone'
import FolderOpenIcon from '~icons/mdi/folder-open'
import MegaphoneIcon from '~icons/mdi/megaphone'
import CurrencyUsdIcon from '~icons/mdi/currency-usd'
import ChartLineIcon from '~icons/mdi/chart-line'
import BellIcon from '~icons/mdi/bell'
import MessageIcon from '~icons/mdi/message'
import CogIcon from '~icons/mdi/cog'
import LogoutIcon from '~icons/mdi/logout'
import EyeIcon from '~icons/mdi/eye'

const router = useRouter()
const route = useRoute()

// Mock data - in real app, this would come from API
const currentActor = ref<VoiceActor>(mockData.voiceActors[0])
const stats = ref<VoiceActorStats>(mockData.voiceActorStats)

// Computed
const activeItemId = computed(() => {
  const path = route.path
  if (path === '/') return 'dashboard'
  if (path.startsWith('/profile')) return 'profile'
  if (path.startsWith('/samples')) return 'samples'
  if (path.startsWith('/projects')) return 'projects'
  if (path.startsWith('/studios')) return 'studios'
  if (path.startsWith('/casting')) return 'casting'
  if (path.startsWith('/earnings')) return 'earnings'
  if (path.startsWith('/analytics')) return 'analytics'
  if (path.startsWith('/notifications')) return 'notifications'
  if (path.startsWith('/messages')) return 'messages'
  if (path.startsWith('/settings')) return 'settings'
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
        action: () => router.push('/')
      },
      {
        id: 'profile',
        title: 'My Profile',
        description: 'Manage your profile',
        icon: UserIcon,
        action: () => router.push('/profile')
      }
    ]
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    items: [
      {
        id: 'samples',
        title: 'Voice Samples',
        description: 'Manage your samples',
        icon: MicrophoneIcon,
        badge: stats.value.totalSamples,
        action: () => router.push('/samples')
      },
      {
        id: 'projects',
        title: 'My Projects',
        description: 'Track your work',
        icon: FolderOpenIcon,
        badge: stats.value.activeProjects,
        action: () => router.push('/projects')
      }
    ]
  },
  {
    id: 'opportunities',
    title: 'Opportunities',
    items: [
      {
        id: 'casting',
        title: 'Casting Calls',
        description: 'Find new projects',
        icon: MegaphoneIcon,
        action: () => router.push('/casting')
      },
      {
        id: 'studios',
        title: 'Studios',
        description: 'Browse studios',
        icon: EyeIcon,
        action: () => router.push('/studios')
      }
    ]
  },
  {
    id: 'business',
    title: 'Business',
    items: [
      {
        id: 'earnings',
        title: 'Earnings',
        description: 'Track your income',
        icon: CurrencyUsdIcon,
        action: () => router.push('/earnings')
      },
      {
        id: 'analytics',
        title: 'Analytics',
        description: 'Performance insights',
        icon: ChartLineIcon,
        action: () => router.push('/analytics')
      }
    ]
  },
  {
    id: 'communication',
    title: 'Communication',
    items: [
      {
        id: 'notifications',
        title: 'Notifications',
        description: 'Stay updated',
        icon: BellIcon,
        badge: mockData.notifications.filter(n => !n.isRead).length,
        action: () => router.push('/notifications')
      },
      {
        id: 'messages',
        title: 'Messages',
        description: 'Project communication',
        icon: MessageIcon,
        action: () => router.push('/messages')
      }
    ]
  }
])

// Methods
const handleLogout = () => {
  // In real app, this would handle logout
  console.log('Logout clicked')
  router.push('/auth')
}

onMounted(() => {
  // In real app, fetch current actor and stats from API
  console.log('VoiceAct navigation loaded')
})
</script>
