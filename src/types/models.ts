/**
 * TypeScript interfaces for Movie Service models
 * Generated from database schema definitions for Vue/TypeScript applications
 *
 * All models extend from BaseEntity which contains common fields.
 * Interface names match backend model names exactly.
 */

// Base entity interface containing common fields
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

// Title model interfaces
export interface Title extends BaseEntity {
  name: string
  type: 'movie' | 'series' | 'episode' | 'documentary'
  status: 'draft' | 'processing' | 'published' | 'archived'
  director?: string
  year?: number
  genre: string[] // Legacy field for backward compatibility
  rating?: number // Legacy field for backward compatibility
  duration?: number
  language: 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ko' | 'zh' | 'hi'
  organizationId?: string
  poster?: string
  thumbnail?: string
  description?: string
  tags: string[]
  parentTitleId?: string
  budget?: number
  // New fields for enhanced content management
  releaseDate?: string
  runtimeMinutes?: number
  originalLanguageCode?: string
  ageCertification?: string
  metadata?: {
    originalLanguage?: string
    targetLanguages: string[]
    subtitleLanguages: string[]
    audioQuality: 'standard' | 'hd' | 'ultra-hd'
    videoQuality: '480p' | '720p' | '1080p' | '4k'
    aspectRatio?: string
    awards: string[]
  }
}

// Organization model interfaces
export interface Organization extends BaseEntity {
  name: string
  type: 'publisher' | 'partner' | 'vendor' | 'client' | 'affiliate'
  status: 'active' | 'pending' | 'suspended' | 'inactive'
  country: string
  address: string
  email: string
  website?: string
  phone?: string
  companySize: 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  industry?: string
  annualRevenue?: number
  legalEntityName?: string
  taxId?: string
  currency: 'USD' | 'EUR' | 'JPY' | 'KRW' | 'CNY' | 'INR'
  onboardingStatus: 'pending' | 'in_progress' | 'completed'
  accountManagerId?: string
  userCount: number
  projectCount: number
  activeProjects: number
  totalRevenue: number
  monthlyRevenue: number
  revenueGrowth: number
  averageRevenuePerMovie: number
  totalViews: number
  averageViewDuration: number
  totalMovies: number
  activeMovies: number
  totalEpisodes: number
  averageRating: number
  conversionRate: number
  retentionRate: number
  contractType: 'monthly' | 'annual' | 'enterprise'
  contractStartDate?: string
  contractEndDate?: string
  serviceLevel: 'basic' | 'premium' | 'enterprise'
  lastActivityDate?: string
  nextReviewDate?: string
}

// User model interfaces
export interface User extends BaseEntity {
  email: string
  name: string
  role: 'admin' | 'manager' | 'user' | 'viewer'
  status: 'active' | 'inactive' | 'suspended'
  avatar?: string
  phone?: string
  timezone?: string
  language: 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ko' | 'zh' | 'hi'
  organizationId?: string
  organizationName?: string
  lastLoginAt?: string
  isEmailVerified: boolean
}

// Media model interfaces
export interface Media extends BaseEntity {
  type:
    | 'dubbed'
    | 'trailer'
    | 'voice_over'
    | 'subtitle'
    | 'original'
    | 'behind_scenes'
    | 'interview'
    | 'promo'
    | 'recording'
    | 'mixing'
    | 'master'
    | 'poster'
  format:
    | 'mp4'
    | 'avi'
    | 'mov'
    | 'mkv'
    | 'mp3'
    | 'wav'
    | 'aac'
    | 'flac'
    | 'srt'
    | 'vtt'
    | 'ass'
    | 'ssa'
    | 'jpg'
    | 'png'
    | 'webp'
    | 'm3u8'
  fileUrl: string
  fileName: string
  fileSize?: number
  contentType: string
  duration?: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  language: 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ko' | 'zh' | 'hi'
  relationships: string[]
  description?: string
  tags: string[]
  metadata: Record<string, unknown>
  thumbnailUrl?: string
  previewUrl?: string
  bucket?: string
  path?: string
  uploadUrl?: string
  uploadExpiresAt?: string
}

// Contact model interfaces
export interface Contact extends BaseEntity {
  name: string
  email: string
  phone?: string
  role?: string
  department?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  preferredContactMethod: 'email' | 'phone' | 'sms'
  timezone?: string
  language: 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ko' | 'zh' | 'hi'
  status: 'active' | 'inactive' | 'archived'
  notes?: string
}

// Member model interfaces
export interface Member extends BaseEntity {
  userId: string
  name: string
  email: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  stripePaymentMethodId?: string
  subscriptionTier: 'basic' | 'premium' | 'pro' | 'enterprise'
  status: 'active' | 'cancelled' | 'suspended' | 'past_due' | 'unpaid' | 'trialing'
  billingCycle: 'monthly' | 'annual'
  nextBillingDate?: string
  autoRenew: boolean
  lastPaymentDate?: string
  lastPaymentAmount?: number
  currency: 'USD' | 'EUR' | 'JPY' | 'KRW' | 'CNY' | 'INR'
  paymentMethod?: 'card' | 'bank_account' | 'paypal'
  joinDate: string
  lastActive: string
  country?: string
  totalWatchTime: number
  favoriteGenres: string[]
  monthlyRevenue: number
}

