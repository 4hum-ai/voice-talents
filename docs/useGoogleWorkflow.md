# useGoogleWorkflow Composable

A Vue 3 composable for managing Google Cloud Workflows with reactive state management, similar to `useResourceService`.

## Features

- **Workflow Management**: Create, read, update, and delete workflows
- **Execution Management**: Start, monitor, and cancel workflow executions
- **Reactive State**: Automatic UI updates with Vue's reactivity system
- **Loading States**: Track operation progress with granular loading indicators
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **TypeScript Support**: Full type safety with Google Workflows API types

## Setup

### Environment Variables

Add these environment variables to your `.env` file:

```bash
# Google Cloud Workflows
VITE_GOOGLE_CLOUD_PROJECT=your-project-id
VITE_GOOGLE_CLOUD_LOCATION=us-central1
```

### Authentication

The composable uses `useApiGateway` which handles authentication through your existing API gateway setup. Make sure your API gateway is configured to authenticate with Google Cloud Workflows API.

## Usage

### Basic Usage

```typescript
import { useGoogleWorkflow } from '@/composables/useGoogleWorkflow'

export default {
  setup() {
    const workflowApi = useGoogleWorkflow()

    return {
      workflowApi,
    }
  },
}
```

### Workflow Management

```typescript
// List all workflows
const workflows = await workflowApi.listWorkflows()

// Get a specific workflow
const workflow = await workflowApi.getWorkflow('my-workflow-id')

// Create a new workflow
const newWorkflow = await workflowApi.createWorkflow({
  name: 'my-new-workflow',
  description: 'A sample workflow',
  sourceContents: `
    - init:
        assign:
          - message: "Hello World"
    - return:
        return: ${message}
  `,
})

// Update a workflow
const updatedWorkflow = await workflowApi.updateWorkflow('my-workflow-id', {
  description: 'Updated description',
})

// Delete a workflow
await workflowApi.deleteWorkflow('my-workflow-id')
```

### Workflow Executions

```typescript
// List executions for a workflow
const executions = await workflowApi.listExecutions('my-workflow-id')

// Get a specific execution
const execution = await workflowApi.getExecution('my-workflow-id', 'execution-id')

// Start a new execution
const newExecution = await workflowApi.createExecution('my-workflow-id', {
  input: 'Hello from execution',
})

// Cancel a running execution
const cancelledExecution = await workflowApi.cancelExecution('my-workflow-id', 'execution-id')
```

### Reactive State

```vue
<template>
  <div>
    <!-- Loading states -->
    <div v-if="workflowApi.isLoading">Loading...</div>
    <div v-if="workflowApi.isOperationLoading('list:workflows')">Loading workflows...</div>

    <!-- Error handling -->
    <div v-if="workflowApi.hasError" class="error">
      {{ workflowApi.error }}
    </div>

    <!-- Workflows list -->
    <div v-if="workflowApi.hasWorkflows">
      <div v-for="workflow in workflowApi.workflows" :key="workflow.name">
        {{ workflow.name }} - {{ workflow.state }}
      </div>
    </div>

    <!-- Executions list -->
    <div v-if="workflowApi.hasExecutions">
      <div v-for="execution in workflowApi.executions" :key="execution.name">
        {{ execution.name }} - {{ execution.state }}
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="workflowApi.isEmpty">No workflows or executions found</div>
  </div>
</template>

<script setup lang="ts">
import { useGoogleWorkflow } from '@/composables/useGoogleWorkflow'

const workflowApi = useGoogleWorkflow()

// Load workflows on component mount
onMounted(async () => {
  try {
    await workflowApi.listWorkflows()
  } catch (error) {
    console.error('Failed to load workflows:', error)
  }
})
</script>
```

### Advanced Usage

```typescript
// With custom base name
const customWorkflowApi = useGoogleWorkflow('custom-workflows')

// With query parameters
const workflows = await workflowApi.listWorkflows({
  page: 1,
  limit: 10,
  filter: 'state=ACTIVE',
})

// With AbortController for cancellation
const controller = new AbortController()
try {
  const workflows = await workflowApi.listWorkflows({}, controller.signal)
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request was cancelled')
  }
}
// Later: controller.abort()

// Clear data when component unmounts
onUnmounted(() => {
  workflowApi.clearData()
})
```

## API Reference

### Methods

#### Workflow Management

- `listWorkflows(query?, signal?)` - List workflows with optional query parameters
- `getWorkflow(workflowId, signal?)` - Get a specific workflow by ID
- `createWorkflow(workflow, signal?)` - Create a new workflow
- `updateWorkflow(workflowId, updates, signal?)` - Update an existing workflow
- `deleteWorkflow(workflowId, signal?)` - Delete a workflow

#### Execution Management

- `listExecutions(workflowId, query?, signal?)` - List executions for a workflow
- `getExecution(workflowId, executionId, signal?)` - Get a specific execution
- `createExecution(workflowId, argument?, signal?)` - Start a new execution
- `cancelExecution(workflowId, executionId, signal?)` - Cancel a running execution

#### Utilities

- `isOperationLoading(operation)` - Check if a specific operation is loading
- `clearError()` - Clear the current error state
- `clearData()` - Reset all data to initial state

### Reactive Properties

- `isLoading` - Boolean indicating if any operation is loading
- `workflows` - Array of workflows from list operations
- `workflow` - Single workflow from get operations
- `executions` - Array of executions from list operations
- `execution` - Single execution from get operations
- `pagination` - Pagination metadata
- `error` - Current error message

### Computed Properties

- `hasWorkflows` - Boolean indicating if there are workflows
- `hasExecutions` - Boolean indicating if there are executions
- `isEmpty` - Boolean indicating if no items and not loading
- `hasError` - Boolean indicating if there's an error

## Types

```typescript
interface WorkflowDefinition {
  name?: string
  description?: string
  sourceContents?: string
  serviceAccount?: string
  labels?: Record<string, string>
  state?: 'ACTIVE' | 'INACTIVE'
}

interface Workflow {
  name: string
  description?: string
  state: 'ACTIVE' | 'INACTIVE'
  revisionId: string
  createTime: string
  updateTime: string
  labels?: Record<string, string>
  serviceAccount?: string
  sourceContents?: string
}

interface WorkflowExecution {
  name: string
  state: 'ACTIVE' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED'
  argument?: string
  result?: string
  error?: {
    code: number
    message: string
    details?: unknown[]
  }
  startTime: string
  endTime?: string
  duration?: string
  workflowRevision?: string
  labels?: Record<string, string>
}
```

## Error Handling

The composable provides comprehensive error handling:

```typescript
try {
  await workflowApi.createWorkflow(workflowDefinition)
} catch (error) {
  if (error.message.includes('Google Cloud configuration missing')) {
    // Handle missing environment variables
  } else if (error.message.includes('Unable to reach Google Workflows API')) {
    // Handle connectivity issues
  } else {
    // Handle other errors
    console.error('Workflow creation failed:', error)
  }
}
```

## Best Practices

1. **Environment Variables**: Always set the required Google Cloud environment variables
2. **Error Handling**: Always wrap API calls in try-catch blocks
3. **Loading States**: Use the reactive loading states to provide user feedback
4. **Cleanup**: Call `clearData()` when components unmount to prevent memory leaks
5. **Cancellation**: Use AbortController for long-running operations that might need cancellation
6. **Type Safety**: Use TypeScript interfaces for better development experience
