<template>
  <div class="min-h-screen bg-background flex">
    <!-- Navigation Sidebar -->
    <VoiceActNavigation />

    <!-- Main Content -->
    <div class="flex-1 ml-72">
      <!-- Header -->
      <div class="bg-card shadow-sm border-b border-border">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <Button variant="ghost" size="sm" @click="$router.back()" class="mr-4">
              <ArrowLeftIcon class="h-4 w-4" />
            </Button>
            <div>
              <h1 class="text-2xl font-bold text-foreground">
                My Profile
              </h1>
              <p class="text-sm text-muted-foreground">
                Manage your voice actor profile and showcase your talent
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" @click="togglePublicProfile">
              <EyeIcon v-if="profile.isPublic" class="h-4 w-4 mr-2" />
              <EyeOffIcon v-else class="h-4 w-4 mr-2" />
              {{ profile.isPublic ? 'Public' : 'Private' }}
            </Button>
            <Button variant="primary" size="sm" @click="$router.push('/profile/edit')">
              <EditIcon class="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
        </div>
      </div>
      </div>

      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Profile Info -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Profile Header -->
          <Card>
            <div class="flex items-start space-x-6">
              <!-- Avatar -->
              <div class="flex-shrink-0">
                <Avatar
                  :src="profile.avatarUrl"
                  :alt="profile.displayName"
                  size="xl"
                  class="ring-4 ring-white dark:ring-gray-800"
                />
              </div>
              
              <!-- Profile Details -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-3 mb-2">
                  <h2 class="text-2xl font-bold text-foreground">
                    {{ profile.displayName }}
                  </h2>
                  <div v-if="profile.isVerified" class="flex items-center text-green-600">
                    <CheckIcon class="h-5 w-5" />
                    <span class="ml-1 text-sm font-medium">Verified</span>
                  </div>
                </div>
                
                <p class="text-muted-foreground mb-4">
                  {{ profile.bio }}
                </p>
                
                <!-- Quick Stats -->
                <div class="grid grid-cols-3 gap-4">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-foreground">
                      {{ profile.totalProjects }}
                    </div>
                    <div class="text-sm text-muted-foreground">
                      Projects
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-foreground">
                      {{ profile.averageRating.toFixed(1) }}
                    </div>
                    <div class="text-sm text-muted-foreground">
                      Rating
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-foreground">
                      ${{ profile.totalEarnings.toLocaleString() }}
                    </div>
                    <div class="text-sm text-muted-foreground">
                      Earnings
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <!-- Skills & Languages -->
          <Card>
            <template #header>
              <h3 class="text-lg font-semibold text-foreground">
                Skills & Languages
              </h3>
            </template>
            
            <div class="space-y-6">
              <!-- Languages -->
              <div>
                <h4 class="text-sm font-medium text-foreground mb-3">
                  Languages
                </h4>
                <div class="flex flex-wrap gap-2">
                  <Chip
                    v-for="language in profile.languages"
                    :key="language"
                    variant="primary"
                  >
                    {{ language }}
                  </Chip>
                </div>
              </div>
              
              <!-- Accents -->
              <div>
                <h4 class="text-sm font-medium text-foreground mb-3">
                  Accents
                </h4>
                <div class="flex flex-wrap gap-2">
                  <Chip
                    v-for="accent in profile.accents"
                    :key="accent"
                    variant="secondary"
                  >
                    {{ accent }}
                  </Chip>
                </div>
              </div>
              
              <!-- Voice Types -->
              <div>
                <h4 class="text-sm font-medium text-foreground mb-3">
                  Voice Types
                </h4>
                <div class="flex flex-wrap gap-2">
                  <Chip
                    v-for="voiceType in profile.voiceTypes"
                    :key="voiceType"
                    variant="outline"
                  >
                    {{ formatVoiceType(voiceType) }}
                  </Chip>
                </div>
              </div>
              
              <!-- Skills -->
              <div>
                <h4 class="text-sm font-medium text-foreground mb-3">
                  Specialized Skills
                </h4>
                <div class="flex flex-wrap gap-2">
                  <Chip
                    v-for="skill in profile.skills"
                    :key="skill"
                    variant="success"
                  >
                    {{ skill }}
                  </Chip>
                </div>
              </div>
            </div>
          </Card>

          <!-- Experience & Rates -->
          <Card>
            <template #header>
              <h3 class="text-lg font-semibold text-foreground">
                Experience & Rates
              </h3>
            </template>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="text-sm font-medium text-foreground mb-2">
                  Experience Level
                </h4>
                <Chip
                  :variant="getExperienceVariant(profile.experience)"
                  size="lg"
                >
                  {{ formatExperience(profile.experience) }}
                </Chip>
              </div>
              
              <div>
                <h4 class="text-sm font-medium text-foreground mb-2">
                  Hourly Rate
                </h4>
                <div class="text-2xl font-bold text-foreground">
                  ${{ profile.hourlyRate }}/hour
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ profile.currency }}
                </div>
              </div>
              
              <div>
                <h4 class="text-sm font-medium text-foreground mb-2">
                  Location
                </h4>
                <div class="text-foreground">
                  {{ profile.location }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ profile.timezone }}
                </div>
              </div>
              
              <div>
                <h4 class="text-sm font-medium text-foreground mb-2">
                  Availability
                </h4>
                <StatusBadge
                  :status="profile.availability"
                  :variant="getAvailabilityVariant(profile.availability)"
                />
              </div>
            </div>
          </Card>

          <!-- Demo Reel & Links -->
          <Card>
            <template #header>
              <h3 class="text-lg font-semibold text-foreground">
                Demo Reel & Links
              </h3>
            </template>
            
            <div class="space-y-4">
              <!-- Demo Reel -->
              <div v-if="profile.demoReelUrl">
                <h4 class="text-sm font-medium text-foreground mb-2">
                  Demo Reel
                </h4>
                <Button
                  variant="outline"
                  @click="openDemoReel"
                  class="w-full justify-start"
                >
                  <PlayIcon class="h-4 w-4 mr-2" />
                  Watch Demo Reel
                </Button>
              </div>
              
              <!-- Website -->
              <div v-if="profile.website">
                <h4 class="text-sm font-medium text-foreground mb-2">
                  Website
                </h4>
                <Button
                  variant="outline"
                  @click="openWebsite"
                  class="w-full justify-start"
                >
                  <ExternalLinkIcon class="h-4 w-4 mr-2" />
                  {{ profile.website }}
                </Button>
              </div>
              
              <!-- Social Links -->
              <div v-if="hasSocialLinks">
                <h4 class="text-sm font-medium text-foreground mb-2">
                  Social Media
                </h4>
                <div class="flex space-x-2">
                  <Button
                    v-if="profile.socialLinks.twitter"
                    variant="outline"
                    size="sm"
                    @click="openSocialLink('twitter', profile.socialLinks.twitter!)"
                  >
                    <TwitterIcon class="h-4 w-4" />
                  </Button>
                  <Button
                    v-if="profile.socialLinks.linkedin"
                    variant="outline"
                    size="sm"
                    @click="openSocialLink('linkedin', profile.socialLinks.linkedin!)"
                  >
                    <LinkedinIcon class="h-4 w-4" />
                  </Button>
                  <Button
                    v-if="profile.socialLinks.instagram"
                    variant="outline"
                    size="sm"
                    @click="openSocialLink('instagram', profile.socialLinks.instagram!)"
                  >
                    <InstagramIcon class="h-4 w-4" />
                  </Button>
                  <Button
                    v-if="profile.socialLinks.youtube"
                    variant="outline"
                    size="sm"
                    @click="openSocialLink('youtube', profile.socialLinks.youtube!)"
                  >
                    <YoutubeIcon class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Right Column - Stats & Actions -->
        <div class="space-y-8">
          <!-- Quick Actions -->
          <Card>
            <template #header>
              <h3 class="text-lg font-semibold text-foreground">
                Quick Actions
              </h3>
            </template>
            
            <div class="space-y-3">
              <Button
                variant="outline"
                class="w-full justify-start"
                @click="$router.push('/samples/upload')"
              >
                <UploadIcon class="h-4 w-4 mr-3" />
                Upload Voice Sample
              </Button>
              <Button
                variant="outline"
                class="w-full justify-start"
                @click="$router.push('/casting')"
              >
                <MagnifyIcon class="h-4 w-4 mr-3" />
                Browse Casting Calls
              </Button>
              <Button
                variant="outline"
                class="w-full justify-start"
                @click="shareProfile"
              >
                <ShareIcon class="h-4 w-4 mr-3" />
                Share Profile
              </Button>
              <Button
                variant="outline"
                class="w-full justify-start"
                @click="copyProfileLink"
              >
                <CopyIcon class="h-4 w-4 mr-3" />
                Copy Profile Link
              </Button>
            </div>
          </Card>

          <!-- Profile Stats -->
          <Card>
            <template #header>
              <h3 class="text-lg font-semibold text-foreground">
                Profile Statistics
              </h3>
            </template>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Profile Views</span>
                <span class="text-sm font-medium text-foreground">
                  {{ profileStats.profileViews.toLocaleString() }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Sample Plays</span>
                <span class="text-sm font-medium text-foreground">
                  {{ profileStats.samplePlays.toLocaleString() }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Downloads</span>
                <span class="text-sm font-medium text-foreground">
                  {{ profileStats.downloads.toLocaleString() }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Member Since</span>
                <span class="text-sm font-medium text-foreground">
                  {{ formatDate(profile.joinedDate) }}
                </span>
              </div>
            </div>
          </Card>

          <!-- Recent Activity -->
          <Card>
            <template #header>
              <h3 class="text-lg font-semibold text-foreground">
                Recent Activity
              </h3>
            </template>
            
            <div class="space-y-3">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="flex items-start space-x-3"
              >
                <div class="flex-shrink-0">
                  <div class="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Icon
                      :name="getActivityIcon(activity.type)"
                      class="h-3 w-3 text-blue-600 dark:text-blue-400"
                    />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-foreground">
                    {{ activity.title }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    {{ formatTimeAgo(activity.timestamp) }}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { VoiceActor, ActivityItem } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import Chip from '@/components/atoms/Chip.vue'
import Avatar from '@/components/atoms/Avatar.vue'
import Icon from '@/components/atoms/Icon.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import ArrowLeftIcon from '~icons/mdi/arrow-left'
import EyeIcon from '~icons/mdi/eye'
import EyeOffIcon from '~icons/mdi/eye-off'
import EditIcon from '~icons/mdi/pencil'
import CheckIcon from '~icons/mdi/check'
import PlayIcon from '~icons/mdi/play'
import ExternalLinkIcon from '~icons/mdi/open-in-new'
import TwitterIcon from '~icons/mdi/twitter'
import LinkedinIcon from '~icons/mdi/linkedin'
import InstagramIcon from '~icons/mdi/instagram'
import YoutubeIcon from '~icons/mdi/youtube'
import UploadIcon from '~icons/mdi/upload'
import MagnifyIcon from '~icons/mdi/magnify'
import ShareIcon from '~icons/mdi/share'
import CopyIcon from '~icons/mdi/content-copy'

const router = useRouter()

// Mock data - in real app, this would come from API
const profile = ref<VoiceActor>(mockData.voiceActors[0])
const recentActivity = ref<ActivityItem[]>(mockData.voiceActorStats.recentActivity.slice(0, 5))

const profileStats = ref({
  profileViews: 1247,
  samplePlays: 8920,
  downloads: 156
})

// Computed
const hasSocialLinks = computed(() => {
  const links = profile.value.socialLinks
  return links.twitter || links.linkedin || links.instagram || links.youtube
})

// Methods
const togglePublicProfile = () => {
  profile.value.isPublic = !profile.value.isPublic
  // In real app, this would update via API
}

const formatVoiceType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
}

const formatExperience = (experience: string) => {
  return experience.charAt(0).toUpperCase() + experience.slice(1)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
}

const formatTimeAgo = (timestamp: string) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  return time.toLocaleDateString()
}

const getExperienceVariant = (experience: string) => {
  const variants: Record<string, string> = {
    beginner: 'secondary',
    intermediate: 'primary',
    advanced: 'warning',
    professional: 'success'
  }
  return variants[experience] || 'secondary'
}

const getAvailabilityVariant = (availability: string) => {
  const variants: Record<string, string> = {
    available: 'success',
    busy: 'warning',
    unavailable: 'danger'
  }
  return variants[availability] || 'secondary'
}

const getActivityIcon = (type: string) => {
  const icons: Record<string, string> = {
    project: 'folder-open',
    assignment: 'clipboard-text',
    recording: 'microphone',
    payment: 'currency-usd',
    message: 'message'
  }
  return icons[type] || 'information'
}

const openDemoReel = () => {
  if (profile.value.demoReelUrl) {
    window.open(profile.value.demoReelUrl, '_blank')
  }
}

const openWebsite = () => {
  if (profile.value.website) {
    window.open(profile.value.website, '_blank')
  }
}

const openSocialLink = (platform: string, handle: string) => {
  const urls: Record<string, string> = {
    twitter: `https://twitter.com/${handle.replace('@', '')}`,
    linkedin: `https://linkedin.com/in/${handle}`,
    instagram: `https://instagram.com/${handle.replace('@', '')}`,
    youtube: `https://youtube.com/@${handle.replace('@', '')}`
  }
  
  const url = urls[platform]
  if (url) {
    window.open(url, '_blank')
  }
}

const shareProfile = () => {
  const url = `${window.location.origin}/public/${profile.value.id}`
  if (navigator.share) {
    navigator.share({
      title: `${profile.value.displayName} - Voice Actor`,
      text: `Check out ${profile.value.displayName}'s voice acting profile`,
      url: url
    })
  } else {
    copyToClipboard(url)
  }
}

const copyProfileLink = () => {
  const url = `${window.location.origin}/public/${profile.value.id}`
  copyToClipboard(url)
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    // Show toast notification
    console.log('Copied to clipboard:', text)
  })
}

onMounted(() => {
  // In real app, fetch profile data from API
  console.log('Profile view loaded with mock data')
})
</script>
