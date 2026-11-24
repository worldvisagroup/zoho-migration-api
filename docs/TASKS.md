# Tasks API — Technical Extraction & Field Mapping Specification

- **Endpoint:** `GET /api/v1/tasks`
- **Controller:** [`TasksController`](file:///e:/World%20visa/zoho-api/src/modules/tasks/controllers/tasks.controller.ts)
- **Service:** [`TasksService`](file:///e:/World%20visa/zoho-api/src/modules/tasks/services/tasks.service.ts)
- **Repository:** [`TasksRepository`](file:///e:/World%20visa/zoho-api/src/modules/tasks/repositories/tasks.repository.ts)
- **Authentication:** `x-api-key: <API_KEY>` (Required header, 401 Unauthorized if missing/invalid)
- **Source Collection:** `migrated_tasks` ([`MigratedTaskModel`](file:///e:/World%20visa/zoho-api/src/database/schema/migrated-task.schema.ts))
- **Related Collections:** `migrated_users` (for staff email resolution)
- **Status:** Complete & Production Ready

---

## 1. API Overview

### Purpose
The Tasks API extracts all CRM action items, follow-ups, and operational tasks from `migrated_tasks`. It normalizes irregular Zoho statuses into standard states (`todo`, `in_progress`, `done`) with a strict `is_closed` override, maps priority levels, batch resolves assignee/creator/modifier email addresses from `migrated_users`, computes completion timestamps, and supports polymorphic parent entity filtering.

### Supported Query Parameters

| Parameter | Type | Required | Default | Validation Rules | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `zohoLeadId` | `string` | No | `undefined` | `@IsString()` | Filter tasks linked to a specific Zoho Lead (`_zoho_lead_id`). |
| `zohoContactId` | `string` | No | `undefined` | `@IsString()` | Filter tasks linked to a specific Zoho Contact (`_zoho_contact_id`). |
| `zohoDealId` | `string` | No | `undefined` | `@IsString()` | Filter tasks linked to a specific Zoho Deal (`_zoho_deal_id`). |
| `visaApplicationId` | `string` | No | `undefined` | `@IsString()` | Filter tasks linked to a Visa Application (`_zoho_visa_application_id`). |
| `spouseSkillAssessmentId` | `string` | No | `undefined` | `@IsString()` | Filter tasks linked to a Spouse Skill Assessment. |
| `type` | `enum` | No | `undefined` | `@IsIn(TASK_PARENT_TYPES)` | Filter by parent type (`lead, contact, deal, visa_application, spouse_skill_assessment, task, event, signed_document`). |
| `page` | `number` | No | `1` | `@IsInt()`, `@Min(1)` | 1-indexed pagination page number. |
| `limit` | `number` | No | `200` | `@IsInt()`, `@Min(1)`, `@Max(1000)` | Records per page (capped at 1,000). |
| `from` | `string` | No | `undefined` | `@IsISO8601({ strict: true })` | Inclusive start filter on Zoho `Created_Time`. |
| `to` | `string` | No | `undefined` | `@IsISO8601({ strict: true })` | Inclusive end filter on Zoho `Created_Time`. |
| `updatedSince` | `string` | No | `undefined` | `@IsISO8601({ strict: true })` | Incremental sync filter on Zoho task activity (`>=`). Checks `Modified_Time`, `Last_Activity_Time`, and `Closed_Time`. Mutually exclusive with `from`/`to`. |

- **Collision Prevention Strategy:** `updatedSince` is strictly mutually exclusive with `from` and `to`. Specifying both returns `400 Bad Request`.
- **Sorting Guarantee:** Ascending order: `{ Created_Time: 1, _id: 1 }` (oldest to newest) by default, or `{ Last_Activity_Time: 1, Created_Time: 1, _id: 1 }` when `updatedSince` is supplied.
- **Pagination Flag:** `hasMore = page * pageSize < total`.
- **Response Wrapper:** Uses `@BypassTransform()` to return the direct migration envelope (`data`, `total`, `page`, `pageSize`, `hasMore`).

---

## 2. Zoho Field Mapping

Direct mapping from MongoDB `migrated_tasks` to [`TaskItemDto`](file:///e:/World%20visa/zoho-api/src/modules/tasks/dto/task-response.dto.ts):

| Target Field | Target Type | Zoho Source Field | Source Type | Transformation Summary |
| :--- | :--- | :--- | :--- | :--- |
| `externalId` | `string` | `zoho_id` | String | Direct 1:1 copy of Zoho task unique ID. |
| `parentType` | `string \| null` | `parent_entity_type` | String | Standardized parent entity type (`lead`, `contact`, `deal`, `visa_application`, `spouse_skill_assessment`, `task`, `event`, `signed_document`), or `null`. |
| `parentZohoId` | `string \| null` | `_zoho_*_id` | String | Original Zoho ID of the linked parent record (`_zoho_lead_id`, `_zoho_contact_id`, etc.), or `null`. |
| `title` | `string` | `Subject` | String | Trimmed string. Defaults to empty string `""` if missing. |
| `description` | `string \| null` | `Description` | String | Trimmed plain text. Returns `null` if empty or missing. |
| `status` | `TargetTaskStatus` | `Status`, `is_closed` | String, Boolean | Normalized to `todo`, `in_progress`, or `done`. `is_closed === true` forces `done`. |
| `priority` | `TargetTaskPriority` | `Priority` | String | Mapped to `urgent` (Highest), `high`, `medium` (Normal/Default), `low`. |
| `dueDate` | `string \| null` | `Due_Date` | Date / String | Normalized to UTC ISO 8601 string or `null` if missing. |
| `assigneeId` | `string \| null` | `_zoho_owner_id` | String | Cleaned Zoho user ID of task owner, or `null`. |
| `assigneeEmail` | `string \| null` | `_zoho_owner_id` &rarr; `migrated_users` | Lookup | Resolved staff email address via single-pass batch lookup, or `null`. |
| `createdByZohoId` | `string \| null` | `_zoho_created_by_id` | String | Cleaned Zoho user ID of task creator, or `null`. |
| `createdByEmail` | `string \| null` | `_zoho_created_by_id` &rarr; `migrated_users` | Lookup | Resolved creator email address via batch lookup, or `null`. |
| `modifiedByZohoId` | `string \| null` | `_zoho_modified_by_id` | String | Cleaned Zoho user ID of last modifier, or `null`. |
| `modifiedByEmail` | `string \| null` | `_zoho_modified_by_id` &rarr; `migrated_users` | Lookup | Resolved modifier email address via batch lookup, or `null`. |
| `createdAt` | `string` (ISO 8601) | `Created_Time` | Date / String | Normalized to UTC ISO 8601. Fallback: `1970-01-01T00:00:00.000Z`. |
| `modifiedAt` | `string` (ISO 8601) | `Modified_Time`, `Last_Activity_Time`, `Closed_Time`, `Created_Time` | Date / String | Activity cascade: `Modified_Time ?? Last_Activity_Time ?? (is_closed ? Closed_Time : null) ?? Created_Time`. Never null. |
| `completedAt` | `string \| null` | `Closed_Time`, `Modified_Time`, `Created_Time` | Date / String | **If status === 'done':** `Closed_Time` if present and &ge; `Created_Time`. If `Closed_Time < Created_Time` (Zoho anomaly), falls back to `Modified_Time ?? Created_Time`. If `Closed_Time` missing: `null`.<br>**If status !== 'done':** strictly `null`. |

---

## 3. Field Transformation Logic

### 1. Status Normalization & Closed Override (`normalizeTaskStatus`)
- **Rule 1 (Boolean Override):** If `is_closed === true`, the task is always normalized to `done`, even if the textual Status is contradictory (*"In Progress"*, *"Deferred"*, etc.).
- **Rule 2 (Completed Keywords):** Case-insensitive check for `"completed"`, `"closed"`, or `"done"` &rarr; `done`.
- **Rule 3 (In Progress):** `"in progress"`, `"in_progress"`, `"in-progress"` &rarr; `in_progress`.
- **Rule 4 (Open Fallbacks):** All other statuses (*"Not Started"*, *"Deferred"*, *"Waiting on someone else"*, empty, null) default to `todo`.

### 2. Priority Mapping (`normalizeTaskPriority`)
- `"highest"` &rarr; `urgent`
- `"high"` &rarr; `high`
- `"normal"` &rarr; `medium` (default fallback)
- `"low"`, `"lowest"` &rarr; `low`

### 3. Completion Timestamp Resolution (`resolveCompletedAt`)
- **Active Tasks:** If status is not `done`, `completedAt` is strictly `null`.
- **Done Tasks:**
  1. If `Closed_Time` is missing, null, or invalid &rarr; returns `null`.
  2. If `Closed_Time < Created_Time` (Zoho CRM anomaly where task closed timestamp predates creation), falls back to `Modified_Time` if valid; otherwise `Created_Time`.
  3. Otherwise (`Closed_Time >= Created_Time`), returns normalized `Closed_Time`.

### 4. Single-Pass Staff Email Batching
To prevent N+1 database queries during pagination:
- The service extracts unique user IDs from `_zoho_owner_id`, `_zoho_created_by_id`, and `_zoho_modified_by_id` across the batch.
- Executes a single indexed query: `userModel.find({ zoho_id: { $in: uniqueIds } })`.
- Maps each ID to its sanitized email address in memory for instant DTO projection.

### 5. Modification Timestamp Activity Cascade
Because `migrated_tasks` in Zoho CRM tracks activity through multiple fields rather than solely `Modified_Time`, `modifiedAt` resolves through an authentic 4-tier activity cascade:
1. `Modified_Time` if present and valid.
2. `Last_Activity_Time` (captures agent interactions, edits, and status changes).
3. `Closed_Time` if the task is closed (`is_closed === true`).
4. `Created_Time` fallback (ensures `modifiedAt` is never null).

---

## 4. Zoho Enums & Values

### Task Status Mapping Matrix

| Source Status | `is_closed` | Mapped Target Status |
| :--- | :--- | :--- |
| Any status | `true` | `'done'` |
| `'Completed'` / `'Closed'` / `'Done'` | `false` / `null` | `'done'` |
| `'In Progress'` / `'In_Progress'` | `false` / `null` | `'in_progress'` |
| `'Not Started'` | `false` / `null` | `'todo'` |
| `'Deferred'` | `false` / `null` | `'todo'` |
| `'Waiting on someone else'` | `false` / `null` | `'todo'` |
| Unrecognized / `null` | `false` / `null` | `'todo'` |

### Task Priority Mapping Matrix

| Zoho Source Priority | Mapped Priority |
| :--- | :--- |
| `'Highest'` | `'urgent'` |
| `'High'` | `'high'` |
| `'Normal'` | `'medium'` |
| `'Low'` / `'Lowest'` | `'low'` |
| Missing / Unrecognized / `null` | `'medium'` (default) |

### Supported Parent Types (`TASK_PARENT_TYPES`)
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
| `parentZohoId` | Missing ID in matched `_zoho_*_id` | Null fallback | `null` |
| `title` | Missing or null `Subject` | Empty string assignment | `""` |
| `description` | Missing or whitespace-only `Description` | Nullable string assignment | `null` |
| `status` | Missing or unrecognized `Status` without closed flag | Open default assignment | `"todo"` |
| `priority` | Missing or unrecognized `Priority` | Baseline default assignment | `"medium"` |
| `dueDate` | Missing or invalid `Due_Date` | Nullable ISO assignment | `null` |
| `assigneeEmail` | User not found in `migrated_users` or missing owner | Lookup miss | `null` |
| `createdByEmail` | Creator not found in `migrated_users` | Lookup miss | `null` |
| `modifiedByEmail` | Modifier not found in `migrated_users` | Lookup miss | `null` |
| `createdAt` | Missing/invalid `Created_Time` | Unix Epoch UTC | `"1970-01-01T00:00:00.000Z"` |
| `modifiedAt` | Missing `Modified_Time` | Falls back to `Last_Activity_Time`, `Closed_Time` (if closed), then `Created_Time` | Most recent activity or `createdAt` value |
| `completedAt` | Task is done but missing `Closed_Time` | Non-completion timestamp | `null` |
| `completedAt` | Task is done with `Closed_Time < Created_Time` (anomaly) | Falls back to `Modified_Time`, then `Created_Time` | `modifiedAt` / `createdAt` |
| `completedAt` | Task status is not `'done'` | Non-completion rule | `null` |

---

## 6. Key Edge Cases

1. **`is_closed` Override Overrules Status Text:** In Zoho CRM, workflow rules often toggle the boolean `is_closed: true` while leaving legacy status picklist values as *"In Progress"* or *"Deferred"*. The normalization engine treats `is_closed: true` as the authoritative signal, forcing the task to `done`.
2. **`Closed_Time` Anomaly & Nullability Resolution:** In legacy Zoho CRM data, some completed tasks have `Closed_Time` timestamps that predate `Created_Time`. When `Closed_Time < Created_Time`, the resolver falls back to `Modified_Time` (or `Created_Time`) to guarantee chronological consistency (`completedAt >= createdAt`). If a completed task has no `Closed_Time` recorded at all, `completedAt` returns `null` rather than synthesizing an artificial completion date. Active tasks (`todo`, `in_progress`) are strictly `null`.
3. **Polymorphic Parent Entity Relationships:** Zoho CRM links tasks across multiple modules using polymorphic lookups. The API enables targeted parent filtering across `zohoLeadId`, `zohoContactId`, `zohoDealId`, `visaApplicationId`, and `spouseSkillAssessmentId`.
4. **`modifiedAt` Activity Cascade & Never-Null Guarantee:** In Zoho CRM, tasks track edits through `Last_Activity_Time` and `Closed_Time` rather than just `Modified_Time`. The normalization engine resolves `modifiedAt` using this authentic cascade, preventing delta updates from stalling while guaranteeing a non-null timestamp for downstream replication.

---

## 7. Response Reference

### TypeScript Schema
```typescript
export type TargetTaskStatus = 'todo' | 'in_progress' | 'done';
export type TargetTaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskItemDto {
  externalId: string;                 // Original Zoho ID (zoho_id)
  parentType: string | null;          // Type of parent record (lead, contact, deal, etc.)
  parentZohoId: string | null;        // Original Zoho ID of parent record
  title: string;                      // Task Subject
  description: string | null;         // Plain text description or null
  status: TargetTaskStatus;           // 'todo' | 'in_progress' | 'done'
  priority: TargetTaskPriority;       // 'low' | 'medium' | 'high' | 'urgent'
  dueDate: string | null;             // UTC ISO 8601 due date or null
  assigneeEmail: string | null;       // Resolved staff email from migrated_users
  assigneeId: string | null;          // Zoho owner ID (_zoho_owner_id)
  createdByEmail: string | null;      // Resolved creator email
  createdByZohoId: string | null;     // Zoho creator ID (_zoho_created_by_id)
  createdAt: string;                  // Zoho Created_Time in UTC ISO 8601
  modifiedAt: string;                 // Zoho Modified_Time in UTC ISO 8601
  modifiedByEmail: string | null;     // Resolved modifier email or null
  modifiedByZohoId: string | null;    // Zoho modifier ID or null
  completedAt: string | null;         // Completion timestamp (only if status === 'done' and Closed_Time exists; resolves anomaly if Closed_Time < Created_Time)
}

export interface TasksResponseDto {
  data: TaskItemDto[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
```

### Example Response (HTTP 200 OK)
```json
{
  "data": [
    {
      "externalId": "164193000053851467",
      "parentType": "lead",
      "parentZohoId": "164193000000811047",
      "title": "Call client regarding skill assessment document verification",
      "description": "Client requested guidance on ACS Australia employment reference letters.",
      "status": "done",
      "priority": "urgent",
      "dueDate": "2024-09-28T00:00:00.000Z",
      "assigneeEmail": "asha.k@worldvisa.in",
      "assigneeId": "164193000020539649",
      "createdByEmail": "asha.k@worldvisa.in",
      "createdByZohoId": "164193000020539649",
      "createdAt": "2024-09-28T05:08:17.000Z",
      "modifiedAt": "2024-09-29T10:14:00.000Z",
      "modifiedByEmail": "asha.k@worldvisa.in",
      "modifiedByZohoId": "164193000020539649",
      "completedAt": "2024-09-29T10:14:00.000Z"
    },
    {
      "externalId": "164193000053851999",
      "parentType": "contact",
      "parentZohoId": "164193000000822091",
      "title": "Follow up on visa fee payment confirmation",
      "description": null,
      "status": "todo",
      "priority": "medium",
      "dueDate": "2024-10-05T00:00:00.000Z",
      "assigneeEmail": "vikram.seth@worldvisa.in",
      "assigneeId": "164193000000213001",
      "createdByEmail": "asha.k@worldvisa.in",
      "createdByZohoId": "164193000020539649",
      "createdAt": "2024-10-01T08:30:00.000Z",
      "modifiedAt": "2024-10-01T08:30:00.000Z",
      "modifiedByEmail": null,
      "modifiedByZohoId": null,
      "completedAt": null
    }
  ],
  "total": 5420,
  "page": 1,
  "pageSize": 2,
  "hasMore": true
}
```

