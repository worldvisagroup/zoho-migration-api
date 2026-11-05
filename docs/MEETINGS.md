# Meetings API — Technical Extraction & Field Mapping Specification

- **Endpoint:** `GET /api/v1/meetings`
- **Controller:** [`MeetingsController`](file:///e:/World%20visa/zoho-api/src/modules/meetings/controllers/meetings.controller.ts)
- **Service:** [`MeetingsService`](file:///e:/World%20visa/zoho-api/src/modules/meetings/services/meetings.service.ts)
- **Repository:** [`MeetingsRepository`](file:///e:/World%20visa/zoho-api/src/modules/meetings/repositories/meetings.repository.ts)
- **Primary Collection:** `migrated_events` ([`MigratedEventModel`](file:///e:/World%20visa/zoho-api/src/database/schema/migrated-event.schema.ts))
- **Related Collections:** `migrated_meeting_recordings`, `migrated_users`, `migrated_leads`, `migrated_contacts`, `migrated_visa_applications`, `migrated_deals`, `migrated_spouse_skill_assessments`
- **Status:** Complete & Production Ready

---

## 1. API Overview

### Purpose
The Meetings API extracts consultation meetings, client appointments, and operational events from `migrated_events` (migrated from Zoho CRM Events/Meetings and Zoho Bookings). It normalizes event statuses (`scheduled`, `ended`, `cancelled`), resolves attendees and staff hosts with automatic fallback to linked customer records (Leads, Contacts, Deals, Visa Applications, Spouse Skill Assessments), generates fresh Cloudflare R2 presigned download URLs for meeting recordings from `migrated_meeting_recordings`, and returns paginated results ordered chronologically.

### Supported Query Parameters

| Parameter | Type | Required | Default | Validation Rules | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `zohoLeadId` | `string` | No | `undefined` | `@IsString()` | Filter meetings linked to a specific Zoho Lead (`_zoho_lead_id`). |
| `zohoContactId` | `string` | No | `undefined` | `@IsString()` | Filter meetings linked to a specific Zoho Contact (`_zoho_contact_id`). |
| `zohoDealId` | `string` | No | `undefined` | `@IsString()` | Filter meetings linked to a specific Zoho Deal (`_zoho_deal_id`). |
| `visaApplicationId` | `string` | No | `undefined` | `@IsString()` | Filter meetings linked to a Visa Application (`_zoho_visa_application_id`). |
| `spouseSkillAssementId` | `string` | No | `undefined` | `@IsString()` | Filter meetings linked to a Spouse Skill Assessment (schema spelling). |
| `spouseSkillAssessmentId` | `string` | No | `undefined` | `@IsString()` | Standardized alias for `spouseSkillAssementId`. |
| `type` | `enum` | No | `undefined` | `@IsIn(MEETING_PARENT_TYPES)` | Filter by parent record type (`lead, contact, deal, visa_application, spouse_skill_assessment, task, event, signed_document`). |
| `page` | `number` | No | `1` | `@IsInt()`, `@Min(1)` | 1-indexed pagination page number. |
| `limit` | `number` | No | `200` | `@IsInt()`, `@Min(1)`, `@Max(1000)` | Records per page (capped at 1,000). |
| `from` | `string` | No | `undefined` | `@IsISO8601({ strict: true })` | Inclusive start filter on Zoho `Created_Time`. |
| `to` | `string` | No | `undefined` | `@IsISO8601({ strict: true })` | Inclusive end filter on Zoho `Created_Time`. |

- **Sorting Guarantee:** Ascending order by creation timestamp: `{ Created_Time: 1, _id: 1 }` (stable chronological order).
- **Pagination Flag:** `hasMore = page * pageSize < total`.
- **Response Wrapper:** Uses `@BypassTransform()` to return the direct migration envelope (`data`, `total`, `page`, `pageSize`, `hasMore`).

---

## 2. Zoho Field Mapping

Direct mapping from MongoDB `migrated_events`, `migrated_meeting_recordings`, and related collections to [`MeetingItemDto`](file:///e:/World%20visa/zoho-api/src/modules/meetings/dto/meeting-response.dto.ts):

| Target Field | Target Type | Zoho Source Field | Source Type | Transformation Summary |
| :--- | :--- | :--- | :--- | :--- |
| `externalId` | `string` | `zoho_id` | String | Direct 1:1 copy of Zoho event unique identifier. |
| `title` | `string` | `Event_Title` | String | Trimmed event title. Defaults to empty string `""` if missing. |
| `description` | `string \| null` | `Description` | Textarea | Trimmed plain text notes. Returns `null` if empty or missing. |
| `status` | `TargetMeetingStatus` | `Meeting_Status`, `is_closed` | Picklist, Boolean | Normalized to `'scheduled'`, `'ended'`, or `'cancelled'` via status ladder. |
| `scheduledAt` | `string` (ISO 8601) | `Start_DateTime` | Datetime | Normalized to UTC ISO 8601 scheduled start timestamp. |
| `startedAt` | `string \| null` | `Start_DateTime`, `status` | Datetime, Computed | **If status === 'ended':** falls back to `scheduledAt`.<br>**If status === 'scheduled' or 'cancelled':** strictly `null`. |
| `endedAt` | `string` (ISO 8601) | `End_DateTime` | Datetime | Normalized to UTC ISO 8601 end timestamp. |
| `hostEmail` | `string \| null` | `_zoho_owner_id` &rarr; `migrated_users.email` | Lookup | Resolved staff host email via batch lookup, or `null`. |
| `hostId` | `string \| null` | `_zoho_owner_id` | String | Cleaned Zoho user ID of the staff host, or `null`. |
| `participants` | `MeetingParticipantDto[]` | Host + `Participants` + Parent Lookup | Array / Lookup | Deduplicated attendee list with `email`, `name`, and `type` (`'staff'` or `'guest'`). |
| `recording` | `MeetingRecordingDto \| null` | `migrated_meeting_recordings` &rarr; R2 | Lookup / Presigned | Cloudflare R2 presigned download URL, MIME type, and file size in bytes, or `null`. |
| `createdById` | `string \| null` | `_zoho_created_by_id` | String | Cleaned Zoho user ID of creator, or `null`. |
| `createdByEmail` | `string \| null` | `_zoho_created_by_id` &rarr; `migrated_users.email` | Lookup | Resolved creator email address via batch lookup, or `null`. |
| `modifiedById` | `string \| null` | `_zoho_modified_by_id` | String | Cleaned Zoho user ID of last modifier, or `null`. |
| `modifiedAt` | `string` (ISO 8601) | `Modified_Time`, `Created_Time` | Datetime | Primary `Modified_Time`, falls back to `Created_Time`. Never null. |

---

## 3. Field Transformation Logic

### 1. Status Normalization Ladder (`normalizeMeetingStatus`)
- **Attended Check:** If `Meeting_Status` is `"Attended"` (case-insensitive) &rarr; `'ended'`.
- **Cancelled / Postponed Check:** If `Meeting_Status` is `"Escaped"`, `"Postponed"`, `"Cancelled"`, or `"Canceled"` &rarr; `'cancelled'`.
- **Unstated / Null Picklist:**
  - If `is_closed === false` &rarr; `'scheduled'` (active future or ongoing meeting).
  - If `is_closed === true` &rarr; `'ended'` (historical closed event in CRM).

### 2. Actual Start Timestamp Resolution (`startedAt`)
Legacy Zoho CRM events record scheduled times (`Start_DateTime`, `End_DateTime`) but omit separate teleconferencing join timestamps:
- **Ended Meetings:** If `status === 'ended'`, `startedAt` falls back to `scheduledAt` (UTC ISO 8601).
- **Scheduled / Cancelled Meetings:** `startedAt` is strictly `null` (since the meeting has not actually taken place).

### 3. Participant Classification & Customer Fallback
Meetings require comprehensive attendee attribution distinguishing internal consultants from external clients:
1. **Staff Host Inclusion:** If `_zoho_owner_id` is resolved in `migrated_users`, the host is added first with `type: 'staff'`.
2. **Direct Attendees:** Iterates `record.Participants`, sanitizes email via `sanitizeEmail`, and deduplicates against seen emails:
   - Any participant marked `type: 'user'`, matching a known Zoho staff ID, matching `staffEmailSet`, or matching `hostEmail` is assigned `type: 'staff'`.
   - All other attendees are assigned `type: 'guest'`.
3. **Cascading Customer Fallback:** If the meeting has fewer than 2 participants (e.g. only the host exists or the Participants array is empty), the service queries the linked parent record in `migrated_leads`, `migrated_contacts`, `migrated_visa_applications`, `migrated_deals`, or `migrated_spouse_skill_assessments` and injects the client as `type: 'guest'`.

### 4. Cloudflare R2 Presigned Recording Resolution
- Locates matching recording in `migrated_meeting_recordings` where `zoho_event_id === record.zoho_id`.
- Generates a fresh presigned Cloudflare R2 download URL using `R2StorageService.generateDownloadUrlsBatch()`.
- Automatically maps MIME types based on file extension (e.g. `video/mp4`, `audio/mp4`).
- Falls back to `r2_download_url` or `zoho_share_url` if on-the-fly signing is unavailable.

### 5. Single-Pass Parallel Batching
- Gathers all unique user IDs across the page (`_zoho_owner_id`, `_zoho_created_by_id`, `_zoho_modified_by_id`, participant IDs) and executes a single query against `migrated_users`.
- Batch resolves recordings across all events in a single indexed query.
- Only executes customer parent lookups for the subset of events that actually lack client participants.

---

## 4. Zoho Enums & Values

### Meeting Status Mapping Matrix

| Zoho `Meeting_Status` | `is_closed` | Target `status` | Business Justification |
| :--- | :--- | :--- | :--- |
| `'Attended'` | Any | `'ended'` | Meeting was held and completed. |
| `'Escaped'` | Any | `'cancelled'` | Client or consultant did not attend (no-show). |
| `'Postponed'` | Any | `'cancelled'` | Event was postponed/rescheduled. |
| `'Cancelled'` / `'Canceled'` | Any | `'cancelled'` | Formally cancelled. |
| Missing / null | `false` | `'scheduled'` | Open future or ongoing calendar event. |
| Missing / null | `true` | `'ended'` | Historical closed CRM event. |

### Source Picklist Enums in Schema
- **`Meeting_Status`:** `'Attended'`, `'Postponed'`, `'Escaped'`
- **`Meeting_Type`:** `'Online'`, `'Ofline'`, `'Virtual'`
- **`Meeting_Location`:** `'Bangalore'`, `'Melbourne'`
- **`Record_Status__s`:** `'Available'`, `'Draft'`, `'Trash'`
- **`Currency`:** `'INR'`, `'USD'`

### Participant Classification Types
- `'staff'` — Internal migration consultants, agents, and administrative hosts.
- `'guest'` — Prospective visa applicants, primary clients, and external attendees.

### Supported Parent Record Types (`MEETING_PARENT_TYPES`)
- `lead`
- `contact`
- `deal`
- `visa_application`
- `spouse_skill_assessment`
- `task`
- `event`
- `signed_document`

---

## 5. Fallback Strategy

| Target Field | Condition | Resolution Path | Final Fallback Value |
| :--- | :--- | :--- | :--- |
| `externalId` | Missing or null `zoho_id` | Empty string assignment | `""` |
| `title` | Missing or null `Event_Title` | Empty string assignment | `""` |
| `description` | Missing or whitespace `Description` | Plain nullable string | `null` |
| `status` | Unstated status with `is_closed === false` | Open appointment rule | `'scheduled'` |
| `status` | Unstated status with `is_closed === true` | Historical event rule | `'ended'` |
| `scheduledAt` | Missing or invalid `Start_DateTime` | Unix Epoch UTC | `"1970-01-01T00:00:00.000Z"` |
| `startedAt` | Status is `'ended'` | Cascades to `scheduledAt` | `scheduledAt` timestamp |
| `startedAt` | Status is `'scheduled'` or `'cancelled'` | Unstarted rule | `null` |
| `endedAt` | Missing or invalid `End_DateTime` | Unix Epoch UTC | `"1970-01-01T00:00:00.000Z"` |
| `hostEmail` | Host ID missing or not in `migrated_users` | Lookup miss | `null` |
| `hostId` | Missing or null `_zoho_owner_id` | Cleaned nullable string | `null` |
| `participants` | Empty Participants array | Resolves parent customer record | `[host?, customer?]` |
| `recording` | Missing or unrecorded event | No recording document | `null` |
| `createdById` | Missing or null `_zoho_created_by_id` | Cleaned nullable string | `null` |
| `createdByEmail` | Creator ID not found in `migrated_users` | Lookup miss | `null` |
| `modifiedById` | Missing or null `_zoho_modified_by_id` | Cleaned nullable string | `null` |
| `modifiedAt` | Missing or invalid `Modified_Time` | Falls back to `Created_Time` &rarr; Epoch | `createdAt` value or Epoch |

---

## 6. Key Edge Cases

1. **Attendee Email Deduplication:** A consultant may appear both as the host and inside the `Participants` array. The deduplication set ensures each unique email is only emitted once, preserving the `'staff'` designation.
2. **Cascading Customer Parent Resolution:** When consultations are booked via Zoho Bookings, the client's email is often stored only on the parent Lead, Contact, Deal, or Visa Application rather than inside the `Participants` array. The service automatically resolves the customer and injects them as a `'guest'`.
3. **Deal & Visa Application Indirect Contact Resolution:** Deals and Visa Applications frequently link to a Contact (`_zoho_contact_id`). If the Deal record itself lacks an email, the service follows the relationship to the underlying Contact record to identify the client.
4. **`startedAt` Nullability Contract:** To prevent misleading analytical data, `startedAt` is explicitly `null` for meetings that are `'scheduled'` or `'cancelled'`. Only `'ended'` meetings inherit `scheduledAt` as their start time.
5. **Fresh Presigned Cloudflare R2 Recording URLs:** R2 URLs expire after their configured duration. Rather than serving static database strings that expire, the service signs fresh download URLs dynamically during query execution.

---

## 7. Response Reference

### TypeScript Interfaces

```typescript
export type TargetMeetingStatus = 'scheduled' | 'ended' | 'cancelled';
export type ParticipantType = 'staff' | 'guest';

export interface MeetingParticipantDto {
  email: string;                      // Email address of the participant
  name: string;                       // Display name of the participant
  type: ParticipantType;              // 'staff' | 'guest'
}

export interface MeetingRecordingDto {
  url: string;                        // Downloadable presigned URL for recording
  mimeType: string;                   // MIME type (e.g. 'video/mp4')
  sizeBytes: number;                  // File size in bytes
}

export interface MeetingItemDto {
  externalId: string;                 // Original Zoho ID (zoho_id)
  title: string;                      // Meeting title / subject
  description: string | null;         // Plain text description or null
  status: TargetMeetingStatus;        // 'scheduled' | 'ended' | 'cancelled'
  scheduledAt: string;                // Scheduled start time in UTC ISO 8601
  startedAt: string | null;           // Actual start time (only if status === 'ended')
  endedAt: string;                    // Scheduled / actual end time in UTC ISO 8601
  hostEmail: string | null;           // Host staff email address or null
  hostId: string | null;              // Zoho owner ID of the host
  participants: MeetingParticipantDto[]; // List of attendees (staff and guests)
  recording: MeetingRecordingDto | null; // Recording metadata or null
  createdById: string | null;         // Zoho creator ID
  createdByEmail: string | null;      // Creator staff email address
  modifiedAt: string;                 // Last modified timestamp in UTC ISO 8601
  modifiedById: string | null;        // Zoho modifier ID
}

export interface MeetingsResponseDto {
  data: MeetingItemDto[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
```

### JSON Response Example

```json
{
  "data": [
    {
      "externalId": "164193000005186138",
      "title": "Australia PR Initial Eligibility Consultation",
      "description": "Reviewed client qualifications, ACS points calculator, and English proficiency test plans.",
      "status": "ended",
      "scheduledAt": "2024-03-04T11:00:00.000Z",
      "startedAt": "2024-03-04T11:00:00.000Z",
      "endedAt": "2024-03-04T11:45:00.000Z",
      "hostEmail": "asha.sharma@worldvisa.in",
      "hostId": "164193000000512001",
      "participants": [
        {
          "email": "asha.sharma@worldvisa.in",
          "name": "Asha Sharma",
          "type": "staff"
        },
        {
          "email": "rohit.verma@example.com",
          "name": "Rohit Verma",
          "type": "guest"
        }
      ],
      "recording": {
        "url": "https://pub-r2.worldvisa.in/recordings/meeting_164193000005186138.mp4?X-Amz-Signature=abc123",
        "mimeType": "video/mp4",
        "sizeBytes": 52428800
      },
      "createdById": "164193000000512001",
      "createdByEmail": "asha.sharma@worldvisa.in",
      "modifiedAt": "2024-03-04T12:00:00.000Z",
      "modifiedById": "164193000000512001"
    },
    {
      "externalId": "164193000005186210",
      "title": "Document Verification Follow-up",
      "description": null,
      "status": "cancelled",
      "scheduledAt": "2024-03-06T14:00:00.000Z",
      "startedAt": null,
      "endedAt": "2024-03-06T14:30:00.000Z",
      "hostEmail": "vikram.seth@worldvisa.in",
      "hostId": "164193000000512009",
      "participants": [
        {
          "email": "vikram.seth@worldvisa.in",
          "name": "Vikram Seth",
          "type": "staff"
        },
        {
          "email": "priya.sharma@example.com",
          "name": "Priya Sharma",
          "type": "guest"
        }
      ],
      "recording": null,
      "createdById": "164193000000512009",
      "createdByEmail": "vikram.seth@worldvisa.in",
      "modifiedAt": "2024-03-06T13:45:00.000Z",
      "modifiedById": "164193000000512009"
    },
    {
      "externalId": "164193000005186350",
      "title": "Subclass 190 Nomination Strategy",
      "description": "Reviewing state nomination requirements for Victoria and NSW.",
      "status": "scheduled",
      "scheduledAt": "2026-12-15T10:00:00.000Z",
      "startedAt": null,
      "endedAt": "2026-12-15T10:45:00.000Z",
      "hostEmail": "asha.sharma@worldvisa.in",
      "hostId": "164193000000512001",
      "participants": [
        {
          "email": "asha.sharma@worldvisa.in",
          "name": "Asha Sharma",
          "type": "staff"
        },
        {
          "email": "karan.mehta@example.com",
          "name": "Karan Mehta",
          "type": "guest"
        }
      ],
      "recording": null,
      "createdById": "164193000000512001",
      "createdByEmail": "asha.sharma@worldvisa.in",
      "modifiedAt": "2026-11-01T09:30:00.000Z",
      "modifiedById": "164193000000512001"
    }
  ],
  "total": 6571,
  "page": 1,
  "pageSize": 200,
  "hasMore": true
}
```

