# VoiceTalents.AI - ERD (MVP)

## Core Entity Relationships

```mermaid
erDiagram
    User ||--o| VoiceTalent : "can be"
    User ||--o| VoiceClient : "can be"

    VoiceTalent ||--o{ Media : "uploads"
    VoiceTalent ||--o{ JobApplication : "applies"
    VoiceTalent ||--o{ JobInvitation : "receives"
    VoiceTalent ||--o{ Rating : "receives"

    VoiceClient ||--o{ JobPosting : "creates"
    VoiceClient ||--o{ JobInvitation : "sends"
    VoiceClient ||--o{ Rating : "gives"

    JobPosting ||--o{ JobApplication : "receives"
    JobPosting ||--o{ JobInvitation : "sends"
    JobPosting ||--o{ Media : "attaches"

    Media ||--o{ JobApplication : "attached to"
    Media ||--o{ MediaRelationship : "linked via"

    MediaRelationship }o--|| VoiceTalent : "belongs to"
    MediaRelationship }o--|| JobPosting : "attached to"
    MediaRelationship }o--|| JobApplication : "attached to"

    Rating ||--o{ VoiceTalent : "rates talent"
    Rating ||--o{ VoiceClient : "rates client"
    Rating ||--o{ JobPosting : "for job"

    User {
        string id PK
        string email
        string displayName
        string photoURL
        string provider
    }

    VoiceTalent {
        string id PK
        string userId FK
        text bio
        boolean isVerified
        boolean isPublic
        boolean isAvailable
        datetime lastActive
        datetime createdAt
        datetime updatedAt
    }

    VoiceClient {
        string id PK
        string userId FK
        string companyName
        string contactName
        string email
        string location
        string industry
        text description
        string logoUrl
        boolean isVerified
        boolean isPublic
        datetime lastActive
        datetime createdAt
        datetime updatedAt
    }

    Media {
        string id PK
        string title
        text description
        string fileUrl
        string fileType
        string voiceType
        string language
        int duration
        boolean isPublic
        json metadata
        datetime createdAt
        datetime updatedAt
    }

    MediaRelationship {
        string id PK
        string mediaId FK
        string relatedEntityId
        string relatedEntityType
        string relationshipType
        datetime createdAt
        datetime updatedAt
    }

    JobPosting {
        string id PK
        string clientId FK
        string title
        text description
        string jobType
        string status
        json budget
        datetime deadline
        json requirements
        boolean isPublic
        datetime publishedDate
        datetime closedDate
        datetime createdAt
        datetime updatedAt
    }

    JobApplication {
        string id PK
        string jobId FK
        string voiceTalentId FK
        text message
        string mediaId FK
        string status
        datetime appliedAt
        datetime createdAt
        datetime updatedAt
    }

    JobInvitation {
        string id PK
        string jobId FK
        string clientId FK
        string voiceTalentId FK
        text message
        string status
        datetime invitedAt
        datetime respondedAt
        datetime createdAt
        datetime updatedAt
    }

    Rating {
        string id PK
        string raterId FK
        string rateeId FK
        string rateeType
        string jobId FK
        int rating
        text comment
        json detailedRatings
        datetime createdAt
        datetime updatedAt
    }
```

## Business Flow

