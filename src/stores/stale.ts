import { defineStore } from 'pinia'

export const useStaleStore = defineStore('stale', {
  state: () => ({
    flags: {} as Record<string, number>,
  }),
  actions: {
    mark(key: string, at?: number) {
      if (!key) return
      this.flags[key] = at ?? Date.now()
    },
    consume(key: string): number | undefined {
      if (!key) return undefined
      const at = this.flags[key]
      if (at) delete this.flags[key]
      return at
    },
    isStale(key: string): boolean {
      if (!key) return false
      return Boolean(this.flags[key])
    },
  },
})
