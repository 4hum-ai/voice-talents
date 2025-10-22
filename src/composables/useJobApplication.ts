import { computed, reactive } from 'vue'
import type { Application } from '@/types/job-application'
import { useJob } from '@/composables/useJob'

interface ApplicationState {
  applications: Application[]
  loading: boolean
  error: string | null
}

const state = reactive<ApplicationState>({
  applications: [],
  loading: false,
  error: null,
})

const initializeApplications = async () => {
  if (state.applications.length > 0 || state.loading) return
  state.loading = true
  try {
    // Source applications from mock data colocated with jobs
    const { jobs } = useJob()
    const all: Application[] = []
    for (const job of jobs.value) {
      const apps = (job as Record<string, unknown>).applications as Application[] | undefined
      if (Array.isArray(apps)) {
        for (const app of apps) {
          all.push(app)
        }
      }
    }
    state.applications = all
  } catch (e) {
    state.error = 'Failed to load applications'
    console.error(e)
  } finally {
    state.loading = false
  }
}

export function useJobApplication() {
  if (state.applications.length === 0 && !state.loading) {
    // lazy init
    void initializeApplications()
  }

  const applications = computed(() => state.applications)

  const getApplication = (id: string): Application | null => {
    return state.applications.find((a) => a.id === id) || null
  }

  const getApplicationsByJobId = (jobId: string): Application[] => {
    return state.applications.filter((a) => a.jobId === jobId)
  }

  type SortKey = 'cost' | 'rating' | 'timeline' | 'date'
  const sortApplications = (
    apps: Application[],
    by: SortKey,
    order: 'asc' | 'desc',
  ): Application[] => {
    const copy = [...apps]
    copy.sort((a, b) => {
      let av: unknown
      let bv: unknown
      switch (by) {
        case 'cost':
          av = a.proposedCost
          bv = b.proposedCost
          break
        case 'timeline':
          av = a.proposedTimeline
          bv = b.proposedTimeline
          break
        case 'date':
          av = new Date(a.appliedDate).getTime()
          bv = new Date(b.appliedDate).getTime()
          break
        case 'rating':
        default:
          // no rating in schema; keep as date fallback
          av = new Date(a.appliedDate).getTime()
          bv = new Date(b.appliedDate).getTime()
          break
      }
      // Type-safe comparison
      if (typeof av === 'number' && typeof bv === 'number') {
        return order === 'asc' ? (av > bv ? 1 : -1) : av < bv ? 1 : -1
      }

      // Fallback for other types
      const avStr = String(av || '')
      const bvStr = String(bv || '')
      const comparison = avStr.localeCompare(bvStr)
      return order === 'asc' ? comparison : -comparison
    })
    return copy
  }

  const selectTalent = (jobId: string, applicationId: string) => {
    const { publishJob } = useJob()
    // For now, mark selected in memory and ensure job will have selectedTalents updated by caller
    const app = getApplication(applicationId)
    if (app) {
      app.status = 'selected'
    }
    // The actual job transition can be driven by view using useJob APIs as desired
    return publishJob(jobId)
  }

  return {
    // state
    applications,
    loading: computed(() => state.loading),
    error: computed(() => state.error),

    // getters
    getApplication,
    getApplicationsByJobId,
    sortApplications,

    // actions
    selectTalent,
  }
}
