<template>
  <div class="container mx-auto max-w-7xl space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">
    <!-- Header -->
    <div class="mb-4 sm:mb-6 lg:mb-8">
      <h1 class="text-foreground mb-2 text-2xl font-bold sm:text-3xl">
        Form Components Test & Definition Editor
      </h1>
      <p class="text-muted-foreground text-sm sm:text-base">
        Test form components or create/edit form definitions declaratively
      </p>
    </div>

    <!-- Mode Toggle -->
    <div class="bg-card border-border rounded-lg border p-4 sm:p-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex gap-2">
          <Button
            :variant="mode === 'test' ? 'primary' : 'outline'"
            @click="mode = 'test'"
            class="text-xs sm:text-sm"
          >
            Test Components
          </Button>
          <Button
            :variant="mode === 'definition' ? 'primary' : 'outline'"
            @click="mode = 'definition'"
            class="text-xs sm:text-sm"
          >
            Edit Definition
          </Button>
        </div>
        <div v-if="mode === 'definition'" class="flex gap-2">
          <Button @click="loadExampleDefinition" variant="outline" class="text-xs sm:text-sm">
            Load Example
          </Button>
          <Button @click="saveDefinition" variant="outline" class="text-xs sm:text-sm">
            Save Definition
          </Button>
          <Button @click="loadDefinition" variant="outline" class="text-xs sm:text-sm">
            Load Definition
          </Button>
          <Button
            @click="applyDefinition"
            variant="primary"
            class="text-xs sm:text-sm"
            :disabled="!isDefinitionValid"
          >
            Apply Definition
          </Button>
        </div>
      </div>
    </div>

    <!-- Test Components Mode -->
    <template v-if="mode === 'test'">
      <!-- Display Mode Buttons -->
      <div class="bg-card border-border rounded-lg border p-4 sm:p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-foreground text-sm font-medium sm:text-base">Display Mode:</h3>
          <div class="flex gap-2">
            <Button
              :variant="displayMode === 'inline' ? 'primary' : 'outline'"
              @click="displayMode = 'inline'"
              size="sm"
              class="text-xs sm:text-sm"
            >
              Inline
            </Button>
            <Button
              :variant="displayMode === 'sidebar' ? 'primary' : 'outline'"
              @click="displayMode = 'sidebar'"
              size="sm"
              class="text-xs sm:text-sm"
            >
              Sidebar
            </Button>
            <Button
              :variant="displayMode === 'modal' ? 'primary' : 'outline'"
              @click="displayMode = 'modal'"
              size="sm"
              class="text-xs sm:text-sm"
            >
              Full Screen Modal
            </Button>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <Button
            @click="showFormState = !showFormState"
            variant="outline"
            size="sm"
            class="text-xs sm:text-sm"
          >
            {{ showFormState ? 'Hide' : 'Show' }} Form State
          </Button>
          <div class="flex gap-2">
            <Button @click="form.reset()" variant="outline" size="sm" class="text-xs sm:text-sm"
              >Reset</Button
            >
            <Button @click="form.clear()" variant="outline" size="sm" class="text-xs sm:text-sm"
              >Clear</Button
            >
          </div>
        </div>
      </div>

      <!-- Inline Mode -->
      <template v-if="displayMode === 'inline'">
        <div class="flex gap-4">
          <!-- Main Content -->
          <div class="flex-1 space-y-4">
            <!-- Collapsible Form State -->
            <Transition name="slide-down">
              <div v-if="showFormState" class="bg-card border-border rounded-lg border p-4 sm:p-6">
                <h2 class="text-foreground mb-3 text-lg font-semibold sm:mb-4 sm:text-xl">
                  Form State
                </h2>
                <div class="bg-muted max-h-96 overflow-auto rounded-lg p-3 sm:p-4">
                  <pre class="text-xs sm:text-sm">{{
                    JSON.stringify(form.getFormData(), null, 2)
                  }}</pre>
                </div>
              </div>
            </Transition>

            <!-- Step Navigation -->
            <div class="bg-card border-border rounded-lg border p-4 sm:p-6">
              <h2 class="text-foreground mb-3 text-lg font-semibold sm:mb-4 sm:text-xl">
                Step {{ form.currentStep.value }} of {{ form.totalSteps.value }}
              </h2>
              <div class="flex flex-wrap gap-2">
                <Button
                  @click="form.previousStep()"
                  :disabled="form.currentStep.value === 1"
                  variant="outline"
                  class="text-xs sm:text-sm"
                >
                  Previous
                </Button>
                <Button
                  @click="form.nextStep()"
                  :disabled="!form.isStepValid.value"
                  variant="primary"
                  class="text-xs sm:text-sm"
                >
                  Next
                </Button>
                <Button @click="form.goToStep(1)" variant="outline" class="text-xs sm:text-sm"
                  >Step 1</Button
                >
                <Button @click="form.goToStep(2)" variant="outline" class="text-xs sm:text-sm"
                  >Step 2</Button
                >
                <Button @click="form.goToStep(3)" variant="outline" class="text-xs sm:text-sm"
                  >Step 3</Button
                >
              </div>
            </div>

            <!-- Step 1: Core Inputs -->
            <div
              v-if="form.currentStep.value === 1"
              class="bg-card border-border rounded-lg border p-4 sm:p-6"
            >
              <h2 class="text-foreground mb-4 text-lg font-semibold sm:mb-6 sm:text-xl">
                Step 1: Core Input Components
              </h2>
              <div class="space-y-4 sm:space-y-6">
                <TextInput
                  v-model="formData.textInput"
                  label="Text Input"
                  placeholder="Enter text"
                  :error="form.getFieldError('textInput')"
                  required
                  @blur="form.markFieldAsTouched('textInput')"
                />

                <EmailInput
                  v-model="formData.emailInput"
                  label="Email Input"
                  placeholder="Enter email"
                  :error="form.getFieldError('emailInput')"
                  required
                  @blur="form.markFieldAsTouched('emailInput')"
                />

                <NumberInput
                  v-model="formData.numberInput"
                  label="Number Input"
                  placeholder="Enter number"
                  :error="form.getFieldError('numberInput')"
                  @blur="form.markFieldAsTouched('numberInput')"
                />

                <PasswordInput
                  v-model="formData.passwordInput"
                  label="Password Input"
                  placeholder="Enter password"
                  :error="form.getFieldError('passwordInput')"
                  @blur="form.markFieldAsTouched('passwordInput')"
                />

                <DateInput
                  v-model="formData.dateInput"
                  label="Date Input"
                  :error="form.getFieldError('dateInput')"
                  @blur="form.markFieldAsTouched('dateInput')"
                />

                <SelectInput
                  v-model="formData.selectInput"
                  label="Select Input"
                  :options="selectOptions"
                  placeholder="Select an option"
                  :error="form.getFieldError('selectInput')"
                  required
                  @blur="form.markFieldAsTouched('selectInput')"
                />

                <Textarea
                  v-model="formData.textareaInput"
                  label="Textarea"
                  placeholder="Enter multi-line text"
                  :error="form.getFieldError('textareaInput')"
                  :rows="4"
                  @blur="form.markFieldAsTouched('textareaInput')"
                />

                <Checkbox
                  v-model="formData.checkboxInput"
                  label="Checkbox Input"
                  :error="form.getFieldError('checkboxInput')"
                  @blur="form.markFieldAsTouched('checkboxInput')"
                />
              </div>
            </div>

            <!-- Step 2: Advanced Inputs -->
            <div
              v-if="form.currentStep.value === 2"
              class="bg-card border-border rounded-lg border p-4 sm:p-6"
            >
              <h2 class="text-foreground mb-4 text-lg font-semibold sm:mb-6 sm:text-xl">
                Step 2: Advanced Input Components
              </h2>
              <div class="space-y-4 sm:space-y-6">
                <DateRangeInput
                  v-model="formData.dateRangeInput"
                  label="Date Range"
                  :error="form.getFieldError('dateRangeInput')"
                />

                <TagInput
                  v-model="formData.tagInput"
                  label="Tag Input"
                  placeholder="Add tags"
                  :error="form.getFieldError('tagInput')"
                />

                <BudgetRangeInput
                  v-model="formData.budgetInput"
                  label="Budget Range"
                  :error="form.getFieldError('budgetInput')"
                />

                <FormSection
                  title="Form Section Example"
                  description="This is a form section wrapper"
                >
                  <TextInput
                    v-model="formData.sectionInput"
                    label="Input in Section"
                    @blur="form.markFieldAsTouched('sectionInput')"
                  />
                </FormSection>
              </div>
            </div>

            <!-- Step 3: Media Inputs -->
            <div
              v-if="form.currentStep.value === 3"
              class="bg-card border-border rounded-lg border p-4 sm:p-6"
            >
              <h2 class="text-foreground mb-4 text-lg font-semibold sm:mb-6 sm:text-xl">
                Step 3: Media & Specialized Inputs
              </h2>
              <div class="space-y-4 sm:space-y-6">
                <FileUpload
                  v-model="formData.fileInput"
                  label="File Upload"
                  accept=".pdf,.doc,.docx"
                  :error="form.getFieldError('fileInput')"
                />

                <FileInput
                  v-model="formData.fileInputBasic"
                  label="Basic File Input"
                  :error="form.getFieldError('fileInputBasic')"
                />

                <ArrayInput
                  v-model="formData.arrayInput"
                  label="Array Input"
                  :error="form.getFieldError('arrayInput')"
                />

                <ObjectInput
                  v-model="formData.objectInput"
                  label="Object Input"
                  :error="form.getFieldError('objectInput')"
                />

                <JsonInput
                  v-model="formData.jsonInput"
                  label="JSON Input"
                  :error="form.getFieldError('jsonInput')"
                />
              </div>
            </div>

            <!-- Errors Display -->
            <div
              v-if="Object.keys(form.getErrors()).some((key) => key.startsWith('step_'))"
              class="bg-destructive/10 border-destructive rounded-lg border p-4 sm:p-6"
            >
              <h2 class="text-destructive mb-3 text-lg font-semibold sm:mb-4 sm:text-xl">
                Step Validation Errors
              </h2>
              <ul class="list-disc space-y-2 pl-4 text-sm sm:pl-6 sm:text-base">
                <template v-for="(error, field) in form.getErrors()" :key="field">
                  <li v-if="field.startsWith('step_')" class="text-destructive">
                    <strong>{{ field }}:</strong> {{ error }}
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </div>
      </template>

      <!-- Sidebar Mode -->
      <DynamicFormSidebar
        v-if="displayMode === 'sidebar'"
        :title="`Form Test - Step ${form.currentStep.value} of ${form.totalSteps.value}`"
        :form-config="sidebarFormConfig"
        :initial-data="form.getFormData()"
        @close="displayMode = 'inline'"
        @submit="handleSidebarSubmit"
      >
        <!-- Custom Header -->
        <template #header="{ handlers }">
          <div
            class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900"
          >
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
              Form Test - Step {{ form.currentStep.value }} of {{ form.totalSteps.value }}
            </h3>
            <button
              class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              @click="handlers.close()"
            >
              ✕
            </button>
          </div>
        </template>

        <template #form-fields>
          <!-- Step 1: Core Inputs -->
          <div v-if="form.currentStep.value === 1" class="space-y-4">
            <TextInput
              v-model="formData.textInput"
              label="Text Input"
              placeholder="Enter text"
              :error="form.getFieldError('textInput')"
              required
              @blur="form.markFieldAsTouched('textInput')"
            />
            <EmailInput
              v-model="formData.emailInput"
              label="Email Input"
              placeholder="Enter email"
              :error="form.getFieldError('emailInput')"
              required
              @blur="form.markFieldAsTouched('emailInput')"
            />
            <NumberInput
              v-model="formData.numberInput"
              label="Number Input"
              placeholder="Enter number"
              :error="form.getFieldError('numberInput')"
              @blur="form.markFieldAsTouched('numberInput')"
            />
            <PasswordInput
              v-model="formData.passwordInput"
              label="Password Input"
              placeholder="Enter password"
              :error="form.getFieldError('passwordInput')"
              @blur="form.markFieldAsTouched('passwordInput')"
            />
            <DateInput
              v-model="formData.dateInput"
              label="Date Input"
              :error="form.getFieldError('dateInput')"
              @blur="form.markFieldAsTouched('dateInput')"
            />
            <SelectInput
              v-model="formData.selectInput"
              label="Select Input"
              :options="selectOptions"
              placeholder="Select an option"
              :error="form.getFieldError('selectInput')"
              required
              @blur="form.markFieldAsTouched('selectInput')"
            />
            <Textarea
              v-model="formData.textareaInput"
              label="Textarea"
              placeholder="Enter multi-line text"
              :error="form.getFieldError('textareaInput')"
              :rows="4"
              @blur="form.markFieldAsTouched('textareaInput')"
            />
            <Checkbox
              v-model="formData.checkboxInput"
              label="Checkbox Input"
              :error="form.getFieldError('checkboxInput')"
              @blur="form.markFieldAsTouched('checkboxInput')"
            />
          </div>

          <!-- Step 2: Advanced Inputs -->
          <div v-if="form.currentStep.value === 2" class="space-y-4">
            <DateRangeInput
              v-model="formData.dateRangeInput"
              label="Date Range"
              :error="form.getFieldError('dateRangeInput')"
            />
            <TagInput
              v-model="formData.tagInput"
              label="Tag Input"
              placeholder="Add tags"
              :error="form.getFieldError('tagInput')"
            />
            <BudgetRangeInput
              v-model="formData.budgetInput"
              label="Budget Range"
              :error="form.getFieldError('budgetInput')"
            />
            <FormSection title="Form Section Example" description="This is a form section wrapper">
              <TextInput
                v-model="formData.sectionInput"
                label="Input in Section"
                @blur="form.markFieldAsTouched('sectionInput')"
              />
            </FormSection>
          </div>

          <!-- Step 3: Media Inputs -->
          <div v-if="form.currentStep.value === 3" class="space-y-4">
            <FileUpload
              v-model="formData.fileInput"
              label="File Upload"
              accept=".pdf,.doc,.docx"
              :error="form.getFieldError('fileInput')"
            />
            <FileInput
              v-model="formData.fileInputBasic"
              label="Basic File Input"
              :error="form.getFieldError('fileInputBasic')"
            />
            <ArrayInput
              v-model="formData.arrayInput"
              label="Array Input"
              :error="form.getFieldError('arrayInput')"
            />
            <ObjectInput
              v-model="formData.objectInput"
              label="Object Input"
              :error="form.getFieldError('objectInput')"
            />
            <JsonInput
              v-model="formData.jsonInput"
              label="JSON Input"
              :error="form.getFieldError('jsonInput')"
            />
          </div>
        </template>

        <!-- Custom Footer with Back and Next/Submit -->
        <template #actions="{ handlers }">
          <div class="flex justify-between space-x-3">
            <Button
              v-if="form.currentStep.value > 1"
              variant="outline"
              size="sm"
              icon="mdi:chevron-left"
              @click="form.previousStep()"
            >
              Back
            </Button>
            <div v-else></div>
            <div class="flex space-x-3">
              <Button
                v-if="form.currentStep.value < form.totalSteps.value"
                type="button"
                :disabled="!form.isStepValid.value"
                variant="primary"
                size="sm"
                @click="form.nextStep()"
              >
                Next
              </Button>
              <Button
                v-else
                type="submit"
                :disabled="!form.isStepValid.value"
                variant="danger"
                size="sm"
                shortcut="Enter"
                @click="handlers.submit()"
              >
                Submit
              </Button>
            </div>
          </div>
        </template>
      </DynamicFormSidebar>

      <!-- Full Screen Modal Mode -->
      <StepContainer
        v-if="displayMode === 'modal'"
        :model-value="form.currentStep.value"
        :total-steps="form.totalSteps.value"
        :can-proceed="form.isStepValid.value"
        complete-button-text="Complete"
        @update:model-value="form.goToStep(Number($event))"
        @next="form.nextStep()"
        @previous="form.previousStep()"
        @complete="handleModalComplete"
        @close="displayMode = 'inline'"
      >
        <!-- Step 1: Core Inputs -->
        <div v-if="form.currentStep.value === 1" class="space-y-6">
          <div>
            <h2 class="text-foreground mb-4 text-2xl font-semibold">
              Step 1: Core Input Components
            </h2>
            <p class="text-muted-foreground mb-6 text-sm">
              Basic text, number, and selection inputs
            </p>
          </div>
          <div class="space-y-4">
            <TextInput
              v-model="formData.textInput"
              label="Text Input"
              placeholder="Enter text"
              :error="form.getFieldError('textInput')"
              required
              @blur="form.markFieldAsTouched('textInput')"
            />
            <EmailInput
              v-model="formData.emailInput"
              label="Email Input"
              placeholder="Enter email"
              :error="form.getFieldError('emailInput')"
              required
              @blur="form.markFieldAsTouched('emailInput')"
            />
            <NumberInput
              v-model="formData.numberInput"
              label="Number Input"
              placeholder="Enter number"
              :error="form.getFieldError('numberInput')"
              @blur="form.markFieldAsTouched('numberInput')"
            />
            <PasswordInput
              v-model="formData.passwordInput"
              label="Password Input"
              placeholder="Enter password"
              :error="form.getFieldError('passwordInput')"
              @blur="form.markFieldAsTouched('passwordInput')"
            />
            <DateInput
              v-model="formData.dateInput"
              label="Date Input"
              :error="form.getFieldError('dateInput')"
              @blur="form.markFieldAsTouched('dateInput')"
            />
            <SelectInput
              v-model="formData.selectInput"
              label="Select Input"
              :options="selectOptions"
              placeholder="Select an option"
              :error="form.getFieldError('selectInput')"
              required
              @blur="form.markFieldAsTouched('selectInput')"
            />
            <Textarea
              v-model="formData.textareaInput"
              label="Textarea"
              placeholder="Enter multi-line text"
              :error="form.getFieldError('textareaInput')"
              :rows="4"
              @blur="form.markFieldAsTouched('textareaInput')"
            />
            <Checkbox
              v-model="formData.checkboxInput"
              label="Checkbox Input"
              :error="form.getFieldError('checkboxInput')"
              @blur="form.markFieldAsTouched('checkboxInput')"
            />
          </div>
        </div>

        <!-- Step 2: Advanced Inputs -->
        <div v-if="form.currentStep.value === 2" class="space-y-6">
          <div>
            <h2 class="text-foreground mb-4 text-2xl font-semibold">
              Step 2: Advanced Input Components
            </h2>
            <p class="text-muted-foreground mb-6 text-sm">
              Composite and specialized input components
            </p>
          </div>
          <div class="space-y-4">
            <DateRangeInput
              v-model="formData.dateRangeInput"
              label="Date Range"
              :error="form.getFieldError('dateRangeInput')"
            />
            <TagInput
              v-model="formData.tagInput"
              label="Tag Input"
              placeholder="Add tags"
              :error="form.getFieldError('tagInput')"
            />
            <BudgetRangeInput
              v-model="formData.budgetInput"
              label="Budget Range"
              :error="form.getFieldError('budgetInput')"
            />
            <FormSection title="Form Section Example" description="This is a form section wrapper">
              <TextInput
                v-model="formData.sectionInput"
                label="Input in Section"
                @blur="form.markFieldAsTouched('sectionInput')"
              />
            </FormSection>
          </div>
        </div>

        <!-- Step 3: Media Inputs -->
        <div v-if="form.currentStep.value === 3" class="space-y-6">
          <div>
            <h2 class="text-foreground mb-4 text-2xl font-semibold">
              Step 3: Media & Specialized Inputs
            </h2>
            <p class="text-muted-foreground mb-6 text-sm">File uploads and media-related inputs</p>
          </div>
          <div class="space-y-4">
            <FileUpload
              v-model="formData.fileInput"
              label="File Upload"
              accept=".pdf,.doc,.docx"
              :error="form.getFieldError('fileInput')"
            />
            <FileInput
              v-model="formData.fileInputBasic"
              label="Basic File Input"
              :error="form.getFieldError('fileInputBasic')"
            />
            <ArrayInput
              v-model="formData.arrayInput"
              label="Array Input"
              :error="form.getFieldError('arrayInput')"
            />
            <ObjectInput
              v-model="formData.objectInput"
              label="Object Input"
              :error="form.getFieldError('objectInput')"
            />
            <JsonInput
              v-model="formData.jsonInput"
              label="JSON Input"
              :error="form.getFieldError('jsonInput')"
            />
          </div>
        </div>
      </StepContainer>
    </template>

    <!-- Edit Definition Mode -->
    <template v-else>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <!-- Definition Editor -->
        <div class="bg-card border-border rounded-lg border p-4 sm:p-6">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-foreground text-lg font-semibold sm:text-xl">Form Definition (JSON)</h2>
            <div v-if="definitionError" class="text-destructive text-xs sm:text-sm">
              {{ definitionError }}
            </div>
            <div v-else-if="isDefinitionValid" class="text-xs text-green-600 sm:text-sm">
              ✓ Valid
            </div>
          </div>
          <JsonInput
            v-model="definitionJson"
            label=""
            :error="definitionError || undefined"
            :rows="30"
            class="font-mono text-xs"
          />
        </div>

        <!-- Live Preview -->
        <div class="bg-card border-border rounded-lg border p-4 sm:p-6">
          <h2 class="text-foreground mb-4 text-lg font-semibold sm:text-xl">Live Preview</h2>
          <div v-if="!definitionForm" class="text-muted-foreground py-8 text-center text-sm">
            Enter a valid form definition to see preview
          </div>
          <template v-else>
            <!-- Preview Form State -->
            <div class="bg-muted mb-4 rounded-lg p-3">
              <div class="text-muted-foreground mb-2 text-xs font-medium">Form Data:</div>
              <pre class="max-h-32 overflow-auto text-xs">{{
                JSON.stringify(definitionFormData, null, 2)
              }}</pre>
            </div>

            <!-- Step Navigation -->
            <div
              v-if="definitionForm && (definitionForm.totalSteps as any).value > 1"
              class="mb-4 flex gap-2"
            >
              <Button
                @click="definitionForm?.previousStep()"
                :disabled="!definitionForm || (definitionForm.currentStep as any).value === 1"
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <Button
                @click="definitionForm?.nextStep()"
                :disabled="!definitionForm || !(definitionForm.isStepValid as any).value"
                variant="primary"
                size="sm"
              >
                Next
              </Button>
              <span v-if="definitionForm" class="text-muted-foreground flex items-center text-sm">
                Step {{ (definitionForm.currentStep as any).value }} of
                {{ (definitionForm.totalSteps as any).value }}
              </span>
            </div>

            <!-- Preview Form Fields -->
            <div class="space-y-4">
              <template v-if="currentStepDefinition">
                <div v-if="currentStepDefinition.title" class="mb-4">
                  <h3 class="text-foreground text-base font-semibold">
                    {{ currentStepDefinition.title }}
                  </h3>
                  <p v-if="currentStepDefinition.description" class="text-muted-foreground text-sm">
                    {{ currentStepDefinition.description }}
                  </p>
                </div>
                <component
                  v-for="field in visibleFields"
                  :key="field.name"
                  :is="getFieldComponent(field.type)"
                  :model-value="definitionFormData[field.name]"
                  @update:model-value="(definitionFormData as any)[field.name] = $event"
                  :label="field.label"
                  :placeholder="field.placeholder"
                  :help-text="field.helpText"
                  :required="field.required"
                  :error="definitionForm?.getFieldError(field.name)"
                  :options="field.options"
                  @blur="definitionForm?.markFieldAsTouched(field.name)"
                />
              </template>
            </div>

            <!-- Preview Errors -->
            <div
              v-if="Object.keys(definitionForm.getErrors()).length > 0"
              class="bg-destructive/10 mt-4 rounded-lg p-3"
            >
              <div class="text-destructive mb-2 text-xs font-medium">Errors:</div>
              <ul class="list-disc space-y-1 pl-4 text-xs">
                <li
                  v-for="(error, field) in definitionForm.getErrors()"
                  :key="field"
                  class="text-destructive"
                >
                  <strong>{{ field }}:</strong> {{ error }}
                </li>
              </ul>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable vue/no-side-effects-in-computed-properties */
