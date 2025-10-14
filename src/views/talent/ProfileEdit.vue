<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <VoiceActNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <AppBar :show-back="true" @back="$router.back()">
        <template #title>My Profile</template>
        <template #subtitle>Manage your professional information and voice samples</template>
        <template #actions>
          <ThemeToggle />
          <Button variant="outline" size="sm" @click="$router.back()"> Back </Button>
          <Button variant="primary" size="sm" @click="saveProfile"> Save Profile </Button>
        </template>
      </AppBar>

      <div class="px-4 py-8 pt-24 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl">
          <!-- Tab Navigation -->
          <div class="mb-8">
            <TabNavigation v-model="activeTab" :tabs="profileTabs" variant="underline" size="lg" />
          </div>

          <!-- Tab Content -->
          <div class="min-h-[600px]">
            <!-- Basic Information Tab -->
            <div v-if="activeTab === 'basic'" class="space-y-8">
              <Card class="p-6">
                <div class="mb-8 text-center">
                  <div
                    class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-500"
                  >
                    <Icon name="mdi:account" class="h-8 w-8 text-white" />
                  </div>
                  <h2 class="text-foreground mb-2 text-2xl font-semibold">Basic Information</h2>
                  <p class="text-muted-foreground">
                    Tell us about yourself so clients can find and connect with you.
                  </p>
                </div>

                <div class="mx-auto max-w-2xl space-y-6">
                  <!-- Avatar Upload -->
                  <div class="text-center">
                    <label class="text-foreground mb-4 block text-sm font-medium">
                      Profile Photo
                    </label>
                    <div class="relative inline-block">
                      <div
                        class="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-gray-200 dark:border-gray-600"
                      >
                        <img
                          v-if="profileData.avatarUrl"
                          :src="profileData.avatarUrl"
                          alt="Profile"
                          class="h-full w-full object-cover"
                        />
                        <div
                          v-else
                          class="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700"
                        >
                          <Icon name="mdi:account" class="text-muted-foreground h-8 w-8" />
                        </div>
                      </div>
                      <input
                        ref="avatarInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="handleAvatarUpload"
                      />
                      <button
                        type="button"
                        @click="triggerAvatarUpload"
                        class="absolute -right-1 -bottom-1 rounded-full bg-blue-500 p-2 text-white shadow-lg transition-colors hover:bg-blue-600"
                      >
                        <Icon name="mdi:camera" class="h-4 w-4" />
                      </button>
                    </div>
                    <p class="text-muted-foreground mt-2 text-xs">Click camera icon to upload</p>
                  </div>

                  <!-- Display Name -->
                  <div>
                    <label for="displayName" class="text-foreground mb-2 block text-sm font-medium">
                      What should we call you? *
                    </label>
                    <input
                      id="displayName"
                      v-model="profileData.displayName"
                      type="text"
                      required
                      placeholder="Your professional name"
                      class="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <!-- Location -->
                  <div>
                    <label for="location" class="text-foreground mb-2 block text-sm font-medium">
                      Where are you based? *
                    </label>
                    <input
                      id="location"
                      v-model="profileData.location"
                      type="text"
                      required
                      placeholder="City, Country"
                      class="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <!-- Bio -->
                  <div>
                    <label for="bio" class="text-foreground mb-2 block text-sm font-medium">
                      Tell us about yourself *
                    </label>
                    <textarea
                      id="bio"
                      v-model="profileData.bio"
                      required
                      rows="4"
                      placeholder="Share your voice acting experience, specialties, and what makes you unique..."
                      class="w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <p class="text-muted-foreground mt-1 text-xs">
                      {{ profileData.bio.length }}/500 characters
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <!-- Voice Types Tab -->
            <div v-if="activeTab === 'voice-types'" class="space-y-8">
              <Card class="p-6">
                <div class="mb-8 text-center">
                  <div
                    class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
                  >
                    <Icon name="mdi:microphone" class="h-8 w-8 text-white" />
                  </div>
                  <h2 class="text-foreground mb-2 text-2xl font-semibold">Voice Types</h2>
                  <p class="text-muted-foreground">
                    Select all the voice types you specialize in. This helps clients find the right
                    voice for their projects.
                  </p>
                </div>

                <div class="mx-auto max-w-4xl">
                  <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    <label
                      v-for="voiceType in voiceTypeOptions"
                      :key="voiceType.value"
                      class="group"
                    >
                      <input
                        v-model="profileData.voiceTypes"
                        :value="voiceType.value"
                        type="checkbox"
                        class="sr-only"
                      />
                      <div
                        class="cursor-pointer rounded-xl border-2 border-gray-200 p-4 transition-all duration-200 group-has-[:checked]:border-purple-500 group-has-[:checked]:bg-purple-50 hover:border-gray-400 dark:border-gray-600 dark:group-has-[:checked]:bg-purple-900/20 dark:hover:border-gray-500"
                      >
                        <div class="text-center">
                          <div
                            :class="`h-12 w-12 bg-gray-400 group-has-[:checked]:${getVoiceTypeColor(voiceType.value)} mx-auto mb-3 flex items-center justify-center rounded-lg transition-all duration-200`"
                          >
                            <Icon
                              :name="voiceType.icon"
                              class="h-6 w-6 text-white grayscale transition-all duration-200 group-has-[:checked]:grayscale-0"
                            />
                          </div>
                          <h4 class="text-foreground font-medium">{{ voiceType.label }}</h4>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div
                    v-if="profileData.voiceTypes.length > 0"
                    class="mt-6 rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20"
                  >
                    <p class="text-sm text-purple-700 dark:text-purple-300">
                      <Icon name="mdi:check-circle" class="mr-1 inline h-4 w-4" />
                      You've selected {{ profileData.voiceTypes.length }} voice type{{
                        profileData.voiceTypes.length > 1 ? 's' : ''
                      }}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <!-- Languages Tab -->
            <div v-if="activeTab === 'languages'" class="space-y-8">
              <Card class="p-6">
                <div class="mb-8 text-center">
                  <div
                    class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500"
                  >
                    <Icon name="mdi:translate" class="h-8 w-8 text-white" />
                  </div>
                  <h2 class="text-foreground mb-2 text-2xl font-semibold">Languages</h2>
                  <p class="text-muted-foreground">
                    Select all the languages you can perform voice work in. This opens up more
                    opportunities for you.
                  </p>
                </div>

                <div class="mx-auto max-w-4xl">
                  <div
                    class="grid max-h-96 grid-cols-1 gap-3 overflow-y-auto md:grid-cols-2 lg:grid-cols-3"
                  >
                    <label v-for="language in languageOptions" :key="language.value" class="group">
                      <input
                        v-model="profileData.languages"
                        :value="language.value"
                        type="checkbox"
                        class="sr-only"
                      />
                      <div
                        class="cursor-pointer rounded-lg border border-gray-200 p-3 transition-all duration-200 group-has-[:checked]:border-indigo-500 group-has-[:checked]:bg-indigo-50 hover:border-gray-400 dark:border-gray-600 dark:group-has-[:checked]:bg-indigo-900/20 dark:hover:border-gray-500"
                      >
                        <div class="flex items-center">
                          <div
                            :class="`h-6 w-8 bg-gray-400 group-has-[:checked]:${getLanguageColor(language.value)} mr-3 flex items-center justify-center rounded transition-all duration-200`"
                          >
                            <CountryFlag
                              :country-code="language.countryCode"
                              size="sm"
                              variant="rounded"
                              class="h-4 w-6 grayscale transition-all duration-200 group-has-[:checked]:grayscale-0"
                            />
                          </div>
                          <span class="text-foreground text-sm font-medium">{{
                            language.label
                          }}</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div
                    v-if="profileData.languages.length > 0"
                    class="mt-6 rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20"
                  >
                    <p class="text-sm text-indigo-700 dark:text-indigo-300">
                      <Icon name="mdi:check-circle" class="mr-1 inline h-4 w-4" />
                      You can perform in {{ profileData.languages.length }} language{{
                        profileData.languages.length > 1 ? 's' : ''
                      }}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <!-- Voice Samples Tab -->
            <div v-if="activeTab === 'voice-samples'" class="space-y-8">
              <Card class="p-6">
                <div class="mb-8 text-center">
                  <div
                    class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
                  >
                    <Icon name="mdi:upload" class="h-8 w-8 text-white" />
                  </div>
                  <h2 class="text-foreground mb-2 text-2xl font-semibold">Voice Samples</h2>
                  <p class="text-muted-foreground">
                    Upload samples for each voice type you selected. This showcases your range and
                    versatility!
                  </p>
                </div>

                <!-- Voice Type Upload Areas -->
                <div class="space-y-6">
                  <div
                    v-for="voiceType in selectedVoiceTypes"
                    :key="voiceType.value"
                    class="rounded-xl bg-gray-50 p-6 dark:bg-gray-800"
                  >
                    <div class="mb-4 flex items-center justify-between">
                      <div class="flex items-center space-x-3">
                        <div
                          :class="`h-10 w-10 ${getVoiceTypeColor(voiceType.value)} flex items-center justify-center rounded-lg`"
                        >
                          <Icon :name="voiceType.icon" class="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 class="text-foreground text-lg font-semibold">
                            {{ voiceType.label }}
                          </h4>
                          <p class="text-muted-foreground text-sm">
                            Upload a sample for {{ voiceType.label.toLowerCase() }}
                          </p>
                        </div>
                      </div>
                      <div v-if="voiceSamples[voiceType.value]" class="flex items-center space-x-2">
                        <Icon name="mdi:check-circle" class="h-5 w-5 text-green-500" />
                        <span class="text-sm text-green-600 dark:text-green-400">Uploaded</span>
                      </div>
                    </div>

                    <!-- Upload Area for this Voice Type -->
                    <div
                      class="upload-area cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-blue-400 dark:border-gray-600 dark:hover:border-blue-500"
                      :class="{
                        'drag-over border-blue-400 bg-blue-50 dark:bg-blue-900/20':
                          isDragOver === voiceType.value,
                        'border-green-400 bg-green-50 dark:bg-green-900/20':
                          voiceSamples[voiceType.value],
                      }"
                      @dragover.prevent="isDragOver = voiceType.value"
                      @dragleave.prevent="isDragOver = null"
                      @drop.prevent="handleFileDrop($event, voiceType.value)"
                      @click.stop="triggerFileInput(voiceType.value)"
                    >
                      <input
                        :id="`file-input-${voiceType.value}`"
                        :data-voice-type="voiceType.value"
                        type="file"
                        accept="audio/mp3,audio/wav,audio/ogg,audio/aac"
                        class="hidden"
                        @change="handleFileSelect($event, voiceType.value)"
                      />

                      <div v-if="!voiceSamples[voiceType.value]">
                        <Icon
                          name="mdi:cloud-upload"
                          class="text-muted-foreground mx-auto mb-4 h-12 w-12"
                        />
                        <h5 class="text-foreground mb-2 text-lg font-medium">
                          Drop your {{ voiceType.label.toLowerCase() }} sample here
                        </h5>
                        <p class="text-muted-foreground mb-4">or click to browse files</p>
                        <Button
                          variant="primary"
                          class="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
                          @click.stop="triggerFileInput(voiceType.value)"
                        >
                          <Icon name="mdi:folder-open" class="mr-2 h-4 w-4" />
                          Choose File
                        </Button>
                      </div>

                      <!-- File Preview -->
                      <div v-else class="space-y-4">
                        <div class="flex items-center justify-between">
                          <div class="min-w-0 flex-1">
                            <p class="text-foreground truncate text-sm font-medium">
                              {{ voiceSamples[voiceType.value].name }}
                            </p>
                            <p class="text-muted-foreground text-sm">
                              {{ formatFileSize(voiceSamples[voiceType.value].size) }}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            @click="removeFile(voiceType.value)"
                            class="text-red-500 hover:text-red-700"
                          >
                            <Icon name="mdi:delete" class="h-4 w-4" />
                          </Button>
                        </div>

                        <!-- Audio Preview -->
                        <div>
                          <audio
                            :src="voiceSamples[voiceType.value].previewUrl"
                            controls
                            class="w-full"
                          />
                        </div>

                        <!-- Sample Details -->
                        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label
                              :for="`title-${voiceType.value}`"
                              class="text-foreground mb-2 block text-sm font-medium"
                            >
                              Sample Title
                            </label>
                            <input
                              :id="`title-${voiceType.value}`"
                              v-model="voiceSamples[voiceType.value].title"
                              type="text"
                              :placeholder="`${voiceType.label} Demo`"
                              class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                          </div>

                          <div>
                            <label
                              :for="`description-${voiceType.value}`"
                              class="text-foreground mb-2 block text-sm font-medium"
                            >
                              Description
                            </label>
                            <input
                              :id="`description-${voiceType.value}`"
                              v-model="voiceSamples[voiceType.value].description"
                              type="text"
                              placeholder="Describe this sample..."
                              class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="text-muted-foreground mt-6 text-center text-sm">
                  <p>Supported formats: MP3, WAV, OGG, AAC</p>
                  <p>Maximum file size: 50MB per file</p>
                </div>
              </Card>
            </div>

            <!-- Pricing & Rates Tab -->
            <div v-if="activeTab === 'pricing'" class="space-y-8">
              <Card class="p-6">
                <div class="mb-8 text-center">
                  <div
                    class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500"
                  >
                    <Icon name="mdi:currency-usd" class="h-8 w-8 text-white" />
                  </div>
                  <h2 class="text-foreground mb-2 text-2xl font-semibold">Pricing & Rates</h2>
                  <p class="text-muted-foreground">
                    Define your rates for different types of voice work. This helps clients
                    understand your pricing structure.
                  </p>
                </div>

                <div class="space-y-8">
                  <!-- Rate Structure -->
                  <div class="rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
                    <h4 class="text-foreground mb-4 text-lg font-semibold">Rate Structure</h4>
                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label
                          for="hourlyRate"
                          class="text-foreground mb-2 block text-sm font-medium"
                        >
                          Hourly Rate (USD) *
                        </label>
                        <div class="relative">
                          <div
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                          >
                            <span class="text-muted-foreground text-sm">$</span>
                          </div>
                          <input
                            id="hourlyRate"
                            v-model="pricingData.hourlyRate"
                            type="number"
                            min="0"
                            step="5"
                            placeholder="50"
                            class="w-full rounded-lg border border-gray-300 py-3 pr-3 pl-8 text-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <p class="text-muted-foreground mt-1 text-xs">
                          Your standard hourly rate for voice work
                        </p>
                      </div>

                      <div>
                        <label
                          for="perWordRate"
                          class="text-foreground mb-2 block text-sm font-medium"
                        >
                          Per Word Rate (USD)
                        </label>
                        <div class="relative">
                          <div
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                          >
                            <span class="text-muted-foreground text-sm">$</span>
                          </div>
                          <input
                            id="perWordRate"
                            v-model="pricingData.perWordRate"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.25"
                            class="w-full rounded-lg border border-gray-300 py-3 pr-3 pl-8 text-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <p class="text-muted-foreground mt-1 text-xs">
                          Rate per word for audiobooks, e-learning
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Project Type Rates -->
                  <div class="rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
                    <h4 class="text-foreground mb-4 text-lg font-semibold">Project Type Rates</h4>
                    <div class="space-y-4">
                      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label
                            for="commercialRate"
                            class="text-foreground mb-2 block text-sm font-medium"
                          >
                            Commercial (30 seconds)
                          </label>
                          <div class="relative">
                            <div
                              class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                            >
                              <span class="text-muted-foreground text-sm">$</span>
                            </div>
                            <input
                              id="commercialRate"
                              v-model="pricingData.commercialRate"
                              type="number"
                              min="0"
                              step="25"
                              placeholder="500"
                              class="w-full rounded-md border border-gray-300 py-2 pr-3 pl-8 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            for="audiobookRate"
                            class="text-foreground mb-2 block text-sm font-medium"
                          >
                            Audiobook (per finished hour)
                          </label>
                          <div class="relative">
                            <div
                              class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                            >
                              <span class="text-muted-foreground text-sm">$</span>
                            </div>
                            <input
                              id="audiobookRate"
                              v-model="pricingData.audiobookRate"
                              type="number"
                              min="0"
                              step="25"
                              placeholder="200"
                              class="w-full rounded-md border border-gray-300 py-2 pr-3 pl-8 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            for="animationRate"
                            class="text-foreground mb-2 block text-sm font-medium"
                          >
                            Animation (per character)
                          </label>
                          <div class="relative">
                            <div
                              class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                            >
                              <span class="text-muted-foreground text-sm">$</span>
                            </div>
                            <input
                              id="animationRate"
                              v-model="pricingData.animationRate"
                              type="number"
                              min="0"
                              step="25"
                              placeholder="1000"
                              class="w-full rounded-md border border-gray-300 py-2 pr-3 pl-8 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            for="elearningRate"
                            class="text-foreground mb-2 block text-sm font-medium"
                          >
                            E-Learning (per hour)
                          </label>
                          <div class="relative">
                            <div
                              class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                            >
                              <span class="text-muted-foreground text-sm">$</span>
                            </div>
                            <input
                              id="elearningRate"
                              v-model="pricingData.elearningRate"
                              type="number"
                              min="0"
                              step="25"
                              placeholder="300"
                              class="w-full rounded-md border border-gray-300 py-2 pr-3 pl-8 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Additional Information -->
                  <div>
                    <label
                      for="pricingNotes"
                      class="text-foreground mb-2 block text-sm font-medium"
                    >
                      Additional Pricing Notes
                    </label>
                    <textarea
                      id="pricingNotes"
                      v-model="pricingData.notes"
                      rows="3"
                      placeholder="e.g., Rush jobs +50%, Weekend work +25%, Minimum project fee $100..."
                      class="w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import CountryFlag from '@/components/atoms/CountryFlag.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import TabNavigation from '@/components/molecules/TabNavigation.vue'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { success, error } = useToast()

