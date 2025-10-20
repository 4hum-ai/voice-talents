<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <ClientNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <AppBar :show-back="true" @back="$router.back()">
        <template #actions>
          <ThemeToggle />
        </template>
      </AppBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import ClientNavigation from '@/components/organisms/ClientNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
</script>
