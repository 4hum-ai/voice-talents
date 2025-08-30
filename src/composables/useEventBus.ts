import { onBeforeUnmount } from "vue";

type EventHandler<T = any> = (payload: T) => void;

class SimpleEventBus {
  private listeners: Map<string, Set<EventHandler>> = new Map();

  on<T = any>(event: string, handler: EventHandler<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler as EventHandler);
    return () => this.off(event, handler as EventHandler);
  }

  off(event: string, handler: EventHandler): void {
    const set = this.listeners.get(event);
    if (!set) return;
    set.delete(handler);
    if (set.size === 0) this.listeners.delete(event);
  }

  emit<T = any>(event: string, payload: T): void {
    const set = this.listeners.get(event);
    if (!set) return;
    // Clone to avoid mutation during iteration
    Array.from(set).forEach((handler) => {
      try {
        (handler as EventHandler<T>)(payload);
      } catch {
        /* ignore handler errors */
      }
    });
  }
}

let bus: SimpleEventBus | null = null;

export function useEventBus() {
  if (!bus) bus = new SimpleEventBus();

  const on = <T = any>(event: string, handler: EventHandler<T>) => {
    const off = bus!.on<T>(event, handler);
    // Auto-unsubscribe when composable owner unmounts (if used in components)
    try {
      onBeforeUnmount(() => off());
    } catch {
      /* called outside component setup */
    }
    return off;
  };

  const off = (event: string, handler: EventHandler) => bus!.off(event, handler);
  const emit = <T = any>(event: string, payload: T) => bus!.emit<T>(event, payload);

  return { on, off, emit };
}

// Typed helper for CRUD channel
export type CrudAction = "create" | "update" | "delete";
export interface CrudEventPayload {
  module: string;
  id: string;
  action: CrudAction;
  beforeData?: any;
  afterData?: any;
  at: number;
}