// Tab management
const activeTab = ref('basic')

// Tab definitions
const profileTabs = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'voice-types', label: 'Voice Types' },
  { id: 'languages', label: 'Languages' },
  { id: 'voice-samples', label: 'Voice Samples' },
  { id: 'pricing', label: 'Pricing & Rates' },
]

// Profile data structure (matching onboarding)
const profileData = reactive({
  displayName: '',
  bio: '',
  location: '',
  avatarUrl: '',
  voiceTypes: [] as string[],
  languages: [] as string[],
})

// Voice samples data
const voiceSamples = reactive<Record<string, any>>({})
const isDragOver = ref<string | null>(null)
const avatarInput = ref<HTMLInputElement>()

// Pricing data
const pricingData = reactive({
  hourlyRate: '',
  perWordRate: '',
  commercialRate: '',
  audiobookRate: '',
  animationRate: '',
  elearningRate: '',
  notes: '',
})

// Voice type options (same as onboarding)
const voiceTypeOptions = [
  { value: 'narrator', label: 'Narrator', icon: 'mdi:book-open-variant', color: 'bg-blue-500' },
  { value: 'character', label: 'Character', icon: 'mdi:account-voice', color: 'bg-purple-500' },
  { value: 'announcer', label: 'Announcer', icon: 'mdi:bullhorn', color: 'bg-red-500' },
  { value: 'commercial', label: 'Commercial', icon: 'mdi:tv', color: 'bg-green-500' },
  { value: 'audiobook', label: 'Audiobook', icon: 'mdi:book-music', color: 'bg-indigo-500' },
  { value: 'podcast', label: 'Podcast', icon: 'mdi:podcast', color: 'bg-pink-500' },
  { value: 'animation', label: 'Animation', icon: 'mdi:animation', color: 'bg-orange-500' },
  { value: 'video_game', label: 'Video Game', icon: 'mdi:gamepad-variant', color: 'bg-teal-500' },
  { value: 'documentary', label: 'Documentary', icon: 'mdi:filmstrip', color: 'bg-gray-500' },
  { value: 'e-learning', label: 'E-Learning', icon: 'mdi:school', color: 'bg-yellow-500' },
]

