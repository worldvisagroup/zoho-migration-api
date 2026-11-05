import React from 'react';
import { MethodBadge } from '../../../components/MethodBadge';
import { CodeBlock } from '../../../components/CodeBlock';
import { TableOfContents } from '../../../components/TableOfContents';
import { FileText, Database, CheckCircle2 } from 'lucide-react';

const tocItems = [
  { id: 'overview', title: '1. API Overview' },
  { id: 'field-mapping', title: '2. Zoho Field Mapping' },
  { id: 'transformation-logic', title: '3. Field Transformation Logic' },
  { id: 'enums-and-values', title: '4. Zoho Enums & Values' },
  { id: 'fallback-strategy', title: '5. Fallback Strategy' },
  { id: 'key-notes', title: '6. Key Edge Cases' },
  { id: 'response-reference', title: '7. Response Reference' },
];

export default function NotesApiDocPage() {
  return (
    <div className="flex gap-10">
      <div className="flex-1 min-w-0 space-y-10 pb-20">
        {/* Header */}
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 border border-sky-500/20">
              <FileText className="h-3.5 w-3.5" />
              <span>CRM Activities Module</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" />
              Production Ready
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">Notes API</h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            Technical mapping and extraction reference for migrating internal consultation remarks and activity notes from Zoho CRM (<code className="text-sky-300 font-mono">migrated_notes</code>) with polymorphic parent filtering and single-pass author email resolution.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-1.5 font-mono text-xs text-slate-200">
              <MethodBadge method="GET" />
              <span className="font-semibold text-white">/api/v1/notes</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Database className="h-3.5 w-3.5 text-slate-400" />
              <span>Collection:</span>
              <code className="text-sky-300 font-mono">migrated_notes</code>
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
            The Notes API extracts CRM consultation notes, internal agent remarks, and client logs from <code className="text-sky-300 font-mono">migrated_notes</code>. It formats the note body by combining title and content (<code className="font-mono text-slate-200">Note_Title:- Note_Content</code>), resolves creator and modifier email addresses via single-pass batch lookup against <code className="text-sky-300 font-mono">migrated_users</code> to avoid N+1 queries, supports filtering by related parent entity (<code className="font-mono text-slate-200">lead, contact, deal, visa_application, spouse_skill_assessment, task, event, signed_document</code>), and provides paginated results ordered oldest to newest by <code className="font-mono text-slate-200">Created_Time</code>.
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
                  <td className="px-4 py-2.5">Filter notes linked to a specific Zoho Lead (<code className="text-slate-300">_zoho_lead_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">zohoContactId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsString()</td>
                  <td className="px-4 py-2.5">Filter notes linked to a specific Zoho Contact (<code className="text-slate-300">_zoho_contact_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">zohoDealId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsString()</td>
                  <td className="px-4 py-2.5">Filter notes linked to a specific Zoho Deal (<code className="text-slate-300">_zoho_deal_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">visaApplicationId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsString()</td>
                  <td className="px-4 py-2.5">Filter notes linked to a Visa Application (<code className="text-slate-300">_zoho_visa_application_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">spouseSkillAssessmentId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsString()</td>
                  <td className="px-4 py-2.5">Filter notes linked to a Spouse Skill Assessment (<code className="text-slate-300">_zoho_spouse_skill_assessment_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">type</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">enum</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsIn(NOTE_PARENT_TYPES)</td>
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
            Direct mapping from MongoDB <code className="font-mono text-sky-300">migrated_notes</code> and <code className="font-mono text-sky-300">migrated_users</code> to the target response model.
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
                  <td className="px-4 py-2.5">Direct 1:1 copy of Zoho note unique identifier.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">body</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Note_Title, Note_Content</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Text, Text</td>
                  <td className="px-4 py-2.5">Combined into <code className="font-mono text-slate-200">&quot;{`\${title}:- \${content}`}&quot;</code>. Handles title-only, content-only, or empty gracefully.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">createdByEmail</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_created_by_id &rarr; migrated_users.email</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Lookup</td>
                  <td className="px-4 py-2.5">Resolved creator email address via single-pass batch lookup, or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">createdByZohoId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_created_by_id</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Cleaned Zoho user ID of the note creator, or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">createdAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string (ISO 8601)</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Created_Time</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Datetime</td>
                  <td className="px-4 py-2.5">Normalized to UTC ISO 8601. Fallback: <code className="text-amber-300 font-mono">1970-01-01T00:00:00.000Z</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">modifiedByEmail</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_modified_by_id &rarr; migrated_users.email</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Lookup</td>
                  <td className="px-4 py-2.5">Resolved modifier email address via batch lookup, or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">modifiedByZohoId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_modified_by_id</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Cleaned Zoho user ID of the modifier, or <code className="text-slate-400 font-mono">null</code>.</td>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Body Formatting */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">1. Note Body Combination</span>
              <p className="text-slate-300 leading-relaxed">
                Uses <code className="font-mono text-sky-300">formatBody(title, content)</code>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li><strong className="text-emerald-400">Both Present:</strong> Trims both strings and joins them as <code className="font-mono text-slate-200">&quot;{`\${title}:- \${content}`}&quot;</code>.</li>
                <li><strong className="text-sky-400">Title Only:</strong> Returns the trimmed title without trailing separators.</li>
                <li><strong className="text-sky-400">Content Only:</strong> Returns the trimmed content without leading separators.</li>
                <li><strong>Fallback:</strong> Empty string <code className="font-mono text-slate-200">&quot;&quot;</code> if both are missing or whitespace.</li>
              </ul>
            </div>

            {/* Batch Email Resolution */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">2. Single-Pass Staff Email Batching</span>
              <p className="text-slate-300 leading-relaxed">
                Prevents N+1 database queries across paginated notes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Collects unique user IDs from <code className="font-mono text-slate-300">_zoho_created_by_id</code> and <code className="font-mono text-slate-300">_zoho_modified_by_id</code>.</li>
                <li>Executes a single indexed query: <code className="font-mono text-sky-300">{`userModel.find({ zoho_id: { $in: uniqueUserIds } })`}</code>.</li>
                <li>Sanitizes, lowercases, and maps each email in memory.</li>
                <li>Unmatched IDs safely resolve to <code className="font-mono text-slate-400">null</code>.</li>
              </ul>
            </div>

            {/* Timestamp Resolution */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">3. UTC Timestamp Normalization</span>
              <p className="text-slate-300 leading-relaxed">
                Uses <code className="font-mono text-purple-300">normalizeZohoTimestamp()</code>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Converts Zoho dates to strict UTC ISO 8601 strings.</li>
                <li><code className="font-mono text-slate-200">modifiedAt</code> falls back to <code className="font-mono text-slate-200">Created_Time</code> if <code className="font-mono text-slate-200">Modified_Time</code> is absent.</li>
                <li>Guarantees non-null updated timestamp constraints in destination databases.</li>
                <li>Missing creation time defaults to Unix epoch.</li>
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
            {/* Parent types */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">Supported Parent Entity Types (<code className="font-mono text-sky-300">type</code> query param)</span>
              <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Notes are polymorphic CRM records attached to any of the following 8 entity models:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['lead', 'contact', 'deal', 'visa_application', 'spouse_skill_assessment', 'task', 'event', 'signed_document'].map(t => (
                    <span key={t} className="rounded bg-sky-500/10 px-2 py-0.5 font-mono text-[11px] text-sky-300 border border-sky-500/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Record Status Picklist */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">Zoho CRM Record Status Picklist (<code className="font-mono text-sky-300">Record_Status__s</code>)</span>
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c1322]">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-900/70 font-semibold text-slate-300">
                    <tr>
                      <th className="px-3.5 py-2">Picklist Value</th>
                      <th className="px-3.5 py-2">Meaning in Zoho CRM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-emerald-400">&apos;Available&apos;</td>
                      <td className="px-3.5 py-2">Active, published CRM note visible in activity timeline</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-amber-300">&apos;Draft&apos;</td>
                      <td className="px-3.5 py-2">Unsubmitted or draft note</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-rose-400">&apos;Trash&apos;</td>
                      <td className="px-3.5 py-2">Soft-deleted note residing in CRM recycle bin</td>
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
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">body</td>
                  <td className="px-4 py-2.5">Missing both <code className="font-mono">Note_Title</code> and <code className="font-mono">Note_Content</code></td>
                  <td className="px-4 py-2.5">Empty string assignment</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">&quot;&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">body</td>
                  <td className="px-4 py-2.5">Missing <code className="font-mono">Note_Content</code> but title present</td>
                  <td className="px-4 py-2.5">Output title only without delimiter</td>
                  <td className="px-4 py-2.5 font-mono text-slate-200">title</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">body</td>
                  <td className="px-4 py-2.5">Missing <code className="font-mono">Note_Title</code> but content present</td>
                  <td className="px-4 py-2.5">Output content only without delimiter</td>
                  <td className="px-4 py-2.5 font-mono text-slate-200">content</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">createdByEmail</td>
                  <td className="px-4 py-2.5">Creator ID missing or not found in <code className="font-mono">migrated_users</code></td>
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
              <span className="font-semibold text-white">Title-Only and Content-Only Notes</span>
              <p className="text-slate-300 leading-relaxed">
                Users in Zoho CRM frequently enter quick comments without adding a title, or set a title without body text. The <code className="font-mono text-sky-300">formatBody</code> helper avoids creating ugly formatting artifacts like <code className="font-mono text-slate-400">&quot;:- Content&quot;</code> or <code className="font-mono text-slate-400">&quot;Title:- &quot;</code> by conditionally omitting the delimiter when either side is empty.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-1.5">
              <span className="font-semibold text-white">modifiedAt Never-Null Guarantee</span>
              <p className="text-slate-300 leading-relaxed">
                When Zoho notes have not been modified since creation, <code className="font-mono text-slate-300">Modified_Time</code> is often null in the database. The transformation engine automatically cascades to <code className="font-mono text-slate-300">Created_Time</code>, satisfying strict non-null updated timestamp constraints in target databases.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-1.5">
              <span className="font-semibold text-white">Polymorphic Parent Entity Filtering</span>
              <p className="text-slate-300 leading-relaxed">
                A single <code className="font-mono text-sky-300">migrated_notes</code> collection stores remarks for Leads, Contacts, Deals, and Visa Applications. The API enables selective filtering via <code className="font-mono text-sky-300">zohoLeadId</code>, <code className="font-mono text-sky-300">zohoContactId</code>, <code className="font-mono text-sky-300">zohoDealId</code>, <code className="font-mono text-sky-300">visaApplicationId</code>, or <code className="font-mono text-sky-300">spouseSkillAssessmentId</code>, as well as broad filtering by <code className="font-mono text-sky-300">type</code>.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-1.5">
              <span className="font-semibold text-white">Staff Deletion &amp; Deactivation Resiliency</span>
              <p className="text-slate-300 leading-relaxed">
                If a staff member who logged a note has been deactivated or was not exported into <code className="font-mono text-sky-300">migrated_users</code>, the batch resolver gracefully yields <code className="font-mono text-slate-400">null</code> for <code className="font-mono text-slate-300">createdByEmail</code> while retaining the raw <code className="font-mono text-slate-300">createdByZohoId</code> for audit traceability.
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
              title="NoteItemDto & NotesResponseDto"
              code={`export interface NoteItemDto {
  externalId: string;                 // Original Zoho ID (zoho_id)
  body: string;                       // Combined "Note_Title:- Note_Content"
  createdByEmail: string | null;      // Creator staff email or null
  createdByZohoId: string | null;     // Creator Zoho user ID or null
  createdAt: string;                  // Zoho Created_Time in UTC ISO 8601
  modifiedByEmail: string | null;     // Modifier staff email or null
  modifiedByZohoId: string | null;    // Modifier Zoho user ID or null
  modifiedAt: string;                 // Zoho Modified_Time in UTC ISO 8601
}

export interface NotesResponseDto {
  data: NoteItemDto[];
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
              title="GET /api/v1/notes?page=1&limit=3"
              code={`{
  "data": [
    {
      "externalId": "164193000020539649",
      "body": "Initial Assessment:- Client scored 8 bands in IELTS and has 5 years of experience as a Software Engineer. Eligible for subclass 189 visa.",
      "createdByEmail": "asha.sharma@worldvisa.in",
      "createdByZohoId": "164193000000028001",
      "createdAt": "2024-03-02T10:00:00.000Z",
      "modifiedByEmail": "asha.sharma@worldvisa.in",
      "modifiedByZohoId": "164193000000028001",
      "modifiedAt": "2024-03-05T12:00:00.000Z"
    },
    {
      "externalId": "164193000020539702",
      "body": "Client requested call back after 6 PM due to office hours.",
      "createdByEmail": "rahul.patel@worldvisa.in",
      "createdByZohoId": "164193000000028005",
      "createdAt": "2024-03-03T07:15:20.000Z",
      "modifiedByEmail": null,
      "modifiedByZohoId": null,
      "modifiedAt": "2024-03-03T07:15:20.000Z"
    },
    {
      "externalId": "164193000020539810",
      "body": "Spouse Assessment Review:- Need marriage certificate and spouse degree transcripts before submission.",
      "createdByEmail": "priya.nair@worldvisa.in",
      "createdByZohoId": "164193000000028012",
      "createdAt": "2024-03-04T11:45:00.000Z",
      "modifiedByEmail": "priya.nair@worldvisa.in",
      "modifiedByZohoId": "164193000000028012",
      "modifiedAt": "2024-03-04T14:10:00.000Z"
    }
  ],
  "total": 12840,
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

