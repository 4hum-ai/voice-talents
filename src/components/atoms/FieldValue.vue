<template>
  <span v-if="displayKind === 'text'" class="text-sm text-gray-900 dark:text-gray-100">{{
    textValue
  }}</span>
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
  <span v-else-if="displayKind === 'array'" class="text-sm text-gray-900 dark:text-gray-100">{{
    Array.isArray(value) ? value.join(', ') : textValue
  }}</span>
  <span v-else-if="displayKind === 'object'" class="text-sm text-gray-900 dark:text-gray-100">{{
    objectValue
  }}</span>
  <span v-else-if="displayKind === 'image'" class="inline-flex items-center">
    <img
      :src="String(value)"
      alt=""
      class="h-10 w-10 rounded bg-gray-100 object-cover dark:bg-gray-800"
    />
  </span>
  <span v-else-if="displayKind === 'video'" class="inline-flex items-center">
    <video
      :src="String(value)"
      class="h-16 w-24 rounded bg-gray-100 object-cover dark:bg-gray-800"
      controls
    />
  </span>
  <span v-else-if="displayKind === 'country'" class="inline-flex items-center gap-2">
    <span v-if="country.code" class="shrink-0">
      <picture>
        <source :srcset="`https://flagcdn.com/${country.code}.svg`" type="image/svg+xml" />
        <img
          :src="`https://flagcdn.com/24x18/${country.code}.png`"
          alt=""
          width="24"
          height="18"
          class="rounded-sm"
        />
      </picture>
    </span>
    <span class="text-sm text-gray-900 dark:text-gray-100">{{ country.name || textValue }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getCountryByAny } from '@/utils/countries'

interface Props {
  value: any
  type?:
    | 'text'
    | 'number'
    | 'date'
    | 'boolean'
    | 'image'
    | 'video'
    | 'url'
    | 'array'
    | 'object'
    | 'color'
  formatter?: 'rating' | 'status' | 'date' | 'currency' | 'badge' | 'country' | 'number'
  currencyCode?: string
  fieldKey?: string
}

const props = withDefaults(defineProps<Props>(), {})

const displayKind = computed(() => {
  if (props.formatter) {
    if (props.formatter === 'number') return 'number'
    return props.formatter
  }
  // Heuristics for email/phone based on key/name and value shape
  const key = (props.fieldKey || '').toLowerCase()
  const val = String(props.value || '')
  const looksEmail = /@/.test(val) || key.includes('email')
  const looksPhone = key.includes('phone') || /^\+?[0-9()\-\s]{7,}$/.test(val)
  if (looksEmail) return 'email'
  if (looksPhone) return 'phone'
  if (props.type) return props.type
  // basic heuristic: show video if URL ends with a known extension
  const v = String(props.value || '').toLowerCase()
  if (v.endsWith('.mp4') || v.endsWith('.webm') || v.endsWith('.mov') || v.includes('video='))
    return 'video'
  return 'text'
})

const textValue = computed(() => {
  const v = props.value
  if (v === null || v === undefined || v === '') return '-'
  return String(v)
})

const toDate = (v: any): Date | null => {
  if (v instanceof Date) return v
  if (typeof v === 'string' || typeof v === 'number') {
    const d = new Date(v)
    return isNaN(d.getTime()) ? null : d
  }
  if (v && typeof v === 'object') {
    const seconds = v._seconds ?? v.seconds
    const nanos = v._nanoseconds ?? v.nanoseconds ?? 0
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
  const n = typeof props.value === 'string' ? parseFloat(props.value) : props.value
  if (n === null || n === undefined || isNaN(n)) return '-'
  return n.toLocaleString('en-US')
})

const currencyValue = computed(() => {
  const n = typeof props.value === 'string' ? parseFloat(props.value) : props.value
  if (n === null || n === undefined || isNaN(n)) return '-'
  const code = props.currencyCode || 'USD'
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})

const ratingValue = computed(() => {
  const n = typeof props.value === 'string' ? parseFloat(props.value) : props.value
  if (n === null || n === undefined || isNaN(n)) return '-'
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
    return JSON.stringify(props.value)
  } catch {
    return String(props.value)
  }
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
</script>