// Language options (same as onboarding)
const languageOptions = [
  // English variants
  { value: 'English (US)', label: 'English (US)', countryCode: 'us', color: 'bg-blue-500' },
  { value: 'English (UK)', label: 'English (UK)', countryCode: 'gb', color: 'bg-red-500' },
  { value: 'English (AU)', label: 'English (Australia)', countryCode: 'au', color: 'bg-green-500' },
  { value: 'English (CA)', label: 'English (Canada)', countryCode: 'ca', color: 'bg-red-600' },

  // ASEAN Countries
  { value: 'Vietnamese', label: 'Vietnamese', countryCode: 'vn', color: 'bg-red-500' },
  { value: 'Thai', label: 'Thai', countryCode: 'th', color: 'bg-red-600' },
  { value: 'Indonesian', label: 'Indonesian', countryCode: 'id', color: 'bg-red-500' },
  { value: 'Malay', label: 'Malay', countryCode: 'my', color: 'bg-blue-500' },
  { value: 'Filipino', label: 'Filipino', countryCode: 'ph', color: 'bg-blue-600' },
  { value: 'Burmese', label: 'Burmese', countryCode: 'mm', color: 'bg-yellow-500' },
  { value: 'Khmer', label: 'Khmer', countryCode: 'kh', color: 'bg-blue-500' },
  { value: 'Lao', label: 'Lao', countryCode: 'la', color: 'bg-red-500' },
  { value: 'Tamil', label: 'Tamil', countryCode: 'lk', color: 'bg-orange-500' },
  { value: 'Bengali', label: 'Bengali', countryCode: 'bd', color: 'bg-green-500' },

  // Other major languages
  { value: 'Spanish', label: 'Spanish', countryCode: 'es', color: 'bg-red-500' },
  { value: 'French', label: 'French', countryCode: 'fr', color: 'bg-blue-500' },
  { value: 'German', label: 'German', countryCode: 'de', color: 'bg-yellow-500' },
  { value: 'Italian', label: 'Italian', countryCode: 'it', color: 'bg-green-500' },
  { value: 'Portuguese', label: 'Portuguese', countryCode: 'pt', color: 'bg-green-600' },
  { value: 'Russian', label: 'Russian', countryCode: 'ru', color: 'bg-blue-500' },
  { value: 'Japanese', label: 'Japanese', countryCode: 'jp', color: 'bg-red-500' },
  { value: 'Korean', label: 'Korean', countryCode: 'kr', color: 'bg-blue-500' },
  {
    value: 'Chinese (Mandarin)',
    label: 'Chinese (Mandarin)',
    countryCode: 'cn',
    color: 'bg-red-500',
  },
  {
    value: 'Chinese (Cantonese)',
    label: 'Chinese (Cantonese)',
    countryCode: 'hk',
    color: 'bg-red-500',
  },
  { value: 'Arabic', label: 'Arabic', countryCode: 'sa', color: 'bg-green-500' },
  { value: 'Hindi', label: 'Hindi', countryCode: 'in', color: 'bg-orange-500' },
]

