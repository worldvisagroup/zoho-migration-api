# Attachments API — Technical Extraction & Field Mapping Specification

- **Endpoint:** `GET /api/v1/attachments`
- **Controller:** [`AttachmentsController`](file:///e:/World%20visa/zoho-api/src/modules/attachments/controllers/attachments.controller.ts)
- **Service:** [`AttachmentsService`](file:///e:/World%20visa/zoho-api/src/modules/attachments/services/attachments.service.ts)
- **Repository:** [`AttachmentsRepository`](file:///e:/World%20visa/zoho-api/src/modules/attachments/repositories/attachments.repository.ts)
- **Authentication:** `x-api-key: <API_KEY>` (Required header, 401 Unauthorized if missing/invalid)
- **Source Collection:** `migrated_attachments` ([`MigratedAttachmentModel`](file:///e:/World%20visa/zoho-api/src/database/schema/migrated-attachment.schema.ts))
- **Related Collections:** `migrated_users` (for staff uploader/modifier email resolution)
- **Status:** Complete & Production Ready

---

## 1. API Overview

### Purpose
The Attachments API extracts client documentation, uploaded case files, passport scans, and activity attachments from `migrated_attachments`. It dynamically generates fresh Cloudflare R2 presigned download URLs for secure file access, derives standard RFC MIME types from file extensions, resolves uploader and modifier email addresses via single-pass batch lookup against `migrated_users`, supports polymorphic parent entity filtering, and returns paginated results ordered chronologically by `Created_Time`.

### Supported Query Parameters

| Parameter | Type | Required | Default | Validation Rules | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `zohoLeadId` | `string` | No | `undefined` | `@IsString()` | Filter attachments linked to a specific Zoho Lead (`_zoho_lead_id`). |
| `zohoContactId` | `string` | No | `undefined` | `@IsString()` | Filter attachments linked to a specific Zoho Contact (`_zoho_contact_id`). |
| `zohoDealId` | `string` | No | `undefined` | `@IsString()` | Filter attachments linked to a specific Zoho Deal (`_zoho_deal_id`). |
| `visaApplicationId` | `string` | No | `undefined` | `@IsString()` | Filter attachments linked to a Visa Application (`_zoho_visa_application_id`). |
| `spouseSkillAssessmentId` | `string` | No | `undefined` | `@IsString()` | Filter attachments linked to a Spouse Skill Assessment (`_zoho_spouse_skill_assessment_id`). |
| `type` | `enum` | No | `undefined` | `@IsIn(ATTACHMENT_PARENT_TYPES)` | Filter by parent type (`lead, contact, deal, visa_application, spouse_skill_assessment, task, event, signed_document`). |
| `page` | `number` | No | `1` | `@IsInt()`, `@Min(1)` | 1-indexed pagination page number. |
| `limit` | `number` | No | `200` | `@IsInt()`, `@Min(1)`, `@Max(1000)` | Records per page (capped at 1,000). |
| `from` | `string` | No | `undefined` | `@IsISO8601()` | Inclusive start filter on Zoho `Created_Time`. |
| `to` | `string` | No | `undefined` | `@IsISO8601()` | Inclusive end filter on Zoho `Created_Time`. |

- **Sorting Guarantee:** Ascending order by creation timestamp: `{ Created_Time: 1, _id: 1 }` (stable chronological order).
- **Pagination Flag:** `hasMore = page * pageSize < total`.
- **Response Wrapper:** Uses `@BypassTransform()` to return the direct migration envelope (`data`, `total`, `page`, `pageSize`, `hasMore`).

---

## 2. Zoho Field Mapping

Direct mapping from MongoDB `migrated_attachments` to [`AttachmentItemDto`](file:///e:/World%20visa/zoho-api/src/modules/attachments/dto/attachment-response.dto.ts):

| Target Field | Target Type | Zoho Source Field | Source Type | Transformation Summary |
| :--- | :--- | :--- | :--- | :--- |
| `externalId` | `string` | `zoho_id` | String | Direct 1:1 copy of Zoho attachment unique identifier. |
| `parentType` | `string \| null` | `parent_entity_type` | String | Standardized parent entity type (`lead`, `contact`, `deal`, `visa_application`, `spouse_skill_assessment`, `task`, `event`, `signed_document`), or `null`. |
| `parentZohoId` | `string \| null` | `_zoho_*_id`, `_zoho_parent_id` | String | Original Zoho ID of the linked parent record (uses `_zoho_parent_id` for task, event, signed_document). |
| `url` | `string` | `r2_key` &rarr; S3 Presign | URL | Fresh presigned Cloudflare R2 download URL, falling back to `r2_download_url` or `r2_preview_url`. |
| `fileName` | `string` | `File_Name` | String | Cleaned file name with extension. Defaults to empty string `""` if missing. |
| `mimeType` | `string` | `File_Name`, `r2_key` | String | RFC MIME type derived from file extension (e.g. `application/pdf`, `image/png`). Fallback: `application/octet-stream`. |
| `sizeBytes` | `number` | `Size` | String / Number | Parsed file size in bytes (`parseInt(Size, 10)` &ge; 0). Defaults to `0` if invalid or missing. |
| `uploadedByEmail` | `string \| null` | `_zoho_created_by_id` &rarr; `migrated_users` | Lookup | Resolved staff email address via batch lookup, or `null`. |
| `uploadedByZohoId` | `string \| null` | `_zoho_created_by_id`, `_zoho_owner_id` | String | Cleaned Zoho user ID of uploader, or `null`. |
| `uploadedAt` | `string` (ISO 8601) | `Created_Time`, `createdAt` | Datetime | Normalized to UTC ISO 8601 upload timestamp. Fallback: `1970-01-01T00:00:00.000Z`. |
| `createdAt` | `string` (ISO 8601) | `Created_Time`, `createdAt` | Datetime | Identical to `uploadedAt`. UTC ISO 8601 timestamp. |
| `modifiedAt` | `string` (ISO 8601) | `Modified_Time`, `Created_Time` | Datetime | Primary `Modified_Time`, falls back to `Created_Time`. Never null. |
| `modifiedByEmail` | `string \| null` | `_zoho_modified_by_id` &rarr; `migrated_users` | Lookup | Resolved modifier email address via batch lookup, or `null`. |
| `modifiedByZohoId` | `string \| null` | `_zoho_modified_by_id` | String | Cleaned Zoho user ID of last modifier, or `null`. |

---

## 3. Field Transformation Logic

### 1. Fresh Presigned Cloudflare R2 URL Generation
- To ensure files are secure and accessible without long-lived public bucket URLs, the service batches requests via `R2StorageService.generateDownloadUrlsBatch()`.
- Generates presigned `GetObject` URLs with configurable expiration.
- If R2 credentials are not configured or signing fails, gracefully falls back to `r2_download_url` or `r2_preview_url`.

### 2. Polymorphic Parent Entity Resolution (`resolveParentEntity`)
- For core entities (`lead`, `contact`, `deal`, `visa_application`, `spouse_skill_assessment`), matches corresponding `_zoho_*_id`.
- For sub-activity entities (`task`, `event`, `signed_document`), retrieves the parent ID directly from `_zoho_parent_id`.

### 3. File Size Parsing
- Handles `Size` stored as either raw numbers or strings.
- Safely runs `parseInt(String(Size), 10)`. If negative, NaN, or null &rarr; defaults to `0`.

### 4. Single-Pass Staff Email Batching
- Gathers all unique user IDs across `_zoho_created_by_id`, `_zoho_owner_id`, and `_zoho_modified_by_id`.
- Executes a single batch lookup against `migrated_users`.

---

## 4. Zoho Enums & Values

### Supported Parent Record Types (`ATTACHMENT_PARENT_TYPES`)
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

| Field | Condition | Resolution Path | Final Value |
| :--- | :--- | :--- | :--- |
| `externalId` | Missing or null `zoho_id` | Empty string assignment | `""` |
| `parentType` | Missing or unrecognized `parent_entity_type` | Unresolved entity | `null` |
| `parentZohoId` | Missing ID in matched `_zoho_*_id` or `_zoho_parent_id` | Null fallback | `null` |
| `url` | Missing R2 key and fallback URLs | Empty string assignment | `""` |
| `fileName` | Missing `File_Name` | Empty string assignment | `""` |
| `mimeType` | Missing or unrecognized file extension | Generic binary stream | `"application/octet-stream"` |
| `sizeBytes` | Missing, negative, or invalid `Size` | Zero bytes | `0` |
| `uploadedByEmail` | Creator ID not found in `migrated_users` | Lookup miss | `null` |
| `modifiedByEmail` | Modifier ID not found in `migrated_users` | Lookup miss | `null` |
| `uploadedAt` | Missing or invalid `Created_Time` | Unix Epoch UTC | `"1970-01-01T00:00:00.000Z"` |
| `modifiedAt` | Missing or invalid `Modified_Time` | Falls back to `Created_Time` | `uploadedAt` value or Epoch |

---

## 6. Key Edge Cases

1. **Sub-Activity Parent ID Retrieval:** Attachments belonging to `task`, `event`, or `signed_document` store their parent reference in `_zoho_parent_id` instead of entity-specific fields. The resolver automatically detects these parent types and maps `_zoho_parent_id`.
2. **Missing Extension MIME Type Resolution:** Legacy Zoho CRM uploads occasionally lack an extension in `File_Name` (e.g. `photo_scan`). The system checks `r2_key` for extensions before safely falling back to `application/octet-stream`.
3. **`modifiedAt` Never-Null Guarantee:** Even if Zoho records omit `Modified_Time`, `modifiedAt` cascades to `Created_Time`.

---

## 7. Response Reference

### TypeScript Interfaces

```typescript
export interface AttachmentItemDto {
  externalId: string;                 // Original Zoho ID (zoho_id)
  parentType: string | null;          // Type of parent record (lead, contact, deal, etc.)
  parentZohoId: string | null;        // Original Zoho ID of parent record
  url: string;                        // Direct or presigned download URL
  fileName: string;                   // Original file name
  mimeType: string;                   // Derived MIME type
  sizeBytes: number;                  // File size in bytes
  uploadedByEmail: string | null;     // Staff uploader email or null
  uploadedByZohoId: string | null;    // Zoho user ID of uploader or null
  uploadedAt: string;                 // UTC ISO 8601 upload timestamp
  createdAt: string;                  // UTC ISO 8601 creation timestamp
  modifiedAt: string;                 // UTC ISO 8601 last modified timestamp
  modifiedByEmail: string | null;     // Staff modifier email or null
  modifiedByZohoId: string | null;    // Zoho user ID of modifier or null
}

export interface AttachmentsResponseDto {
  data: AttachmentItemDto[];
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
      "externalId": "164193000000578074",
      "parentType": "lead",
      "parentZohoId": "164193000000811047",
      "url": "https://pub-r2.worldvisa.in/attachments/leads/lead_001/passport.pdf?X-Amz-Signature=abc123",
      "fileName": "passport.pdf",
      "mimeType": "application/pdf",
      "sizeBytes": 245760,
      "uploadedByEmail": "asha.sharma@worldvisa.in",
      "uploadedByZohoId": "164193000000028001",
      "uploadedAt": "2024-03-03T10:00:00.000Z",
      "createdAt": "2024-03-03T10:00:00.000Z",
      "modifiedAt": "2024-03-05T10:00:00.000Z",
      "modifiedByEmail": "asha.sharma@worldvisa.in",
      "modifiedByZohoId": "164193000000028001"
    },
    {
      "externalId": "164193000000578112",
      "parentType": "signed_document",
      "parentZohoId": "164193000000955001",
      "url": "https://pub-r2.worldvisa.in/attachments/signed_docs/doc_001/signed_agreement.pdf?X-Amz-Signature=def456",
      "fileName": "signed_agreement.pdf",
      "mimeType": "application/pdf",
      "sizeBytes": 512000,
      "uploadedByEmail": "rahul.patel@worldvisa.in",
      "uploadedByZohoId": "164193000000028005",
      "uploadedAt": "2024-03-04T12:00:00.000Z",
      "createdAt": "2024-03-04T12:00:00.000Z",
      "modifiedAt": "2024-03-04T12:00:00.000Z",
      "modifiedByEmail": null,
      "modifiedByZohoId": null
    }
  ],
  "total": 33077,
  "page": 1,
  "pageSize": 200,
  "hasMore": true
}
```
