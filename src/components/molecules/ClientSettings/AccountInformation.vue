<template>
  <div class="space-y-8">
    <div class="mb-8 text-center">
      <div
        class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600"
      >
        <Icon name="mdi:account" class="h-8 w-8 text-white" />
      </div>
      <h2 class="text-foreground mb-2 text-2xl font-bold">Account Information</h2>
      <p class="text-muted-foreground">
        Set up your company details and contact information
      </p>
    </div>

    <div class="bg-card border-border rounded-lg border p-8">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="lg:col-span-2">
          <label class="text-foreground mb-2 block text-sm font-medium">
            Company Name *
          </label>
          <input
            :value="modelValue.companyName"
            @input="updateField('companyName', ($event.target as HTMLInputElement).value)"
            type="text"
            required
            class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
            placeholder="Your Company Name"
          />
        </div>

        <div>
          <label class="text-foreground mb-2 block text-sm font-medium">
            Contact Name *
          </label>
          <input
            :value="modelValue.contactName"
            @input="updateField('contactName', ($event.target as HTMLInputElement).value)"
            type="text"
            required
            class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
            placeholder="Your Full Name"
          />
        </div>

        <div>
          <label class="text-foreground mb-2 block text-sm font-medium">
            Email Address *
          </label>
          <input
            :value="modelValue.email"
            @input="updateField('email', ($event.target as HTMLInputElement).value)"
            type="email"
            required
            class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label class="text-foreground mb-2 block text-sm font-medium">
            Phone Number
          </label>
          <input
            :value="modelValue.phone"
            @input="updateField('phone', ($event.target as HTMLInputElement).value)"
            type="tel"
            class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label class="text-foreground mb-2 block text-sm font-medium"> Website </label>
          <input
            :value="modelValue.website"
            @input="updateField('website', ($event.target as HTMLInputElement).value)"
            type="url"
            class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
            placeholder="https://yourcompany.com"
          />
        </div>

        <div>
          <label class="text-foreground mb-2 block text-sm font-medium">
            Location *
          </label>
          <input
            :value="modelValue.location"
            @input="updateField('location', ($event.target as HTMLInputElement).value)"
            type="text"
            required
            class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
            placeholder="City, Country"
          />
        </div>

        <div>
          <label class="text-foreground mb-2 block text-sm font-medium">
            Timezone *
          </label>
          <SelectInput
            :model-value="modelValue.timezone"
            @update:model-value="updateField('timezone', $event)"
            :options="timezoneOptions"
            placeholder="Select timezone"
            required
          />
        </div>

        <div>
          <label class="text-foreground mb-2 block text-sm font-medium">
            Industry *
          </label>
          <input
            :value="modelValue.industry"
            @input="updateField('industry', ($event.target as HTMLInputElement).value)"
            type="text"
            required
            class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
            placeholder="e.g., Technology, Advertising, Education"
          />
        </div>

        <div>
          <label class="text-foreground mb-2 block text-sm font-medium">
            Company Size *
          </label>
          <SelectInput
            :model-value="modelValue.companySize"
            @update:model-value="updateField('companySize', $event)"
            :options="companySizeOptions"
            placeholder="Select company size"
            required
          />
        </div>

        <div class="lg:col-span-2">
          <label class="text-foreground mb-2 block text-sm font-medium">
            Company Description
          </label>
          <textarea
            :value="modelValue.description"
            @input="updateField('description', ($event.target as HTMLTextAreaElement).value)"
            rows="3"
            class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
            placeholder="Brief description of your company and what you do..."
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/atoms/Icon.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'

interface AccountInformationData {
  companyName: string
  contactName: string
  email: string
  phone: string
  website: string
  location: string
  timezone: string
  industry: string
  companySize: string
  description: string
}

interface Props {
  modelValue: AccountInformationData
  requiredFields?: string[]
}

interface Emits {
  (e: 'update:modelValue', value: AccountInformationData): void
  (e: 'validation-change', isValid: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  requiredFields: () => ['companyName', 'contactName', 'email', 'location', 'timezone', 'industry', 'companySize']
})

const emit = defineEmits<Emits>()

// Options
const timezoneOptions = [
  { value: 'UTC-12', label: '(UTC-12:00) International Date Line West' },
  { value: 'UTC-11', label: '(UTC-11:00) Coordinated Universal Time-11' },
  { value: 'UTC+0', label: '(UTC+00:00) Coordinated Universal Time' },
  { value: 'UTC+1', label: '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna' },
  { value: 'UTC+2', label: '(UTC+02:00) Athens, Bucharest, Istanbul' },
  { value: 'UTC+3', label: '(UTC+03:00) Moscow, St. Petersburg, Volgograd' },
  { value: 'UTC+4', label: '(UTC+04:00) Abu Dhabi, Muscat' },
  { value: 'UTC+5', label: '(UTC+05:00) Islamabad, Karachi, Tashkent' },
  { value: 'UTC+6', label: '(UTC+06:00) Almaty, Dhaka' },
  { value: 'UTC+7', label: '(UTC+07:00) Bangkok, Hanoi, Jakarta' },
  { value: 'UTC+8', label: '(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi' },
  { value: 'UTC+9', label: '(UTC+09:00) Osaka, Sapporo, Tokyo' },
  { value: 'UTC+10', label: '(UTC+10:00) Brisbane, Canberra, Melbourne, Sydney' },
  { value: 'UTC+11', label: '(UTC+11:00) Magadan, Solomon Islands, New Caledonia' },
  { value: 'UTC+12', label: '(UTC+12:00) Auckland, Wellington, Fiji, Kamchatka' },
]

const companySizeOptions = [
  { value: 'startup', label: 'Startup (1-10 employees)' },
  { value: 'small', label: 'Small (11-50 employees)' },
  { value: 'medium', label: 'Medium (51-250 employees)' },
  { value: 'large', label: 'Large (251-1000 employees)' },
  { value: 'enterprise', label: 'Enterprise (1000+ employees)' },
]

// Computed
const isValid = computed(() => {
  return props.requiredFields.every(field => {
    const value = props.modelValue[field as keyof AccountInformationData]
    return value && value.toString().trim() !== ''
  })
})

// Methods
const updateField = (field: keyof AccountInformationData, value: string) => {
  const updated = { ...props.modelValue, [field]: value }
  emit('update:modelValue', updated)
  emit('validation-change', isValid.value)
}

// Emit initial validation state
emit('validation-change', isValid.value)
</script>