import { computed, ref, watch } from 'vue'
import {
  useForm,
  type FormDefinition,
  TextInput,
  EmailInput,
  PasswordInput,
  NumberInput,
  DateInput,
  SelectInput,
  Textarea,
  Checkbox,
  FileUpload,
  FileInput,
  DateRangeInput,
  TagInput,
  BudgetRangeInput,
  FormSection,
  ArrayInput,
  ObjectInput,
  JsonInput,
} from '@/lib/form'
import Button from '@/components/atoms/Button.vue'
import { useToast } from '@/lib/toast'
import StepContainer from '@/components/molecules/StepContainer.vue'
import DynamicFormSidebar from '@/components/molecules/DynamicFormSidebar.vue'

const toast = useToast()

// Mode: 'test' or 'definition'
const mode = ref<'test' | 'definition'>('test')
const displayMode = ref<'inline' | 'sidebar' | 'modal'>('inline')
const showFormState = ref(false)

// Test mode form (imperative)
const form = useForm({
  formId: 'form-test-page',
  initialValues: {
    textInput: '',
    emailInput: '',
    numberInput: 0,
    passwordInput: '',
    dateInput: '',
    selectInput: undefined,
    textareaInput: '',
    checkboxInput: false,
    fileInput: undefined,
    fileInputBasic: undefined,
    dateRangeInput: undefined,
    tagInput: [],
    budgetInput: {
      min: 0,
      max: 0,
      currency: 'USD',
    },
    sectionInput: '',
    arrayInput: [],
    objectInput: {},
    jsonInput: '{}',
  },
  stepValidators: {
    1: (data) => {
      const errors: Record<string, string> = {}

      if (!data.textInput) {
        errors.textInput = 'Text input is required'
      }

      if (!data.emailInput) {
        errors.emailInput = 'Email input is required'
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(data.emailInput)) {
          errors.emailInput = 'Please enter a valid email address'
        }
      }

      if (!data.selectInput) {
        errors.selectInput = 'Please select an option'
      }

      return Object.keys(errors).length > 0 ? errors : true
    },
    2: () => {
      return true
    },
    3: () => {
      return true
    },
  },
  totalSteps: 3,
  excludeFromStorage: ['fileInput', 'fileInputBasic'],
})

