<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <ClientNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <AppBar :show-back="true" @back="$router.back()">
        <template #title>Campaign Details</template>
        <template #subtitle>View and manage campaign details</template>
        <template #actions>
          <ThemeToggle />
        </template>
      </AppBar>

      <div class="px-4 py-8 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <div class="py-12 text-center">
            <MegaphoneIcon class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 class="text-foreground mb-2 text-lg font-medium">Campaign Details</h3>
            <p class="text-muted-foreground mb-6">
              This view will show detailed information about a specific campaign
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ClientNavigation from '@/components/organisms/ClientNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import MegaphoneIcon from '~icons/mdi/megaphone'
</script>
