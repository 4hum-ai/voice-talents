<template>
  <div class="space-y-6">
    <Card class="p-6">
      <PayoutPreferencesStep :payout-data="localPreferences" @update="handlePreferencesUpdate" />
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Card from '@/components/atoms/Card.vue'
import PayoutPreferencesStep from '@/components/molecules/TalentProfile/PayoutPreferencesStep.vue'
import { usePayout } from '@/composables/usePayout'
import { useAuth } from '@/lib/auth'
import type { PayoutPreferences } from '@/types/models'

const { user } = useAuth()

const { preferences, fetchBalance, fetchPreferences } = usePayout()

const localPreferences = ref<PayoutPreferences>({
  frequency: 'manual',
  thresholdAmount: 500,
  currency: 'USD',
})

const handlePreferencesUpdate = (data: Partial<PayoutPreferences>) => {
  Object.assign(localPreferences.value, data)
}

// Load data on mount
onMounted(async () => {
  if (!user.value?.id) return

  await Promise.all([fetchBalance(user.value?.id || ''), fetchPreferences(user.value?.id || '')])

  // Sync local preferences with fetched preferences
  if (preferences.value) {
    localPreferences.value = { ...preferences.value }
  }
})

// Watch for preference changes from API
watch(preferences, (newPrefs) => {
  if (newPrefs) {
    localPreferences.value = { ...newPrefs }
  }
})
</script>