```mermaid
flowchart TD
    A[User Registration] --> B{User Type?}
    B -->|Talent| C[VoiceTalent Profile]
    B -->|Client| D[VoiceClient Profile]

    C --> E[Upload Media/Samples]
    C --> F[Browse Jobs]
    C --> G[Apply to Jobs]
    C --> H[Receive Invitations]

    D --> I[Create Jobs]
    D --> J[Browse Talents]
    D --> K[Send Invitations]

    E --> L[Media Public]
    F --> M[Submit Applications]
    G --> N[Applications]
    H --> O[Accept/Decline]

    I --> P[Jobs Live]
    J --> Q[Talent Discovery]
    K --> R[Invitations Sent]

    M --> S[Application Review]
    N --> T[Client Reviews]
    O --> U[Invitation Response]

    P --> V[Job Applications]
    Q --> W[Talent Contact]
    R --> X[Invitation Status]

    S --> Y[Job Assignment]
    T --> Z[Application Decision]
    U --> AA[Invitation Result]

    Y --> BB[Job Work]
    Z --> CC[Job Assignment]
    AA --> DD[Job Assignment]

    BB --> EE[Job Completion]
    CC --> FF[Job Work]
    DD --> GG[Job Work]

    EE --> HH[Rating & Payment]
    FF --> II[Job Completion]
    GG --> JJ[Job Completion]

    HH --> KK[Project Complete]
    II --> LL[Rating & Payment]
    JJ --> MM[Rating & Payment]

    KK --> NN[End]
    LL --> OO[Project Complete]
    MM --> PP[Project Complete]

    OO --> QQ[End]
    PP --> RR[End]

    QQ --> SS[End]
    RR --> TT[End]
```

## Entity Categories

### Core User Entities

- **User**: Base authentication entity
- **VoiceTalent**: Voice talent profiles (renamed from VoiceTalents)
- **VoiceClient**: Client company profiles

### Content & Media Entities

- **Media**: Unified file management system (replaces VoiceSample, CustomSample, Studio info, and all file attachments)
  - Voice samples, custom samples, job attachments, studio photos, and all other files
  - Includes voice-specific metadata (voiceType, language, duration)
  - Linked to entities via MediaRelationship

### Job Management System

- **JobPosting**: Job opportunities posted by clients (includes casting sessions as a job type)
- **JobApplication**: Talent applications to jobs (replaces CastingProposal)
- **JobInvitation**: Direct invitations to talents for specific jobs (renamed from TalentInvitation)

### Rating & Review System

- **Rating**: Review and rating system for both talents and clients
- **MediaRelationship**: Links media files to various entities

### Supporting Entities

- **Title**: Professional titles/credentials
- **Organization**: Company/organization data
- **Contact**: Contact information
- **Member**: Organization membership
- **Revenue**: Financial tracking
- **VoiceLibrary**: Voice collections
- **OrganizationContact**: Organization contact associations
- **Payout**: Payment processing
- **RevenueDistribution**: Revenue sharing
- **Profile**: User profile data
- **ProfileTitleList**: Profile title associations
- **ViewingProgress**: Content viewing tracking

## Key Business Rules

1. **User Identity**: Each user can be either a VoiceTalent OR a VoiceClient, not both
2. **Job Applications**: VoiceTalents can apply to multiple JobPostings
3. **Job Invitations**: VoiceClients can invite multiple VoiceTalents to specific jobs
4. **Casting Sessions**: Are just a type of JobPosting (jobType = "casting")
5. **Media Management**: All files (voice samples, custom samples, job attachments, studio photos) are managed through the unified Media entity with relationships
6. **Job Lifecycle**: Jobs move through Draft → Published → Active → Completed states
7. **Application Status**: Applications can be Pending → Under Review → Shortlisted → Accepted/Rejected
8. **Job Types**: Open Casting, Direct Hire, Custom (no separate Campaign entity)
9. **Rating System**: Both talents and clients can rate each other after job completion

## Status Enums

### Voice Types

- Male, Female, Child, Teen, Adult, Senior, Character, Narrator, Announcer

### Project Types

- Commercial, Audiobook, Animation, Video Game, Podcast, E-learning, IVR, Other

### Job Types

- Open Casting, Direct Hire, Custom

### Status Types

- Draft, Published, Active, Completed, Cancelled, Pending, Approved, Rejected

### Application Status

- Pending, Under Review, Shortlisted, Rejected, Accepted, Withdrawn

### Invitation Status

- Pending, Accepted, Declined, Expired

### Rating Types

- Talent Rating (client rates talent)
- Client Rating (talent rates client)
- Job Rating (rating for specific job)
