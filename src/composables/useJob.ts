import { computed, reactive } from 'vue'
import type { JobPosting } from '@/types/voice-client'

// Job interface extending JobPosting with additional metadata
export interface Job extends Omit<JobPosting, 'status'> {
  status: 'draft' | 'published' | 'completed'
  lastSaved: string
  autoSaved: boolean
  version: number
}

// Job management state
interface JobState {
  jobs: Job[]
  currentJob: Job | null
  loading: boolean
  error: string | null
}

// Local storage key
const JOBS_STORAGE_KEY = 'voiceact-jobs'

// Global state
const state = reactive<JobState>({
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
})

// Initialize jobs from localStorage
const initializeJobs = () => {
  try {
    const stored = localStorage.getItem(JOBS_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      state.jobs = Array.isArray(parsed) ? parsed : []
    } else {
      // Initialize with some mock completed jobs if no stored data
      initializeMockJobs()
    }
  } catch (error) {
    console.error('Error loading jobs from localStorage:', error)
    state.error = 'Failed to load jobs'
  }
}

// Initialize mock completed jobs for demonstration
const initializeMockJobs = () => {
  const mockCompletedJobs: Job[] = [
    {
      id: 'job-completed-001',
      clientId: 'client-001',
      clientName: 'TechFlow Inc.',
      title: 'Mobile App Commercial Series',
      description: 'Series of 3 commercials for mobile app launch. Completed successfully with high-quality deliverables.',
      jobType: 'open_casting',
      projectType: 'commercial',
      status: 'completed',
      priority: 'high',
      budget: { min: 3000, max: 5000, currency: 'USD' },
      deadline: '2024-01-15T17:00:00Z',
      startDate: '2024-01-01T09:00:00Z',
      estimatedDuration: '2 weeks',
      requirements: {
        languages: ['English'],
        accents: ['American'],
        voiceTypes: ['commercial'],
        ageRange: '25-35',
        gender: 'any',
        experience: 'professional',
        specialInstructions: 'Energetic, modern tone for tech audience',
        quality: 'professional',
      },
      deliverables: [],
      files: [],
      isPublic: true,
      applications: [],
      selectedTalents: ['va-001'],
      totalApplications: 5,
      viewCount: 45,
      createdDate: '2023-12-20T10:00:00Z',
      publishedDate: '2023-12-20T10:00:00Z',
      closedDate: '2024-01-15T17:00:00Z',
      createdAt: '2023-12-20T10:00:00Z',
      updatedAt: '2024-01-15T17:00:00Z',
      lastSaved: '2024-01-15T17:00:00Z',
      autoSaved: false,
      version: 1,
    },
    {
      id: 'job-completed-002',
      clientId: 'client-002',
      clientName: 'EduTech Solutions',
      title: 'Corporate Training Module',
      description: 'Voice-over for corporate training module on digital marketing best practices.',
      jobType: 'targeted_search',
      projectType: 'e-learning',
      status: 'completed',
      priority: 'medium',
      budget: { min: 2500, max: 4000, currency: 'USD' },
      deadline: '2024-01-10T17:00:00Z',
      startDate: '2023-12-25T09:00:00Z',
      estimatedDuration: '3 weeks',
      requirements: {
        languages: ['English'],
        accents: ['American'],
        voiceTypes: ['narrator'],
        experience: 'advanced',
        specialInstructions: 'Clear, engaging delivery for corporate audience',
        quality: 'professional',
      },
      deliverables: [],
      files: [],
      isPublic: true,
      applications: [],
      selectedTalents: ['va-003'],
      totalApplications: 3,
      viewCount: 28,
      createdDate: '2023-12-15T10:00:00Z',
      publishedDate: '2023-12-15T10:00:00Z',
      closedDate: '2024-01-10T17:00:00Z',
      createdAt: '2023-12-15T10:00:00Z',
      updatedAt: '2024-01-10T17:00:00Z',
      lastSaved: '2024-01-10T17:00:00Z',
      autoSaved: false,
      version: 1,
    },
  ]
  
  state.jobs = mockCompletedJobs
  saveJobsToStorage()
}

