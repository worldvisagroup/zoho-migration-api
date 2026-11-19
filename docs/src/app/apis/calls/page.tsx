import React from 'react';
import { MethodBadge } from '../../../components/MethodBadge';
import { CodeBlock } from '../../../components/CodeBlock';
import { TableOfContents } from '../../../components/TableOfContents';
import { PhoneCall, Database, CheckCircle2 } from 'lucide-react';

const tocItems = [
  { id: 'overview', title: '1. API Overview' },
  { id: 'field-mapping', title: '2. Zoho Field Mapping' },
  { id: 'transformation-logic', title: '3. Field Transformation Logic' },
  { id: 'enums-and-values', title: '4. Zoho Enums & Values' },
  { id: 'fallback-strategy', title: '5. Fallback Strategy' },
  { id: 'key-notes', title: '6. Key Edge Cases' },
  { id: 'response-reference', title: '7. Response Reference' },
];

export default function CallsApiDocPage() {
  return (
    <div className="flex gap-10">
      <div className="flex-1 min-w-0 space-y-10 pb-20">
        {/* Header */}
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 border border-sky-500/20">
              <PhoneCall className="h-3.5 w-3.5" />
              <span>CRM Telephony Module</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" />
              Production Ready
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">Calls API</h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            Technical mapping and extraction reference for migrating call logs and telephony activities from Zoho CRM and Zoho PhoneBridge (<code className="text-sky-300 font-mono">migrated_calls</code>) with polymorphic parallel customer phone resolution and audio recording metadata.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-1.5 font-mono text-xs text-slate-200">
              <MethodBadge method="GET" />
              <span className="font-semibold text-white">/api/v1/calls</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Database className="h-3.5 w-3.5 text-slate-400" />
              <span>Collection:</span>
              <code className="text-sky-300 font-mono">migrated_calls</code>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-300 font-mono">
              <span>Header: x-api-key</span>
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
            The Calls API extracts call activity logs and telephony history from <code className="text-sky-300 font-mono">migrated_calls</code> (migrated from the Zoho CRM Calls module and Zoho PhoneBridge integration). It normalizes telephony direction (<code className="font-mono text-slate-200">inbound</code>, <code className="font-mono text-slate-200">outbound</code>) and call outcomes (<code className="font-mono text-slate-200">answered</code>, <code className="font-mono text-slate-200">missed</code>, <code className="font-mono text-slate-200">cancelled</code>, <code className="font-mono text-slate-200">busy</code>), dynamically resolves customer phone numbers across 5 polymorphic parent record types (Lead, Contact, Deal, Visa Application, Spouse Skill Assessment) using single-pass parallel batching, normalizes agent and creator/modifier email addresses from <code className="text-sky-300 font-mono">migrated_users</code>, extracts PhoneBridge voice recording URLs, and returns paginated results sorted chronologically.
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0c1322]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/70 font-semibold text-slate-300">
                <tr>
                  <th className="px-4 py-2.5">Query Parameter</th>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">Default</th>
                  <th className="px-4 py-2.5">Validation Rules</th>
                  <th className="px-4 py-2.5">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">zohoLeadId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsString()</td>
                  <td className="px-4 py-2.5">Filter calls linked to a specific Zoho Lead (<code className="text-slate-300">_zoho_lead_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">zohoContactId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsString()</td>
                  <td className="px-4 py-2.5">Filter calls linked to a specific Zoho Contact (<code className="text-slate-300">_zoho_contact_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">zohoDealId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsString()</td>
                  <td className="px-4 py-2.5">Filter calls linked to a specific Zoho Deal (<code className="text-slate-300">_zoho_deal_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">visaApplicationId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsString()</td>
                  <td className="px-4 py-2.5">Filter calls linked to a Visa Application (<code className="text-slate-300">_zoho_visa_application_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">spouseSkillAssessmentId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsString()</td>
                  <td className="px-4 py-2.5">Filter calls linked to a Spouse Skill Assessment (<code className="text-slate-300">_zoho_spouse_skill_assessment_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">type</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">enum</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsIn(CALL_PARENT_TYPES)</td>
                  <td className="px-4 py-2.5">Filter by parent entity type (<code className="text-slate-300">parent_entity_type</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">page</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">number</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">1</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsInt(), @Min(1)</td>
                  <td className="px-4 py-2.5">1-indexed page number for pagination.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">limit</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">number</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">200</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsInt(), @Min(1), @Max(1000)</td>
                  <td className="px-4 py-2.5">Number of records per page (capped at 1,000).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">from</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsISO8601()</td>
                  <td className="px-4 py-2.5">Inclusive start date filter applied to Zoho <code className="text-slate-300">Created_Time</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">to</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsISO8601()</td>
                  <td className="px-4 py-2.5">Inclusive end date filter applied to Zoho <code className="text-slate-300">Created_Time</code>.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-xs text-slate-400 flex flex-wrap gap-4 pt-1">
            <div>
              <span className="text-slate-500">Sort Order:</span>{' '}
              <span className="font-mono text-amber-300 font-semibold">Created_Time ASC (1)</span> — Chronological order (oldest to newest)
            </div>
            <div>
              <span className="text-slate-500">Pagination Flag:</span>{' '}
              <code className="text-slate-300 font-mono">hasMore = page * pageSize &lt; total</code>
            </div>
            <div>
              <span className="text-slate-500">Envelope:</span>{' '}
              <code className="text-emerald-400 font-mono">@BypassTransform()</code> direct migration response
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
            Direct mapping from MongoDB <code className="font-mono text-sky-300">migrated_calls</code> and related parent collections to the target response model.
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
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">externalId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">zoho_id</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Direct 1:1 copy of Zoho call unique identifier.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">parentType</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">parent_entity_type</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Standardized parent entity type (<code className="font-mono text-slate-200">lead, contact, deal, visa_application, spouse_skill_assessment, task, event, signed_document</code>), or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">parentZohoId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_*_id</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Original Zoho ID of the linked parent record (<code className="font-mono text-slate-200">_zoho_lead_id, _zoho_contact_id</code>, etc.), or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">direction</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">CallDirection</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Call_Type</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Picklist</td>
                  <td className="px-4 py-2.5">Mapped to <code className="text-slate-200 font-mono">&apos;inbound&apos;</code> or <code className="text-slate-200 font-mono">&apos;outbound&apos;</code>. Missed calls map to <code className="text-slate-200 font-mono">&apos;inbound&apos;</code>. Defaults to <code className="text-slate-200 font-mono">&apos;outbound&apos;</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">status</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">CallStatus</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Call_Duration_in_seconds, Outgoing_Call_Status, Call_Result</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Number, Picklists</td>
                  <td className="px-4 py-2.5">Evaluates talk time first (<code className="text-emerald-400 font-mono">&gt; 0</code> &rarr; <code className="text-emerald-400 font-mono">&apos;answered&apos;</code>), then checks cancelled and busy indicators, defaulting to <code className="text-amber-300 font-mono">&apos;missed&apos;</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">customerPhone</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Parent Entity &rarr; Phone, Mobile, Country_Code</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Resolved in parallel across Lead, Contact, Deal, Visa Application, or Spouse Assessment. Normalized to international E.164. Fallback: <code className="text-amber-300 font-mono">+919999999999</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">agentEmail</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_owner_id &rarr; migrated_users.email</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Lookup</td>
                  <td className="px-4 py-2.5">Resolved agent email address via single-pass batch lookup, or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">startedAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string (ISO 8601)</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Call_Start_Time</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Datetime</td>
                  <td className="px-4 py-2.5">Normalized to UTC ISO 8601 string. Fallback: <code className="text-amber-300 font-mono">1970-01-01T00:00:00.000Z</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">durationSeconds</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">number</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Call_Duration_in_seconds</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Integer</td>
                  <td className="px-4 py-2.5">Parsed integer seconds &ge; 0 (<code className="font-mono text-slate-200">Math.max(0, Math.floor(val))</code>). Defaults to <code className="font-mono text-slate-200">0</code> if null or NaN.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">notes</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Description</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Textarea</td>
                  <td className="px-4 py-2.5">Trimmed plain text notes. Returns <code className="text-slate-400 font-mono">null</code> if empty or missing.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">followUpAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">When_To_Make_The_Call</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Datetime</td>
                  <td className="px-4 py-2.5">Scheduled follow-up call timestamp normalized to UTC ISO 8601, or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">recording</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">CallRecordingDto | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Voice_Recording__s</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Website URL</td>
                  <td className="px-4 py-2.5">Parsed into <code className="font-mono text-slate-200">{`{ url, mimeType: '', sizeBytes: '' }`}</code> if URL present; otherwise <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">createdByZohoId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_created_by_id</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Cleaned Zoho user ID of the creator, or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">createdByEmail</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_created_by_id &rarr; migrated_users.email</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Lookup</td>
                  <td className="px-4 py-2.5">Resolved creator email address via batch lookup, or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">modifiedByZohoId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_modified_by_id</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Cleaned Zoho user ID of the modifier, or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">modifiedByEmail</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_modified_by_id &rarr; migrated_users.email</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Lookup</td>
                  <td className="px-4 py-2.5">Resolved modifier email address via batch lookup, or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">createdAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string (ISO 8601)</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Created_Time</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Datetime</td>
                  <td className="px-4 py-2.5">Normalized to UTC ISO 8601. Fallback: <code className="text-amber-300 font-mono">1970-01-01T00:00:00.000Z</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">modifiedAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string (ISO 8601)</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Modified_Time, Created_Time</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Datetime</td>
                  <td className="px-4 py-2.5">Primary <code className="font-mono">Modified_Time</code>, falls back to <code className="font-mono">Created_Time</code>. Never null.</td>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Direction Resolution */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">1. Call Direction Normalization</span>
              <p className="text-slate-300 leading-relaxed">
                Uses <code className="font-mono text-sky-300">resolveDirection(Call_Type)</code>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li><strong className="text-emerald-400">Inbound:</strong> <code className="font-mono text-slate-200">&apos;inbound&apos;</code> &rarr; <code className="font-mono text-emerald-400">&apos;inbound&apos;</code>.</li>
                <li><strong className="text-emerald-400">Missed:</strong> <code className="font-mono text-slate-200">&apos;missed&apos;</code> &rarr; <code className="font-mono text-emerald-400">&apos;inbound&apos;</code> (incoming customer call that went unanswered).</li>
                <li><strong className="text-sky-400">Outbound:</strong> <code className="font-mono text-slate-200">&apos;outbound&apos;</code> &rarr; <code className="font-mono text-sky-400">&apos;outbound&apos;</code>.</li>
                <li><strong>Fallback:</strong> Unstated, empty, or null &rarr; <code className="font-mono text-sky-400">&apos;outbound&apos;</code> (the default telephony workflow in CRM).</li>
              </ul>
            </div>

            {/* Status Resolution */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">2. Deterministic Status Ladder</span>
              <p className="text-slate-300 leading-relaxed">
                Uses <code className="font-mono text-purple-300">resolveStatus(call)</code>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li><strong className="text-emerald-400">Talk Time Check:</strong> If <code className="font-mono text-slate-200">Call_Duration_in_seconds &gt; 0</code>, call connected &rarr; <code className="font-mono text-emerald-400">&apos;answered&apos;</code>.</li>
                <li><strong className="text-rose-400">Cancelled Check:</strong> <code className="font-mono text-slate-200">Outgoing_Call_Status === &apos;Cancelled&apos;</code> or result contains <code className="font-mono text-slate-200">&quot;cancelled&quot;</code> &rarr; <code className="font-mono text-rose-400">&apos;cancelled&apos;</code>.</li>
                <li><strong className="text-amber-400">Busy Check:</strong> Result contains <code className="font-mono text-slate-200">&quot;busy&quot;</code>, <code className="font-mono text-slate-200">&quot;reachable&quot;</code>, or <code className="font-mono text-slate-200">&quot;no response/busy&quot;</code> &rarr; <code className="font-mono text-amber-400">&apos;busy&apos;</code>.</li>
                <li><strong className="text-slate-300">Missed Check:</strong> All other outcomes (<code className="font-mono text-slate-200">&apos;Ringing Not Answering&apos;</code>, <code className="font-mono text-slate-200">&apos;RNR-3&apos;</code>, null) &rarr; <code className="font-mono text-slate-400">&apos;missed&apos;</code>.</li>
              </ul>
            </div>

            {/* Customer Phone Batching */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">3. Polymorphic Parallel Phone Resolution</span>
              <p className="text-slate-300 leading-relaxed">
                Solves N+1 query bottlenecks across 5 parent entity models:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Collects distinct parent IDs into 5 Sets: Lead, Contact, Deal, Visa Application, Spouse Assessment.</li>
                <li>Executes parallel batch queries using <code className="font-mono text-sky-300">Promise.all()</code>.</li>
                <li>Cascades Deal/Visa App lookups to linked Contact (<code className="font-mono text-slate-200">_zoho_contact_id</code>) if needed.</li>
                <li>Normalizes to international E.164 via <code className="font-mono text-sky-300">libphonenumber-js</code>.</li>
                <li>Falls back to <code className="font-mono text-amber-300">+919999999999</code> if unresolvable.</li>
              </ul>
            </div>

            {/* Batch Email Resolution */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">4. Single-Pass Staff Email Batching</span>
              <p className="text-slate-300 leading-relaxed">
                Resolves agent and creator/modifier emails in a single database round-trip:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Collects unique user IDs from <code className="font-mono text-slate-300">_zoho_owner_id</code>, <code className="font-mono text-slate-300">_zoho_created_by_id</code>, and <code className="font-mono text-slate-300">_zoho_modified_by_id</code>.</li>
                <li>Executes a single indexed query: <code className="font-mono text-sky-300">{`userModel.find({ zoho_id: { $in: uniqueUserIds } })`}</code>.</li>
                <li>Sanitizes, lowercases, and maps each email in memory for instant DTO projection.</li>
              </ul>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Direction Mapping */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">Call Direction Mapping Matrix</span>
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c1322]">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-900/70 font-semibold text-slate-300">
                    <tr>
                      <th className="px-3.5 py-2">Source Call_Type</th>
                      <th className="px-3.5 py-2">Mapped Direction</th>
                      <th className="px-3.5 py-2">Justification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-sky-300">&apos;Inbound&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-emerald-400 font-bold">&apos;inbound&apos;</td>
                      <td className="px-3.5 py-2">Customer originated call</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-sky-300">&apos;Missed&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-emerald-400 font-bold">&apos;inbound&apos;</td>
                      <td className="px-3.5 py-2">Incoming call that went unanswered</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-sky-300">&apos;Outbound&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-sky-400 font-bold">&apos;outbound&apos;</td>
                      <td className="px-3.5 py-2">Agent originated telecalling</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-slate-500">null / empty / other</td>
                      <td className="px-3.5 py-2 font-mono text-sky-400 font-bold">&apos;outbound&apos;</td>
                      <td className="px-3.5 py-2">Default fallback for telecalling</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status Resolution Matrix */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">Call Status Resolution Matrix</span>
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c1322]">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-900/70 font-semibold text-slate-300">
                    <tr>
                      <th className="px-3 py-2">Duration</th>
                      <th className="px-3 py-2">Outgoing Status / Result</th>
                      <th className="px-3 py-2">Mapped Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    <tr>
                      <td className="px-3 py-2 font-mono text-emerald-400">&gt; 0 sec</td>
                      <td className="px-3 py-2 font-mono text-slate-400">Any status / result</td>
                      <td className="px-3 py-2 font-mono text-emerald-400 font-bold">&apos;answered&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono text-slate-400">&lt;= 0 / null</td>
                      <td className="px-3 py-2 font-mono text-rose-300">&apos;Cancelled&apos;</td>
                      <td className="px-3 py-2 font-mono text-rose-400 font-bold">&apos;cancelled&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono text-slate-400">&lt;= 0 / null</td>
                      <td className="px-3 py-2 font-mono text-amber-300">&apos;No response/Busy&apos;, &apos;Number Not Reachable&apos;</td>
                      <td className="px-3 py-2 font-mono text-amber-400 font-bold">&apos;busy&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono text-slate-400">&lt;= 0 / null</td>
                      <td className="px-3 py-2 font-mono text-slate-400">&apos;Ringing Not Answering&apos;, &apos;RNR-3&apos;, null</td>
                      <td className="px-3 py-2 font-mono text-slate-400 font-bold">&apos;missed&apos;</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-300 block mb-1">Supported Parent Entity Types (<code className="font-mono text-sky-300">type</code> query param)</span>
            <div className="flex flex-wrap gap-1">
              {['lead', 'contact', 'deal', 'visa_application', 'spouse_skill_assessment', 'task', 'event', 'signed_document'].map(t => (
                <span key={t} className="rounded bg-sky-500/10 px-2 py-0.5 font-mono text-[11px] text-sky-300 border border-sky-500/20">
                  {t}
                </span>
              ))}
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
            Deterministic fallback rules applied when source database fields are null, missing, or corrupt.
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0c1322]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/70 font-semibold text-slate-300">
                <tr>
                  <th className="px-4 py-2.5">Field</th>
                  <th className="px-4 py-2.5">Condition</th>
                  <th className="px-4 py-2.5">Resolution Path</th>
                  <th className="px-4 py-2.5">Final Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">externalId</td>
                  <td className="px-4 py-2.5">Missing or null <code className="font-mono">zoho_id</code></td>
                  <td className="px-4 py-2.5">Empty string assignment</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">&quot;&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">parentType</td>
                  <td className="px-4 py-2.5">Missing or unrecognized <code className="font-mono">parent_entity_type</code></td>
                  <td className="px-4 py-2.5">Unresolved entity</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">parentZohoId</td>
                  <td className="px-4 py-2.5">Missing ID in matched <code className="font-mono">_zoho_*_id</code></td>
                  <td className="px-4 py-2.5">Null fallback</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">direction</td>
                  <td className="px-4 py-2.5">Missing, empty, or unmapped <code className="font-mono">Call_Type</code></td>
                  <td className="px-4 py-2.5">Standard telecalling direction assumption</td>
                  <td className="px-4 py-2.5 font-mono text-sky-400 font-bold">&quot;outbound&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">status</td>
                  <td className="px-4 py-2.5">Missing duration, status, and result</td>
                  <td className="px-4 py-2.5">Unanswered assumption</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400 font-bold">&quot;missed&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">customerPhone</td>
                  <td className="px-4 py-2.5">Missing parent entity, empty phone, or invalid syntax</td>
                  <td className="px-4 py-2.5">Deterministic fallback phone number</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300 font-bold">&quot;+919999999999&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">agentEmail</td>
                  <td className="px-4 py-2.5">Owner ID missing or not found in <code className="font-mono">migrated_users</code></td>
                  <td className="px-4 py-2.5">Lookup miss</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">startedAt</td>
                  <td className="px-4 py-2.5">Missing or invalid <code className="font-mono">Call_Start_Time</code></td>
                  <td className="px-4 py-2.5">Unix Epoch UTC</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300 font-bold">&quot;1970-01-01T00:00:00.000Z&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">durationSeconds</td>
                  <td className="px-4 py-2.5">Missing or invalid <code className="font-mono">Call_Duration_in_seconds</code></td>
                  <td className="px-4 py-2.5">Zero duration integer</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300 font-bold">0</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">notes</td>
                  <td className="px-4 py-2.5">Missing or whitespace-only <code className="font-mono">Description</code></td>
                  <td className="px-4 py-2.5">Nullable string assignment</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">followUpAt</td>
                  <td className="px-4 py-2.5">Missing or invalid <code className="font-mono">When_To_Make_The_Call</code></td>
                  <td className="px-4 py-2.5">Nullable ISO timestamp</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">recording</td>
                  <td className="px-4 py-2.5">Missing or whitespace <code className="font-mono">Voice_Recording__s</code></td>
                  <td className="px-4 py-2.5">Nullable recording metadata object</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">createdByEmail</td>
                  <td className="px-4 py-2.5">Creator ID missing or not in <code className="font-mono">migrated_users</code></td>
                  <td className="px-4 py-2.5">Lookup miss</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">createdByZohoId</td>
                  <td className="px-4 py-2.5">Missing or null <code className="font-mono">_zoho_created_by_id</code></td>
                  <td className="px-4 py-2.5">Cleaned nullable string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">createdAt</td>
                  <td className="px-4 py-2.5">Missing/invalid <code className="font-mono">Created_Time</code></td>
                  <td className="px-4 py-2.5">Unix Epoch UTC</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300 font-bold">&quot;1970-01-01T00:00:00.000Z&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">modifiedByEmail</td>
                  <td className="px-4 py-2.5">Modifier ID missing or not in <code className="font-mono">migrated_users</code></td>
                  <td className="px-4 py-2.5">Lookup miss</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">modifiedByZohoId</td>
                  <td className="px-4 py-2.5">Missing or null <code className="font-mono">_zoho_modified_by_id</code></td>
                  <td className="px-4 py-2.5">Cleaned nullable string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">modifiedAt</td>
                  <td className="px-4 py-2.5">Missing or invalid <code className="font-mono">Modified_Time</code></td>
                  <td className="px-4 py-2.5">Falls back to <code className="font-mono">Created_Time</code> &rarr; Epoch</td>
                  <td className="px-4 py-2.5 font-mono text-slate-200">createdAt value or Epoch</td>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-1.5">
              <span className="font-semibold text-white">Missed Calls Classified as Inbound</span>
              <p className="text-slate-300 leading-relaxed">
                In Zoho CRM PhoneBridge, a call logged with <code className="font-mono text-sky-300">Call_Type: &quot;Missed&quot;</code> indicates an incoming customer call that rang until timeout without agent pickup. The engine properly normalizes direction to <code className="font-mono text-emerald-400">&apos;inbound&apos;</code> and status to <code className="font-mono text-slate-400">&apos;missed&apos;</code>.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-1.5">
              <span className="font-semibold text-white">Talk Time Overrules Status Picklists</span>
              <p className="text-slate-300 leading-relaxed">
                Human agents often leave call status or result dropdowns set to <em>&quot;Busy&quot;</em> or <em>&quot;Ringing Not Answering&quot;</em>, yet PhoneBridge recorded actual talk time (<code className="font-mono text-emerald-400">Call_Duration_in_seconds &gt; 0</code>). The engine treats duration &gt; 0 as authoritative ground truth, overriding negative picklists to <code className="font-mono text-emerald-400">&apos;answered&apos;</code>.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-1.5">
              <span className="font-semibold text-white">Polymorphic Parent Entity Cascade</span>
              <p className="text-slate-300 leading-relaxed">
                Calls attach to 5 different entity types. The engine resolves customer phone numbers by checking Lead &rarr; Contact &rarr; Deal (with Contact fallback) &rarr; Visa Application (with Contact fallback) &rarr; Spouse Assessment, defaulting to <code className="font-mono text-amber-300">+919999999999</code> to prevent downstream dialer crashes.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-1.5">
              <span className="font-semibold text-white">PhoneBridge Voice Recording URLs</span>
              <p className="text-slate-300 leading-relaxed">
                PhoneBridge stores audio URLs directly in <code className="font-mono text-sky-300">Voice_Recording__s</code>. Since MIME types and byte sizes are not emitted by Zoho CRM, the DTO returns empty strings (<code className="font-mono text-slate-300">&quot;&quot;</code>) to fulfill contract requirements without fabricating artificial metadata.
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

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">TypeScript Schema</h3>
            <CodeBlock
              language="typescript"
              title="CallItemDto & CallsResponseDto"
              code={`export type CallDirection = 'inbound' | 'outbound';
export type CallStatus = 'answered' | 'missed' | 'cancelled' | 'busy';

export interface CallRecordingDto {
  url: string;        // Audio recording URL from Zoho PhoneBridge
  mimeType: string;   // MIME type (empty string if unstated)
  sizeBytes: string;  // Size in bytes (empty string if unstated)
}

export interface CallItemDto {
  externalId: string;                 // Original Zoho ID (zoho_id)
  parentType: string | null;          // Type of parent record (lead, contact, deal, etc.)
  parentZohoId: string | null;        // Original Zoho ID of parent record
  direction: CallDirection;           // 'inbound' | 'outbound'
  status: CallStatus;                 // 'answered' | 'missed' | 'cancelled' | 'busy'
  customerPhone: string;              // Normalized international phone (+91XXXXXXXXXX)
  agentEmail: string | null;          // Assigned staff email address or null
  startedAt: string;                  // Call start timestamp in UTC ISO 8601
  durationSeconds: number;            // Duration in seconds (integer >= 0)
  notes: string | null;               // Description / call notes or null
  followUpAt: string | null;          // Scheduled follow-up timestamp (When_To_Make_The_Call)
  recording: CallRecordingDto | null; // Audio recording object or null
  createdByEmail: string | null;      // Creator email address or null
  createdByZohoId: string | null;     // Creator Zoho user ID or null
  createdAt: string;                  // Zoho Created_Time in UTC ISO 8601
  modifiedByEmail: string | null;     // Modifier email address or null
  modifiedByZohoId: string | null;    // Modifier Zoho user ID or null
  modifiedAt: string;                 // Zoho Modified_Time in UTC ISO 8601
}

export interface CallsResponseDto {
  data: CallItemDto[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}`}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Example Response (200 OK)</h3>
            <CodeBlock
              language="json"
              title="GET /api/v1/calls?page=1&limit=3"
              code={`{
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
  "pageSize": 3,
  "hasMore": true
}`}
            />
          </div>
        </section>
      </div>

      {/* Table of Contents */}
      <TableOfContents items={tocItems} />
    </div>
  );
}

