<template>
  <div
    class="fixed inset-0 z-50 bg-black/60"
    role="dialog"
    aria-modal="true"
    aria-label="Upload Media"
  >
    <div class="h-full w-full bg-white dark:bg-gray-900">
      <!-- Header -->
      <div
        class="flex items-center justify-between border-b px-5 py-3 dark:border-gray-800"
      >
        <div class="flex items-center gap-3">
          <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">
            Upload Media
          </h2>
          <p class="hidden text-xs text-gray-500 sm:block dark:text-gray-400">
            Select files on the left, set details on the right
          </p>
        </div>
        <button
          class="rounded-md border px-3 py-1.5 text-sm dark:border-gray-700"
          aria-label="Close"
          @click="$emit('close')"
        >
          Close
        </button>
      </div>

      <div class="grid h-[calc(100%-3rem)] grid-cols-1 sm:grid-cols-5">
        <div
          class="col-span-1 p-4 sm:col-span-3 sm:border-r sm:p-6 dark:border-gray-800"
        >
          <div
            v-if="!files.length"
            class="grid min-h-[200px] place-items-center rounded-lg border-2 border-dashed sm:h-full"
            @dragover.prevent
            @drop.prevent="onDrop"
          >
            <div class="text-center">
              <div class="text-sm text-gray-600 dark:text-gray-300">
                Drag & drop files
              </div>
              <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                or
              </div>
              <button
                class="bg-primary-600 mt-3 rounded-md px-3 py-1.5 text-sm text-white"
                @click="pick"
              >
                Choose files
              </button>
              <input
                ref="fileInput"
                type="file"
                class="hidden"
                :accept="accept"
                :multiple="true"
                @change="onPick"
              >
            </div>
          </div>

          <div
            v-else
            class="overflow-y-auto sm:h-full"
          >
            <!-- Single file preview -->
            <div
              v-if="previews.length === 1"
              class="space-y-3"
            >
              <div
                class="overflow-hidden rounded-lg border bg-black/5 dark:bg-white/5"
              >
                <img
                  v-if="previews[0].kind === 'image'"
                  :src="previews[0].url"
                  alt="preview"
                  class="h-auto w-full"
                >
                <video
                  v-else-if="previews[0].kind === 'video'"
                  :src="previews[0].url"
                  controls
                  class="h-auto w-full bg-black"
                />
                <audio
                  v-else-if="previews[0].kind === 'audio'"
                  :src="previews[0].url"
                  controls
                  class="w-full"
                />
                <div
                  v-else
                  class="p-8 text-sm text-gray-500 dark:text-gray-400"
                >
                  No preview available
                </div>
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-300">
                <div class="flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <div class="truncate font-medium">
                      {{ previews[0].name }}
                    </div>
                    <div>
                      Mimetype: {{ previews[0].type || "-" }} • Format:
                      {{ previews[0].format.toUpperCase() }}
                    </div>
                    <div>
                      Size: {{ prettySize(previews[0].size) }}
                      <span v-if="previews[0].duration !== undefined">• Duration:
                        {{ prettyDuration(previews[0].duration) }}</span>
                    </div>
                  </div>
                  <button
                    class="rounded-md border px-2 py-1 text-xs dark:border-gray-700"
                    @click="removeAt(0)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <!-- Multi file list -->
            <div
              v-else
              class="space-y-3"
            >
              <div class="flex items-center justify-between">
                <div
                  class="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Selected files ({{ files.length }})
                </div>
                <button
                  class="rounded-md border px-2 py-1 text-xs dark:border-gray-700"
                  @click="clearAll"
                >
                  Remove all
                </button>
              </div>
              <ul class="divide-y dark:divide-gray-800">
                <li
                  v-for="(p, idx) in previews"
                  :key="p.name"
                  class="flex items-center justify-between py-2"
                >
                  <div class="min-w-0">
                    <div
                      class="truncate text-xs font-medium text-gray-900 dark:text-gray-100"
                    >
                      {{ p.name }}
                    </div>
                    <div class="text-[11px] text-gray-500 dark:text-gray-400">
                      {{ p.format.toUpperCase() }} • {{ prettySize(p.size) }}
                      <span v-if="p.duration !== undefined">• {{ prettyDuration(p.duration) }}</span>
                    </div>
                  </div>
                  <button
                    class="ml-3 rounded-md border px-2 py-1 text-xs dark:border-gray-700"
                    @click="removeAt(idx)"
                  >
                    Remove
                  </button>
                </li>
              </ul>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Total size: {{ prettySize(totalSize) }}
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-1 overflow-y-auto p-4 sm:col-span-2 sm:p-6">
          <div class="space-y-3">
            <div>
              <label class="mb-1 block text-xs text-gray-500 dark:text-gray-400">Type</label>
              <select
                v-model="form.type"
                class="w-full rounded-md border px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="original">
                  Original
                </option>
                <option value="dubbed">
                  Dubbed
                </option>
                <option value="trailer">
                  Trailer
                </option>
                <option value="voice_over">
                  Voice Over
                </option>
                <option value="subtitle">
                  Subtitle
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs text-gray-500 dark:text-gray-400">Language</label>
              <select
                v-model="form.language"
                class="w-full rounded-md border px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="en">
                  English
                </option>
                <option value="es">
                  Spanish
                </option>
                <option value="fr">
                  French
                </option>
                <option value="de">
                  German
                </option>
                <option value="ja">
                  Japanese
                </option>
                <option value="ko">
                  Korean
                </option>
                <option value="zh">
                  Chinese
                </option>
                <option value="hi">
                  Hindi
                </option>
              </select>
            </div>
            <div
              v-if="previews.length === 1 && previews[0].duration !== undefined"
            >
              <label class="mb-1 block text-xs text-gray-500 dark:text-gray-400">Duration</label>
              <input
                :value="prettyDuration(previews[0].duration as number)"
                type="text"
                readonly
                disabled
                class="w-full cursor-not-allowed rounded-md border bg-gray-50 px-2 py-1.5 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
            </div>
            <div>
              <label class="mb-1 block text-xs text-gray-500 dark:text-gray-400">Description</label>
              <textarea
                v-model="form.description"
                rows="4"
                class="w-full rounded-md border px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs text-gray-500 dark:text-gray-400">Tags</label>
              <TagInput
                v-model="form.tags"
                placeholder="Add tag and press Enter"
              />
            </div>
          </div>
          <div
            class="sticky bottom-0 mt-4 flex justify-end gap-2 border-t bg-white/80 px-4 py-3 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80"
          >
            <button
              class="rounded-md border px-3 py-1.5 text-sm dark:border-gray-700"
              :disabled="uploading"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              class="bg-primary-600 rounded-md px-3 py-1.5 text-sm text-white disabled:opacity-50"
              :disabled="!files.length || uploading"
              @click="upload"
            >
              Upload
            </button>
          </div>
          <div
            v-if="uploading"
            class="sticky right-0 bottom-0 left-0 h-1 bg-gray-200"
          >
            <div
              class="bg-primary-600 h-1 transition-all"
              :style="{ width: `${progress}%` }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import TagInput from "@/components/atoms/TagInput.vue";
