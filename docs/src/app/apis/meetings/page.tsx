import React from 'react';
import { MethodBadge } from '../../../components/MethodBadge';
import { CodeBlock } from '../../../components/CodeBlock';
import { TableOfContents } from '../../../components/TableOfContents';
import { Calendar, Database, CheckCircle2 } from 'lucide-react';

const tocItems = [
  { id: 'overview', title: '1. API Overview' },
  { id: 'field-mapping', title: '2. Zoho Field Mapping' },
  { id: 'transformation-logic', title: '3. Field Transformation Logic' },
  { id: 'enums-and-values', title: '4. Zoho Enums & Values' },
  { id: 'fallback-strategy', title: '5. Fallback Strategy' },
  { id: 'key-notes', title: '6. Key Edge Cases' },
  { id: 'response-reference', title: '7. Response Reference' },
];

export default function MeetingsApiDocPage() {
  return (
    <div className="flex gap-10">
      <div className="flex-1 min-w-0 space-y-10 pb-20">
        {/* Header */}
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 border border-sky-500/20">
              <Calendar className="h-3.5 w-3.5" />
              <span>CRM Activities Module</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" />
              Production Ready
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">Meetings / Events API</h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            Technical mapping and extraction reference for migrating consultations, calendar events, and appointments from Zoho CRM and Zoho Bookings (<code className="text-sky-300 font-mono">migrated_events</code>) with multi-attendee classification and Cloudflare R2 presigned recording access.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-1.5 font-mono text-xs text-slate-200">
              <MethodBadge method="GET" />
              <span className="font-semibold text-white">/api/v1/meetings</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Database className="h-3.5 w-3.5 text-slate-400" />
              <span>Collections:</span>
              <code className="text-sky-300 font-mono">migrated_events</code>
              <span className="text-slate-500">&amp;</span>
              <code className="text-sky-300 font-mono">migrated_meeting_recordings</code>
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
            The Meetings API extracts consultation meetings, client appointments, and operational events from <code className="text-sky-300 font-mono">migrated_events</code> (migrated from Zoho CRM Events/Meetings and Zoho Bookings). It normalizes event statuses (<code className="font-mono text-slate-200">scheduled</code>, <code className="font-mono text-slate-200">ended</code>, <code className="font-mono text-slate-200">cancelled</code>), resolves attendees and staff hosts with automatic fallback to linked customer records (Leads, Contacts, Deals, Visa Applications, Spouse Skill Assessments), generates fresh Cloudflare R2 presigned download URLs for meeting recordings from <code className="text-sky-300 font-mono">migrated_meeting_recordings</code>, and returns paginated results ordered chronologically.
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
                  <td className="px-4 py-2.5">Filter meetings linked to a specific Zoho Lead (<code className="text-slate-300">_zoho_lead_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">zohoContactId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsString()</td>
                  <td className="px-4 py-2.5">Filter meetings linked to a specific Zoho Contact (<code className="text-slate-300">_zoho_contact_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">zohoDealId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsString()</td>
                  <td className="px-4 py-2.5">Filter meetings linked to a specific Zoho Deal (<code className="text-slate-300">_zoho_deal_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">visaApplicationId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsString()</td>
                  <td className="px-4 py-2.5">Filter meetings linked to a Visa Application (<code className="text-slate-300">_zoho_visa_application_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">spouseSkillAssessmentId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsString()</td>
                  <td className="px-4 py-2.5">Filter meetings linked to a Spouse Skill Assessment (<code className="text-slate-300">_zoho_spouse_skill_assessment_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">type</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">enum</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsIn(MEETING_PARENT_TYPES)</td>
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
              <span className="font-mono text-amber-300 font-semibold">Created_Time ASC (1), _id ASC (1)</span> — Stable chronological order
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
            Direct mapping from MongoDB <code className="font-mono text-sky-300">migrated_events</code>, <code className="font-mono text-sky-300">migrated_meeting_recordings</code>, and related parent collections to the target response model.
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
                  <td className="px-4 py-2.5">Direct 1:1 copy of Zoho event unique identifier.</td>
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
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">title</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Event_Title</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Trimmed event subject. Defaults to empty string <code className="text-slate-300 font-mono">&quot;&quot;</code> if missing.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">description</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Description</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Textarea</td>
                  <td className="px-4 py-2.5">Trimmed plain text. Returns <code className="text-slate-400 font-mono">null</code> if empty or missing.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">status</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">TargetMeetingStatus</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Meeting_Status, is_closed</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Picklist, Boolean</td>
                  <td className="px-4 py-2.5">Normalized to <code className="text-slate-200 font-mono">&apos;scheduled&apos;</code>, <code className="text-slate-200 font-mono">&apos;ended&apos;</code>, or <code className="text-slate-200 font-mono">&apos;cancelled&apos;</code> via status ladder.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">scheduledAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string (ISO 8601)</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Start_DateTime</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Datetime</td>
                  <td className="px-4 py-2.5">Normalized to UTC ISO 8601 scheduled start timestamp.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">startedAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Start_DateTime, status</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Datetime, Computed</td>
                  <td className="px-4 py-2.5">
                    <strong>If status === &apos;ended&apos;:</strong> falls back to <code className="font-mono text-slate-200">scheduledAt</code>.<br />
                    <strong>If status === &apos;scheduled&apos; or &apos;cancelled&apos;:</strong> strictly <code className="font-mono text-slate-400">null</code>.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">endedAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string (ISO 8601)</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">End_DateTime</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Datetime</td>
                  <td className="px-4 py-2.5">Normalized to UTC ISO 8601 end timestamp.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">hostEmail</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_owner_id &rarr; migrated_users.email</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Lookup</td>
                  <td className="px-4 py-2.5">Resolved staff host email via batch lookup, or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">hostId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_owner_id</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Cleaned Zoho user ID of the staff host, or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">participants</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">MeetingParticipantDto[]</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Host + Participants + Parent Lookup</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Array / Lookup</td>
                  <td className="px-4 py-2.5">Deduplicated attendee list with <code className="font-mono text-slate-200">email</code>, <code className="font-mono text-slate-200">name</code>, and <code className="font-mono text-slate-200">type</code> (<code className="font-mono text-slate-200">&apos;staff&apos;</code> or <code className="font-mono text-slate-200">&apos;guest&apos;</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">recording</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">MeetingRecordingDto | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">migrated_meeting_recordings &rarr; R2</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Lookup / Presigned</td>
                  <td className="px-4 py-2.5">Cloudflare R2 presigned download URL, MIME type, and file size in bytes, or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">createdById</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_created_by_id</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Cleaned Zoho user ID of creator, or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">createdByEmail</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_created_by_id &rarr; migrated_users.email</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Lookup</td>
                  <td className="px-4 py-2.5">Resolved creator email address via batch lookup, or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">modifiedById</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_modified_by_id</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Cleaned Zoho user ID of last modifier, or <code className="text-slate-400 font-mono">null</code>.</td>
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
            {/* Status Ladder */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">1. Meeting Status Normalization</span>
              <p className="text-slate-300 leading-relaxed">
                Uses <code className="font-mono text-sky-300">normalizeMeetingStatus(Meeting_Status, is_closed)</code>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li><strong className="text-emerald-400">Attended:</strong> <code className="font-mono text-slate-200">&apos;Attended&apos;</code> &rarr; <code className="font-mono text-emerald-400">&apos;ended&apos;</code>.</li>
                <li><strong className="text-rose-400">Cancelled / Postponed:</strong> <code className="font-mono text-slate-200">&apos;Escaped&apos;</code>, <code className="font-mono text-slate-200">&apos;Postponed&apos;</code>, <code className="font-mono text-slate-200">&apos;Cancelled&apos;</code> &rarr; <code className="font-mono text-rose-400">&apos;cancelled&apos;</code>.</li>
                <li><strong className="text-sky-400">Unstated &amp; Open:</strong> If missing and <code className="font-mono text-slate-200">is_closed === false</code> &rarr; <code className="font-mono text-sky-400">&apos;scheduled&apos;</code>.</li>
                <li><strong className="text-slate-300">Unstated &amp; Closed:</strong> If missing and <code className="font-mono text-slate-200">is_closed === true</code> &rarr; <code className="font-mono text-emerald-400">&apos;ended&apos;</code>.</li>
              </ul>
            </div>

            {/* startedAt logic */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">2. Actual Start Timestamp Resolution</span>
              <p className="text-slate-300 leading-relaxed">
                Legacy Zoho events do not record discrete dialer join times:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li><strong className="text-emerald-400">Ended Meetings:</strong> When status is <code className="font-mono text-emerald-400">&apos;ended&apos;</code>, <code className="font-mono text-slate-200">startedAt</code> falls back to <code className="font-mono text-slate-200">scheduledAt</code>.</li>
                <li><strong className="text-slate-300">Scheduled / Cancelled:</strong> When status is <code className="font-mono text-sky-400">&apos;scheduled&apos;</code> or <code className="font-mono text-rose-400">&apos;cancelled&apos;</code>, <code className="font-mono text-slate-200">startedAt</code> is strictly <code className="font-mono text-slate-400">null</code>.</li>
                <li>Prevents skewed reporting for meetings that never occurred.</li>
              </ul>
            </div>

            {/* Participants & Customer Fallback */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">3. Multi-Attendee Classification &amp; Fallback</span>
              <p className="text-slate-300 leading-relaxed">
                Resolves internal vs. external attendees with parent record fallback:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li><strong>Host First:</strong> Always includes the staff host (<code className="font-mono text-slate-200">type: &apos;staff&apos;</code>).</li>
                <li><strong>Participants Array:</strong> Maps attendees, tagging staff users (<code className="font-mono text-slate-200">type: &apos;staff&apos;</code>) vs. clients (<code className="font-mono text-slate-200">type: &apos;guest&apos;</code>).</li>
                <li><strong>Customer Fallback:</strong> If &lt; 2 participants or customer missing, resolves the linked Lead, Contact, Deal, or Visa Application and injects them as <code className="font-mono text-slate-200">type: &apos;guest&apos;</code>.</li>
              </ul>
            </div>

            {/* Cloudflare R2 Presigned URLs */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">4. Presigned Cloudflare R2 Recordings</span>
              <p className="text-slate-300 leading-relaxed">
                Dynamic signed URL generation from <code className="font-mono text-sky-300">migrated_meeting_recordings</code>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Matches recordings by <code className="font-mono text-slate-200">zoho_event_id</code> in a single batch query.</li>
                <li>Generates on-the-fly S3-compatible presigned download URLs via <code className="font-mono text-sky-300">R2StorageService</code>.</li>
                <li>Determines MIME types automatically (<code className="font-mono text-slate-200">video/mp4</code>, etc.) and provides byte sizes.</li>
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
            {/* Status mapping */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">Meeting Status Mapping Matrix</span>
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c1322]">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-900/70 font-semibold text-slate-300">
                    <tr>
                      <th className="px-3.5 py-2">Zoho Meeting_Status</th>
                      <th className="px-3.5 py-2">is_closed</th>
                      <th className="px-3.5 py-2">Mapped Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-sky-300">&apos;Attended&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-slate-400">Any</td>
                      <td className="px-3.5 py-2 font-mono text-emerald-400 font-bold">&apos;ended&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-sky-300">&apos;Escaped&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-slate-400">Any</td>
                      <td className="px-3.5 py-2 font-mono text-rose-400 font-bold">&apos;cancelled&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-sky-300">&apos;Postponed&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-slate-400">Any</td>
                      <td className="px-3.5 py-2 font-mono text-rose-400 font-bold">&apos;cancelled&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-sky-300">&apos;Cancelled&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-slate-400">Any</td>
                      <td className="px-3.5 py-2 font-mono text-rose-400 font-bold">&apos;cancelled&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-slate-500">null / empty</td>
                      <td className="px-3.5 py-2 font-mono text-sky-400">false</td>
                      <td className="px-3.5 py-2 font-mono text-sky-400 font-bold">&apos;scheduled&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-slate-500">null / empty</td>
                      <td className="px-3.5 py-2 font-mono text-emerald-400">true</td>
                      <td className="px-3.5 py-2 font-mono text-emerald-400 font-bold">&apos;ended&apos;</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Picklists */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">Participant Classification Types</span>
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c1322]">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-900/70 font-semibold text-slate-300">
                    <tr>
                      <th className="px-3.5 py-2">Target Type</th>
                      <th className="px-3.5 py-2">Classification Criteria</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-sky-400 font-bold">&apos;staff&apos;</td>
                      <td className="px-3.5 py-2">Host user, participant with <code className="font-mono">type: &apos;user&apos;</code>, ID in <code className="font-mono">migrated_users</code>, or matching staff email</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-amber-300 font-bold">&apos;guest&apos;</td>
                      <td className="px-3.5 py-2">Client attendee, external contact, or customer resolved from parent Lead/Contact/Deal record</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-300 block mb-1">Supported Parent Types (<code className="font-mono text-sky-300">type</code> query param)</span>
                <div className="flex flex-wrap gap-1">
                  {['lead', 'contact', 'deal', 'visa_application', 'spouse_skill_assessment', 'task', 'event', 'signed_document'].map(t => (
                    <span key={t} className="rounded bg-sky-500/10 px-2 py-0.5 font-mono text-[11px] text-sky-300 border border-sky-500/20">
                      {t}
                    </span>
                  ))}
                </div>
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
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">title</td>
                  <td className="px-4 py-2.5">Missing or null <code className="font-mono">Event_Title</code></td>
                  <td className="px-4 py-2.5">Empty string assignment</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">&quot;&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">description</td>
                  <td className="px-4 py-2.5">Missing or whitespace <code className="font-mono">Description</code></td>
                  <td className="px-4 py-2.5">Plain nullable string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">scheduledAt</td>
                  <td className="px-4 py-2.5">Missing or invalid <code className="font-mono">Start_DateTime</code></td>
                  <td className="px-4 py-2.5">Unix Epoch UTC</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300 font-bold">&quot;1970-01-01T00:00:00.000Z&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">startedAt</td>
                  <td className="px-4 py-2.5">Status is <code className="font-mono">&apos;ended&apos;</code></td>
                  <td className="px-4 py-2.5">Cascades to <code className="font-mono">scheduledAt</code></td>
                  <td className="px-4 py-2.5 font-mono text-slate-200">scheduledAt timestamp</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">startedAt</td>
                  <td className="px-4 py-2.5">Status is <code className="font-mono">&apos;scheduled&apos;</code> or <code className="font-mono">&apos;cancelled&apos;</code></td>
                  <td className="px-4 py-2.5">Unstarted rule</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">endedAt</td>
                  <td className="px-4 py-2.5">Missing or invalid <code className="font-mono">End_DateTime</code></td>
                  <td className="px-4 py-2.5">Unix Epoch UTC</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300 font-bold">&quot;1970-01-01T00:00:00.000Z&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">hostEmail</td>
                  <td className="px-4 py-2.5">Host ID missing or not found in <code className="font-mono">migrated_users</code></td>
                  <td className="px-4 py-2.5">Lookup miss</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">participants</td>
                  <td className="px-4 py-2.5">Empty Participants array in Zoho</td>
                  <td className="px-4 py-2.5">Resolves parent customer Lead/Contact/Deal</td>
                  <td className="px-4 py-2.5 font-mono text-slate-200">[host?, customer?]</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">recording</td>
                  <td className="px-4 py-2.5">Missing or unrecorded meeting</td>
                  <td className="px-4 py-2.5">No recording document found</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">createdByEmail</td>
                  <td className="px-4 py-2.5">Creator ID not found in <code className="font-mono">migrated_users</code></td>
                  <td className="px-4 py-2.5">Lookup miss</td>
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
              <span className="font-semibold text-white">Attendee Email Deduplication</span>
              <p className="text-slate-300 leading-relaxed">
                A consultant may appear both as the host and inside the <code className="font-mono text-sky-300">Participants</code> array. The deduplication set ensures each unique email is only emitted once, preserving the <code className="font-mono text-sky-400">&apos;staff&apos;</code> designation.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-1.5">
              <span className="font-semibold text-white">Cascading Customer Parent Resolution</span>
              <p className="text-slate-300 leading-relaxed">
                When consultations are booked via Zoho Bookings, the client&apos;s email is often stored only on the parent Lead, Contact, Deal, or Visa Application. The service automatically resolves the customer and injects them as a <code className="font-mono text-amber-300">&apos;guest&apos;</code>.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-1.5">
              <span className="font-semibold text-white">Deal &amp; Visa Application Indirect Contact Resolution</span>
              <p className="text-slate-300 leading-relaxed">
                Deals and Visa Applications frequently link to a Contact (<code className="font-mono text-slate-300">_zoho_contact_id</code>). If the Deal record itself lacks an email, the service follows the relationship to the underlying Contact record to identify the client.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-1.5">
              <span className="font-semibold text-white">startedAt Nullability Contract</span>
              <p className="text-slate-300 leading-relaxed">
                To prevent misleading analytical data, <code className="font-mono text-slate-200">startedAt</code> is explicitly <code className="font-mono text-slate-400">null</code> for meetings that are <code className="font-mono text-sky-400">&apos;scheduled&apos;</code> or <code className="font-mono text-rose-400">&apos;cancelled&apos;</code>. Only <code className="font-mono text-emerald-400">&apos;ended&apos;</code> meetings inherit <code className="font-mono text-slate-200">scheduledAt</code> as their start time.
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
              title="MeetingItemDto & MeetingsResponseDto"
              code={`export type TargetMeetingStatus = 'scheduled' | 'ended' | 'cancelled';
export type ParticipantType = 'staff' | 'guest';

export interface MeetingParticipantDto {
  email: string;                      // Email address of the participant
  name: string;                       // Display name of the participant
  type: ParticipantType;              // 'staff' | 'guest'
}

export interface MeetingRecordingDto {
  url: string;                        // Downloadable presigned URL for recording
  mimeType: string;                   // MIME type (e.g. 'video/mp4')
  sizeBytes: number;                  // File size in bytes
}

export interface MeetingItemDto {
  externalId: string;                 // Original Zoho ID (zoho_id)
  parentType: string | null;          // Type of parent record (lead, contact, deal, etc.)
  parentZohoId: string | null;        // Original Zoho ID of parent record
  title: string;                      // Meeting title / subject
  description: string | null;         // Plain text description or null
  status: TargetMeetingStatus;        // 'scheduled' | 'ended' | 'cancelled'
  scheduledAt: string;                // Scheduled start time in UTC ISO 8601
  startedAt: string | null;           // Actual start time (only if status === 'ended')
  endedAt: string;                    // Scheduled / actual end time in UTC ISO 8601
  hostEmail: string | null;           // Host staff email address or null
  hostId: string | null;              // Zoho owner ID of the host
  participants: MeetingParticipantDto[]; // List of attendees (staff and guests)
  recording: MeetingRecordingDto | null; // Recording metadata or null
  createdById: string | null;         // Zoho creator ID
  createdByEmail: string | null;      // Creator staff email address
  modifiedAt: string;                 // Last modified timestamp in UTC ISO 8601
  modifiedById: string | null;        // Zoho modifier ID
}

export interface MeetingsResponseDto {
  data: MeetingItemDto[];
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
              title="GET /api/v1/meetings?page=1&limit=3"
              code={`{
  "data": [
    {
      "externalId": "164193000005186138",
      "parentType": "lead",
      "parentZohoId": "164193000000811047",
      "title": "Australia PR Initial Eligibility Consultation",
      "description": "Reviewed client qualifications, ACS points calculator, and English proficiency test plans.",
      "status": "ended",
      "scheduledAt": "2024-03-04T11:00:00.000Z",
      "startedAt": "2024-03-04T11:00:00.000Z",
      "endedAt": "2024-03-04T11:45:00.000Z",
      "hostEmail": "asha.sharma@worldvisa.in",
      "hostId": "164193000000512001",
      "participants": [
        {
          "email": "asha.sharma@worldvisa.in",
          "name": "Asha Sharma",
          "type": "staff"
        },
        {
          "email": "rohit.verma@example.com",
          "name": "Rohit Verma",
          "type": "guest"
        }
      ],
      "recording": {
        "url": "https://pub-r2.worldvisa.in/recordings/meeting_164193000005186138.mp4?X-Amz-Signature=abc123",
        "mimeType": "video/mp4",
        "sizeBytes": 52428800
      },
      "createdById": "164193000000512001",
      "createdByEmail": "asha.sharma@worldvisa.in",
      "modifiedAt": "2024-03-04T12:00:00.000Z",
      "modifiedById": "164193000000512001"
    },
    {
      "externalId": "164193000005186210",
      "parentType": "contact",
      "parentZohoId": "164193000000822091",
      "title": "Document Verification Follow-up",
      "description": null,
      "status": "cancelled",
      "scheduledAt": "2024-03-06T14:00:00.000Z",
      "startedAt": null,
      "endedAt": "2024-03-06T14:30:00.000Z",
      "hostEmail": "vikram.seth@worldvisa.in",
      "hostId": "164193000000512009",
      "participants": [
        {
          "email": "vikram.seth@worldvisa.in",
          "name": "Vikram Seth",
          "type": "staff"
        },
        {
          "email": "priya.sharma@example.com",
          "name": "Priya Sharma",
          "type": "guest"
        }
      ],
      "recording": null,
      "createdById": "164193000000512009",
      "createdByEmail": "vikram.seth@worldvisa.in",
      "modifiedAt": "2024-03-06T13:45:00.000Z",
      "modifiedById": "164193000000512009"
    },
    {
      "externalId": "164193000005186350",
      "title": "Subclass 190 Nomination Strategy",
      "description": "Reviewing state nomination requirements for Victoria and NSW.",
      "status": "scheduled",
      "scheduledAt": "2026-12-15T10:00:00.000Z",
      "startedAt": null,
      "endedAt": "2026-12-15T10:45:00.000Z",
      "hostEmail": "asha.sharma@worldvisa.in",
      "hostId": "164193000000512001",
      "participants": [
        {
          "email": "asha.sharma@worldvisa.in",
          "name": "Asha Sharma",
          "type": "staff"
        },
        {
          "email": "karan.mehta@example.com",
          "name": "Karan Mehta",
          "type": "guest"
        }
      ],
      "recording": null,
      "createdById": "164193000000512001",
      "createdByEmail": "asha.sharma@worldvisa.in",
      "modifiedAt": "2026-11-01T09:30:00.000Z",
      "modifiedById": "164193000000512001"
    }
  ],
  "total": 6571,
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

