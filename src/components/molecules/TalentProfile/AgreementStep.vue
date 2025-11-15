<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-foreground mb-2 text-2xl font-bold">Final Step: Accept Terms</h2>
      <p class="text-muted-foreground mx-auto max-w-2xl text-base">
        Please review and confirm the following to complete your profile setup.
      </p>
    </div>

    <!-- Combined Agreement Card -->
    <Card class="p-6">
      <div class="space-y-6">
        <!-- Age Verification -->
        <div>
          <h3 class="text-foreground mb-3 text-lg font-semibold">Age Verification</h3>
          <label class="flex cursor-pointer items-start gap-3">
            <input
              v-model="localData.isAgeVerified"
              type="checkbox"
              required
              class="text-primary focus:ring-primary mt-0.5 h-5 max-h-[1.25rem] min-h-[1.25rem] w-5 max-w-[1.25rem] min-w-[1.25rem] shrink-0 cursor-pointer rounded border-gray-300 bg-white focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800"
            />
            <span class="text-foreground text-sm leading-relaxed">
              I confirm that I am either: (1) at least 18 years old and of legal age to enter into
              professional contracts, OR (2) I am a parent or legal guardian creating this account
              for a minor child voice talent and I will manage all account activities and accept
              these terms on their behalf.
            </span>
          </label>
        </div>

        <div class="border-border border-t"></div>

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
                <button
                  type="button"
                  class="text-primary hover:text-primary/80 underline"
                  @click="openContentViewer('terms-of-service-talents')"
                >
                  Terms of Service
                </button>
                and
                <button
                  type="button"
                  class="text-primary hover:text-primary/80 underline"
                  @click="openContentViewer('privacy-policy')"
                >
                  Privacy Policy
                </button>
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
          By completing this step, you're ready to start using VoiceTalents.AI. Remember to review
          project details carefully before accepting work.
        </p>
      </div>
    </div>

    <!-- Content Viewer -->
    <ContentViewer
      v-if="currentContentSlug"
      :open="contentViewerOpen"
      :slug="currentContentSlug"
      @update:open="contentViewerOpen = $event"
      @close="contentViewerOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import Card from '@/components/atoms/Card.vue'
import Icon from '@/components/atoms/Icon.vue'
import { ContentViewer } from '@/lib/content'

interface AgreementData {
  isAgeVerified: boolean
  acceptedTerms: boolean
  acceptedPlatformAgreement: boolean
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
  isAgeVerified: props.modelValue?.isAgeVerified || false,
  acceptedTerms: props.modelValue?.acceptedTerms || false,
  acceptedPlatformAgreement: props.modelValue?.acceptedPlatformAgreement || false,
})

// Content viewer state
const contentViewerOpen = ref(false)
const currentContentSlug = ref('')

const openContentViewer = (slug: string) => {
  currentContentSlug.value = slug
  contentViewerOpen.value = true
}

// Watch for changes and emit validation status
watch(
  localData,
  (newData) => {
    emit('update:modelValue', { ...newData })
    const isValid =
      newData.isAgeVerified && newData.acceptedTerms && newData.acceptedPlatformAgreement
    emit('validation-change', isValid)
  },
  { deep: true },
)
</script>
