# Clients API — Technical Extraction & Field Mapping Specification

- **Endpoint:** `GET /api/v1/clients`
- **Controller:** [`ClientsController`](file:///e:/World%20visa/zoho-api/src/modules/clients/controllers/clients.controller.ts)
- **Service:** [`ClientsService`](file:///e:/World%20visa/zoho-api/src/modules/clients/services/clients.service.ts)
- **Repositories:** [`ClientsRepository`](file:///e:/World%20visa/zoho-api/src/modules/clients/repositories/clients.repository.ts)
- **Source Collections:** `migrated_leads` ([`MigratedLeadModel`](file:///e:/World%20visa/zoho-api/src/database/schema/migrated-lead.schema.ts)) and `migrated_contacts` ([`MigratedContactModel`](file:///e:/World%20visa/zoho-api/src/database/schema/migrated-contact.schema.ts))
- **Related Collections:** `migrated_books_invoices`, `migrated_books_contacts`
- **Status:** Complete & Production Ready

---

## 1. API Overview

### Purpose
The Clients API extracts customer records from either Zoho Leads (`type=leads`, `migrated_leads`) or Zoho Contacts (`type=contacts`, `migrated_contacts`). It standardizes personal names into Title Case, normalizes international phone numbers into E.164 standard with country code parsing, formats date of birth and marital status, and resolves customer addresses using a 2-tier pipeline that prioritizes verified Zoho Books invoice billing addresses over legacy CRM contact addresses.

### Supported Query Parameters

| Parameter | Type | Required | Default | Validation Rules | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `type` | `string` | **Yes** | — | `@IsIn(['leads', 'contacts'])` | Source collection: `leads` or `contacts`. |
| `page` | `number` | No | `1` | `@IsInt()`, `@Min(1)` | 1-indexed pagination page number. |
| `limit` | `number` | No | `200` | `@IsInt()`, `@Min(1)`, `@Max(1000)` | Number of records per page (capped at 1,000). |
| `from` | `string` | No | `undefined` | `@IsISO8601({ strict: true })` | Inclusive start filter on Zoho `Created_Time`. |
| `to` | `string` | No | `undefined` | `@IsISO8601({ strict: true })` | Inclusive end filter on Zoho `Created_Time`. |

- **Sorting Guarantee:** Ascending order by creation timestamp: `{ Created_Time: 1 }` (oldest to newest).
- **Pagination Flag:** `hasMore` is computed as `page * pageSize < total`.
- **Response Wrapper:** Uses `@BypassTransform()` to return the direct migration envelope (`data`, `total`, `page`, `pageSize`, `hasMore`).

---

## 2. Zoho Field Mapping

Direct mapping from MongoDB `migrated_leads` and `migrated_contacts` to `ClientItemDto`:

| Target Field | Target Type | Leads Source Field | Contacts Source Field | Transformation & Resolution Summary |
| :--- | :--- | :--- | :--- | :--- |
| `externalId` | `string` | `zoho_id` | `zoho_id` | Direct 1:1 copy of Zoho unique string ID. |
| `firstName` | `string` | `First_Name`, `Full_Name` | `First_Name`, `Full_Name` | Title-Cased via `extractNames()`. Falls back to tokenizing `Full_Name`. |
| `lastName` | `string` | `Last_Name`, `Full_Name` | `Last_Name`, `Full_Name` | Title-Cased via `extractNames()`. Captures final token. Mononyms map to `lastName`. |
| `email` | `string` | `Email`, `Secondary_Email` | `Email`, `Secondary_Email` | Lowercased, whitespace stripped. Defaults to `notprovided@gmail.com`. |
| `phone` | `string` | `Phone`, `Mobile`, `Country_Code` | `Phone`, `Mobile`, `Country_Code` | Parsed to international E.164 with country detection. Fallback: `+919999999999`. |
| `dob` | `string \| null` | `Dob` | `DOB` | Parsed to UTC midnight ISO string (`YYYY-MM-DDTHH:mm:ss.000Z`) to prevent timezone shifts. |
| `maritalStatus` | `StandardMaritalStatus \| null` | `marital_status` | `marital_status` | Normalized to `single`, `married`, `divorced`, `widowed`, or `null`. |
| `address` | `ClientAddressDto` | `Street`, `City`, `State`, etc. | `Mailing_Street`, `Mailing_City`, etc. | **Priority 1:** Zoho Books invoice billing address.<br>**Priority 2:** CRM record address fields. |
| `createdAt` | `string` (ISO 8601) | `Created_Time` | `Created_Time` | Normalized to UTC ISO 8601. Fallback: `1970-01-01T00:00:00.000Z`. |
| `updatedAt` | `string` (ISO 8601) | `Modified_Time`, `Created_Time` | `Modified_Time`, `Created_Time` | Primary `Modified_Time`, falls back to `Created_Time`, then Unix Epoch. |

---

## 3. Field Transformation Logic

### 1. Name Extraction & Title Case (`extractNames`)
- Reads `First_Name` and `Last_Name`.
- If either is missing, splits `Full_Name` by whitespace: the final token becomes `lastName`; earlier tokens form `firstName`.
- **Mononyms:** Single words (e.g. *"Asha"*) map to `lastName`, with `firstName = ""`.
- Converts names to Title Case, preserving hyphens (*Mary-Jane*) and apostrophes (*O'Connor*).

### 2. Email Sanitization (`normalizeEmail`)
- Evaluates primary `Email`, falling back to `Secondary_Email`.
- Lowercases string and strips all internal and trailing whitespace.
- Rejects strings without `@` or literals like `"null"`.
- **Client Fallback:** If missing or invalid, defaults to `notprovided@gmail.com`.

### 3. International Phone Formatting (`normalizePhoneNumber`)
- Evaluates primary `Phone`, falling back to `Mobile`.
- Extracts ISO country code and calling code from `Country_Code` text (e.g. *"+91 - India"* &rarr; `IN`, *"+1 - USA"* &rarr; `US`).
- Formats valid numbers into strict international E.164 (e.g. `+919876543210`, `+12025550143`).
- **Fallback:** Unparseable or empty numbers default to `+919999999999`.

### 4. Timezone-Neutral Date of Birth & Marital Status
- **DOB Normalization:** Reads `Dob` (Leads) or `DOB` (Contacts). Parses `YYYY-MM-DD` explicitly as UTC midnight (`00:00:00.000Z`) to prevent timezone shifts across continents.
- **Marital Status:** Maps raw strings (*Married*, *Un-married*, *Divorced / Separated*, *Widowed*) to 4 strict lowercase enums, or `null` if unrecognized.

### 5. Two-Tier Address Resolution Pipeline
1. **Priority 1 (Zoho Books Invoice Billing Address):**
   - Invoices are matched via Books Contact customer IDs (`_zoho_crm_contact_id`) and normalized client emails in a single batch query.
   - `scoreAddressCompleteness()` scores candidate invoices (0 to 5) based on populated address fields.
   - Ties are broken by invoice recency (`date` descending, newest first).
   - `combineStreetParts()` merges `street`, `street2`, and parent `address` without duplication.
2. **Priority 2 (CRM Record Address Fallback):**
   - **Leads:** `Street`, `City`, `State`, `Country`, `Zip_Code`.
   - **Contacts:** `Mailing_Street ?? Street`, `Mailing_City ?? City`, etc.
   - Always returns a uniform 5-property object with `null` for empty fields.

---

## 4. Zoho Enums & Values

### Marital Status Mapping Matrix

| Zoho Source `marital_status` | Mapped Value |
| :--- | :--- |
| `'Married'` | `'married'` |
| `'Un-married'` / `'Unmarried'` / `'Single'` | `'single'` |
| `'Divorced / Separated'` / `'Divorced'` / `'Separated'` | `'divorced'` |
| `'Widowed'` / `'Widow'` / `'Widower'` | `'widowed'` |
| Unrecognized string / `null` / empty | `null` |

### Target Enums
- **Marital Status (`StandardMaritalStatus`):** `single`, `married`, `divorced`, `widowed`
- **Record Types (`ClientRecordType`):** `leads`, `contacts`

---

## 5. Fallback Strategy

| Field | Condition | Resolution Path | Final Value |
| :--- | :--- | :--- | :--- |
| `firstName` | Missing `First_Name` | Extracts earlier tokens from `Full_Name` | Parsed token or `""` |
| `lastName` | Missing `Last_Name` | Extracts final token from `Full_Name` | Parsed token or `""` |
| `email` | Missing primary `Email` | Falls back to `Secondary_Email` | Cleaned secondary email |
| `email` | Both emails missing or invalid | Client placeholder default | `"notprovided@gmail.com"` |
| `phone` | Missing `Phone` | Falls back to `Mobile` | Normalized E.164 mobile |
| `phone` | Both `Phone` and `Mobile` missing/invalid | Standard placeholder | `"+919999999999"` |
| `dob` | Missing or invalid date string | Validation fails | `null` |
| `maritalStatus` | Missing or unrecognized string | Validation fails | `null` |
| `address` | No Books invoices found for client | Falls back to CRM record address fields | Sanitized CRM address |
| `createdAt` | Missing/invalid `Created_Time` | Unix Epoch UTC | `"1970-01-01T00:00:00.000Z"` |
| `updatedAt` | Missing/invalid `Modified_Time` | Falls back to `Created_Time` | `createdAt` value or Epoch |

---

## 6. Key Edge Cases

1. **Leads vs Contacts Field Casing:** Zoho CRM uses inconsistent field casing across modules: Leads use `Dob` and `Street`, whereas Contacts use `DOB` and `Mailing_Street` (falling back to `Street`). The service dynamically branches extraction based on `type`.
2. **Books Invoice Address Precedence:** Billing addresses on paid tax invoices represent legally verified client residences. The API prioritizes Zoho Books invoice addresses over legacy CRM contact addresses whenever usable invoice data exists.
3. **Client vs Staff Email Fallbacks:** While Staff API defaults missing emails to `notprovided@worldvisa.in`, Clients API intentionally defaults to `notprovided@gmail.com` to distinguish customer placeholders from internal employees.
4. **DOB Timezone Shift Prevention:** Date-only strings (`YYYY-MM-DD`) are parsed explicitly as UTC midnight. Parsing with local date constructors would shift birth dates back by one day for users located west of UTC (e.g. US/Canada).

---

## 7. Response Reference

### TypeScript Schema
```typescript
export type StandardMaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';

export interface ClientAddressDto {
  street: string | null;     // Combined street, suite, and address lines
  city: string | null;       // City name
  state: string | null;      // State / Province
  country: string | null;    // Country name
  zipCode: string | null;    // Postal / ZIP code
}

export interface ClientItemDto {
  externalId: string;        // Original Zoho ID (zoho_id)
  firstName: string;         // Title-Cased first name
  lastName: string;          // Title-Cased last name
  email: string;             // Lowercased email or 'notprovided@gmail.com'
  phone: string;             // International E.164 phone or '+919999999999'
  dob: string | null;        // UTC ISO 8601 string or null
  maritalStatus: StandardMaritalStatus | null; // Standardized marital status
  address: ClientAddressDto; // Resolved invoice or CRM address
  createdAt: string;         // Zoho Created_Time in UTC ISO 8601
  updatedAt: string;         // Zoho Modified_Time in UTC ISO 8601
}

export interface ClientsResponseDto {
  data: ClientItemDto[];
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
      "externalId": "445172000000196023",
      "firstName": "Sarah Jane",
      "lastName": "Connor",
      "email": "sarah.connor@example.com",
      "phone": "+12025550143",
      "dob": "1985-11-20T00:00:00.000Z",
      "maritalStatus": "single",
      "address": {
        "street": "500 Tech Highway, Floor 10",
        "city": "San Francisco",
        "state": "California",
        "country": "USA",
        "zipCode": "94105"
      },
      "createdAt": "2022-03-01T12:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    },
    {
      "externalId": "445172000000196099",
      "firstName": "Rahul",
      "lastName": "Sharma",
      "email": "rahul.sharma@example.com",
      "phone": "+919876543210",
      "dob": "1992-04-10T00:00:00.000Z",
      "maritalStatus": "married",
      "address": {
        "street": "123 MG Road, Suite 400",
        "city": "Pune",
        "state": "Maharashtra",
        "country": "India",
        "zipCode": "411001"
      },
      "createdAt": "2023-05-10T08:30:00.000Z",
      "updatedAt": "2023-09-20T14:15:00.000Z"
    }
  ],
  "total": 1234,
  "page": 1,
  "pageSize": 2,
  "hasMore": true
}
```

