import { ref, watch } from "vue";

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    void 0;
  }
}

function safeRemove(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    void 0;
  }
}

export function usePreference(key: string, defaultValue?: string) {
  const valueRef = ref<string | null>(safeGet(key));
  if (valueRef.value == null && defaultValue !== undefined) {
    valueRef.value = defaultValue;
  }

  watch(valueRef, (v) => {
    if (
      v == null ||
      v === "" ||
      (defaultValue !== undefined && v === defaultValue)
    ) {
      safeRemove(key);
    } else {
      safeSet(key, String(v));
    }
  });

  const set = (v: string | null | undefined) => {
    valueRef.value = v == null ? null : String(v);
  };
  const get = () => valueRef.value;
  const remove = () => set(null);

  return { get, set, remove, value: valueRef };
}
