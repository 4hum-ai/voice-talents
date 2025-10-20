/**
 * Mock Voice Actor Service
 * Simulates API responses for VoiceAct app development
 */

import type {
  VoiceActor,
  VoiceSample,
  Project,
  ProjectAssignment,
  Studio,
  Notification,
  CastingSession,
  CastingSubmission,
  VoiceActorStats,
  ActivityItem,
  VoiceActorSearchFilters,
  ProjectSearchFilters,
} from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'

// Simulate API delay
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock API responses
export class MockVoiceActorService {
  // Voice Actor Management
  async getVoiceActor(id: string): Promise<VoiceActor> {
    await delay()
    const actor = mockData.voiceActors.find((a) => a.id === id)
    if (!actor) throw new Error('Voice actor not found')
    return actor
  }

  async updateVoiceActor(id: string, updates: Partial<VoiceActor>): Promise<VoiceActor> {
    await delay()
    const actor = mockData.voiceActors.find((a) => a.id === id)
    if (!actor) throw new Error('Voice actor not found')

    const updatedActor = { ...actor, ...updates, updatedAt: new Date().toISOString() }
    const index = mockData.voiceActors.findIndex((a) => a.id === id)
    mockData.voiceActors[index] = updatedActor

    return updatedActor
  }

  async searchVoiceActors(filters: VoiceActorSearchFilters = {}): Promise<VoiceActor[]> {
    await delay()
    let results = [...mockData.voiceActors]

    if (filters.languages?.length) {
      results = results.filter((actor) =>
        filters.languages!.some((lang) => actor.languages.includes(lang)),
      )
    }

    if (filters.voiceTypes?.length) {
      results = results.filter((actor) =>
        filters.voiceTypes!.some((type) => actor.voiceTypes.includes(type)),
      )
    }

    if (filters.experience?.length) {
      results = results.filter((actor) => filters.experience!.includes(actor.experience))
    }

    if (filters.isVerified !== undefined) {
      results = results.filter((actor) => actor.isVerified === filters.isVerified)
    }

    return results
  }

  // Voice Samples Management
  async getVoiceSamples(actorId?: string): Promise<VoiceSample[]> {
    await delay()
    if (actorId) {
      return mockData.voiceSamples.filter((sample) => sample.voiceActorId === actorId)
    }
    return mockData.voiceSamples
  }

  async getVoiceSample(id: string): Promise<VoiceSample> {
    await delay()
    const sample = mockData.voiceSamples.find((s) => s.id === id)
    if (!sample) throw new Error('Voice sample not found')
    return sample
  }

