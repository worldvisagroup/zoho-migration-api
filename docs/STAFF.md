# Staff API — Technical Extraction & Field Mapping Specification

- **Endpoint:** `GET /api/v1/staff`
- **Controller:** [`StaffController`](file:///e:/World%20visa/zoho-api/src/modules/staff/controllers/staff.controller.ts)
- **Service:** [`StaffService`](file:///e:/World%20visa/zoho-api/src/modules/staff/services/staff.service.ts)
- **Authentication:** `x-api-key: <API_KEY>` (Required header, 401 Unauthorized if missing/invalid)
- **Source Collection:** `migrated_users` ([`MigratedUserModel`](file:///e:/World%20visa/zoho-api/src/database/schema/migrated-user.schema.ts))
- **Status:** Complete & Production Ready

---

## 1. API Overview

### Purpose
The Staff API extracts internal employees, counselors, and operational managers from the migrated Zoho CRM database (`migrated_users`). It normalizes names to Title Case, standardizes phone numbers into Indian format (`+91`), derives rigid role and department enums from free-text role titles, determines active operational status, and delivers chronologically ordered results sorted by `created_time: 1` (oldest first).

### Supported Query Parameters

| Parameter | Type | Required | Default | Validation Rules | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `page` | `number` | No | `1` | `@IsInt()`, `@Min(1)` | 1-indexed pagination page number. |
| `limit` | `number` | No | `200` | `@IsInt()`, `@Min(1)`, `@Max(1000)` | Number of records per page (max 1,000). |
| `from` | `string` | No | `undefined` | `@IsISO8601({ strict: true })` | Inclusive start filter on Zoho `created_time`. |
| `to` | `string` | No | `undefined` | `@IsISO8601({ strict: true })` | Inclusive end filter on Zoho `created_time`. |
| `updatedSince` | `string` | No | `undefined` | `@IsISO8601({ strict: true })` | Incremental sync filter on Zoho `modified_time` (`>=`). Mutually exclusive with `from`/`to`. |

- **Collision Prevention Strategy:** `updatedSince` is strictly mutually exclusive with `from` and `to`. Specifying both returns `400 Bad Request`.
- **Sorting Guarantee:** Ascending order: `{ created_time: 1, _id: 1 }` (oldest to newest) by default, or `{ modified_time: 1, _id: 1 }` when `updatedSince` is supplied.
- **Pagination Flag:** `hasMore` is computed as `page * pageSize < total`.
- **Response Wrapper:** Uses `@BypassTransform()` to return the direct migration envelope (`data`, `total`, `page`, `pageSize`, `hasMore`).

---

## 2. Zoho Field Mapping

Direct mapping between MongoDB `migrated_users` and target `StaffItemDto`:

| Target Field | Target Type | Zoho Source Field | Source Type | Transformation Summary |
| :--- | :--- | :--- | :--- | :--- |
| `externalId` | `string` | `zoho_id` | String | Direct 1:1 copy of Zoho unique ID. |
| `email` | `string \| null` | `email` | String | Trimmed, lowercased, whitespace stripped. Null if missing or invalid. |
| `firstName` | `string` | `first_name`, `full_name`, `name` | String | Extracted, capitalized to Title Case. Falls back to tokenizing `full_name` or `name`. |
| `lastName` | `string` | `last_name`, `full_name`, `name` | String | Extracted, capitalized to Title Case. Captures last token of full name. Mononyms map here. |
| `phone` | `string \| null` | `phone`, `mobile` | String | Checks phone, falls back to mobile. Formatted to `+91XXXXXXXXXX`. Null if missing or invalid. |
| `department` | `StaffDepartment` | `role_name` | String | Classified into `sales`, `processing`, `finance`, or `marketing`. Default: `sales`. |
| `role` | `StaffRole` | `role_name` | String | Mapped into 13 hierarchical roles. Default: `sales_executive`. |
| `isActive` | `boolean` | `status` | String | True only if `status === 'active'`. Other statuses (`deleted`, `inactive`, `disabled`, `pending`) map to `false`. |
| `createdAt` | `string` (ISO 8601) | `created_time` | Date / String | Normalized to UTC ISO 8601. Fallback: `1970-01-01T00:00:00.000Z`. |
| `updatedAt` | `string` (ISO 8601) | `modified_time`, `created_time` | Date / String | Normalized to UTC ISO 8601. Falls back to `created_time`, then Unix Epoch if missing. |

---

## 3. Field Transformation Logic

### 1. Name Normalization (`extractNames`)
- Reads `first_name` and `last_name`.
- If either is missing, splits `full_name || name` by whitespace. The last token becomes `lastName`; earlier tokens form `firstName`.
- **Mononyms:** Single words (e.g. *"Sumanth"*) map to `lastName`, with `firstName = ""`.
- Converts names to Title Case, properly preserving hyphens (*Mary-Jane*) and apostrophes (*O'Connor*).

### 2. Email Sanitization (`sanitizeEmail`)
- Lowercases and strips all internal and trailing whitespace.
- Rejects invalid formats, strings without `@`, or literals like `"null"`.
- **Fallback:** If missing or invalid, returns `null`.

### 3. Indian Phone Formatting (+91) (`normalizeIndianPhone`)
- Checks primary `phone`, falls back to `mobile`.
- Strips all non-digit characters.
- **10 digits:** Prepends `+91` (e.g. `9800000000` &rarr; `+919800000000`).
- **12 digits (starts with 91):** Prepends `+` (e.g. `919800000000` &rarr; `+919800000000`).
- **11 digits (starts with 0):** Removes leading 0 and prepends `+91` (e.g. `09800000000` &rarr; `+919800000000`).
- **Fallback:** Irregular/missing numbers return `null`.

### 4. Role & Department Resolution (`resolveStaffRoleAndDepartment`)
- **Tier 1:** Exact match on titles (e.g. *CEO* &rarr; `director`, *Sales Executive* &rarr; `sales_executive`, *Operation Manager* &rarr; `processing_manager`).
- **Tier 2:** Substring hierarchy (Finance &rarr; Marketing &rarr; Processing &rarr; Sales).
- Matches leadership levels: *Manager*, *Team Leader*, *Supervisor*, *Executive*.
- **Fallback:** Unmapped roles default to `role: "sales_executive"`, `department: "sales"`.

---

## 4. Zoho Enums & Values

### User Status &rarr; `isActive` Boolean

| Zoho Source Status | `isActive` | Context |
| :--- | :--- | :--- |
| `'active'` | `true` | Authorized user. |
| `'deleted'` / `'disabled'` | `false` | Soft-deleted or blocked. |
| `'inactive'` | `false` | Inactive employee. |
| `'pending'` / `'confirmed'` | `false` | Unaccepted invite. |
| `null` / empty | `false` | Secure default. |

### Target Enums
- **Departments (`StaffDepartment`):** `sales`, `processing`, `finance`, `marketing`
- **Roles (`StaffRole`):** `director`, `branch_manager`, `sales_manager`, `sales_executive`, `sales_team_leader`, `processing_manager`, `processing_executive`, `processing_team_leader`, `processing_supervisor`, `finance_manager`, `finance_executive`, `marketing_manager`, `marketing_executive`

### Role Mapping Summary

| Source Zoho Role Title | Mapped Target Role | Mapped Target Department |
| :--- | :--- | :--- |
| `"CEO"` / `"Managing Director"` | `director` | `sales` |
| `"General Manager"` / `"Branch Manager"` | `branch_manager` | `sales` |
| `"Sales Manager"` | `sales_manager` | `sales` |
| `"Sales Executive"` | `sales_executive` | `sales` |
| `"Operation Manager"` / `"Operations Manager"` | `processing_manager` | `processing` |
| `"Canada Operations"` / `"Australia Operations"` | `processing_executive` | `processing` |
| Finance roles (e.g. *Finance Head*, *Accountant*) | `finance_manager` / `finance_executive` | `finance` |
| Marketing roles (e.g. *Digital Marketing Lead*) | `marketing_manager` / `marketing_executive` | `marketing` |
| Unrecognized custom role or null | `sales_executive` | `sales` |

---

## 5. Fallback Strategy

| Field | Condition | Resolution Path | Final Value |
| :--- | :--- | :--- | :--- |
| `firstName` | Missing `first_name` | Extracts earlier tokens from `full_name` / `name` | Parsed token or `""` |
| `lastName` | Missing `last_name` | Extracts final token from `full_name` / `name` | Parsed token or `""` |
| `email` | Missing or invalid email | Null assignment | `null` |
| `phone` | Missing `phone` | Falls back to `mobile` | Normalized `mobile` |
| `phone` | Missing/invalid `phone` & `mobile` | Null assignment | `null` |
| `role` & `department` | Missing or unknown `role_name` | Organizational baseline default | `role: "sales_executive", dept: "sales"` |
| `isActive` | Status not explicitly `'active'` | Strict boolean evaluation | `false` |
| `createdAt` | Missing/invalid `created_time` | Unix Epoch UTC | `"1970-01-01T00:00:00.000Z"` |
| `updatedAt` | Missing/invalid `modified_time` | Falls back to `created_time` | `createdAt` value or Epoch |

---

## 6. Key Edge Cases

1. **Mononyms & Single Names:** When a user has only a single name in Zoho (e.g. *"Asha"*), it is mapped to `lastName` with `firstName = ""`, ensuring compliance with destination databases where `lastName` is required.
2. **Nullable Email & Phone:** When email or phone number is missing or invalid in Zoho, the API explicitly returns `null` rather than dummy placeholder values.
3. **All-Caps / Inconsistent Casing:** Names entered in ALL CAPS (e.g. *"MOHAMMED IRFAN"*) or lowercase are cleanly formatted to Title Case (*"Mohammed Irfan"*).
4. **Flat Migration Envelope:** Uses `@BypassTransform()` to emit the direct migration payload (`data, total, page, pageSize, hasMore`) rather than standard API status envelopes.

---

## 7. Response Reference

### TypeScript Schema
```typescript
export interface StaffItemDto {
  externalId: string;        // Original Zoho ID (zoho_id)
  email: string | null;      // Lowercased email or null
  firstName: string;         // Title-Cased first name
  lastName: string;          // Title-Cased last name
  phone: string | null;      // +91XXXXXXXXXX or null
  department: 'sales' | 'processing' | 'finance' | 'marketing';
  role:
    | 'director' | 'branch_manager' | 'sales_manager' | 'sales_executive'
    | 'sales_team_leader' | 'processing_manager' | 'processing_executive'
    | 'processing_team_leader' | 'processing_supervisor' | 'finance_manager'
    | 'finance_executive' | 'marketing_manager' | 'marketing_executive';
  isActive: boolean;         // true if Zoho status === 'active'
  createdAt: string;         // Zoho created_time in UTC ISO 8601
  updatedAt: string;         // Zoho modified_time / created_time in UTC ISO 8601
}

export interface StaffResponseDto {
  data: StaffItemDto[];
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
      "externalId": "164193000020539649",
      "email": "asha.k@worldvisa.in",
      "firstName": "Asha",
      "lastName": "Kumar",
      "phone": "+919800000000",
      "department": "sales",
      "role": "sales_executive",
      "isActive": true,
      "createdAt": "2023-07-31T12:08:51.000Z",
      "updatedAt": "2026-10-24T06:00:35.000Z"
    },
    {
      "externalId": "164193000099887766",
      "email": null,
      "firstName": "",
      "lastName": "Sumanth",
      "phone": null,
      "department": "sales",
      "role": "sales_executive",
      "isActive": false,
      "createdAt": "2023-09-12T08:15:30.000Z",
      "updatedAt": "2023-09-12T08:15:30.000Z"
    }
  ],
  "total": 38,
  "page": 1,
  "pageSize": 2,
  "hasMore": true
}
```
