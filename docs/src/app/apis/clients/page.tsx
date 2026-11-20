import React from 'react';
import { MethodBadge } from '../../../components/MethodBadge';
import { Callout } from '../../../components/Callout';
import { CodeBlock } from '../../../components/CodeBlock';
import { TableOfContents } from '../../../components/TableOfContents';
import { UserCheck, Database, CheckCircle2 } from 'lucide-react';

const tocItems = [
  { id: 'overview', title: '1. API Overview' },
  { id: 'field-mapping', title: '2. Zoho Field Mapping' },
  { id: 'transformation-logic', title: '3. Field Transformation Logic' },
  { id: 'enums-and-values', title: '4. Zoho Enums & Values' },
  { id: 'fallback-strategy', title: '5. Fallback Strategy' },
  { id: 'key-notes', title: '6. Key Edge Cases' },
  { id: 'response-reference', title: '7. Response Reference' },
];

export default function ClientsApiDocPage() {
  return (
    <div className="flex gap-10">
      <div className="flex-1 min-w-0 space-y-10 pb-20">
        {/* Header */}
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 border border-sky-500/20">
              <UserCheck className="h-3.5 w-3.5" />
              <span>CRM Clients (Leads & Contacts) Migration</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" />
              Production Ready
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">Clients API</h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            Technical mapping and extraction specification for migrating customer records from Zoho CRM (<code className="text-sky-300 font-mono">migrated_leads</code> and <code className="text-sky-300 font-mono">migrated_contacts</code>) with Zoho Books invoice address resolution.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-1.5 font-mono text-xs text-slate-200">
              <MethodBadge method="GET" />
              <span className="font-semibold text-white">/api/v1/clients</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Database className="h-3.5 w-3.5 text-slate-400" />
              <span>Source Collections:</span>
              <code className="text-sky-300 font-mono">migrated_leads</code>
              <span className="text-slate-500">/</span>
              <code className="text-sky-300 font-mono">migrated_contacts</code>
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
            The Clients API provides unified extraction for customer entities across both prospective leads (<code className="font-mono text-sky-300">type=leads</code>) and converted client contacts (<code className="font-mono text-sky-300">type=contacts</code>). It standardizes personal names to Title Case, formats international phone numbers into E.164 standard using country code detection, normalizes marital status and date of birth, and performs multi-tiered address resolution (prioritizing Zoho Books invoices with fallback to CRM record addresses).
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
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5">
                    <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] text-rose-400 border border-rose-500/20 font-semibold">
                      Required
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsIn([&apos;leads&apos;, &apos;contacts&apos;])</td>
                  <td className="px-4 py-2.5">Specifies target source collection: <code className="text-slate-200">leads</code> or <code className="text-slate-200">contacts</code>.</td>
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
                  <td className="px-4 py-2.5">Records per page (capped at 1,000).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">from</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">ISO 8601</td>
                  <td className="px-4 py-2.5">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">Optional</span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsISO8601({'{ strict: true }'})</td>
                  <td className="px-4 py-2.5">Inclusive start date filter on Zoho <code className="text-slate-200">Created_Time</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">to</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">ISO 8601</td>
                  <td className="px-4 py-2.5">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">Optional</span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsISO8601({'{ strict: true }'})</td>
                  <td className="px-4 py-2.5">Inclusive end date filter on Zoho <code className="text-slate-200">Created_Time</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">updatedSince</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">ISO 8601</td>
                  <td className="px-4 py-2.5">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">Optional</span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsISO8601({'{ strict: true }'})</td>
                  <td className="px-4 py-2.5">Incremental sync filter on Zoho <code className="text-slate-200">Modified_Time</code> (&ge;). Mutually exclusive with <code className="text-slate-200">from</code>/<code className="text-slate-200">to</code> (returns 400 if combined).</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-xs text-slate-400 flex flex-wrap gap-4 pt-1">
            <div>
              <span className="text-slate-500">Sort Order:</span>{' '}
              <span className="font-mono text-amber-300 font-semibold">Created_Time ASC (1)</span> default, or <span className="font-mono text-amber-300 font-semibold">Modified_Time ASC (1)</span> with <code className="text-slate-300 font-mono">updatedSince</code>
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
            The table below documents how fields from both <code className="font-mono text-sky-300">migrated_leads</code> and <code className="font-mono text-sky-300">migrated_contacts</code> map into the unified <code className="font-mono text-slate-200">ClientItemDto</code> model.
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0c1322]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/70 font-semibold text-slate-300">
                <tr>
                  <th className="px-4 py-2.5">Target Field</th>
                  <th className="px-4 py-2.5">Target Type</th>
                  <th className="px-4 py-2.5">Leads Source Field</th>
                  <th className="px-4 py-2.5">Contacts Source Field</th>
                  <th className="px-4 py-2.5">Transformation & Resolution Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">externalId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">zoho_id</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">zoho_id</td>
                  <td className="px-4 py-2.5">Direct 1:1 copy of Zoho unique string identifier.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">firstName</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">First_Name, Full_Name</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">First_Name, Full_Name</td>
                  <td className="px-4 py-2.5">Title-Cased via <code className="font-mono">extractNames()</code>. Falls back to tokenizing <code className="font-mono">Full_Name</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">lastName</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Last_Name, Full_Name</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Last_Name, Full_Name</td>
                  <td className="px-4 py-2.5">Title-Cased via <code className="font-mono">extractNames()</code>. Captures final token. Mononyms map to <code className="font-mono">lastName</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">email</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Email, Secondary_Email</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Email, Secondary_Email</td>
                  <td className="px-4 py-2.5">Lowercased, whitespace stripped. Defaults to <code className="text-amber-300 font-mono">notprovided@gmail.com</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">phone</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Phone, Mobile, Country_Code</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Phone, Mobile, Country_Code</td>
                  <td className="px-4 py-2.5">Parsed to international E.164 with country detection. Fallback: <code className="text-amber-300 font-mono">+919999999999</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">dob</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Dob</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">DOB</td>
                  <td className="px-4 py-2.5">Parsed to UTC midnight ISO string (<code className="font-mono text-slate-200">YYYY-MM-DDTHH:mm:ss.000Z</code>) to prevent timezone shifts.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">maritalStatus</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">StandardMaritalStatus | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">marital_status</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">marital_status</td>
                  <td className="px-4 py-2.5">Normalized to <code className="font-mono">single</code>, <code className="font-mono">married</code>, <code className="font-mono">divorced</code>, <code className="font-mono">widowed</code>, or <code className="font-mono text-slate-400">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">address</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">ClientAddressDto</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Street, City, State, Country, Zip_Code</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Mailing_Street, Mailing_City, etc.</td>
                  <td className="px-4 py-2.5">
                    <strong>Priority 1:</strong> Zoho Books invoice billing address.<br />
                    <strong>Priority 2:</strong> CRM record address fields.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">createdAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string (ISO 8601)</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Created_Time</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Created_Time</td>
                  <td className="px-4 py-2.5">Normalized to UTC ISO 8601. Fallback: <code className="text-amber-300 font-mono">1970-01-01T00:00:00.000Z</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">updatedAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string (ISO 8601)</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Modified_Time, Created_Time</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Modified_Time, Created_Time</td>
                  <td className="px-4 py-2.5">Primary <code className="font-mono">Modified_Time</code>, falls back to <code className="font-mono">Created_Time</code>, then Unix Epoch.</td>
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
            {/* Name Extraction */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">1. Name Extraction &amp; Title Case</span>
              <p className="text-slate-300 leading-relaxed">
                Uses <code className="font-mono text-sky-300">extractNames()</code>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Reads <code className="font-mono">First_Name</code> and <code className="font-mono">Last_Name</code>.</li>
                <li>If either is missing, splits <code className="font-mono">Full_Name</code> by whitespace: the final token becomes <code className="font-mono text-slate-200">lastName</code>; preceding tokens form <code className="font-mono text-slate-200">firstName</code>.</li>
                <li><strong>Mononyms:</strong> Single words (e.g. <em>&quot;Asha&quot;</em>) map to <code className="font-mono text-slate-200">lastName</code>, with <code className="font-mono text-slate-200">firstName = &quot;&quot;</code>.</li>
                <li>Normalizes capitalization to Title Case, preserving hyphenated surnames (<em>Mary-Jane</em>) and apostrophes (<em>O&apos;Connor</em>).</li>
              </ul>
            </div>

            {/* Email Sanitization */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">2. Email Sanitization</span>
              <p className="text-slate-300 leading-relaxed">
                Uses <code className="font-mono text-emerald-300">normalizeEmail()</code>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Evaluates primary <code className="font-mono">Email</code>, falling back to <code className="font-mono">Secondary_Email</code>.</li>
                <li>Lowercases string and strips all internal and trailing whitespace.</li>
                <li>Rejects strings without <code className="font-mono">@</code> or literals like <code className="font-mono">&quot;null&quot;</code>.</li>
                <li>
                  <strong>Client Fallback:</strong> If missing or invalid, defaults to{' '}
                  <code className="text-amber-300 font-mono">notprovided@gmail.com</code>.
                </li>
              </ul>
            </div>

            {/* Phone Normalization */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">3. International Phone Formatting</span>
              <p className="text-slate-300 leading-relaxed">
                Uses <code className="font-mono text-amber-300">normalizePhoneNumber()</code> with <code className="font-mono text-slate-300">libphonenumber-js</code>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Evaluates primary <code className="font-mono">Phone</code>, falling back to <code className="font-mono">Mobile</code>.</li>
                <li>Extracts ISO country and calling code from <code className="font-mono">Country_Code</code> text (e.g. <em>&quot;+91 - India&quot;</em> &rarr; <code className="font-mono">IN</code>, <em>&quot;+1 - USA&quot;</em> &rarr; <code className="font-mono">US</code>).</li>
                <li>Formats valid numbers into strict international E.164 (e.g. <code className="font-mono text-slate-200">+919876543210</code>, <code className="font-mono text-slate-200">+12025550143</code>).</li>
                <li><strong>Fallback:</strong> Unparseable or empty numbers default to <code className="text-amber-300 font-mono">+919999999999</code>.</li>
              </ul>
            </div>

            {/* DOB & Marital Status */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">4. DOB &amp; Marital Status</span>
              <p className="text-slate-300 leading-relaxed">
                Strict UTC parsing &amp; enum translation:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>
                  <strong>DOB Normalization:</strong> Reads <code className="font-mono">Dob</code> (Leads) or <code className="font-mono">DOB</code> (Contacts).
                  Parses <code className="font-mono">YYYY-MM-DD</code> directly into UTC midnight (<code className="font-mono text-slate-200">00:00:00.000Z</code>) to prevent timezone shifts across continents. Returns <code className="font-mono text-slate-400">null</code> if missing.
                </li>
                <li>
                  <strong>Marital Status:</strong> Translates Zoho text (<em>Married</em>, <em>Un-married</em>, <em>Divorced / Separated</em>, <em>Widowed</em>) into 4 strict lowercase enums, or <code className="font-mono text-slate-400">null</code> if unrecognized.
                </li>
              </ul>
            </div>
          </div>

          {/* Address Resolution Deep-Dive */}
          <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-5 space-y-3">
            <span className="font-semibold text-white text-sm block">5. Two-Tier Address Resolution Pipeline</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Customer billing addresses frequently change or are updated on tax invoices rather than CRM records. The Clients API resolves addresses using a prioritized 2-tier pipeline:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 space-y-2">
                <span className="font-semibold text-emerald-400">Priority 1: Zoho Books Invoice Billing Address</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Invoices are matched via Books Contact customer IDs and normalized email addresses in a single batch query.</li>
                  <li><code className="font-mono text-sky-300">scoreAddressCompleteness()</code> scores candidate invoices (0 to 5) based on populated fields.</li>
                  <li>Ties are broken by invoice recency (<code className="font-mono">date</code> descending, newest first).</li>
                  <li><code className="font-mono text-sky-300">combineStreetParts()</code> intelligently merges <code className="font-mono">street</code>, <code className="font-mono">street2</code>, and parent <code className="font-mono">address</code> without duplicating lines.</li>
                </ul>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 space-y-2">
                <span className="font-semibold text-amber-300">Priority 2: CRM Record Address Fallback</span>
                <p className="text-slate-400 leading-relaxed">
                  If no invoice billing address is found, falls back directly to the CRM record:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>Leads:</strong> <code className="font-mono">Street</code>, <code className="font-mono">City</code>, <code className="font-mono">State</code>, <code className="font-mono">Country</code>, <code className="font-mono">Zip_Code</code>.</li>
                  <li><strong>Contacts:</strong> <code className="font-mono">Mailing_Street ?? Street</code>, <code className="font-mono">Mailing_City ?? City</code>, etc.</li>
                </ul>
                <p className="text-slate-500 pt-1">
                  Always returns a uniform 5-property object with <code className="font-mono">null</code> for empty fields.
                </p>
              </div>
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
            {/* Marital Status Mapping */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">Marital Status Mapping Matrix</span>
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c1322]">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-900/70 font-semibold text-slate-300">
                    <tr>
                      <th className="px-3.5 py-2">Zoho Source marital_status</th>
                      <th className="px-3.5 py-2">Mapped Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-sky-300">&apos;Married&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-emerald-400 font-semibold">&apos;married&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-sky-300">&apos;Un-married&apos; / &apos;Unmarried&apos; / &apos;Single&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-emerald-400 font-semibold">&apos;single&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-sky-300">&apos;Divorced / Separated&apos; / &apos;Divorced&apos; / &apos;Separated&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-emerald-400 font-semibold">&apos;divorced&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-sky-300">&apos;Widowed&apos; / &apos;Widow&apos; / &apos;Widower&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-emerald-400 font-semibold">&apos;widowed&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-slate-500">Unrecognized string / null / empty</td>
                      <td className="px-3.5 py-2 font-mono text-slate-500">null</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Target Enums & Structure */}
            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-1.5">Target Marital Status Enum</span>
                <div className="flex flex-wrap gap-1.5">
                  {['single', 'married', 'divorced', 'widowed'].map(s => (
                    <span key={s} className="rounded bg-purple-500/10 px-2.5 py-1 font-mono text-xs text-purple-300 border border-purple-500/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-1.5">Country Code Parsing Samples</span>
                <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-3 text-xs space-y-1 font-mono text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-sky-300">&quot;+91 - India&quot;</span>
                    <span className="text-emerald-400">&rarr; ISO: &quot;IN&quot;, Calling: &quot;91&quot;</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sky-300">&quot;+1 - USA&quot;</span>
                    <span className="text-emerald-400">&rarr; ISO: &quot;US&quot;, Calling: &quot;1&quot;</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sky-300">&quot;+971 - UAE&quot;</span>
                    <span className="text-emerald-400">&rarr; ISO: &quot;AE&quot;, Calling: &quot;971&quot;</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sky-300">&quot;+61 - Australia&quot;</span>
                    <span className="text-emerald-400">&rarr; ISO: &quot;AU&quot;, Calling: &quot;61&quot;</span>
                  </div>
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
            Deterministic fallback rules applied when source database fields are null, missing, or irregular.
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
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">firstName</td>
                  <td className="px-4 py-2.5">Missing <code className="font-mono">First_Name</code></td>
                  <td className="px-4 py-2.5">Extracts earlier tokens from <code className="font-mono">Full_Name</code></td>
                  <td className="px-4 py-2.5 font-mono text-slate-200">Parsed token or &quot;&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">lastName</td>
                  <td className="px-4 py-2.5">Missing <code className="font-mono">Last_Name</code></td>
                  <td className="px-4 py-2.5">Extracts final token from <code className="font-mono">Full_Name</code></td>
                  <td className="px-4 py-2.5 font-mono text-slate-200">Parsed token or &quot;&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">email</td>
                  <td className="px-4 py-2.5">Missing primary <code className="font-mono">Email</code></td>
                  <td className="px-4 py-2.5">Falls back to <code className="font-mono text-slate-200">Secondary_Email</code></td>
                  <td className="px-4 py-2.5 font-mono text-slate-200">Cleaned secondary email</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">email</td>
                  <td className="px-4 py-2.5">Both emails missing or invalid</td>
                  <td className="px-4 py-2.5">Client placeholder default</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300 font-bold">&quot;notprovided@gmail.com&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">phone</td>
                  <td className="px-4 py-2.5">Missing <code className="font-mono">Phone</code></td>
                  <td className="px-4 py-2.5">Falls back to <code className="font-mono text-slate-200">Mobile</code></td>
                  <td className="px-4 py-2.5 font-mono text-slate-200">Normalized E.164 mobile</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">phone</td>
                  <td className="px-4 py-2.5">Both <code className="font-mono">Phone</code> and <code className="font-mono">Mobile</code> missing/invalid</td>
                  <td className="px-4 py-2.5">Standard placeholder</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300 font-bold">&quot;+919999999999&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">dob</td>
                  <td className="px-4 py-2.5">Missing or invalid date string</td>
                  <td className="px-4 py-2.5">Validation fails</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">maritalStatus</td>
                  <td className="px-4 py-2.5">Missing or unrecognized string</td>
                  <td className="px-4 py-2.5">Validation fails</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">address</td>
                  <td className="px-4 py-2.5">No Books invoices found for client</td>
                  <td className="px-4 py-2.5">Falls back to CRM record address fields</td>
                  <td className="px-4 py-2.5 font-mono text-slate-200">Sanitized CRM record address</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">createdAt</td>
                  <td className="px-4 py-2.5">Missing/invalid <code className="font-mono">Created_Time</code></td>
                  <td className="px-4 py-2.5">Unix Epoch UTC</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300 font-bold">&quot;1970-01-01T00:00:00.000Z&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">updatedAt</td>
                  <td className="px-4 py-2.5">Missing/invalid <code className="font-mono">Modified_Time</code></td>
                  <td className="px-4 py-2.5">Falls back to <code className="font-mono">Created_Time</code></td>
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
              <span className="font-semibold text-white">Leads vs Contacts Field Casing</span>
              <p className="text-slate-300 leading-relaxed">
                Zoho CRM uses inconsistent field casing across modules: Leads use <code className="font-mono text-sky-300">Dob</code> and <code className="font-mono text-sky-300">Street</code>, whereas Contacts use <code className="font-mono text-sky-300">DOB</code> and <code className="font-mono text-sky-300">Mailing_Street</code> (falling back to <code className="font-mono">Street</code>). The service dynamically branches extraction based on <code className="font-mono">type</code>.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-1.5">
              <span className="font-semibold text-white">Books Invoice Address Precedence</span>
              <p className="text-slate-300 leading-relaxed">
                Billing addresses on paid tax invoices represent legally verified client residences. The API prioritizes Zoho Books invoice addresses over legacy CRM contact addresses whenever usable invoice data exists.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-1.5">
              <span className="font-semibold text-white">Client vs Staff Email Fallbacks</span>
              <p className="text-slate-300 leading-relaxed">
                While Staff API defaults missing emails to <code className="font-mono text-amber-300">notprovided@worldvisa.in</code>, Clients API intentionally defaults to <code className="font-mono text-amber-300">notprovided@gmail.com</code> to distinguish customer placeholders from internal employees.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-1.5">
              <span className="font-semibold text-white">DOB Timezone Shift Prevention</span>
              <p className="text-slate-300 leading-relaxed">
                Date-only strings (<code className="font-mono">YYYY-MM-DD</code>) are parsed explicitly as UTC midnight. Parsing with local date constructors would shift birth dates back by one day for users located west of UTC (e.g. US/Canada).
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
              title="ClientItemDto & ClientsResponseDto"
              code={`export type StandardMaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';

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
}`}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Example Response (200 OK)</h3>
            <CodeBlock
              language="json"
              title="GET /api/v1/clients?type=contacts&page=1&limit=2"
              code={`{
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

