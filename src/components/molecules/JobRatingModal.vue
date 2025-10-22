<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="$emit('close')"
  >
    <div
      class="bg-background border-border flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border shadow-lg"
    >
      <!-- Header -->
      <div class="border-border flex items-center justify-between border-b p-6">
        <div>
          <h2 class="text-foreground text-xl font-semibold">Rate & Review Talent</h2>
          <p class="text-muted-foreground mt-1">{{ jobTitle }}</p>
        </div>
        <Button variant="ghost" size="sm" icon="mdi:close" @click="$emit('close')" />
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <div class="space-y-6">
          <!-- Talent Info -->
          <div class="flex items-center space-x-4">
            <Avatar :src="talentAvatar" :alt="talentName" :seed="talentName" size="lg" />
            <div>
              <h3 class="text-foreground text-lg font-semibold">{{ talentName }}</h3>
              <p class="text-muted-foreground text-sm">{{ talentLocation }}</p>
            </div>
          </div>

          <!-- Rating Section -->
          <div class="space-y-4">
            <h4 class="text-foreground font-medium">Overall Rating</h4>
            <div class="flex items-center space-x-2">
              <div class="flex space-x-1">
                <button
                  v-for="star in 5"
                  :key="star"
                  @click="rating = star"
                  class="transition-colors hover:scale-110"
                >
                  <StarIcon
                    :class="[
                      'h-8 w-8',
                      star <= rating
                        ? 'fill-current text-yellow-500'
                        : 'text-gray-300 hover:text-yellow-400',
                    ]"
                  />
                </button>
              </div>
              <span class="text-muted-foreground text-sm">{{ rating }}/5</span>
            </div>
          </div>

          <!-- Detailed Ratings -->
          <div class="space-y-4">
            <h4 class="text-foreground font-medium">Detailed Ratings</h4>
            <div class="space-y-4">
              <div
                v-for="criteria in ratingCriteria"
                :key="criteria.key"
                class="flex items-center justify-between"
              >
                <div>
                  <div class="text-foreground font-medium">{{ criteria.label }}</div>
                  <div class="text-muted-foreground text-sm">{{ criteria.description }}</div>
                </div>
                <div class="flex space-x-1">
                  <button
                    v-for="star in 5"
                    :key="star"
                    @click="detailedRatings[criteria.key] = star"
                    class="transition-colors hover:scale-110"
                  >
                    <StarIcon
                      :class="[
                        'h-6 w-6',
                        star <= (detailedRatings[criteria.key] || 0)
                          ? 'fill-current text-yellow-500'
                          : 'text-gray-300 hover:text-yellow-400',
                      ]"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Feedback Section -->
          <div class="space-y-4">
            <h4 class="text-foreground font-medium">Written Feedback</h4>
            <Textarea
              v-model="feedback"
              placeholder="Share your experience working with this talent. What did they do well? Any areas for improvement?"
              :rows="4"
              class="w-full"
            />
          </div>

          <!-- Recommendation -->
          <div class="space-y-4">
            <h4 class="text-foreground font-medium">Would you recommend this talent?</h4>
            <div class="flex space-x-4">
              <label class="flex cursor-pointer items-center space-x-2">
                <input
                  v-model="recommendation"
                  type="radio"
                  value="yes"
                  class="text-primary focus:ring-primary"
                />
                <span class="text-foreground">Yes, I would recommend</span>
              </label>
              <label class="flex cursor-pointer items-center space-x-2">
                <input
                  v-model="recommendation"
                  type="radio"
                  value="no"
                  class="text-primary focus:ring-primary"
                />
                <span class="text-foreground">No, I would not recommend</span>
              </label>
            </div>
          </div>

          <!-- Project Summary -->
          <div class="space-y-4">
            <h4 class="text-foreground font-medium">Project Summary</h4>
            <div class="bg-muted/50 space-y-2 rounded-lg p-4">
              <div class="flex justify-between text-sm">
                <span class="text-muted-foreground">Project Type:</span>
                <span class="text-foreground">{{ voiceType }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-muted-foreground">Budget:</span>
                <span class="text-foreground">{{ formatBudget(budget) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-muted-foreground">Timeline:</span>
                <span class="text-foreground">{{ timeline }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-muted-foreground">Completed:</span>
                <span class="text-foreground">{{ formatDate(completedDate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="border-border flex items-center justify-between border-t p-6">
        <div class="text-muted-foreground text-sm">
          This review will be visible to the talent and may be used for future recommendations.
        </div>
        <div class="flex space-x-3">
          <Button variant="outline" @click="$emit('close')"> Cancel </Button>
          <Button
            variant="primary"
            :disabled="rating === 0 || !recommendation"
            icon="mdi:star"
            @click="submitRating"
            >Submit Review</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '@/components/atoms/Button.vue'
import Avatar from '@/components/atoms/Avatar.vue'
import Textarea from '@/components/atoms/Textarea.vue'
import { useToast } from '@/composables/useToast'
import { mockVoiceActors } from '@/data/mock-voice-actor-data'
// Close icon removed; using Button icon prop instead
// Star icon kept for rating stars in content
import StarIcon from '~icons/mdi/star'
import type { JobRatingModalProps } from '@/types/job-rating'

type Props = JobRatingModalProps

interface Emits {
  (e: 'close'): void
  (
    e: 'submit',
    rating: {
      overall: number
      communication: number
      quality: number
      timeliness: number
      comment: string
    },
  ): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { addToast: showToast } = useToast()

// State
const rating = ref(0)
const detailedRatings = ref<Record<string, number>>({})
const feedback = ref('')
const recommendation = ref('')

// Rating criteria
const ratingCriteria = [
  {
    key: 'quality',
    label: 'Audio Quality',
    description: 'Professional recording quality and clarity',
  },
  {
    key: 'delivery',
    label: 'Delivery & Timing',
    description: 'Met deadlines and delivery expectations',
  },
  {
    key: 'communication',
    label: 'Communication',
    description: 'Clear, responsive, and professional communication',
  },
  {
    key: 'creativity',
    label: 'Creativity & Interpretation',
    description: 'Brought creativity and understood project vision',
  },
  {
    key: 'collaboration',
    label: 'Collaboration',
    description: 'Easy to work with and open to feedback',
  },
]

// Computed
const talentAvatar = computed(() => {
  const talent = mockVoiceActors.find((va) => va.id === props.talentId)
  return talent?.avatarUrl || ''
})

const talentLocation = computed(() => {
  const talent = mockVoiceActors.find((va) => va.id === props.talentId)
  return talent?.location || 'Location not specified'
})

// Methods
const submitRating = () => {
  const ratingData = {
    overall: rating.value,
    communication: detailedRatings.value.communication || 0,
    quality: detailedRatings.value.quality || 0,
    timeliness: detailedRatings.value.timeliness || 0,
    comment: feedback.value,
  }

  emit('submit', ratingData)

  showToast({
    type: 'success',
    title: 'Review Submitted',
    message: 'Thank you for your feedback! Your review has been submitted.',
  })

  // Reset form
  rating.value = 0
  detailedRatings.value = {}
  feedback.value = ''
  recommendation.value = ''
}

// Helper functions
const formatBudget = (budget: { max: number; currency: string }) => {
  if (!budget || !budget.max) return 'Not specified'
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    VND: '₫',
  }
  const symbol = symbols[budget.currency] || '$'
  return `${symbol}${budget.max.toLocaleString()}`
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}
</script>