// Definition mode
const definitionJson = ref('')
const definitionError = ref<string | null>(null)
const definitionForm = ref<ReturnType<typeof useForm> | null>(null)
const definitionFormData = ref<Record<string, any>>({})

// Comprehensive form definition with ALL input types organized into Simple, Advanced, and Media steps
const exampleDefinition: FormDefinition = {
  id: 'comprehensive-form',
  title: 'Comprehensive Form - All Input Types',
  description: 'A complete form definition showcasing all available input components',
  steps: [
    {
      step: 1,
      title: 'Simple Inputs',
      description: 'Basic text, number, and selection inputs',
      fields: [
        {
          name: 'textInput',
          type: 'text',
          label: 'Text Input',
          placeholder: 'Enter text',
          helpText: 'Basic text input field',
          required: true,
          validation: [
            { type: 'required', message: 'Text input is required' },
            { type: 'minLength', value: 2, message: 'Must be at least 2 characters' },
          ],
        },
        {
          name: 'emailInput',
          type: 'email',
          label: 'Email Input',
          placeholder: 'Enter email address',
          helpText: 'Email input with validation',
          required: true,
          validation: [
            { type: 'required', message: 'Email is required' },
            { type: 'email', message: 'Please enter a valid email address' },
          ],
        },
        {
          name: 'passwordInput',
          type: 'password',
          label: 'Password Input',
          placeholder: 'Enter password',
          helpText: 'Password input with toggle visibility',
          required: true,
          validation: [
            { type: 'required', message: 'Password is required' },
            { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
          ],
        },
        {
          name: 'numberInput',
          type: 'number',
          label: 'Number Input',
          placeholder: 'Enter a number',
          helpText: 'Numeric input with min/max validation',
          validation: [
            { type: 'min', value: 0, message: 'Must be positive' },
            { type: 'max', value: 100, message: 'Must be less than 100' },
          ],
        },
        {
          name: 'telInput',
          type: 'tel',
          label: 'Phone Number',
          placeholder: 'Enter phone number',
          helpText: 'Telephone number input',
        },
        {
          name: 'urlInput',
          type: 'url',
          label: 'Website URL',
          placeholder: 'https://example.com',
          helpText: 'URL input with validation',
          validation: [{ type: 'url', message: 'Please enter a valid URL' }],
        },
        {
          name: 'dateInput',
          type: 'date',
          label: 'Date Input',
          helpText: 'Date picker input',
          required: true,
          validation: [{ type: 'required', message: 'Date is required' }],
        },
        {
          name: 'textareaInput',
          type: 'textarea',
          label: 'Textarea',
          placeholder: 'Enter multi-line text',
          helpText: 'Multi-line text input',
          validation: [{ type: 'maxLength', value: 500, message: 'Maximum 500 characters' }],
        },
        {
          name: 'selectInput',
          type: 'select',
          label: 'Select Input',
          placeholder: 'Select an option',
          helpText: 'Single selection dropdown',
          required: true,
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ],
          validation: [{ type: 'required', message: 'Please select an option' }],
        },
        {
          name: 'checkboxInput',
          type: 'checkbox',
          label: 'Checkbox Input',
          helpText: 'Boolean checkbox input',
          defaultValue: false,
        },
      ],
    },
    {
      step: 2,
      title: 'Advanced Inputs',
      description: 'Composite and specialized input components',
      fields: [
        {
          name: 'dateRange',
          type: 'text', // DateRangeInput is not in FieldType, using text as placeholder
          label: 'Date Range',
          helpText: 'Date range picker (composite component)',
        },
        {
          name: 'tagInput',
          type: 'text', // TagInput is not in FieldType, using text as placeholder
          label: 'Tag Input',
          placeholder: 'Add tags',
          helpText: 'Tag input for multiple values',
        },
        {
          name: 'budgetRange',
          type: 'text', // BudgetRangeInput is not in FieldType, using text as placeholder
          label: 'Budget Range',
          helpText: 'Budget range with min/max/currency',
        },
      ],
    },
    {
      step: 3,
      title: 'Media Inputs',
      description: 'File uploads and media-related inputs',
      fields: [
        {
          name: 'fileInput',
          type: 'file',
          label: 'File Upload',
          helpText: 'Single file upload',
          required: true,
          validation: [{ type: 'required', message: 'File is required' }],
        },
        {
          name: 'fileMultipleInput',
          type: 'file-multiple',
          label: 'Multiple File Upload',
          helpText: 'Multiple file upload',
        },
        {
          name: 'arrayInput',
          type: 'text', // ArrayInput is not in FieldType, using text as placeholder
          label: 'Array Input',
          helpText: 'Array input for structured data',
        },
        {
          name: 'objectInput',
          type: 'text', // ObjectInput is not in FieldType, using text as placeholder
          label: 'Object Input',
          helpText: 'Object input for nested data',
        },
        {
          name: 'jsonInput',
          type: 'text', // JsonInput is not in FieldType, using text as placeholder
          label: 'JSON Input',
          helpText: 'JSON editor input',
        },
      ],
    },
  ],
}

