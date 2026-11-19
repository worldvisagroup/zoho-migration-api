# Zoho Data Migration Engine — Technical Documentation Portal

This directory contains the Next.js technical documentation project for the Zoho CRM & Zoho Books data extraction, field mapping, and migration pipeline.

Unlike conventional API documentation that only outlines endpoints and JSON schemas, this portal documents the complete data lineage, MongoDB query and indexing logic, sanitization pipelines, enum conversions, relationship resolutions, and fallback rules.

---

## Getting Started

### Prerequisites
- Node.js `v20+` or `v24+`
- npm, pnpm, or bun

### Running Locally
```bash
cd docs
npm install
npm run dev
```
The documentation portal will start at [http://localhost:3001](http://localhost:3001).

### Production Build
```bash
npm run build
npm run start
```

---

## Authentication & Security

All migration endpoints (with the exception of `/api/v1/health`) require server-to-server header-based authentication:

- **Header Name:** `x-api-key`
- **Environment Variable:** `API_KEY` (stored in `.env`, defaults to `wv_sec_api_key_migration_2026`)
- **HTTP Status Codes:**
  - `401 Unauthorized`: Returned when `x-api-key` is missing or does not match the configured `API_KEY`.
- **Swagger Integration:** Global `ApiKeyAuth` security requirement in `/api/docs`. Use the **Authorize** button in Swagger UI to test authenticated requests.

Example Request:
```bash
curl -X GET "http://localhost:5050/api/v1/staff" \
  -H "x-api-key: wv_sec_api_key_migration_2026"
```

---

## Documentation Structure

Each API module follows a standardized technical reference structure:

1. **API Overview:** HTTP Route, Controller, query parameters, constraints, and chronological sorting.
2. **Zoho Field Mapping:** Source collection and field lineage matrix to API response fields.
3. **Field Transformation Logic:** Concrete business logic for names, emails, phones, dates, and addresses.
4. **Zoho Enums and Values:** Source-to-target enum matrices.
5. **Fallback Strategy:** Deterministic defaults applied when source values are missing or invalid.
6. **Key Edge Cases:** Anomalies, casing, mononyms, and cross-module differences.
7. **Response Reference:** Complete TypeScript interfaces and realistic response examples.

---

## Module Status

| Module | Route | Source Collection | Documentation Status |
| :--- | :--- | :--- | :--- |
| **Staff** | `GET /api/v1/staff` | `migrated_users` | ✅ **Complete & Documented** (`/apis/staff`) |
| **Clients** | `GET /api/v1/clients` | `migrated_leads`, `migrated_contacts` | ✅ **Complete & Documented** (`/apis/clients`) |
| **Tasks** | `GET /api/v1/tasks` | `migrated_tasks` | ✅ **Complete & Documented** (`/apis/tasks`) |
| **Calls** | `GET /api/v1/calls` | `migrated_calls` | ✅ **Complete & Documented** (`/apis/calls`) |
| **Meetings** | `GET /api/v1/meetings` | `migrated_events`, `migrated_meeting_recordings` | ✅ **Complete & Documented** (`/apis/meetings`) |
| **Notes** | `GET /api/v1/notes` | `migrated_notes` | ✅ **Complete & Documented** (`/apis/notes`) |
| **Enquiries** | `GET /api/v1/enquiries` | `migrated_leads`, `migrated_contacts` | ✅ **Complete & Documented** (`/apis/enquiries`) |
| **Attachments** | `GET /api/v1/attachments` | `migrated_attachments` | ✅ **Complete & Documented** (`/apis/attachments`) |
| **Invoices** | `GET /api/v1/invoices` | `migrated_books_invoices` | ⏳ *Scheduled* |
| **Payments** | `GET /api/v1/payments` | `migrated_books_customer_payments` | ⏳ *Scheduled* |

