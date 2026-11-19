# Notes API — Technical Extraction & Field Mapping Specification

- **Endpoint:** `GET /api/v1/notes`
- **Controller:** [`NotesController`](file:///e:/World%20visa/zoho-api/src/modules/notes/controllers/notes.controller.ts)
- **Service:** [`NotesService`](file:///e:/World%20visa/zoho-api/src/modules/notes/services/notes.service.ts)
- **Repository:** [`NotesRepository`](file:///e:/World%20visa/zoho-api/src/modules/notes/repositories/notes.repository.ts)
- **Authentication:** `x-api-key: <API_KEY>` (Required header, 401 Unauthorized if missing/invalid)
- **Source Collection:** `migrated_notes` ([`MigratedNoteModel`](file:///e:/World%20visa/zoho-api/src/database/schema/migrated-note.schema.ts))
- **Related Collections:** `migrated_users` (for staff creator/modifier email resolution)
- **Status:** Complete & Production Ready

---

## 1. API Overview

### Purpose
The Notes API extracts CRM consultation notes, internal agent remarks, and client logs from `migrated_notes`. It formats the note body by combining title and content (`Note_Title:- Note_Content`), resolves creator and modifier email addresses via single-pass batch lookup against `migrated_users` to avoid N+1 queries, supports filtering by related parent entity (`lead, contact, deal, visa_application, spouse_skill_assessment, task, event, signed_document`), and provides paginated results ordered oldest to newest by `Created_Time`.

### Supported Query Parameters

| Parameter | Type | Required | Default | Validation Rules | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `zohoLeadId` | `string` | No | `undefined` | `@IsString()` | Filter notes linked to a specific Zoho Lead (`_zoho_lead_id`). |
| `zohoContactId` | `string` | No | `undefined` | `@IsString()` | Filter notes linked to a specific Zoho Contact (`_zoho_contact_id`). |
| `zohoDealId` | `string` | No | `undefined` | `@IsString()` | Filter notes linked to a specific Zoho Deal (`_zoho_deal_id`). |
| `visaApplicationId` | `string` | No | `undefined` | `@IsString()` | Filter notes linked to a Visa Application (`_zoho_visa_application_id`). |
| `spouseSkillAssessmentId` | `string` | No | `undefined` | `@IsString()` | Filter notes linked to a Spouse Skill Assessment (`_zoho_spouse_skill_assessment_id`). |
| `type` | `enum` | No | `undefined` | `@IsIn(NOTE_PARENT_TYPES)` | Filter by parent record type (`lead, contact, deal, visa_application, spouse_skill_assessment, task, event, signed_document`). |
| `page` | `number` | No | `1` | `@IsInt()`, `@Min(1)` | 1-indexed pagination page number. |
| `limit` | `number` | No | `200` | `@IsInt()`, `@Min(1)`, `@Max(1000)` | Records per page (capped at 1,000). |
| `from` | `string` | No | `undefined` | `@IsISO8601({ strict: true })` | Inclusive start filter on Zoho `Created_Time`. |
| `to` | `string` | No | `undefined` | `@IsISO8601({ strict: true })` | Inclusive end filter on Zoho `Created_Time`. |

- **Sorting Guarantee:** Ascending order by creation timestamp: `{ Created_Time: 1 }` (oldest to newest).
- **Pagination Flag:** `hasMore = page * pageSize < total`.
- **Response Wrapper:** Uses `@BypassTransform()` to return the direct migration envelope (`data`, `total`, `page`, `pageSize`, `hasMore`).

---

## 2. Zoho Field Mapping

Direct mapping from MongoDB `migrated_notes` and `migrated_users` to [`NoteItemDto`](file:///e:/World%20visa/zoho-api/src/modules/notes/dto/note-response.dto.ts):

| Target Field | Target Type | Zoho Source Field | Source Type | Transformation Summary |
| :--- | :--- | :--- | :--- | :--- |
| `externalId` | `string` | `zoho_id` | String | Direct 1:1 copy of Zoho note unique identifier. |
| `parentType` | `string \| null` | `parent_entity_type` | String | Standardized parent entity type (`lead`, `contact`, `deal`, `visa_application`, `spouse_skill_assessment`, `task`, `event`, `signed_document`), or `null`. |
| `parentZohoId` | `string \| null` | `_zoho_*_id` | String | Original Zoho ID of the linked parent record (`_zoho_lead_id`, `_zoho_contact_id`, etc.), or `null`. |
| `body` | `string` | `Note_Title`, `Note_Content` | Text, Text | Combined into `"${title}:- ${content}"`. Gracefully handles notes with title-only, content-only, or empty strings. |
| `createdByEmail` | `string \| null` | `_zoho_created_by_id` &rarr; `migrated_users.email` | Lookup | Resolved creator email address via single-pass batch lookup, or `null`. |
| `createdByZohoId` | `string \| null` | `_zoho_created_by_id` | String | Cleaned Zoho user ID of the creator, or `null`. |
| `createdAt` | `string` (ISO 8601) | `Created_Time` | Datetime | Normalized to UTC ISO 8601 string. Fallback: `1970-01-01T00:00:00.000Z`. |
| `modifiedByEmail` | `string \| null` | `_zoho_modified_by_id` &rarr; `migrated_users.email` | Lookup | Resolved modifier email address via batch lookup, or `null`. |
| `modifiedByZohoId` | `string \| null` | `_zoho_modified_by_id` | String | Cleaned Zoho user ID of the modifier, or `null`. |
| `modifiedAt` | `string` (ISO 8601) | `Modified_Time`, `Created_Time` | Datetime | Primary `Modified_Time`, falls back to `Created_Time`. Never null. |

---

## 3. Field Transformation Logic

### 1. Note Body Formatting (`formatBody`)
In Zoho CRM, notes store a summary in `Note_Title` and the body in `Note_Content`. To present a consolidated, readable representation in the target application:
- Safely trims both `Note_Title` and `Note_Content`.
- **Both Present:** Joins them using the standard delimiter: `"${title}:- ${content}"`.
  *Example:* `Note_Title: "Document Verification"`, `Note_Content: "Verified ACS assessment letter."` &rarr; `"Document Verification:- Verified ACS assessment letter."`
- **Title Only:** If `Note_Content` is missing or whitespace-only, returns just the trimmed title without trailing separators.
- **Content Only:** If `Note_Title` is missing or whitespace-only, returns just the trimmed content without leading separators.
- **Both Missing:** If both fields are empty or whitespace-only, returns empty string `""`.

### 2. Single-Pass Staff Email Batching (`findUserEmailsByZohoIds`)
To resolve staff email addresses for note creators and editors without triggering N+1 database queries:
- Gathers all unique Zoho user IDs across the page from `_zoho_created_by_id` and `_zoho_modified_by_id`.
- Executes a single indexed query: `userModel.find({ zoho_id: { $in: zohoUserIds } })`.
- Sanitizes and lowercases each user's email via `normalizeEmail(user.email)`.
- Builds an in-memory hash map for `O(1)` retrieval during DTO mapping. Unmatched or deleted IDs safely map to `null`.

### 3. UTC ISO 8601 Timestamp Normalization
- All timestamps (`Created_Time`, `Modified_Time`) are parsed and normalized via `normalizeZohoTimestamp`.
- If `Modified_Time` is absent or unparseable, it cascades to `Created_Time`, guaranteeing that `modifiedAt` is never null. If both are invalid, defaults to Unix epoch (`1970-01-01T00:00:00.000Z`).

---

## 4. Zoho Enums & Values

### Supported Parent Record Types (`NOTE_PARENT_TYPES`)
The Notes API supports querying across 8 polymorphic parent record types:
- `lead`
- `contact`
- `deal`
- `visa_application`
- `spouse_skill_assessment`
- `task`
- `event`
- `signed_document`

### Picklist Values in Schema
- **`Record_Status__s`:**
  - `'Available'` — Active CRM note
  - `'Draft'` — Draft note
  - `'Trash'` — Soft-deleted note

### Parameter Spelling
- `spouseSkillAssessmentId` maps to MongoDB `_zoho_spouse_skill_assessment_id`.

---

## 5. Fallback Strategy

| Target Field | Condition | Resolution Path | Final Fallback Value |
| :--- | :--- | :--- | :--- |
| `externalId` | Missing or null `zoho_id` | Empty string assignment | `""` |
| `parentType` | Missing or unrecognized `parent_entity_type` | Unresolved entity | `null` |
| `parentZohoId` | Missing ID in matched `_zoho_*_id` | Null fallback | `null` |
| `body` | Missing both `Note_Title` and `Note_Content` | Empty string assignment | `""` |
| `body` | Missing `Note_Content` but title present | Output title only | `title` |
| `body` | Missing `Note_Title` but content present | Output content only | `content` |
| `createdByEmail` | Creator ID missing or not found in `migrated_users` | Lookup miss | `null` |
| `createdByZohoId` | Missing or null `_zoho_created_by_id` | Cleaned nullable string | `null` |
| `createdAt` | Missing or invalid `Created_Time` | Unix Epoch UTC | `"1970-01-01T00:00:00.000Z"` |
| `modifiedByEmail` | Modifier ID missing or not found in `migrated_users` | Lookup miss | `null` |
| `modifiedByZohoId` | Missing or null `_zoho_modified_by_id` | Cleaned nullable string | `null` |
| `modifiedAt` | Missing or invalid `Modified_Time` | Falls back to `Created_Time` &rarr; Epoch | `createdAt` value or Epoch |

---

## 6. Key Edge Cases

1. **Title-Only and Content-Only Notes:** Users in Zoho CRM frequently enter quick comments with no title, or set a title without body text. The `formatBody` helper avoids creating ugly artifacts like `":- Content"` or `"Title:- "` by conditionally omitting the delimiter when either side is empty.
2. **Double Separator Prevention:** If a user already typed a separator in the title (e.g. `"Follow Up -"`) or content, the standard `":- "` separator is still applied cleanly between trimmed parts.
3. **`modifiedAt` Never-Null Guarantee:** Target schemas often enforce non-null modification timestamps. When Zoho notes have not been modified since creation, `Modified_Time` is often null in the database. The transformation engine automatically cascades to `Created_Time`.
4. **Polymorphic Filtering Across Modules:** A single `migrated_notes` collection stores remarks for Leads, Contacts, Deals, and Visa Applications. The API enables selective filtering via `zohoLeadId`, `zohoContactId`, `zohoDealId`, `visaApplicationId`, or `spouseSkillAssessmentId`, as well as broad filtering by `type`.
5. **Staff Deletion Resiliency:** If a staff member who logged a note has been deactivated or was not exported into `migrated_users`, the batch resolver gracefully yields `null` for `createdByEmail` while retaining the raw `createdByZohoId` for audit traceability.

---

## 7. Response Reference

### TypeScript Interfaces

```typescript
export interface NoteItemDto {
  externalId: string;                 // Original Zoho ID (zoho_id)
  parentType: string | null;          // Type of parent record (lead, contact, deal, etc.)
  parentZohoId: string | null;        // Original Zoho ID of parent record
  body: string;                       // Combined "Note_Title:- Note_Content"
  createdByEmail: string | null;      // Creator staff email or null
  createdByZohoId: string | null;     // Creator Zoho user ID or null
  createdAt: string;                  // Zoho Created_Time in UTC ISO 8601
  modifiedByEmail: string | null;     // Modifier staff email or null
  modifiedByZohoId: string | null;    // Modifier Zoho user ID or null
  modifiedAt: string;                 // Zoho Modified_Time in UTC ISO 8601
}

export interface NotesResponseDto {
  data: NoteItemDto[];
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
      "externalId": "164193000020539649",
      "parentType": "lead",
      "parentZohoId": "164193000000811047",
      "body": "Initial Assessment:- Client scored 8 bands in IELTS and has 5 years of experience as a Software Engineer. Eligible for subclass 189 visa.",
      "createdByEmail": "asha.sharma@worldvisa.in",
      "createdByZohoId": "164193000000028001",
      "createdAt": "2024-03-02T10:00:00.000Z",
      "modifiedByEmail": "asha.sharma@worldvisa.in",
      "modifiedByZohoId": "164193000000028001",
      "modifiedAt": "2024-03-05T12:00:00.000Z"
    },
    {
      "externalId": "164193000020539702",
      "parentType": "contact",
      "parentZohoId": "164193000000822091",
      "body": "Client requested call back after 6 PM due to office hours.",
      "createdByEmail": "rahul.patel@worldvisa.in",
      "createdByZohoId": "164193000000028005",
      "createdAt": "2024-03-03T07:15:20.000Z",
      "modifiedByEmail": null,
      "modifiedByZohoId": null,
      "modifiedAt": "2024-03-03T07:15:20.000Z"
    },
    {
      "externalId": "164193000020539810",
      "parentType": "spouse_skill_assessment",
      "parentZohoId": "164193000000933015",
      "body": "Spouse Assessment Review:- Need marriage certificate and spouse degree transcripts before submission.",
      "createdByEmail": "priya.nair@worldvisa.in",
      "createdByZohoId": "164193000000028012",
      "createdAt": "2024-03-04T11:45:00.000Z",
      "modifiedByEmail": "priya.nair@worldvisa.in",
      "modifiedByZohoId": "164193000000028012",
      "modifiedAt": "2024-03-04T14:10:00.000Z"
    }
  ],
  "total": 12840,
  "page": 1,
  "pageSize": 200,
  "hasMore": true
}
```

