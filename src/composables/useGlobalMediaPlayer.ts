import { ref } from "vue";

const visible = ref(false);
const url = ref("");
const title = ref("");
const type = ref<"video" | "audio">("video");

export function useGlobalMediaPlayer() {
  return {
    visible,
    url,
    title,
    type,
    open: (media: { url: string; title?: string; type: "video" | "audio" }) => {
      url.value = media.url;
      title.value = media.title || "";
      type.value = media.type;
      visible.value = true;
    },
    close: () => {
      visible.value = false;
      url.value = "";
      title.value = "";
    },
  };
}


