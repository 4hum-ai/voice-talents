<template>
  <div v-if="showOnboarding" class="bg-background fixed inset-0 z-50 overflow-hidden">
    <!-- Top Navigation Bar -->
    <div
      class="border-border bg-card/95 absolute top-0 right-0 left-0 z-10 border-b backdrop-blur-sm"
    >
      <div class="flex items-center justify-between px-6 py-4">
        <!-- Left: Previous Button -->
        <Button v-if="currentStep > 1" variant="outline" size="md" @click="previousStep">
          <div class="flex items-center gap-2">
            <Icon name="mdi:chevron-left" class="h-4 w-4" />
            <span>Previous</span>
          </div>
        </Button>
        <div v-else class="w-20" />

        <!-- Center: Progress -->
        <div class="flex items-center space-x-4">
          <div class="text-muted-foreground text-sm">
            Step {{ currentStep }} of {{ totalSteps }}
          </div>
          <div class="bg-muted h-2 w-32 rounded-full">
            <div
              class="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
              :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
            />
          </div>
          <div class="text-muted-foreground text-sm">
            {{ Math.round((currentStep / totalSteps) * 100) }}%
          </div>
        </div>

        <!-- Right: Close and Next/Skip -->
        <div class="flex items-center space-x-3">
          <Button
            v-if="currentStep < totalSteps"
            variant="primary"
            :disabled="!canProceedToNext"
            @click="nextStep"
            class="onboarding-button"
          >
            Next
            <Icon name="mdi:chevron-right" class="ml-2 h-4 w-4" />
          </Button>
          <Button v-else variant="primary" @click="completeOnboarding" class="onboarding-button">
            Get Started
            <Icon name="mdi:rocket-launch" class="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            @click="closeOnboarding"
            class="text-muted-foreground hover:text-foreground"
          >
            <Icon name="mdi:close" class="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="h-full overflow-y-auto pt-20">
      <div class="mx-auto max-w-4xl px-6 py-8">
        <!-- Content -->
        <div class="px-8 py-6">
          <Transition :name="transitionName" mode="out-in">
            <div :key="currentStep" class="space-y-8">
              <!-- Step 1: Welcome -->
              <div v-if="currentStep === 1" class="space-y-8 text-center">
                <div
                  class="icon-bounce mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600"
                >
                  <Icon name="mdi:microphone" class="h-16 w-16 text-white" />
                </div>
                <div>
                  <h3 class="text-foreground mb-4 text-3xl font-bold">Welcome to VoiceAct! 🎙️</h3>
                  <p class="text-muted-foreground mx-auto max-w-2xl text-lg">
                    Let's get you set up for success! We'll help you create a professional profile
                    that showcases your voice acting talent.
                  </p>
                </div>
                <div class="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-3">
                  <div class="p-4 text-center">
                    <div
                      class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500"
                    >
                      <Icon name="mdi:account" class="h-6 w-6 text-white" />
                    </div>
                    <h4 class="text-foreground mb-1 font-semibold">Profile Setup</h4>
                    <p class="text-muted-foreground text-sm">Create your professional profile</p>
                  </div>
                  <div class="p-4 text-center">
                    <div
                      class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500"
                    >
                      <Icon name="mdi:upload" class="h-6 w-6 text-white" />
                    </div>
                    <h4 class="text-foreground mb-1 font-semibold">Voice Samples</h4>
                    <p class="text-muted-foreground text-sm">Upload your best work</p>
                  </div>
                  <div class="p-4 text-center">
                    <div
                      class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500"
                    >
                      <Icon name="mdi:currency-usd" class="h-6 w-6 text-white" />
                    </div>
                    <h4 class="text-foreground mb-1 font-semibold">Set Rates</h4>
                    <p class="text-muted-foreground text-sm">Define your pricing</p>
                  </div>
                </div>
              </div>

              <!-- Step 2: Basic Info -->
              <div v-if="currentStep === 2" class="space-y-8">
                <div class="text-center">
                  <div
                    class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-500"
                  >
                    <Icon name="mdi:account" class="h-8 w-8 text-white" />
                  </div>
                  <h3 class="text-foreground mb-2 text-2xl font-semibold">
                    Let's Start with the Basics
                  </h3>
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
                        <div v-else class="bg-muted flex h-full w-full items-center justify-center">
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
                    <p class="dark:text-muted-foreground mt-2 text-xs text-gray-500">
                      Click camera icon to upload
                    </p>
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
                      class="border-border bg-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary w-full rounded-lg border px-4 py-3 text-lg shadow-sm focus:ring-2 focus:outline-none"
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
                      class="border-border bg-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary w-full rounded-lg border px-4 py-3 text-lg shadow-sm focus:ring-2 focus:outline-none"
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
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                    <p class="dark:text-muted-foreground mt-1 text-xs text-gray-500">
                      {{ profileData.bio.length }}/500 characters
                    </p>
                  </div>
                </div>
              </div>

              <!-- Step 3: Voice Types -->
              <div v-if="currentStep === 3" class="space-y-8">
                <div class="text-center">
                  <div
                    class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
                  >
                    <Icon name="mdi:microphone" class="h-8 w-8 text-white" />
                  </div>
                  <h3 class="text-foreground mb-2 text-2xl font-semibold">
                    What's Your Voice Type?
                  </h3>
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
                          <h4 class="text-foreground font-medium">
                            {{ voiceType.label }}
                          </h4>
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
              </div>

              <!-- Step 4: Languages -->
              <div v-if="currentStep === 4" class="space-y-8">
                <div class="text-center">
                  <div
                    class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500"
                  >
                    <Icon name="mdi:translate" class="h-8 w-8 text-white" />
                  </div>
                  <h3 class="text-foreground mb-2 text-2xl font-semibold">
                    What Languages Do You Speak?
                  </h3>
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
              </div>

              <!-- Step 5: Upload Voice Samples -->
              <div v-if="currentStep === 5" class="space-y-8">
                <div class="text-center">
                  <div
                    class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
                  >
                    <Icon name="mdi:upload" class="h-8 w-8 text-white" />
                  </div>
                  <h3 class="text-foreground mb-2 text-2xl font-semibold">Upload Voice Samples</h3>
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
                          class="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500"
                        >
                          <Icon name="mdi:microphone" class="h-5 w-5 text-white" />
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
                        <div class="flex items-center space-x-4">
                          <div class="flex-shrink-0">
                            <Icon name="mdi:music-note" class="h-8 w-8 text-purple-500" />
                          </div>
                          <div class="min-w-0 flex-1">
                            <p class="text-foreground truncate text-sm font-medium">
                              {{ voiceSamples[voiceType.value].name }}
                            </p>
                            <p class="dark:text-muted-foreground text-sm text-gray-500">
                              {{ formatFileSize(voiceSamples[voiceType.value].size) }}
                            </p>
                          </div>
                          <div class="flex-shrink-0">
                            <Button variant="ghost" size="sm" @click="removeFile(voiceType.value)">
                              <Icon name="mdi:close" class="h-4 w-4" />
                            </Button>
                          </div>
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
                              class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
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
                              class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="dark:text-muted-foreground text-center text-sm text-gray-500">
                  <p>Supported formats: MP3, WAV, OGG, AAC</p>
                  <p>Maximum file size: 50MB per file</p>
                </div>
              </div>

              <!-- Step 6: Pricing & Rates -->
              <div v-if="currentStep === 6" class="space-y-8">
                <div class="text-center">
                  <div
                    class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500"
                  >
                    <Icon name="mdi:currency-usd" class="h-8 w-8 text-white" />
                  </div>
                  <h3 class="text-foreground mb-2 text-2xl font-semibold">
                    Set Your Pricing & Rates
                  </h3>
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
                            <span class="dark:text-muted-foreground text-sm text-gray-500">$</span>
                          </div>
                          <input
                            id="hourlyRate"
                            v-model="pricingData.hourlyRate"
                            type="number"
                            min="0"
                            step="5"
                            placeholder="50"
                            class="w-full rounded-lg border border-gray-300 bg-white py-3 pr-3 pl-8 text-lg text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                          />
                        </div>
                        <p class="dark:text-muted-foreground mt-1 text-xs text-gray-500">
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
                            <span class="dark:text-muted-foreground text-sm text-gray-500">$</span>
                          </div>
                          <input
                            id="perWordRate"
                            v-model="pricingData.perWordRate"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.25"
                            class="w-full rounded-lg border border-gray-300 bg-white py-3 pr-3 pl-8 text-lg text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                          />
                        </div>
                        <p class="dark:text-muted-foreground mt-1 text-xs text-gray-500">
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
                              <span class="dark:text-muted-foreground text-sm text-gray-500"
                                >$</span
                              >
                            </div>
                            <input
                              id="commercialRate"
                              v-model="pricingData.commercialRate"
                              type="number"
                              min="0"
                              step="25"
                              placeholder="500"
                              class="w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-8 text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
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
                              <span class="dark:text-muted-foreground text-sm text-gray-500"
                                >$</span
                              >
                            </div>
                            <input
                              id="audiobookRate"
                              v-model="pricingData.audiobookRate"
                              type="number"
                              min="0"
                              step="25"
                              placeholder="200"
                              class="w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-8 text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
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
                              <span class="dark:text-muted-foreground text-sm text-gray-500"
                                >$</span
                              >
                            </div>
                            <input
                              id="animationRate"
                              v-model="pricingData.animationRate"
                              type="number"
                              min="0"
                              step="25"
                              placeholder="1000"
                              class="w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-8 text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
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
                              <span class="dark:text-muted-foreground text-sm text-gray-500"
                                >$</span
                              >
                            </div>
                            <input
                              id="elearningRate"
                              v-model="pricingData.elearningRate"
                              type="number"
                              min="0"
                              step="25"
                              placeholder="300"
                              class="w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-8 text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
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
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              <!-- Step 7: Completion -->
              <div v-if="currentStep === 7" class="space-y-8 text-center">
                <div
                  class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-500"
                >
                  <Icon name="mdi:check" class="h-12 w-12 text-white" />
                </div>
                <div>
                  <h3 class="text-foreground mb-4 text-3xl font-bold">Welcome to VoiceAct! 🎉</h3>
                  <p class="text-muted-foreground mx-auto max-w-2xl text-lg">
                    Your profile is complete and you're ready to start your voice acting journey.
                    Let's get you connected with amazing opportunities!
                  </p>
                </div>

                <div class="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
                  <div class="rounded-xl bg-blue-50 p-6 dark:bg-blue-900/20">
                    <div
                      class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500"
                    >
                      <Icon name="mdi:rocket-launch" class="h-6 w-6 text-white" />
                    </div>
                    <h4 class="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                      Ready to Launch
                    </h4>
                    <p class="text-sm text-blue-800 dark:text-blue-200">
                      Your profile is live and discoverable by clients
                    </p>
                  </div>

                  <div class="rounded-xl bg-purple-50 p-6 dark:bg-purple-900/20">
                    <div
                      class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500"
                    >
                      <Icon name="mdi:account-search" class="h-6 w-6 text-white" />
                    </div>
                    <h4 class="mb-2 font-semibold text-purple-900 dark:text-purple-100">
                      Find Opportunities
                    </h4>
                    <p class="text-sm text-purple-800 dark:text-purple-200">
                      Browse casting calls and apply for projects
                    </p>
                  </div>

                  <div class="rounded-xl bg-green-50 p-6 dark:bg-green-900/20">
                    <div
                      class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500"
                    >
                      <Icon name="mdi:chart-line" class="h-6 w-6 text-white" />
                    </div>
                    <h4 class="mb-2 font-semibold text-green-900 dark:text-green-100">
                      Track Progress
                    </h4>
                    <p class="text-sm text-green-800 dark:text-green-200">
                      Monitor your career growth and earnings
                    </p>
                  </div>

                  <div class="rounded-xl bg-orange-50 p-6 dark:bg-orange-900/20">
                    <div
                      class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500"
                    >
                      <Icon name="mdi:account-group" class="h-6 w-6 text-white" />
                    </div>
                    <h4 class="mb-2 font-semibold text-orange-900 dark:text-orange-100">
                      Build Network
                    </h4>
                    <p class="text-sm text-orange-800 dark:text-orange-200">
                      Connect with other voice actors and clients
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useToast } from '@/composables/useToast'
import { useOnboarding } from '@/composables/useOnboarding'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import CountryFlag from '@/components/atoms/CountryFlag.vue'

