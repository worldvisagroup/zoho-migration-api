'use client';

import React, { useEffect, useState } from 'react';
import { AlignLeft } from 'lucide-react';

interface TOCItem {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        if (!item) continue;
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveId(item.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  return (
    <div className="w-64 shrink-0 hidden xl:block sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pl-4">
      <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <AlignLeft className="h-3.5 w-3.5 text-slate-400" />
        <span>On This Page</span>
      </div>
      <nav className="space-y-1 border-l border-slate-800">
        {items.map(item => {
          const isActive = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block pl-3 py-1.5 text-xs transition-colors border-l -ml-[1px] ${
                isActive
                  ? 'border-sky-400 text-sky-400 font-medium'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              {item.title}
            </a>
          );
        })}
      </nav>
    </div>
  );
};

