<template>
  <span
    v-if="displayKind === 'text'"
    :class="['text-sm text-gray-900 dark:text-gray-100', referenceClasses]"
    @click="handleReferenceClick"
    >{{ textValue }}</span
  >
  <span v-else-if="displayKind === 'boolean'" class="text-sm text-gray-900 dark:text-gray-100">{{
    value ? 'Yes' : 'No'
  }}</span>
  <span v-else-if="displayKind === 'date'" class="text-sm text-gray-900 dark:text-gray-100">{{
    dateValue
  }}</span>
  <span v-else-if="displayKind === 'number'" class="text-sm text-gray-900 dark:text-gray-100">{{
    numberValue
  }}</span>
  <span v-else-if="displayKind === 'currency'" class="text-sm text-gray-900 dark:text-gray-100">{{
    currencyValue
  }}</span>
  <span v-else-if="displayKind === 'rating'" class="text-sm text-gray-900 dark:text-gray-100">{{
    ratingValue
  }}</span>
  <span
    v-else-if="displayKind === 'badge'"
    :class="['inline-flex items-center rounded px-2 py-0.5 text-xs font-medium', badgeClass]"
    >{{ textValue }}</span
  >
  <span v-else-if="displayKind === 'status'" class="inline-flex items-center gap-2">
    <span :class="['h-2 w-2 rounded-full', statusDotClass]" />
    <span :class="['rounded px-2 py-0.5 text-xs font-medium', statusBadgeClass]">{{
      textValue
    }}</span>
  </span>
  <span v-else-if="displayKind === 'color'" class="inline-flex items-center gap-2">
    <span
      class="inline-block h-4 w-4 rounded border border-gray-300 dark:border-gray-700"
      :style="{ backgroundColor: String(value || '#ffffff') }"
    />
    <span class="text-sm text-gray-900 dark:text-gray-100">{{ textValue }}</span>
  </span>
  <span v-else-if="displayKind === 'url'" class="inline-flex items-center gap-2 text-sm">
    <a
      :href="normalizedHref"
      target="_blank"
      rel="noopener noreferrer"
      class="text-primary-600 dark:text-primary-400 break-all hover:underline"
      >{{ String(value) }}</a
    >
    <button
      type="button"
      class="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
      aria-label="Copy URL"
      @click="copy(String(value))"
    >
      ⧉
    </button>
  </span>
  <span v-else-if="displayKind === 'email'" class="inline-flex items-center gap-2 text-sm">
    <a
      :href="`mailto:${String(value)}`"
      class="text-primary-600 dark:text-primary-400 break-words hover:underline"
      >{{ String(value) }}</a
    >
    <button
      type="button"
      class="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
      aria-label="Copy email"
      @click="copy(String(value))"
    >
      ⧉
    </button>
  </span>
  <span v-else-if="displayKind === 'phone'" class="inline-flex items-center gap-2 text-sm">
    <a
      :href="`tel:${String(value)}`"
      class="text-primary-600 dark:text-primary-400 break-words hover:underline"
      >{{ String(value) }}</a
    >
    <button
      type="button"
      class="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
      aria-label="Copy phone"
      @click="copy(String(value))"
    >
      ⧉
    </button>
  </span>
  <span v-else-if="displayKind === 'array'" class="text-sm text-gray-900 dark:text-gray-100">
    <pre
      v-if="Array.isArray(value) && value.length > 0 && typeof value[0] === 'object'"
      class="max-h-40 overflow-y-auto rounded border bg-gray-50 p-2 text-xs whitespace-pre-wrap dark:bg-gray-800"
      >{{ formattedArrayValue }}</pre
    >
    <span v-else>{{ Array.isArray(value) ? value.join(', ') : textValue }}</span>
  </span>
  <span v-else-if="displayKind === 'object'" class="text-sm text-gray-900 dark:text-gray-100">
    <pre
      class="max-h-40 overflow-y-auto rounded border bg-gray-50 p-2 text-xs whitespace-pre-wrap dark:bg-gray-800"
      >{{ objectValue }}</pre
    >
  </span>
  <span v-else-if="displayKind === 'image'" class="inline-flex items-center">
    <Image
      :src="String(value)"
      alt="Image"
      :width="40"
      :height="40"
      preset="thumbnail"
      :class="imageClasses"
    />
  </span>
  <span v-else-if="displayKind === 'video'" class="inline-flex w-full items-center">
    <VideoPlayer :url="String(value)" :title="String(value)" mode="inline" />
  </span>
  <span v-else-if="displayKind === 'audio'" class="inline-flex w-full items-center">
    <AudioPlayer
      :url="String(value)"
      :title="String(value)"
      mode="inline"
      :autoplay="false"
      :loop="false"
    />
  </span>
  <span v-else-if="displayKind === 'country'" class="inline-flex items-center gap-2">
    <span v-if="country.code" class="shrink-0">
      <picture>
        <source :srcset="`https://flagcdn.com/${country.code}.svg`" type="image/svg+xml" />
        <Image
          :src="`https://flagcdn.com/24x18/${country.code}.png`"
          alt=""
          :width="24"
          :height="18"
          class="rounded-sm"
        />
      </picture>
    </span>
    <span class="text-sm text-gray-900 dark:text-gray-100">{{ country.name || textValue }}</span>
  </span>

  <!-- NEW: Language display -->
  <span v-else-if="displayKind === 'language'" class="inline-flex items-center">
    <LanguageDisplay :value="String(value)" :show-code="true" size="sm" />
  </span>

  <!-- NEW: Percentage display -->
  <span v-else-if="displayKind === 'percentage'" class="text-sm text-gray-900 dark:text-gray-100">
    {{ percentageValue }}
  </span>

  <!-- NEW: Progress display -->
  <span v-else-if="displayKind === 'progress'" class="inline-flex items-center gap-2">
    <ProgressIndicator :value="Number(value)" size="sm" :show-label="true" />
  </span>

  <!-- NEW: Duration display -->
  <span v-else-if="displayKind === 'duration'" class="text-sm text-gray-900 dark:text-gray-100">
    {{ durationValue }}
  </span>

  <!-- NEW: File size display -->
  <span v-else-if="displayKind === 'fileSize'" class="text-sm text-gray-900 dark:text-gray-100">
    {{ fileSizeValue }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Image from '@/components/molecules/Image.vue'
import LanguageDisplay from './LanguageDisplay.vue'
import ProgressIndicator from '@/components/molecules/ProgressIndicator.vue'
import VideoPlayer from '@/components/organisms/VideoPlayer.vue'
import AudioPlayer from '@/components/organisms/AudioPlayer.vue'
import { getCountryByAny } from '@/utils/countries'

interface Props {
  value: unknown
  type?:
    | 'text'
    | 'number'
    | 'date'
    | 'boolean'
    | 'image'
    | 'video'
    | 'audio'
    | 'url'
    | 'array'
    | 'object'
    | 'color'
    | 'ref'
  formatter?:
    | 'rating'
    | 'status'
    | 'date'
    | 'currency'
    | 'badge'
    | 'country'
    | 'number'
    | 'language'
    | 'percentage'
    | 'progress'
    | 'duration'
    | 'fileSize'
    | 'audio'
    | 'video'
  currencyCode?: string
  fieldKey?: string
  /** The resource type this field references (only used when type is 'ref') */
  refTo?: string
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  'reference-click': [referenceType: string, referenceId: string]
}>()

const displayKind = computed(() => {
  if (props.formatter) {
    if (props.formatter === 'number') return 'number'
    return props.formatter
  }

  // Handle ref type - it displays as text but with reference behavior
  if (props.type === 'ref') {
    return 'text'
  }

  // If type is explicitly set, use it (except for 'url' which needs detection)
  if (props.type && props.type !== 'url') {
    return props.type
  }

  // Heuristics for email/phone based on key/name and value shape
  const key = (props.fieldKey || '').toLowerCase()
  const val = String(props.value || '')
  const looksEmail = /@/.test(val) || key.includes('email')
  const looksPhone = key.includes('phone') || /^\+?[0-9()\-\s]{7,}$/.test(val)
  if (looksEmail) return 'email'
  if (looksPhone) return 'phone'

  // Media type detection based on file extensions and URLs
  const v = String(props.value || '').toLowerCase()

  // Video detection
  if (
    v.endsWith('.mp4') ||
    v.endsWith('.webm') ||
    v.endsWith('.mov') ||
    v.endsWith('.avi') ||
    v.endsWith('.mkv') ||
    v.endsWith('.m4v') ||
    v.endsWith('.3gp') ||
    v.endsWith('.flv') ||
    v.includes('video=') ||
    v.includes('.m3u8') ||
    v.includes('youtube.com') ||
    v.includes('youtu.be') ||
    v.includes('vimeo.com')
  )
    return 'video'

  // Audio detection
  if (
    v.endsWith('.mp3') ||
    v.endsWith('.wav') ||
    v.endsWith('.aac') ||
    v.endsWith('.flac') ||
    v.endsWith('.ogg') ||
    v.endsWith('.m4a') ||
    v.endsWith('.wma') ||
    v.includes('audio=') ||
    v.includes('soundcloud.com') ||
    v.includes('spotify.com')
  )
    return 'audio'

  // Image detection
  if (
    v.endsWith('.jpg') ||
    v.endsWith('.jpeg') ||
    v.endsWith('.png') ||
    v.endsWith('.webp') ||
    v.endsWith('.gif') ||
    v.endsWith('.svg') ||
    v.endsWith('.bmp') ||
    v.endsWith('.tiff') ||
    v.endsWith('.ico') ||
    v.includes('image=') ||
    v.includes('imgur.com') ||
    v.includes('unsplash.com') ||
    v.includes('pixabay.com')
  )
    return 'image'

  // If type is 'url' but no media detected, show as URL
  if (props.type === 'url') {
    return 'url'
  }

  return 'text'
})

// Computed property for image classes
const imageClasses = computed(() => {
  const baseClasses = 'h-10 w-10 rounded bg-gray-100 object-cover dark:bg-gray-800'
  return baseClasses
})

const textValue = computed(() => {
  const v = props.value
  if (v === null || v === undefined || v === '') return '-'
  return String(v)
})

type FirestoreTimestampLike = {
  _seconds?: number
  _nanoseconds?: number
  seconds?: number
  nanoseconds?: number
}

const toDate = (v: unknown): Date | null => {
  if (v instanceof Date) return v
  if (typeof v === 'string' || typeof v === 'number') {
    const d = new Date(v)
    return isNaN(d.getTime()) ? null : d
  }
  if (v && typeof v === 'object') {
    const ts = v as FirestoreTimestampLike
    const seconds = ts._seconds ?? ts.seconds
    const nanos = ts._nanoseconds ?? ts.nanoseconds ?? 0
    if (typeof seconds === 'number') {
      const ms = seconds * 1000 + Math.floor(nanos / 1e6)
      const d = new Date(ms)
      return isNaN(d.getTime()) ? null : d
    }
  }
  return null
}

const dateValue = computed(() => {
  const d = toDate(props.value)
  if (!d) return '-'
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
})

const numberValue = computed(() => {
  const raw = props.value
  const n = typeof raw === 'string' ? parseFloat(raw) : typeof raw === 'number' ? raw : Number.NaN
  if (!Number.isFinite(n)) return '-'
  return new Intl.NumberFormat('en-US').format(n)
})

const currencyValue = computed(() => {
  const raw = props.value
  const n = typeof raw === 'string' ? parseFloat(raw) : typeof raw === 'number' ? raw : Number.NaN
  if (!Number.isFinite(n)) return '-'
  const code = props.currencyCode || 'USD'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
})

const ratingValue = computed(() => {
  const raw = props.value
  const n = typeof raw === 'string' ? parseFloat(raw) : typeof raw === 'number' ? raw : Number.NaN
  if (!Number.isFinite(n)) return '-'
  return `${n.toFixed(1)} / 5`
})

const badgeClass = computed(() => {
  const v = String(props.value || '').toLowerCase()
  if (['active', 'success', 'paid', 'publisher', 'large', 'enterprise'].includes(v))
    return 'bg-green-100 text-green-800'
  if (['pending', 'warning', 'medium'].includes(v)) return 'bg-yellow-100 text-yellow-800'
  if (['inactive', 'secondary', 'small', 'startup'].includes(v)) return 'bg-gray-100 text-gray-800'
  if (['suspended', 'error', 'failed'].includes(v)) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
})

const statusDotClass = computed(() => {
  const v = String(props.value || '').toLowerCase()
  if (['active', 'success', 'paid', 'online'].includes(v)) return 'bg-green-500'
  if (['pending', 'warning'].includes(v)) return 'bg-yellow-500'
  if (['inactive', 'offline'].includes(v)) return 'bg-gray-400'
  if (['suspended', 'error', 'failed'].includes(v)) return 'bg-red-500'
  return 'bg-gray-400'
})

const statusBadgeClass = computed(() => {
  const v = String(props.value || '').toLowerCase()
  if (['active', 'success', 'paid', 'online'].includes(v))
    return 'bg-green-50 text-green-700 border border-green-200'
  if (['pending', 'warning'].includes(v))
    return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
  if (['inactive', 'offline'].includes(v)) return 'bg-gray-50 text-gray-700 border border-gray-200'
  if (['suspended', 'error', 'failed'].includes(v))
    return 'bg-red-50 text-red-700 border border-red-200'
  return 'bg-gray-50 text-gray-700 border border-gray-200'
})

const country = computed(() => {
  const raw = props.value
  if (!raw) return { code: '', name: '' }
  const val = String(raw).trim()
  const match = getCountryByAny(val)
  if (match) return { code: match.code.toLowerCase(), name: match.name }
  // Fallback: if val looks like 2-letter code
  if (val.length === 2) return { code: val.toLowerCase(), name: val }
  return { code: '', name: val }
})

const objectValue = computed(() => {
  try {
    return JSON.stringify(props.value, null, 2)
  } catch {
    return String(props.value)
  }
})

const formattedArrayValue = computed(() => {
  if (!Array.isArray(props.value)) return ''
  try {
    return JSON.stringify(props.value, null, 2)
  } catch {
    return String(props.value)
  }
})

// NEW: Percentage value computation
const percentageValue = computed(() => {
  const raw = props.value
  const n = typeof raw === 'string' ? parseFloat(raw) : typeof raw === 'number' ? raw : Number.NaN
  if (!Number.isFinite(n)) return '-'
  return `${n.toFixed(1)}%`
})

// NEW: Duration value computation
const durationValue = computed(() => {
  const raw = props.value
  const n = typeof raw === 'string' ? parseFloat(raw) : typeof raw === 'number' ? raw : Number.NaN
  if (!Number.isFinite(n)) return '-'

  const hours = Math.floor(n / 3600)
  const minutes = Math.floor((n % 3600) / 60)
  const seconds = Math.floor(n % 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
})

// NEW: File size value computation
const fileSizeValue = computed(() => {
  const raw = props.value
  const n = typeof raw === 'string' ? parseFloat(raw) : typeof raw === 'number' ? raw : Number.NaN
  if (!Number.isFinite(n)) return '-'

  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  if (n === 0) return '0 B'

  const i = Math.floor(Math.log(n) / Math.log(1024))
  const size = n / Math.pow(1024, i)

  return `${size.toFixed(1)} ${sizes[i]}`
})

const normalizedHref = computed(() => {
  const raw = String(props.value || '')
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw
  return `https://${raw}`
})

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    void 0
  }
}

// Handle reference clicks
const handleReferenceClick = () => {
  if (props.type === 'ref' && props.refTo) {
    const referenceId = String(props.value || '')
    if (referenceId) {
      emit('reference-click', props.refTo, referenceId)
    }
  }
}

// Computed class for clickable references
const referenceClasses = computed(() => {
  if (props.type === 'ref' && props.refTo) {
    return 'cursor-pointer text-primary-600 hover:text-primary-800 hover:underline dark:text-primary-400 dark:hover:text-primary-200'
  }
  return ''
})
</script>
