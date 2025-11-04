<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <ClientNavigation />

    <!-- Main Content -->
    <div :class="['flex-1', sidebarCollapsed ? 'lg:ml-16' : '']">
      <!-- Header -->
      <AppBar :show-back="true" :show-menu="true" @back="$router.back()" @menu="toggleSidebar">
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
import { useSidebar } from '@/composables/useSidebar'

const { toggle: toggleSidebar, sidebarCollapsed } = useSidebar()
</script>
