# Toast Library

Centralized toast notification system with declarative API and reactive state management.

## Structure

```
src/lib/toast/
├── composable/          # Toast composables
│   ├── useToast.ts      # Main toast composable
│   └── index.ts         # Re-exports
├── component/           # Toast components
│   ├── Toast.vue        # Individual toast component
│   ├── ToastContainer.vue  # Container for multiple toasts
│   └── index.ts         # Re-exports
├── type/                # TypeScript types
│   └── index.ts         # All toast-related types
├── index.ts             # Main entry point
└── README.md            # Documentation
```

## Usage

### Basic Usage

```typescript
import { useToast } from '@/lib/toast'

const toast = useToast()

// Show a success toast
toast.success('Operation completed successfully!')

// Show an error toast
toast.error('Something went wrong', 'Error')

// Show a warning toast
toast.warning('Please check your input')

// Show an info toast
toast.info('New message received')
```

### Using ToastContainer Component

```vue
<template>
  <ToastContainer />
</template>

<script setup lang="ts">
import { ToastContainer } from '@/lib/toast'
</script>
```

The `ToastContainer` should be placed once in your root component (e.g., `App.vue`) to display all toasts.

### Advanced Usage

```typescript
import { useToast } from '@/lib/toast'

const toast = useToast()

// Add a custom toast with action
toast.addToast({
  type: 'info',
  title: 'New Update Available',
  message: 'A new version is available. Would you like to update?',
  duration: 0, // Persistent
  action: {
    label: 'Update Now',
    variant: 'primary',
    onClick: () => {
      // Handle update
    },
  },
})
```

## Features

- ✅ Multiple toast types (success, error, warning, info)
- ✅ Automatic dismissal with configurable duration
- ✅ Persistent toasts (no auto-dismiss)
- ✅ Action buttons on toasts
- ✅ Smooth animations
- ✅ Accessible (ARIA labels)
- ✅ Reactive state management
- ✅ Type-safe with TypeScript

## API

### useToast()

Returns an object with the following methods:

- `addToast(options: ToastOptions): string` - Add a toast, returns toast ID
- `removeToast(id: string): void` - Remove a toast by ID
- `clearAllToasts(): void` - Clear all toasts
- `success(message: string, title?: string, options?: Partial<ToastOptions>): string`
- `error(message: string, title?: string, options?: Partial<ToastOptions>): string`
- `warning(message: string, title?: string, options?: Partial<ToastOptions>): string`
- `info(message: string, title?: string, options?: Partial<ToastOptions>): string`
- `push(options: ToastOptions): string` - Alias for `addToast`

### ToastOptions

```typescript
interface ToastOptions {
  id?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message?: string
  duration?: number // Milliseconds (0 = persistent)
  persistent?: boolean
  action?: {
    label: string
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    onClick?: () => void
  }
}
```

## Components

### ToastContainer

Container component that displays all active toasts. Should be placed once in your root component.

**Props:** None (uses global toast state)

**Features:**

- Fixed positioning (top-right on desktop, bottom on mobile)
- Transition animations
- Automatic toast management

### Toast

Individual toast component (usually not used directly).

## Examples

### Global Toast Instance

```typescript
import { toast } from '@/lib/toast'

// Use the global instance anywhere
toast.success('Saved!')
```

### In a Composable

```typescript
import { useToast } from '@/lib/toast'

export function useMyFeature() {
  const toast = useToast()

  const saveData = async () => {
    try {
      await api.save()
      toast.success('Data saved successfully')
    } catch (error) {
      toast.error('Failed to save data')
    }
  }

  return { saveData }
}
```

## Migration from Old Components

### Before

```vue
<script setup>
import ToastContainer from '@/components/organisms/ToastContainer.vue'
import { useToast } from '@/composables/useToast'
</script>
```

### After

```vue
<script setup>
import { ToastContainer, useToast } from '@/lib/toast'
</script>
```
