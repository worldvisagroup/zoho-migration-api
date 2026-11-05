import React from 'react';
import Link from 'next/link';
import { Database, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0f172a]/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm tracking-wide">
                  Zoho Migration Engine
                </span>
                <span className="rounded bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-mono font-medium text-sky-400 border border-sky-500/20">
                  v1.0.0
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block -mt-0.5">
                Technical Extraction & Mapping Documentation
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">Base URI:</span>
            <code className="text-slate-200 font-mono">http://localhost:5050/api/v1</code>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="http://localhost:5050/api/docs"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/80 px-3 py-1.5 text-slate-200 transition hover:bg-slate-700 hover:text-white"
            >
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>Swagger UI</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