// Save jobs to localStorage
const saveJobsToStorage = () => {
  try {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(state.jobs))
  } catch (error) {
    console.error('Error saving jobs to localStorage:', error)
    state.error = 'Failed to save jobs'
  }
}

// Generate unique job ID
const generateJobId = (): string => {
  return `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function useJob() {
  // Initialize on first use
  if (state.jobs.length === 0 && !state.loading) {
    initializeJobs()
  }

  // Computed properties
  const jobs = computed(() => state.jobs)
  const drafts = computed(() => state.jobs.filter((job) => job.status === 'draft'))
  const publishedJobs = computed(() => state.jobs.filter((job) => job.status === 'published'))
  const currentJob = computed(() => state.currentJob)
  const loading = computed(() => state.loading)
  const error = computed(() => state.error)
  const draftCount = computed(() => state.jobs.filter((job) => job.status === 'draft').length)
  const publishedCount = computed(
    () => state.jobs.filter((job) => job.status === 'published').length,
  )

  // Get job by ID
  const getJob = (id: string): Job | null => {
    return state.jobs.find((job) => job.id === id) || null
  }

  // Get draft by ID (alias for backward compatibility)
  const getDraft = (id: string): Job | null => {
    return state.jobs.find((job) => job.id === id && job.status === 'draft') || null
  }

  // Get jobs by client
  const getJobsByClient = (clientId: string): Job[] => {
    return state.jobs.filter((job) => job.clientId === clientId)
  }

  // Get drafts by client
  const getDraftsByClient = (clientId: string): Job[] => {
    return state.jobs.filter((job) => job.clientId === clientId && job.status === 'draft')
  }

  // Get published jobs by client
  const getPublishedJobsByClient = (clientId: string): Job[] => {
    return state.jobs.filter((job) => job.clientId === clientId && job.status === 'published')
  }

  // Get completed jobs by client
  const getCompletedJobsByClient = (clientId: string): Job[] => {
    return state.jobs.filter((job) => job.clientId === clientId && job.status === 'completed')
  }

  // Create new job from form data
  const createJob = (
    jobData: Partial<JobPosting>,
    clientId: string,
    clientName: string,
    status: 'draft' | 'published' = 'draft',
  ): Job => {
    const now = new Date().toISOString()

    const job: Job = {
      id: generateJobId(),
      clientId,
      clientName,
      title: jobData.title || 'Untitled Job',
      description: jobData.description || '',
      jobType: jobData.jobType || 'open_casting',
      projectType: jobData.projectType || 'commercial',
      status,
      priority: jobData.priority || 'medium',
      budget: jobData.budget || { min: 0, max: 0, currency: 'USD' },
      deadline: jobData.deadline || '',
      estimatedDuration: jobData.estimatedDuration || '',
      requirements: jobData.requirements || {
        languages: [],
        accents: [],
        voiceTypes: [],
        ageRange: '',
        gender: 'any',
        experience: 'beginner',
        specialInstructions: '',
        quality: 'professional',
      },
      deliverables: jobData.deliverables || [],
      files: jobData.files || [],
      isPublic: jobData.isPublic ?? true,
      applications: jobData.applications || [],
      selectedTalents: jobData.selectedTalents || [],
      totalApplications: jobData.totalApplications || 0,
      viewCount: jobData.viewCount || 0,
      createdDate: now,
      createdAt: now,
      updatedAt: now,
      lastSaved: now,
      autoSaved: false,
      version: 1,
    }

    state.jobs.push(job)
    state.currentJob = job
    saveJobsToStorage()
    return job
  }

  // Save draft (alias for backward compatibility)
  const saveDraft = (
    jobData: Partial<JobPosting>,
    clientId: string,
    clientName: string,
    draftId?: string,
  ): Job => {
    const now = new Date().toISOString()

    if (draftId) {
      // Update existing draft
      const existingIndex = state.jobs.findIndex((job) => job.id === draftId)
      if (existingIndex !== -1) {
        const existingJob = state.jobs[existingIndex]
        const updatedJob: Job = {
          ...existingJob,
          ...jobData,
          status: 'draft', // Ensure status is always 'draft' for drafts
          lastSaved: now,
          version: existingJob.version + 1,
          updatedAt: now,
        }

        state.jobs[existingIndex] = updatedJob
        state.currentJob = updatedJob
        saveJobsToStorage()
        return updatedJob
      }
    }

    // Create new draft
    return createJob(jobData, clientId, clientName, 'draft')
  }

  // Auto-save draft
  const autoSaveDraft = (
    jobData: Partial<JobPosting>,
    clientId: string,
    clientName: string,
    draftId?: string,
  ): Job | null => {
    // Only auto-save if there's meaningful content
    if (!jobData.title?.trim() && !jobData.description?.trim()) {
      return null
    }

    const now = new Date().toISOString()

    if (draftId) {
      // Update existing draft
      const existingIndex = state.jobs.findIndex((job) => job.id === draftId)
      if (existingIndex !== -1) {
        const existingJob = state.jobs[existingIndex]
        const updatedJob: Job = {
          ...existingJob,
          ...jobData,
          status: 'draft',
          lastSaved: now,
          autoSaved: true,
          version: existingJob.version + 1,
          updatedAt: now,
        }

        state.jobs[existingIndex] = updatedJob
        state.currentJob = updatedJob
        saveJobsToStorage()
        return updatedJob
      }
    }

    // Create new auto-saved draft
    const job = createJob(jobData, clientId, clientName, 'draft')
    job.autoSaved = true
    return job
  }

  // Load draft/job
  const loadDraft = (id: string): Job | null => {
    const job = getJob(id)
    if (job) {
      state.currentJob = job
    }
    return job
  }

  // Publish job (convert draft to published)
  const publishJob = (jobId: string): Job | null => {
    const jobIndex = state.jobs.findIndex((job) => job.id === jobId)
    if (jobIndex !== -1) {
      const now = new Date().toISOString()
      const updatedJob: Job = {
        ...state.jobs[jobIndex],
        status: 'published',
        publishedDate: now,
        lastSaved: now,
        updatedAt: now,
        version: state.jobs[jobIndex].version + 1,
      }

      state.jobs[jobIndex] = updatedJob
      state.currentJob = updatedJob
      saveJobsToStorage()
      return updatedJob
    }
    return null
  }

  // Complete job (convert published to completed)
  const completeJob = (jobId: string): Job | null => {
    const jobIndex = state.jobs.findIndex((job) => job.id === jobId)
    if (jobIndex !== -1) {
      const now = new Date().toISOString()
      const updatedJob: Job = {
        ...state.jobs[jobIndex],
        status: 'completed',
        closedDate: now,
        lastSaved: now,
        updatedAt: now,
        version: state.jobs[jobIndex].version + 1,
      }

      state.jobs[jobIndex] = updatedJob
      state.currentJob = updatedJob
      saveJobsToStorage()
      return updatedJob
    }
    return null
  }

  // Delete job/draft
  const deleteJob = (id: string): boolean => {
    const index = state.jobs.findIndex((job) => job.id === id)
    if (index !== -1) {
      state.jobs.splice(index, 1)
      if (state.currentJob?.id === id) {
        state.currentJob = null
      }
      saveJobsToStorage()
      return true
    }
    return false
  }

  // Delete draft (alias for backward compatibility)
  const deleteDraft = (id: string): boolean => {
    return deleteJob(id)
  }

  // Clear all jobs (for testing)
  const clearAllJobs = (): void => {
    state.jobs = []
    state.currentJob = null
    saveJobsToStorage()
  }

  // Refresh jobs from localStorage (useful for cross-component updates)
  const refreshJobs = (): void => {
    initializeJobs()
  }

  return {
    // State
    jobs,
    drafts,
    publishedJobs,
    currentJob,
    loading,
    error,
    draftCount,
    publishedCount,

    // Methods
    getJob,
    getDraft,
    getJobsByClient,
    getDraftsByClient,
    getPublishedJobsByClient,
    getCompletedJobsByClient,
    createJob,
    saveDraft,
    autoSaveDraft,
    loadDraft,
    publishJob,
    completeJob,
    deleteJob,
    deleteDraft,
    clearAllJobs,
    refreshJobs,
  }
}
