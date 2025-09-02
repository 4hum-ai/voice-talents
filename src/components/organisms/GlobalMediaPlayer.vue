<template>
  <!-- Modal Mode -->
  <div
    v-if="visible && mode === 'modal'"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
  >
    <div class="relative mx-4 w-full max-w-6xl">
      <!-- Header -->
      <div class="absolute -top-10 right-0 flex items-center gap-3 text-white">
        <span v-if="title" class="max-w-xs truncate text-sm">{{ title }}</span>
        <button class="rounded-md bg-white/20 px-3 py-1 text-sm hover:bg-white/30" @click="close">
          Close
        </button>
      </div>

      <!-- Video Container -->
      <div class="overflow-hidden rounded-lg bg-black shadow-xl">
        <VideoPlayer
          :url="url"
          :title="title"
          :subtitle-url="subtitleUrl"
          :mode="mode"
          @close="close"
        />
      </div>
    </div>
  </div>

  <!-- Inline Mode -->
  <div v-else-if="visible && mode === 'inline'" class="w-full">
    <VideoPlayer
      :url="url"
      :title="title"
      :subtitle-url="subtitleUrl"
      :mode="mode"
      @close="close"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGlobalMediaPlayer } from '@/composables/useGlobalMediaPlayer'
import VideoPlayer from './VideoPlayer.vue'

const player = useGlobalMediaPlayer()
const visible = computed(() => player.visible.value)
const url = computed(() => player.url.value)
const title = computed(() => player.title.value)
const subtitleUrl = computed(() => player.subtitleUrl.value)
const mode = computed(() => player.mode.value)
const close = () => player.close()
</script>
