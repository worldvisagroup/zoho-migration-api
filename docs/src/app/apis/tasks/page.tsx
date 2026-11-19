import React from 'react';
import { MethodBadge } from '../../../components/MethodBadge';
import { Callout } from '../../../components/Callout';
import { CodeBlock } from '../../../components/CodeBlock';
import { TableOfContents } from '../../../components/TableOfContents';
import { CheckSquare, Database, CheckCircle2 } from 'lucide-react';

const tocItems = [
  { id: 'overview', title: '1. API Overview' },
  { id: 'field-mapping', title: '2. Zoho Field Mapping' },
  { id: 'transformation-logic', title: '3. Field Transformation Logic' },
  { id: 'enums-and-values', title: '4. Zoho Enums & Values' },
  { id: 'fallback-strategy', title: '5. Fallback Strategy' },
  { id: 'key-notes', title: '6. Key Edge Cases' },
  { id: 'response-reference', title: '7. Response Reference' },
];

export default function TasksApiDocPage() {
  return (
    <div className="flex gap-10">
      <div className="flex-1 min-w-0 space-y-10 pb-20">
        {/* Header */}
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 border border-sky-500/20">
              <CheckSquare className="h-3.5 w-3.5" />
              <span>CRM Activities Module</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" />
              Production Ready
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">Tasks API</h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            Technical mapping and extraction reference for migrating internal and customer-facing task activities from Zoho CRM (<code className="text-sky-300 font-mono">migrated_tasks</code>) with polymorphic parent filtering and batch identity resolution.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-1.5 font-mono text-xs text-slate-200">
              <MethodBadge method="GET" />
              <span className="font-semibold text-white">/api/v1/tasks</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Database className="h-3.5 w-3.5 text-slate-400" />
              <span>Collection:</span>
              <code className="text-sky-300 font-mono">migrated_tasks</code>
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
            The Tasks API extracts all CRM action items, follow-ups, and operational tasks from <code className="text-sky-300 font-mono">migrated_tasks</code>. It normalizes irregular Zoho statuses into standard states (<code className="font-mono text-slate-200">todo</code>, <code className="font-mono text-slate-200">in_progress</code>, <code className="font-mono text-slate-200">done</code>) with a strict <code className="font-mono text-emerald-400">is_closed</code> override, maps priority levels, batch resolves assignee/creator/modifier email addresses from <code className="text-sky-300 font-mono">migrated_users</code>, computes completion timestamps, and supports polymorphic parent entity filtering.
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
                  <td className="px-4 py-2.5">Filter tasks linked to a specific Zoho Lead (<code className="text-slate-300">_zoho_lead_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">zohoContactId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsString()</td>
                  <td className="px-4 py-2.5">Filter tasks linked to a specific Zoho Contact (<code className="text-slate-300">_zoho_contact_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">zohoDealId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsString()</td>
                  <td className="px-4 py-2.5">Filter tasks linked to a specific Zoho Deal (<code className="text-slate-300">_zoho_deal_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">visaApplicationId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsString()</td>
                  <td className="px-4 py-2.5">Filter tasks linked to a Visa Application (<code className="text-slate-300">_zoho_visa_application_id</code>).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">spouseSkillAssessmentId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsString()</td>
                  <td className="px-4 py-2.5">Filter tasks linked to a Spouse Skill Assessment.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">type</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">enum</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsIn(TASK_PARENT_TYPES)</td>
                  <td className="px-4 py-2.5">Filter by parent type: <code className="text-slate-200">lead, contact, deal, visa_application, spouse_skill_assessment, task, event, signed_document</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">page</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">number</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">1</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsInt(), @Min(1)</td>
                  <td className="px-4 py-2.5">1-indexed page number for pagination.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">limit</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">number</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">200</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsInt(), @Min(1), @Max(1000)</td>
                  <td className="px-4 py-2.5">Records per page (capped at 1,000).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">from</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">ISO 8601</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsISO8601({'{ strict: true }'})</td>
                  <td className="px-4 py-2.5">Inclusive start date filter on Zoho <code className="text-slate-200">Created_Time</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-sky-300">to</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">ISO 8601</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">—</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300">@IsISO8601({'{ strict: true }'})</td>
                  <td className="px-4 py-2.5">Inclusive end date filter on Zoho <code className="text-slate-200">Created_Time</code>.</td>
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
            Direct mapping from the raw MongoDB collection <code className="font-mono text-sky-300">migrated_tasks</code> to the target API response model.
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
                  <td className="px-4 py-2.5">Direct 1:1 copy of Zoho task unique ID.</td>
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
                  <td className="px-4 py-2.5 font-mono text-sky-300">Subject</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Trimmed string. Defaults to empty string <code className="text-slate-300 font-mono">&quot;&quot;</code> if missing.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">description</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Description</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Trimmed plain text. Returns <code className="text-slate-400 font-mono">null</code> if empty or missing.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">status</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">TargetTaskStatus</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Status, is_closed</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String, Boolean</td>
                  <td className="px-4 py-2.5">Normalized to <code className="text-slate-200 font-mono">todo</code>, <code className="text-slate-200 font-mono">in_progress</code>, or <code className="text-slate-200 font-mono">done</code>. <code className="text-emerald-400 font-mono">is_closed === true</code> forces <code className="text-slate-200 font-mono">done</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">priority</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">TargetTaskPriority</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Priority</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Mapped to <code className="text-slate-200 font-mono">urgent</code> (Highest), <code className="text-slate-200 font-mono">high</code>, <code className="text-slate-200 font-mono">medium</code> (Normal/Default), <code className="text-slate-200 font-mono">low</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">dueDate</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Due_Date</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Date / String</td>
                  <td className="px-4 py-2.5">Normalized to UTC ISO 8601 string or <code className="text-slate-400 font-mono">null</code> if missing.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">assigneeId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_owner_id</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Cleaned Zoho user ID of task owner, or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">assigneeEmail</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_owner_id &rarr; migrated_users</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Lookup</td>
                  <td className="px-4 py-2.5">Resolved staff email address via single-pass batch lookup, or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">createdByZohoId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_created_by_id</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Cleaned Zoho user ID of task creator, or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">createdByEmail</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_created_by_id &rarr; migrated_users</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Lookup</td>
                  <td className="px-4 py-2.5">Resolved creator email address via batch lookup, or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">modifiedByZohoId</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_modified_by_id</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">String</td>
                  <td className="px-4 py-2.5">Cleaned Zoho user ID of last modifier, or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">modifiedByEmail</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">_zoho_modified_by_id &rarr; migrated_users</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Lookup</td>
                  <td className="px-4 py-2.5">Resolved modifier email address via batch lookup, or <code className="text-slate-400 font-mono">null</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">createdAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string (ISO 8601)</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Created_Time</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Date / String</td>
                  <td className="px-4 py-2.5">Normalized to UTC ISO 8601. Fallback: <code className="text-amber-300 font-mono">1970-01-01T00:00:00.000Z</code>.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">modifiedAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string (ISO 8601)</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Modified_Time, Created_Time</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Date / String</td>
                  <td className="px-4 py-2.5">Primary <code className="font-mono">Modified_Time</code>, falls back to <code className="font-mono">Created_Time</code>. Never null.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">completedAt</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">string | null</td>
                  <td className="px-4 py-2.5 font-mono text-sky-300">Closed_Time, Modified_Time, Created_Time</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">Date / String</td>
                  <td className="px-4 py-2.5">
                    <strong>If status === &apos;done&apos;:</strong> <code className="font-mono">Closed_Time &rarr; Modified_Time &rarr; Created_Time</code>.<br />
                    <strong>If status !== &apos;done&apos;:</strong> strictly <code className="font-mono text-slate-400">null</code>.
                  </td>
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
            {/* Status Normalization */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">1. Status Normalization &amp; Closed Override</span>
              <p className="text-slate-300 leading-relaxed">
                Uses <code className="font-mono text-sky-300">normalizeTaskStatus(Status, is_closed)</code>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li><strong className="text-emerald-400">Rule 1 (Boolean Override):</strong> If <code className="font-mono text-slate-200">is_closed === true</code>, always returns <code className="font-mono text-emerald-400">done</code>, even if textual Status is contradictory.</li>
                <li><strong className="text-slate-200">Rule 2 (Completed Keywords):</strong> <code className="font-mono text-slate-200">completed</code>, <code className="font-mono text-slate-200">closed</code>, or <code className="font-mono text-slate-200">done</code> &rarr; <code className="font-mono text-emerald-400">done</code>.</li>
                <li><strong className="text-slate-200">Rule 3 (In Progress):</strong> <code className="font-mono text-slate-200">in progress</code>, <code className="font-mono text-slate-200">in_progress</code> &rarr; <code className="font-mono text-sky-400">in_progress</code>.</li>
                <li><strong className="text-slate-200">Rule 4 (Open Fallbacks):</strong> All other values (<em>Not Started</em>, <em>Deferred</em>, <em>Waiting on someone else</em>, empty, null) default to <code className="font-mono text-amber-300">todo</code>.</li>
              </ul>
            </div>

            {/* Priority Normalization */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">2. Priority Normalization</span>
              <p className="text-slate-300 leading-relaxed">
                Uses <code className="font-mono text-purple-300">normalizeTaskPriority(Priority)</code>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li><code className="font-mono text-rose-400">highest</code> &rarr; maps to <code className="font-mono text-rose-400">urgent</code>.</li>
                <li><code className="font-mono text-amber-400">high</code> &rarr; maps to <code className="font-mono text-amber-400">high</code>.</li>
                <li><code className="font-mono text-sky-400">normal</code> &rarr; maps to <code className="font-mono text-sky-400">medium</code>.</li>
                <li><code className="font-mono text-slate-400">low</code>, <code className="font-mono text-slate-400">lowest</code> &rarr; map to <code className="font-mono text-slate-400">low</code>.</li>
                <li><strong>Fallback:</strong> Unrecognized or missing priorities default to <code className="font-mono text-sky-400">medium</code>.</li>
              </ul>
            </div>

            {/* CompletedAt Calculation */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">3. Completion Timestamp Resolution</span>
              <p className="text-slate-300 leading-relaxed">
                Uses <code className="font-mono text-emerald-300">resolveCompletedAt()</code>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li><strong>Active Tasks:</strong> If normalized status is not <code className="font-mono text-emerald-400">done</code>, returns strictly <code className="font-mono text-slate-400">null</code>.</li>
                <li><strong>Done Tasks (3-Tier Fallback):</strong>
                  <ol className="list-decimal list-inside pl-2 pt-0.5 space-y-0.5 text-slate-300">
                    <li><code className="font-mono text-slate-200">Closed_Time</code> if valid.</li>
                    <li><code className="font-mono text-slate-200">Modified_Time</code> if valid.</li>
                    <li><code className="font-mono text-slate-200">Created_Time</code> (guaranteed non-null timestamp).</li>
                  </ol>
                </li>
              </ul>
            </div>

            {/* Batch Email Resolution */}
            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-2">
              <span className="font-semibold text-white text-sm block">4. Single-Pass Staff Email Batching</span>
              <p className="text-slate-300 leading-relaxed">
                Prevents N+1 database queries during batch ingestion:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Extracts all unique IDs from <code className="font-mono text-slate-300">_zoho_owner_id</code>, <code className="font-mono text-slate-300">_zoho_created_by_id</code>, and <code className="font-mono text-slate-300">_zoho_modified_by_id</code> across the page.</li>
                <li>Executes a single indexed query: <code className="font-mono text-sky-300">{`userModel.find({ zoho_id: { $in: uniqueIds } })`}</code>.</li>
                <li>Maps each ID to its sanitized email address in memory for instant DTO projection.</li>
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
              <span className="text-xs font-semibold text-slate-300">Task Status Mapping Matrix</span>
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c1322]">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-900/70 font-semibold text-slate-300">
                    <tr>
                      <th className="px-3.5 py-2">Source Status</th>
                      <th className="px-3.5 py-2">is_closed</th>
                      <th className="px-3.5 py-2">Mapped Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-slate-300">Any status</td>
                      <td className="px-3.5 py-2 font-mono text-emerald-400 font-bold">true</td>
                      <td className="px-3.5 py-2 font-mono text-emerald-400 font-bold">&apos;done&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-sky-300">&apos;Completed&apos; / &apos;Closed&apos; / &apos;Done&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-slate-400">false / null</td>
                      <td className="px-3.5 py-2 font-mono text-emerald-400 font-bold">&apos;done&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-sky-300">&apos;In Progress&apos; / &apos;In_Progress&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-slate-400">false / null</td>
                      <td className="px-3.5 py-2 font-mono text-sky-400 font-semibold">&apos;in_progress&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-slate-400">&apos;Not Started&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-slate-400">false / null</td>
                      <td className="px-3.5 py-2 font-mono text-amber-300 font-semibold">&apos;todo&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-slate-400">&apos;Deferred&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-slate-400">false / null</td>
                      <td className="px-3.5 py-2 font-mono text-amber-300 font-semibold">&apos;todo&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-slate-400">&apos;Waiting on someone else&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-slate-400">false / null</td>
                      <td className="px-3.5 py-2 font-mono text-amber-300 font-semibold">&apos;todo&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-slate-500">Unrecognized / null</td>
                      <td className="px-3.5 py-2 font-mono text-slate-400">false / null</td>
                      <td className="px-3.5 py-2 font-mono text-amber-300 font-semibold">&apos;todo&apos;</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Priority mapping */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">Task Priority Mapping Matrix</span>
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c1322]">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-900/70 font-semibold text-slate-300">
                    <tr>
                      <th className="px-3.5 py-2">Zoho Source Priority</th>
                      <th className="px-3.5 py-2">Mapped Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-sky-300">&apos;Highest&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-rose-400 font-bold">&apos;urgent&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-sky-300">&apos;High&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-amber-400 font-semibold">&apos;high&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-sky-300">&apos;Normal&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-sky-400 font-semibold">&apos;medium&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-sky-300">&apos;Low&apos; / &apos;Lowest&apos;</td>
                      <td className="px-3.5 py-2 font-mono text-slate-400">&apos;low&apos;</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-slate-500">Missing / Unrecognized / null</td>
                      <td className="px-3.5 py-2 font-mono text-sky-400">&apos;medium&apos; (default)</td>
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
                  <td className="px-4 py-2.5">Missing or null <code className="font-mono">Subject</code></td>
                  <td className="px-4 py-2.5">Empty string assignment</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">&quot;&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">description</td>
                  <td className="px-4 py-2.5">Missing or whitespace-only <code className="font-mono">Description</code></td>
                  <td className="px-4 py-2.5">Nullable string assignment</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">status</td>
                  <td className="px-4 py-2.5">Missing or unrecognized <code className="font-mono">Status</code> without closed flag</td>
                  <td className="px-4 py-2.5">Open default assignment</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300 font-bold">&quot;todo&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">priority</td>
                  <td className="px-4 py-2.5">Missing or unrecognized <code className="font-mono">Priority</code></td>
                  <td className="px-4 py-2.5">Baseline default assignment</td>
                  <td className="px-4 py-2.5 font-mono text-sky-400 font-bold">&quot;medium&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">dueDate</td>
                  <td className="px-4 py-2.5">Missing or invalid <code className="font-mono">Due_Date</code></td>
                  <td className="px-4 py-2.5">Nullable ISO assignment</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">assigneeEmail</td>
                  <td className="px-4 py-2.5">User not found in <code className="font-mono">migrated_users</code> or missing owner</td>
                  <td className="px-4 py-2.5">Lookup miss</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">createdByEmail</td>
                  <td className="px-4 py-2.5">Creator not found in <code className="font-mono">migrated_users</code></td>
                  <td className="px-4 py-2.5">Lookup miss</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">modifiedByEmail</td>
                  <td className="px-4 py-2.5">Modifier not found in <code className="font-mono">migrated_users</code></td>
                  <td className="px-4 py-2.5">Lookup miss</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">createdAt</td>
                  <td className="px-4 py-2.5">Missing/invalid <code className="font-mono">Created_Time</code></td>
                  <td className="px-4 py-2.5">Unix Epoch UTC</td>
                  <td className="px-4 py-2.5 font-mono text-amber-300 font-bold">&quot;1970-01-01T00:00:00.000Z&quot;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">modifiedAt</td>
                  <td className="px-4 py-2.5">Missing/invalid <code className="font-mono">Modified_Time</code></td>
                  <td className="px-4 py-2.5">Falls back to <code className="font-mono">Created_Time</code></td>
                  <td className="px-4 py-2.5 font-mono text-slate-200">createdAt value or Epoch</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">completedAt</td>
                  <td className="px-4 py-2.5">Task is done but missing <code className="font-mono">Closed_Time</code></td>
                  <td className="px-4 py-2.5">Falls back to <code className="font-mono">Modified_Time</code>, then <code className="font-mono">Created_Time</code></td>
                  <td className="px-4 py-2.5 font-mono text-slate-200">modifiedAt / createdAt</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-semibold">completedAt</td>
                  <td className="px-4 py-2.5">Task status is not <code className="font-mono">&apos;done&apos;</code></td>
                  <td className="px-4 py-2.5">Non-completion rule</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">null</td>
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
              <span className="font-semibold text-white">is_closed Override Overrules Status Text</span>
              <p className="text-slate-300 leading-relaxed">
                In Zoho CRM, workflow rules often toggle the boolean <code className="font-mono text-emerald-400">is_closed: true</code> while leaving legacy status picklist values as <em>&quot;In Progress&quot;</em> or <em>&quot;Deferred&quot;</em>. The normalization engine treats <code className="font-mono">is_closed: true</code> as the authoritative signal, forcing the task to <code className="font-mono text-emerald-400">done</code>.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-1.5">
              <span className="font-semibold text-white">completedAt Guaranteed Non-Null for Done Tasks</span>
              <p className="text-slate-300 leading-relaxed">
                If a task is marked <code className="font-mono text-emerald-400">done</code>, <code className="font-mono text-slate-200">completedAt</code> will never be null. If <code className="font-mono">Closed_Time</code> was omitted by Zoho, the engine cascades through <code className="font-mono">Modified_Time</code> and <code className="font-mono">Created_Time</code>. Conversely, active tasks (<code className="font-mono">todo</code>, <code className="font-mono">in_progress</code>) are strictly <code className="font-mono">null</code>.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-1.5">
              <span className="font-semibold text-white">Polymorphic Parent Entity Relationships</span>
              <p className="text-slate-300 leading-relaxed">
                Zoho CRM links tasks across multiple modules using polymorphic lookups. The API enables targeted parent filtering across <code className="font-mono text-sky-300">zohoLeadId</code>, <code className="font-mono text-sky-300">zohoContactId</code>, <code className="font-mono text-sky-300">zohoDealId</code>, <code className="font-mono text-sky-300">visaApplicationId</code>, and <code className="font-mono text-sky-300">spouseSkillAssessmentId</code>.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0c1322] p-4 space-y-1.5">
              <span className="font-semibold text-white">modifiedAt Never-Null Guarantee</span>
              <p className="text-slate-300 leading-relaxed">
                Even if Zoho records omit <code className="font-mono">Modified_Time</code> upon initial creation, <code className="font-mono text-slate-200">modifiedAt</code> falls back to <code className="font-mono">Created_Time</code>, ensuring target databases with non-null updated timestamp constraints remain valid.
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
              title="TaskItemDto & TasksResponseDto"
              code={`export type TargetTaskStatus = 'todo' | 'in_progress' | 'done';
export type TargetTaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskItemDto {
  externalId: string;                 // Original Zoho ID (zoho_id)
  parentType: string | null;          // Type of parent record (lead, contact, deal, etc.)
  parentZohoId: string | null;        // Original Zoho ID of parent record
  title: string;                      // Task Subject
  description: string | null;         // Plain text description or null
  status: TargetTaskStatus;           // 'todo' | 'in_progress' | 'done'
  priority: TargetTaskPriority;       // 'low' | 'medium' | 'high' | 'urgent'
  dueDate: string | null;             // UTC ISO 8601 due date or null
  assigneeEmail: string | null;       // Resolved staff email from migrated_users
  assigneeId: string | null;          // Zoho owner ID (_zoho_owner_id)
  createdByEmail: string | null;      // Resolved creator email
  createdByZohoId: string | null;     // Zoho creator ID (_zoho_created_by_id)
  createdAt: string;                  // Zoho Created_Time in UTC ISO 8601
  modifiedAt: string;                 // Zoho Modified_Time in UTC ISO 8601
  modifiedByEmail: string | null;     // Resolved modifier email or null
  modifiedByZohoId: string | null;    // Zoho modifier ID or null
  completedAt: string | null;         // Completion timestamp (only if status === 'done')
}

export interface TasksResponseDto {
  data: TaskItemDto[];
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
              title="GET /api/v1/tasks?page=1&limit=2"
              code={`{
  "data": [
    {
      "externalId": "164193000053851467",
      "parentType": "lead",
      "parentZohoId": "164193000000811047",
      "title": "Call client regarding skill assessment document verification",
      "description": "Client requested guidance on ACS Australia employment reference letters.",
      "status": "done",
      "priority": "urgent",
      "dueDate": "2024-09-28T00:00:00.000Z",
      "assigneeEmail": "asha.k@worldvisa.in",
      "assigneeId": "164193000020539649",
      "createdByEmail": "asha.k@worldvisa.in",
      "createdByZohoId": "164193000020539649",
      "createdAt": "2024-09-28T05:08:17.000Z",
      "modifiedAt": "2024-09-29T10:14:00.000Z",
      "modifiedByEmail": "asha.k@worldvisa.in",
      "modifiedByZohoId": "164193000020539649",
      "completedAt": "2024-09-29T10:14:00.000Z"
    },
    {
      "externalId": "164193000053851999",
      "parentType": "contact",
      "parentZohoId": "164193000000822091",
      "title": "Follow up on visa fee payment confirmation",
      "description": null,
      "status": "todo",
      "priority": "medium",
      "dueDate": "2024-10-05T00:00:00.000Z",
      "assigneeEmail": "vikram.seth@worldvisa.in",
      "assigneeId": "164193000000213001",
      "createdByEmail": "asha.k@worldvisa.in",
      "createdByZohoId": "164193000020539649",
      "createdAt": "2024-10-01T08:30:00.000Z",
      "modifiedAt": "2024-10-01T08:30:00.000Z",
      "modifiedByEmail": null,
      "modifiedByZohoId": null,
      "completedAt": null
    }
  ],
  "total": 5420,
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