// Validate and parse definition JSON
const isDefinitionValid = computed(() => {
  if (!definitionJson.value.trim()) return false
  try {
    const parsed = JSON.parse(definitionJson.value)
    if (!parsed.id || !parsed.steps || !Array.isArray(parsed.steps)) {
      return false
    }
    definitionError.value = null
    return true
  } catch (err) {
    definitionError.value = err instanceof Error ? err.message : 'Invalid JSON'
    return false
  }
})

// Get current step definition
const currentStepDefinition = computed(() => {
  if (!definitionForm.value) return null
  const stepDef = definitionForm.value.getCurrentStepDefinition?.()
  return stepDef || null
})

// Get visible fields for current step
const visibleFields = computed(() => {
  if (!currentStepDefinition.value) return []
  return currentStepDefinition.value.fields.filter((field) => {
    if (!definitionForm.value) return true
    return definitionForm.value.isFieldVisibleInStep?.(field.name) ?? true
  })
})

// Watch definition JSON and update preview
watch(
  [definitionJson, isDefinitionValid],
  () => {
    if (isDefinitionValid.value) {
      try {
        const definition: FormDefinition = JSON.parse(definitionJson.value)
        definitionForm.value = useForm({ formId: definition.id, definition })
        if (definitionForm.value) {
          definitionFormData.value = definitionForm.value.formData as Record<string, any>
        }
      } catch (error) {
        console.error('Error creating form from definition:', error)
      }
    }
  },
  { immediate: false },
)