// Computed properties
const selectedVoiceTypes = computed(() => {
  return voiceTypeOptions.filter((vt) => profileData.voiceTypes.includes(vt.value))
})

// Helper functions
const getVoiceTypeColor = (voiceTypeValue: string) => {
  const voiceType = voiceTypeOptions.find((vt) => vt.value === voiceTypeValue)
  return voiceType?.color || 'bg-gray-500'
}

const getLanguageColor = (languageValue: string) => {
  const language = languageOptions.find((lang) => lang.value === languageValue)
  return language?.color || 'bg-gray-500'
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Avatar upload functions
const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      error('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      error('Image file must be smaller than 5MB')
      return
    }

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      profileData.avatarUrl = e.target?.result as string
      success('Avatar updated successfully!')
    }
    reader.readAsDataURL(file)
  }
}

// Voice sample upload functions
const triggerFileInput = (voiceType: string) => {
  console.log('Triggering file input for voice type:', voiceType)

  // Try to find the input by ID first
  let input = document.getElementById(`file-input-${voiceType}`) as HTMLInputElement

  if (!input) {
    // Fallback: find by data attribute
    input = document.querySelector(`input[data-voice-type="${voiceType}"]`) as HTMLInputElement
  }

  if (!input) {
    // Last resort: find by accept attribute and voice type
    const inputs = document.querySelectorAll('input[type="file"][accept*="audio"]')
    input = Array.from(inputs).find(
      (inp) => inp.getAttribute('data-voice-type') === voiceType,
    ) as HTMLInputElement
  }

  console.log('Found input element:', input)
  if (input) {
    input.click()
  } else {
    console.error('Could not find file input for voice type:', voiceType)
    error('Could not find file input. Please try again.')
  }
}

