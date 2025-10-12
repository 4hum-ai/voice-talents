<template>
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-4">Project Files</h1>
      <p class="text-lg text-muted-foreground">
        Upload scripts, transcripts, and reference materials to help talent understand your project
      </p>
    </div>

    <div class="space-y-6">
      <!-- File Upload Areas -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Script/Transcript Upload -->
        <div class="bg-card rounded-lg border border-border p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="mdi:file-document" class="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 class="font-semibold text-foreground">Script/Transcript</h3>
              <p class="text-sm text-muted-foreground">Upload your script or transcript</p>
            </div>
          </div>
          
          <FileUpload
            v-model="localFiles.script"
            accept=".pdf,.doc,.docx,.txt"
            :max-size="10"
            :premium-feature="false"
            @upload="handleScriptUpload"
          />
          
          <div v-if="localFiles.script" class="mt-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <div class="flex items-center space-x-2">
              <Icon name="mdi:check-circle" class="h-4 w-4 text-green-600" />
              <span class="text-sm text-green-800 dark:text-green-200">Script uploaded successfully</span>
            </div>
          </div>
        </div>

        <!-- Reference Audio Upload -->
        <div class="bg-card rounded-lg border border-border p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Icon name="mdi:microphone" class="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 class="font-semibold text-foreground">Reference Audio</h3>
              <p class="text-sm text-muted-foreground">Upload sample audio for tone/style</p>
            </div>
          </div>
          
          <FileUpload
            v-model="localFiles.referenceAudio"
            accept=".mp3,.wav,.m4a,.aac"
            :max-size="25"
            :premium-feature="false"
            @upload="handleReferenceUpload"
          />
          
          <div v-if="localFiles.referenceAudio" class="mt-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <div class="flex items-center space-x-2">
              <Icon name="mdi:check-circle" class="h-4 w-4 text-green-600" />
              <span class="text-sm text-green-800 dark:text-green-200">Reference audio uploaded</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Files -->
      <div class="bg-card rounded-lg border border-border p-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <Icon name="mdi:attachment" class="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h3 class="font-semibold text-foreground">Additional Files</h3>
            <p class="text-sm text-muted-foreground">Upload subtitles, storyboards, or other materials</p>
          </div>
        </div>
        
        <FileUpload
          v-model="localFiles.additional"
          accept=".pdf,.doc,.docx,.txt,.srt,.vtt,.jpg,.png,.mp4"
          :max-size="50"
          :multiple="true"
          :premium-feature="false"
          @upload="handleAdditionalUpload"
        />
        
        <div v-if="localFiles.additional && localFiles.additional.length > 0" class="mt-3">
          <div class="space-y-2">
            <div 
              v-for="(file, index) in localFiles.additional" 
              :key="index"
              class="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
            >
              <div class="flex items-center space-x-2">
                <Icon name="mdi:file" class="h-4 w-4 text-muted-foreground" />
                <span class="text-sm text-foreground">{{ file.name }}</span>
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
      <div class="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-lg border border-primary/20 p-6">
        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="mdi:star" class="h-6 w-6 text-primary" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-foreground mb-2">Premium File Processing</h3>
            <p class="text-sm text-muted-foreground mb-4">
              Get AI-powered script analysis, automatic talent matching, and enhanced file processing
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex items-center space-x-3">
                <input
                  id="expressMatching"
                  v-model="premiumFeatures.expressMatching"
                  type="checkbox"
                  class="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <label for="expressMatching" class="text-sm text-foreground">
                  Express Matching ($15)
                </label>
              </div>
              
              <div class="flex items-center space-x-3">
                <input
                  id="talentOutreach"
                  v-model="premiumFeatures.talentOutreach"
                  type="checkbox"
                  class="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <label for="talentOutreach" class="text-sm text-foreground">
                  Talent Outreach ($19)
                </label>
              </div>
            </div>
            
            <div v-if="totalPremiumCost > 0" class="mt-4 p-3 bg-primary/10 rounded-lg">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-foreground">Total Premium Cost:</span>
                <span class="text-lg font-bold text-primary">${{ totalPremiumCost }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- File Summary -->
      <div v-if="hasFiles" class="bg-muted/50 rounded-lg p-4">
        <h4 class="font-medium text-foreground mb-2">Uploaded Files Summary</h4>
        <div class="space-y-1 text-sm text-muted-foreground">
          <div v-if="localFiles.script">
            <strong>Script:</strong> {{ localFiles.script.name }}
          </div>
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
    <div class="flex justify-between mt-8">
      <Button variant="outline" size="lg" @click="handlePrevious">
        <Icon name="mdi:arrow-left" class="h-4 w-4 mr-2" />
        Previous
      </Button>
      
      <Button 
        variant="primary" 
        size="lg" 
        @click="handleNext"
        class="px-8"
      >
        Continue
        <Icon name="mdi:arrow-right" class="h-4 w-4 ml-2" />
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
  return localFiles.value.script || 
         localFiles.value.referenceAudio || 
         (localFiles.value.additional && localFiles.value.additional.length > 0)
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
watch(localFiles, (newValue) => {
  emit('update:files', newValue)
}, { deep: true })

watch(premiumFeatures, (newValue) => {
  emit('update:premiumFeatures', newValue)
}, { deep: true })
</script>
