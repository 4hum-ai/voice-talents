<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <!-- Header -->
    <header class="border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center space-x-2">
            <Icon name="mdi:microphone" class="h-8 w-8 text-blue-600" />
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">VoiceAct</h1>
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
        <h2 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          Welcome to VoiceAct
        </h2>
        <p class="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          The premier platform connecting voice talent with clients. Choose your role to get started.
        </p>
      </div>

      <!-- Entry Points -->
      <div class="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- Voice Talent Entry -->
        <Card class="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div class="p-8 text-center">
            <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Icon name="mdi:microphone" class="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Voice Talent
            </h3>
            <p class="mb-6 text-gray-600 dark:text-gray-300">
              Showcase your voice acting skills, find casting opportunities, and grow your career with professional clients.
            </p>
            <div class="space-y-3">
              <div class="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Icon name="mdi:check-circle" class="h-4 w-4 text-green-500" />
                <span>Browse casting calls</span>
              </div>
              <div class="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Icon name="mdi:check-circle" class="h-4 w-4 text-green-500" />
                <span>Manage your portfolio</span>
              </div>
              <div class="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Icon name="mdi:check-circle" class="h-4 w-4 text-green-500" />
                <span>Track your projects</span>
              </div>
            </div>
            <Button 
              variant="primary" 
              size="lg" 
              class="mt-6 w-full"
              @click="navigateToVoiceActor"
            >
              Enter as Voice Talent
              <Icon name="mdi:arrow-right" class="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>

        <!-- Client Entry -->
        <Card class="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div class="p-8 text-center">
            <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Icon name="mdi:briefcase" class="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Client
            </h3>
            <p class="mb-6 text-gray-600 dark:text-gray-300">
              Find the perfect voice talent for your projects, manage campaigns, and collaborate with professional voice actors.
            </p>
            <div class="space-y-3">
              <div class="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Icon name="mdi:check-circle" class="h-4 w-4 text-green-500" />
                <span>Post job opportunities</span>
              </div>
              <div class="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Icon name="mdi:check-circle" class="h-4 w-4 text-green-500" />
                <span>Browse talent profiles</span>
              </div>
              <div class="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Icon name="mdi:check-circle" class="h-4 w-4 text-green-500" />
                <span>Manage your projects</span>
              </div>
            </div>
            <Button 
              variant="primary" 
              size="lg" 
              class="mt-6 w-full"
              @click="navigateToClient"
            >
              Enter as Client
              <Icon name="mdi:arrow-right" class="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      <!-- Features Section -->
      <div class="mt-20">
        <h3 class="text-center text-2xl font-bold text-gray-900 dark:text-white">
          Why Choose VoiceAct?
        </h3>
        <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div class="text-center">
            <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Icon name="mdi:shield-check" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Verified Talent</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              All voice actors are verified professionals with proven track records.
            </p>
          </div>
          <div class="text-center">
            <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Icon name="mdi:lightning-bolt" class="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Fast Matching</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Our smart algorithm matches you with the perfect voice for your project.
            </p>
          </div>
          <div class="text-center">
            <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <Icon name="mdi:handshake" class="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Secure Payments</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Protected transactions and escrow services for peace of mind.
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="mt-20 border-t border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="text-center text-sm text-gray-500 dark:text-gray-400">
          © 2024 VoiceAct. All rights reserved.
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
