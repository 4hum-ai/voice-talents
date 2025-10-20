<template>
  <div class="space-y-8">
    <div class="mb-8 text-center">
      <div
        class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600"
      >
        <Icon name="mdi:share-variant" class="h-8 w-8 text-white" />
      </div>
      <h2 class="text-foreground mb-2 text-2xl font-bold">Social Links</h2>
      <p class="text-muted-foreground">Connect your social media profiles</p>
    </div>

    <div class="bg-card border-border rounded-lg border p-8">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label class="text-foreground mb-2 block text-sm font-medium"> LinkedIn </label>
          <input
            :value="modelValue.linkedin"
            @input="updateField('linkedin', ($event.target as HTMLInputElement).value)"
            type="url"
            class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
            placeholder="https://linkedin.com/company/yourcompany"
          />
        </div>
        <div>
          <label class="text-foreground mb-2 block text-sm font-medium"> Facebook Page </label>
          <input
            :value="modelValue.facebook"
            @input="updateField('facebook', ($event.target as HTMLInputElement).value)"
            type="url"
            class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
            placeholder="https://facebook.com/yourcompany"
          />
        </div>
        <div>
          <label class="text-foreground mb-2 block text-sm font-medium"> Twitter </label>
          <input
            :value="modelValue.twitter"
            @input="updateField('twitter', ($event.target as HTMLInputElement).value)"
            type="url"
            class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
            placeholder="https://twitter.com/yourcompany"
          />
        </div>
        <div v-if="showWebsite">
          <label class="text-foreground mb-2 block text-sm font-medium"> Website </label>
          <input
            :value="modelValue.website"
            @input="updateField('website', ($event.target as HTMLInputElement).value)"
            type="url"
            class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
            placeholder="https://yourcompany.com"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/atoms/Icon.vue'

interface SocialLinksData {
  website: string
  linkedin: string
  facebook: string
  twitter: string
}

interface Props {
  modelValue: SocialLinksData
  showWebsite?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: SocialLinksData): void
  (e: 'validation-change', isValid: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  showWebsite: false,
})

const emit = defineEmits<Emits>()

// Computed
const isValid = computed(() => {
  // Social links are always valid since they're all optional
  return true
})

// Methods
const updateField = (field: keyof SocialLinksData, value: string) => {
  const updated = { ...props.modelValue, [field]: value }
  emit('update:modelValue', updated)
  emit('validation-change', isValid.value)
}

// Emit initial validation state
emit('validation-change', isValid.value)
</script>
