<template>
  <div class="space-y-8 text-center">
    <div
      class="icon-bounce mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600"
    >
      <Icon name="mdi:microphone" class="h-16 w-16 text-white" />
    </div>
    <div>
      <h3 class="text-foreground mb-4 text-3xl font-bold">Welcome to VoiceTalents! 🎙️</h3>
      <p class="text-muted-foreground mx-auto max-w-2xl text-lg">
        Let's get you set up for success! We'll help you create a professional profile that
        showcases your voice acting talent.
      </p>
    </div>
    <div class="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-3">
      <div class="p-4 text-center">
        <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500">
          <Icon name="mdi:account" class="h-6 w-6 text-white" />
        </div>
        <h4 class="text-foreground mb-1 font-semibold">Profile Setup</h4>
        <p class="text-muted-foreground text-sm">Create your professional profile</p>
      </div>
      <div class="p-4 text-center">
        <div
          class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500"
        >
          <Icon name="mdi:upload" class="h-6 w-6 text-white" />
        </div>
        <h4 class="text-foreground mb-1 font-semibold">Voice Samples</h4>
        <p class="text-muted-foreground text-sm">Upload your best work</p>
      </div>
      <div class="p-4 text-center">
        <div
          class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500"
        >
          <Icon name="mdi:currency-usd" class="h-6 w-6 text-white" />
        </div>
        <h4 class="text-foreground mb-1 font-semibold">Set Rates</h4>
        <p class="text-muted-foreground text-sm">Define your pricing</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/atoms/Icon.vue'
</script>

<style scoped>
.icon-bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-10px);
  }

  60% {
    transform: translateY(-5px);
  }
}
</style>