const handleFileSelect = (event: Event, voiceType: string) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    processFile(file, voiceType)
  }
}

const handleFileDrop = (event: DragEvent, voiceType: string) => {
  isDragOver.value = null
  const file = event.dataTransfer?.files[0]

  if (file) {
    processFile(file, voiceType)
  }
}

const processFile = (file: File, voiceType: string) => {
  console.log('Processing file:', file.name, 'for voice type:', voiceType)

  // Validate file
  const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/mpeg']
  const maxSize = 50 * 1024 * 1024 // 50MB

  if (!allowedTypes.includes(file.type)) {
    console.log('Invalid file type:', file.type)
    error(`Please select a valid audio file. File type "${file.type}" is not supported.`)
    return
  }

  if (file.size > maxSize) {
    error('File size must be less than 50MB')
    return
  }

  // Create preview URL
  const previewUrl = URL.createObjectURL(file)

  // Store the file data
  voiceSamples[voiceType] = {
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    previewUrl,
    title: '',
    description: '',
  }

  console.log('File processed successfully:', voiceSamples[voiceType])
  success(`Sample uploaded for ${voiceTypeOptions.find((vt) => vt.value === voiceType)?.label}`)
}

const removeFile = (voiceType: string) => {
  if (voiceSamples[voiceType]?.previewUrl) {
    URL.revokeObjectURL(voiceSamples[voiceType].previewUrl)
  }
  delete voiceSamples[voiceType]
  success('Sample removed')
}

