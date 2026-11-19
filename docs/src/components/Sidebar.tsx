'use client';

import {
  BookOpen,
  Calendar,
  CheckSquare,
  CircleDot,
  FileText,
  Inbox,
  PhoneCall,
  UserCheck,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  isReady?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const sections: NavSection[] = [
    {
      title: 'Documentation Guide',
      items: [
        { name: 'Migration Architecture', href: '/', icon: BookOpen },
      ],
    },
    {
      title: 'CRM Migration APIs',
      items: [
        {
          name: 'Staff API',
          href: '/apis/staff',
          icon: Users,
          badge: 'Ready',
          badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          isReady: true,
        },
        {
          name: 'Clients (Leads & Contacts)',
          href: '/apis/clients',
          icon: UserCheck,
          badge: 'Ready',
          badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          isReady: true,
        },
        {
          name: 'Tasks',
          href: '/apis/tasks',
          icon: CheckSquare,
          badge: 'Ready',
          badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          isReady: true,
        },
        {
          name: 'Calls',
          href: '/apis/calls',
          icon: PhoneCall,
          badge: 'Ready',
          badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          isReady: true,
        },
        {
          name: 'Meetings / Events',
          href: '/apis/meetings',
          icon: Calendar,
          badge: 'Ready',
          badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          isReady: true,
        },
        {
          name: 'Notes',
          href: '/apis/notes',
          icon: FileText,
          badge: 'Ready',
          badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          isReady: true,
        },
        {
          name: 'Enquiries',
          href: '/apis/enquiries',
          icon: Inbox,
          badge: 'Ready',
          badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          isReady: true,
        },
      ],
    },
  ];

  return (
    <aside className="w-72 shrink-0 border-r border-slate-800/80 bg-[#0c1322] flex flex-col justify-between overflow-y-auto h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            <h3 className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {section.title}
            </h3>
            <div className="space-y-0.5">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={itemIdx}
                    href={item.href}
                    className={`group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${isActive
                        ? 'bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20 shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono border ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800/60 bg-slate-900/30">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <CircleDot className="h-3.5 w-3.5 text-emerald-400" />
            <span>Target Environment</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 leading-normal">
            NestJS 12 + MongoDB DAL migrating Zoho CRM & Books into standardized operational entities.
          </p>
        </div>
      </div>
    </aside>
  );
};