interface Props {
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
})

const emit = defineEmits<{
  complete: []
  skip: []
  close: []
}>()

const { success, error } = useToast()
const { completeTalentOnboarding } = useOnboarding()

// State
const currentStep = ref(1)
const totalSteps = 7
const transitionName = ref('slide-left')

// Profile data
const profileData = reactive({
  displayName: '',
  bio: '',
  location: '',
  avatarUrl: '',
  voiceTypes: [] as string[],
  languages: [] as string[],
})

const avatarInput = ref<HTMLInputElement | null>(null)

// Voice samples data - one per voice type
const voiceSamples = reactive<
  Record<
    string,
    {
      file: File
      name: string
      size: number
      previewUrl: string
      title: string
      description: string
    }
  >
>({})

const isDragOver = ref<string | null>(null)

// Preferences data
const preferencesData = reactive({
  notifications: {
    newProjects: true,
    castingCalls: true,
    messages: true,
    deadlines: true,
  },
  privacy: {
    profilePublic: true,
    showContactInfo: false,
    allowDirectMessages: true,
  },
  audioQuality: 'professional',
})

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

// Options
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
  { value: 'Malay', label: 'Malay', countryCode: 'my', color: 'bg-blue-600' },
  { value: 'Filipino', label: 'Filipino', countryCode: 'ph', color: 'bg-blue-500' },
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
  { value: 'Russian', label: 'Russian', countryCode: 'ru', color: 'bg-blue-500' },
  { value: 'Hindi', label: 'Hindi', countryCode: 'in', color: 'bg-orange-500' },
]