// Load example definition
const loadExampleDefinition = () => {
  definitionJson.value = JSON.stringify(exampleDefinition, null, 2)
  definitionError.value = null
}

// Save definition to localStorage
const saveDefinition = () => {
  if (!isDefinitionValid.value) {
    toast.push({ type: 'error', message: 'Please fix errors before saving' })
    return
  }
  try {
    localStorage.setItem('form_definition_editor', definitionJson.value)
    toast.push({ type: 'success', message: 'Definition saved successfully' })
  } catch {
    toast.push({ type: 'error', message: 'Failed to save definition' })
  }
}

// Load definition from localStorage
const loadDefinition = () => {
  try {
    const saved = localStorage.getItem('form_definition_editor')
    if (saved) {
      definitionJson.value = saved
      toast.push({ type: 'success', message: 'Definition loaded successfully' })
    } else {
      toast.push({ type: 'info', message: 'No saved definition found' })
    }
  } catch {
    toast.push({ type: 'error', message: 'Failed to load definition' })
  }
}

// Apply definition (recreate form)
const applyDefinition = () => {
  if (!isDefinitionValid.value) {
    toast.push({ type: 'error', message: 'Please fix errors before applying' })
    return
  }
  try {
    const definition: FormDefinition = JSON.parse(definitionJson.value)
    definitionForm.value = useForm({ formId: definition.id, definition })
    if (definitionForm.value) {
      definitionFormData.value = definitionForm.value.formData as Record<string, any>
    }
    toast.push({ type: 'success', message: 'Definition applied successfully' })
  } catch {
    toast.push({ type: 'error', message: 'Failed to apply definition' })
  }
}

