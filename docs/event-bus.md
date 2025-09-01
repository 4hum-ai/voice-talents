### Event Bus

This project uses VueUse's `useEventBus` for lightweight, decoupled pub/sub across components and composables. Use it directly with shared constants/types from `src/types/events.ts`.

#### Channels

For the definitive list of channels, payloads, publishers, and consumers, see `src/types/events.ts`.

#### Usage

Use VueUse directly with shared types:

```ts
import { useEventBus } from '@vueuse/core'
import { EVENT_HTTP_ACTIVE, type HttpActivePayload } from '@/types/events'

const activeBus = useEventBus<HttpActivePayload>(EVENT_HTTP_ACTIVE)

// emit
activeBus.emit({ active: 3 })

// listen
const off = activeBus.on(({ active }) => {
  // ...
})
off()
```

For new channels, add constants and types in `src/types/events.ts` and document them here.
