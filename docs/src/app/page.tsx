import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  CheckSquare,
  Database,
  FileText,
  Inbox,
  Layers,
  PhoneCall,
  Server,
  Sparkles,
  UserCheck,
  Users,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-[#0d1527] to-[#090d16] p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Zoho Data Migration Engine</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Technical Extraction & Mapping Documentation
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            In-depth architectural reference for the Zoho CRM and Zoho Books migration pipeline.
            Unlike high-level API guides, this repository documents the complete underlying database
            lineage, transformation rules, field-by-field sanitizations, enum translations, and fallback
            strategies used across all migration endpoints.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/apis/staff"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <Users className="h-4 w-4" />
              <span>Explore Staff API Documentation</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="http://localhost:5050/api/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
            >
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Interactive Swagger UI</span>
            </a>
          </div>
        </div>
      </div>

      {/* Migration Architectural Principles */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Migration Architecture & Data Flow</h2>
          <p className="text-sm text-slate-400 mt-1">
            How raw Zoho JSON collections are transformed into standardized operational entities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-800 bg-[#0f172a] p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-white text-base">1. Migrated Zoho Data Layer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zoho CRM and Books data is stored in specialized MongoDB collections (e.g.{' '}
              <code className="text-slate-300 font-mono">migrated_users</code>,{' '}
              <code className="text-slate-300 font-mono">migrated_leads</code>,{' '}
              <code className="text-slate-300 font-mono">migrated_contacts</code>) retaining complete
              original Zoho field fidelity and unparsed JSON payload blobs.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0f172a] p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-white text-base">2. Deterministic Transformation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Each module service executes strict sanitization: Title Case capitalization, Indian phone (+91)
              standardization, UTC timestamp parsing, hierarchical enum mapping, and robust fallbacks
              preventing schema contamination.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0f172a] p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Server className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-white text-base">3. Flat Migration Envelope</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Endpoints bypass ordinary API envelope wrappers via{' '}
              <code className="text-emerald-300 font-mono">@BypassTransform()</code>, serving direct
              migration contracts with chronological sorting (<code className="text-slate-300 font-mono">created_time: 1</code>)
              and <code className="text-emerald-300 font-mono">hasMore</code> pagination.
            </p>
          </div>
        </div>
      </div>

      {/* Module Status Matrix */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Migration Endpoint Catalog</h2>
          <p className="text-sm text-slate-400 mt-1">
            Current status of individual endpoint specifications in this documentation project.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0f172a]">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-900/60 font-medium text-slate-400">
              <tr>
                <th className="px-5 py-3">API Module</th>
                <th className="px-5 py-3">HTTP Endpoint</th>
                <th className="px-5 py-3">Source Collection</th>
                <th className="px-5 py-3">Documentation Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr className="hover:bg-slate-800/40 transition">
                <td className="px-5 py-3.5 font-semibold text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-sky-400" />
                  <span>Staff</span>
                </td>
                <td className="px-5 py-3.5 font-mono text-sky-400">GET /api/v1/staff</td>
                <td className="px-5 py-3.5 font-mono text-slate-400">migrated_users</td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Complete & Documented
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    href="/apis/staff"
                    className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium"
                  >
                    <span>View Docs</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition">
                <td className="px-5 py-3.5 font-semibold text-white flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-sky-400" />
                  <span>Clients (Leads & Contacts)</span>
                </td>
                <td className="px-5 py-3.5 font-mono text-sky-400">GET /api/v1/clients</td>
                <td className="px-5 py-3.5 font-mono text-slate-400">migrated_leads, migrated_contacts</td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Complete & Documented
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    href="/apis/clients"
                    className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium"
                  >
                    <span>View Docs</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition">
                <td className="px-5 py-3.5 font-semibold text-white flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-sky-400" />
                  <span>Tasks</span>
                </td>
                <td className="px-5 py-3.5 font-mono text-sky-400">GET /api/v1/tasks</td>
                <td className="px-5 py-3.5 font-mono text-slate-400">migrated_tasks</td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Complete & Documented
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    href="/apis/tasks"
                    className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium"
                  >
                    <span>View Docs</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition">
                <td className="px-5 py-3.5 font-semibold text-white flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-sky-400" />
                  <span>Calls</span>
                </td>
                <td className="px-5 py-3.5 font-mono text-sky-400">GET /api/v1/calls</td>
                <td className="px-5 py-3.5 font-mono text-slate-400">migrated_calls</td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Complete & Documented
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    href="/apis/calls"
                    className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium"
                  >
                    <span>View Docs</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition">
                <td className="px-5 py-3.5 font-semibold text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-sky-400" />
                  <span>Notes</span>
                </td>
                <td className="px-5 py-3.5 font-mono text-sky-400">GET /api/v1/notes</td>
                <td className="px-5 py-3.5 font-mono text-slate-400">migrated_notes</td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Complete & Documented
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    href="/apis/notes"
                    className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium"
                  >
                    <span>View Docs</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition">
                <td className="px-5 py-3.5 font-semibold text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-sky-400" />
                  <span>Meetings / Events</span>
                </td>
                <td className="px-5 py-3.5 font-mono text-sky-400">GET /api/v1/meetings</td>
                <td className="px-5 py-3.5 font-mono text-slate-400">migrated_events, migrated_meeting_recordings</td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Complete & Documented
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    href="/apis/meetings"
                    className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium"
                  >
                    <span>View Docs</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition">
                <td className="px-5 py-3.5 font-semibold text-white flex items-center gap-2">
                  <Inbox className="h-4 w-4 text-sky-400" />
                  <span>Enquiries</span>
                </td>
                <td className="px-5 py-3.5 font-mono text-sky-400">GET /api/v1/enquiries</td>
                <td className="px-5 py-3.5 font-mono text-slate-400">migrated_leads, migrated_contacts</td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Complete & Documented
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    href="/apis/enquiries"
                    className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium"
                  >
                    <span>View Docs</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

