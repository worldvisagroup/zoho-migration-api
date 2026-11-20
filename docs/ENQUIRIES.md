# Enquiries API — Technical Extraction & Field Mapping Specification

- **Endpoint:** `GET /api/v1/enquiries`
- **Controller:** [`EnquiriesController`](file:///e:/World%20visa/zoho-api/src/modules/enquiries/controllers/enquiries.controller.ts)
- **Service:** [`EnquiriesService`](file:///e:/World%20visa/zoho-api/src/modules/enquiries/services/enquiries.service.ts)
- **Repository:** [`EnquiriesRepository`](file:///e:/World%20visa/zoho-api/src/modules/enquiries/repositories/enquiries.repository.ts)
- **Authentication:** `x-api-key: <API_KEY>` (Required header, 401 Unauthorized if missing/invalid)
- **Primary Collections:** `migrated_leads` (when `type=leads`) or `migrated_contacts` (when `type=contacts`)
- **Related Collections:** `migrated_users`, `migrated_visa_applications`, `unified_entries`, `migrated_notes`, `migrated_calls`, `migrated_tasks`, `migrated_events`, `migrated_attachments`
- **Status:** Complete & Production Ready

---

## 1. API Overview

### Purpose

The Enquiries API extracts unified sales and immigration prospect records from either Zoho CRM Leads (`migrated_leads`) or Zoho CRM Contacts (`migrated_contacts`), selected via the required `type` parameter. It normalizes client contact data (emails and international phone numbers), standardizes the target interested service across 29 discrete snake_case enums, resolves the client's destination country using multi-tier cascading fallbacks, aggregates UTM campaign tracking and attribution parameters with secondary fallback to `unified_entries`, and aggregates all related child resources in parallel (Notes, Phone Calls, Assigned Tasks, Consultation Meetings, and File Attachments with presigned Cloudflare R2 download URLs).

### Supported Query Parameters

| Parameter      | Type     | Required | Default     | Validation Rules                                | Description                                                                                              |
| :------------- | :------- | :------- | :---------- | :---------------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| `type`         | `enum`   | **Yes**  | `undefined` | `@IsNotEmpty()`, `@IsIn(['leads', 'contacts'])` | Target CRM collection to extract (`'leads'` for `migrated_leads`, `'contacts'` for `migrated_contacts`). |
| `page`         | `number` | No       | `1`         | `@IsInt()`, `@Min(1)`                           | 1-indexed pagination page number.                                                                        |
| `limit`        | `number` | No       | `200`       | `@IsInt()`, `@Min(1)`, `@Max(1000)`             | Records per page (capped at 1,000).                                                                      |
| `from`         | `string` | No       | `undefined` | `@IsISO8601()`                                  | Inclusive start filter on Zoho `Created_Time`.                                                           |
| `to`           | `string` | No       | `undefined` | `@IsISO8601()`                                  | Inclusive end filter on Zoho `Created_Time`.                                                             |
| `updatedSince` | `string` | No       | `undefined` | `@IsISO8601({ strict: true })`                  | Incremental sync filter on Zoho `Modified_Time` (`>=`). Mutually exclusive with `from`/`to`.             |

- **Collision Prevention Strategy:** `updatedSince` is strictly mutually exclusive with `from` and `to`. Specifying both returns `400 Bad Request`.
- **Sorting Guarantee:** Ascending order: `{ Created_Time: 1, _id: 1 }` (oldest to newest) by default, or `{ Modified_Time: 1, _id: 1 }` when `updatedSince` is supplied.
- **Pagination Envelope:** Returns `{ data, total, page, limit, hasMore }` where `hasMore = page * limit < total`.
- **Response Wrapper:** Decorated with `@BypassTransform()` to return the direct migration payload directly.

---

## 2. Zoho Field Mapping

Direct mapping from MongoDB `migrated_leads` / `migrated_contacts` and related collections to [`EnquiryItemDto`](file:///e:/World%20visa/zoho-api/src/modules/enquiries/dto/enquiry-response.dto.ts):

| Target Field                 | Target Type                 | Zoho Source Field                                                          | Source Type      | Transformation Summary                                                                                                |
| :--------------------------- | :-------------------------- | :------------------------------------------------------------------------- | :--------------- | :-------------------------------------------------------------------------------------------------------------------- |
| `externalId`                 | `string`                    | `zoho_id`                                                                  | String           | Direct 1:1 copy of Zoho Lead or Contact unique identifier.                                                            |
| `client.email`               | `string \| null`            | `Email`, `Secondary_Email`                                                 | String           | Normalized lowercase email address. Null if missing/unparseable.                       |
| `client.phone`               | `string \| null`            | `Phone`, `Mobile`, `Country_Code`                                          | String           | E.164 formatted international phone number. Null if missing/unparseable.               |
| `ownerEmail`                 | `string \| null`            | `_zoho_owner_id` or `Owner.id` &rarr; `migrated_users.email`               | Lookup           | Resolved email address of assigned Zoho CRM staff owner, or `Owner.email`, or `null`.                                 |
| `interestedService`          | `InterestedService \| null` | Multiple fields (see Section 3)                                            | String / Cascade | Normalized to one of 29 standard snake_case enums via prioritized cascade, or `null`.                                 |
| `destinationCountry`         | `string \| null`            | Multiple fields (see Section 3)                                            | String / Cascade | Sanitized target country via prioritized cascade across CRM, Visa Apps, and unified entries, or `null`.               |
| `stage`                      | `null`                      | _None_                                                                     | Constant         | Hardcoded `null`. Reserved for future lifecycle pipeline stages.                                                      |
| `status`                     | `null`                      | _None_                                                                     | Constant         | Hardcoded `null`. Reserved for future status synchronization.                                                         |
| `closure`                    | `null`                      | _None_                                                                     | Constant         | Hardcoded `null`. Reserved for future deal/lead closure reasons.                                                      |
| `source`                     | `EnquirySource`             | `Lead_Source`                                                              | Picklist         | Normalized into one of 9 discrete enum channels (`google_ads`, `meta_ads`, `website`, etc.). Defaults to `'website'`. |
| `sourceDetails`              | `string \| null`            | `Lead_Source`                                                              | String           | Original unmodified trimmed Zoho source string, or `null`.                                                            |
| `attribution.campaignName`   | `string \| null`            | `Campaign_Name`, `Ad_Campaign_Name`, `UTM_Campaign_Name`, `Campaigns_Name` | String / Lookup  | Priority CRM campaign name; falls back to matched `unified_entries.attribution.campaignName`.                         |
| `attribution.adGroupName`    | `string \| null`            | `AdGroup_Name`, `Ad_Set`                                                   | String / Lookup  | Priority CRM ad set/group; falls back to matched `unified_entries.attribution.adGroupName`.                           |
| `attribution.adName`         | `string \| null`            | `facebookadvertmanager__Facebook_Ad`, `Ad_ID`, `ADID`, `Ad`                | String / Lookup  | Priority CRM creative name/ID; falls back to matched `unified_entries.attribution.adName`.                            |
| `attribution.gclid`          | `string \| null`            | `GCLID`                                                                    | String / Lookup  | Google Click Identifier from CRM or matched `unified_entries`.                                                        |
| `attribution.utmSource`      | `string \| null`            | `UTM_Lead_Source`                                                          | String / Lookup  | UTM source parameter from CRM or matched `unified_entries`.                                                           |
| `attribution.utmMedium`      | `string \| null`            | `UTM_Medium`                                                               | String / Lookup  | UTM medium parameter from CRM or matched `unified_entries`.                                                           |
| `attribution.utmCampaign`    | `string \| null`            | `UTM_Campaign_Name`                                                        | String / Lookup  | UTM campaign parameter from CRM or matched `unified_entries`.                                                         |
| `attribution.utmTerm`        | `string \| null`            | `UTM_Term`                                                                 | String / Lookup  | UTM search keyword term from CRM or matched `unified_entries`.                                                        |
| `attribution.utmContent`     | `string \| null`            | `UTM_Content`                                                              | String / Lookup  | UTM creative content variant from CRM or matched `unified_entries`.                                                   |
| `attribution.facebookLeadId` | `string \| null`            | `Lead_ID`, `leadchain0__Social_Lead_ID`                                    | String / Lookup  | Facebook Instant Form Lead ID from CRM or matched `unified_entries`.                                                  |
| `attribution.fbc`            | `string \| null`            | `FBCLID`                                                                   | String / Lookup  | Meta Click Identifier from CRM or matched `unified_entries`.                                                          |
| `attribution.fbp`            | `string \| null`            | _Unified only_                                                             | Lookup           | Meta Browser Identifier resolved exclusively from matched `unified_entries`.                                          |
| `createdAt`                  | `string` (ISO 8601)         | `Created_Time`                                                             | Datetime         | UTC ISO 8601 timestamp. Falls back to Unix Epoch if invalid/missing.                                                  |
| `updatedAt`                  | `string` (ISO 8601)         | `Modified_Time`, `Created_Time`                                            | Datetime         | UTC ISO 8601 timestamp. Falls back to `Created_Time`, then Unix Epoch.                                                |
| `createdById`                | `string \| null`            | `_zoho_created_by_id`, `Created_By.id`                                     | String           | Cleaned Zoho user ID of record creator, or `null`.                                                                    |
| `createdByEmail`             | `string \| null`            | `_zoho_created_by_id` &rarr; `migrated_users.email`                        | Lookup           | Resolved creator email address via batch lookup, or `Created_By.email`, or `null`.                                    |
| `modifiedAt`                 | `string` (ISO 8601)         | `Modified_Time`, `Created_Time`                                            | Datetime         | Identical to `updatedAt`. Normalized UTC ISO 8601 timestamp.                                                          |
| `modifiedById`               | `string \| null`            | `_zoho_modified_by_id`, `Modified_By.id`                                   | String           | Cleaned Zoho user ID of last modifier, or `null`.                                                                     |
| `notes`                      | `NoteItemDto[]`             | `migrated_notes`                                                           | Array / Lookup   | Array of related notes matching `_zoho_lead_id` or `_zoho_contact_id`.                                                |
| `calls`                      | `CallItemDto[]`             | `migrated_calls`                                                           | Array / Lookup   | Array of related phone call logs matching `_zoho_lead_id` or `_zoho_contact_id`.                                      |
| `tasks`                      | `TaskItemDto[]`             | `migrated_tasks`                                                           | Array / Lookup   | Array of related task assignments matching `_zoho_lead_id` or `_zoho_contact_id`.                                     |
| `meetings`                   | `MeetingItemDto[]`          | `migrated_events`                                                          | Array / Lookup   | Array of related calendar meetings matching `_zoho_lead_id` or `_zoho_contact_id`.                                    |
| `attachments`                | `AttachmentItemDto[]`       | `migrated_attachments`                                                     | Array / Lookup   | Array of related files with fresh presigned Cloudflare R2 download URLs.                                              |
| `invoices`                   | `unknown[]`                 | _None_                                                                     | Constant         | Empty array `[]`. Placeholder for upcoming billing and accounting migration.                                          |

---

## 3. Field Transformation Logic

### 1. Client Contact Normalization

Client identity is extracted and normalized to standard formats or null:

- **Email Sanitization:** Cleans `record.Email`, falling back to `record.Secondary_Email`. Strips trailing whitespace, converts to lowercase, and validates email syntax. If missing or invalid, returns `null`.
- **Phone Sanitization:** Combines `Country_Code` with `Phone` or `Mobile`. Cleans non-numeric characters and formats into standard E.164. If missing, invalid, or unparseable, returns `null`.

### 2. Service Resolution Cascade (`resolveInterestedServiceCascade`)

Interested immigration service is determined via a multi-tier fallback ladder that maps CRM strings to 29 standardized snake_case enums:

- **For Leads (`type=leads`):**
  1. `record.Service_Required1`
  2. Related Visa Application `Application_Stage`
  3. Related Visa Application `Selected_Visa_Type`
  4. Matched `unified_entries.interestedService`
- **For Contacts (`type=contacts`):**
  1. `record.Service_Finalized`
  2. `record.Service_Required`
  3. Related Visa Application `Application_Stage`
  4. Related Visa Application `Selected_Visa_Type`
  5. Matched `unified_entries.interestedService`
- **Matching Algorithm:**
  - Evaluates direct matches against known snake_case enums.
  - Normalizes case and maps human-readable strings (e.g. `"Permanent Residency"`, `"Australia PR"` &rarr; `'permanent_residency'`).
  - Ignores null-like strings (`'null'`, `'undefined'`, `'others'`, `'-none-'`).
  - Returns `null` if no candidate resolves to a valid service enum.

### 3. Destination Country Cascading Resolution

Target migration destination country is resolved through an ordered hierarchy:

- **For Leads (`type=leads`):**
  1. `record.country_addressed`
  2. `record.intended_country` (takes first item if multiselect array, or direct string)
  3. Matched Visa Application `Qualified_Country`
  4. Matched `unified_entries.destinationCountry`
- **For Contacts (`type=contacts`):**
  1. `record.country_finalised`
  2. `record.Country_Qualified_for`
  3. Matched Visa Application `Qualified_Country`
  4. Matched `unified_entries.destinationCountry`
- **Sanitization:** Strips leading/trailing whitespace and explicitly rejects invalid string tokens (`'null'`, `'undefined'`, `'-None-'`).

### 4. Attribution & Campaign Tracking Merge (`buildAttribution`)

Attribution reconciles advertising click IDs and UTM metadata across CRM fields and website tracking entries (`unified_entries`):

- **Candidate Proximity Matching:** For records with multiple unified website interactions, the service matches candidates by email or phone and selects the entry whose submission timestamp (`addedTime` or `createdAt`) has the minimum absolute difference from the CRM record's `Created_Time`:
  $$\Delta t = |\text{entryTime} - \text{recordCreatedTime}|$$
- **Primary-First Merging:** Evaluates primary CRM fields first; if null or empty, falls back to the corresponding field in the selected `unified_entries.attribution` object.
- **Attribution Fields Covered:** `campaignName`, `adGroupName`, `adName`, `gclid`, `utmSource`, `utmMedium`, `utmCampaign`, `utmTerm`, `utmContent`, `facebookLeadId`, `fbc`, `fbp`.

### 5. Acquisition Channel Classification (`normalizeEnquirySource`)

Maps raw Zoho `Lead_Source` picklist values into 9 standardized source enums:

1. Exact lookup in `RAW_SOURCE_MAPPING` dictionary.
2. Substring heuristic evaluations:
   - Contains `'facebook'` or `'meta'` &rarr; `'meta_ads'`
   - Contains `'google'` or `'adwords'` &rarr; `'google_ads'`
   - Contains `'whatsapp'` or `'wati'` &rarr; `'whatsapp'`
   - Contains `'ivr'` &rarr; `'ivr'`
   - Contains `'assessment report'` or `'spot assesment'` &rarr; `'pr_assessment'`
   - Contains `'referral'` or `'referal'` &rarr; `'referral'`
   - Contains `'walk-in'` or `'walk -in'` &rarr; `'walk_in'`
   - Contains `'blog'` &rarr; `'blog'`
3. Default fallback: If null, empty, unrecognized, or general online form &rarr; `'website'`.

### 6. Full Sub-Resource Aggregation & Presigned URL Generation

For each page of 200 records, the service issues parallel batched indexed queries across all 6 child collections:

- `migrated_notes`: Filtered by `_zoho_lead_id` or `_zoho_contact_id`, formatted with title and content.
- `migrated_calls`: Direction (`inbound`/`outbound`), duration, status (`answered`, `missed`, `busy`, `cancelled`), and voice recording links.
- `migrated_tasks`: Status (`open`, `in_progress`, `completed`, `cancelled`), priority, and due dates.
- `migrated_events`: Scheduled time, ended time, status (`scheduled`, `ended`, `cancelled`), and deduplicated participants.
- `migrated_attachments`: Batch signs fresh presigned Cloudflare R2 download URLs on the fly for all attachments containing an `r2_key`.

---

## 4. Zoho Enums & Values

### Enquiry Extraction Types (`QueryEnquiriesDto.type`)

| Enum Value   | Primary Target Collection | Description                                                       |
| :----------- | :------------------------ | :---------------------------------------------------------------- |
| `'leads'`    | `migrated_leads`          | Prospective visa leads prior to qualification/conversion.         |
| `'contacts'` | `migrated_contacts`       | Qualified clients, consultation prospects, and active applicants. |

### Standardized Enquiry Sources (`EnquirySource`)

| Enum Value        | Representative Zoho `Lead_Source` Values                                                      | Business Meaning                                                           |
| :---------------- | :-------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------- |
| `'google_ads'`    | `Google Ads`, `Google AdWords`, `Digital Campaigns`, `Advertisement`                          | Paid Google Search & Display advertising.                                  |
| `'meta_ads'`      | `Facebook Ads`, `Instagram`, `Meta Ads`, `Job Seeker Visa - Facebook`                         | Paid Meta (Facebook & Instagram) ads.                                      |
| `'website'`       | `Website`, `Website Visit`, `Online Chat`, `Zoho Bookings`, `Email`, `LinkedIn`, `Old Client` | Organic website traffic, web forms, direct inquiries, or unmapped default. |
| `'blog'`          | `Blog`, `Blog-Form`                                                                           | Content marketing and educational visa blog articles.                      |
| `'pr_assessment'` | `Australia Assessment Report`, `Canada Assessment Report`, `Spot Assesment`                   | Free or paid online eligibility point assessment tool submissions.         |
| `'referral'`      | `Referral Client`, `Employee Referral`, `External Referral`, `Partner`                        | Word-of-mouth recommendations and external affiliate partners.             |
| `'walk_in'`       | `Walk-in Client`, `Walk-in`, `Signage / Board`                                                | In-person office visits to Bangalore or Melbourne branches.                |
| `'ivr'`           | `IVR - Google`, `IVR Facebook`, `IVR- Website`                                                | Inbound cloud telephony and interactive voice response calls.              |
| `'whatsapp'`      | `WhatsApp - World Visa`, `Wati`                                                               | Direct messaging leads via WhatsApp Business API / Wati.                   |

### Standardized Interested Services (`InterestedService` — 29 Enums)

| Enum Value                       | Raw Source Terms / Synonyms                                        | Category                 |
| :------------------------------- | :----------------------------------------------------------------- | :----------------------- |
| `'permanent_residency'`          | `Permanent Residency`, `Canada PR`, `Australia PR`, `Immigrate`    | Permanent Residency      |
| `'work_permit'`                  | `Work Permit`, `Work`                                              | Employment Migration     |
| `'visit_visa'`                   | `Visit Visa`, `Visitor Visa`, `Travel`                             | Short Stay & Visitor     |
| `'job_seeker_visa'`              | `Job Seeker Visa`, `Job Seeker`                                    | Employment Migration     |
| `'germany_opportunity_card'`     | `Germany Opportunity Card`                                         | Employment Migration     |
| `'national_innovation_visa'`     | `National Innovation Visa (NIV)`, `Australia GTI`                  | Talent & Innovation      |
| `'business_visitor_visa'`        | `Business Visitor Visa`, `Business Visa`                           | Business Migration       |
| `'australia_partner_visa'`       | `Australia Partner Visa`, `Partner Visa`                           | Family & Spouse          |
| `'dependent_spouse'`             | `Dependent Spouse`, `Spouse Visa`                                  | Family & Spouse          |
| `'student_visa'`                 | `Student Visa`, `Student / Exchange Visa`, `Study`, `Study Abroad` | Education Migration      |
| `'australian_student_visa'`      | `Australian Student Visa`                                          | Education Migration      |
| `'australia_parent_visa'`        | `Australia Parent Visa`, `Parent Visa`                             | Family & Parent          |
| `'parent_visa_australia_sc804'`  | `Parent Visa (Aged 804)`, `Parent Visa Australia SC804`            | Family & Parent          |
| `'parent_visa_rrv'`              | `Parent Visa RRV`, `Parent Visa (RRV)`                             | Family & Parent          |
| `'australia_child_visa'`         | `Australia Child Visa`, `Child Visa`                               | Family & Child           |
| `'australia_rrv'`                | `Australia RRV`, `Resident Return Visa`, `Residential Return Visa` | Resident Return          |
| `'australia_work_holiday_visa'`  | `Australia Work Holiday Visa`, `Australia Work in Holiday Visa`    | Working Holiday          |
| `'australia_pr_stage_2'`         | `Australia PR Stage 2`, `EOI & Visa Stage 2`                       | Permanent Residency      |
| `'intra_office'`                 | `Intra-office Transfer`, `Intra Office`                            | Employment Migration     |
| `'partner_of_student_work_visa'` | `Partner of Student Work Visa`                                     | Education & Spouse       |
| `'sc_403_visa_application'`      | `SC 403 Visa Application`                                          | Temporary Activity       |
| `'skill_assessment'`             | `Skill Assessment`, `Skill Assessment Stage`                       | Skills & Assessment      |
| `'temporary_dependent_visa'`     | `Temporary Dependent Visa`                                         | Family & Dependent       |
| `'uk_global_talent_visa'`        | `UK Global Talent Visa`                                            | Talent & Innovation      |
| `'university_admission'`         | `University Admission`                                             | Education Admissions     |
| `'college_admission'`            | `College Admission`                                                | Education Admissions     |
| `'super_visa'`                   | `Super Visa`                                                       | Family & Parent (Canada) |
| `'germany_family_reunion_visa'`  | `Germany Family Reunion Visa`                                      | Family & Reunion         |
| `'investor_migration'`           | `Investor Migration`                                               | Investment & Business    |

---

## 5. Fallback Strategy

| Target Field         | Condition                                    | Resolution Path                                    | Final Fallback Value         |
| :------------------- | :------------------------------------------- | :------------------------------------------------- | :--------------------------- |
| `externalId`         | Missing or null `zoho_id`                    | Direct string assignment                           | `""`                         |
| `client.email`       | Missing, invalid syntax, or empty            | Null assignment                                    | `null`                       |
| `client.phone`       | Missing, non-numeric, or dummy digits        | Null assignment                                    | `null`                       |
| `ownerEmail`         | Owner ID missing or not in `migrated_users`  | Checks `Owner.email` object field                  | `null`                       |
| `interestedService`  | All candidates missing, unmapped, or invalid | Cascade through CRM, Visa Apps, Unified            | `null`                       |
| `destinationCountry` | All candidates missing, unmapped, or invalid | Cascade through CRM, Visa Apps, Unified            | `null`                       |
| `stage`              | Any                                          | Hardcoded design constant                          | `null`                       |
| `status`             | Any                                          | Hardcoded design constant                          | `null`                       |
| `closure`            | Any                                          | Hardcoded design constant                          | `null`                       |
| `source`             | Missing, null, unrecognized, or generic form | Default channel fallback                           | `'website'`                  |
| `sourceDetails`      | Missing or empty `Lead_Source`               | Trimmed nullable string                            | `null`                       |
| `attribution.*`      | Missing from both CRM and unified entries    | Nullable field assignment                          | `null`                       |
| `createdAt`          | Missing or unparseable `Created_Time`        | Unix Epoch UTC                                     | `"1970-01-01T00:00:00.000Z"` |
| `updatedAt`          | Missing or unparseable `Modified_Time`       | Falls back to `Created_Time` &rarr; Epoch          | `createdAt` value or Epoch   |
| `modifiedAt`         | Missing or unparseable `Modified_Time`       | Falls back to `Created_Time` &rarr; Epoch          | `createdAt` value or Epoch   |
| `createdById`        | Missing `_zoho_created_by_id`                | Checks `Created_By.id` &rarr; null                 | `null`                       |
| `createdByEmail`     | Creator ID not found in `migrated_users`     | Checks `Created_By.email` &rarr; null              | `null`                       |
| `modifiedById`       | Missing `_zoho_modified_by_id`               | Checks `Modified_By.id` &rarr; null                | `null`                       |
| `notes`              | No matching notes for record                 | Empty array                                        | `[]`                         |
| `calls`              | No matching calls for record                 | Empty array                                        | `[]`                         |
| `tasks`              | No matching tasks for record                 | Empty array                                        | `[]`                         |
| `meetings`           | No matching events for record                | Empty array                                        | `[]`                         |
| `attachments`        | No matching attachments for record           | Empty array                                        | `[]`                         |
| `attachments[].url`  | Failed R2 presigning or missing `r2_key`     | Falls back to `r2_download_url` / `r2_preview_url` | `""`                         |
| `invoices`           | Any                                          | Hardcoded pending array                            | `[]`                         |

---

## 6. Key Edge Cases

1. **Lead vs. Contact Collection Bifurcation:** Because Zoho CRM maintains separate modules for unverified prospects (`Leads`) and converted clients (`Contacts`), the API enforces the mandatory `type` query parameter. This guarantees that callers receive records with consistent schema semantics while accessing the appropriate underlying collection (`migrated_leads` vs. `migrated_contacts`).
2. **Attribution Proximity Matching:** When a lead or contact has interacted with the website multiple times, multiple records exist in `unified_entries` for the same email or phone number. Rather than picking an arbitrary record, the algorithm calculates the absolute time difference between each unified entry's submission timestamp and the CRM record's `Created_Time`, binding the attribution to the session closest to the CRM record creation.
3. **Cross-Module Service & Country Fallbacks via Visa Applications:** In many legacy records, the primary lead or contact card lacked explicit service or destination values because consultants recorded them directly inside the operational Visa Application module. The enquiry transformer automatically joins matching `migrated_visa_applications` by `_zoho_contact_id` or client email, harvesting `Qualified_Country`, `Application_Stage`, and `Selected_Visa_Type` when CRM fields are blank.
4. **Hardcoded Stage, Status, and Closure Fields:** Fields `stage`, `status`, and `closure` are deliberately hardcoded to `null`. This prevents premature coupling to transient Zoho CRM pipeline picklists and provides an unencumbered schema ready for target system state machine transitions.
5. **Fresh Presigned Cloudflare R2 Download URLs:** Legacy CRM attachments are stored securely in Cloudflare R2 object storage. Rather than serving stale public URLs or exposing internal storage keys, the service generates fresh, time-limited presigned S3 download URLs in parallel for all attachments during query execution.
6. **Zero-Record Optimization:** If the requested page offset yields no records from the primary collection, the service short-circuits immediately, bypassing all 7 secondary batch lookups and R2 URL presigning calls to minimize database load.

---

## 7. Response Reference

### TypeScript Interfaces

```typescript
export type EnquiryType = 'leads' | 'contacts';

export type EnquirySource =
  | 'google_ads'
  | 'meta_ads'
  | 'website'
  | 'blog'
  | 'pr_assessment'
  | 'referral'
  | 'walk_in'
  | 'ivr'
  | 'whatsapp';

export type InterestedService =
  | 'work_permit'
  | 'dependent_spouse'
  | 'intra_office'
  | 'visit_visa'
  | 'investor_migration'
  | 'university_admission'
  | 'college_admission'
  | 'student_visa'
  | 'permanent_residency'
  | 'job_seeker_visa'
  | 'australia_parent_visa'
  | 'australia_child_visa'
  | 'parent_visa_rrv'
  | 'germany_opportunity_card'
  | 'parent_visa_australia_sc804'
  | 'national_innovation_visa'
  | 'australia_pr_stage_2'
  | 'australia_partner_visa'
  | 'australia_rrv'
  | 'temporary_dependent_visa'
  | 'sc_403_visa_application'
  | 'australian_student_visa'
  | 'partner_of_student_work_visa'
  | 'super_visa'
  | 'germany_family_reunion_visa'
  | 'australia_work_holiday_visa'
  | 'business_visitor_visa'
  | 'uk_global_talent_visa'
  | 'skill_assessment';

export interface EnquiryClientDto {
  email: string | null; // Normalized email or null
  phone: string | null; // E.164 phone or null
}

export interface EnquiryAttributionDto {
  campaignName: string | null; // Marketing campaign name
  adGroupName: string | null; // Ad set / ad group name
  adName: string | null; // Creative / ad name
  gclid: string | null; // Google Click Identifier
  utmSource: string | null; // UTM Lead Source
  utmMedium: string | null; // UTM Medium (e.g. cpc, paid_social)
  utmCampaign: string | null; // UTM Campaign name
  utmTerm: string | null; // UTM Search Term
  utmContent: string | null; // UTM Content variant
  facebookLeadId: string | null; // Meta Instant Form Lead ID
  fbc: string | null; // Meta Click ID
  fbp: string | null; // Meta Browser ID
}

export interface EnquiryItemDto {
  externalId: string; // Original Zoho Lead/Contact ID (zoho_id)
  client: EnquiryClientDto; // Normalized client contact info
  ownerEmail: string | null; // Assigned CRM staff email
  interestedService: InterestedService | null; // Normalized interested visa service
  destinationCountry: string | null; // Target migration destination country
  stage: null; // Hardcoded null
  status: null; // Hardcoded null
  closure: null; // Hardcoded null
  source: EnquirySource; // Normalized acquisition channel
  sourceDetails: string | null; // Original Zoho Lead_Source value
  attribution: EnquiryAttributionDto; // Marketing campaign attribution
  createdAt: string; // UTC ISO 8601 creation timestamp
  updatedAt: string; // UTC ISO 8601 update timestamp
  createdById: string | null; // Zoho ID of creator
  createdByEmail: string | null; // Resolved email of creator
  modifiedAt: string; // UTC ISO 8601 modification timestamp
  modifiedById: string | null; // Zoho ID of modifier
  notes: NoteItemDto[]; // Related notes list
  calls: CallItemDto[]; // Related phone calls list
  tasks: TaskItemDto[]; // Related tasks list
  meetings: MeetingItemDto[]; // Related consultation meetings list
  attachments: AttachmentItemDto[]; // Related files with presigned R2 URLs
  invoices: unknown[]; // Empty placeholder array
}

export interface EnquiriesResponseDto {
  data: EnquiryItemDto[]; // Array of paginated enquiries
  total: number; // Total matching records in collection
  page: number; // Current page number (1-indexed)
  limit: number; // Records requested per page
  hasMore: boolean; // true if page * limit < total
}
```

### JSON Response Example

```json
{
  "data": [
    {
      "externalId": "164193000000192070",
      "client": {
        "email": "priya.sharma@example.com",
        "phone": "+919876543210"
      },
      "ownerEmail": "asha@worldvisa.in",
      "interestedService": "permanent_residency",
      "destinationCountry": "Australia",
      "stage": null,
      "status": null,
      "closure": null,
      "source": "meta_ads",
      "sourceDetails": "Facebook Ads",
      "attribution": {
        "campaignName": "Australia PR Oct 2024",
        "adGroupName": "Engineers & IT Professionals",
        "adName": "Carousel Ad - Skilled Migration",
        "gclid": null,
        "utmSource": "facebook",
        "utmMedium": "paid_social",
        "utmCampaign": "au_pr_oct_2024",
        "utmTerm": null,
        "utmContent": "carousel_v1",
        "facebookLeadId": "104928374619283",
        "fbc": "fb.1.1710000000.IwAR2...",
        "fbp": "fb.1.1709999999.987654321"
      },
      "createdAt": "2024-03-01T09:00:00.000Z",
      "updatedAt": "2024-03-05T14:30:00.000Z",
      "createdById": "164193000000028001",
      "createdByEmail": "asha@worldvisa.in",
      "modifiedAt": "2024-03-05T14:30:00.000Z",
      "modifiedById": "164193000000028001",
      "notes": [
        {
          "externalId": "164193000000543210",
          "parentType": "lead",
          "parentZohoId": "164193000000192070",
          "title": "Initial Consultation",
          "content": "Candidate has 65 points for Australia Subclass 189. Recommended PTE coaching.",
          "createdByZohoId": "164193000000028001",
          "createdByEmail": "asha@worldvisa.in",
          "createdAt": "2024-03-01T09:30:00.000Z",
          "modifiedByZohoId": "164193000000028001",
          "modifiedByEmail": "asha@worldvisa.in",
          "modifiedAt": "2024-03-01T09:30:00.000Z"
        }
      ],
      "calls": [
        {
          "externalId": "164193000000654321",
          "parentType": "lead",
          "parentZohoId": "164193000000192070",
          "direction": "outbound",
          "status": "answered",
          "customerPhone": "+919876543210",
          "agentEmail": "asha@worldvisa.in",
          "startedAt": "2024-03-01T10:00:00.000Z",
          "durationSeconds": 480,
          "notes": "Discussed assessment process and documentation requirements.",
          "followUpAt": "2024-03-06T10:00:00.000Z",
          "recording": {
            "url": "https://storage.worldvisa.in/recordings/call_654321.mp3",
            "mimeType": "audio/mpeg",
            "sizeBytes": 3840000
          },
          "createdByEmail": "asha@worldvisa.in",
          "createdByZohoId": "164193000000028001",
          "createdAt": "2024-03-01T10:00:00.000Z",
          "modifiedByEmail": "asha@worldvisa.in",
          "modifiedByZohoId": "164193000000028001",
          "modifiedAt": "2024-03-01T10:08:00.000Z"
        }
      ],
      "tasks": [
        {
          "externalId": "164193000000765432",
          "parentType": "lead",
          "parentZohoId": "164193000000192070",
          "title": "Collect Resume and Degree Certificates",
          "description": "Collect verified degree transcripts and detailed resume for skills assessment.",
          "status": "done",
          "priority": "high",
          "dueDate": "2024-03-05T00:00:00.000Z",
          "assigneeId": "164193000000028001",
          "assigneeEmail": "asha@worldvisa.in",
          "createdByZohoId": "164193000000028001",
          "createdByEmail": "asha@worldvisa.in",
          "createdAt": "2024-03-01T09:15:00.000Z",
          "modifiedByZohoId": "164193000000028001",
          "modifiedByEmail": "asha@worldvisa.in",
          "modifiedAt": "2024-03-04T16:00:00.000Z",
          "completedAt": "2024-03-04T16:00:00.000Z"
        }
      ],
      "meetings": [
        {
          "externalId": "164193000000876543",
          "parentType": "lead",
          "parentZohoId": "164193000000192070",
          "title": "Australia PR Strategy Consultation",
          "description": "Virtual meeting to finalize migration roadmap.",
          "status": "ended",
          "scheduledAt": "2024-03-02T11:00:00.000Z",
          "startedAt": "2024-03-02T11:00:00.000Z",
          "endedAt": "2024-03-02T11:45:00.000Z",
          "hostEmail": "asha@worldvisa.in",
          "hostId": "164193000000028001",
          "participants": [
            {
              "email": "asha@worldvisa.in",
              "name": "Asha Sharma",
              "type": "staff"
            },
            {
              "email": "priya.sharma@example.com",
              "name": "Client",
              "type": "guest"
            }
          ],
          "recording": null,
          "createdById": "164193000000028001",
          "createdByEmail": "asha@worldvisa.in",
          "modifiedAt": "2024-03-02T11:45:00.000Z",
          "modifiedById": "164193000000028001"
        }
      ],
      "attachments": [
        {
          "externalId": "164193000000987654",
          "parentType": "lead",
          "parentZohoId": "164193000000192070",
          "url": "https://r2.worldvisa.com/attachments/164193000000987654_resume.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=3600...",
          "fileName": "Priya_Sharma_CV.pdf",
          "mimeType": "application/pdf",
          "sizeBytes": 245890,
          "uploadedByEmail": "asha@worldvisa.in",
          "uploadedByZohoId": "164193000000028001",
          "uploadedAt": "2024-03-04T15:20:00.000Z",
          "createdAt": "2024-03-04T15:20:00.000Z",
          "modifiedAt": "2024-03-04T15:20:00.000Z",
          "modifiedByEmail": null,
          "modifiedByZohoId": null
        }
      ],
      "invoices": []
    }
  ],
  "total": 14250,
  "page": 1,
  "pageSize": 200,
  "hasMore": true
}
```
