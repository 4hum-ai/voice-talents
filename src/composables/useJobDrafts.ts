import { ref, computed, reactive } from 'vue'
import type { JobPosting } from '@/types/voice-client'

// Draft interface extending JobPosting with draft-specific metadata
export interface JobDraft extends Omit<JobPosting, 'status' | 'publishedDate' | 'closedDate'> {
  status: 'draft'
  lastSaved: string
  autoSaved: boolean
  version: number
}

// Draft management state
interface DraftState {
  drafts: JobDraft[]
  currentDraft: JobDraft | null
  loading: boolean
  error: string | null
}

// Local storage key
const DRAFTS_STORAGE_KEY = 'voiceact-job-drafts'

// Global state
const state = reactive<DraftState>({
  drafts: [],
  currentDraft: null,
  loading: false,
  error: null
})

// Initialize drafts from localStorage
const initializeDrafts = () => {
  try {
    const stored = localStorage.getItem(DRAFTS_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      state.drafts = Array.isArray(parsed) ? parsed : []
    }
  } catch (error) {
    console.error('Error loading drafts from localStorage:', error)
    state.error = 'Failed to load drafts'
  }
}

// Save drafts to localStorage
const saveDraftsToStorage = () => {
  try {
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(state.drafts))
  } catch (error) {
    console.error('Error saving drafts to localStorage:', error)
    state.error = 'Failed to save drafts'
  }
}

// Generate unique draft ID
const generateDraftId = (): string => {
  return `draft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function useJobDrafts() {
  // Initialize on first use
  if (state.drafts.length === 0 && !state.loading) {
    initializeDrafts()
  }

  // Computed properties
  const drafts = computed(() => state.drafts)
  const currentDraft = computed(() => state.currentDraft)
  const loading = computed(() => state.loading)
  const error = computed(() => state.error)
  const draftCount = computed(() => state.drafts.length)

  // Get draft by ID
  const getDraft = (id: string): JobDraft | null => {
    return state.drafts.find(draft => draft.id === id) || null
  }

  // Create new draft from job form data
  const createDraft = (jobData: Partial<JobPosting>, clientId: string, clientName: string): JobDraft => {
    const now = new Date().toISOString()
    
    const draft: JobDraft = {
      id: generateDraftId(),
      clientId,
      clientName,
      title: jobData.title || 'Untitled Job',
      description: jobData.description || '',
      jobType: jobData.jobType || 'open_casting',
      projectType: jobData.projectType || 'commercial',
      status: 'draft',
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
        quality: 'professional'
      },
      deliverables: jobData.deliverables || [],
      files: jobData.files || [],
      isPublic: jobData.isPublic ?? true,
      applications: [],
      selectedTalents: [],
      totalApplications: 0,
      viewCount: 0,
      createdDate: now,
      lastSaved: now,
      autoSaved: false,
      version: 1,
      createdAt: now,
      updatedAt: now
    }

    return draft
  }

  // Save draft (create new or update existing)
  const saveDraft = (jobData: Partial<JobPosting>, clientId: string, clientName: string, draftId?: string): JobDraft => {
    const now = new Date().toISOString()
    
    if (draftId) {
      // Update existing draft
      const existingIndex = state.drafts.findIndex(draft => draft.id === draftId)
      if (existingIndex !== -1) {
        const existingDraft = state.drafts[existingIndex]
        const updatedDraft: JobDraft = {
          ...existingDraft,
          ...jobData,
          lastSaved: now,
          version: existingDraft.version + 1,
          updatedAt: now
        }
        
        state.drafts[existingIndex] = updatedDraft
        state.currentDraft = updatedDraft
        saveDraftsToStorage()
        return updatedDraft
      }
    }

    // Create new draft
    const newDraft = createDraft(jobData, clientId, clientName)
    state.drafts.push(newDraft)
    state.currentDraft = newDraft
    saveDraftsToStorage()
    return newDraft
  }

  // Auto-save draft (silent save without user notification)
  const autoSaveDraft = (jobData: Partial<JobPosting>, clientId: string, clientName: string, draftId?: string): JobDraft | null => {
    try {
      const draft = saveDraft(jobData, clientId, clientName, draftId)
      draft.autoSaved = true
      return draft
    } catch (error) {
      console.error('Auto-save failed:', error)
      return null
    }
  }

  // Load draft for editing
  const loadDraft = (draftId: string): JobDraft | null => {
    const draft = getDraft(draftId)
    if (draft) {
      state.currentDraft = draft
    }
    return draft
  }

  // Delete draft
  const deleteDraft = (draftId: string): boolean => {
    const index = state.drafts.findIndex(draft => draft.id === draftId)
    if (index !== -1) {
      state.drafts.splice(index, 1)
      if (state.currentDraft?.id === draftId) {
        state.currentDraft = null
      }
      saveDraftsToStorage()
      return true
    }
    return false
  }

  // Clear current draft
  const clearCurrentDraft = () => {
    state.currentDraft = null
  }

  // Get drafts by client
  const getDraftsByClient = (clientId: string): JobDraft[] => {
    return state.drafts.filter(draft => draft.clientId === clientId)
  }

  // Get recent drafts (last 10)
  const getRecentDrafts = (limit: number = 10): JobDraft[] => {
    return state.drafts
      .sort((a, b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime())
      .slice(0, limit)
  }

  // Check if draft has unsaved changes
  const hasUnsavedChanges = (draftId: string, currentData: Partial<JobPosting>): boolean => {
    const draft = getDraft(draftId)
    if (!draft) return false

    // Simple comparison of key fields
    const keyFields = ['title', 'description', 'jobType', 'projectType', 'priority', 'deadline']
    return keyFields.some(field => {
      const draftValue = (draft as any)[field]
      const currentValue = (currentData as any)[field]
      return draftValue !== currentValue
    })
  }

  // Clear all drafts (for testing or reset)
  const clearAllDrafts = () => {
    state.drafts = []
    state.currentDraft = null
    localStorage.removeItem(DRAFTS_STORAGE_KEY)
  }

  // Export draft as job posting (for publishing)
  const exportDraftAsJob = (draftId: string): Partial<JobPosting> | null => {
    const draft = getDraft(draftId)
    if (!draft) return null

    const { lastSaved, autoSaved, version, ...jobData } = draft
    return {
      ...jobData,
      status: 'published' as const,
      publishedDate: new Date().toISOString()
    }
  }

  return {
    // State
    drafts,
    currentDraft,
    loading,
    error,
    draftCount,

    // Methods
    getDraft,
    saveDraft,
    autoSaveDraft,
    loadDraft,
    deleteDraft,
    clearCurrentDraft,
    getDraftsByClient,
    getRecentDrafts,
    hasUnsavedChanges,
    clearAllDrafts,
    exportDraftAsJob
  }
}