  async createVoiceSample(
    sample: Omit<VoiceSample, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<VoiceSample> {
    await delay()
    const newSample: VoiceSample = {
      ...sample,
      id: `sample-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockData.voiceSamples.push(newSample)
    return newSample
  }

  async updateVoiceSample(id: string, updates: Partial<VoiceSample>): Promise<VoiceSample> {
    await delay()
    const sample = mockData.voiceSamples.find((s) => s.id === id)
    if (!sample) throw new Error('Voice sample not found')

    const updatedSample = { ...sample, ...updates, updatedAt: new Date().toISOString() }
    const index = mockData.voiceSamples.findIndex((s) => s.id === id)
    mockData.voiceSamples[index] = updatedSample

    return updatedSample
  }

  async deleteVoiceSample(id: string): Promise<void> {
    await delay()
    const index = mockData.voiceSamples.findIndex((s) => s.id === id)
    if (index === -1) throw new Error('Voice sample not found')
    mockData.voiceSamples.splice(index, 1)
  }

  // Project Management
  async getProjects(actorId?: string): Promise<Project[]> {
    await delay()
    if (actorId) {
      return mockData.projects.filter((project) =>
        project.assignedActors.some((assignment) => assignment.voiceActorId === actorId),
      )
    }
    return mockData.projects
  }

  async getProject(id: string): Promise<Project> {
    await delay()
    const project = mockData.projects.find((p) => p.id === id)
    if (!project) throw new Error('Project not found')
    return project
  }

  async searchProjects(filters: ProjectSearchFilters = {}): Promise<Project[]> {
    await delay()
    let results = [...mockData.projects]

    if (filters.status?.length) {
      results = results.filter((project) => filters.status!.includes(project.status))
    }

    if (filters.projectType?.length) {
      results = results.filter((project) => filters.projectType!.includes(project.projectType))
    }

    if (filters.languages?.length) {
      results = results.filter((project) =>
        filters.languages!.some((lang) => project.requirements.languages.includes(lang)),
      )
    }

    return results
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    await delay()
    const project = mockData.projects.find((p) => p.id === id)
    if (!project) throw new Error('Project not found')

    const updatedProject = { ...project, ...updates, updatedAt: new Date().toISOString() }
    const index = mockData.projects.findIndex((p) => p.id === id)
    mockData.projects[index] = updatedProject

    return updatedProject
  }

  // Assignment Management
  async getAssignment(projectId: string, assignmentId: string): Promise<ProjectAssignment> {
    await delay()
    const project = mockData.projects.find((p) => p.id === projectId)
    if (!project) throw new Error('Project not found')

    const assignment = project.assignedActors.find((a) => a.id === assignmentId)
    if (!assignment) throw new Error('Assignment not found')

    return assignment
  }

  async updateAssignment(
    projectId: string,
    assignmentId: string,
    updates: Partial<ProjectAssignment>,
  ): Promise<ProjectAssignment> {
    await delay()
    const project = mockData.projects.find((p) => p.id === projectId)
    if (!project) throw new Error('Project not found')

    const assignment = project.assignedActors.find((a) => a.id === assignmentId)
    if (!assignment) throw new Error('Assignment not found')

    const updatedAssignment = { ...assignment, ...updates, updatedAt: new Date().toISOString() }
    const index = project.assignedActors.findIndex((a) => a.id === assignmentId)
    project.assignedActors[index] = updatedAssignment

    return updatedAssignment
  }

  // Studio Management
  async getStudios(): Promise<Studio[]> {
    await delay()
    return mockData.studios
  }

  async getStudio(id: string): Promise<Studio> {
    await delay()
    const studio = mockData.studios.find((s) => s.id === id)
    if (!studio) throw new Error('Studio not found')
    return studio
  }

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    await delay()
    return mockData.notifications.filter((n) => n.userId === userId)
  }

  async markNotificationAsRead(id: string): Promise<Notification> {
    await delay()
    const notification = mockData.notifications.find((n) => n.id === id)
    if (!notification) throw new Error('Notification not found')

    notification.isRead = true
    notification.readDate = new Date().toISOString()

    return notification
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await delay()
    mockData.notifications
      .filter((n) => n.userId === userId && !n.isRead)
      .forEach((n) => {
        n.isRead = true
        n.readDate = new Date().toISOString()
      })
  }

  // Casting Sessions
  async getCastingSessions(): Promise<CastingSession[]> {
    await delay()
    return mockData.castingSessions
  }

  async getCastingSession(id: string): Promise<CastingSession> {
    await delay()
    const session = mockData.castingSessions.find((c) => c.id === id)
    if (!session) throw new Error('Casting session not found')
    return session
  }

  async submitToCasting(
    sessionId: string,
    submission: Omit<CastingSubmission, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<CastingSubmission> {
    await delay()
    const session = mockData.castingSessions.find((c) => c.id === sessionId)
    if (!session) throw new Error('Casting session not found')

    const newSubmission: CastingSubmission = {
      ...submission,
      id: `submission-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    session.submissions.push(newSubmission)
    return newSubmission
  }

  // Statistics
  async getVoiceActorStats(_actorId: string): Promise<VoiceActorStats> {
    await delay()
    // In real app, this would calculate stats from actual data
    return mockData.voiceActorStats
  }

  // Activity Feed
  async getRecentActivity(_actorId: string, limit: number = 10): Promise<ActivityItem[]> {
    await delay()
    return mockData.voiceActorStats.recentActivity.slice(0, limit)
  }

  // File Upload Simulation
  async uploadFile(
    file: File,
    _type: 'sample' | 'recording' | 'reference',
  ): Promise<{ url: string; id: string }> {
    await delay(2000) // Simulate upload time

    // Generate mock file URL
    const fileId = `file-${Date.now()}`
    const fileUrl = `https://example.com/uploads/${fileId}.${file.name.split('.').pop()}`

    return { url: fileUrl, id: fileId }
  }

  // Audio Processing Simulation
  async processAudio(_audioUrl: string): Promise<{ waveformUrl: string; duration: number }> {
    await delay(3000) // Simulate processing time

    return {
      waveformUrl: `https://example.com/waveforms/${Date.now()}.json`,
      duration: Math.floor(Math.random() * 300) + 30, // 30-330 seconds
    }
  }

  // Search and Discovery
  async searchSamples(query: string, filters: any = {}): Promise<VoiceSample[]> {
    await delay()
    let results = [...mockData.voiceSamples]

    if (query) {
      const searchQuery = query.toLowerCase()
      results = results.filter(
        (sample) =>
          sample.title.toLowerCase().includes(searchQuery) ||
          sample.description?.toLowerCase().includes(searchQuery) ||
          sample.tags.some((tag) => tag.toLowerCase().includes(searchQuery)),
      )
    }

    if (filters.genre) {
      results = results.filter((sample) => sample.genre === filters.genre)
    }

    if (filters.tone) {
      results = results.filter((sample) => sample.tone === filters.tone)
    }

    if (filters.language) {
      results = results.filter((sample) => sample.language === filters.language)
    }

    return results
  }

  // Analytics
  async getSampleAnalytics(sampleId: string): Promise<{
    playCount: number
    downloadCount: number
    uniqueListeners: number
    averageListenDuration: number
    geographicData: Array<{ country: string; plays: number }>
  }> {
    await delay()

    const sample = mockData.voiceSamples.find((s) => s.id === sampleId)
    if (!sample) throw new Error('Sample not found')

    return {
      playCount: sample.playCount,
      downloadCount: sample.downloadCount,
      uniqueListeners: Math.floor(sample.playCount * 0.7),
      averageListenDuration: Math.floor(sample.duration * 0.8),
      geographicData: [
        { country: 'United States', plays: Math.floor(sample.playCount * 0.4) },
        { country: 'Canada', plays: Math.floor(sample.playCount * 0.2) },
        { country: 'United Kingdom', plays: Math.floor(sample.playCount * 0.15) },
        { country: 'Australia', plays: Math.floor(sample.playCount * 0.1) },
        { country: 'Other', plays: Math.floor(sample.playCount * 0.15) },
      ],
    }
  }

  // Real-time Updates Simulation
  subscribeToUpdates(callback: (update: any) => void): () => void {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Randomly send updates
      if (Math.random() > 0.8) {
        callback({
          type: 'notification',
          data: {
            id: `notif-${Date.now()}`,
            type: 'project_assigned',
            title: 'New Project Assignment',
            message: 'You have been assigned to a new project!',
            timestamp: new Date().toISOString(),
          },
        })
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }
}

// Export singleton instance
export const mockVoiceActorService = new MockVoiceActorService()
