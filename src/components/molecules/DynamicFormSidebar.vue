<template>
  <div class="fixed inset-0 overflow-hidden z-50 pointer-events-none">
    <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex pointer-events-auto">
      <div class="w-screen max-w-md">
        <div class="h-full flex flex-col bg-white shadow-xl border-l border-gray-200">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
            <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <div class="flex-1 overflow-y-auto bg-white">
            <form @submit.prevent="handleSubmit" class="px-6 py-6 space-y-6">
              <div class="space-y-4">
                <div v-for="field in formConfig?.fields || []" :key="field.key" class="space-y-2">
                  <label :for="field.key" class="block text-sm font-medium text-gray-700">{{ field.label }}<span v-if="field.required" class="text-red-500">*</span></label>
                  <input v-if="field.type==='text' || field.type==='email' || field.type==='url'" :id="field.key" v-model="formData[field.key]" :type="field.type" :placeholder="field.placeholder" class="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 border-gray-300 focus:ring-red-500 focus:border-red-500" />
                  <input v-else-if="field.type==='number'" :id="field.key" v-model.number="formData[field.key]" type="number" :placeholder="field.placeholder" class="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 border-gray-300 focus:ring-red-500 focus:border-red-500" />
                  <input v-else-if="field.type==='date'" :id="field.key" v-model="formData[field.key]" type="date" class="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 border-gray-300 focus:ring-red-500 focus:border-red-500" />
                  <select v-else-if="field.type==='select'" :id="field.key" v-model="formData[field.key]" class="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 border-gray-300 focus:ring-red-500 focus:border-red-500">
                    <option :value="undefined">{{ field.placeholder || `Select ${field.label.toLowerCase()}` }}</option>
                    <option v-for="opt in field.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                  </select>
                  <textarea v-else-if="field.type==='textarea'" :id="field.key" v-model="formData[field.key]" :placeholder="field.placeholder" rows="3" class="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 border-gray-300 focus:ring-red-500 focus:border-red-500"></textarea>
                  <div v-else-if="field.type==='boolean'" class="flex items-center"><input :id="field.key" v-model="formData[field.key]" type="checkbox" class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" /><label :for="field.key" class="ml-2 block text-sm text-gray-900">{{ field.label }}</label></div>
                  <p v-if="field.helpText" class="text-xs text-gray-500">{{ field.helpText }}</p>
                </div>
              </div>
            </form>
          </div>
          <div class="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div class="flex justify-end space-x-3">
              <button type="button" @click="$emit('close')" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
              <button type="submit" :disabled="loading" @click="handleSubmit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50">
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
import { reactive } from 'vue'

interface FormField { key: string; label: string; type: 'text'|'email'|'url'|'number'|'date'|'select'|'textarea'|'boolean'; required?: boolean; placeholder?: string; helpText?: string; options?: Array<{ value:string; label:string }> }
interface FormConfig { fields: FormField[]; layout?: 'single'|'tabs'|'sections' }

const props = withDefaults(defineProps<{ title: string; formConfig?: FormConfig; initialData?: Record<string, any>; loading?: boolean; submitText?: string; loadingText?: string }>(), { loading:false, submitText:'Submit', loadingText:'Submitting...' })
const emit = defineEmits<{ close: []; submit: [data: Record<string, any>] }>()

const formData = reactive<Record<string, any>>({ ...(props.initialData || {}) })

const handleSubmit = () => {
  emit('submit', { ...formData })
}
</script>