import { useMedia } from "@/composables/useMedia";
import { useGlobalUpload } from "@/composables/useGlobalUpload";

type Props = { title?: string; accept?: string };
withDefaults(defineProps<Props>(), { accept: "video/*,audio/*,.vtt,.srt" });
const emit = defineEmits<{
  (e: "close"): void;
  (e: "uploaded", p: { count: number }): void;
}>();

const files = ref<File[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const form = ref<{
  type: string;
  language: string;
  description?: string;
  format: string;
  tags: string[];
}>({
  type: "original",
  language: "en",
  description: "",
  format: "mp4",
  tags: [],
});
const uploading = ref(false);
const progress = ref(0);
const totalSize = ref(0);
const previews = ref<
  Array<{
    url: string;
    kind: "image" | "video" | "audio" | "other";
    name: string;
    type: string;
    size: number;
    format: string;
    duration?: number;
  }>
>([]);

const formatOptions = [
  "mp4",
  "mov",
  "mkv",
  "avi",
  "webm",
  "m3u8",
  "mp3",
  "wav",
  "aac",
  "flac",
  "srt",
  "vtt",
  "ass",
  "ssa",
  "jpg",
  "png",
  "webp",
];

const { uploadViaMediaModule } = useMedia();
const uploader = useGlobalUpload();

function pick() {
  fileInput.value?.click();
}
function onPick(e: Event) {
  setFiles(Array.from((e.target as HTMLInputElement).files || []));
}
function onDrop(e: DragEvent) {
  setFiles(Array.from(e.dataTransfer?.files || []));
}

function setFiles(list: File[]) {
  files.value = list;
  totalSize.value = list.reduce((acc, f) => acc + (f.size || 0), 0);
  // default format from first file extension
  const ext = (list[0]?.name.split(".").pop() || "").toLowerCase();
  if (ext && formatOptions.includes(ext)) form.value.format = ext as any;
  // build previews
  previews.value.forEach((p: { url: string }) => URL.revokeObjectURL(p.url));
  previews.value = list.map((f) => {
    const url = URL.createObjectURL(f);
    const m = (f.type || "").split("/")[0];
    const kind =
      m === "image"
        ? "image"
        : m === "video"
          ? "video"
          : m === "audio"
            ? "audio"
            : "other";
    const format = (f.name.split(".").pop() || "").toLowerCase();
    const item: {
      url: string;
      kind: "image" | "video" | "audio" | "other";
      name: string;
      type: string;
      size: number;
      format: string;
      duration?: number;
    } = {
      url,
      kind: kind as any,
      name: f.name,
      type: f.type,
      size: f.size,
      format,
    };
    if (kind === "audio" || kind === "video") {
      const probe = document.createElement(kind);
      probe.preload = "metadata";
      probe.src = url;
      probe.onloadedmetadata = () => {
        // duration in seconds
        if (!isNaN(probe.duration)) item.duration = probe.duration;
      };
    }
    return item;
  });
}

async function upload() {
  if (!files.value.length) return;
  // Enqueue all files and close immediately; progress is tracked globally
  for (const f of files.value) {
    const id = `${Date.now()}-${f.name}-${Math.random().toString(36).slice(2)}`;
    uploader.add({
      id,
      fileName: f.name,
      size: f.size,
      type: f.type,
      progress: 0,
      status: "pending",
    });
    // Kick off upload without blocking modal
    doUpload(id, f).catch((e: any) => {
      uploader.update(id, {
        status: "failed",
        error: e?.message || "Upload failed",
      });
    });
  }
  emit("uploaded", { count: files.value.length });
  emit("close");
}

async function doUpload(id: string, f: File) {
  uploader.update(id, { status: "uploading", progress: 5 });
  await uploadViaMediaModule(f, {
    type: form.value.type,
    format: form.value.format,
    language: form.value.language,
    description: form.value.description || undefined,
    tags: form.value.tags,
    metadata: collectMetadataForFile(f.name),
    duration: (() => {
      const p = previews.value.find((x) => x.name === f.name);
      return p?.duration !== undefined ? Math.round(p.duration) : undefined;
    })(),
  });
  uploader.update(id, { status: "completed", progress: 100 });
}

function prettySize(bytes: number): string {
  const sizes = ["B", "KB", "MB", "GB"];
  if (!bytes) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`;
}

function prettyDuration(sec: number): string {
  const s = Math.floor(sec % 60);
  const m = Math.floor((sec / 60) % 60);
  const h = Math.floor(sec / 3600);
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function removeAt(index: number) {
  const p = previews.value[index];
  if (p) URL.revokeObjectURL(p.url);
  previews.value.splice(index, 1);
  files.value.splice(index, 1);
  totalSize.value = files.value.reduce((acc, f) => acc + (f.size || 0), 0);
}

function clearAll() {
  previews.value.forEach((p: { url: string }) => URL.revokeObjectURL(p.url));
  previews.value = [];
  files.value = [];
  totalSize.value = 0;
}

// tags handled by TagInput atom via v-model

// UX: close on Escape and prevent background scroll
function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") emit("close");
}
onMounted(() => {
  document.addEventListener("keydown", onKeydown);
  const prev = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  // restore on unmount
  onBeforeUnmount(() => {
    document.removeEventListener("keydown", onKeydown);
    document.body.style.overflow = prev;
  });
});

function collectMetadataForFile(name: string): Record<string, any> | undefined {
  const p = previews.value.find((x) => x.name === name);
  if (!p) return undefined;
  const md: Record<string, any> = {};
  if (p.duration !== undefined) md.duration = Math.round(p.duration);
  return Object.keys(md).length ? md : undefined;
}
</script>
