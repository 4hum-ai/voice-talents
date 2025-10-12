<template>
  <div class="mx-auto max-w-3xl">
    <div class="mb-8 text-center">
      <h1 class="text-foreground mb-4 text-3xl font-bold">Project Files</h1>
      <p class="text-muted-foreground text-lg">
        Upload scripts, transcripts, and reference materials to help talent understand your project
      </p>
    </div>

    <div class="space-y-6">
      <!-- File Upload Areas -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <!-- Script/Transcript Upload -->
        <div class="bg-card border-border rounded-lg border p-6">
          <div class="mb-4 flex items-center space-x-3">
            <div class="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Icon name="mdi:file-document" class="text-primary h-5 w-5" />
            </div>
            <div>
              <h3 class="text-foreground font-semibold">Script/Transcript</h3>
              <p class="text-muted-foreground text-sm">Upload your script or transcript</p>
            </div>
          </div>

          <FileUpload
            v-model="localFiles.script"
            accept=".pdf,.doc,.docx,.txt"
            :max-size="10"
            :premium-feature="false"
            @upload="
              (file: File | File[]) => handleScriptUpload(Array.isArray(file) ? file[0] : file)
            "
          />

          <div
            v-if="localFiles.script"
            class="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/20"
          >
            <div class="flex items-center space-x-2">
              <Icon name="mdi:check-circle" class="h-4 w-4 text-green-600" />
              <span class="text-sm text-green-800 dark:text-green-200"
                >Script uploaded successfully</span
              >
            </div>
          </div>
        </div>

        <!-- Reference Audio Upload -->
        <div class="bg-card border-border rounded-lg border p-6">
          <div class="mb-4 flex items-center space-x-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Icon name="mdi:microphone" class="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 class="text-foreground font-semibold">Reference Audio</h3>
              <p class="text-muted-foreground text-sm">Upload sample audio for tone/style</p>
            </div>
          </div>

          <FileUpload
            v-model="localFiles.referenceAudio"
            accept=".mp3,.wav,.m4a,.aac"
            :max-size="25"
            :premium-feature="false"
            @upload="
              (file: File | File[]) => handleReferenceUpload(Array.isArray(file) ? file[0] : file)
            "
          />

          <div
            v-if="localFiles.referenceAudio"
            class="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/20"
          >
            <div class="flex items-center space-x-2">
              <Icon name="mdi:check-circle" class="h-4 w-4 text-green-600" />
              <span class="text-sm text-green-800 dark:text-green-200"
                >Reference audio uploaded</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Files -->
      <div class="bg-card border-border rounded-lg border p-6">
        <div class="mb-4 flex items-center space-x-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
            <Icon name="mdi:attachment" class="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h3 class="text-foreground font-semibold">Additional Files</h3>
            <p class="text-muted-foreground text-sm">
              Upload subtitles, storyboards, or other materials
            </p>
          </div>
        </div>

        <FileUpload
          v-model="localFiles.additional"
          accept=".pdf,.doc,.docx,.txt,.srt,.vtt,.jpg,.png,.mp4"
          :max-size="50"
          :multiple="true"
          :premium-feature="false"
          @upload="
            (file: File | File[]) => handleAdditionalUpload(Array.isArray(file) ? file : [file])
          "
        />

        <div v-if="localFiles.additional && localFiles.additional.length > 0" class="mt-3">
          <div class="space-y-2">
            <div
              v-for="(file, index) in localFiles.additional"
              :key="index"
              class="bg-muted/50 flex items-center justify-between rounded-lg p-2"
            >
              <div class="flex items-center space-x-2">
                <Icon name="mdi:file" class="text-muted-foreground h-4 w-4" />
                <span class="text-foreground text-sm">{{ file.name }}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                @click="removeAdditionalFile(index)"
                class="text-destructive hover:text-destructive"
              >
                <Icon name="mdi:close" class="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Premium Features -->
      <div
        class="from-primary/5 border-primary/20 rounded-lg border bg-gradient-to-r to-purple-500/5 p-6"
      >
        <div class="flex items-start space-x-4">
          <div
            class="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg"
          >
            <Icon name="mdi:star" class="text-primary h-6 w-6" />
          </div>
          <div class="flex-1">
            <h3 class="text-foreground mb-2 font-semibold">Premium File Processing</h3>
            <p class="text-muted-foreground mb-4 text-sm">
              Get AI-powered script analysis, automatic talent matching, and enhanced file
              processing
            </p>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="flex items-center space-x-3">
                <input
                  id="expressMatching"
                  v-model="premiumFeatures.expressMatching"
                  type="checkbox"
                  class="text-primary focus:ring-primary border-border h-4 w-4 rounded"
                />
                <label for="expressMatching" class="text-foreground text-sm">
                  Express Matching ($15)
                </label>
              </div>

              <div class="flex items-center space-x-3">
                <input
                  id="talentOutreach"
                  v-model="premiumFeatures.talentOutreach"
                  type="checkbox"
                  class="text-primary focus:ring-primary border-border h-4 w-4 rounded"
                />
                <label for="talentOutreach" class="text-foreground text-sm">
                  Talent Outreach ($19)
                </label>
              </div>
            </div>

            <div v-if="totalPremiumCost > 0" class="bg-primary/10 mt-4 rounded-lg p-3">
              <div class="flex items-center justify-between">
                <span class="text-foreground text-sm font-medium">Total Premium Cost:</span>
                <span class="text-primary text-lg font-bold">${{ totalPremiumCost }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- File Summary -->
      <div v-if="hasFiles" class="bg-muted/50 rounded-lg p-4">
        <h4 class="text-foreground mb-2 font-medium">Uploaded Files Summary</h4>
        <div class="text-muted-foreground space-y-1 text-sm">
          <div v-if="localFiles.script"><strong>Script:</strong> {{ localFiles.script.name }}</div>
          <div v-if="localFiles.referenceAudio">
            <strong>Reference Audio:</strong> {{ localFiles.referenceAudio.name }}
          </div>
          <div v-if="localFiles.additional && localFiles.additional.length > 0">
            <strong>Additional Files:</strong> {{ localFiles.additional.length }} file(s)
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="mt-8 flex justify-between">
      <Button variant="outline" size="lg" @click="handlePrevious">
        <Icon name="mdi:arrow-left" class="mr-2 h-4 w-4" />
        Previous
      </Button>

      <Button variant="primary" size="lg" @click="handleNext" class="px-8">
        Continue
        <Icon name="mdi:arrow-right" class="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import FileUpload from '@/components/atoms/FileUpload.vue'

interface ProjectFiles {
  script?: File
  referenceAudio?: File
  additional?: File[]
}

interface PremiumFeatures {
  expressMatching: boolean
  talentOutreach: boolean
}

interface Props {
  files: ProjectFiles
  premiumFeatures: PremiumFeatures
}

interface Emits {
  (e: 'update:files', value: ProjectFiles): void
  (e: 'update:premiumFeatures', value: PremiumFeatures): void
  (e: 'next'): void
  (e: 'previous'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localFiles = ref<ProjectFiles>({ ...props.files })
const premiumFeatures = ref<PremiumFeatures>({ ...props.premiumFeatures })

// Computed properties
const hasFiles = computed(() => {
  return (
    localFiles.value.script ||
    localFiles.value.referenceAudio ||
    (localFiles.value.additional && localFiles.value.additional.length > 0)
  )
})

const totalPremiumCost = computed(() => {
  let cost = 0
  if (premiumFeatures.value.expressMatching) cost += 15
  if (premiumFeatures.value.talentOutreach) cost += 19
  return cost
})

// Methods
const handleScriptUpload = (file: File) => {
  localFiles.value.script = file
}

const handleReferenceUpload = (file: File) => {
  localFiles.value.referenceAudio = file
}

const handleAdditionalUpload = (files: File[]) => {
  localFiles.value.additional = files
}

const removeAdditionalFile = (index: number) => {
  if (localFiles.value.additional) {
    localFiles.value.additional.splice(index, 1)
  }
}

const handleNext = () => {
  emit('next')
}

const handlePrevious = () => {
  emit('previous')
}

// Watch for changes and emit updates
watch(
  localFiles,
  (newValue) => {
    emit('update:files', newValue)
  },
  { deep: true },
)

watch(
  premiumFeatures,
  (newValue) => {
    emit('update:premiumFeatures', newValue)
  },
  { deep: true },
)
</script>
