<template>
  <div class="from-background to-muted/50 flex min-h-screen flex-col bg-gradient-to-br">
    <CookieConsentBanner />
    <!-- Minimal Header -->
    <header class="border-border bg-background/80 border-b backdrop-blur-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center space-x-2">
            <Icon name="mdi:microphone" class="text-primary h-8 w-8" />
            <h1 class="text-foreground text-xl font-bold">VoiceTalents.AI</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>

    <!-- Centered Entry Point -->
    <main class="flex flex-1 items-center justify-center px-4 py-12">
      <div class="w-full max-w-4xl">
        <div class="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          <!-- Voice Talent Entry -->
          <Card :interactive="true" padding="xl" class="text-center" @click="navigateToVoiceTalent">
            <div
              class="bg-primary/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
            >
              <Icon name="mdi:microphone" class="text-primary h-8 w-8" />
            </div>
            <h3 class="text-foreground mb-3 text-xl font-bold">Voice Talent</h3>
            <p class="text-muted-foreground mb-6 text-sm">
              Showcase your skills and find casting opportunities
            </p>
            <Button variant="primary" size="lg" class="w-full" @click.stop="navigateToVoiceTalent">
              Enter
              <Icon name="mdi:arrow-right" class="ml-2 h-5 w-5" />
            </Button>
          </Card>

          <!-- Client Entry -->
          <Card :interactive="true" padding="xl" class="text-center" @click="navigateToClient">
            <div
              class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10"
            >
              <Icon name="mdi:briefcase" class="h-8 w-8 text-green-600" />
            </div>
            <h3 class="text-foreground mb-3 text-xl font-bold">Client</h3>
            <p class="text-muted-foreground mb-6 text-sm">
              Find the perfect voice talent for your projects
            </p>
            <Button variant="primary" size="lg" class="w-full" @click.stop="navigateToClient">
              Enter
              <Icon name="mdi:arrow-right" class="ml-2 h-5 w-5" />
            </Button>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import CookieConsentBanner from '@/components/molecules/CookieConsentBanner.vue'

const router = useRouter()

const navigateToVoiceTalent = () => {
  // Navigate to voice talent dashboard
  router.push('/talent/dashboard')
}

const navigateToClient = () => {
  // Navigate to client dashboard
  router.push('/client/dashboard')
}
</script>
