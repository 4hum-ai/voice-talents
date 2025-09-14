# Enhanced Components with Slot System

This document describes the enhanced components that have been upgraded with comprehensive slot systems for advanced customization.

## Overview

The following components have been enhanced with slot systems to provide maximum flexibility while maintaining backward compatibility:

- **MetricCard** - Enhanced with slots for custom layouts, headers, content, and footers
- **DynamicFormSidebar** - Enhanced with slots for custom headers, form fields, and actions
- **StatusBadge** - Enhanced with slots for custom icons, content, and actions

## MetricCard Enhanced Slots

### Available Slots

| Slot Name  | Props                                                                                                                    | Description             |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| `header`   | `title`, `icon`, `iconClasses`, `sizeClasses`, `trend`, `trendIcon`, `trendIconClasses`, `trendText`, `trendTextClasses` | Complete header section |
| `icon`     | `icon`, `iconClasses`, `sizeClasses`                                                                                     | Icon section only       |
| `title`    | `title`, `sizeClasses`                                                                                                   | Title section only      |
| `trend`    | `trend`, `trendIcon`, `trendIconClasses`, `trendText`, `trendTextClasses`                                                | Trend indicator section |
| `content`  | `value`, `formattedValue`, `subtitle`, `sizeClasses`                                                                     | Main content area       |
| `value`    | `value`, `formattedValue`, `sizeClasses`                                                                                 | Value display only      |
| `subtitle` | `subtitle`, `sizeClasses`                                                                                                | Subtitle section only   |
| `footer`   | `value`, `trend`, `title`                                                                                                | Footer section          |

### New Props

- `customClass?: string` - Additional CSS classes for the root element

### Example Usage

```vue
<template>
  <!-- Basic usage (unchanged) -->
  <MetricCard
    title="Total Revenue"
    :value="125000"
    subtitle="Last 30 days"
    icon="mdi:currency-usd"
    :trend="{ value: 12.5, direction: 'up', period: 'vs last month' }"
  />

  <!-- Custom header with enhanced styling -->
  <MetricCard
    title="Active Users"
    :value="2847"
    subtitle="Currently online"
    icon="mdi:account-group"
    custom-class="border-l-4 border-l-green-500"
  >
    <template #header="{ title, trend, trendText, trendIconClasses }">
      <div class="mb-3 flex items-start justify-between">
        <div class="flex items-center gap-2">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900"
          >
            <Icon name="mdi:account-group" class="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ title }}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Real-time data</p>
          </div>
        </div>
        <div v-if="trend" class="flex items-center gap-1">
          <div class="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
          <span :class="['text-xs font-medium', trendIconClasses]">{{ trendText }}</span>
        </div>
      </div>
    </template>
  </MetricCard>

  <!-- Custom content with chart -->
  <MetricCard
    title="Conversion Rate"
    :value="3.2"
    subtitle="Average across campaigns"
    icon="mdi:chart-line"
  >
    <template #content="{ formattedValue, subtitle, sizeClasses }">
      <div class="space-y-3">
        <div class="flex items-baseline gap-2">
          <span :class="['font-bold text-gray-900 dark:text-gray-100', sizeClasses.value]">
            {{ formattedValue }}%
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400">avg</span>
        </div>

        <!-- Mini chart -->
        <div class="flex h-12 items-end gap-1 rounded bg-gray-100 p-2 dark:bg-gray-800">
          <div class="flex-1 rounded-t bg-blue-500" style="height: 60%"></div>
          <div class="flex-1 rounded-t bg-blue-500" style="height: 80%"></div>
          <div class="flex-1 rounded-t bg-blue-500" style="height: 45%"></div>
          <div class="flex-1 rounded-t bg-blue-500" style="height: 90%"></div>
          <div class="flex-1 rounded-t bg-blue-500" style="height: 70%"></div>
        </div>

        <p v-if="subtitle" :class="['text-gray-500 dark:text-gray-400', sizeClasses.subtitle]">
          {{ subtitle }}
        </p>
      </div>
    </template>
  </MetricCard>

  <!-- Custom footer with progress bar -->
  <MetricCard title="Storage Used" :value="75" subtitle="of 100GB total" icon="mdi:harddisk">
    <template #footer="{ value }">
      <div class="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="mr-3 h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              class="h-2 rounded-full bg-blue-600 transition-all duration-300"
              :style="{ width: `${value}%` }"
            ></div>
          </div>
          <button
            class="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Upgrade
          </button>
        </div>
      </div>
    </template>
  </MetricCard>
</template>
```

