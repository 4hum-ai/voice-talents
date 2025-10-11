<template>
  <div v-if="showOnboarding" class="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-hidden">
    <!-- Top Navigation Bar -->
    <div
      class="absolute top-0 left-0 right-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
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
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Step {{ currentStep }} of {{ totalSteps }}
          </div>
          <div class="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              :style="{ width: `${(currentStep / totalSteps) * 100}%` }" />
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ Math.round((currentStep / totalSteps) * 100) }}%
          </div>
        </div>

        <!-- Right: Close and Next/Skip -->
        <div class="flex items-center space-x-3">
          <Button v-if="currentStep < totalSteps" variant="primary" :disabled="!canProceedToNext" @click="nextStep"
            class="onboarding-button">
            Next
            <Icon name="mdi:chevron-right" class="h-4 w-4 ml-2" />
          </Button>
          <Button v-else variant="primary" @click="completeOnboarding" class="onboarding-button">
            Get Started
            <Icon name="mdi:rocket-launch" class="h-4 w-4 ml-2" />
          </Button>
          <Button variant="ghost" size="sm" @click="closeOnboarding"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <Icon name="mdi:close" class="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="pt-20 h-full overflow-y-auto">
      <div class="max-w-4xl mx-auto px-6 py-8">
        <!-- Content -->
        <div class="px-8 py-6">
          <Transition :name="transitionName" mode="out-in">
            <div :key="currentStep" class="space-y-8">

              <!-- Step 1: Welcome -->
              <div v-if="currentStep === 1" class="text-center space-y-8">
                <div
                  class="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto icon-bounce">
                  <Icon name="mdi:microphone" class="h-16 w-16 text-white" />
                </div>
                <div>
                  <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Welcome to VoiceAct! 🎙️
                  </h3>
                  <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Let's get you set up for success! We'll help you create a professional profile that showcases your
                    voice acting talent.
                  </p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  <div class="text-center p-4">
                    <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon name="mdi:account" class="h-6 w-6 text-white" />
                    </div>
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-1">Profile Setup</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Create your professional profile</p>
                  </div>
                  <div class="text-center p-4">
                    <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon name="mdi:upload" class="h-6 w-6 text-white" />
                    </div>
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-1">Voice Samples</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Upload your best work</p>
                  </div>
                  <div class="text-center p-4">
                    <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon name="mdi:currency-usd" class="h-6 w-6 text-white" />
                    </div>
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-1">Set Rates</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Define your pricing</p>
                  </div>
                </div>
              </div>

              <!-- Step 2: Basic Info -->
              <div v-if="currentStep === 2" class="space-y-8">
                <div class="text-center">
                  <div
                    class="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="mdi:account" class="h-8 w-8 text-white" />
                  </div>
                  <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    Let's Start with the Basics
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Tell us about yourself so clients can find and connect with you.
                  </p>
                </div>

                <div class="max-w-2xl mx-auto space-y-6">
                  <!-- Avatar Upload -->
                  <div class="text-center">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Profile Photo
                    </label>
                    <div class="relative inline-block">
                      <div
                        class="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-600 mx-auto">
                        <img v-if="profileData.avatarUrl" :src="profileData.avatarUrl" alt="Profile"
                          class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <Icon name="mdi:account" class="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                      <input ref="avatarInput" type="file" accept="image/*" class="hidden"
                        @change="handleAvatarUpload" />
                      <button type="button" @click="triggerAvatarUpload"
                        class="absolute -bottom-1 -right-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition-colors">
                        <Icon name="mdi:camera" class="h-4 w-4" />
                      </button>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Click camera icon to upload</p>
                  </div>

                  <!-- Display Name -->
                  <div>
                    <label for="displayName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      What should we call you? *
                    </label>
                    <input id="displayName" v-model="profileData.displayName" type="text" required
                      placeholder="Your professional name"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-lg" />
                  </div>

                  <!-- Location -->
                  <div>
                    <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Where are you based? *
                    </label>
                    <input id="location" v-model="profileData.location" type="text" required placeholder="City, Country"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-lg" />
                  </div>

                  <!-- Bio -->
                  <div>
                    <label for="bio" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tell us about yourself *
                    </label>
                    <textarea id="bio" v-model="profileData.bio" required rows="4"
                      placeholder="Share your voice acting experience, specialties, and what makes you unique..."
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ profileData.bio.length }}/500 characters
                    </p>
                  </div>
                </div>
              </div>

              <!-- Step 3: Voice Types -->
              <div v-if="currentStep === 3" class="space-y-8">
                <div class="text-center">
                  <div
                    class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="mdi:microphone" class="h-8 w-8 text-white" />
                  </div>
                  <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    What's Your Voice Type?
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Select all the voice types you specialize in. This helps clients find the right voice for their
                    projects.
                  </p>
                </div>

                <div class="max-w-4xl mx-auto">
                  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <label v-for="voiceType in voiceTypeOptions" :key="voiceType.value" class="group">
                      <input v-model="profileData.voiceTypes" :value="voiceType.value" type="checkbox"
                        class="sr-only" />
                      <div
                        class="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer transition-all duration-200 group-has-[:checked]:border-purple-500 group-has-[:checked]:bg-purple-50 dark:group-has-[:checked]:bg-purple-900/20">
                        <div class="text-center">
                          <div
                            :class="`w-12 h-12 bg-gray-400 group-has-[:checked]:${getVoiceTypeColor(voiceType.value)} rounded-lg flex items-center justify-center mx-auto mb-3 transition-all duration-200`">
                            <Icon :name="voiceType.icon"
                              class="h-6 w-6 text-white grayscale group-has-[:checked]:grayscale-0 transition-all duration-200" />
                          </div>
                          <h4 class="font-medium text-gray-900 dark:text-white">{{ voiceType.label }}</h4>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div v-if="profileData.voiceTypes.length > 0"
                    class="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p class="text-sm text-purple-700 dark:text-purple-300">
                      <Icon name="mdi:check-circle" class="h-4 w-4 inline mr-1" />
                      You've selected {{ profileData.voiceTypes.length }} voice type{{ profileData.voiceTypes.length > 1
                      ? 's' : '' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Step 4: Languages -->
              <div v-if="currentStep === 4" class="space-y-8">
                <div class="text-center">
                  <div
                    class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="mdi:translate" class="h-8 w-8 text-white" />
                  </div>
                  <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    What Languages Do You Speak?
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Select all the languages you can perform voice work in. This opens up more opportunities for you.
                  </p>
                </div>

                <div class="max-w-4xl mx-auto">
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                    <label v-for="language in languageOptions" :key="language.value" class="group">
                      <input v-model="profileData.languages" :value="language.value" type="checkbox" class="sr-only" />
                      <div
                        class="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer transition-all duration-200 group-has-[:checked]:border-indigo-500 group-has-[:checked]:bg-indigo-50 dark:group-has-[:checked]:bg-indigo-900/20">
                        <div class="flex items-center">
                          <div
                            :class="`w-8 h-6 bg-gray-400 group-has-[:checked]:${getLanguageColor(language.value)} rounded flex items-center justify-center mr-3 transition-all duration-200`">
                            <CountryFlag :country-code="language.countryCode" size="sm" variant="rounded"
                              class="w-6 h-4 grayscale group-has-[:checked]:grayscale-0 transition-all duration-200" />
                          </div>
                          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ language.label }}</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div v-if="profileData.languages.length > 0"
                    class="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <p class="text-sm text-indigo-700 dark:text-indigo-300">
                      <Icon name="mdi:check-circle" class="h-4 w-4 inline mr-1" />
                      You can perform in {{ profileData.languages.length }} language{{ profileData.languages.length > 1
                      ? 's' : '' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Step 5: Upload Voice Samples -->
              <div v-if="currentStep === 5" class="space-y-8">
                <div class="text-center">
                  <div
                    class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="mdi:upload" class="h-8 w-8 text-white" />
                  </div>
                  <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    Upload Voice Samples
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Upload samples for each voice type you selected. This showcases your range and versatility!
                  </p>
                </div>

                <!-- Voice Type Upload Areas -->
                <div class="space-y-6">
                  <div v-for="voiceType in selectedVoiceTypes" :key="voiceType.value"
                    class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                          <Icon name="mdi:microphone" class="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">{{ voiceType.label }}</h4>
                          <p class="text-sm text-gray-600 dark:text-gray-400">Upload a sample for {{
                            voiceType.label.toLowerCase() }}</p>
                        </div>
                      </div>
                      <div v-if="voiceSamples[voiceType.value]" class="flex items-center space-x-2">
                        <Icon name="mdi:check-circle" class="h-5 w-5 text-green-500" />
                        <span class="text-sm text-green-600 dark:text-green-400">Uploaded</span>
                      </div>
                    </div>

                    <!-- Upload Area for this Voice Type -->
                    <div
                      class="upload-area border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
                      :class="{
                        'border-blue-400 bg-blue-50 dark:bg-blue-900/20 drag-over': isDragOver === voiceType.value,
                        'border-green-400 bg-green-50 dark:bg-green-900/20': voiceSamples[voiceType.value]
                      }" @dragover.prevent="isDragOver = voiceType.value" @dragleave.prevent="isDragOver = null"
                      @drop.prevent="handleFileDrop($event, voiceType.value)"
                      @click.stop="triggerFileInput(voiceType.value)">
                      <input :id="`file-input-${voiceType.value}`" :data-voice-type="voiceType.value" type="file"
                        accept="audio/mp3,audio/wav,audio/ogg,audio/aac" class="hidden"
                        @change="handleFileSelect($event, voiceType.value)" />

                      <div v-if="!voiceSamples[voiceType.value]">
                        <Icon name="mdi:cloud-upload" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h5 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Drop your {{ voiceType.label.toLowerCase() }} sample here
                        </h5>
                        <p class="text-gray-600 dark:text-gray-400 mb-4">
                          or click to browse files
                        </p>
                        <Button variant="primary"
                          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                          @click.stop="triggerFileInput(voiceType.value)">
                          <Icon name="mdi:folder-open" class="h-4 w-4 mr-2" />
                          Choose File
                        </Button>
                      </div>

                      <!-- File Preview -->
                      <div v-else class="space-y-4">
                        <div class="flex items-center space-x-4">
                          <div class="flex-shrink-0">
                            <Icon name="mdi:music-note" class="h-8 w-8 text-purple-500" />
                          </div>
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {{ voiceSamples[voiceType.value].name }}
                            </p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
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
                          <audio :src="voiceSamples[voiceType.value].previewUrl" controls class="w-full" />
                        </div>

                        <!-- Sample Details -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label :for="`title-${voiceType.value}`"
                              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Sample Title
                            </label>
                            <input :id="`title-${voiceType.value}`" v-model="voiceSamples[voiceType.value].title"
                              type="text" :placeholder="`${voiceType.label} Demo`"
                              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
                          </div>

                          <div>
                            <label :for="`description-${voiceType.value}`"
                              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Description
                            </label>
                            <input :id="`description-${voiceType.value}`"
                              v-model="voiceSamples[voiceType.value].description" type="text"
                              placeholder="Describe this sample..."
                              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="text-sm text-gray-500 dark:text-gray-400 text-center">
                  <p>Supported formats: MP3, WAV, OGG, AAC</p>
                  <p>Maximum file size: 50MB per file</p>
                </div>
              </div>


              <!-- Step 6: Pricing & Rates -->
              <div v-if="currentStep === 6" class="space-y-8">
                <div class="text-center">
                  <div
                    class="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="mdi:currency-usd" class="h-8 w-8 text-white" />
                  </div>
                  <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    Set Your Pricing & Rates
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Define your rates for different types of voice work. This helps clients understand your pricing
                    structure.
                  </p>
                </div>

                <div class="space-y-8">
                  <!-- Rate Structure -->
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rate Structure</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label for="hourlyRate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Hourly Rate (USD) *
                        </label>
                        <div class="relative">
                          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span class="text-gray-500 dark:text-gray-400 text-sm">$</span>
                          </div>
                          <input id="hourlyRate" v-model="pricingData.hourlyRate" type="number" min="0" step="5"
                            placeholder="50"
                            class="w-full pl-8 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-lg" />
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Your standard hourly rate for voice
                          work</p>
                      </div>

                      <div>
                        <label for="perWordRate"
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Per Word Rate (USD)
                        </label>
                        <div class="relative">
                          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span class="text-gray-500 dark:text-gray-400 text-sm">$</span>
                          </div>
                          <input id="perWordRate" v-model="pricingData.perWordRate" type="number" min="0" step="0.01"
                            placeholder="0.25"
                            class="w-full pl-8 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-lg" />
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Rate per word for audiobooks,
                          e-learning</p>
                      </div>
                    </div>
                  </div>

                  <!-- Project Type Rates -->
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Type Rates</h4>
                    <div class="space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label for="commercialRate"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Commercial (30 seconds)
                          </label>
                          <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span class="text-gray-500 dark:text-gray-400 text-sm">$</span>
                            </div>
                            <input id="commercialRate" v-model="pricingData.commercialRate" type="number" min="0"
                              step="25" placeholder="500"
                              class="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
                          </div>
                        </div>

                        <div>
                          <label for="audiobookRate"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Audiobook (per finished hour)
                          </label>
                          <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span class="text-gray-500 dark:text-gray-400 text-sm">$</span>
                            </div>
                            <input id="audiobookRate" v-model="pricingData.audiobookRate" type="number" min="0"
                              step="25" placeholder="200"
                              class="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
                          </div>
                        </div>

                        <div>
                          <label for="animationRate"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Animation (per character)
                          </label>
                          <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span class="text-gray-500 dark:text-gray-400 text-sm">$</span>
                            </div>
                            <input id="animationRate" v-model="pricingData.animationRate" type="number" min="0"
                              step="25" placeholder="1000"
                              class="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
                          </div>
                        </div>

                        <div>
                          <label for="elearningRate"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            E-Learning (per hour)
                          </label>
                          <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span class="text-gray-500 dark:text-gray-400 text-sm">$</span>
                            </div>
                            <input id="elearningRate" v-model="pricingData.elearningRate" type="number" min="0"
                              step="25" placeholder="300"
                              class="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Additional Information -->
                  <div>
                    <label for="pricingNotes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Additional Pricing Notes
                    </label>
                    <textarea id="pricingNotes" v-model="pricingData.notes" rows="3"
                      placeholder="e.g., Rush jobs +50%, Weekend work +25%, Minimum project fee $100..."
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
                  </div>
                </div>
              </div>


              <!-- Step 7: Completion -->
              <div v-if="currentStep === 7" class="text-center space-y-8">
                <div
                  class="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <Icon name="mdi:check" class="h-12 w-12 text-white" />
                </div>
                <div>
                  <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Welcome to VoiceAct! 🎉
                  </h3>
                  <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Your profile is complete and you're ready to start your voice acting journey.
                    Let's get you connected with amazing opportunities!
                  </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                    <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon name="mdi:rocket-launch" class="h-6 w-6 text-white" />
                    </div>
                    <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">Ready to Launch</h4>
                    <p class="text-sm text-blue-800 dark:text-blue-200">Your profile is live and discoverable by clients
                    </p>
                  </div>

                  <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
                    <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon name="mdi:account-search" class="h-6 w-6 text-white" />
                    </div>
                    <h4 class="font-semibold text-purple-900 dark:text-purple-100 mb-2">Find Opportunities</h4>
                    <p class="text-sm text-purple-800 dark:text-purple-200">Browse casting calls and apply for projects
                    </p>
                  </div>

                  <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                    <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon name="mdi:chart-line" class="h-6 w-6 text-white" />
                    </div>
                    <h4 class="font-semibold text-green-900 dark:text-green-100 mb-2">Track Progress</h4>
                    <p class="text-sm text-green-800 dark:text-green-200">Monitor your career growth and earnings</p>
                  </div>

                  <div class="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6">
                    <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon name="mdi:account-group" class="h-6 w-6 text-white" />
                    </div>
                    <h4 class="font-semibold text-orange-900 dark:text-orange-100 mb-2">Build Network</h4>
                    <p class="text-sm text-orange-800 dark:text-orange-200">Connect with other voice actors and clients
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
  languages: [] as string[]
})

const avatarInput = ref<HTMLInputElement | null>(null)

// Voice samples data - one per voice type
const voiceSamples = reactive<Record<string, {
  file: File
  name: string
  size: number
  previewUrl: string
  title: string
  description: string
}>>({})

const isDragOver = ref<string | null>(null)

// Preferences data
const preferencesData = reactive({
  notifications: {
    newProjects: true,
    castingCalls: true,
    messages: true,
    deadlines: true
  },
  privacy: {
    profilePublic: true,
    showContactInfo: false,
    allowDirectMessages: true
  },
  audioQuality: 'professional'
})

// Pricing data
const pricingData = reactive({
  hourlyRate: '',
  perWordRate: '',
  commercialRate: '',
  audiobookRate: '',
  animationRate: '',
  elearningRate: '',
  notes: ''
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
  { value: 'e-learning', label: 'E-Learning', icon: 'mdi:school', color: 'bg-yellow-500' }
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
  { value: 'Chinese (Mandarin)', label: 'Chinese (Mandarin)', countryCode: 'cn', color: 'bg-red-500' },
  { value: 'Chinese (Cantonese)', label: 'Chinese (Cantonese)', countryCode: 'hk', color: 'bg-red-500' },
  { value: 'Arabic', label: 'Arabic', countryCode: 'sa', color: 'bg-green-500' },
  { value: 'Russian', label: 'Russian', countryCode: 'ru', color: 'bg-blue-500' },
  { value: 'Hindi', label: 'Hindi', countryCode: 'in', color: 'bg-orange-500' }
]


// Computed
const showOnboarding = computed(() => props.show)

const selectedVoiceTypes = computed(() => {
  return voiceTypeOptions.filter(option => profileData.voiceTypes.includes(option.value))
})

const canProceedToNext = computed(() => {
  switch (currentStep.value) {
    case 1:
      return true // Welcome step
    case 2:
      return profileData.displayName &&
        profileData.bio &&
        profileData.location
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
  const voiceType = voiceTypeOptions.find(vt => vt.value === voiceTypeValue)
  return voiceType?.color || 'bg-gray-500'
}

const getLanguageColor = (languageValue: string) => {
  const language = languageOptions.find(lang => lang.value === languageValue)
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
      completedAt: new Date().toISOString()
    }

    // Store in localStorage for now (in real app, this would be sent to API)
    localStorage.setItem('voiceact-onboarding-data', JSON.stringify(onboardingData))
    localStorage.setItem('voiceact-onboarding-completed', 'true')

    success('Welcome to VoiceAct! Your profile is ready to go.')
    emit('complete')
  } catch (err) {
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
    input = Array.from(inputs).find(inp =>
      inp.getAttribute('data-voice-type') === voiceType
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
    description: ''
  }

  console.log('File processed successfully:', voiceSamples[voiceType])
  success(`Sample uploaded for ${voiceTypeOptions.find(vt => vt.value === voiceType)?.label}`)
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
input[type="checkbox"],
input[type="radio"] {
  transition: all 0.2s ease;
}

input[type="checkbox"]:checked,
input[type="radio"]:checked {
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
