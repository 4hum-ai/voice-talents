<template>
  <div
    :class="[
      'relative flex w-sm flex-row gap-2 rounded border border-zinc-800 bg-zinc-900 p-3',
    ]"
  >
    <component
      :is="icons[props.message.type]"
      :class="[
        props.message.type === 'error'
          ? 'text-red-500'
          : props.message.type === 'info'
            ? 'text-blue-500'
            : props.message.type === 'success'
              ? 'text-green-500'
              : props.message.type === 'warning'
                ? 'text-yellow-500'
                : 'text-zinc-50',
        'mt-0.5 flex-none text-base',
      ]"
    />
    <button
      class="absolute top-2 right-2 text-zinc-400 transition hover:text-zinc-50"
      @click="emit('destroy', props.message.id)"
    >
      <CloseIcon />
    </button>
    <div class="flex-auto wrap-break-word">
      <h4 class="font-medium">{{ props.message.title }}</h4>
      <span>{{ props.message.body }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IToastMessage, MessageType } from "@/types/toast";
import { promiseTimeout } from "@vueuse/core";
import { FunctionalComponent, onMounted, SVGAttributes } from "vue";
import ErrorIcon from "~icons/mdi/error-outline";
import InfoIcon from "~icons/mdi/information-outline";
import SuccessIcon from "~icons/mdi/check-circle-outline";
import WarningIcon from "~icons/mdi/warning-outline";
import CloseIcon from "~icons/mdi/close";

// Types
interface Props {
  message: IToastMessage;
}

// Emits
const emit = defineEmits<{
  destroy: [id: string];
}>();

// Props
const props = defineProps<Props>();

// State
const icons: Record<MessageType, FunctionalComponent<SVGAttributes>> = {
  success: SuccessIcon,
  error: ErrorIcon,
  info: InfoIcon,
  warning: WarningIcon,
};

// Watchers
onMounted(async () => {
  if (!(props.message.timeout !== undefined && props.message.timeout > 0))
    return;

  await promiseTimeout(props.message.timeout);

  emit("destroy", props.message.id);
});
</script>
