<template>
  <div class="space-y-8">
    <div class="text-center">
      <h3 class="text-foreground mb-2 text-2xl font-semibold">Let's Get to Know You</h3>
    </div>

    <div class="mx-auto max-w-2xl space-y-6">
      <!-- Avatar Upload -->
      <div class="text-center">
        <label class="text-foreground mb-4 block text-sm font-medium"> Profile Photo </label>
        <div class="relative inline-block">
          <div
            class="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-gray-200 dark:border-gray-600"
          >
            <img
              v-if="props.profileData.avatarUrl"
              :src="props.profileData.avatarUrl"
              alt="Profile"
              class="h-full w-full object-cover"
            />
            <div v-else class="bg-muted flex h-full w-full items-center justify-center">
              <Icon name="mdi:account" class="text-muted-foreground h-8 w-8" />
            </div>
          </div>
          <input
            ref="avatarInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleAvatarUpload"
          />
          <button
            type="button"
            @click="triggerAvatarUpload"
            class="absolute -right-1 -bottom-1 rounded-full bg-blue-500 p-2 text-white shadow-lg transition-colors hover:bg-blue-600"
          >
            <Icon name="mdi:camera" class="h-4 w-4" />
          </button>
        </div>
        <p class="dark:text-muted-foreground mt-2 text-xs text-gray-500">
          Click camera icon to upload
        </p>
      </div>

      <!-- Display Name -->
      <div>
        <label for="displayName" class="text-foreground mb-2 block text-sm font-medium">
          What should we call you? *
        </label>
        <input
          id="displayName"
          :value="props.profileData.displayName"
          type="text"
          required
          placeholder="Your professional name"
          class="border-border bg-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary w-full rounded-lg border px-4 py-3 text-lg shadow-sm focus:ring-2 focus:outline-none"
          @input="emit('update', { displayName: ($event.target as HTMLInputElement).value })"
        />
      </div>

      <!-- Location -->
      <div>
        <label for="location" class="text-foreground mb-2 block text-sm font-medium">
          Where do you call home? *
        </label>
        <input
          id="location"
          :value="props.profileData.location"
          type="text"
          required
          placeholder="City, Country"
          class="border-border bg-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary w-full rounded-lg border px-4 py-3 text-lg shadow-sm focus:ring-2 focus:outline-none"
          @input="emit('update', { location: ($event.target as HTMLInputElement).value })"
        />
      </div>

      <!-- Bio -->
      <div>
        <label for="bio" class="text-foreground mb-2 block text-sm font-medium">
          Describe your voice *
        </label>
        <textarea
          id="bio"
          :value="props.profileData.bio"
          required
          rows="4"
          placeholder="Describe your voice tone, range, style, characteristics, accents, or any unique vocal qualities that set you apart..."
          class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          @input="emit('update', { bio: ($event.target as HTMLTextAreaElement).value })"
        />
        <p class="dark:text-muted-foreground mt-1 text-xs text-gray-500">
          {{ props.profileData.bio.length }}/500 characters
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/lib/toast'
import Icon from '@/components/atoms/Icon.vue'

interface Props {
  profileData: {
    displayName: string
    bio: string
    location: string
    avatarUrl: string
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [data: Partial<Props['profileData']>]
}>()

const { error } = useToast()
const avatarInput = ref<HTMLInputElement | null>(null)

// Avatar upload methods
const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      error('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      error('Image file must be smaller than 5MB')
      return
    }

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      const avatarUrl = e.target?.result as string
      emit('update', { avatarUrl })
    }
    reader.readAsDataURL(file)
  }
}
</script>
