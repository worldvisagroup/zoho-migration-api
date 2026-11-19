import React from 'react';
import { MethodBadge } from '../../../components/MethodBadge';
import { CodeBlock } from '../../../components/CodeBlock';
import { TableOfContents } from '../../../components/TableOfContents';
import { Inbox, Database, CheckCircle2 } from 'lucide-react';

const tocItems = [
  { id: 'overview', title: '1. API Overview' },
  { id: 'field-mapping', title: '2. Zoho Field Mapping' },
  { id: 'transformation-logic', title: '3. Field Transformation Logic' },
  { id: 'enums-and-values', title: '4. Zoho Enums & Values' },
  { id: 'fallback-strategy', title: '5. Fallback Strategy' },
  { id: 'key-notes', title: '6. Key Edge Cases' },
  { id: 'response-reference', title: '7. Response Reference' },
];

export default function EnquiriesApiDocPage() {
  return (
    <div className="flex gap-10">
      <div className="flex-1 min-w-0 space-y-10 pb-20">
        {/* Header */}
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 border border-sky-500/20">
              <Inbox className="h-3.5 w-3.5" />
              <span>CRM Leads &amp; Inquiries Module</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" />
              Production Ready
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">Enquiries API</h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            Technical mapping and extraction reference for migrating immigration enquiries and sales prospects from Zoho CRM Leads (<code className="text-sky-300 font-mono">migrated_leads</code>) and Contacts (<code className="text-sky-300 font-mono">migrated_contacts</code>) with complete child activity aggregation, cascading service resolution, and campaign attribution.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-1.5 font-mono text-xs text-slate-200">
              <MethodBadge method="GET" />
              <span className="font-semibold text-white">/api/v1/enquiries</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Database className="h-3.5 w-3.5 text-slate-400" />
              <span>Primary Collections:</span>
              <code className="text-sky-300 font-mono">migrated_leads</code>
              <span className="text-slate-500">|</span>
              <code className="text-sky-300 font-mono">migrated_contacts</code>
            </div>
          </div>
        </div>

        {/* 1. API OVERVIEW */}
        <section id="overview" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-500/20">
              1
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">API Overview</h2>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The Enquiries API extracts unified sales and immigration prospect records from either Zoho CRM Leads (<code className="text-sky-300 font-mono">migrated_leads</code>) or Zoho CRM Contacts (<code className="text-sky-300 font-mono">migrated_contacts</code>), selected via the mandatory <code className="text-sky-300 font-mono">type</code> query parameter. It normalizes client contact data (emails and international phone numbers), standardizes the target interested service across 29 discrete snake_case enums, resolves the client&apos;s destination country using multi-tier cascading fallbacks, aggregates UTM campaign tracking and attribution parameters with secondary fallback to <code className="text-sky-300 font-mono">unified_entries</code>, and aggregates all related child resources in parallel (Notes, Phone Calls, Assigned Tasks, Consultation Meetings, and File Attachments with presigned Cloudflare R2 download URLs).
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0c1322]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/70 font-semibold text-slate-300">
                <tr>
                  <th className="px-4 py-2.5">Query Parameter</th>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">Requirement</th>
                  <th className="px-4 py-2.5">Default</th>
                  <th className="px-4 py-2.5">Validation Rules</th>
                  <th className="px-4 py-2.5">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">type</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">enum</td>
                  <td className="px-4 py-2.5">
                    <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] text-rose-400 border border-rose-500/20 font-semibold">
                      Required
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsIn([&apos;leads&apos;, &apos;contacts&apos;])</td>
                  <td className="px-4 py-2.5">Specifies target source collection: <code className="text-slate-200">leads</code> for <code className="text-slate-200">migrated_leads</code> or <code className="text-slate-200">contacts</code> for <code className="text-slate-200">migrated_contacts</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">page</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">number</td>
                  <td className="px-4 py-2.5">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">Optional</span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">1</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsInt(), @Min(1)</td>
                  <td className="px-4 py-2.5">1-indexed page number for pagination.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">limit</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">number</td>
                  <td className="px-4 py-2.5">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">Optional</span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">200</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsInt(), @Min(1), @Max(1000)</td>
                  <td className="px-4 py-2.5">Records per page (capped at 1,000 records).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">from</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">ISO 8601</td>
                  <td className="px-4 py-2.5">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">Optional</span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsISO8601()</td>
                  <td className="px-4 py-2.5">Inclusive filter matching records created at or after timestamp (<code className="text-slate-300">Created_Time &gt;= from</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">to</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">ISO 8601</td>
                  <td className="px-4 py-2.5">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">Optional</span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsISO8601()</td>
                  <td className="px-4 py-2.5">Inclusive filter matching records created at or before timestamp (<code className="text-slate-300">Created_Time &lt;= to</code>).</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Sorting Strategy</div>
              <div className="mt-1 font-mono text-xs text-sky-300">&#123; Created_Time: 1, _id: 1 &#125;</div>
              <div className="mt-1 text-[11px] text-slate-400">Ascending chronological order ensures stable, idempotent delta ingestion.</div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pagination Contract</div>
              <div className="mt-1 font-mono text-xs text-sky-300">hasMore = page * limit &lt; total</div>
              <div className="mt-1 text-[11px] text-slate-400">Evaluates dynamically using total collection count under the current date filter.</div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Direct Serialization</div>
              <div className="mt-1 font-mono text-xs text-emerald-400">@BypassTransform()</div>
              <div className="mt-1 text-[11px] text-slate-400">Bypasses global API interceptors to return the migration response envelope directly.</div>
            </div>
          </div>
        </section>

        {/* 2. ZOHO FIELD MAPPING */}
        <section id="field-mapping" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-500/20">
              2
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Zoho Field Mapping</h2>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Detailed mapping from MongoDB source collections (<code className="text-sky-300 font-mono">migrated_leads</code> and <code className="text-sky-300 font-mono">migrated_contacts</code>) and related lookups to the target <code className="text-sky-300 font-mono">EnquiryItemDto</code> payload:
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0c1322]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/70 font-semibold text-slate-300">
                <tr>
                  <th className="px-4 py-2.5">Target Field</th>
                  <th className="px-4 py-2.5">Target Type</th>
                  <th className="px-4 py-2.5">Zoho Source Field</th>
                  <th className="px-4 py-2.5">Source Type</th>
                  <th className="px-4 py-2.5">Transformation Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">externalId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">zoho_id</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Direct 1:1 copy of Zoho Lead or Contact primary unique identifier.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">client.email</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">Email, Secondary_Email</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Normalized lowercase email address. Falls back to <code className="text-amber-300 font-mono">&apos;notprovided@gmail.com&apos;</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">client.phone</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">Phone, Mobile, Country_Code</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">E.164 formatted international phone number. Falls back to <code className="text-amber-300 font-mono">&apos;+919999999999&apos;</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">ownerEmail</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">_zoho_owner_id, Owner.id</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Lookup / Object</td>
                  <td className="px-4 py-2.5">Resolved email address of assigned Zoho CRM staff owner via <code className="text-slate-300">migrated_users</code>, or <code className="text-slate-300">Owner.email</code>, or <code className="text-slate-400">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">interestedService</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">InterestedService | null</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">Service_Required1 / Finalized</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String / Cascade</td>
                  <td className="px-4 py-2.5">Normalized to one of 29 standard snake_case enums via prioritized multi-tier cascade, or <code className="text-slate-400">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">destinationCountry</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">country_addressed / finalised</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String / Cascade</td>
                  <td className="px-4 py-2.5">Sanitized target country via cascade across CRM, Visa Apps, and unified entries, or <code className="text-slate-400">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">stage</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">null</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Constant</td>
                  <td className="px-4 py-2.5">Hardcoded <code className="text-slate-400">null</code>. Reserved for target pipeline state transitions.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">status</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">null</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Constant</td>
                  <td className="px-4 py-2.5">Hardcoded <code className="text-slate-400">null</code>. Reserved for future status synchronization.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">closure</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">null</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Constant</td>
                  <td className="px-4 py-2.5">Hardcoded <code className="text-slate-400">null</code>. Reserved for target closure reasons.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">source</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">EnquirySource</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">Lead_Source</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Picklist</td>
                  <td className="px-4 py-2.5">Normalized into one of 9 discrete enum channels (<code className="text-slate-200">google_ads</code>, <code className="text-slate-200">meta_ads</code>, <code className="text-slate-200">website</code>, etc.). Defaults to <code className="text-amber-300">&apos;website&apos;</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">sourceDetails</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">Lead_Source</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Original unmodified trimmed Zoho source string, or <code className="text-slate-400">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">attribution</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">EnquiryAttributionDto</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">Campaign_Name, GCLID, UTM_*</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Fields / Lookup</td>
                  <td className="px-4 py-2.5">Object with 12 marketing attribution fields merged from CRM fields with fallback to matched <code className="text-slate-300">unified_entries</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">createdAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string (ISO 8601)</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">Created_Time</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Datetime</td>
                  <td className="px-4 py-2.5">UTC ISO 8601 timestamp. Falls back to Unix Epoch if missing.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">updatedAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string (ISO 8601)</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">Modified_Time, Created_Time</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Datetime</td>
                  <td className="px-4 py-2.5">Primary <code className="text-slate-300">Modified_Time</code>, falls back to <code className="text-slate-300">Created_Time</code>, then Unix Epoch.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">createdById</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">_zoho_created_by_id, Created_By.id</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Cleaned Zoho user ID of record creator, or <code className="text-slate-400">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">createdByEmail</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">_zoho_created_by_id &rarr; email</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Lookup</td>
                  <td className="px-4 py-2.5">Resolved creator email address via batch lookup against <code className="text-slate-300">migrated_users</code>, or <code className="text-slate-400">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">modifiedAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string (ISO 8601)</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">Modified_Time, Created_Time</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Datetime</td>
                  <td className="px-4 py-2.5">Identical to <code className="text-slate-300">updatedAt</code>. Normalized UTC ISO 8601 timestamp.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">modifiedById</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">_zoho_modified_by_id, Modified_By.id</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Cleaned Zoho user ID of last modifier, or <code className="text-slate-400">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">notes</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">NoteItemDto[]</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">migrated_notes</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Array / Lookup</td>
                  <td className="px-4 py-2.5">Related notes matching <code className="text-slate-300">_zoho_lead_id</code> or <code className="text-slate-300">_zoho_contact_id</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">calls</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">CallItemDto[]</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">migrated_calls</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Array / Lookup</td>
                  <td className="px-4 py-2.5">Related phone call logs matching <code className="text-slate-300">_zoho_lead_id</code> or <code className="text-slate-300">_zoho_contact_id</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">tasks</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">TaskItemDto[]</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">migrated_tasks</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Array / Lookup</td>
                  <td className="px-4 py-2.5">Related task assignments matching <code className="text-slate-300">_zoho_lead_id</code> or <code className="text-slate-300">_zoho_contact_id</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">meetings</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">MeetingItemDto[]</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">migrated_events</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Array / Lookup</td>
                  <td className="px-4 py-2.5">Related calendar meetings matching <code className="text-slate-300">_zoho_lead_id</code> or <code className="text-slate-300">_zoho_contact_id</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">attachments</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">AttachmentItemDto[]</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">migrated_attachments</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Array / Lookup</td>
                  <td className="px-4 py-2.5">Related files with dynamically generated Cloudflare R2 presigned download URLs.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">invoices</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">unknown[]</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Constant</td>
                  <td className="px-4 py-2.5">Hardcoded empty array <code className="text-slate-400">[]</code>. Placeholder for upcoming billing and invoicing integration.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. FIELD TRANSFORMATION LOGIC */}
        <section id="transformation-logic" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-500/20">
              3
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Field Transformation Logic</h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
                1. Client Contact Normalization &amp; Default Safeguards
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Client identity must always be non-null and correctly formatted in the target system:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-1">
                <li><strong className="text-white">Email Sanitization:</strong> Inspects <code className="text-slate-200">Email</code> first, falling back to <code className="text-slate-200">Secondary_Email</code>. Trims whitespace, validates RFC syntax, and converts to lowercase. If missing or invalid, assigns the permanent fallback <code className="text-amber-300 font-mono">&apos;notprovided@gmail.com&apos;</code>.</li>
                <li><strong className="text-white">Phone Sanitization:</strong> Combines <code className="text-slate-200">Country_Code</code> with <code className="text-slate-200">Phone</code> or <code className="text-slate-200">Mobile</code>, strips non-numeric punctuation, and formats into E.164. If missing, invalid, or composed of dummy repeated digits, assigns the permanent fallback <code className="text-amber-300 font-mono">&apos;+919999999999&apos;</code>.</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
                2. Service Resolution Cascade (29 snake_case Enums)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The target immigration service is resolved across multiple candidate fields via <code className="text-sky-300 font-mono">resolveInterestedServiceCascade</code>:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-3">
                  <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">Leads Evaluation Order</span>
                  <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1 mt-1.5 font-mono">
                    <li>record.Service_Required1</li>
                    <li>matchedVisaApp.Application_Stage</li>
                    <li>matchedVisaApp.Selected_Visa_Type</li>
                    <li>bestUnified.interestedService</li>
                  </ol>
                </div>
                <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-3">
                  <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">Contacts Evaluation Order</span>
                  <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1 mt-1.5 font-mono">
                    <li>record.Service_Finalized</li>
                    <li>record.Service_Required</li>
                    <li>matchedVisaApp.Application_Stage</li>
                    <li>matchedVisaApp.Selected_Visa_Type</li>
                    <li>bestUnified.interestedService</li>
                  </ol>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Candidate strings are normalized to lowercase, matched against the 29 known enum set, or mapped via dictionary synonyms (e.g. <code className="text-slate-300">&apos;Canada PR&apos;</code>, <code className="text-slate-300">&apos;Immigrate&apos;</code> &rarr; <code className="text-sky-300">&apos;permanent_residency&apos;</code>). Invalid tokens (<code className="text-slate-400">&apos;-none-&apos;</code>, <code className="text-slate-400">&apos;others&apos;</code>) are skipped.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
                3. Destination Country Cascading Resolution
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Destination countries are extracted using multi-field cascade and string sanitization (<code className="text-sky-300 font-mono">sanitizeCountry</code>), which automatically strips leading/trailing whitespace and filters out invalid placeholders (<code className="text-slate-400">&apos;null&apos;</code>, <code className="text-slate-400">&apos;undefined&apos;</code>, <code className="text-slate-400">&apos;-None-&apos;</code>):
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-3">
                  <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">Leads Country Ladder</span>
                  <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1 mt-1.5 font-mono">
                    <li>country_addressed</li>
                    <li>intended_country (first item if array)</li>
                    <li>matchedVisaApp.Qualified_Country</li>
                    <li>bestUnified.destinationCountry</li>
                  </ol>
                </div>
                <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-3">
                  <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">Contacts Country Ladder</span>
                  <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1 mt-1.5 font-mono">
                    <li>country_finalised</li>
                    <li>Country_Qualified_for</li>
                    <li>matchedVisaApp.Qualified_Country</li>
                    <li>bestUnified.destinationCountry</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
                4. Attribution &amp; Campaign Tracking Merge
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Digital marketing attribution reconciles primary Zoho CRM advertising click IDs with website tracking records in <code className="text-sky-300 font-mono">unified_entries</code>:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-1">
                <li><strong className="text-white">Proximity Matching:</strong> When multiple web sessions match a prospect&apos;s email or phone number, the algorithm selects the unified entry whose creation timestamp has the smallest absolute delta from the CRM record&apos;s <code className="text-slate-200">Created_Time</code>: <code className="text-sky-300 font-mono">min(|addedTime - targetCreatedTime|)</code>.</li>
                <li><strong className="text-white">Primary CRM Preference:</strong> Evaluates CRM fields first (<code className="text-slate-300">Campaign_Name</code>, <code className="text-slate-300">AdGroup_Name</code>, <code className="text-slate-300">GCLID</code>, <code className="text-slate-300">UTM_*</code>); if null or whitespace, falls back to the corresponding field in the selected unified entry.</li>
                <li><strong className="text-white">Specialized Tracking:</strong> Seamlessly preserves Meta Facebook Click IDs (<code className="text-slate-300">FBCLID</code> &rarr; <code className="text-slate-200">fbc</code>) and Facebook Browser IDs (<code className="text-slate-300">fbp</code>).</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
                5. Acquisition Channel Classification (9 Discrete Enums)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Raw Zoho <code className="text-slate-200 font-mono">Lead_Source</code> strings are normalized into 9 standardized source channels via dictionary lookup and substring regex heuristics:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1 font-mono text-xs">
                <div className="rounded bg-slate-950/80 px-2 py-1.5 border border-slate-800 text-sky-300">google_ads</div>
                <div className="rounded bg-slate-950/80 px-2 py-1.5 border border-slate-800 text-sky-300">meta_ads</div>
                <div className="rounded bg-slate-950/80 px-2 py-1.5 border border-slate-800 text-sky-300">website</div>
                <div className="rounded bg-slate-950/80 px-2 py-1.5 border border-slate-800 text-sky-300">blog</div>
                <div className="rounded bg-slate-950/80 px-2 py-1.5 border border-slate-800 text-sky-300">pr_assessment</div>
                <div className="rounded bg-slate-950/80 px-2 py-1.5 border border-slate-800 text-sky-300">referral</div>
                <div className="rounded bg-slate-950/80 px-2 py-1.5 border border-slate-800 text-sky-300">walk_in</div>
                <div className="rounded bg-slate-950/80 px-2 py-1.5 border border-slate-800 text-sky-300">ivr</div>
                <div className="rounded bg-slate-950/80 px-2 py-1.5 border border-slate-800 text-sky-300">whatsapp</div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
                6. Parallel Sub-Resource Aggregation &amp; Presigned URL Generation
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                For every batch of 200 enquiries, the service executes a single <code className="text-sky-300 font-mono">Promise.all</code> querying all 6 child collections (<code className="text-slate-200">migrated_notes</code>, <code className="text-slate-200">migrated_calls</code>, <code className="text-slate-200">migrated_tasks</code>, <code className="text-slate-200">migrated_events</code>, <code className="text-slate-200">migrated_attachments</code>, <code className="text-slate-200">migrated_users</code>). For attachments containing an S3/R2 storage key, fresh Cloudflare R2 presigned download URLs are batch-generated in parallel before serializing the response.
              </p>
            </div>
          </div>
        </section>

        {/* 4. ZOHO ENUMS AND VALUES */}
        <section id="enums-and-values" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-500/20">
              4
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Zoho Enums &amp; Values</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">1. Enquiry Source Mapping Matrix</h3>
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0c1322]">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-900/70 font-semibold text-slate-300">
                    <tr>
                      <th className="px-4 py-2.5">Standardized Enum</th>
                      <th className="px-4 py-2.5">Representative Zoho Lead_Source Values</th>
                      <th className="px-4 py-2.5">Business Definition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">google_ads</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Google Ads, Google AdWords, Digital Campaigns, Advertisement</td>
                      <td className="px-4 py-2.5">Paid Google Search, Performance Max, and Display network traffic.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">meta_ads</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Facebook Ads, Instagram, Meta Ads, Job Seeker Visa - Facebook</td>
                      <td className="px-4 py-2.5">Paid Meta Lead Form submissions, carousel ads, and sponsored stories.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">website</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Website, Website Visit, Online Chat, Zoho Bookings, Email, LinkedIn, Old Client</td>
                      <td className="px-4 py-2.5">Direct website visits, contact form inquiries, organic chat, or unmapped default.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">blog</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Blog, Blog-Form</td>
                      <td className="px-4 py-2.5">Editorial immigration blog inquiries and article lead forms.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">pr_assessment</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Australia Assessment Report, Canada Assessment Report, Spot Assesment</td>
                      <td className="px-4 py-2.5">Free online point assessment eligibility calculator submissions.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">referral</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Referral Client, Employee Referral, External Referral, Partner</td>
                      <td className="px-4 py-2.5">Word-of-mouth client referrals, internal staff leads, and partner affiliates.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">walk_in</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Walk-in Client, Walk-in, Signage / Board</td>
                      <td className="px-4 py-2.5">In-person physical branch visits to Bangalore or Melbourne offices.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">ivr</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">IVR - Google, IVR Facebook, IVR- Website</td>
                      <td className="px-4 py-2.5">Automated telephony IVR inquiries routing to immigration sales desks.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">whatsapp</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">WhatsApp - World Visa, Wati</td>
                      <td className="px-4 py-2.5">Conversational inquiries initiated through WhatsApp Business API and Wati.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-2">2. Standardized Interested Services (29 Discrete Enums)</h3>
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0c1322]">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-900/70 font-semibold text-slate-300">
                    <tr>
                      <th className="px-4 py-2.5">Target InterestedService Enum</th>
                      <th className="px-4 py-2.5">Common Raw Zoho Source Strings</th>
                      <th className="px-4 py-2.5">Service Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">permanent_residency</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Permanent Residency, Canada PR, Australia PR, Immigrate</td>
                      <td className="px-4 py-2.5">Skilled Migration &amp; PR</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">work_permit</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Work Permit, Work</td>
                      <td className="px-4 py-2.5">Employment Migration</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">visit_visa</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Visit Visa, Visitor Visa, Travel</td>
                      <td className="px-4 py-2.5">Short Stay &amp; Tourism</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">job_seeker_visa</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Job Seeker Visa, Job Seeker</td>
                      <td className="px-4 py-2.5">Employment Migration</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">germany_opportunity_card</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Germany Opportunity Card</td>
                      <td className="px-4 py-2.5">Employment Migration</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">national_innovation_visa</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">National Innovation Visa, NIV, Australia GTI</td>
                      <td className="px-4 py-2.5">Global Talent &amp; Innovation</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">business_visitor_visa</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Business Visitor Visa, Business Visa</td>
                      <td className="px-4 py-2.5">Corporate &amp; Commerce</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">australia_partner_visa</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Australia Partner Visa, Partner Visa</td>
                      <td className="px-4 py-2.5">Family &amp; Spousal</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">dependent_spouse</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Dependent Spouse, Spouse Visa</td>
                      <td className="px-4 py-2.5">Family &amp; Spousal</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">student_visa</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Student Visa, Student / Exchange Visa, Study, Study Abroad</td>
                      <td className="px-4 py-2.5">Education &amp; Student</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">australian_student_visa</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Australian Student Visa</td>
                      <td className="px-4 py-2.5">Education &amp; Student</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">australia_parent_visa</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Australia Parent Visa, Parent Visa</td>
                      <td className="px-4 py-2.5">Family &amp; Parent</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">parent_visa_australia_sc804</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Parent Visa (Aged 804), Parent Visa Australia SC804</td>
                      <td className="px-4 py-2.5">Family &amp; Parent</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">parent_visa_rrv</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Parent Visa RRV, Parent Visa (RRV)</td>
                      <td className="px-4 py-2.5">Family &amp; Parent</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">australia_child_visa</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Australia Child Visa, Child Visa</td>
                      <td className="px-4 py-2.5">Family &amp; Child</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">australia_rrv</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Australia RRV, Resident Return Visa, Residential Return Visa</td>
                      <td className="px-4 py-2.5">Resident Return</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">australia_work_holiday_visa</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Australia Work in Holiday Visa, Australia Work &amp; Holiday Visa</td>
                      <td className="px-4 py-2.5">Working Holiday</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">australia_pr_stage_2</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">EOI &amp; Visa Stage 2, Australia PR Stage 2</td>
                      <td className="px-4 py-2.5">Skilled Migration &amp; PR</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">intra_office</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Intra-office Transfer, Intra Office</td>
                      <td className="px-4 py-2.5">Employment Migration</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">partner_of_student_work_visa</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Partner of Student Work Visa</td>
                      <td className="px-4 py-2.5">Education &amp; Spousal</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">sc_403_visa_application</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">SC 403 Visa Application</td>
                      <td className="px-4 py-2.5">Temporary Activity</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">skill_assessment</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Skill Assessment, Skill Assessment Stage</td>
                      <td className="px-4 py-2.5">Assessment &amp; Skills</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">temporary_dependent_visa</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Temporary Dependent Visa</td>
                      <td className="px-4 py-2.5">Family &amp; Dependent</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">uk_global_talent_visa</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">UK Global Talent Visa</td>
                      <td className="px-4 py-2.5">Global Talent &amp; Innovation</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">university_admission</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">University Admission</td>
                      <td className="px-4 py-2.5">Higher Education</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">college_admission</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">College Admission</td>
                      <td className="px-4 py-2.5">Higher Education</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">super_visa</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Super Visa</td>
                      <td className="px-4 py-2.5">Family &amp; Parent (Canada)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">germany_family_reunion_visa</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Germany Family Reunion Visa</td>
                      <td className="px-4 py-2.5">Family Reunion</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">investor_migration</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">Investor Migration</td>
                      <td className="px-4 py-2.5">Business &amp; Investor</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FALLBACK STRATEGY */}
        <section id="fallback-strategy" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-500/20">
              5
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Fallback Strategy</h2>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The Enquiries extraction engine maintains strict zero-exception safety across all fields to guarantee uninterrupted batch processing:
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0c1322]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/70 font-semibold text-slate-300">
                <tr>
                  <th className="px-4 py-2.5">Target Field</th>
                  <th className="px-4 py-2.5">Condition</th>
                  <th className="px-4 py-2.5">Resolution Path</th>
                  <th className="px-4 py-2.5">Final Fallback Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">externalId</td>
                  <td className="px-4 py-2.5">Missing or null <code className="text-slate-300">zoho_id</code></td>
                  <td className="px-4 py-2.5">Direct string assignment</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">&quot;&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">client.email</td>
                  <td className="px-4 py-2.5">Missing, invalid RFC syntax, or empty</td>
                  <td className="px-4 py-2.5">Secondary_Email &rarr; default safeguard</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">&quot;notprovided@gmail.com&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">client.phone</td>
                  <td className="px-4 py-2.5">Missing, non-numeric, or dummy digits</td>
                  <td className="px-4 py-2.5">Mobile / Phone &rarr; default safeguard</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">&quot;+919999999999&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">ownerEmail</td>
                  <td className="px-4 py-2.5">Owner ID missing or not in <code className="text-slate-300">migrated_users</code></td>
                  <td className="px-4 py-2.5">Checks embedded <code className="text-slate-300">Owner.email</code> object</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">interestedService</td>
                  <td className="px-4 py-2.5">All candidates missing, unmapped, or invalid</td>
                  <td className="px-4 py-2.5">Cascade through CRM, Visa Apps, Unified</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">destinationCountry</td>
                  <td className="px-4 py-2.5">All candidates missing, unmapped, or invalid</td>
                  <td className="px-4 py-2.5">Cascade through CRM, Visa Apps, Unified</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">stage</td>
                  <td className="px-4 py-2.5">Any condition</td>
                  <td className="px-4 py-2.5">Hardcoded design constant</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">status</td>
                  <td className="px-4 py-2.5">Any condition</td>
                  <td className="px-4 py-2.5">Hardcoded design constant</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">closure</td>
                  <td className="px-4 py-2.5">Any condition</td>
                  <td className="px-4 py-2.5">Hardcoded design constant</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">source</td>
                  <td className="px-4 py-2.5">Missing, null, unrecognized, or generic form</td>
                  <td className="px-4 py-2.5">Default channel fallback</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">&apos;website&apos;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">sourceDetails</td>
                  <td className="px-4 py-2.5">Missing or whitespace <code className="text-slate-300">Lead_Source</code></td>
                  <td className="px-4 py-2.5">Trimmed string assignment</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">attribution.*</td>
                  <td className="px-4 py-2.5">Missing from both CRM and unified entries</td>
                  <td className="px-4 py-2.5">Nullable field assignment</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">createdAt</td>
                  <td className="px-4 py-2.5">Missing or unparseable <code className="text-slate-300">Created_Time</code></td>
                  <td className="px-4 py-2.5">Unix Epoch UTC</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">&quot;1970-01-01T00:00:00.000Z&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">updatedAt</td>
                  <td className="px-4 py-2.5">Missing or unparseable <code className="text-slate-300">Modified_Time</code></td>
                  <td className="px-4 py-2.5">Falls back to <code className="text-slate-300">Created_Time</code> &rarr; Epoch</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">createdAt value or Epoch</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">modifiedAt</td>
                  <td className="px-4 py-2.5">Missing or unparseable <code className="text-slate-300">Modified_Time</code></td>
                  <td className="px-4 py-2.5">Falls back to <code className="text-slate-300">Created_Time</code> &rarr; Epoch</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">createdAt value or Epoch</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">createdById</td>
                  <td className="px-4 py-2.5">Missing <code className="text-slate-300">_zoho_created_by_id</code></td>
                  <td className="px-4 py-2.5">Checks embedded <code className="text-slate-300">Created_By.id</code></td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">createdByEmail</td>
                  <td className="px-4 py-2.5">Creator ID not found in <code className="text-slate-300">migrated_users</code></td>
                  <td className="px-4 py-2.5">Checks embedded <code className="text-slate-300">Created_By.email</code></td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">modifiedById</td>
                  <td className="px-4 py-2.5">Missing <code className="text-slate-300">_zoho_modified_by_id</code></td>
                  <td className="px-4 py-2.5">Checks embedded <code className="text-slate-300">Modified_By.id</code></td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">notes</td>
                  <td className="px-4 py-2.5">No matching notes for record ID</td>
                  <td className="px-4 py-2.5">Empty array</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">[]</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">calls</td>
                  <td className="px-4 py-2.5">No matching calls for record ID</td>
                  <td className="px-4 py-2.5">Empty array</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">[]</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">tasks</td>
                  <td className="px-4 py-2.5">No matching tasks for record ID</td>
                  <td className="px-4 py-2.5">Empty array</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">[]</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">meetings</td>
                  <td className="px-4 py-2.5">No matching events for record ID</td>
                  <td className="px-4 py-2.5">Empty array</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">[]</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">attachments</td>
                  <td className="px-4 py-2.5">No matching attachments for record ID</td>
                  <td className="px-4 py-2.5">Empty array</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">[]</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">attachments[].url</td>
                  <td className="px-4 py-2.5">Missing <code className="text-slate-300">r2_key</code> or presign error</td>
                  <td className="px-4 py-2.5">Falls back to static <code className="text-slate-300">r2_download_url</code> / <code className="text-slate-300">r2_preview_url</code></td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">&quot;&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">invoices</td>
                  <td className="px-4 py-2.5">Any condition</td>
                  <td className="px-4 py-2.5">Hardcoded design constant</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">[]</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. KEY EDGE CASES */}
        <section id="key-notes" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-500/20">
              6
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Key Edge Cases</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                Lead vs. Contact Collection Bifurcation
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Zoho CRM maintains distinct entities for raw unverified prospects (<code className="text-sky-300">migrated_leads</code>) and converted clients (<code className="text-sky-300">migrated_contacts</code>). The mandatory query parameter <code className="text-sky-300 font-mono">type=leads|contacts</code> ensures callers explicitly target the desired collection while maintaining identical output schemas and child relation aggregations.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                Attribution Proximity Matching
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                When a user has multiple website form fills, multiple matching records exist in <code className="text-sky-300">unified_entries</code>. Rather than picking an arbitrary record, the algorithm calculates the absolute timestamp delta between the unified entry and the CRM record creation time, binding attribution to the specific web session that generated the enquiry.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                Cross-Module Service &amp; Country Fallback
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                In many legacy CRM entries, consultants neglected to record the service or country on the main lead card, recording them only inside operational visa files. The engine joins related <code className="text-sky-300">migrated_visa_applications</code>, cascading to <code className="text-slate-200">Qualified_Country</code>, <code className="text-slate-200">Application_Stage</code>, and <code className="text-slate-200">Selected_Visa_Type</code>.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                Hardcoded Stage, Status &amp; Closure
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fields <code className="text-slate-200 font-mono">stage</code>, <code className="text-slate-200 font-mono">status</code>, and <code className="text-slate-200 font-mono">closure</code> are hardcoded to <code className="text-slate-400 font-mono">null</code>. This intentional contract decouples the migration payload from chaotic Zoho CRM pipeline stages and allows destination CRM systems to initialize their own state machines.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                Dynamic Cloudflare R2 Presigned URLs
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Attachments stored in Cloudflare R2 object storage require secure, signed access. The service signs time-limited S3 download URLs in parallel during query execution, ensuring all files are instantly accessible without exposing storage buckets to public traffic.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                Zero-Record Lookup Short-Circuit
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                When a paginated query reaches an offset with no records, the service returns immediately with <code className="text-slate-200 font-mono">&#123; data: [], total, page, limit, hasMore: false &#125;</code>, bypassing all secondary MongoDB batch queries and R2 cryptographic signing operations.
              </p>
            </div>
          </div>
        </section>

        {/* 7. RESPONSE REFERENCE */}
        <section id="response-reference" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-500/20">
              7
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Response Reference</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">TypeScript Interfaces</h3>
              <CodeBlock
                language="typescript"
                code={`export type EnquiryType = 'leads' | 'contacts';

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
  email: string;                       // Normalized email (fallback: notprovided@gmail.com)
  phone: string;                       // E.164 phone (fallback: +919999999999)
}

export interface EnquiryAttributionDto {
  campaignName: string | null;         // Marketing campaign name
  adGroupName: string | null;          // Ad set / ad group name
  adName: string | null;               // Creative / ad name
  gclid: string | null;                // Google Click Identifier
  utmSource: string | null;            // UTM Lead Source
  utmMedium: string | null;            // UTM Medium (e.g. cpc, paid_social)
  utmCampaign: string | null;          // UTM Campaign name
  utmTerm: string | null;              // UTM Search Term
  utmContent: string | null;           // UTM Content variant
  facebookLeadId: string | null;       // Meta Instant Form Lead ID
  fbc: string | null;                  // Meta Click ID
  fbp: string | null;                  // Meta Browser ID
}

export interface EnquiryItemDto {
  externalId: string;                  // Original Zoho Lead/Contact ID (zoho_id)
  client: EnquiryClientDto;            // Normalized client contact info
  ownerEmail: string | null;           // Assigned CRM staff email
  interestedService: InterestedService | null; // Normalized interested visa service
  destinationCountry: string | null;   // Target migration destination country
  stage: null;                         // Hardcoded null
  status: null;                        // Hardcoded null
  closure: null;                       // Hardcoded null
  source: EnquirySource;               // Normalized acquisition channel
  sourceDetails: string | null;        // Original Zoho Lead_Source value
  attribution: EnquiryAttributionDto;  // Marketing campaign attribution
  createdAt: string;                   // UTC ISO 8601 creation timestamp
  updatedAt: string;                   // UTC ISO 8601 update timestamp
  createdById: string | null;          // Zoho ID of creator
  createdByEmail: string | null;       // Resolved email of creator
  modifiedAt: string;                  // UTC ISO 8601 modification timestamp
  modifiedById: string | null;         // Zoho ID of modifier
  notes: NoteItemDto[];                // Related notes list
  calls: CallItemDto[];                // Related phone calls list
  tasks: TaskItemDto[];                // Related tasks list
  meetings: MeetingItemDto[];          // Related consultation meetings list
  attachments: AttachmentItemDto[];    // Related files with presigned R2 URLs
  invoices: unknown[];                 // Empty placeholder array
}

export interface EnquiriesResponseDto {
  data: EnquiryItemDto[];              // Array of paginated enquiries
  total: number;                       // Total matching records in collection
  page: number;                        // Current page number (1-indexed)
  limit: number;                       // Records requested per page
  hasMore: boolean;                    // true if page * limit < total
}`}
              />
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Example JSON Response</h3>
              <CodeBlock
                language="json"
                code={`{
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
          "body": "Initial Consultation:- Candidate has 65 points for Australia Subclass 189. Recommended PTE coaching.",
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
          "title": "Collect Resume and Degree Certificates",
          "description": "Collect verified degree transcripts and detailed resume for skills assessment.",
          "status": "completed",
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
  "limit": 200,
  "hasMore": true
}`}
              />
            </div>
          </div>
        </section>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
}