// Load existing data on mount
onMounted(() => {
  // Try to load from localStorage (from onboarding)
  const savedData = localStorage.getItem('voiceact-onboarding-data')
  if (savedData) {
    try {
      const data = JSON.parse(savedData)
      if (data.profileData) {
        Object.assign(profileData, data.profileData)
      }
      if (data.pricingData) {
        Object.assign(pricingData, data.pricingData)
      }
      if (data.voiceSamples) {
        Object.assign(voiceSamples, data.voiceSamples)
      }
    } catch (err) {
      console.error('Error loading saved data:', err)
    }
  }
})

const saveProfile = () => {
  try {
    // Validate required fields
    if (!profileData.displayName || !profileData.bio || !profileData.location) {
      error('Please fill in all required fields')
      return
    }

    if (profileData.voiceTypes.length === 0) {
      error('Please select at least one voice type')
      return
    }

    if (profileData.languages.length === 0) {
      error('Please select at least one language')
      return
    }

    // Save to localStorage (in real app, this would be sent to API)
    const profileUpdate = {
      profileData,
      pricingData,
      voiceSamples,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem('voiceact-profile-data', JSON.stringify(profileUpdate))
    success('Profile updated successfully!')
    router.push('/')
  } catch {
    error('Failed to save profile. Please try again.')
  }
}
</script>

<style scoped>
/* Upload area animations */
.upload-area {
  transition: all 0.3s ease;
}

.upload-area.drag-over {
  transform: scale(1.02);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Icon animations */
.icon-bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* Button animations */
.onboarding-button {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.onboarding-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.onboarding-button:active {
  transform: translateY(0);
}

/* Card hover effects */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Smooth transitions for all interactive elements */
* {
  transition: all 0.2s ease;
}

/* Focus states */
input:focus,
textarea:focus {
  transform: scale(1.02);
}

/* Checkbox and radio animations */
input[type='checkbox'],
input[type='radio'] {
  transition: all 0.2s ease;
}

input[type='checkbox']:checked,
input[type='radio']:checked {
  transform: scale(1.1);
}

/* Pulse animation for loading states */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

.pulse {
  animation: pulse 2s infinite;
}

/* Spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spin {
  animation: spin 1s linear infinite;
}

/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* Scale in animation */
@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

.scale-in {
  animation: scaleIn 0.3s ease-out;
}
</style>
