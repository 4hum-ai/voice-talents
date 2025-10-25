<template>
  <div class="space-y-8 text-center">
    <div
      class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-500"
    >
      <Icon name="mdi:check" class="h-12 w-12 text-white" />
    </div>
    <div>
      <h3 class="text-foreground mb-4 text-3xl font-bold">Welcome to VoiceTalents! 🎉</h3>
      <p class="text-muted-foreground mx-auto max-w-2xl text-lg">
        Your profile is complete and you're ready to start your voice acting journey. Let's get you
        connected with amazing opportunities!
      </p>
    </div>

    <div class="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
      <div class="rounded-xl bg-purple-50 p-6 dark:bg-purple-900/20">
        <div
          class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500"
        >
          <Icon name="mdi:account-search" class="h-6 w-6 text-white" />
        </div>
        <h4 class="mb-2 font-semibold text-purple-900 dark:text-purple-100">Find Opportunities</h4>
        <p class="text-sm text-purple-800 dark:text-purple-200">
          Browse casting calls and apply for projects
        </p>
      </div>

      <div class="rounded-xl bg-green-50 p-6 dark:bg-green-900/20">
        <div
          class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500"
        >
          <Icon name="mdi:chart-line" class="h-6 w-6 text-white" />
        </div>
        <h4 class="mb-2 font-semibold text-green-900 dark:text-green-100">Track Progress</h4>
        <p class="text-sm text-green-800 dark:text-green-200">
          Monitor your career growth and earnings
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/atoms/Icon.vue'
</script>
