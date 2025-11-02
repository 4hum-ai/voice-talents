<template>
  <div class="space-y-6">
    <div class="text-center">
      <div
        class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-500"
      >
        <Icon name="mdi:file-document-check" class="h-8 w-8 text-white" />
      </div>
      <h2 class="text-foreground mb-2 text-2xl font-bold">Final Step: Accept Terms</h2>
      <p class="text-muted-foreground mx-auto max-w-2xl text-base">
        Please review and confirm the following to complete your account setup.
      </p>
    </div>

    <!-- Agreement Card -->
    <Card class="p-6">
      <div class="space-y-6">
        <!-- Terms Acceptance -->
        <div>
          <h3 class="text-foreground mb-3 text-lg font-semibold">Terms & Conditions</h3>
          <div class="space-y-3">
            <label class="flex cursor-pointer items-start gap-3">
              <input
                v-model="localData.acceptedTerms"
                type="checkbox"
                required
                class="text-primary focus:ring-primary mt-0.5 h-5 max-h-[1.25rem] min-h-[1.25rem] w-5 max-w-[1.25rem] min-w-[1.25rem] shrink-0 cursor-pointer rounded border-gray-300 bg-white focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800"
              />
              <span class="text-foreground text-sm leading-relaxed">
                I have read and agree to the
                <RouterLink
                  to="/content/terms-of-service-clients"
                  target="_blank"
                  class="text-primary hover:text-primary/80 underline"
                >
                  Terms of Service
                </RouterLink>
                and
                <RouterLink
                  to="/content/privacy-policy"
                  target="_blank"
                  class="text-primary hover:text-primary/80 underline"
                >
                  Privacy Policy
                </RouterLink>
                .
              </span>
            </label>
          </div>
        </div>
      </div>
    </Card>

    <!-- Simplified Notice -->
    <div class="border-border bg-muted/30 rounded-lg border p-4">
      <div class="flex gap-3">
        <Icon name="mdi:information" class="text-primary h-5 w-5 flex-shrink-0" />
        <p class="text-muted-foreground text-sm">
          By completing this step, you're ready to start using VoiceTalents.AI. You can begin
          posting jobs and collaborating with voice talents right away.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { RouterLink } from 'vue-router'
import Card from '@/components/atoms/Card.vue'
import Icon from '@/components/atoms/Icon.vue'

interface AgreementData {
  acceptedTerms: boolean
}

interface Props {
  modelValue?: AgreementData
}

interface Emits {
  (e: 'update:modelValue', value: AgreementData): void
  (e: 'validation-change', isValid: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localData = reactive<AgreementData>({
  acceptedTerms: props.modelValue?.acceptedTerms || false,
})

// Watch for changes and emit validation status
watch(
  localData,
  (newData) => {
    emit('update:modelValue', { ...newData })
    const isValid = newData.acceptedTerms
    emit('validation-change', isValid)
  },
  { deep: true },
)
</script>