// Computed
const showOnboarding = computed(() => props.show)

const selectedVoiceTypes = computed(() => {
  return voiceTypeOptions.filter((option) => profileData.voiceTypes.includes(option.value))
})

const canProceedToNext = computed(() => {
  switch (currentStep.value) {
    case 1:
      return true // Welcome step
    case 2:
      return profileData.displayName && profileData.bio && profileData.location
    case 3:
      return profileData.voiceTypes.length > 0
    case 4:
      return profileData.languages.length > 0
    case 5:
      // Allow proceeding if at least one voice type has a sample uploaded
      return Object.keys(voiceSamples).length > 0
    case 6:
      // Require at least hourly rate to be set
      return pricingData.hourlyRate && pricingData.hourlyRate !== ''
    case 7:
      return true // Completion
    default:
      return false
  }
})

// Methods
const getVoiceTypeColor = (voiceTypeValue: string) => {
  const voiceType = voiceTypeOptions.find((vt) => vt.value === voiceTypeValue)
  return voiceType?.color || 'bg-gray-500'
}

const getLanguageColor = (languageValue: string) => {
  const language = languageOptions.find((lang) => lang.value === languageValue)
  return language?.color || 'bg-gray-500'
}

const nextStep = () => {
  if (currentStep.value < totalSteps && canProceedToNext.value) {
    transitionName.value = 'slide-left'
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    transitionName.value = 'slide-right'
    currentStep.value--
  }
}