// Computed form data for test mode
const formData = computed({
  get: () => form.formData,
  set: (value) => {
    Object.keys(value).forEach((key) => {
      form.setField(key as any, (value as any)[key])
    })
  },
})

// Select options
const selectOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

// Get component for field type
const getFieldComponent = (type: string) => {
  switch (type) {
    case 'text':
    case 'tel':
    case 'url':
    case 'search':
      return TextInput
    case 'email':
      return EmailInput
    case 'password':
      return PasswordInput
    case 'number':
      return NumberInput
    case 'date':
    case 'datetime':
      return DateInput
    case 'textarea':
      return Textarea
    case 'select':
    case 'multiselect':
      return SelectInput
    case 'checkbox':
      return Checkbox
    case 'file':
    case 'file-multiple':
      return FileUpload
    default:
      return TextInput
  }
}

// Sidebar form config (for DynamicFormSidebar)
const sidebarFormConfig = computed(() => ({
  fields: [],
}))

// Handle sidebar submit
const handleSidebarSubmit = (data: Record<string, unknown>) => {
  toast.push({ type: 'success', message: 'Form submitted from sidebar' })
  console.log('Sidebar form data:', data)
}

// Handle modal complete
const handleModalComplete = () => {
  toast.push({ type: 'success', message: 'Form completed in modal' })
  console.log('Modal form data:', form.getFormData())
  displayMode.value = 'inline'
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
  overflow: hidden;
}
</style>
