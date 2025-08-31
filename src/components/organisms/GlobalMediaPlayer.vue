<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
  >
    <div class="relative w-full max-w-4xl mx-4">
      <div class="absolute -top-10 right-0 flex items-center gap-3 text-white">
        <span
          v-if="title"
          class="text-sm truncate max-w-xs"
        >{{ title }}</span>
        <button
          class="rounded-md bg-white/20 px-3 py-1 text-sm hover:bg-white/30"
          @click="close"
        >
          Close
        </button>
      </div>
      <div class="bg-black rounded-lg overflow-hidden shadow-xl">
        <video
          v-if="type === 'video'"
          :src="url"
          controls
          autoplay
          class="w-full h-auto"
        />
        <audio
          v-else
          :src="url"
          controls
          autoplay
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useGlobalMediaPlayer } from "@/composables/useGlobalMediaPlayer";

const player = useGlobalMediaPlayer();
const visible = computed(() => player.visible.value);
const url = computed(() => player.url.value);
const title = computed(() => player.title.value);
const type = computed(() => player.type.value);
const close = () => player.close();
</script>


