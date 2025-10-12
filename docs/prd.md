# 🎙️ VoiceAct — Product Requirements Document (PRD)

## 1. 📘 Overview

**VoiceAct** is a platform for **voice actors** to manage their careers — from creating profiles and uploading categorized voice samples, to managing active projects and collaborating with recording studios.

The app bridges **voice actors, studios, and clients** by streamlining the casting, recording, and project management process.

---

## 2. 🎯 Objectives & Goals

### 2.1 Primary Goals

- Empower voice actors to **showcase their talent** and easily update their professional profiles.
- Simplify how actors **organize voice samples** by genre, tone, and project type.
- Provide visibility into **ongoing and past projects/jobs**, including deadlines and deliverables.
- Facilitate **studio collaboration** for recording sessions with transcripts or video guides.
- Ensure that all communication and file delivery are **centralized and secure**.

### 2.2 Secondary Goals

- Enable casting directors to discover talent efficiently.
- Allow studios to assign actors to recording tasks and manage revisions.
- Support multilingual voice actors and cross-regional job listings.

---

## 3. 👥 Target Users

| User Type                      | Description                               | Key Needs                                                        |
| ------------------------------ | ----------------------------------------- | ---------------------------------------------------------------- |
| **Voice Actor**                | Talent providing voiceover work           | Showcase portfolio, manage jobs, receive scripts, track payments |
| **Studio Engineer / Producer** | Person facilitating recording sessions    | Assign jobs, manage revisions, track recording progress          |
| **Casting Director / Client**  | Person seeking voice talent for a project | Discover actors, review samples, manage casting sessions         |

---

## 4. 📱 Core Features & Requirements

### 4.1 User Profiles

**Purpose:** Represent professional identity of voice actors.

**Functional Requirements:**

- Create and edit personal profile (name, bio, language, accent, skills)
- Upload headshot/profile image
- Add voice categories (commercial, animation, narration, etc.)
- Display demo reel links and previous work

**Acceptance Criteria:**

- User can create a profile with all mandatory fields
- Editable sections persist across sessions
- Public/private visibility toggle available

---

### 4.2 Voice Samples Management

**Purpose:** Centralized portfolio of categorized voice recordings.

**Functional Requirements:**

- Upload and categorize voice samples by:
  - Genre (commercial, audiobook, game, etc.)
  - Tone/emotion (serious, playful, warm, dramatic)
  - Language/accent

- Preview and delete samples
- Share sample links (public or password-protected)
- Optional studio-uploaded samples (tagged as “verified”)

**Acceptance Criteria:**

- Each audio file is playable within app
- Metadata properly searchable and filterable
- Supports .mp3, .wav, .ogg formats

---

### 4.3 Job / Project Management

**Purpose:** Track actor involvement in active and past projects.

**Functional Requirements:**

- List current and past projects
- Each project includes:
  - Project title, client/studio name
  - Script, due date, progress, and payment status
  - Communication thread between actor and manager

- Actors can upload deliverables and mark tasks as complete
- Statuses: Assigned → In Progress → Review → Completed

**Acceptance Criteria:**

- Actor dashboard shows projects with real-time status updates
- Upload limit up to 500MB per file
- Notifications for assignment, feedback, and approval

---

### 4.4 Studio Collaboration Tools

**Purpose:** Enable streamlined collaboration for recording sessions.

**Functional Requirements:**

- Studio can assign recording tasks to actors
- Attach transcripts, video references, or time-stamped scripts
- Support for in-app audio recording and direct upload
- Real-time session mode using WebRTC (for remote direction)
- Version control for voice takes (V1, V2, etc.)
- Feedback comments per line or timestamp

**Acceptance Criteria:**

- Actor can open studio assignment and access reference materials
- Studio can review and comment within 24h of submission
- Multiple takes are stored and versioned

---

### 4.5 Notifications & Messaging

**Purpose:** Keep users updated and facilitate collaboration.

**Functional Requirements:**

- Real-time notifications for:
  - New assignments
  - Job approvals/rejections
  - Studio feedback

- Direct chat between actors and studios
- Email digest for weekly updates

**Acceptance Criteria:**

- Notifications delivered via web push and in-app
- Chat messages persist and load within 2 seconds
- Notification preferences configurable per user
