import { IToastMessage } from "@/types/toast";
import { ref, Ref } from "vue";

const messages: Ref<IToastMessage[]> = ref([]);

export const useToast = () => {
  const push = (message: IToastMessage) => {
    messages.value.push(message);
  };
  const remove = (id: string) => {
    messages.value = messages.value.filter((msg) => msg.id !== id);
  };
  const clear = () => {
    messages.value = [];
  };

  return { clear, push, remove, messages };
};
