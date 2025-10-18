<template>
  <div class="bg-card border-border rounded-lg border p-6">
    <h3 class="text-foreground mb-4 text-lg font-semibold">Project Pricing</h3>
    
    <div v-if="projectConfig" class="space-y-4">
      <!-- Project Type Info -->
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-foreground font-medium">{{ projectConfig.label }}</h4>
          <p class="text-muted-foreground text-sm">{{ projectConfig.description }}</p>
        </div>
        <div class="text-right">
          <span class="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
            {{ projectConfig.category }}
          </span>
        </div>
      </div>

      <!-- Pricing Details -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="bg-muted rounded-lg p-4">
          <h5 class="text-foreground mb-2 text-sm font-medium">Pricing Model</h5>
          <p class="text-muted-foreground text-sm">
            {{ formatPricingModel(projectConfig.pricing.model) }}
          </p>
          <p class="text-foreground mt-1 text-lg font-semibold">
            ${{ projectConfig.pricing.baseRate }}{{ getPricingSuffix(projectConfig.pricing.model) }}
          </p>
        </div>

        <div class="bg-muted rounded-lg p-4">
          <h5 class="text-foreground mb-2 text-sm font-medium">Timeline</h5>
          <p class="text-muted-foreground text-sm">{{ projectConfig.delivery.timeline }}</p>
          <p class="text-foreground mt-1 text-sm">
            {{ projectConfig.delivery.revisionRounds }} revisions included
          </p>
        </div>
      </div>

      <!-- Cost Calculator -->
      <div class="bg-muted rounded-lg p-4">
        <h5 class="text-foreground mb-3 text-sm font-medium">Cost Calculator</h5>
        <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label class="text-foreground mb-1 block text-xs font-medium">Quantity</label>
            <input
              v-model.number="quantity"
              type="number"
              min="1"
              class="border-border focus:ring-primary w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              :placeholder="getQuantityPlaceholder(projectConfig.pricing.model)"
            />
          </div>
          <div>
            <label class="text-foreground mb-1 block text-xs font-medium">Rush Order</label>
            <select
              v-model="isRush"
              class="border-border focus:ring-primary w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            >
              <option :value="false">Standard</option>
              <option :value="true">Rush (+{{ Math.round((projectConfig.pricing.rushFee || 1) * 100 - 100) }}%)</option>
            </select>
          </div>
          <div>
            <label class="text-foreground mb-1 block text-xs font-medium">Estimated Cost</label>
            <div class="text-foreground text-lg font-semibold">
              ${{ estimatedCost.toLocaleString() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Studio Requirements -->
      <div class="bg-muted rounded-lg p-4">
        <h5 class="text-foreground mb-3 text-sm font-medium">Studio Requirements</h5>
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <h6 class="text-foreground mb-1 text-xs font-medium">Environment</h6>
            <p class="text-muted-foreground text-sm capitalize">
              {{ projectConfig.studio.environment.replace('_', ' ') }}
            </p>
          </div>
          <div>
            <h6 class="text-foreground mb-1 text-xs font-medium">Direction</h6>
            <p class="text-muted-foreground text-sm capitalize">
              {{ projectConfig.studio.direction.replace('_', ' ') }}
            </p>
          </div>
        </div>
        <div class="mt-2">
          <h6 class="text-foreground mb-1 text-xs font-medium">Equipment</h6>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="equipment in projectConfig.studio.equipment"
              :key="equipment"
              class="bg-primary/10 text-primary px-2 py-1 rounded text-xs"
            >
              {{ equipment.replace('_', ' ') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-muted-foreground">Select a project type to see pricing details</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useJobType } from '@/composables/useJobType'

interface Props {
  projectType: string
}

const props = defineProps<Props>()

const { getConfig, calculateEstimatedCost } = useJobType()

const quantity = ref(1)
const isRush = ref(false)

// Get project configuration
const projectConfig = computed(() => {
  return props.projectType ? getConfig(props.projectType) : null
})

// Calculate estimated cost
const estimatedCost = computed(() => {
  if (!projectConfig.value) return 0
  return calculateEstimatedCost(props.projectType, quantity.value, isRush.value)
})

// Helper functions
const formatPricingModel = (model: string) => {
  return model.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getPricingSuffix = (model: string) => {
  const suffixes: Record<string, string> = {
    per_hour: '/hour',
    per_minute: '/min',
    per_character: '/character',
    per_scene: '/scene',
    per_project: '',
    per_word: '/word'
  }
  return suffixes[model] || ''
}

const getQuantityPlaceholder = (model: string) => {
  const placeholders: Record<string, string> = {
    per_hour: 'Hours',
    per_minute: 'Minutes',
    per_character: 'Characters',
    per_scene: 'Scenes',
    per_project: 'Projects',
    per_word: 'Words'
  }
  return placeholders[model] || 'Quantity'
}
</script>
