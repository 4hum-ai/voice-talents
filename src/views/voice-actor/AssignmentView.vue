<template>
  <div class="min-h-screen bg-background flex">
    <!-- Navigation Sidebar -->
    <VoiceActNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <div class="bg-card shadow-sm border-b border-border">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
              <Button variant="ghost" size="sm" @click="$router.back()" class="mr-4">
                <ArrowLeftIcon class="h-4 w-4" />
              </Button>
              <div>
                <h1 class="text-2xl font-bold text-foreground">
                  {{ assignment?.title || 'Assignment' }}
                </h1>
                <p class="text-sm text-muted-foreground">
                  Assignment details and submission
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <Button variant="outline" size="sm" @click="viewProject">
                <FolderOpenIcon class="h-4 w-4 mr-2" />
                View Project
              </Button>
              <Button variant="primary" size="sm" @click="submitAssignment" v-if="canSubmit">
                <UploadIcon class="h-4 w-4 mr-2" />
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-4xl mx-auto">
          <!-- Assignment Overview -->
          <Card class="mb-8">
            <div class="p-6">
              <div class="flex items-start justify-between mb-6">
                <div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Assignment Overview
                  </h2>
                  <StatusBadge
                    :status="assignment?.status || 'pending'"
                    :variant="getStatusVariant(assignment?.status)"
                  />
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-600 dark:text-gray-300">Due Date</p>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ formatDate(assignment?.dueDate) }}
                  </p>
                </div>
              </div>
              
              <div class="space-y-4">
                <div v-if="assignment?.description">
                  <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </h3>
                  <p class="text-gray-900 dark:text-white">
                    {{ assignment.description }}
                  </p>
                </div>
                
                <div v-if="assignment?.recordingInstructions">
                  <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recording Instructions
                  </h3>
                  <p class="text-gray-900 dark:text-white">
                    {{ assignment.recordingInstructions }}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <!-- Reference Materials -->
          <Card class="mb-8" v-if="assignment?.attachedMedia?.length">
            <div class="p-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Reference Materials
              </h2>
              
              <div class="space-y-3">
                <div
                  v-for="media in assignment.attachedMedia"
                  :key="media.id"
                  class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div class="flex items-center space-x-3">
                    <FileIcon class="h-5 w-5 text-gray-400" />
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ media.title }}
                      </p>
                      <p class="text-xs text-gray-600 dark:text-gray-300">
                        {{ media.fileType }} • {{ formatFileSize(media.fileSize || 0) }}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" @click="downloadFile(media)">
                    <DownloadIcon class="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <!-- Submission -->
          <Card class="mb-8">
            <div class="p-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Submit Your Work
              </h2>
              
              <div class="space-y-4">
                <FileInput
                  v-model="submissionFile"
                  accept="audio/*"
                  label="Upload Audio File"
                  description="Upload your completed voice recording"
                  @change="handleFileChange"
                />
                
                <Textarea
                  v-model="submissionNotes"
                  label="Submission Notes"
                  placeholder="Add any notes about your submission..."
                  :rows="3"
                />
                
                <div class="flex items-center space-x-4">
                  <Button
                    variant="primary"
                    @click="submitAssignment"
                    :disabled="!submissionFile"
                  >
                    <UploadIcon class="h-4 w-4 mr-2" />
                    Submit Assignment
                  </Button>
                  <Button variant="outline" @click="saveDraft">
                    Save as Draft
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <!-- Previous Submissions -->
          <Card v-if="assignment?.submittedTakes?.length">
            <div class="p-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Previous Submissions
              </h2>
              
              <div class="space-y-3">
                <div
                  v-for="take in assignment.submittedTakes"
                  :key="take.id"
                  class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div class="flex items-center space-x-3">
                    <MicrophoneIcon class="h-5 w-5 text-gray-400" />
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ take.title }}
                      </p>
                      <p class="text-xs text-gray-600 dark:text-gray-300">
                        Submitted {{ formatDate(take.uploadDate) }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Button variant="outline" size="sm" @click="playTake(take)">
                      <PlayIcon class="h-4 w-4 mr-2" />
                      Play
                    </Button>
                    <Button variant="outline" size="sm" @click="downloadTake(take)">
                      <DownloadIcon class="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import FileInput from '@/components/atoms/FileInput.vue'
import Textarea from '@/components/atoms/Textarea.vue'
import ArrowLeftIcon from '~icons/mdi/arrow-left'
import FolderOpenIcon from '~icons/mdi/folder-open'
import UploadIcon from '~icons/mdi/upload'
import FileIcon from '~icons/mdi/file'
import DownloadIcon from '~icons/mdi/download'
import MicrophoneIcon from '~icons/mdi/microphone'
import PlayIcon from '~icons/mdi/play'
import type { ProjectAssignment } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'

const route = useRoute()
const router = useRouter()

const projectId = computed(() => route.params.id as string)
const assignmentId = computed(() => route.params.assignmentId as string)
const assignment = ref<ProjectAssignment | null>(null)

const submissionFile = ref<File | null>(null)
const submissionNotes = ref('')

const canSubmit = computed(() => {
  return assignment.value?.status === 'in-progress' || assignment.value?.status === 'pending'
})

onMounted(() => {
  // In real app, this would fetch from API
  const project = mockData.projects.find(p => p.id === projectId.value)
  if (project) {
    assignment.value = project.assignments?.find(a => a.id === assignmentId.value) || null
  }
})

const getStatusVariant = (status?: string) => {
  switch (status) {
    case 'completed': return 'success'
    case 'in-progress': return 'warning'
    case 'pending': return 'secondary'
    case 'approved': return 'success'
    case 'revisions-requested': return 'warning'
    default: return 'secondary'
  }
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString()
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleFileChange = (file: File) => {
  submissionFile.value = file
}

const viewProject = () => {
  router.push(`/projects/${projectId.value}`)
}

const submitAssignment = () => {
  if (!submissionFile.value || !assignment.value) return
  
  // In real app, this would submit to API
  console.log('Submitting assignment:', {
    assignmentId: assignment.value.id,
    file: submissionFile.value,
    notes: submissionNotes.value
  })
  
  router.push(`/projects/${projectId.value}`)
}

const saveDraft = () => {
  // In real app, this would save as draft
  console.log('Saving draft for assignment:', assignment.value?.id)
}

const downloadFile = (media: any) => {
  // In real app, this would download the file
  console.log('Downloading file:', media.id)
}

const playTake = (take: any) => {
  // In real app, this would play the audio
  console.log('Playing take:', take.id)
}

const downloadTake = (take: any) => {
  // In real app, this would download the take
  console.log('Downloading take:', take.id)
}
</script>

