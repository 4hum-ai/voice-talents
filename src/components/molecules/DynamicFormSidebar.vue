<template>
  <div class="fixed inset-0 overflow-hidden z-50 pointer-events-none">
    <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex pointer-events-auto">
      <div class="w-screen max-w-md">
        <div class="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl border-l border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
              {{ title }}
            </h3>
            <button
              class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              @click="$emit('close')"
            >
              ✕
            </button>
          </div>
          <div class="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
            <form
              class="px-6 py-6 space-y-6"
              @submit.prevent="handleSubmit"
            >
              <div class="space-y-4">
                <div
                  v-for="field in resolvedForm.fields"
                  :key="field.key"
                  class="space-y-2"
                >
                  <label
                    :for="field.key"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >{{ field.label }}<span
                    v-if="field.required"
                    class="text-red-500"
                  >*</span></label>
                  <input
                    v-if="field.type==='text' || field.type==='email' || field.type==='url'"
                    :id="field.key"
                    v-model="formData[field.key]"
                    :type="inputType(field)"
                    :placeholder="field.placeholder"
                    :class="inputClass(field)"
                    @blur="onBlur(field)"
                    @input="onInput(field)"
                  >
                  <input
                    v-else-if="field.type==='number'"
                    :id="field.key"
                    v-model.number="formData[field.key]"
                    type="number"
                    :placeholder="field.placeholder"
                    :class="inputClass(field)"
                    @blur="onBlur(field)"
                    @input="onInput(field)"
                  >
                  <input
                    v-else-if="field.type==='date'"
                    :id="field.key"
                    v-model="formData[field.key]"
                    type="date"
                    :class="inputClass(field)"
                    @blur="onBlur(field)"
                    @input="onInput(field)"
                  >
                  <select
                    v-else-if="field.type==='select'"
                    :id="field.key"
                    v-model="formData[field.key]"
                    :class="inputClass(field)"
                    @blur="onBlur(field)"
                    @change="onInput(field)"
                  >
                    <option :value="undefined">
                      {{ field.placeholder || `Select ${field.label.toLowerCase()}` }}
                    </option>
                    <option
                      v-for="opt in field.options || []"
                      :key="opt.value"
                      :value="opt.value"
                    >
                      {{ opt.label }}
                    </option>
                  </select>
                  <textarea
                    v-else-if="field.type==='textarea'"
                    :id="field.key"
                    v-model="formData[field.key]"
                    :placeholder="field.placeholder"
                    rows="3"
                    :class="textareaClass(field)"
                    @blur="onBlur(field)"
                    @input="onInput(field)"
                  />
                  <div
                    v-else-if="field.type==='boolean'"
                    class="flex items-center"
                  >
                    <input
                      :id="field.key"
                      v-model="formData[field.key]"
                      type="checkbox"
                      class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                      @change="onInput(field)"
                    ><label
                      :for="field.key"
                      class="ml-2 block text-sm text-gray-900 dark:text-gray-100"
                    >{{ field.label }}</label>
                  </div>
                  <p
                    v-if="field.helpText"
                    class="text-xs text-gray-500 dark:text-gray-400"
                  >
                    {{ field.helpText }}
                  </p>
                  <p
                    v-if="shouldShowError(field)"
                    class="text-xs text-red-600"
                  >
                    {{ errors[field.key] }}
                  </p>
                </div>
              </div>
            </form>
          </div>
          <div class="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                @click="$emit('close')"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading || !isFormValid"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                @click="handleSubmit"
              >
                <span v-if="loading">{{ loadingText }}</span>
                <span v-else>{{ submitText }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { countries } from '@/utils/countries'

interface FormField { key: string; label: string; type: 'text'|'email'|'url'|'number'|'date'|'select'|'textarea'|'boolean'; required?: boolean; placeholder?: string; helpText?: string; options?: Array<{ value:string; label:string }> }
interface FormConfig { fields: FormField[]; layout?: 'single'|'tabs'|'sections' }

const props = withDefaults(defineProps<{ title: string; formConfig?: FormConfig; initialData?: Record<string, any>; loading?: boolean; submitText?: string; loadingText?: string }>(), { loading:false, submitText:'Submit', loadingText:'Submitting...' })
const emit = defineEmits<{ close: []; submit: [data: Record<string, any>] }>()

const formData = reactive<Record<string, any>>({ ...(props.initialData || {}) })
const errors = reactive<Record<string, string | undefined>>({})

const resolvedForm = computed<FormConfig>(() => {
  const base: FormConfig = props.formConfig ? { ...props.formConfig, fields: [...(props.formConfig.fields || [])] } : { fields: [] }
  base.fields = base.fields.map((f) => {
    if (f.type === 'select' && f.key === 'country' && (!f.options || f.options.length === 0)) {
      return {
        ...f,
        options: countries.map(c => ({ value: c.code, label: c.name })),
        placeholder: f.placeholder || 'Select country'
      }
    }
    return f
  })
  return base
})

const inputBase = 'block w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:border-red-500 border-gray-300 dark:border-gray-700'
const touched = reactive<Record<string, boolean>>({})
const submitted = ref(false)
const shouldShowError = (field: FormField) => (touched[field.key] || submitted.value) && !!errors[field.key]
const inputClass = (field: FormField) => [inputBase, shouldShowError(field) ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '']
const textareaClass = (field: FormField) => [inputBase, 'min-h-[96px]', shouldShowError(field) ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '']
const inputType = (field: FormField) => {
  if (field.type === 'text' && field.key === 'email') return 'email'
  return field.type
}

const validators = {
  required: (v: any) => !(v === undefined || v === null || v === ''),
  email: (v: any) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)),
  url: (v: any) => !v || /^(https?:\/\/)?[\w.-]+(\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/.test(String(v)),
  number: (v: any) => v === undefined || v === null || v === '' || !isNaN(Number(v)),
  date: (v: any) => !v || !isNaN(new Date(v).getTime())
}

function validateField(field: FormField): string | undefined {
  const v = formData[field.key]
  if (field.required && !validators.required(v)) return 'This field is required.'
  if ((field.type === 'email' || field.key === 'email') && !validators.email(v)) return 'Enter a valid email address.'
  if (field.type === 'url' && !validators.url(v)) return 'Enter a valid URL.'
  if (field.type === 'number' && !validators.number(v)) return 'Enter a valid number.'
  if (field.type === 'date' && !validators.date(v)) return 'Enter a valid date.'
  return undefined
}

function validateAll(): boolean {
  let ok = true
  errorsKeys().forEach(k => delete errors[k])
  for (const f of resolvedForm.value.fields) {
    const msg = validateField(f)
    if (msg) { errors[f.key] = msg; ok = false }
  }
  return ok
}

const errorsKeys = () => Object.keys(errors)

function setFieldError(field: FormField) {
  const msg = validateField(field)
  if (msg) errors[field.key] = msg
  else delete errors[field.key]
}

function onBlur(field: FormField) {
  touched[field.key] = true
  setFieldError(field)
}

function onInput(field: FormField) {
  if (touched[field.key] || submitted.value) setFieldError(field)
}

const isFormValid = computed(() => resolvedForm.value.fields.every(f => validateField(f) === undefined))

const handleSubmit = () => {
  submitted.value = true
  if (!validateAll()) return
  emit('submit', { ...formData })
}
</script>