## DynamicFormSidebar Enhanced Slots

### Available Slots

| Slot Name       | Props                                                             | Description             |
| --------------- | ----------------------------------------------------------------- | ----------------------- |
| `header`        | `title`, `loading`, `handlers`                                    | Complete header section |
| `title`         | `title`                                                           | Title section only      |
| `close-button`  | `handlers`                                                        | Close button section    |
| `content`       | `formData`, `errors`, `resolvedForm`, `loading`, `handlers`       | Main content area       |
| `form-fields`   | `formData`, `errors`, `resolvedForm`, `handlers`                  | Form fields section     |
| `footer`        | `loading`, `isFormValid`, `submitText`, `loadingText`, `handlers` | Footer section          |
| `actions`       | `loading`, `isFormValid`, `submitText`, `loadingText`, `handlers` | Actions section         |
| `cancel-button` | `handlers`                                                        | Cancel button section   |
| `submit-button` | `loading`, `isFormValid`, `submitText`, `loadingText`, `handlers` | Submit button section   |

### Example Usage

```vue
<template>
  <!-- Basic usage (unchanged) -->
  <DynamicFormSidebar
    title="Create New Item"
    :form-config="formConfig"
    :initial-data="formData"
    submit-text="Submit"
    loading-text="Submitting..."
    @close="handleClose"
    @submit="handleSubmit"
  />

  <!-- Custom header with gradient background -->
  <DynamicFormSidebar
    title="Advanced Settings"
    :form-config="formConfig"
    :initial-data="formData"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <template #header="{ title, handlers }">
      <div
        class="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900 dark:from-blue-900/20 dark:to-indigo-900/20"
      >
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ title }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Configure advanced options</p>
        </div>
        <button
          class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          @click="handlers.close"
        >
          ✕
        </button>
      </div>
    </template>
  </DynamicFormSidebar>

  <!-- Custom form fields with sections -->
  <DynamicFormSidebar
    title="Custom Form"
    :form-config="formConfig"
    :initial-data="formData"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <template #form-fields="{ formData, errors, resolvedForm, handlers }">
      <div class="space-y-6 px-6 py-6">
        <!-- Custom field section -->
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <h4 class="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
            Custom Configuration
          </h4>
          <div class="space-y-4">
            <div v-for="field in resolvedForm.fields" :key="field.key">
              <FormInput
                v-if="['text', 'email', 'url', 'number'].includes(field.type)"
                v-model="formData[field.key] as string"
                :type="field.type === 'number' ? 'number' : (field.type as 'text' | 'email' | 'url')"
                :label="field.label"
                :placeholder="field.placeholder"
                :required="field.required"
                :error="errors[field.key]"
                @blur="handlers.blur(field)"
                @input="handlers.input(field)"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </DynamicFormSidebar>

  <!-- Custom actions with additional buttons -->
  <DynamicFormSidebar
    title="Form with Custom Actions"
    :form-config="formConfig"
    :initial-data="formData"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <template #actions="{ loading, isFormValid, submitText, loadingText, handlers }">
      <div class="flex items-center justify-between space-x-3">
        <button
          type="button"
          class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          @click="handlers.close"
        >
          Cancel
        </button>
        <div class="flex space-x-3">
          <button
            type="button"
            class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            @click="handlePreview"
          >
            Preview
          </button>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
            @click="handlers.submit"
          >
            <span v-if="loading">{{ loadingText }}</span>
            <span v-else>{{ submitText }}</span>
          </button>
        </div>
      </div>
    </template>
  </DynamicFormSidebar>
</template>
```

## StatusBadge Enhanced Slots

### Available Slots

| Slot Name | Props                             | Description           |
| --------- | --------------------------------- | --------------------- |
| `dot`     | `status`, `size`, `showDot`       | Status dot section    |
| `content` | `status`, `label`                 | Main content area     |
| `icon`    | `status`, `size`, `statusClasses` | Icon section          |
| `action`  | `status`, `label`                 | Action button section |

