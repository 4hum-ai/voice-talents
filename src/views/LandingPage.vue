<template>
  <div class="min-h-screen bg-gradient-to-br from-background to-muted/50">
    <!-- Header -->
    <header class="border-b border-border bg-background/80 backdrop-blur-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center space-x-2">
            <Icon name="mdi:microphone" class="h-8 w-8 text-primary" />
            <h1 class="text-xl font-bold text-foreground">VoiceAct.AI</h1>
          </div>
          <div class="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" size="sm" @click="$router.push('/auth')">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <!-- Hero Section -->
      <div class="text-center">
        <h2 class="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          AI Native Voice Talent Platform
        </h2>
        <p class="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Choose your role to get started.
        </p>
      </div>

      <!-- Entry Points -->
      <div class="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- Voice Talent Entry -->
        <Card class="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div class="p-8 text-center">
            <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Icon name="mdi:microphone" class="h-10 w-10 text-primary" />
            </div>
            <h3 class="mb-4 text-2xl font-bold text-foreground">
              I'm a Voice Talent
            </h3>
            <p class="mb-6 text-muted-foreground">
              Showcase your voice acting skills, find casting opportunities, and grow your career with professional clients.
            </p>
            <div class="space-y-3">
              <div class="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Icon name="mdi:check-circle" class="h-5 w-5 text-green-500" />
                <span>Browse casting calls</span>
              </div>
              <div class="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Icon name="mdi:check-circle" class="h-5 w-5 text-green-500" />
                <span>Manage your portfolio</span>
              </div>
              <div class="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Icon name="mdi:check-circle" class="h-5 w-5 text-green-500" />
                <span>Track your projects</span>
              </div>
            </div>
            <Button 
              variant="primary" 
              size="lg" 
              class="mt-6 w-full"
              @click="navigateToVoiceActor"
            >
              Enter
              <Icon name="mdi:arrow-right" class="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Card>

        <!-- Client Entry -->
        <Card class="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div class="p-8 text-center">
            <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
              <Icon name="mdi:briefcase" class="h-10 w-10 text-green-600" />
            </div>
            <h3 class="mb-4 text-2xl font-bold text-foreground">
              I'm a Client
            </h3>
            <p class="mb-6 text-muted-foreground">
              Find the perfect voice talent for your projects, manage campaigns, and collaborate with professional voice actors.
            </p>
            <div class="space-y-3">
              <div class="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Icon name="mdi:check-circle" class="h-5 w-5 text-green-500" />
                <span>Post job opportunities</span>
              </div>
              <div class="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Icon name="mdi:check-circle" class="h-5 w-5 text-green-500" />
                <span>Browse talent profiles</span>
              </div>
              <div class="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Icon name="mdi:check-circle" class="h-5 w-5 text-green-500" />
                <span>Manage your projects</span>
              </div>
            </div>
            <Button 
              variant="primary" 
              size="lg" 
              class="mt-6 w-full"
              @click="navigateToClient"
            >
              Enter
              <Icon name="mdi:arrow-right" class="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Card>
      </div>
    </main>

    <!-- Footer -->
    <footer class="mt-20 border-t border-border bg-background/80 backdrop-blur-sm">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="text-center text-sm text-muted-foreground">
          © 2025 AI For Humanity Labs Inc . All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'

const router = useRouter()

const navigateToVoiceActor = () => {
  // Navigate to voice actor dashboard
  router.push('/talent/dashboard')
}

const navigateToClient = () => {
  // Navigate to client dashboard
  router.push('/client/dashboard')
}
</script>
