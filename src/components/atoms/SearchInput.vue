<template>
  <div class="min-w-0 flex-1">
    <input
      ref="inputEl"
      :value="modelValue"
      :placeholder="placeholder"
      class="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    >
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{ modelValue: string; placeholder?: string }>();
defineEmits(["update:modelValue"]);

const inputEl = ref<HTMLInputElement | null>(null);
function focus() {
  inputEl.value?.focus();
}

defineExpose({ focus });
</script>
