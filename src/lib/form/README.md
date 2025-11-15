# Form Library

Centralized form management system with declarative form definitions (Typeform/Tripetto-style).

## Structure

```
src/lib/form/
├── composable/          # Form composables
│   ├── useForm.ts       # Main form composable
│   ├── useFormDefinition.ts  # Form definition schema & utilities
│   ├── validation.ts  # Zod-based validation system
│   └── index.ts         # Re-exports
├── type/                # TypeScript types
│   └── index.ts         # All form-related types
├── component/           # Form components
│   ├── input/           # All input components
│   │   ├── TextInput.vue
│   │   ├── EmailInput.vue
│   │   ├── PasswordInput.vue
│   │   ├── NumberInput.vue
│   │   ├── DateInput.vue
│   │   ├── SelectInput.vue
│   │   ├── Textarea.vue
│   │   ├── Checkbox.vue
│   │   ├── FileUpload.vue
│   │   ├── FileInput.vue
│   │   ├── DateRangeInput.vue
│   │   ├── TagInput.vue
│   │   ├── BudgetRangeInput.vue
│   │   ├── ArrayInput.vue
│   │   ├── ObjectInput.vue
│   │   └── JsonInput.vue
│   ├── layout/          # Layout components
│   │   └── FormSection.vue
│   ├── util/            # Utilities
│   │   ├── BaseFormInput.ts
│   │   ├── DynamicInput.vue
│   │   └── FormInput.vue (deprecated)
│   └── index.ts         # Re-exports (public API)
├── view/                # Form test/view pages
│   └── form.vue         # Test page for all form components
└── index.ts             # Main entry point
```

## Standard Error Handling

All form input components follow a **standard error pattern**:

### Pattern

1. **All inputs accept `error` prop** (from `BaseFormInputProps`):

   ```typescript
   interface BaseFormInputProps {
     error?: string // Error message to display
     // ... other props
   }
   ```

2. **Form layer provides `getFieldError()` method**:

   ```typescript
   const form = useForm({ ... })
   form.getFieldError('fieldName') // Returns string | undefined
   ```

3. **Standard usage in templates**:

   ```vue
   <TextInput v-model="formData.email" label="Email" :error="form.getFieldError('email')" />
   ```

4. **Components automatically**:
   - Display error message below input when `error` prop is set
   - Apply error styling (red border, error state)
   - Hide help text when error is present
   - Show error with consistent styling

### Example

```vue
<template>
  <EmailInput
    v-model="formData.email"
    label="Email Address"
    :error="form.getFieldError('email')"
    required
  />
</template>

<script setup lang="ts">
const form = useForm({
  formId: 'signup',
  initialValues: { email: '' },
  stepValidators: {
    1: (data) => {
      if (!data.email) return 'Email is required'
      if (!data.email.includes('@')) return 'Invalid email format'
      return true
    },
  },
})
</script>
```

When validation fails, the error message is automatically displayed below the input with red styling.

## Usage

### Declarative Approach (Recommended)

```typescript
import { useForm } from '@/lib/form'
import type { FormDefinition } from '@/lib/form'

const formDefinition: FormDefinition = {
  id: 'my-form',
  steps: [
    {
      step: 1,
      title: 'Step 1',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
          validation: [
            { type: 'required', message: 'Title is required' },
            { type: 'minLength', value: 3 },
          ],
        },
      ],
    },
  ],
}

const form = useForm({
  definition: formDefinition,
})
```

### Imperative Approach

```typescript
import { useForm } from '@/lib/form'

const form = useForm({
  formId: 'my-form',
  initialValues: {
    title: '',
    description: '',
  },
  stepValidators: {
    1: (data) => !!data.title || 'Title is required',
  },
  totalSteps: 2,
})
```

## Features

- ✅ Declarative form definitions (Typeform/Tripetto-style)
- ✅ **Zod-based validation** - Industry-standard validation library with type safety
- ✅ Built-in validation rules (required, email, url, minLength, maxLength, min, max, pattern, custom)
- ✅ Multi-step form support
- ✅ Field dependencies (conditional visibility)
- ✅ localStorage persistence
- ✅ Type-safe with TypeScript
- ✅ Reactive form state

## Validation

The form library uses **Zod** for validation, providing robust, type-safe validation with excellent error messages.

### Supported Validation Rules

- `required` - Field must have a value
- `minLength` - Minimum string length
- `maxLength` - Maximum string length
- `min` - Minimum number value
- `max` - Maximum number value
- `pattern` - Regex pattern matching
- `email` - Valid email format
- `url` - Valid URL format
- `custom` - Custom validator function with access to formData

### Validation Example

```typescript
{
  name: 'email',
  type: 'email',
  label: 'Email Address',
  required: true,
  validation: [
    { type: 'required', message: 'Email is required' },
    { type: 'email', message: 'Please enter a valid email' },
    { type: 'minLength', value: 5, message: 'Email must be at least 5 characters' },
  ],
}
```

Custom validators can access the entire form data:

```typescript
{
  name: 'password',
  type: 'password',
  validation: [
    {
      type: 'custom',
      validator: (value, formData) => {
        if (value !== formData.passwordConfirm) {
          return 'Passwords do not match'
        }
        return true
      },
    },
  ],
}
```

## Components

Form components are re-exported from `src/lib/form/component/` for easy access:

```typescript
import { FormInput, SelectInput, FileUpload, Textarea } from '@/lib/form'
```

### Available Components

**Core Inputs:**

- `FormInput` - Text, email, password, number, etc.
- `SelectInput` - Dropdown select
- `Textarea` - Multi-line text input
- `Checkbox` - Checkbox input
- `FileUpload` - File upload with drag & drop
- `FileInput` - Basic file input

**Advanced Inputs:**

- `DateRangeInput` - Date range picker
- `TagInput` - Tag/chip input
- `BudgetRangeInput` - Budget range selector
- `FormSection` - Form section wrapper

**Specialized:**

- `ArrayInput` - Array/list input
- `ObjectInput` - Object/nested input
- `JsonInput` - JSON editor input

### Component Usage

```vue
<template>
  <FormInput v-model="formData.title" label="Title" :error="form.getFieldError('title')" required />

  <SelectInput
    v-model="formData.type"
    :options="typeOptions"
    label="Type"
    :error="form.getFieldError('type')"
  />
</template>

<script setup>
import { useForm, FormInput, SelectInput } from '@/lib/form'

const form = useForm({ ... })
</script>
```

**Note:** Components are currently located in `src/components/atoms/` and `src/components/molecules/` but are re-exported through the form library for convenience. They can be moved to `src/lib/form/component/` in the future if needed.