// Revenue model interfaces
export interface Revenue extends BaseEntity {
  titleId?: string
  organizationId?: string
  amount: number
  currency: 'USD' | 'EUR' | 'JPY' | 'KRW' | 'CNY' | 'INR'
  type: 'AVOD' | 'SVOD' | 'TVOD' | 'licensing'
  status: 'pending' | 'processed' | 'paid' | 'failed'
  date: string
  region: string
  adImpressions?: number
  adClicks?: number
  cpm?: number
  adFormats?: string[]
  subscriptionRevenue?: number
  subscriberCount?: number
  monthlyPrice?: number
  revenueShare: number
  processingFee?: number
  netAmount: number
  publisherName?: string
  movieTitle?: string
  platform?: string
  language?: string
  description?: string
}

// Voice Library model interfaces
export interface VoiceLibrary extends BaseEntity {
  name: string
  language: 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ko' | 'zh' | 'hi'
  gender: 'male' | 'female' | 'non-binary'
  accent?: string
  voiceType?: 'narrator' | 'character' | 'announcer'
  provider: 'elevenlabs' | 'speechify' | 'azure' | 'aws' | 'google' | 'custom'
  voiceId: string
  sampleAudioUrl?: string
  characteristics?: {
    speed: number
    pitch: number
    stability: number
    clarity: number
  }
  mediaId?: string
  metadata: Record<string, unknown>
}

// Organization Contact model interfaces
export interface OrganizationContact extends BaseEntity {
  organizationId: string
  organizationName?: string
  contactId: string
  contactName?: string
  contactEmail?: string
  role?: string
  department?: string
  isPrimary: boolean
  isBillingContact: boolean
  isTechnicalContact: boolean
  preferredContactMethod: 'email' | 'phone' | 'sms'
  notes?: string
  status: 'active' | 'inactive' | 'archived'
}

// Media Relationship model interfaces
export interface MediaRelationship extends BaseEntity {
  mediaId: string
  entityType: string
  entityId: string
  relationshipType: string
  metadata: Record<string, unknown>
}

// Payout model interfaces
export interface Payout extends BaseEntity {
  amount: number
  currency: 'USD' | 'EUR' | 'JPY' | 'KRW' | 'CNY' | 'INR'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  payoutDate: string
  organizationId: string
  paymentMethod: 'bank_transfer' | 'paypal' | 'stripe' | 'wire_transfer'
  accountNumber: string
  bankName: string
  transactionId: string
  processingFee: number
  netAmount: number
  description: string
  routingNumber?: string
  accountType?: 'checking' | 'savings'
  paypalEmail?: string
  externalId?: string
  metadata: Record<string, unknown>
  publisherName?: string
}

// Payout preferences for talent users
export interface PayoutPreferences {
  frequency: 'monthly' | 'threshold' | 'manual'
  thresholdAmount?: number // Required if frequency is 'threshold'
  currency: 'USD' | 'EUR' | 'JPY' | 'KRW' | 'CNY' | 'INR'
}

// Talent balance information
export interface TalentBalance {
  availableBalance: number
  pendingBalance: number
  currency: 'USD' | 'EUR' | 'JPY' | 'KRW' | 'CNY' | 'INR'
  lastPayoutDate?: string
  nextScheduledPayout?: string
}

// Payout fee calculation result
export interface PayoutFeeCalculation {
  amount: number
  percentageFee: number // 1.5%
  fixedFee: number // $1.50
  fxFee: number // 0.5% (if applicable)
  totalFees: number
  netAmount: number
  currency: string
}

// Revenue Distribution model interfaces
export interface RevenueDistribution extends BaseEntity {
  date: string
  publisherId: string
  publisherName: string
  contentViews: number
  totalViews: number
  revenueShare: number
  distributedAmount: number
  status: 'pending' | 'processed' | 'paid'
  contentTitles: string[]
}

// Profile model interfaces
export interface Profile extends BaseEntity {
  userId: string
  displayName: string
  avatarUrl?: string
  maturityRating:
    | 'G'
    | 'PG'
    | 'PG-13'
    | 'R'
    | 'NC-17'
    | 'TV-Y'
    | 'TV-Y7'
    | 'TV-G'
    | 'TV-PG'
    | 'TV-14'
    | 'TV-MA'
  language: string
  timezone?: string
  preferences: {
    autoPlay: boolean
    skipIntro: boolean
    skipCredits: boolean
    subtitles: boolean
    audioDescription: boolean
    quality: 'auto' | '480p' | '720p' | '1080p' | '4k'
  }
  isActive: boolean
  isPrimary: boolean
}

// Profile Title List model interfaces
export interface ProfileTitleList extends BaseEntity {
  profileId: string
  titleId: string
  listType: 'favorite' | 'watching' | 'watched' | 'watch_later'
  addedAt: string
  lastWatchedAt?: string
}

// Rating model interfaces
export interface Rating extends BaseEntity {
  profileId: string
  titleId: string
  ratingValue: number
  ratedAt: string
  review?: string
}

// Viewing Progress model interfaces
export interface ViewingProgress extends BaseEntity {
  profileId: string
  titleId: string
  positionSeconds: number
  durationSeconds: number
  lastInteractionAt: string
  completed: boolean
}

// Union type for all model types
export type ModelType =
  | Title
  | Organization
  | User
  | Media
  | Contact
  | Member
  | Revenue
  | VoiceLibrary
  | OrganizationContact
  | MediaRelationship
  | Payout
  | RevenueDistribution
  | Profile
  | ProfileTitleList
  | Rating
  | ViewingProgress