const completeOnboarding = async () => {
  try {
    // Save all onboarding data
    const onboardingData = {
      profile: profileData,
      voiceSamples: voiceSamples,
      preferences: preferencesData,
      pricing: pricingData,
      completedAt: new Date().toISOString(),
    }

    // Use the new onboarding system
    completeTalentOnboarding(onboardingData)

    success('Welcome to VoiceAct! Your profile is ready to go.')
    emit('complete')
  } catch {
    error('Failed to complete onboarding. Please try again.')
  }
}

const closeOnboarding = () => {
  emit('close')
}

// const navigateToFeature = (route: string) => {
//   router.push(route)
// }

// Profile methods

// Avatar upload methods
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
    }
    reader.readAsDataURL(file)
  }
}

// Voice sample upload methods
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
    console.error('Could not find input element for voice type:', voiceType)
    console.log('Available inputs:', document.querySelectorAll('input[type="file"]'))
    error('File input not found. Please try refreshing the page.')
  }
}

const handleFileSelect = (event: Event, voiceType: string) => {
  console.log('File selected for voice type:', voiceType)
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  console.log('Selected file:', file)
  if (file) {
    processFile(file, voiceType)
  } else {
    console.log('No file selected')
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
    previewUrl,
    title: file.name.replace(/\.[^/.]+$/, ''),
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
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
/* Enhanced slide transitions */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  transform: translateX(100%) scale(0.95);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%) scale(1.05);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-100%) scale(0.95);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%) scale(1.05);
  opacity: 0;
}

/* Form field animations */
.form-field-enter-active {
  transition: all 0.3s ease-out;
}

.form-field-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

/* Button hover effects */
.onboarding-button {
  transition: all 0.2s ease;
  transform: translateY(0);
}

.onboarding-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.onboarding-button:active {
  transform: translateY(0);
}

/* Progress bar animation */
.progress-bar {
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* File upload area animations */
.upload-area {
  transition: all 0.3s ease;
}

.upload-area:hover {
  transform: scale(1.02);
}

.upload-area.drag-over {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

/* Skill tag animations */
.skill-tag {
  transition: all 0.2s ease;
}

.skill-tag:hover {
  transform: scale(1.05);
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

/* Card hover effects */
.feature-card {
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
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

/* Pulse animation for important elements */
.pulse {
  animation: pulse 2s infinite;
}

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

/* Loading spinner animation */
.upload-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Fade in animation for content */
.fade-in {
  animation: fadeIn 0.6s ease-out;
}

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

/* Success checkmark animation */
.checkmark {
  animation: checkmark 0.6s ease-in-out;
}

@keyframes checkmark {
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
    opacity: 1;
  }
}
</style>
