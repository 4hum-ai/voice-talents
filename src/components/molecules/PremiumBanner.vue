<template>
  <div class="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 rounded-lg border border-primary/20 p-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
          <Icon name="mdi:star" class="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 class="font-semibold text-foreground">Boost Your Job Posting</h3>
          <p class="text-sm text-muted-foreground">
            Get more applications with premium features
          </p>
        </div>
      </div>
      
      <div class="flex items-center space-x-3">
        <div class="text-right">
          <div class="text-sm text-muted-foreground">Starting at</div>
          <div class="text-lg font-bold text-primary">$9</div>
        </div>
        <Button variant="primary" size="sm" @click="$emit('upgrade')">
          <Icon name="mdi:arrow-right" class="h-4 w-4 mr-1" />
          Upgrade
        </Button>
      </div>
    </div>
    
    <div class="mt-4 grid grid-cols-2 gap-4">
      <div class="flex items-center space-x-2">
        <Icon name="mdi:robot" class="h-4 w-4 text-primary" />
        <span class="text-xs text-muted-foreground">Express Matching</span>
      </div>
      <div class="flex items-center space-x-2">
        <Icon name="mdi:account-search" class="h-4 w-4 text-primary" />
        <span class="text-xs text-muted-foreground">Talent Outreach</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'

defineEmits<{
  upgrade: []
}>()
</script>
