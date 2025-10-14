<template>
  <Sidebar
    title="VoiceAct.AI"
    :sections="navigationSections"
    :active-item-id="activeItemId"
    :fixed="false"
    :default-collapsed="false"
  >
    <template #header>
      <div class="p-4">
        <div class="flex items-center space-x-3">
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
              {{ currentClient?.contactName }} • {{ currentClient?.industry }}
            </p>
          </div>
        </div>

        <!-- Role Switcher -->
        <div class="border-border mt-3 border-t pt-3">
          <Button
            variant="ghost"
            size="sm"
            class="w-full justify-start"
            @click="switchToVoiceActor"
          >
            <UserIcon class="mr-2 h-4 w-4" />
            Switch to Voice Actor
          </Button>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="space-y-3">
        <!-- Quick Stats -->
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="bg-muted rounded p-2 text-center">
            <div class="text-foreground font-semibold">
              {{ stats.activeJobs }}
            </div>
            <div class="text-muted-foreground">Active Jobs</div>
          </div>
          <div class="bg-muted rounded p-2 text-center">
            <div class="text-foreground font-semibold">
              ${{ stats.monthlySpent.toLocaleString() }}
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
            @click="$router.push('/client/settings')"
          >
            <CogIcon class="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" class="flex-1" @click="handleLogout">
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
import type { VoiceClient, ClientStats } from '@/types/voice-client'
import { mockClientData } from '@/data/mock-voice-client-data'
import { useOnboarding } from '@/composables/useOnboarding'
import Sidebar from '@/components/atoms/Sidebar.vue'
import Button from '@/components/atoms/Button.vue'
import Avatar from '@/components/atoms/Avatar.vue'
import HomeIcon from '~icons/mdi/home'
import BriefcaseIcon from '~icons/mdi/briefcase'
import AccountGroupIcon from '~icons/mdi/account-group'
import CogIcon from '~icons/mdi/cog'
import LogoutIcon from '~icons/mdi/logout'
import UserIcon from '~icons/mdi/account'

const router = useRouter()
const route = useRoute()
const { switchMode } = useOnboarding()

// Mock data - in real app, this would come from API
const currentClient = ref<VoiceClient>(mockClientData.voiceClients[0])
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
const switchToVoiceActor = () => {
  // Switch to talent mode and navigate to dashboard
  console.log('Switching to voice actor view')
  switchMode('talent')
  router.push('/talent/dashboard')
}

const handleLogout = () => {
  // In real app, this would handle logout
  console.log('Logout clicked')
  router.push('/auth')
}

onMounted(() => {
  // In real app, fetch current client and stats from API
  console.log('Client navigation loaded')
})
</script>