### New Props

- `customClass?: string` - Additional CSS classes for the root element

### Example Usage

```vue
<template>
  <!-- Basic usage (unchanged) -->
  <StatusBadge status="active" label="Active" />
  <StatusBadge status="pending" label="Pending Review" />
  <StatusBadge status="error" label="Failed" />

  <!-- Custom icon -->
  <StatusBadge status="published" label="Published" variant="outline">
    <template #icon>
      <Icon name="mdi:check-circle" class="mr-1 h-3 w-3" />
    </template>
  </StatusBadge>

  <StatusBadge status="draft" label="Draft" variant="soft">
    <template #icon>
      <Icon name="mdi:file-edit" class="mr-1 h-3 w-3" />
    </template>
  </StatusBadge>

  <StatusBadge status="processing" label="Processing" variant="solid">
    <template #icon>
      <Icon name="mdi:loading" class="mr-1 h-3 w-3 animate-spin" />
    </template>
  </StatusBadge>

  <!-- Custom action button -->
  <StatusBadge status="needs_review" label="Needs Review" variant="outline">
    <template #action="{ status }">
      <button
        class="ml-2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        @click="handleReview(status)"
      >
        Review
      </button>
    </template>
  </StatusBadge>

  <StatusBadge status="suspended" label="Suspended" variant="soft">
    <template #action="{ status }">
      <button
        class="ml-2 text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
        @click="handleUnsuspend(status)"
      >
        Unsuspend
      </button>
    </template>
  </StatusBadge>

  <!-- Custom content with additional information -->
  <StatusBadge status="completed" label="Completed" variant="soft">
    <template #content="{ status, label }">
      <div class="flex items-center gap-1">
        <Icon name="mdi:check-circle" class="h-3 w-3" />
        <span>{{ label }}</span>
        <span class="text-xs opacity-75">(2 min ago)</span>
      </div>
    </template>
  </StatusBadge>
</template>

<script setup lang="ts">
function handleReview(status: string) {
  console.log('Review requested for status:', status)
}

function handleUnsuspend(status: string) {
  console.log('Unsuspend requested for status:', status)
}
</script>
```

## Design System Integration

The enhanced components are fully integrated into the design system showcase at `/admin/design`. You can:

1. **Interactive Testing**: Use the live preview to test different prop combinations
2. **Slot Examples**: See real examples of custom slot implementations
3. **JSON Configuration**: Edit component props using the JSON editor
4. **Individual Controls**: Fine-tune specific properties with dedicated controls

## Migration Guide

### Backward Compatibility

All enhanced components maintain 100% backward compatibility. Existing usage will continue to work without any changes.

### Upgrading to Use Slots

To take advantage of the new slot system:

1. **Identify customization needs**: Determine which parts of the component need custom styling or behavior
2. **Choose appropriate slots**: Select the most specific slot that meets your needs
3. **Implement custom content**: Use the provided props to access component data and styling
4. **Test thoroughly**: Ensure your custom implementation works across different states and themes

### Best Practices

1. **Use the most specific slot**: Prefer specific slots (e.g., `icon`, `title`) over general ones (e.g., `header`) when possible
2. **Leverage provided props**: Use the styling props (`sizeClasses`, `statusClasses`, etc.) for consistent theming
3. **Maintain accessibility**: Ensure custom content maintains proper ARIA labels and keyboard navigation
4. **Test responsive behavior**: Verify custom implementations work across different screen sizes
5. **Follow design system**: Use existing design tokens and components when building custom content

## Performance Considerations

- **Slot rendering**: Slots are only rendered when content is provided, maintaining optimal performance
- **Prop passing**: All props are passed by reference, minimizing unnecessary re-renders
- **Conditional rendering**: Use `v-if` appropriately to avoid rendering unused slot content
- **Event handling**: Leverage the provided handler functions to maintain proper event flow

## Future Enhancements

The slot system provides a foundation for future enhancements:

- **Additional slots**: New slots can be added without breaking existing implementations
- **Enhanced props**: More styling and behavior props can be exposed through slots
- **Composition patterns**: Complex custom layouts can be built using multiple slots together
- **Theme integration**: Slots can be enhanced to better integrate with the design system theme
