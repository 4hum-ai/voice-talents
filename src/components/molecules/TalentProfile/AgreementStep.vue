<template>
  <div class="space-y-8">
    <div class="text-center">
      <div
        class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-500"
      >
        <Icon name="mdi:file-document-check" class="h-10 w-10 text-white" />
      </div>
      <h2 class="text-foreground mb-3 text-3xl font-bold">Legal Requirements</h2>
      <p class="text-muted-foreground mx-auto max-w-2xl text-lg">
        Before we proceed, please confirm you meet our requirements and agree to our terms.
      </p>
    </div>

    <!-- Age Verification -->
    <Card class="p-6">
      <div class="mb-6">
        <h3 class="text-foreground mb-2 text-xl font-semibold">Age Verification</h3>
        <p class="text-muted-foreground text-sm">
          You must be at least 18 years old to use VoiceTalents.AI as a voice talent. This platform
          facilitates professional contracts that may require adult status.
        </p>
      </div>
      <div class="space-y-4">
        <label class="flex items-start gap-3">
          <input
            v-model="localData.isAgeVerified"
            type="checkbox"
            required
            class="text-primary focus:ring-primary mt-1 h-5 w-5 rounded border-gray-300 focus:ring-2"
          />
          <span class="text-foreground text-sm">
            I confirm that I am at least 18 years old and of legal age to enter into professional
            contracts in my jurisdiction.
          </span>
        </label>
      </div>
    </Card>

    <!-- Terms Acceptance -->
    <Card class="p-6">
      <div class="mb-6">
        <h3 class="text-foreground mb-2 text-xl font-semibold">
          Terms of Service & Privacy Policy
        </h3>
        <p class="text-muted-foreground text-sm">
          Please review and accept our Terms of Service and Privacy Policy to continue.
        </p>
      </div>
      <div class="space-y-4">
        <div class="flex items-start gap-3">
          <input
            v-model="localData.acceptedTerms"
            type="checkbox"
            required
            class="text-primary focus:ring-primary mt-1 h-5 w-5 rounded border-gray-300 focus:ring-2"
          />
          <span class="text-foreground text-sm">
            I have read and agree to the
            <RouterLink
              to="/terms"
              target="_blank"
              class="text-primary hover:text-primary/80 underline"
            >
              Terms of Service
            </RouterLink>
            and
            <RouterLink
              to="/privacy"
              target="_blank"
              class="text-primary hover:text-primary/80 underline"
            >
              Privacy Policy
            </RouterLink>
            .
          </span>
        </div>
        <div class="flex items-start gap-3">
          <input
            v-model="localData.acceptedPlatformAgreement"
            type="checkbox"
            required
            class="text-primary focus:ring-primary mt-1 h-5 w-5 rounded border-gray-300 focus:ring-2"
          />
          <span class="text-foreground text-sm">
            I understand that VoiceTalents.AI acts as an intermediary platform connecting voice
            talents and clients. I am responsible for negotiating my own work agreements, rates, and
            terms with clients directly. VoiceTalents.AI is not a party to these agreements and is
            not liable for disputes between talents and clients.
          </span>
        </div>
      </div>
    </Card>

    <!-- Important Notice -->
    <Card class="border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
      <div class="flex gap-3">
        <Icon
          name="mdi:information"
          class="h-6 w-6 flex-shrink-0 text-yellow-600 dark:text-yellow-400"
        />
        <div>
          <h4 class="mb-2 font-semibold text-yellow-900 dark:text-yellow-200">Important Notice</h4>
          <p class="text-sm text-yellow-800 dark:text-yellow-300">
            As a voice talent, you will be entering into professional service agreements with
            clients. We recommend that you:
          </p>
          <ul class="mt-2 ml-4 list-disc text-sm text-yellow-800 dark:text-yellow-300">
            <li>Review all project details before accepting work</li>
            <li>Negotiate clear terms, deadlines, and payment schedules</li>
            <li>Consider using written service agreements for larger projects</li>
            <li>Keep records of all communications and deliverables</li>
          </ul>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { RouterLink } from 'vue-router'
import Card from '@/components/atoms/Card.vue'
import Icon from '@/components/atoms/Icon.vue'

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
