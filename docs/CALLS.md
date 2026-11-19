# Calls API — Technical Extraction & Field Mapping Specification

- **Endpoint:** `GET /api/v1/calls`
- **Controller:** [`CallsController`](file:///e:/World%20visa/zoho-api/src/modules/calls/controllers/calls.controller.ts)
- **Service:** [`CallsService`](file:///e:/World%20visa/zoho-api/src/modules/calls/services/calls.service.ts)
- **Repository:** [`CallsRepository`](file:///e:/World%20visa/zoho-api/src/modules/calls/repositories/calls.repository.ts)
- **Authentication:** `x-api-key: <API_KEY>` (Required header, 401 Unauthorized if missing/invalid)
- **Source Collection:** `migrated_calls` ([`MigratedCallModel`](file:///e:/World%20visa/zoho-api/src/database/schema/migrated-call.schema.ts))
- **Related Collections:** `migrated_leads`, `migrated_contacts`, `migrated_deals`, `migrated_visa_applications`, `migrated_spouse_skill_assessments`, `migrated_users`
- **Status:** Complete & Production Ready

---

## 1. API Overview

### Purpose
The Calls API extracts call activity logs and telephony history from `migrated_calls` (migrated from the Zoho CRM Calls module and Zoho PhoneBridge integration). It normalizes telephony direction (`inbound`, `outbound`) and call outcomes (`answered`, `missed`, `cancelled`, `busy`), dynamically resolves customer phone numbers across 5 polymorphic parent record types (Lead, Contact, Deal, Visa Application, Spouse Skill Assessment) using single-pass parallel batching, normalizes agent and creator/modifier email addresses from `migrated_users`, extracts PhoneBridge voice recording URLs, and returns paginated results sorted chronologically.

### Supported Query Parameters

| Parameter | Type | Required | Default | Validation Rules | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `zohoLeadId` | `string` | No | `undefined` | `@IsString()` | Filter calls linked to a specific Zoho Lead (`_zoho_lead_id`). |
| `zohoContactId` | `string` | No | `undefined` | `@IsString()` | Filter calls linked to a specific Zoho Contact (`_zoho_contact_id`). |
| `zohoDealId` | `string` | No | `undefined` | `@IsString()` | Filter calls linked to a specific Zoho Deal (`_zoho_deal_id`). |
| `visaApplicationId` | `string` | No | `undefined` | `@IsString()` | Filter calls linked to a Visa Application (`_zoho_visa_application_id`). |
| `spouseSkillAssessmentId` | `string` | No | `undefined` | `@IsString()` | Filter calls linked to a Spouse Skill Assessment (`_zoho_spouse_skill_assessment_id`). |
| `type` | `enum` | No | `undefined` | `@IsIn(CALL_PARENT_TYPES)` | Filter by parent type (`lead, contact, deal, visa_application, spouse_skill_assessment, task, event, signed_document`). |
| `page` | `number` | No | `1` | `@IsInt()`, `@Min(1)` | 1-indexed pagination page number. |
| `limit` | `number` | No | `200` | `@IsInt()`, `@Min(1)`, `@Max(1000)` | Records per page (capped at 1,000). |
| `from` | `string` | No | `undefined` | `@IsISO8601({ strict: true })` | Inclusive start filter on Zoho `Created_Time`. |
| `to` | `string` | No | `undefined` | `@IsISO8601({ strict: true })` | Inclusive end filter on Zoho `Created_Time`. |

- **Sorting Guarantee:** Ascending order by creation timestamp: `{ Created_Time: 1 }` (oldest to newest).
- **Pagination Flag:** `hasMore = page * pageSize < total`.
- **Response Wrapper:** Uses `@BypassTransform()` to return the direct migration envelope (`data`, `total`, `page`, `pageSize`, `hasMore`).

---

## 2. Zoho Field Mapping

Direct mapping from MongoDB `migrated_calls` and related collections to [`CallItemDto`](file:///e:/World%20visa/zoho-api/src/modules/calls/dto/call-response.dto.ts):

| Target Field | Target Type | Zoho Source Field | Source Type | Transformation Summary |
| :--- | :--- | :--- | :--- | :--- |
| `externalId` | `string` | `zoho_id` | String | Direct 1:1 copy of Zoho call unique identifier. |
| `parentType` | `string \| null` | `parent_entity_type` | String | Standardized parent entity type (`lead`, `contact`, `deal`, `visa_application`, `spouse_skill_assessment`, `task`, `event`, `signed_document`), or `null`. |
| `parentZohoId` | `string \| null` | `_zoho_*_id` | String | Original Zoho ID of the linked parent record (`_zoho_lead_id`, `_zoho_contact_id`, etc.), or `null`. |
| `direction` | `CallDirection` | `Call_Type` | Picklist | Mapped to `'inbound'` or `'outbound'`. Missed calls map to `'inbound'`. Defaults to `'outbound'`. |
| `status` | `CallStatus` | `Call_Duration_in_seconds`, `Outgoing_Call_Status`, `Call_Result` | Number, Picklists | Evaluates talk time first (`> 0` &rarr; `'answered'`), then checks cancelled and busy indicators, defaulting to `'missed'`. |
| `customerPhone` | `string` | Polymorphic parent record &rarr; `Phone`, `Mobile`, `Country_Code` | String | Resolved in parallel across Lead, Contact, Deal, Visa Application, or Spouse Assessment. Normalized to international E.164. Fallback: `+919999999999`. |
| `agentEmail` | `string \| null` | `_zoho_owner_id` &rarr; `migrated_users.email` | Lookup | Resolved agent email address via single-pass batch lookup, or `null`. |
| `startedAt` | `string` (ISO 8601) | `Call_Start_Time` | Datetime | Normalized to UTC ISO 8601 string. Fallback: `1970-01-01T00:00:00.000Z`. |
| `durationSeconds` | `number` | `Call_Duration_in_seconds` | Integer | Parsed integer seconds &ge; 0 (`Math.max(0, Math.floor(val))`). Defaults to `0` if null or NaN. |
| `notes` | `string \| null` | `Description` | Textarea | Trimmed plain text notes. Returns `null` if empty or missing. |
| `followUpAt` | `string \| null` | `When_To_Make_The_Call` | Datetime | Scheduled follow-up call timestamp normalized to UTC ISO 8601, or `null`. |
| `recording` | `CallRecordingDto \| null` | `Voice_Recording__s` | Website URL | Parsed into `{ url, mimeType: '', sizeBytes: '' }` if URL present; otherwise `null`. |
| `createdByZohoId` | `string \| null` | `_zoho_created_by_id` | String | Cleaned Zoho user ID of the creator, or `null`. |
| `createdByEmail` | `string \| null` | `_zoho_created_by_id` &rarr; `migrated_users.email` | Lookup | Resolved creator email address via batch lookup, or `null`. |
| `modifiedByZohoId` | `string \| null` | `_zoho_modified_by_id` | String | Cleaned Zoho user ID of the modifier, or `null`. |
| `modifiedByEmail` | `string \| null` | `_zoho_modified_by_id` &rarr; `migrated_users.email` | Lookup | Resolved modifier email address via batch lookup, or `null`. |
| `createdAt` | `string` (ISO 8601) | `Created_Time` | Datetime | Normalized to UTC ISO 8601. Fallback: `1970-01-01T00:00:00.000Z`. |
| `modifiedAt` | `string` (ISO 8601) | `Modified_Time`, `Created_Time` | Datetime | Primary `Modified_Time`, falls back to `Created_Time`. Never null. |

---

## 3. Field Transformation Logic

### 1. Call Direction Normalization (`resolveDirection`)
- Case-insensitively examines `Call_Type.trim().toLowerCase()`:
  - `"inbound"` &rarr; `'inbound'`
  - `"missed"` &rarr; `'inbound'` (in Zoho CRM, a "Missed" call represents an incoming customer call that was unanswered by the agent)
  - `"outbound"` &rarr; `'outbound'`
- **Fallback:** If missing, empty, or unstated &rarr; `'outbound'` (safe default as CRM telecallers predominantly log outbound activities).

### 2. Deterministic Call Status Resolution (`resolveStatus`)
Status resolution follows a strict deterministic decision ladder:
1. **Talk Time Check (Duration > 0):** If `Call_Duration_in_seconds != null && Call_Duration_in_seconds > 0`, the call connected and had voice activity. Status is strictly `'answered'`.
2. **Zero or Missing Duration (Duration == 0 or null):**
   - **Cancelled Check:** If `Outgoing_Call_Status?.toLowerCase() === 'cancelled'` or `Call_Result?.toLowerCase().includes('cancelled')` &rarr; `'cancelled'`.
   - **Busy / Unreachable Check:** If `Call_Result` contains `'busy'`, `'reachable'` (e.g. *"Number Not Reachable"*), or `'no response/busy'` &rarr; `'busy'`.
   - **Default Missed:** All other uncompleted outcomes (*"Ringing Not Answering"*, *"Missed"*, *"TC"*, *"RNR-3"*, null) resolve to `'missed'`.

### 3. Polymorphic Parallel Customer Phone Resolution (`batchResolveCustomerPhones`)
To prevent N+1 queries across polymorphic parent records:
1. The repository scans the page of calls and collects unique parent IDs into 5 mutually exclusive sets: `leadIds`, `contactIds`, `dealIds`, `visaAppIds`, and `spouseIds`.
2. Fires parallel batch queries via `Promise.all` across:
   - `MigratedLeadModel.find({ zoho_id: { $in: leadIds } })`
   - `MigratedContactModel.find({ zoho_id: { $in: contactIds } })`
   - `MigratedDealModel.find({ zoho_id: { $in: dealIds } })`
   - `MigratedVisaApplicationModel.find({ zoho_id: { $in: visaAppIds } })`
   - `MigratedSpouseSkillAssessmentModel.find({ zoho_id: { $in: spouseIds } })`
3. Normalizes Lead and Contact phone numbers using `normalizePhoneNumber(Phone, Mobile, Country_Code)`.
4. **Deal & Visa App Indirect Resolution:** Deals and Visa Applications frequently inherit the customer's phone from their linked Contact (`_zoho_contact_id`). If the Deal has its own `Phone`, it is prioritized; otherwise, the linked Contact's phone is used. Any missing contact IDs are batch-loaded in an auxiliary pass.
5. Maps each call to its resolved phone number in memory. If no phone could be found or the record has no linked entity, it falls back to `DEFAULT_FALLBACK_PHONE` (`+919999999999`).

### 4. Single-Pass Staff Email Batching (`batchResolveUserEmails`)
To populate `agentEmail`, `createdByEmail`, and `modifiedByEmail`:
- Extracts unique user IDs from `_zoho_owner_id`, `_zoho_created_by_id`, and `_zoho_modified_by_id`.
- Executes a single indexed query: `MigratedUserModel.find({ zoho_id: { $in: Array.from(uniqueUserIds) } })`.
- Sanitizes and lowercases emails via `normalizeEmail(user.email)` in memory.

### 5. Recording Metadata (`resolveRecording`)
- If `Voice_Recording__s` contains a non-empty string, it is trimmed and wrapped into `CallRecordingDto` (`{ url, mimeType: '', sizeBytes: '' }`).
- If empty, null, or whitespace-only, `recording` is strictly `null`.

### 6. Duration Sanitization & Timestamp Normalization
- `Call_Duration_in_seconds` is floored and clamped to non-negative integers: `Math.max(0, Math.floor(val))`.
- Timestamps (`Call_Start_Time`, `When_To_Make_The_Call`, `Created_Time`, `Modified_Time`) are converted to strict UTC ISO 8601 strings via `normalizeZohoTimestamp`.

---

## 4. Zoho Enums & Values

### Call Direction Mapping Matrix

| Source `Call_Type` | Mapped Target Direction | Business Justification |
| :--- | :--- | :--- |
| `'Inbound'` | `'inbound'` | Customer originated call. |
| `'Missed'` | `'inbound'` | Customer originated incoming call that went unanswered. |
| `'Outbound'` | `'outbound'` | Agent originated call. |
| `null` / empty / other | `'outbound'` | Default fallback; majority of CRM telephony is agent-initiated outreach. |

### Call Status Resolution Matrix

| Talk Time (`Call_Duration_in_seconds`) | `Outgoing_Call_Status` | `Call_Result` | Target `status` |
| :--- | :--- | :--- | :--- |
| `> 0` | Any | Any | `'answered'` |
| `<= 0` or `null` | `'Cancelled'` | Any | `'cancelled'` |
| `<= 0` or `null` | Any | Contains `"cancelled"` | `'cancelled'` |
| `<= 0` or `null` | Not cancelled | Contains `"busy"`, `"reachable"`, or `"no response/busy"` | `'busy'` |
| `<= 0` or `null` | Not cancelled | Any other value (`'Ringing Not Answering'`, `'RNR-3'`, null, etc.) | `'missed'` |

### Source Outgoing Call Status Picklist Enums
- `'Scheduled'`
- `'Completed'`
- `'Overdue'`
- `'Cancelled'`

### Source Call Result Picklist Enums (from Schema)
`'No response/Busy'`, `'Interested'`, `'Not interested'`, `'Requested call back'`, `'Invalid number'`, `'Cold Deferred'`, `'Does Not Qualify'`, `'IG'`, `'Interested 3'`, `'Interested 5'`, `'Interested 7'`, `'Job only'`, `'More time to decide'`, `'No Number'`, `'Number Not Reachable'`, `'Requested more info'`, `'Ringing Not Answering'`, `'RNR-3'`, `'RNR-5'`, `'RNR-7'`, `'TC'`, `'Wrong Number'`

### Source Call Purpose Picklist Enums
`'Prospecting'`, `'Administrative'`, `'Negotiation'`, `'Demo'`, `'Call New Lead'`, `'Support'`, `'Project'`

### Supported Parent Record Types (`CALL_PARENT_TYPES`)
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
| `parentType` | Missing or unrecognized `parent_entity_type` | Unresolved entity | `null` |
| `parentZohoId` | Missing ID in matched `_zoho_*_id` | Null fallback | `null` |
| `direction` | Missing, empty, or unmapped `Call_Type` | Standard telecalling direction assumption | `'outbound'` |
| `status` | Missing duration, status, and result | Unanswered assumption | `'missed'` |
| `customerPhone` | Missing entity, empty phone, or invalid syntax | Fallback phone assignment | `"+919999999999"` |
| `agentEmail` | Owner ID missing or not found in `migrated_users` | Unassigned lookup | `null` |
| `startedAt` | Missing or invalid `Call_Start_Time` | Unix Epoch UTC | `"1970-01-01T00:00:00.000Z"` |
| `durationSeconds` | Missing or invalid `Call_Duration_in_seconds` | Zero duration integer | `0` |
| `notes` | Missing or whitespace-only `Description` | Plain nullable string | `null` |
| `followUpAt` | Missing or invalid `When_To_Make_The_Call` | Nullable ISO timestamp | `null` |
| `recording` | Missing or whitespace `Voice_Recording__s` | Nullable object | `null` |
| `createdByEmail` | Creator ID missing or not in `migrated_users` | Unassigned lookup | `null` |
| `createdByZohoId` | Missing or null `_zoho_created_by_id` | Cleaned nullable string | `null` |
| `createdAt` | Missing or invalid `Created_Time` | Unix Epoch UTC | `"1970-01-01T00:00:00.000Z"` |
| `modifiedByEmail` | Modifier ID missing or not in `migrated_users` | Unassigned lookup | `null` |
| `modifiedByZohoId` | Missing or null `_zoho_modified_by_id` | Cleaned nullable string | `null` |
| `modifiedAt` | Missing or invalid `Modified_Time` | Falls back to `Created_Time` &rarr; Epoch | `createdAt` value or Epoch |

---

## 6. Key Edge Cases

1. **Missed Calls Are Categorized as Inbound:** In Zoho CRM PhoneBridge, a call logged with `Call_Type: "Missed"` indicates an inbound call from a customer that rang until timeout without being picked up by an agent. The engine properly maps direction to `'inbound'` and status to `'missed'`.
2. **Talk Time Overrules Status Picklists:** In legacy Zoho records, human agents often leave the call status or result dropdown as *"Busy"* or *"Ringing Not Answering"*, but PhoneBridge telephony recorded actual talk time (`Call_Duration_in_seconds > 0`). The service treats duration > 0 as authoritative ground truth, overriding negative picklists to `'answered'`.
3. **Polymorphic Entity Cascade for Customer Phone:** Calls can be attached to 5 different business entities. The lookup pipeline resolves phones following this hierarchy:
   - **Lead:** `Phone` &rarr; `Mobile` (using Lead `Country_Code`)
   - **Contact:** `Phone` &rarr; `Mobile` (using Contact `Country_Code`)
   - **Deal:** Deal `Phone` &rarr; linked Contact (`_zoho_contact_id`) `Phone`
   - **Visa Application:** Linked Contact (`_zoho_contact_id`) `Phone`
   - **Spouse Assessment:** Spouse `Phone`
   - **Fallback:** `+919999999999` prevents downstream telephony/SMS pipelines from breaking on null values.
4. **PhoneBridge Recording URLs:** PhoneBridge voice recordings are stored as direct HTTP/HTTPS URLs in `Voice_Recording__s`. MIME type and file size in bytes are omitted by Zoho PhoneBridge; the DTO provides empty strings (`""`) to fulfill strict contract requirements without fabricating metadata.
5. **Scheduled Follow-up Timestamps:** The Zoho custom field `When_To_Make_The_Call` is normalized to ISO 8601 as `followUpAt`. This allows downstream calendar and dialer services to automatically schedule agent reminders.

---

## 7. Response Reference

### TypeScript Interfaces

```typescript
export type CallDirection = 'inbound' | 'outbound';
export type CallStatus = 'answered' | 'missed' | 'cancelled' | 'busy';

export interface CallRecordingDto {
  url: string;
  mimeType: string;
  sizeBytes: string;
}

export interface CallItemDto {
  externalId: string;
  parentType: string | null;
  parentZohoId: string | null;
  direction: CallDirection;
  status: CallStatus;
  customerPhone: string;
  agentEmail: string | null;
  startedAt: string;
  durationSeconds: number;
  notes: string | null;
  followUpAt: string | null;
  recording: CallRecordingDto | null;
  createdByEmail: string | null;
  createdByZohoId: string | null;
  createdAt: string;
  modifiedByEmail: string | null;
  modifiedByZohoId: string | null;
  modifiedAt: string;
}

export interface CallsResponseDto {
  data: CallItemDto[];
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
      "externalId": "164193000020539001",
      "parentType": "lead",
      "parentZohoId": "164193000000811047",
      "direction": "outbound",
      "status": "answered",
      "customerPhone": "+919876543210",
      "agentEmail": "asha.sharma@worldvisa.in",
      "startedAt": "2024-03-02T10:15:00.000Z",
      "durationSeconds": 185,
      "notes": "Discussed subclass 189 points calculation and ACS skill assessment requirements.",
      "followUpAt": "2024-03-10T09:30:00.000Z",
      "recording": {
        "url": "https://phonebridge.zoho.com/recordings/call_164193000020539001.mp3",
        "mimeType": "",
        "sizeBytes": ""
      },
      "createdByEmail": "asha.sharma@worldvisa.in",
      "createdByZohoId": "164193000000028001",
      "createdAt": "2024-03-02T10:15:00.000Z",
      "modifiedByEmail": "asha.sharma@worldvisa.in",
      "modifiedByZohoId": "164193000000028001",
      "modifiedAt": "2024-03-02T10:20:00.000Z"
    },
    {
      "externalId": "164193000020539045",
      "parentType": "contact",
      "parentZohoId": "164193000000822091",
      "direction": "inbound",
      "status": "missed",
      "customerPhone": "+919123456789",
      "agentEmail": null,
      "startedAt": "2024-03-03T04:22:15.000Z",
      "durationSeconds": 0,
      "notes": null,
      "followUpAt": null,
      "recording": null,
      "createdByEmail": null,
      "createdByZohoId": null,
      "createdAt": "2024-03-03T04:22:15.000Z",
      "modifiedByEmail": null,
      "modifiedByZohoId": null,
      "modifiedAt": "2024-03-03T04:22:15.000Z"
    },
    {
      "externalId": "164193000020539120",
      "parentType": "deal",
      "parentZohoId": "164193000000899014",
      "direction": "outbound",
      "status": "busy",
      "customerPhone": "+919988776655",
      "agentEmail": "rahul.patel@worldvisa.in",
      "startedAt": "2024-03-04T11:00:00.000Z",
      "durationSeconds": 0,
      "notes": "Number was unreachable. Will retry tomorrow morning.",
      "followUpAt": "2024-03-05T05:30:00.000Z",
      "recording": null,
      "createdByEmail": "rahul.patel@worldvisa.in",
      "createdByZohoId": "164193000000028005",
      "createdAt": "2024-03-04T11:00:00.000Z",
      "modifiedByEmail": "rahul.patel@worldvisa.in",
      "modifiedByZohoId": "164193000000028005",
      "modifiedAt": "2024-03-04T11:02:30.000Z"
    }
  ],
  "total": 3482,
  "page": 1,
  "pageSize": 200,
  "hasMore": true
}
```

