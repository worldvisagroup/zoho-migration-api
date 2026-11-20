import { CheckCircle2, Database, Users } from 'lucide-react';
import { CodeBlock } from '../../../components/CodeBlock';
import { MethodBadge } from '../../../components/MethodBadge';
import { TableOfContents } from '../../../components/TableOfContents';

const tocItems = [
  { id: 'overview', title: '1. API Overview' },
  { id: 'field-mapping', title: '2. Zoho Field Mapping' },
  { id: 'transformation-logic', title: '3. Field Transformation Logic' },
  { id: 'enums-and-values', title: '4. Zoho Enums & Values' },
  { id: 'fallback-strategy', title: '5. Fallback Strategy' },
  { id: 'key-notes', title: '6. Key Edge Cases' },
  { id: 'response-reference', title: '7. Response Reference' },
];

export default function StaffApiDocPage() {
  return (
    <div className="flex gap-10">
      <div className="flex-1 min-w-0 space-y-10 pb-20">
        {/* Header */}
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 border border-sky-500/20">
              <Users className="h-3.5 w-3.5" />
              <span>CRM Staff Migration</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" />
              Production Ready
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">Staff API</h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            Technical mapping and extraction reference for migrating internal Zoho CRM users (<code className="text-sky-300 font-mono">migrated_users</code>) into the standardized operational schema.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-1.5 font-mono text-xs text-slate-200">
              <MethodBadge method="GET" />
              <span className="font-semibold text-white">/api/v1/staff</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Database className="h-3.5 w-3.5 text-slate-400" />
              <span>Collection:</span>
              <code className="text-sky-300 font-mono">migrated_users</code>
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
            Extracts internal staff members from Zoho CRM, standardizes names to Title Case, normalizes Indian phone numbers (<code className="text-slate-200 font-mono">+91</code>), resolves free-text roles into structured role/department enums, and returns paginated records sorted chronologically by <code className="text-sky-300 font-mono">created_time: 1</code> (oldest first).
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
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">page</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">number</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">1</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">Min 1</td>
                  <td className="px-4 py-2.5">1-indexed page number for pagination.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">limit</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">number</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">200</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">Min 1, Max 1000</td>
                  <td className="px-4 py-2.5">Number of records per page.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">from</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">ISO 8601</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">ISO 8601 string</td>
                  <td className="px-4 py-2.5">Inclusive start date filter on Zoho <code className="text-slate-200">created_time</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">to</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">ISO 8601</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">ISO 8601 string</td>
                  <td className="px-4 py-2.5">Inclusive end date filter on Zoho <code className="text-slate-200">created_time</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">updatedSince</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">ISO 8601</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">ISO 8601 string</td>
                  <td className="px-4 py-2.5">Incremental sync filter on Zoho <code className="text-slate-200">modified_time</code> (&ge;). Mutually exclusive with <code className="text-slate-200">from</code>/<code className="text-slate-200">to</code> (returns 400 if combined). Dynamic sort by <code className="text-slate-200">modified_time: 1</code>.</td>
                </tr>
              </tbody>
            </table>
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
            Direct mapping from the raw MongoDB collection <code className="font-mono text-sky-300">migrated_users</code> to the target API response model.
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
                  <td className="px-4 py-2.5">Direct 1:1 copy of Zoho unique ID.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">email</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">email</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Trimmed, lowercased, whitespace stripped. Defaults to <code className="text-amber-300 font-mono">notprovided@worldvisa.in</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">firstName</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">first_name, full_name, name</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Extracted, capitalized to Title Case. Falls back to tokenizing full_name or name.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">lastName</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">last_name, full_name, name</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Extracted, capitalized to Title Case. Captures last token of full name. Mononyms map here.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">phone</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">phone, mobile</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Checks phone, falls back to mobile. Formatted to <code className="text-slate-200 font-mono">+91XXXXXXXXXX</code>. Fallback: <code className="text-amber-300 font-mono">+919999999999</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">department</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">StaffDepartment</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">role_name</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Classified into <code className="font-mono">sales</code>, <code className="font-mono">processing</code>, <code className="font-mono">finance</code>, or <code className="font-mono">marketing</code>. Default: <code className="text-amber-300 font-mono">sales</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">role</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">StaffRole</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">role_name</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Mapped into 13 hierarchical roles. Default: <code className="text-amber-300 font-mono">sales_executive</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">isActive</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">boolean</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">status</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">True only if <code className="font-mono text-slate-200">status === &apos;active&apos;</code>. Other statuses (<code className="font-mono text-slate-400">deleted, inactive, disabled, pending</code>) map to false.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">createdAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string (ISO 8601)</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">created_time</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Date / String</td>
                  <td className="px-4 py-2.5">Normalized to UTC ISO 8601. Fallback: <code className="text-amber-300 font-mono">1970-01-01T00:00:00.000Z</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">updatedAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string (ISO 8601)</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">modified_time, created_time</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Date / String</td>
                  <td className="px-4 py-2.5">Normalized to UTC ISO 8601. Falls back to <code className="font-mono">created_time</code>, then Unix Epoch if missing.</td>
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
              <span className="font-semibold text-white text-sm block">1. Name Normalization</span>
              <p className="text-slate-300 leading-relaxed">
                Uses <code className="font-mono text-sky-300">extractNames()</code>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Reads <code className="font-mono">first_name</code> and <code className="font-mono">last_name</code>.</li>
                <li>If either is missing, splits <code className="font-mono">full_name || name</code> by whitespace. The last token becomes <code className="font-mono text-slate-200">lastName</code>; earlier tokens form <code className="font-mono text-slate-200">firstName</code>.</li>
                <li><strong>Mononyms:</strong> Single words (e.g. <em>&quot;Sumanth&quot;</em>) map to <code className="font-mono text-slate-200">lastName</code>, with <code className="font-mono text-slate-200">firstName = &quot;&quot;</code>.</li>
                <li>Converts names to Title Case, properly preserving hyphens (<em>Mary-Jane</em>) and apostrophes (<em>O&apos;Connor</em>).</li>
              </ul>
            </div>

            {/* Email Sanitization */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">2. Email Sanitization</span>
              <p className="text-slate-300 leading-relaxed">
                Uses <code className="font-mono text-emerald-300">sanitizeEmail()</code>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Lowercases and strips all internal and trailing whitespace.</li>
                <li>Rejects invalid formats, strings without <code className="font-mono">@</code>, or literals like <code className="font-mono">&quot;null&quot;</code>.</li>
                <li>
                  <strong>Corporate Fallback:</strong> If missing or invalid, defaults to{' '}
                  <code className="text-amber-300 font-mono">notprovided@worldvisa.in</code>.
                </li>
              </ul>
            </div>

            {/* Phone Normalization */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">3. Indian Phone Formatting (+91)</span>
              <p className="text-slate-300 leading-relaxed">
                Uses <code className="font-mono text-amber-300">normalizeIndianPhone()</code>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Checks primary <code className="font-mono">phone</code>, falls back to <code className="font-mono">mobile</code>.</li>
                <li>Strips all non-digit characters.</li>
                <li><strong>10 digits:</strong> Prepends <code className="font-mono text-slate-200">+91</code> (e.g. <code className="font-mono text-slate-200">+919800000000</code>).</li>
                <li><strong>12 digits (starts with 91):</strong> Prepends <code className="font-mono text-slate-200">+</code>.</li>
                <li><strong>11 digits (starts with 0):</strong> Removes leading 0 and prepends <code className="font-mono text-slate-200">+91</code>.</li>
                <li><strong>Fallback:</strong> Irregular/missing numbers default to <code className="text-amber-300 font-mono">+919999999999</code>.</li>
              </ul>
            </div>

            {/* Role & Dept Derivation */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">4. Role & Department Resolution</span>
              <p className="text-slate-300 leading-relaxed">
                Uses <code className="font-mono text-purple-300">resolveStaffRoleAndDepartment()</code>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li><strong>Tier 1:</strong> Exact match on titles (e.g. <em>CEO</em> &rarr; <code className="text-slate-200">director</code>, <em>Sales Executive</em> &rarr; <code className="text-slate-200">sales_executive</code>).</li>
                <li><strong>Tier 2:</strong> Substring hierarchy (Finance &rarr; Marketing &rarr; Processing &rarr; Sales).</li>
                <li>Matches leadership levels: <em>Manager</em>, <em>Team Leader</em>, <em>Supervisor</em>, <em>Executive</em>.</li>
                <li><strong>Fallback:</strong> Unmapped roles default to <code className="text-amber-300 font-mono">role: sales_executive</code>, <code className="text-amber-300 font-mono">department: sales</code>.</li>
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
            <h2 className="text-xl font-bold text-white tracking-tight">Zoho Enums & Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status mapping */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">User Status &rarr; isActive Boolean</span>
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c1322]">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-900/70 font-semibold text-slate-300">
                    <tr>
                      <th className="px-3.5 py-2">Zoho Source Status</th>
                      <th className="px-3.5 py-2">isActive</th>
                      <th className="px-3.5 py-2">Context</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-emerald-400 font-semibold">&apos;active&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-emerald-400 font-bold">true</td>
                      <td className="px-3.5 py-2 text-slate-400">Authorized user.</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-rose-400">&apos;deleted&apos; / &apos;disabled&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-rose-400 font-bold">false</td>
                      <td className="px-3.5 py-2 text-slate-400">Soft-deleted or blocked.</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-rose-400">&apos;inactive&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-rose-400 font-bold">false</td>
                      <td className="px-3.5 py-2 text-slate-400">Inactive employee.</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-amber-400">&apos;pending&apos; / &apos;confirmed&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-rose-400 font-bold">false</td>
                      <td className="px-3.5 py-2 text-slate-400">Unaccepted invite.</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-slate-500">null / empty</td>
                      <td className="px-3.5 py-2 font-mono text-rose-400 font-bold">false</td>
                      <td className="px-3.5 py-2 text-slate-400">Secure default.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Target Enums */}
            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-1.5">Target Departments (StaffDepartment)</span>
                <div className="flex flex-wrap gap-1.5">
                  {['sales', 'processing', 'finance', 'marketing'].map(d => (
                    <span key={d} className="rounded bg-sky-500/10 px-2.5 py-0.5 font-mono text-xs text-sky-300 border border-sky-500/20">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-1.5">Target Roles (StaffRole)</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'director',
                    'branch_manager',
                    'sales_manager',
                    'sales_executive',
                    'sales_team_leader',
                    'processing_manager',
                    'processing_executive',
                    'processing_team_leader',
                    'processing_supervisor',
                    'finance_manager',
                    'finance_executive',
                    'marketing_manager',
                    'marketing_executive',
                  ].map(r => (
                    <span key={r} className="rounded bg-purple-500/10 px-2 py-0.5 font-mono text-[11px] text-purple-300 border border-purple-500/20">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Role mapping summary */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0c1322] mt-3">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/70 font-semibold text-slate-300">
                <tr>
                  <th className="px-4 py-2">Source Zoho Role Title</th>
                  <th className="px-4 py-2">Mapped Target Role</th>
                  <th className="px-4 py-2">Mapped Target Department</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr>
                  <td className="px-4 py-2 font-mono text-sky-300">&quot;CEO&quot; / &quot;Managing Director&quot;</td>
                  <td className="px-4 py-2 font-mono text-emerald-400">director</td>
                  <td className="px-4 py-2 font-mono text-slate-300">sales</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-sky-300">&quot;General Manager&quot; / &quot;Branch Manager&quot;</td>
                  <td className="px-4 py-2 font-mono text-emerald-400">branch_manager</td>
                  <td className="px-4 py-2 font-mono text-slate-300">sales</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-sky-300">&quot;Sales Manager&quot;</td>
                  <td className="px-4 py-2 font-mono text-emerald-400">sales_manager</td>
                  <td className="px-4 py-2 font-mono text-slate-300">sales</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-sky-300">&quot;Sales Executive&quot;</td>
                  <td className="px-4 py-2 font-mono text-emerald-400">sales_executive</td>
                  <td className="px-4 py-2 font-mono text-slate-300">sales</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-sky-300">&quot;Operation Manager&quot; / &quot;Operations Manager&quot;</td>
                  <td className="px-4 py-2 font-mono text-emerald-400">processing_manager</td>
                  <td className="px-4 py-2 font-mono text-slate-300">processing</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-sky-300">&quot;Canada Operations&quot; / &quot;Australia Operations&quot;</td>
                  <td className="px-4 py-2 font-mono text-emerald-400">processing_executive</td>
                  <td className="px-4 py-2 font-mono text-slate-300">processing</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-sky-300">Finance roles (e.g. <em>Finance Head</em>, <em>Accountant</em>)</td>
                  <td className="px-4 py-2 font-mono text-emerald-400">finance_manager / finance_executive</td>
                  <td className="px-4 py-2 font-mono text-slate-300">finance</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-sky-300">Marketing roles (e.g. <em>Digital Marketing Lead</em>)</td>
                  <td className="px-4 py-2 font-mono text-emerald-400">marketing_manager / marketing_executive</td>
                  <td className="px-4 py-2 font-mono text-slate-300">marketing</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-slate-400">Unrecognized custom role or null</td>
                  <td className="px-4 py-2 font-mono text-amber-300">sales_executive</td>
                  <td className="px-4 py-2 font-mono text-amber-300">sales</td>
                </tr>
              </tbody>
            </table>
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
                  <td className="px-4 py-2.5">Missing <code className="font-mono">first_name</code></td>
                  <td className="px-4 py-2.5">Extracts earlier tokens from <code className="font-mono">full_name</code> / <code className="font-mono">name</code></td>
                  <td className="px-4 py-2.5 font-mono text-slate-200">Parsed token or &quot;&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">lastName</td>
                  <td className="px-4 py-2.5">Missing <code className="font-mono">last_name</code></td>
                  <td className="px-4 py-2.5">Extracts final token from <code className="font-mono">full_name</code> / <code className="font-mono">name</code></td>
                  <td className="px-4 py-2.5 font-mono text-slate-200">Parsed token or &quot;&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">email</td>
                  <td className="px-4 py-2.5">Missing or invalid email</td>
                  <td className="px-4 py-2.5">Corporate staff default</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300 font-bold">&quot;notprovided@worldvisa.in&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">phone</td>
                  <td className="px-4 py-2.5">Missing <code className="font-mono">phone</code></td>
                  <td className="px-4 py-2.5">Falls back to <code className="font-mono">mobile</code></td>
                  <td className="px-4 py-2.5 font-mono text-slate-200">+91 normalized mobile</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">phone</td>
                  <td className="px-4 py-2.5">Missing/invalid <code className="font-mono">phone</code> &amp; <code className="font-mono">mobile</code></td>
                  <td className="px-4 py-2.5">Standard placeholder</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300 font-bold">&quot;+919999999999&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">role &amp; department</td>
                  <td className="px-4 py-2.5">Missing or unknown <code className="font-mono">role_name</code></td>
                  <td className="px-4 py-2.5">Organizational baseline default</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300 font-bold">role: &quot;sales_executive&quot;, dept: &quot;sales&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">isActive</td>
                  <td className="px-4 py-2.5">Status not explicitly &apos;active&apos;</td>
                  <td className="px-4 py-2.5">Strict boolean evaluation</td>
                  <td className="px-4 py-2.5 font-mono text-rose-400 font-bold">false</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">createdAt</td>
                  <td className="px-4 py-2.5">Missing/invalid <code className="font-mono">created_time</code></td>
                  <td className="px-4 py-2.5">Unix Epoch UTC</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300 font-bold">&quot;1970-01-01T00:00:00.000Z&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">updatedAt</td>
                  <td className="px-4 py-2.5">Missing/invalid <code className="font-mono">modified_time</code></td>
                  <td className="px-4 py-2.5">Falls back to <code className="font-mono">created_time</code></td>
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
              <span className="font-semibold text-white">Mononyms &amp; Single Names</span>
              <p className="text-slate-300 leading-relaxed">
                When a user has only a single name in Zoho (e.g. <em>&quot;Asha&quot;</em>), it is mapped to <code className="font-mono text-emerald-400">lastName</code> with <code className="font-mono text-emerald-400">firstName = &quot;&quot;</code>, ensuring compliance with destination databases where <code className="font-mono">lastName</code> is required.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-1.5">
              <span className="font-semibold text-white">Corporate Email Default</span>
              <p className="text-slate-300 leading-relaxed">
                Staff API defaults missing emails to <code className="font-mono text-amber-300">notprovided@worldvisa.in</code> (instead of <code className="font-mono">@gmail.com</code> used for leads), distinguishing internal employees from external clients.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-1.5">
              <span className="font-semibold text-white">All-Caps / Inconsistent Casing</span>
              <p className="text-slate-300 leading-relaxed">
                Names entered in ALL CAPS (e.g. <em>&quot;MOHAMMED IRFAN&quot;</em>) or lowercase are cleanly formatted to Title Case (<em>&quot;Mohammed Irfan&quot;</em>).
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-1.5">
              <span className="font-semibold text-white">Flat Migration Envelope</span>
              <p className="text-slate-300 leading-relaxed">
                Uses <code className="font-mono text-emerald-400">@BypassTransform()</code> to emit the direct migration payload (<code className="font-mono">data, total, page, pageSize, hasMore</code>) rather than standard API status envelopes.
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
              title="StaffItemDto & StaffResponseDto"
              code={`export interface StaffItemDto {
  externalId: string;        // Original Zoho ID (zoho_id)
  email: string;             // Lowercased email or 'notprovided@worldvisa.in'
  firstName: string;         // Title-Cased first name
  lastName: string;          // Title-Cased last name
  phone: string;             // +91XXXXXXXXXX or '+919999999999'
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
}`}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Example Response (200 OK)</h3>
            <CodeBlock
              language="json"
              title="GET /api/v1/staff?page=1&limit=2"
              code={`{
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
      "email": "notprovided@worldvisa.in",
      "firstName": "",
      "lastName": "Sumanth",
      "phone": "+919999999999",
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
