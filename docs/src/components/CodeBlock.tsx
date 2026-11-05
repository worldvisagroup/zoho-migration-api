'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'json', title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <div className="relative my-4 rounded-xl border border-slate-800 bg-[#0b1120] overflow-hidden shadow-2xl">
      {title && (
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="ml-2 font-mono text-xs text-slate-400">{title}</span>
          </div>
          <span className="font-mono text-xs text-slate-500 uppercase">{language}</span>
        </div>
      )}
      <button
        onClick={handleCopy}
        aria-label="Copy code"
        className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-md border border-slate-700/60 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 backdrop-blur transition hover:border-slate-600 hover:bg-slate-700 hover:text-white"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-emerald-400">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5 text-slate-400" />
            <span>Copy</span>
          </>
        )}
      </button>
      <div className="overflow-x-auto p-4 text-xs font-mono leading-relaxed text-slate-200">
        <pre>{code}</pre>
      </div>
    </div>
  );
};

