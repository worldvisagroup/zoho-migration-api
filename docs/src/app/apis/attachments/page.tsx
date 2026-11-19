import React from 'react';
import { MethodBadge } from '../../../components/MethodBadge';
import { CodeBlock } from '../../../components/CodeBlock';
import { TableOfContents } from '../../../components/TableOfContents';
import { Paperclip, Database, CheckCircle2 } from 'lucide-react';

const tocItems = [
  { id: 'overview', title: '1. API Overview' },
  { id: 'field-mapping', title: '2. Zoho Field Mapping' },
  { id: 'transformation-logic', title: '3. Field Transformation Logic' },
  { id: 'enums-and-values', title: '4. Zoho Enums & Values' },
  { id: 'fallback-strategy', title: '5. Fallback Strategy' },
  { id: 'key-notes', title: '6. Key Edge Cases' },
  { id: 'response-reference', title: '7. Response Reference' },
];

export default function AttachmentsApiDocPage() {
  return (
    <div className="flex gap-10">
      <div className="flex-1 min-w-0 space-y-10 pb-20">
        {/* Header */}
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 border border-sky-500/20">
              <Paperclip className="h-3.5 w-3.5" />
              <span>CRM Documents &amp; Files Module</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" />
              Production Ready
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">Attachments API</h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            Technical mapping and extraction reference for migrating client case files, passport scans, and activity attachments from Zoho CRM (<code className="text-sky-300 font-mono">migrated_attachments</code>) with Cloudflare R2 presigned URL generation and polymorphic parent entity resolution.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-1.5 font-mono text-xs text-slate-200">
              <MethodBadge method="GET" />
              <span className="font-semibold text-white">/api/v1/attachments</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Database className="h-3.5 w-3.5 text-slate-400" />
              <span>Collection:</span>
              <code className="text-sky-300 font-mono">migrated_attachments</code>
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
            The Attachments API extracts uploaded documents, verification proofs, and file attachments from <code className="text-sky-300 font-mono">migrated_attachments</code>. It generates fresh presigned Cloudflare R2 download URLs on the fly, computes standard RFC MIME types, resolves uploader/modifier staff emails from <code className="text-sky-300 font-mono">migrated_users</code>, resolves parent references (<code className="font-mono text-slate-200">parentType</code> and <code className="font-mono text-slate-200">parentZohoId</code>), and returns paginated results sorted chronologically.
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
                  <td className="px-4 py-2.5">Filter files linked to a specific Zoho Lead (<code className="text-slate-300">_zoho_lead_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">zohoContactId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsString()</td>
                  <td className="px-4 py-2.5">Filter files linked to a specific Zoho Contact (<code className="text-slate-300">_zoho_contact_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">zohoDealId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsString()</td>
                  <td className="px-4 py-2.5">Filter files linked to a specific Zoho Deal (<code className="text-slate-300">_zoho_deal_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">visaApplicationId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsString()</td>
                  <td className="px-4 py-2.5">Filter files linked to a Visa Application (<code className="text-slate-300">_zoho_visa_application_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">spouseSkillAssessmentId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsString()</td>
                  <td className="px-4 py-2.5">Filter files linked to a Spouse Skill Assessment (<code className="text-slate-300">_zoho_spouse_skill_assessment_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">type</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">enum</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsIn(ATTACHMENT_PARENT_TYPES)</td>
                  <td className="px-4 py-2.5">Filter by parent type (<code className="text-slate-300">lead, contact, deal, visa_application, spouse_skill_assessment, task, event, signed_document</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">page</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">number</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">1</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsInt(), @Min(1)</td>
                  <td className="px-4 py-2.5">1-indexed pagination page number.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">limit</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">number</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">200</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsInt(), @Min(1), @Max(1000)</td>
                  <td className="px-4 py-2.5">Number of records per page (capped at 1,000).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">from</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsISO8601()</td>
                  <td className="px-4 py-2.5">Inclusive start filter on Zoho <code className="text-slate-300">Created_Time</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">to</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsISO8601()</td>
                  <td className="px-4 py-2.5">Inclusive end filter on Zoho <code className="text-slate-300">Created_Time</code>.</td>
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
            Direct mapping from MongoDB <code className="font-mono text-sky-300">migrated_attachments</code> to the target response model.
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
                  <td className="px-4 py-2.5">Direct 1:1 copy of Zoho attachment unique identifier.</td>
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
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_*_id, _zoho_parent_id</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Original Zoho ID of parent record (retrieved from <code className="font-mono text-slate-200">_zoho_parent_id</code> for task, event, signed_document).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">url</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">r2_key &rarr; Presigned</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">URL</td>
                  <td className="px-4 py-2.5">Fresh presigned Cloudflare R2 download URL, falling back to <code className="text-slate-300 font-mono">r2_download_url</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">fileName</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">File_Name</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Original file name with extension. Defaults to empty string.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">mimeType</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">File_Name, r2_key</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Derived RFC MIME type (e.g. <code className="font-mono">application/pdf</code>). Fallback: <code className="font-mono">application/octet-stream</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">sizeBytes</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">number</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Size</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String / Number</td>
                  <td className="px-4 py-2.5">File size in bytes (<code className="font-mono">parseInt(Size, 10) &gt;= 0</code>). Defaults to <code className="font-mono">0</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">uploadedByEmail</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_created_by_id &rarr; migrated_users</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Lookup</td>
                  <td className="px-4 py-2.5">Resolved staff email via single-pass batch lookup, or <code className="font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">uploadedByZohoId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_created_by_id</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Cleaned Zoho user ID of uploader, or <code className="font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">uploadedAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string (ISO 8601)</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Created_Time, createdAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Datetime</td>
                  <td className="px-4 py-2.5">Normalized to UTC ISO 8601 string. Fallback: <code className="font-mono">1970-01-01T00:00:00.000Z</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">createdAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string (ISO 8601)</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Created_Time</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Datetime</td>
                  <td className="px-4 py-2.5">Identical to <code className="font-mono">uploadedAt</code>. UTC ISO 8601 timestamp.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">modifiedAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string (ISO 8601)</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Modified_Time, Created_Time</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Datetime</td>
                  <td className="px-4 py-2.5">Primary <code className="font-mono">Modified_Time</code>, falls back to <code className="font-mono">Created_Time</code>. Never null.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">modifiedByEmail</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_modified_by_id &rarr; migrated_users</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Lookup</td>
                  <td className="px-4 py-2.5">Resolved staff modifier email via batch lookup, or <code className="font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">modifiedByZohoId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_modified_by_id</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Cleaned Zoho user ID of modifier, or <code className="font-mono">null</code>.</td>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">1. Presigned R2 URL Signing</span>
              <p className="text-slate-300 leading-relaxed">
                Uses <code className="font-mono text-sky-300">generateDownloadUrlsBatch()</code>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Pre-signs secure download links directly against Cloudflare R2 bucket.</li>
                <li>Avoids public bucket exposure while delivering high-speed CDN delivery.</li>
                <li>Falls back to stored <code className="font-mono text-slate-300">r2_download_url</code> if signing is bypassed.</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">2. Polymorphic Parent Resolution</span>
              <p className="text-slate-300 leading-relaxed">
                Uses universal <code className="font-mono text-sky-300">resolveParentEntity()</code>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Core entities extract from specific fields (<code className="font-mono text-slate-300">_zoho_lead_id, _zoho_contact_id</code>, etc.).</li>
                <li>Sub-activity entities (<code className="font-mono text-slate-300">task, event, signed_document</code>) extract from <code className="font-mono text-slate-300">_zoho_parent_id</code>.</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">3. RFC MIME Type Mapping</span>
              <p className="text-slate-300 leading-relaxed">
                Uses <code className="font-mono text-purple-300">getMimeType()</code> helper:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Inspects file extension from <code className="font-mono text-slate-300">File_Name</code> or <code className="font-mono text-slate-300">r2_key</code>.</li>
                <li>Maps standard MIME types for PDF, images, docs, and spreadsheets.</li>
                <li>Defaults safely to <code className="font-mono text-slate-300">application/octet-stream</code>.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. ENUMS AND VALUES */}
        <section id="enums-and-values" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-500/20">
              4
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Zoho Enums &amp; Values</h2>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 block mb-1">Supported Parent Types (<code className="font-mono text-sky-300">type</code> query param)</span>
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
                  <td className="px-4 py-2.5">Missing ID in matched fields</td>
                  <td className="px-4 py-2.5">Null fallback</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">url</td>
                  <td className="px-4 py-2.5">Missing R2 key and fallback download URLs</td>
                  <td className="px-4 py-2.5">Empty string assignment</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">&quot;&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">fileName</td>
                  <td className="px-4 py-2.5">Missing <code className="font-mono">File_Name</code></td>
                  <td className="px-4 py-2.5">Empty string assignment</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">&quot;&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">mimeType</td>
                  <td className="px-4 py-2.5">Missing or unrecognized extension</td>
                  <td className="px-4 py-2.5">Binary fallback</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">&quot;application/octet-stream&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">sizeBytes</td>
                  <td className="px-4 py-2.5">Missing or invalid <code className="font-mono">Size</code></td>
                  <td className="px-4 py-2.5">Zero byte assignment</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">0</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">uploadedByEmail</td>
                  <td className="px-4 py-2.5">Creator ID not in <code className="font-mono">migrated_users</code></td>
                  <td className="px-4 py-2.5">Lookup miss</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">modifiedAt</td>
                  <td className="px-4 py-2.5">Missing <code className="font-mono">Modified_Time</code></td>
                  <td className="px-4 py-2.5">Falls back to <code className="font-mono">Created_Time</code></td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">uploadedAt value</td>
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
              <span className="font-semibold text-white">Sub-Activity Parent ID Retrieval</span>
              <p className="text-slate-300 leading-relaxed">
                Attachments belonging to <code className="font-mono text-sky-300">task</code>, <code className="font-mono text-sky-300">event</code>, or <code className="font-mono text-sky-300">signed_document</code> store their parent reference in <code className="font-mono text-slate-300">_zoho_parent_id</code> instead of entity-specific fields. The resolver automatically maps <code className="font-mono text-slate-300">_zoho_parent_id</code> for these parent types.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-1.5">
              <span className="font-semibold text-white">modifiedAt Never-Null Guarantee</span>
              <p className="text-slate-300 leading-relaxed">
                When Zoho records omit <code className="font-mono text-slate-300">Modified_Time</code>, the transformation automatically cascades to <code className="font-mono text-slate-300">Created_Time</code>, satisfying strict non-null database constraints.
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
              title="AttachmentItemDto & AttachmentsResponseDto"
              code={`export interface AttachmentItemDto {
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
}`}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Example Response (200 OK)</h3>
            <CodeBlock
              language="json"
              title="GET /api/v1/attachments?page=1&limit=2"
              code={`{
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
}`}
            />
          </div>
        </section>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
}
