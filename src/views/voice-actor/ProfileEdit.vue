<template>
  <div class="min-h-screen bg-background flex">
    <!-- Navigation Sidebar -->
    <VoiceActNavigation />

    <!-- Main Content -->
    <div class="flex-1">
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
                  Edit Profile
                </h1>
                <p class="text-sm text-muted-foreground">
                  Update your professional information
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="outline" size="sm" @click="$router.back()">
                Cancel
              </Button>
              <Button variant="primary" size="sm" @click="saveProfile">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-4xl mx-auto">
          <!-- Profile Form -->
          <Card class="mb-8">
            <div class="p-6">
              <h2 class="text-lg font-semibold text-foreground mb-6">
                Basic Information
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput v-model="profile.displayName" label="Display Name" placeholder="Enter your display name"
                  required />

                <FormInput v-model="profile.email" label="Email" type="email" placeholder="Enter your email" required />

                <div class="md:col-span-2">
                  <Textarea v-model="profile.bio" label="Bio"
                    placeholder="Tell us about yourself and your voice acting experience" :rows="4" />
                </div>

                <FormInput v-model="profile.hourlyRate" label="Hourly Rate ($)" type="number" placeholder="150" />

                <FormInput v-model="profile.minProjectFee" label="Minimum Project Fee ($)" type="number"
                  placeholder="300" />
              </div>
            </div>
          </Card>

          <!-- Voice Characteristics -->
          <Card class="mb-8">
            <div class="p-6">
              <h2 class="text-lg font-semibold text-foreground mb-6">
                Voice Characteristics
              </h2>

              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Voice Characteristics
                  </label>
                  <TagInput v-model="profile.voiceCharacteristics"
                    placeholder="Add voice characteristics (e.g., warm, energetic, authoritative)" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Languages
                  </label>
                  <TagInput v-model="profile.languages" placeholder="Add languages you speak" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Accents
                  </label>
                  <TagInput v-model="profile.accents" placeholder="Add accents you can perform" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Genres
                  </label>
                  <TagInput v-model="profile.genres" placeholder="Add genres you specialize in" />
                </div>
              </div>
            </div>
          </Card>

          <!-- Social Links -->
          <Card class="mb-8">
            <div class="p-6">
              <h2 class="text-lg font-semibold text-foreground mb-6">
                Social Links & Website
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput v-model="profile.socialLinks.website" label="Website"
                  placeholder="https://yourwebsite.com" />

                <FormInput v-model="profile.socialLinks.linkedin" label="LinkedIn"
                  placeholder="https://linkedin.com/in/yourprofile" />

                <FormInput v-model="profile.socialLinks.twitter" label="Twitter"
                  placeholder="https://twitter.com/yourhandle" />

                <FormInput v-model="profile.socialLinks.instagram" label="Instagram"
                  placeholder="https://instagram.com/yourhandle" />

                <FormInput v-model="profile.socialLinks.youtube" label="YouTube"
                  placeholder="https://youtube.com/yourchannel" />
              </div>
            </div>
          </Card>

          <!-- Profile Settings -->
          <Card>
            <div class="p-6">
              <h2 class="text-lg font-semibold text-foreground mb-6">
                Profile Settings
              </h2>

              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium text-foreground">
                      Public Profile
                    </h3>
                    <p class="text-sm text-muted-foreground">
                      Make your profile visible to clients and casting directors
                    </p>
                  </div>
                  <Checkbox v-model="profile.isPublic" />
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium text-foreground">
                      Verified Badge
                    </h3>
                    <p class="text-sm text-muted-foreground">
                      Show verified status on your profile
                    </p>
                  </div>
                  <Checkbox v-model="profile.isVerified" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Availability Status
                  </label>
                  <SelectInput v-model="profile.availabilityStatus" :options="availabilityOptions"
                    placeholder="Select availability" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import FormInput from '@/components/atoms/FormInput.vue'
import Textarea from '@/components/atoms/Textarea.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import TagInput from '@/components/atoms/TagInput.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import Checkbox from '@/components/atoms/Checkbox.vue'
import ArrowLeftIcon from '~icons/mdi/arrow-left'
import type { VoiceActor } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'

const router = useRouter()

// Mock profile data - in real app, this would come from API
const profile = reactive<VoiceActor>({ ...mockData.voiceActors[0] })

const availabilityOptions = [
  { value: 'available', label: 'Available' },
  { value: 'busy', label: 'Busy' },
  { value: 'unavailable', label: 'Unavailable' }
]

const saveProfile = () => {
  // In real app, this would save to API
  console.log('Saving profile:', profile)
  router.push('/profile')
}
</script>
