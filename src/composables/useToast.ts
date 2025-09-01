import { IToastMessage, ToastTheme } from "@/types/toast";
import { ref, Ref } from "vue";

/** Reactive array of toast messages */
const messages: Ref<IToastMessage[]> = ref([]);

/** Current toast theme */
export const theme: ToastTheme = "light";

/**
 * Toast notification composable for managing application-wide toast messages
 *
 * @returns Toast service with methods to add, remove, and clear toast messages
 *
 * @example
 * ```typescript
 * const toast = useToast();
 *
 * // Show a success toast
 * toast.push({
 *   id: 'success-1',
 *   type: 'success',
 *   title: 'Success!',
 *   body: 'Operation completed successfully',
 *   position: 'tr',
 *   timeout: 5000
 * });
 *
 * // Show an error toast
 * toast.push({
 *   id: 'error-1',
 *   type: 'error',
 *   title: 'Error',
 *   body: 'Something went wrong',
 *   position: 'tr',
 *   timeout: 0 // No auto-dismiss
 * });
 *
 * // Remove a specific toast
 * toast.remove('success-1');
 *
 * // Clear all toasts
 * toast.clear();
 * ```
 */
export const useToast = () => {
  /**
   * Add a new toast message to the queue
   * @param message - Toast message object with id, type, title, body, and optional properties
   *
   * @example
   * ```typescript
   * toast.push({
   *   id: 'unique-id',
   *   type: 'info',
   *   title: 'Information',
   *   body: 'This is an informational message',
   *   position: 'tr', // top-right
   *   timeout: 3000
   * });
   * ```
   */
  const push = (message: IToastMessage) => {
    messages.value.push(message);
  };

  /**
   * Remove a specific toast message by ID
   * @param id - Unique identifier of the toast message to remove
   *
   * @example
   * ```typescript
   * toast.remove('my-toast-id');
   * ```
   */
  const remove = (id: string) => {
    messages.value = messages.value.filter((msg) => msg.id !== id);
  };

  /**
   * Clear all toast messages
   *
   * @example
   * ```typescript
   * toast.clear();
   * ```
   */
  const clear = () => {
    messages.value = [];
  };

  return {
    /** Clear all toast messages */
    clear,
    /** Add a new toast message */
    push,
    /** Remove a specific toast message by ID */
    remove,
    /** Reactive array of all toast messages */
    messages,
  };
};
